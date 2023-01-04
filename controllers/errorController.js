const AppError = require('../utils/appError');

const sendDevError = (res, err) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    stack: err.stack,
    error: err,
  });
};

const handleValidationError = (err) => {
  const key = Object.keys(err.errors);
  const { message } = err.errors[key[0]];
  return new AppError(400, message);
};

const handleDuplicateKeyError = (err) => {
  const [key] = Object.keys(err.keyValue);
  return new AppError(
    400,
    `${key} already exists, try with a different ${key}`
  );
};

const sendProdError = (res, err) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    console.error('ERROR 💥', err);
    res.status(500).json({
      status: 'fail',
      message: 'Internal Server Error',
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendDevError(res, err);
  } else if (process.env.NODE_ENV === 'production') {
    let error = Object.assign(err);

    if (error.code === 11000) error = handleDuplicateKeyError(error);
    if (error.name === 'ValidationError') error = handleValidationError(error);

    sendProdError(res, error);
  }
};
