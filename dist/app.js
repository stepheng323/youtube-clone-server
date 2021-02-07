"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = _interopRequireDefault(require("express"));

var _morgan = _interopRequireDefault(require("morgan"));

var _mongoose = _interopRequireDefault(require("mongoose"));

var _helmet = _interopRequireDefault(require("helmet"));

var _cookieParser = _interopRequireDefault(require("cookie-parser"));

var _cors = _interopRequireDefault(require("cors"));

var _dotenv = _interopRequireDefault(require("dotenv"));

var _routes = _interopRequireDefault(require("./routes"));

var _responseHandler = require("./helper/responseHandler");

var _constants = require("./config/constants");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-disable no-console */
_dotenv.default.config();

_mongoose.default.connect(_constants.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
}).then(() => console.log('Database connection established'));

const whitelist = ['http://localhost:3000', 'http://localhost:4000'];
const corsOptions = {
  origin(origin, callback) {
    if (whitelist.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(' Not allowed by CORS'));
    }
  },

  credentials: true
};
const app = (0, _express.default)();
app.use('/uploads', _express.default.static('./uploads'));
app.use((0, _helmet.default)());
app.use((0, _cookieParser.default)());
app.use((0, _cors.default)(corsOptions));
app.use(_express.default.json());
app.use(_express.default.urlencoded({
  extended: true
}));
app.use((0, _morgan.default)('dev'));
app.use(_routes.default);
app.use('*', (req, res, next) => {
  const error = new Error('Not found');
  error.status = 404;
  next(error);
});

if (process.env.NODE_ENV === 'development') {
  app.use((error, req, res, next) => {
    (0, _responseHandler.respondWithWarning)(res, error.status || 500, error.message, error);
  });
} else {
  app.use((error, req, res, next) => {
    (0, _responseHandler.respondWithWarning)(res, error.status || 500, error.message);
  });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server initialised and listening on port ${PORT}`));
var _default = app;
exports.default = _default;