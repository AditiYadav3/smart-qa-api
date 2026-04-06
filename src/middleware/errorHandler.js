function errorHandler(err, req, res, next) {
  const status = err.status || 500;
  const message =
    status >= 500 && process.env.NODE_ENV === 'production'
      ? 'Internal server error'
      : err.message || 'Internal server error';

  console.error(JSON.stringify({
    level: 'error',
    event: 'unhandled_error',
    message: err.message,
    stack: err.stack,
    timestamp: new Date().toISOString(),
  }));

  res.status(status).json({ message });
}

module.exports = errorHandler;
