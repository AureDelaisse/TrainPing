export const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  // Prisma error handling
  if (err.code === 'P2002') {
    return res.status(409).json({
      error: 'Duplicate value',
      message: 'A record with this value already exists'
    });
  }

  if (err.code === 'P2025') {
    return res.status(404).json({
      error: 'Not found',
      message: 'The requested record was not found'
    });
  }

  // Default error
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};