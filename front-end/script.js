/**
 * Sadat's Anime Shelf - Main Script
 * Combined file for file:// protocol compatibility
 */

/* ==========================================================================
   CONFIG & CONSTANTS
   ========================================================================== */
const API_BASE_URL = 'http://localhost:3000/api/anime';

const CONFIG = {
    APP_NAME: "Sadat's Anime Shelf",
    VERSION: '2.0.0',
    THEME_KEY: 'anime-shelf-theme',
    MAX_IMAGE_SIZE: 5 * 1024 * 1024, // 5MB
    ANIMATION_DURATION: 300,
    NOTIFICATION_DURATION: 3000
};

const ANIME_STATUS = {
    WATCHING: 'watching',
    COMPLETED: 'completed',
    PLAN: 'plan'
};

/* ==========================================================================
   HELPER FUNCTIONS
   ========================================================================== */
function calculateProgress(watched, total) {
    if (!total || total <= 0) return 0;
    return Math.round((watched / total) * 100);
}

function formatGenres(genres) {
    if (!genres) return [];
    return genres.split(',').map(g => g.trim()).filter(g => g !== '');
}

function capitalize(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function smoothScrollTo(selector) {
    const element = document.querySelector(selector);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

/* ==========================================================================
   UI COMPONENTS (Notification, Modal, Theme)
   ========================================================================== */

// --- Notification System ---
const notificationBox = document.createElement('div');
notificationBox.id = 'notificationBox';
document.body.appendChild(notificationBox);

const loadingIndicator = document.createElement('div');
loadingIndicator.id = 'loadingIndicator';
loadingIndicator.innerHTML = '<div class="spinner"></div><span>Loading...</span>';
document.body.appendChild(loadingIndicator);

function showNotification(message, type = 'info', duration = CONFIG.NOTIFICATION_DURATION) {
    notificationBox.textContent = message;
    notificationBox.className = `notification-box ${type} show`;

    setTimeout(() => {
        notificationBox.classList.remove('show');
    }, duration);
}

function showLoading() {
    loadingIndicator.classList.add('show');
}

function hideLoading() {
    loadingIndicator.classList.remove('show');
}

function showConfirm(message, onConfirm) {
    const confirmModal = document.createElement('div');
    confirmModal.classList.add('modal', 'show');
    confirmModal.innerHTML = `
        <div class="modal-content">
            <span class="close-button" id="closeConfirmModal">&times;</span>
            <h2>Confirmation</h2>
            <p>${message}</p>
            <div style="display: flex; justify-content: center; gap: 15px; margin-top: 25px;">
                <button class="cta-button" id="confirmYes">Yes</button>
                <button class="cta-button" id="confirmNo" style="background: var(--glass-bg); color: var(--text-primary);">No</button>
            </div>
        </div>
    `;
    document.body.appendChild(confirmModal);
    document.body.style.overflow = 'hidden';

    const closeConfirmModal = confirmModal.querySelector('#closeConfirmModal');
    const confirmYes = confirmModal.querySelector('#confirmYes');
    const confirmNo = confirmModal.querySelector('#confirmNo');

    const closeAndRemoveModal = () => {
        confirmModal.classList.remove('show');
        document.body.style.overflow = '';
        setTimeout(() => confirmModal.remove(), 300);
    };

    closeConfirmModal.addEventListener('click', closeAndRemoveModal);
    confirmNo.addEventListener('click', closeAndRemoveModal);
    confirmYes.addEventListener('click', () => {
        onConfirm();
        closeAndRemoveModal();
    });

    confirmModal.addEventListener('click', (event) => {
        if (event.target === confirmModal) {
            closeAndRemoveModal();
        }
    });
}

// --- Modal System ---
function openModal(modal) {
    if (!modal) return;
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
}

function closeModal(modal) {
    if (!modal) return;
    modal.classList.remove('show');
    document.body.style.overflow = '';
}

function initializeAllModals() {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        const closeBtn = modal.querySelector('.close-button');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => closeModal(modal));
        }
        window.addEventListener('click', (event) => {
            if (event.target === modal) {
                closeModal(modal);
            }
        });
    });
}

// --- Theme System ---
const themeToggleBtn = document.getElementById('themeToggleBtn');

