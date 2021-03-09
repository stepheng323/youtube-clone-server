import { verifyToken } from '../helper/jwt';
import { respondWithWarning } from '../helper/responseHandler';
import Channel from '../models/channel';

export const checkAuth = (req, res, next) => {
  let token = req.headers.authorization;
  if (token && token.startsWith('Bearer ')) {
    token = token.slice(7, token.length);
  }
  if (!token) {
    req.auth = '';
    return next();
  }
  try {
    const data = verifyToken(token);
    req.auth = data;

    return next();
  } catch (error) {
    if (error.message === 'JsonWebTokenError') return respondWithWarning(res, 401, 'invalid token');
    return respondWithWarning(res, 401, error.message);
  }
};

export const getUserChannel = async (req, res, next) => {
  try {
    const { id } = req.auth;
    if (!id) return respondWithWarning(res, 404, 'please login to continue');
    const channel = await Channel.findOne({ owner: id });
    if (!channel) return respondWithWarning(res, 404, 'no channel found');
    req.channel = channel;
    return next();
  } catch (error) {
    next(error);
  }
};
