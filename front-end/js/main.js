// Main Application - Entry Point
import { initializeTheme } from './ui/theme.js';
import { initializeAllModals, openModal, closeModal } from './ui/modal.js';
import { showNotification, showLoading, hideLoading, showConfirm } from './ui/notification.js';
import { AnimeService } from './api/animeService.js';
import { calculateProgress, formatGenres, smoothScrollTo } from './utils/helpers.js';

// State
let allAnimeData = [];

// DOM Elements
const animeGrid = document.getElementById('animeGrid');
const filterButtons = document.querySelectorAll('.filter-btn');
const addAnimeBtn = document.getElementById('addAnimeBtn');
const addAnimeForm = document.getElementById('addAnimeForm');
const addAnimeModal = document.getElementById('addAnimeModal');
const animeDetailModal = document.getElementById('animeDetailModal');
const animeDetailContent = document.getElementById('animeDetailContent');
const navLinks = document.querySelectorAll('#navMenu a');
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const navMenu = document.getElementById('navMenu');

/**
 * Initialize Application
 */
document.addEventListener('DOMContentLoaded', async () => {
    // Initialize theme system
    initializeTheme();

    // Initialize modals
    initializeAllModals();

    // Initialize navigation
    initializeNavigation();

    // Initialize mobile menu
    if (mobileMenuBtn && navMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            navMenu.classList.toggle('show');
        });
    }

    // Initialize anime grid
    await fetchAndRenderAnime();

    // Initialize filter buttons
    initializeFilters();

    // Initialize add anime button
    addAnimeBtn?.addEventListener('click', () => openModal(addAnimeModal));

    // Initialize add anime form
    addAnimeForm?.addEventListener('submit', handleAddAnime);

    // Initialize progress bar animations
    initializeProgressBarAnimations();

    // Initialize top 10 list click handlers
    initializeTop10List();
});

/**
 * Fetch and render all anime
 */
async function fetchAndRenderAnime() {
    showLoading();
    try {
        const data = await AnimeService.getAllAnime();
        allAnimeData = data.map(anime => ({
            id: anime.id,
            title: anime.title,
            image: anime.image_url,
            episodes: anime.total_episodes,
            watched: anime.episodes_watched,
            status: anime.status,
            genres: anime.genres,
            description: anime.description
        }));

        const currentFilter = document.querySelector('.filter-btn.active')?.dataset.filter || 'all';
        filterAndRenderAnime(currentFilter);
    } catch (error) {
        console.error('Error fetching anime:', error);
        showNotification('Failed to load anime. Please try again later.', 'error');
    } finally {
        hideLoading();
    }
}

/**
 * Filter and render anime cards
 */
function filterAndRenderAnime(filter) {
    const filteredAnime = filter === 'all'
        ? allAnimeData
        : allAnimeData.filter(anime => anime.status === filter);

    renderAnimeCards(filteredAnime);
}

/**
 * Render anime cards to grid
 */
function renderAnimeCards(animeArray) {
    if (!animeGrid) return;

    animeGrid.innerHTML = '';

    if (animeArray.length === 0) {
        animeGrid.innerHTML = '<p style="text-align: center; color: var(--text-secondary); grid-column: 1 / -1;">No anime found.</p>';
        return;
    }

    animeArray.forEach((anime, index) => {
        const card = createAnimeCard(anime, index);
        animeGrid.appendChild(card);
    });
}

/**
 * Create anime card element
 */
function createAnimeCard(anime, index) {
    const progress = calculateProgress(anime.watched, anime.episodes);

    const card = document.createElement('div');
    card.classList.add('anime-card', anime.status);
    card.style.animationDelay = `${index * 0.05}s`;

    card.innerHTML = `
        <div class="anime-img-container">
            <img src="${anime.image || 'https://placehold.co/600x400/1a1a2e/4facfe?text=No+Image'}" alt="${anime.title}" class="anime-img">
            <div class="anime-status status-${anime.status}">${capitalize(anime.status)}</div>
        </div>
        <div class="anime-content">
            <h3 class="anime-title">${anime.title}</h3>
            <div class="anime-meta">
                <span>${anime.episodes} episodes</span>
                <span>${anime.genres || 'N/A'}</span>
            </div>
            <div class="progress-container">
                <div class="progress-info">
                    <span>Ep ${anime.watched}/${anime.episodes}</span>
                    <span>${progress}%</span>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${progress}%;"></div>
                </div>
            </div>
        </div>
    `;

    card.addEventListener('click', () => openAnimeDetail(anime));

    return card;
}

/**
 * Open anime detail modal
 */
