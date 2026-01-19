// Utility Helper Functions

/**
 * Calculate progress percentage
 * @param {number} watched - Episodes watched
 * @param {number} total - Total episodes
 * @returns {number} Progress percentage
 */
export function calculateProgress(watched, total) {
    if (!total || total <= 0) return 0;
    return Math.round((watched / total) * 100);
}

/**
 * Format genres string
 * @param {string} genres - Comma-separated genres
 * @returns {Array} Array of genre names
 */
export function formatGenres(genres) {
    if (!genres) return [];
    return genres.split(',').map(g => g.trim()).filter(g => g !== '');
}

/**
 * Debounce function
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in ms
 * @returns {Function} Debounced function
 */
export function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Smooth scroll to element
 * @param {string} selector - CSS selector
 */
export function smoothScrollTo(selector) {
    const element = document.querySelector(selector);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

/**
 * Validate image URL
 * @param {string} url - Image URL to validate
 * @returns {boolean} Whether URL is valid
 */
export function isValidImageUrl(url) {
    if (!url) return false;
    try {
        new URL(url);
        return /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(url);
    } catch {
        return false;
    }
}

/**
 * Truncate text
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated text
 */
export function truncateText(text, maxLength) {
    if (!text || text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
}
