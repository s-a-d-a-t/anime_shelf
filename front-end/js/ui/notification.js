// Notification System - Toast notifications and loading indicators
import { CONFIG } from '../config.js';

// Create notification box element
const notificationBox = document.createElement('div');
notificationBox.id = 'notificationBox';
document.body.appendChild(notificationBox);

// Create loading indicator
const loadingIndicator = document.createElement('div');
loadingIndicator.id = 'loadingIndicator';
loadingIndicator.innerHTML = '<div class="spinner"></div><span>Loading...</span>';
document.body.appendChild(loadingIndicator);

/**
 * Show notification/toast message
 * @param {string} message - Message to display
 * @param {string} type - Type of notification (info, success, error, warning)
 * @param {number} duration - Duration to display in ms
 * @param {function} callback - Optional callback after notification closes
 */
export function showNotification(message, type = 'info', duration = CONFIG.NOTIFICATION_DURATION, callback = null) {
    notificationBox.textContent = message;
    notificationBox.className = `notification-box ${type} show`;

    setTimeout(() => {
        notificationBox.classList.remove('show');
        if (callback) callback();
    }, duration);
}

/**
 * Show loading indicator
 */
export function showLoading() {
    loadingIndicator.classList.add('show');
}

/**
 * Hide loading indicator
 */
export function hideLoading() {
    loadingIndicator.classList.remove('show');
}

/**
 * Show custom confirmation dialog
 * @param {string} message - Confirmation message
 * @param {function} onConfirm - Callback when user confirms
 */
export function showConfirm(message, onConfirm) {
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
