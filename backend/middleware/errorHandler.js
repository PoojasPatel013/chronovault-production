// backend/middleware/errorHandler.js
import httpErrors from 'http-errors';
const { createError } = httpErrors;

const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Handle validation errors
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: Object.values(err.errors).map(e => ({
        field: e.path,
        message: e.message
      })),
      details: process.env.NODE_ENV === 'development' ? err : undefined
    });
  }

  // Handle duplicate key errors
  if (err.code === 11000) {
    return res.status(400).json({
      success: false,
      message: 'Duplicate entry',
      error: err.keyValue,
      details: process.env.NODE_ENV === 'development' ? err : undefined
    });
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Invalid token',
      error: err.message,
      details: process.env.NODE_ENV === 'development' ? err : undefined
    });
  }

  // Handle unauthorized errors
  if (err.status === 401 || err.name === 'UnauthorizedError') {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized',
      error: err.message,
      details: process.env.NODE_ENV === 'development' ? err : undefined
    });
  }

  // Handle not found errors
  if (err.status === 404) {
    return res.status(404).json({
      success: false,
      message: 'Not found',
      error: err.message,
      details: process.env.NODE_ENV === 'development' ? err : undefined
    });
  }

  // Handle custom errors
  if (err instanceof Error && err.status) {
    return res.status(err.status).json({
      success: false,
      message: err.message,
      error: process.env.NODE_ENV === 'development' ? err : undefined
    });
  }

  // Default error handler
  return res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? {
      message: err.message,
      stack: err.stack
    } : undefined
  });
};

export default errorHandler;
