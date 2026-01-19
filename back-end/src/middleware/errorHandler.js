/**
 * Global error handling middleware
 */

/**
 * Error handler middleware
 */
function errorHandler(err, req, res, next) {
    console.error('Error:', err);

    // Database errors
    if (err.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({
            error: 'Duplicate entry',
            message: 'An anime with this title already exists'
        });
    }

    if (err.code === 'ER_NO_REFERENCED_ROW') {
        return res.status(400).json({
            error: 'Invalid reference',
            message: 'Referenced data does not exist'
        });
    }

    // Validation errors
    if (err.name === 'ValidationError') {
        return res.status(400).json({
            error: 'Validation error',
            message: err.message
        });
    }

    // Default error response
    res.status(err.status || 500).json({
        error: err.message || 'Internal server error',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
}

/**
 * 404 Not Found handler
 */
function notFoundHandler(req, res) {
    res.status(404).json({
        error: 'Not found',
        message: `Route ${req.method} ${req.path} not found`
    });
}

module.exports = {
    errorHandler,
    notFoundHandler
};
