const express = require('express');
const router = express.Router();
const AnimeController = require('../controllers/animeController');
const { validateAnimeData, validateId } = require('../middleware/validator');

/**
 * Anime Routes
 */

// GET /api/anime/stats - Get anime statistics
router.get('/stats', AnimeController.getAnimeStats);

// GET /api/anime - Get all anime
router.get('/', AnimeController.getAllAnime);

// GET /api/anime/status/:status - Get anime by status
router.get('/status/:status', AnimeController.getAnimeByStatus);

// GET /api/anime/:id - Get anime by ID
router.get('/:id', validateId, AnimeController.getAnimeById);

// POST /api/anime - Create new anime
router.post('/', validateAnimeData, AnimeController.createAnime);

// PUT /api/anime/:id - Update anime
router.put('/:id', validateId, validateAnimeData, AnimeController.updateAnime);

// DELETE /api/anime/:id - Delete anime
router.delete('/:id', validateId, AnimeController.deleteAnime);

module.exports = router;
