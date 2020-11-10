/* eslint-disable import/prefer-default-export */
import { respondWithWarning } from '../helper/responseHandler';

export const restricTo = (...roles) => (req, res, next) => {
  const { role } = req.user;
  if (!roles.includes(role)) {
    return respondWithWarning(
      res,
      403,
      'You do not have permission to perform this action',
    );
  }
  next();
};