function setTheme(theme) {
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem(CONFIG.THEME_KEY, theme);

    if (themeToggleBtn) {
        const icon = themeToggleBtn.querySelector('i');
        if (theme === 'dark') {
            icon.classList.replace('fa-sun', 'fa-moon');
        } else {
            icon.classList.replace('fa-moon', 'fa-sun');
        }
    }
}

function toggleTheme() {
    const currentTheme = document.body.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
}

function initializeTheme() {
    const savedTheme = localStorage.getItem(CONFIG.THEME_KEY);
    if (savedTheme) {
        setTheme(savedTheme);
    } else {
        setTheme('dark');
    }

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', toggleTheme);
    }
}

/* ==========================================================================
   API SERVICE
   ========================================================================== */
const AnimeService = {
    async getAllAnime() {
        try {
            const response = await fetch(API_BASE_URL);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return await response.json();
        } catch (error) {
            console.error("Backend unreachable:", error);
            throw error;
        }
    },

    async getStats() {
        try {
            const response = await fetch(`${API_BASE_URL}/stats`);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return await response.json();
        } catch (error) {
            console.error("Failed to fetch stats:", error);
            return null; // Return null on error to handle gracefully
        }
    },

    // ... rest of service methods ...

    async createAnime(animeData) {
        // ... (keep as is) ...
        const response = await fetch(API_BASE_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(animeData)
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.details ? error.details.join(', ') : error.error);
        }
        return await response.json();
    },

    // ... (keep updateAnime and deleteAnime as is) ...
    async updateAnime(id, animeData) {
        const response = await fetch(`${API_BASE_URL}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(animeData)
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.details ? error.details.join(', ') : error.error);
        }
        return await response.json();
    },

    async deleteAnime(id) {
        const response = await fetch(`${API_BASE_URL}/${id}`, { method: 'DELETE' });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return await response.json();
    }
};

/* ==========================================================================
   MAIN LOGIC
   ========================================================================== */
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

document.addEventListener('DOMContentLoaded', async () => {
    // 1. Init Theme
    initializeTheme();

    // 2. Init Modals
    initializeAllModals();

    // 3. Init Navigation
    initializeNavigation();

    // 4. Mobile Menu
    if (mobileMenuBtn && navMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            navMenu.classList.toggle('show');
        });
    }

    // 5. Fetch & Render
    await fetchAndRenderAnime();

    // 6. Init Filters
    initializeFilters();

    // 6.5 Init View System
    initializeViewSystem();

    // 7. Init Add Anime
    if (addAnimeBtn) {
        addAnimeBtn.addEventListener('click', () => openModal(addAnimeModal));
    }
    if (addAnimeForm) {
        addAnimeForm.addEventListener('submit', handleAddAnime);
    }

    // 8. Progress Bars
    initializeProgressBarAnimations();

    // 9. Top 10 List Handlers
    initializeTop10List();

    // 10. Start Health Check
    checkBackendStatus();
    setInterval(checkBackendStatus, 30000); // Check every 30 seconds
});

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
        showNotification('Cannot connect to backend server. Is it running?', 'error');

        // Show error state in grid
        if (animeGrid) {
            animeGrid.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 2rem; background: var(--glass-bg); border-radius: var(--radius-lg); border: 1px solid var(--premium-coral);">
                    <i class="fas fa-exclamation-triangle" style="font-size: 3rem; color: var(--premium-coral); margin-bottom: 1.5rem;"></i>
                    <h3 style="margin-bottom: 1rem;">Connection Failed</h3>
                    <p style="color: var(--text-secondary); margin-bottom: 1.5rem;">Could not connect to the database. Please ensure the backend server is running.</p>
                    <button class="cta-button" onclick="window.location.reload()">
                        <i class="fas fa-sync-alt"></i> Retry
                    </button>
                </div>
            `;
        }
    } finally {
        hideLoading();
        fetchAndRenderStats(); // Update stats whenever anime list is refreshed
    }
}

function filterAndRenderAnime(filter) {
    const filteredAnime = filter === 'all'
        ? allAnimeData
        : allAnimeData.filter(anime => anime.status === filter);

    renderAnimeCards(filteredAnime);
}

