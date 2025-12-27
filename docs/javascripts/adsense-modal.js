/**
 * AdSense Modal Manager
 * Displays an ad modal every 5 minutes with a 5-second minimum display time
 */
(function() {
  'use strict';

  const MODAL_INTERVAL = 5 * 60 * 1000; // 5 minutes in milliseconds
  const MIN_DISPLAY_TIME = 5 * 1000; // 5 seconds in milliseconds

  let modalDisplayTime = 0;
  let canCloseModal = false;

  // Create modal HTML
  function createModal() {
    const modalHTML = `
      <div id="adsense-modal" class="adsense-modal" style="display: none;">
        <div class="adsense-modal-content">
          <div class="adsense-modal-header">
            <span class="adsense-modal-close" id="adsense-close-btn" title="Close">&times;</span>
          </div>
          <div class="adsense-modal-body">
            <div class="adsense-ad-placeholder">
              <!-- AdSense ad code will be inserted here -->
              <p style="text-align: center; padding: 40px 20px;">Advertisement</p>
            </div>
          </div>
          <div class="adsense-modal-footer">
            <span id="adsense-timer">Please wait <span id="adsense-countdown">5</span> seconds...</span>
          </div>
        </div>
      </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
  }

  // Show modal
  function showModal() {
    const modal = document.getElementById('adsense-modal');
    const closeBtn = document.getElementById('adsense-close-btn');
    const timerText = document.getElementById('adsense-timer');
    const countdown = document.getElementById('adsense-countdown');
    
    if (!modal) return;

    modal.style.display = 'flex';
    modalDisplayTime = Date.now();
    canCloseModal = false;
    
    // Disable close button initially
    closeBtn.style.opacity = '0.5';
    closeBtn.style.cursor = 'not-allowed';
    timerText.style.display = 'block';

    // Countdown timer
    let secondsLeft = 5;
    const countdownInterval = setInterval(() => {
      secondsLeft--;
      countdown.textContent = secondsLeft;
      
      if (secondsLeft <= 0) {
        clearInterval(countdownInterval);
        enableCloseButton();
      }
    }, 1000);

    // Also enable close button after minimum display time
    setTimeout(() => {
      enableCloseButton();
    }, MIN_DISPLAY_TIME);
  }

  // Enable close button
  function enableCloseButton() {
    const closeBtn = document.getElementById('adsense-close-btn');
    const timerText = document.getElementById('adsense-timer');
    
    canCloseModal = true;
    closeBtn.style.opacity = '1';
    closeBtn.style.cursor = 'pointer';
    timerText.style.display = 'none';
  }

  // Close modal
  function closeModal() {
    if (!canCloseModal) return;
    
    const modal = document.getElementById('adsense-modal');
    if (modal) {
      modal.style.display = 'none';
    }
  }

  // Initialize modal system
  function initAdModal() {
    // Create modal on page load
    createModal();

    // Set up close button handler
    const closeBtn = document.getElementById('adsense-close-btn');
    if (closeBtn) {
      closeBtn.addEventListener('click', closeModal);
    }

    // Close modal when clicking outside of it
    const modal = document.getElementById('adsense-modal');
    if (modal) {
      modal.addEventListener('click', function(event) {
        if (event.target === modal && canCloseModal) {
          closeModal();
        }
      });
    }

    // Show modal every 5 minutes
    setInterval(showModal, MODAL_INTERVAL);
    
    // Show first modal after 5 minutes
    setTimeout(showModal, MODAL_INTERVAL);
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAdModal);
  } else {
    initAdModal();
  }
})();
