/**
 *
 * @param {Object} res
 * @param {Number} statusCode
 * @param {String} message
 * @param {Object} payload
 * @returns {Object} null
 */

export const respondWithSuccess = (res, statusCode = 200, message, payload = {}) => {
  res.status(statusCode).send({ success: true, message, payload });
};

/**
 *
 * @param {Object} res
 * @param {Number} statusCode
 * @param {String} message
 * @param {Object} payload
 * @returns {Object} null
 */
export const respondWithWarning = (res, statusCode = 500, message, payload = {}) => {
  res.status(statusCode).send({ success: false, message, payload });
};