function openAnimeDetail(anime) {
    const progress = calculateProgress(anime.watched, anime.episodes);

    animeDetailContent.innerHTML = `
        <div class="anime-detail-header">
            <img src="${anime.image || 'https://placehold.co/600x400/1a1a2e/4facfe?text=No+Image'}" alt="${anime.title}" class="anime-detail-image" style="width: 100%; border-radius: var(--radius-md); margin-bottom: 1rem;">
            <div class="anime-detail-info">
                <h2 class="anime-detail-title">${anime.title}</h2>
                <p class="anime-meta">
                    <span><i class="fas fa-play-circle"></i> ${anime.episodes} episodes</span>
                    ${anime.genres ? `<span><i class="fas fa-tags"></i> ${anime.genres}</span>` : ''}
                    ${anime.status ? `<span class="anime-status status-${anime.status}">${capitalize(anime.status)}</span>` : ''}
                </p>
                <div class="progress-container">
                    <div class="progress-info">
                        <span>Ep ${anime.watched}/${anime.episodes}</span>
                        <span>${progress}%</span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${progress}%;"></div>
                    </div>
                </div>
            </div>
        </div>
        <div class="anime-detail-description" style="margin-top: 1.5rem;">
            <h3>Synopsis</h3>
            <p>${anime.description || 'No description available.'}</p>
        </div>
        ${anime.id ? `
        <div class="anime-detail-actions" style="margin-top: 2rem; display: flex; gap: 1rem;">
            <button class="cta-button edit-anime-btn" data-id="${anime.id}">Edit Anime</button>
            <button class="cta-button delete-anime-btn" data-id="${anime.id}" style="background: var(--gradient-secondary);">Delete Anime</button>
        </div>
        ` : ''}
    `;

    openModal(animeDetailModal);

    // Add event listeners for edit and delete buttons
    const editBtn = animeDetailContent.querySelector('.edit-anime-btn');
    const deleteBtn = animeDetailContent.querySelector('.delete-anime-btn');

    editBtn?.addEventListener('click', () => openEditAnimeModal(anime));
    deleteBtn?.addEventListener('click', () => handleDeleteAnime(anime.id, anime.title));
}

/**
 * Open edit anime modal
 */
function openEditAnimeModal(anime) {
    animeDetailContent.innerHTML = `
        <h2>Edit Anime: ${anime.title}</h2>
        <form id="editAnimeForm">
            <div class="form-group">
                <label for="editAnimeTitle">Title:</label>
                <input type="text" id="editAnimeTitle" value="${anime.title}" required readonly>
            </div>
            <div class="form-group">
                <label for="editAnimeImage">Image URL:</label>
                <input type="url" id="editAnimeImage" value="${anime.image || ''}" placeholder="https://example.com/image.jpg">
            </div>
            <div class="form-group">
                <label for="editAnimeEpisodes">Total Episodes:</label>
                <input type="number" id="editAnimeEpisodes" min="1" value="${anime.episodes}" required>
            </div>
            <div class="form-group">
                <label for="editAnimeWatched">Episodes Watched:</label>
                <input type="number" id="editAnimeWatched" min="0" value="${anime.watched}" required>
            </div>
            <div class="form-group">
                <label for="editAnimeStatus">Status:</label>
                <select id="editAnimeStatus" required>
                    <option value="watching" ${anime.status === 'watching' ? 'selected' : ''}>Watching</option>
                    <option value="completed" ${anime.status === 'completed' ? 'selected' : ''}>Completed</option>
                    <option value="plan" ${anime.status === 'plan' ? 'selected' : ''}>Plan to Watch</option>
                </select>
            </div>
            <div class="form-group">
                <label for="editAnimeGenres">Genres (comma-separated):</label>
                <input type="text" id="editAnimeGenres" value="${anime.genres || ''}" placeholder="Action, Drama, Fantasy">
            </div>
            <div class="form-group">
                <label for="editAnimeDescription">Description:</label>
                <textarea id="editAnimeDescription" rows="5">${anime.description || ''}</textarea>
            </div>
            <button type="submit" class="cta-button">Save Changes</button>
            <button type="button" class="cta-button cancel-edit-btn" style="background: var(--glass-bg); color: var(--text-primary); margin-top: 1rem;">Cancel</button>
        </form>
    `;

    const editForm = document.getElementById('editAnimeForm');
    editForm.addEventListener('submit', (e) => handleEditAnime(e, anime.id));

    const cancelBtn = animeDetailContent.querySelector('.cancel-edit-btn');
    cancelBtn.addEventListener('click', () => openAnimeDetail(anime));
}

