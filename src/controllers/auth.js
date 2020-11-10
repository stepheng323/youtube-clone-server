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
  const { password } = req.body;
  const hashedPassword = await bcryptHash(password);
  const user = await User.create({ ...req.body, password: hashedPassword });
  user.password = undefined;
  return respondWithSuccess(res, 201, 'User Created Successfully', user);
});

export const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return respondWithWarning(res, 404, 'Email or password mismatch');
  const { firstName, lastName, password: hashedPassword } = user;
  const passwordMatch = await comparePassword(password, hashedPassword);
  if (!passwordMatch) return respondWithWarning(res, 404, 'Email or password mismatch');

  const tokenAndTokenExpiry = await signToken({ firstName, lastName, email });
  const refreshToken = await signRefreshToken({ firstName, lastName, email });
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
    const user = await User.findOne({ refreshToken: refToken });
    if (!user) return respondWithWarning(res, 404, 'refresh token not found');
    const { data } = verifyRefreshToken(user.refreshToken);
    if (data) {
      const token = await signToken(data);
      return respondWithSuccess(res, 200, 'token generated successfuly', {
        ...token,
        ...data,
      });
    }
  } catch (error) {
    if (error.message === 'JsonWebTokenError') return respondWithWarning(res, 401, 'invalid token');
    return respondWithWarning(res, 401, error.message);
  }
});
