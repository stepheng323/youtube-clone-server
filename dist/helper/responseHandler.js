"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.respondWithWarning = exports.respondWithSuccess = void 0;

/**
 *
 * @param {Object} res
 * @param {Number} statusCode
 * @param {String} message
 * @param {Object} payload
 * @returns {Object} null
 */
const respondWithSuccess = (res, statusCode = 200, message, payload = {}) => {
  res.status(statusCode).send({
    success: true,
    message,
    payload
  });
};
/**
 *
 * @param {Object} res
 * @param {Number} statusCode
 * @param {String} message
 * @param {Object} payload
 * @returns {Object} null
 */


exports.respondWithSuccess = respondWithSuccess;

const respondWithWarning = (res, statusCode = 500, message, payload = {}) => {
  res.status(statusCode).send({
    success: false,
    message,
    payload
  });
};

exports.respondWithWarning = respondWithWarning;