/**
 * Handle add anime form submission
 */
async function handleAddAnime(e) {
    e.preventDefault();

    const animeData = {
        title: document.getElementById('animeTitle').value,
        image_url: document.getElementById('animeImage').value,
        total_episodes: parseInt(document.getElementById('animeEpisodes').value),
        episodes_watched: parseInt(document.getElementById('animeWatched').value),
        status: document.getElementById('animeStatus').value,
        genres: document.getElementById('animeGenres').value,
        description: document.getElementById('animeDescription').value
    };

    showLoading();
    try {
        await AnimeService.createAnime(animeData);
        showNotification('Anime added successfully!', 'success');
        closeModal(addAnimeModal);
        addAnimeForm.reset();
        await fetchAndRenderAnime();
    } catch (error) {
        console.error('Error adding anime:', error);
        showNotification(error.message || 'Failed to add anime. Please try again.', 'error');
    } finally {
        hideLoading();
    }
}

/**
 * Handle edit anime form submission
 */
async function handleEditAnime(e, animeId) {
    e.preventDefault();

    const animeData = {
        title: document.getElementById('editAnimeTitle').value,
        image_url: document.getElementById('editAnimeImage').value,
        total_episodes: parseInt(document.getElementById('editAnimeEpisodes').value),
        episodes_watched: parseInt(document.getElementById('editAnimeWatched').value),
        status: document.getElementById('editAnimeStatus').value,
        genres: document.getElementById('editAnimeGenres').value,
        description: document.getElementById('editAnimeDescription').value
    };

    showLoading();
    try {
        await AnimeService.updateAnime(animeId, animeData);
        showNotification('Anime updated successfully!', 'success');
        closeModal(animeDetailModal);
        await fetchAndRenderAnime();
    } catch (error) {
        console.error('Error updating anime:', error);
        showNotification(error.message || 'Failed to update anime. Please try again.', 'error');
    } finally {
        hideLoading();
    }
}

/**
 * Handle delete anime
 */
async function handleDeleteAnime(animeId, animeTitle) {
    showConfirm(`Are you sure you want to delete "${animeTitle}"? This action cannot be undone.`, async () => {
        showLoading();
        try {
            await AnimeService.deleteAnime(animeId);
            showNotification('Anime deleted successfully!', 'success');
            closeModal(animeDetailModal);
            await fetchAndRenderAnime();
        } catch (error) {
            console.error('Error deleting anime:', error);
            showNotification('Failed to delete anime. Please try again.', 'error');
        } finally {
            hideLoading();
        }
    });
}

/**
 * Initialize filter buttons
 */
function initializeFilters() {
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            const filter = button.dataset.filter;
            filterAndRenderAnime(filter);
        });
    });
}

/**
 * Initialize navigation
 */
function initializeNavigation() {
    navLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();

            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');

            const linkText = link.textContent.toLowerCase();
            let targetSelector = null;

            if (linkText === 'home') targetSelector = '.hero';
            else if (linkText === 'my list') targetSelector = '#main-content';
            else if (linkText === 'my favorite') targetSelector = '#top-10-list';
            else if (linkText === 'about') targetSelector = '#footer';

            if (targetSelector) {
                smoothScrollTo(targetSelector);
            }
        });
    });
}

/**
 * Initialize progress bar animations on scroll
 */
function initializeProgressBarAnimations() {
    const animateProgressBars = () => {
        const progressBars = document.querySelectorAll('.progress-fill');

        progressBars.forEach(bar => {
            const rect = bar.getBoundingClientRect();
            const isVisible = rect.top < window.innerHeight && rect.bottom >= 0;

            if (isVisible && !bar.dataset.animated) {
                const width = bar.style.width;
                bar.style.width = '0%';
                setTimeout(() => {
                    bar.style.width = width;
                    bar.dataset.animated = 'true';
                }, 50);
            }
        });
    };

    animateProgressBars();
    window.addEventListener('scroll', animateProgressBars);
}

/**
 * Initialize top 10 list
 */
function initializeTop10List() {
    const top10Items = document.querySelectorAll('.top-anime-item');

    top10Items.forEach(item => {
        item.addEventListener('click', () => {
            const anime = {
                title: item.dataset.title,
                image: item.dataset.image,
                description: item.dataset.description,
                imdbRating: item.dataset.imdbRating,
                episodes: item.dataset.episodes,
                seasons: item.dataset.seasons,
                genres: item.dataset.genres
            };
            openAnimeDetail(anime);
        });
    });
}

/**
 * Capitalize first letter
 */
function capitalize(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
}
