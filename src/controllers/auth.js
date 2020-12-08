/* eslint-disable no-underscore-dangle */
import { catchAsync } from '../utils/catchAsync';
import { bcryptHash, comparePassword } from '../helper/bcrypt';
import User from '../models/user';

import {
  respondWithSuccess,
  respondWithWarning,
} from '../helper/responseHandler';
import { signRefreshToken, signToken, verifyRefreshToken } from '../helper/jwt';

export const signUp = catchAsync(async (req, res, next) => {
  const { password, email: submittedEmail } = req.body;
  const userExist = await User.findOne({ email: submittedEmail });
  if (userExist) return respondWithWarning(res, 409, 'Email already signed up, try login');
  const hashedPassword = await bcryptHash(password);
  const user = await User.create({ ...req.body, password: hashedPassword, channel: null });
  const {
    firstName, lastName, _id: id, email,
  } = user;

  const tokenAndTokenExpiry = await signToken({
    firstName, lastName, email, id,
  });
  const refreshToken = await signRefreshToken({
    firstName, lastName, email, id,
  });

  user.refreshToken = refreshToken;
  await user.save();

  user.password = undefined;
  res.cookie('refToken', refreshToken, {
    maxAge: 604800000,
    httpOnly: true,
  });
  const { _doc: userData } = user;
  return respondWithSuccess(res, 201, 'User Created Successfully', {
    ...userData, ...tokenAndTokenExpiry, refreshToken,
  });
});

export const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).populate('channel');
  if (!user) return respondWithWarning(res, 404, 'Email or password mismatch');
  const {
    firstName, lastName, password: hashedPassword, _id: id, channel, avatar,
  } = user;
  const passwordMatch = await comparePassword(password, hashedPassword);
  if (!passwordMatch) return respondWithWarning(res, 404, 'Email or password mismatch');

  const tokenAndTokenExpiry = await signToken({
    firstName, lastName, email, id,
  });
  const refreshToken = await signRefreshToken({
    firstName, lastName, email, id,
  });
  user.refreshToken = refreshToken;
  await user.save();

  res.cookie('refToken', refreshToken, {
    maxAge: 604800000,
    httpOnly: true,
  });
  return respondWithSuccess(res, 200, 'login successful', {
    firstName,
    lastName,
    email,
    channel,
    avatar,
    ...tokenAndTokenExpiry,
    refreshToken,
  });
});

export const logout = catchAsync(async (req, res, next) => {
  res.clearCookie('refToken', {
    maxAge: 604800000,
    httpOnly: true,
  });
  return respondWithSuccess(res, 200, 'logout successfully');
});

export const getToken = catchAsync(async (req, res, next) => {
  const { refToken } = req.cookies;
  try {
    const user = await User.findOne({ refreshToken: refToken }).populate('channel');
    if (!user) return respondWithWarning(res, 404, 'refresh token not found');
    const { channel, avatar } = user;
    const data = verifyRefreshToken(user.refreshToken);
    if (data) {
      const {
        firstName, lastName, email, id,
      } = data;
      const tokenAndTokenExpiry = await signToken({
        firstName, lastName, email, id,
      });
      return respondWithSuccess(res, 200, 'token generated successfuly', {
        ...tokenAndTokenExpiry,
        ...data,
        channel,
        avatar,

      });
    }
  } catch (error) {
    if (error.message === 'JsonWebTokenError') return respondWithWarning(res, 401, 'invalid token');
    return respondWithWarning(res, 401, error.message);
  }
});
