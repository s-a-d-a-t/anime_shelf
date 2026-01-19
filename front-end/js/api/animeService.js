// API Service - All HTTP requests to the backend
import { API_BASE_URL } from '../config.js';

/**
 * Anime Service - Handles all API operations
 */
export class AnimeService {
    /**
     * Get all anime from the backend
     */
    static async getAllAnime() {
        const response = await fetch(API_BASE_URL);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    }

    /**
     * Get anime by ID
     */
    static async getAnimeById(id) {
        const response = await fetch(`${API_BASE_URL}/${id}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    }

    /**
     * Create new anime
     */
    static async createAnime(animeData) {
        const response = await fetch(API_BASE_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(animeData)
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.details ? error.details.join(', ') : error.error);
        }

        return await response.json();
    }

    /**
     * Update existing anime
     */
    static async updateAnime(id, animeData) {
        const response = await fetch(`${API_BASE_URL}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(animeData)
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.details ? error.details.join(', ') : error.error);
        }

        return await response.json();
    }

    /**
     * Delete anime
     */
    static async deleteAnime(id) {
        const response = await fetch(`${API_BASE_URL}/${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    }

    /**
     * Get anime by status
     */
    static async getAnimeByStatus(status) {
        const response = await fetch(`${API_BASE_URL}/status/${status}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    }
}
