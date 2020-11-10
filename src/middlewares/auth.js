import { verifyToken } from '../helper/jwt';
import { respondWithWarning } from '../helper/responseHandler';

export const checkAuth = (req, res, next) => {
  let token = req.headers.authorization;
  if (token && token.startsWith('Bearer ')) {
    token = token.slice(7, token.length);
  }
  if (!token) {
    return respondWithWarning(res, 401, 'no token provided');
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

export const newt = () => {

}
