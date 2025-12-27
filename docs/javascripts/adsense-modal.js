/**
 * AdSense Modal Manager
 * Displays an ad modal every 5 minutes with a 5-second minimum display time
 */
(function() {
  'use strict';

  const MODAL_INTERVAL = 5 * 60 * 1000; // 5 minutes in milliseconds
  const MIN_DISPLAY_TIME = 5 * 1000; // 5 seconds in milliseconds

  let canCloseModal = false;
  let countdownInterval = null;

  // Clear countdown interval
  function clearCountdown() {
    if (countdownInterval) {
      clearInterval(countdownInterval);
      countdownInterval = null;
    }
  }

  // Create modal HTML (only once)
  function createModal() {
    // Check if modal already exists
    if (document.getElementById('adsense-modal')) {
      return;
    }

    const modalHTML = `
      <div id="adsense-modal" class="adsense-modal">
        <div class="adsense-modal-content">
          <div class="adsense-modal-header">
            <span class="adsense-modal-close" id="adsense-close-btn" title="Close">&times;</span>
          </div>
          <div class="adsense-modal-body">
            <div class="adsense-ad-placeholder">
              <!-- AdSense ad code will be inserted here -->
              <p>Advertisement</p>
            </div>
          </div>
          <div class="adsense-modal-footer">
            <span id="adsense-timer">Please wait <span id="adsense-countdown">5</span> seconds...</span>
          </div>
        </div>
      </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);

    // Set up event listeners once after creating modal
    const closeBtn = document.getElementById('adsense-close-btn');
    if (closeBtn) {
      closeBtn.addEventListener('click', closeModal);
    }

    const modal = document.getElementById('adsense-modal');
    if (modal) {
      modal.addEventListener('click', function(event) {
        if (event.target === modal && canCloseModal) {
          closeModal();
        }
      });
    }
  }

  // Show modal
  function showModal() {
    const modal = document.getElementById('adsense-modal');
    const closeBtn = document.getElementById('adsense-close-btn');
    const timerText = document.getElementById('adsense-timer');
    const countdown = document.getElementById('adsense-countdown');
    
    if (!modal) return;

    // Clear any existing countdown interval
    clearCountdown();

    modal.classList.add('show');
    canCloseModal = false;
    
    // Disable close button initially
    closeBtn.classList.add('disabled');
    timerText.classList.add('visible');

    // Reset countdown display
    countdown.textContent = '5';

    // Countdown timer
    let secondsLeft = 5;
    countdownInterval = setInterval(() => {
      secondsLeft--;
      countdown.textContent = secondsLeft;
      
      if (secondsLeft <= 0) {
        clearCountdown();
        enableCloseButton();
      }
    }, 1000);
  }

  // Enable close button
  function enableCloseButton() {
    const closeBtn = document.getElementById('adsense-close-btn');
    const timerText = document.getElementById('adsense-timer');
    
    canCloseModal = true;
    closeBtn.classList.remove('disabled');
    timerText.classList.remove('visible');
  }

  // Close modal
  function closeModal() {
    if (!canCloseModal) return;
    
    // Clear countdown interval if still running
    clearCountdown();

    const modal = document.getElementById('adsense-modal');
    if (modal) {
      modal.classList.remove('show');
    }
  }

  // Initialize modal system
  function initAdModal() {
    // Create modal on page load
    createModal();

    // Show modal every 5 minutes, starting after the first 5 minutes
    setInterval(showModal, MODAL_INTERVAL);
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAdModal);
  } else {
    initAdModal();
  }
})();
