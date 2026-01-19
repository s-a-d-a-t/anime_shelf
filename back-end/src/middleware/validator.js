/**
 * Validation middleware for anime requests
 */

/**
 * Validate anime data for create/update operations
 */
function validateAnimeData(req, res, next) {
    const { title, total_episodes, episodes_watched, status } = req.body;
    const errors = [];

    // Title validation
    if (!title || typeof title !== 'string' || title.trim().length === 0) {
        errors.push('Title is required and must be a non-empty string');
    }

    // Total episodes validation
    if (total_episodes !== undefined) {
        const totalEp = parseInt(total_episodes);
        if (isNaN(totalEp) || totalEp < 1) {
            errors.push('Total episodes must be a positive number');
        }
    }

    // Episodes watched validation
    if (episodes_watched !== undefined) {
        const watchedEp = parseInt(episodes_watched);
        if (isNaN(watchedEp) || watchedEp < 0) {
            errors.push('Episodes watched must be a non-negative number');
        }

        // Validate watched <= total
        if (total_episodes && watchedEp > parseInt(total_episodes)) {
            errors.push('Episodes watched cannot exceed total episodes');
        }
    }

    // Status validation
    if (status) {
        const validStatuses = ['watching', 'completed', 'plan'];
        if (!validStatuses.includes(status)) {
            errors.push(`Status must be one of: ${validStatuses.join(', ')}`);
        }
    }

    // Return errors if any
    if (errors.length > 0) {
        return res.status(400).json({
            error: 'Validation failed',
            details: errors
        });
    }

    next();
}

/**
 * Validate ID parameter
 */
function validateId(req, res, next) {
    const { id } = req.params;
    const numId = parseInt(id);

    if (isNaN(numId) || numId < 1) {
        return res.status(400).json({
            error: 'Invalid ID parameter'
        });
    }

    next();
}

module.exports = {
    validateAnimeData,
    validateId
};
