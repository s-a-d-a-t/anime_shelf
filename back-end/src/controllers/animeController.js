const Anime = require('../models/Anime');

/**
 * Anime Controller - handles HTTP requests for anime operations
 */
class AnimeController {
    /**
     * Get all anime entries
     */
    static async getAllAnime(req, res, next) {
        try {
            const anime = await Anime.getAll();
            res.json(anime);
        } catch (error) {
            next(error);
        }
    }

    /**
     * Get anime by ID
     */
    static async getAnimeById(req, res, next) {
        try {
            const { id } = req.params;
            const anime = await Anime.getById(id);

            if (!anime) {
                return res.status(404).json({ error: 'Anime not found' });
            }

            res.json(anime);
        } catch (error) {
            next(error);
        }
    }

    /**
     * Create new anime entry
     */
    static async createAnime(req, res, next) {
        try {
            const animeData = req.body;
            const animeId = await Anime.create(animeData);

            res.status(201).json({
                id: animeId,
                message: 'Anime created successfully'
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Update anime entry
     */
    static async updateAnime(req, res, next) {
        try {
            const { id } = req.params;
            const animeData = req.body;

            const updated = await Anime.update(id, animeData);

            if (!updated) {
                return res.status(404).json({ error: 'Anime not found' });
            }

            res.json({ message: 'Anime updated successfully' });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Delete anime entry
     */
    static async deleteAnime(req, res, next) {
        try {
            const { id } = req.params;
            const deleted = await Anime.delete(id);

            if (!deleted) {
                return res.status(404).json({ error: 'Anime not found' });
            }

            res.json({ message: 'Anime deleted successfully' });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Get anime by status
     */
    static async getAnimeByStatus(req, res, next) {
        try {
            const { status } = req.params;
            const anime = await Anime.getByStatus(status);
            res.json(anime);
        } catch (error) {
            next(error);
        }
    }
    /**
     * Get anime statistics
     */
    static async getAnimeStats(req, res, next) {
        try {
            const stats = await Anime.getStats();
            res.json(stats);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = AnimeController;
