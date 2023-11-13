/* eslint-disable import/extensions */
/* eslint-disable import/no-import-module-exports */
import AppError from './AppError.js';

function sendDevError(err, res) {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    stack: err.stack,
    error: err,
  });
}

const sendProdError = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong',
    });
  }
};

const handleValidationError = (error) => {
  const statusCode = 400;

  const message = Object.values(error.errors)
    .map((el) => el.message)
    .join(', ');

  return new AppError(message, statusCode);
};

const handleCastError = (error) => {
  const statusCode = 400;
  const message = `Invalid Id ${error.value}`;

  return new AppError(message, statusCode);
};

const handleDuplicateKeyError = (error) => {
  const statusCode = 409;
  const message = `${Object.values(error.keyValue)} already exist`;

  return new AppError(message, statusCode);
};

export default async (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    return sendDevError(err, res);
  }
  if (process.env.NODE_ENV === 'production') {
    let error = Object.create(
      Object.getPrototypeOf(err),
      Object.getOwnPropertyDescriptors(err),
    );

    if (error.name === 'ValidationError') error = handleValidationError(error);

    if (error.name === 'CastError') error = handleCastError(error);

    if (error.code === 11000) error = handleDuplicateKeyError(error);

    sendProdError(error, res);
  }
};
