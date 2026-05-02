const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  const status = err.statusCode || 500;
  const isDev = process.env.NODE_ENV === 'development';
  
  res.status(status).json({
    success: false,
    message: isDev ? err.message : 'Internal Server Error',
    ...(isDev && { stack: err.stack })
  });
};

module.exports = errorHandler;
