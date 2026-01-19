// Modal Management System
import { CONFIG } from '../config.js';

/**
 * Open a modal
 * @param {HTMLElement} modal - Modal element to open
 */
export function openModal(modal) {
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
}

/**
 * Close a modal
 * @param {HTMLElement} modal - Modal element to close
 */
export function closeModal(modal) {
    modal.classList.remove('show');
    document.body.style.overflow = '';
}

/**
 * Initialize modal event listeners
 * @param {string} modalId - ID of the modal
 * @param {string} openButtonId - ID of button to open modal
 * @param {string} closeButtonId - ID of button to close modal
 */
export function initializeModal(modalId, openButtonId, closeButtonId) {
    const modal = document.getElementById(modalId);
    const openBtn = document.getElementById(openButtonId);
    const closeBtn = document.getElementById(closeButtonId);

    if (openBtn) {
        openBtn.addEventListener('click', () => openModal(modal));
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', () => closeModal(modal));
    }

    // Close on outside click
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            closeModal(modal);
        }
    });

    return { modal, openModal: () => openModal(modal), closeModal: () => closeModal(modal) };
}

/**
 * Initialize all modals in the app
 */
export function initializeAllModals() {
    const modals = document.querySelectorAll('.modal');

    modals.forEach(modal => {
        const closeBtn = modal.querySelector('.close-button');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => closeModal(modal));
        }

        // Close on outside click
        modal.addEventListener('click', (event) => {
            if (event.target === modal) {
                closeModal(modal);
            }
        });
    });
}
