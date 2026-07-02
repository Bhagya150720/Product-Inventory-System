const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message;
  let errors = {};

  // Mongoose validation errors
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation Error';
    Object.keys(err.errors).forEach((key) => {
      errors[key] = err.errors[key].message;
    });
  }

  // MongoDB duplicate key error (e.g., name unique index violation)
  if (err.code === 11000) {
    statusCode = 400;
    message = 'Duplicate Field Value Entered';
    const key = Object.keys(err.keyValue)[0];
    errors[key] = `A product with this ${key} already exists.`;
  }

  // Mongoose CastError (e.g., invalid ObjectId structure)
  if (err.name === 'CastError') {
    statusCode = 400;
    message = `Invalid value for path: ${err.path}`;
    errors[err.path] = `Invalid ID format for ${err.path}`;
  }

  res.status(statusCode).json({
    success: false,
    message,
    errors: Object.keys(errors).length > 0 ? errors : undefined,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

export default errorHandler;