function initializeViewSystem() {
    const viewBtns = document.querySelectorAll('.view-btn');
    const grid = document.getElementById('animeGrid');

    // Load preference
    const savedView = localStorage.getItem('animeShelfView') || 'grid';
    applyView(savedView);

    viewBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const view = btn.dataset.view;
            applyView(view);
            localStorage.setItem('animeShelfView', view);
        });
    });

    function applyView(view) {
        // Update Grid Class
        if (view === 'list') {
            grid.classList.add('list-view');
        } else {
            grid.classList.remove('list-view');
        }

        // Update Buttons
        viewBtns.forEach(btn => {
            if (btn.dataset.view === view) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }
}

async function fetchAndRenderStats() {
    // Calculate Favorites (Top 10 Items Count)
    // We count elements with class 'top-anime-item' which are always present in the HTML
    const favoritesCount = document.querySelectorAll('.top-anime-item').length;
    animateCounter('stat-favorites', favoritesCount);

    const stats = await AnimeService.getStats();
    if (!stats) return;

    animateCounter('stat-total', stats.total);
    animateCounter('stat-watching', stats.watching);
    animateCounter('stat-completed', stats.completed);
    animateCounter('stat-plan', stats.plan);
}

function animateCounter(elementId, target) {
    const element = document.getElementById(elementId);
    if (!element) return;

    // Start from 0 or current value
    const start = 0;
    const duration = 2000; // 2 seconds
    const startTime = performance.now();

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Easing function (easeOutExpo)
        const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);

        const current = Math.floor(start + (target - start) * ease);
        element.textContent = current;

        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            element.textContent = target; // Ensure exact final value
        }
    }

    requestAnimationFrame(update);
}

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

function createAnimeCard(anime, index) {
    const progress = calculateProgress(anime.watched, anime.episodes);
    const card = document.createElement('div');
    card.classList.add('anime-card', anime.status);
    card.style.animationDelay = `${index * 0.05}s`;

    // Ensure image has a fallback
    const imgUrl = (anime.image && anime.image.trim() !== '') ? anime.image : 'https://placehold.co/600x400/1a1a2e/4facfe?text=No+Image';

    card.innerHTML = `
        <div class="anime-img-container">
            <img src="${imgUrl}" alt="${anime.title}" class="anime-img" onerror="this.onerror=null; this.src='https://placehold.co/600x400/1a1a2e/4facfe?text=Image+Broken';">
            <div class="anime-status status-${anime.status}">${capitalize(anime.status)}</div>
        </div>
        <div class="anime-content">
            <h3 class="anime-title">${anime.title}</h3>
            <div class="anime-meta">
                <span>${anime.episodes} eps</span>
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

function openAnimeDetail(anime) {
    // If anime is from Top 10 list, it might be missing 'watched' and 'status'
    // Set defaults for display if missing
    const isTop10 = !anime.status;
    const watched = anime.watched || (anime.status === 'completed' ? anime.episodes : 0);
    const status = anime.status || 'completed'; // Default Top 10 to completed or generic
    const progress = calculateProgress(watched, anime.episodes);

    // Image fallback
    const imgUrl = (anime.image && anime.image.trim() !== '') ? anime.image : 'https://placehold.co/600x400/1a1a2e/4facfe?text=No+Image';

    animeDetailContent.innerHTML = `
        <div class="anime-detail-header">
            <img src="${imgUrl}" alt="${anime.title}" class="anime-detail-image" style="width: 100%; border-radius: var(--radius-md); margin-bottom: 1rem; max-height: 400px; object-fit: cover;" onerror="this.onerror=null; this.src='https://placehold.co/600x400/1a1a2e/4facfe?text=Image+Broken';">
            <div class="anime-detail-info">
                <h2 class="anime-detail-title">${anime.title}</h2>
                <div class="anime-meta" style="margin: 10px 0;">
                     ${anime.episodes ? `<span><i class="fas fa-play-circle"></i> ${anime.episodes} episodes</span>` : ''}
                     ${anime.seasons ? `<span> · ${anime.seasons} seasons</span>` : ''}
                     ${anime.imdbRating ? `<span> · ⭐ ${anime.imdbRating}</span>` : ''}
                </div>
                <p class="anime-meta">
                    ${anime.genres ? `<span><i class="fas fa-tags"></i> ${anime.genres}</span>` : ''}
                    <span class="anime-status status-${status}" style="margin-left: 10px;">${capitalize(status)}</span>
                </p>
                
                ${!isTop10 ? `
                <div class="progress-container">
                    <div class="progress-info">
                        <span>Ep ${watched}/${anime.episodes}</span>
                        <span>${progress}%</span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${progress}%;"></div>
                    </div>
                </div>` : ''}
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

    if (anime.id) {
        const editBtn = animeDetailContent.querySelector('.edit-anime-btn');
        const deleteBtn = animeDetailContent.querySelector('.delete-anime-btn');
        editBtn?.addEventListener('click', () => openEditAnimeModal(anime));
        deleteBtn?.addEventListener('click', () => handleDeleteAnime(anime.id, anime.title));
    }
}

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
        showNotification(error.message || 'Failed to add anime. Check if server is running.', 'error');
    } finally {
        hideLoading();
    }
}

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
        showNotification(error.message || 'Failed to update anime.', 'error');
    } finally {
        hideLoading();
    }
}

