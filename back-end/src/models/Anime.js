const { pool } = require('../config/database');

/**
 * Anime Model - handles all database operations for anime entries
 */
class Anime {
    /**
     * Get all anime entries
     * @returns {Promise<Array>} Array of anime objects
     */
    static async getAll() {
        const [rows] = await pool.query('SELECT * FROM anime ORDER BY created_at DESC');
        return rows;
    }

    /**
     * Get anime by ID
     * @param {number} id - Anime ID
     * @returns {Promise<Object|null>} Anime object or null
     */
    static async getById(id) {
        const [rows] = await pool.query('SELECT * FROM anime WHERE id = ?', [id]);
        return rows[0] || null;
    }

    /**
     * Create new anime entry
     * @param {Object} animeData - Anime data
     * @returns {Promise<number>} Inserted anime ID
     */
    static async create(animeData) {
        const { title, image_url, total_episodes, episodes_watched, status, genres, description } = animeData;

        const [result] = await pool.query(
            'INSERT INTO anime (title, image_url, total_episodes, episodes_watched, status, genres, description) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [title, image_url, total_episodes, episodes_watched, status, genres, description]
        );

        return result.insertId;
    }

    /**
     * Update anime entry
     * @param {number} id - Anime ID
     * @param {Object} animeData - Updated anime data
     * @returns {Promise<boolean>} Success status
     */
    static async update(id, animeData) {
        const { title, image_url, total_episodes, episodes_watched, status, genres, description } = animeData;

        const [result] = await pool.query(
            'UPDATE anime SET title=?, image_url=?, total_episodes=?, episodes_watched=?, status=?, genres=?, description=? WHERE id=?',
            [title, image_url, total_episodes, episodes_watched, status, genres, description, id]
        );

        return result.affectedRows > 0;
    }

    /**
     * Delete anime entry
     * @param {number} id - Anime ID
     * @returns {Promise<boolean>} Success status
     */
    static async delete(id) {
        const [result] = await pool.query('DELETE FROM anime WHERE id=?', [id]);
        return result.affectedRows > 0;
    }

    /**
     * Get anime by status
     * @param {string} status - Status filter (watching, completed, plan)
     * @returns {Promise<Array>} Array of anime objects
     */
    static async getByStatus(status) {
        const [rows] = await pool.query('SELECT * FROM anime WHERE status = ? ORDER BY created_at DESC', [status]);
        return rows;
    }
    /**
     * Get anime statistics
     * @returns {Promise<Object>} Object containing counts
     */
    static async getStats() {
        const [totalRows] = await pool.query('SELECT COUNT(*) as count FROM anime');
        const [watchingRows] = await pool.query('SELECT COUNT(*) as count FROM anime WHERE status = "watching"');
        const [completedRows] = await pool.query('SELECT COUNT(*) as count FROM anime WHERE status = "completed"');
        const [planRows] = await pool.query('SELECT COUNT(*) as count FROM anime WHERE status = "plan"');

        return {
            total: totalRows[0].count,
            watching: watchingRows[0].count,
            completed: completedRows[0].count,
            plan: planRows[0].count
        };
    }
}

module.exports = Anime;
