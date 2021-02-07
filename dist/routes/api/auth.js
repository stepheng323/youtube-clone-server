"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = require("express");

var _auth = require("../../controllers/auth");

const auth = (0, _express.Router)();
auth.post('/signup', _auth.signUp);
auth.post('/login', _auth.login);
auth.post('/logout', _auth.logout);
auth.post('/token', _auth.getToken);
var _default = auth;
exports.default = _default;