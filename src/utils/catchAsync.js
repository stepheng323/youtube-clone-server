/* eslint-disable import/prefer-default-export */
export const catchAsync = (func) => (req, res, next) => {
  func(req, res, next).catch(next);
};
