"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ATLAS_URL = exports.AWS_BASE_URL = exports.PORT = exports.DATABASE_URL = exports.AWS_SECRET_ACCESS_KEY = exports.AWS_KEY_ID = void 0;

var _dotenv = _interopRequireDefault(require("dotenv"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_dotenv.default.config();

const {
  AWS_SECRET_ACCESS_KEY,
  AWS_KEY_ID,
  DATABASE_URL,
  PORT,
  AWS_BASE_URL,
  ATLAS_URL
} = process.env;
exports.ATLAS_URL = ATLAS_URL;
exports.AWS_BASE_URL = AWS_BASE_URL;
exports.PORT = PORT;
exports.DATABASE_URL = DATABASE_URL;
exports.AWS_KEY_ID = AWS_KEY_ID;
exports.AWS_SECRET_ACCESS_KEY = AWS_SECRET_ACCESS_KEY;