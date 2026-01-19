// Theme Management - Dark/Light Mode Toggle
import { CONFIG } from '../config.js';

const themeToggleBtn = document.getElementById('themeToggleBtn');
const body = document.body;

/**
 * Set theme
 * @param {string} theme - 'light' or 'dark'
 */
export function setTheme(theme) {
    body.setAttribute('data-theme', theme);
    localStorage.setItem(CONFIG.THEME_KEY, theme);

    // Update theme toggle icon
    if (themeToggleBtn) {
        const icon = themeToggleBtn.querySelector('i');
        if (theme === 'dark') {
            icon.classList.replace('fa-sun', 'fa-moon');
        } else {
            icon.classList.replace('fa-moon', 'fa-sun');
        }
    }
}

/**
 * Toggle between light and dark theme
 */
export function toggleTheme() {
    const currentTheme = body.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
}

/**
 * Initialize theme system
 */
export function initializeTheme() {
    // Check for saved theme preference
    const savedTheme = localStorage.getItem(CONFIG.THEME_KEY);
    if (savedTheme) {
        setTheme(savedTheme);
    } else {
        // Default to dark theme
        setTheme('dark');
    }

    // Add event listener to theme toggle button
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', toggleTheme);
    }
}
