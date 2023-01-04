const jwt = require('jsonwebtoken');
const { promisify } = require('util');

exports.generateToken = (id, expiry) =>
  promisify(jwt.sign)({ id }, process.env.JWT_SECRET, {
    expiresIn: expiry,
  });

exports.verifyToken = (token) =>
  promisify(jwt.verify)(token, process.env.JWT_SECRET);
