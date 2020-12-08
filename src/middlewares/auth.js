import { verifyToken } from '../helper/jwt';
import { respondWithWarning } from '../helper/responseHandler';

// eslint-disable-next-line import/prefer-default-export
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
