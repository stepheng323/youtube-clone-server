"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.uploadvideo = exports.uploadimage = void 0;

var _multer = _interopRequireDefault(require("multer"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const storage = _multer.default.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads');
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString() + file.originalname);
  }
});

const videoFilter = (req, file, cb) => {
  if (file.mimetype === 'video/mp4') {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const imageFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpg') {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const uploadvideo = (0, _multer.default)({
  storage,
  limits: {
    fileSize: 1024 * 1024 * 20
  },
  videoFilter
});
exports.uploadvideo = uploadvideo;
const uploadimage = (0, _multer.default)({
  storage,
  limits: {
    fileSize: 1024 * 1024 * 2
  },
  imageFilter
});
exports.uploadimage = uploadimage;