async function handleDeleteAnime(animeId, animeTitle) {
    showConfirm(`Are you sure you want to delete "${animeTitle}"?`, async () => {
        showLoading();
        try {
            await AnimeService.deleteAnime(animeId);
            showNotification('Anime deleted successfully!', 'success');
            closeModal(animeDetailModal);
            await fetchAndRenderAnime();
        } catch (error) {
            console.error('Error deleting anime:', error);
            showNotification('Failed to delete anime.', 'error');
        } finally {
            hideLoading();
        }
    });
}

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

function initializeNavigation() {
    navLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            // Only prevent default if it's an internal hash link
            const href = link.getAttribute('href');
            if (href.startsWith('#')) {
                event.preventDefault();
                navLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');

                let targetSelector = null;
                const linkText = link.textContent.toLowerCase();
                if (linkText === 'home') targetSelector = '.hero';
                else if (linkText.includes('list')) targetSelector = '#main-content';
                else if (linkText.includes('fav')) targetSelector = '#top-10-list';
                else if (linkText === 'about') targetSelector = '#footer';

                if (targetSelector) smoothScrollTo(targetSelector);
            }
        });
    });
}

function initializeProgressBarAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bar = entry.target;
                if (!bar.dataset.animated) {
                    const width = bar.style.width;
                    bar.style.width = '0%';
                    // Trigger reflow
                    void bar.offsetWidth;
                    bar.style.transition = 'width 1s ease-out';
                    bar.style.width = width;
                    bar.dataset.animated = 'true';
                    observer.unobserve(bar);
                }
            }
        });
    }, observerOptions);

    const progressBars = document.querySelectorAll('.progress-fill');
    progressBars.forEach(bar => observer.observe(bar));
}

/**
 * Check Backend Health
 */
async function checkBackendStatus() {
    const statusEl = document.getElementById('dbStatus');
    if (!statusEl) return;

    const dotEl = statusEl.querySelector('.status-dot');
    const textEl = statusEl.querySelector('.status-text');

    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        // Use localhost URL for local dev environment
        const response = await fetch('http://localhost:3000/health', {
            signal: controller.signal
        });
        clearTimeout(timeoutId);

        if (response.ok) {
            statusEl.className = 'status-indicator online';
            textEl.textContent = 'Connected';
            statusEl.title = 'Database Connected';
        } else {
            throw new Error('Health check failed');
        }
    } catch (error) {
        statusEl.className = 'status-indicator offline';
        textEl.textContent = 'Offline';
        statusEl.title = 'Cannot connect to backend server';
    }
}

function initializeTop10List() {
    const top10Items = document.querySelectorAll('.top-anime-item');
    top10Items.forEach(item => {
        item.addEventListener('click', () => {
            const anime = {
                title: item.dataset.title,
                image: item.dataset.image,
                // Ensure description is read correctly. Fallback to attribute if dataset fails
                description: item.dataset.description || item.getAttribute('data-description') || 'No synopsis available.',
                imdbRating: item.dataset.imdbRating,
                episodes: item.dataset.episodes,
                seasons: item.dataset.seasons,
                genres: item.dataset.genres,
                // These might be missing from dataset, so we handle them in openAnimeDetail
                status: 'completed',
                watched: parseInt(item.dataset.episodes) || 0
            };
            openAnimeDetail(anime);
        });
    });
}
