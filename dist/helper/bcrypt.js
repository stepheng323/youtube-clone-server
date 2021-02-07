"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.comparePassword = exports.bcryptHash = void 0;

var _bcrypt = _interopRequireDefault(require("bcrypt"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const bcryptHash = async plainPassword => {
  const hashedPassword = await _bcrypt.default.hash(plainPassword, +process.env.SALT_ROUND);
  return hashedPassword;
};

exports.bcryptHash = bcryptHash;

const comparePassword = async (plainPassword, hash) => _bcrypt.default.compare(plainPassword, hash);

exports.comparePassword = comparePassword;