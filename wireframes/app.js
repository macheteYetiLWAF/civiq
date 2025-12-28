// CIVIQ Wireframe Interactivity

document.addEventListener('DOMContentLoaded', function() {

  // ===== POLITICAL GRADIENT RANDOMIZER =====
  // 50/50 chance: red-to-blue or blue-to-red
  const isFlipped = Math.random() < 0.5;

  document.querySelectorAll('.logo-gradient, .btn-gradient').forEach(el => {
    if (isFlipped) {
      el.classList.add('flipped');
    }
  });

  console.log('Gradient direction:', isFlipped ? 'Blue → Red' : 'Red → Blue');

  // ===== ACCORDION FUNCTIONALITY =====
  document.querySelectorAll('.accordion-header').forEach(header => {
    header.addEventListener('click', function() {
      const accordion = this.parentElement;
      const content = accordion.querySelector('.accordion-content');
      const chevron = this.querySelector('.accordion-chevron');

      // Toggle open state
      accordion.classList.toggle('open');

      // Animate content
      if (accordion.classList.contains('open')) {
        content.style.display = 'block';
        content.style.maxHeight = content.scrollHeight + 'px';
        content.style.opacity = '1';
        if (chevron) chevron.textContent = '^';
      } else {
        content.style.maxHeight = '0';
        content.style.opacity = '0';
        setTimeout(() => {
          if (!accordion.classList.contains('open')) {
            content.style.display = 'none';
          }
        }, 200);
        if (chevron) chevron.textContent = 'v';
      }
    });
  });

  // Initialize accordion content styles
  document.querySelectorAll('.accordion-content').forEach(content => {
    content.style.transition = 'max-height 0.2s ease, opacity 0.2s ease';
    content.style.overflow = 'hidden';

    if (content.parentElement.classList.contains('open')) {
      content.style.display = 'block';
      content.style.maxHeight = content.scrollHeight + 'px';
      content.style.opacity = '1';
    } else {
      content.style.display = 'none';
      content.style.maxHeight = '0';
      content.style.opacity = '0';
    }
  });

  // ===== TOGGLE SWITCH FUNCTIONALITY =====
  document.querySelectorAll('.toggle-container').forEach(container => {
    const options = container.querySelectorAll('.toggle-option');

    options.forEach(option => {
      option.addEventListener('click', function() {
        // Remove active from all
        options.forEach(opt => opt.classList.remove('active'));
        // Add active to clicked
        this.classList.add('active');

        // Add haptic feedback simulation
        this.style.transform = 'scale(0.98)';
        setTimeout(() => {
          this.style.transform = 'scale(1)';
        }, 100);

        // Fire custom event for page-specific handling
        const event = new CustomEvent('toggle-change', {
          detail: { value: this.textContent.trim() }
        });
        container.dispatchEvent(event);
      });
    });
  });

  // ===== FILTER CHIP FUNCTIONALITY =====
  document.querySelectorAll('.btn-outline, .btn-secondary').forEach(btn => {
    if (btn.closest('[style*="overflow-x"]')) { // Filter row
      btn.addEventListener('click', function(e) {
        e.preventDefault();

        // Get siblings
        const parent = this.parentElement;
        const siblings = parent.querySelectorAll('.btn-outline, .btn-secondary');

        // Toggle states
        siblings.forEach(sib => {
          sib.classList.remove('btn-secondary');
          sib.classList.add('btn-outline');
        });
        this.classList.remove('btn-outline');
        this.classList.add('btn-secondary');

        // Pulse animation
        this.style.transform = 'scale(0.95)';
        setTimeout(() => {
          this.style.transform = 'scale(1)';
        }, 100);
      });
    }
  });

  // ===== CARD HOVER/TAP EFFECTS =====
  document.querySelectorAll('.card, .rep-chip, .quiz-card').forEach(card => {
    card.style.transition = 'transform 0.15s ease, box-shadow 0.15s ease';

    card.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-2px)';
      this.style.boxShadow = '0 6px 12px rgba(0,0,0,0.1)';
    });

    card.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0)';
      this.style.boxShadow = '';
    });

    // Touch feedback
    card.addEventListener('touchstart', function() {
      this.style.transform = 'scale(0.98)';
    }, { passive: true });

    card.addEventListener('touchend', function() {
      this.style.transform = 'scale(1)';
    }, { passive: true });
  });

  // ===== VOTER CARD FAB ANIMATION =====
  const fab = document.querySelector('.voter-card-fab');
  if (fab) {
    fab.style.transition = 'transform 0.2s ease, box-shadow 0.2s ease';

    fab.addEventListener('mouseenter', function() {
      this.style.transform = 'scale(1.1)';
      this.style.boxShadow = '0 8px 20px rgba(37, 99, 235, 0.4)';
    });

    fab.addEventListener('mouseleave', function() {
      this.style.transform = 'scale(1)';
      this.style.boxShadow = '';
    });
  }

  // ===== BOTTOM NAV ACTIVE STATE =====
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', function() {
      document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
      this.classList.add('active');
    });
  });

  // ===== BUTTON RIPPLE EFFECT =====
  document.querySelectorAll('.btn').forEach(btn => {
    btn.style.position = 'relative';
    btn.style.overflow = 'hidden';

    btn.addEventListener('click', function(e) {
      const rect = this.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const ripple = document.createElement('span');
      ripple.style.cssText = `
        position: absolute;
        background: rgba(255,255,255,0.3);
        border-radius: 50%;
        transform: scale(0);
        animation: ripple 0.4s ease-out;
        pointer-events: none;
        width: 100px;
        height: 100px;
        left: ${x - 50}px;
        top: ${y - 50}px;
      `;

      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 400);
    });
  });

  // ===== BIAS BAR INTERACTION =====
  document.querySelectorAll('.bias-bar').forEach(bar => {
    const marker = bar.querySelector('.bias-marker');
    if (marker) {
      bar.style.cursor = 'pointer';

      bar.addEventListener('click', function(e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const percent = (x / rect.width) * 100;

        marker.style.transition = 'left 0.2s ease';
        marker.style.left = percent + '%';
      });
    }
  });

  // ===== SCROLL PROGRESS INDICATOR =====
  const content = document.querySelector('.content');
  if (content) {
    content.addEventListener('scroll', function() {
      const scrollPercent = (this.scrollTop / (this.scrollHeight - this.clientHeight)) * 100;
      document.documentElement.style.setProperty('--scroll-progress', scrollPercent + '%');
    });
  }

  // ===== XP BAR ANIMATION =====
  document.querySelectorAll('.xp-fill').forEach(fill => {
    const targetWidth = fill.style.width;
    fill.style.width = '0';
    fill.style.transition = 'width 1s ease-out';

    setTimeout(() => {
      fill.style.width = targetWidth;
    }, 300);
  });

  // ===== BADGE TOOLTIP =====
  document.querySelectorAll('.badge').forEach(badge => {
    if (badge.title) {
      badge.style.cursor = 'pointer';

      badge.addEventListener('click', function() {
        // Remove existing tooltips
        document.querySelectorAll('.badge-tooltip').forEach(t => t.remove());

        const tooltip = document.createElement('div');
        tooltip.className = 'badge-tooltip';
        tooltip.textContent = this.title;
        tooltip.style.cssText = `
          position: absolute;
          background: #1A1A1A;
          color: white;
          padding: 6px 12px;
          border-radius: 6px;
          font-size: 12px;
          z-index: 1000;
          transform: translateX(-50%);
          white-space: nowrap;
        `;

        const rect = this.getBoundingClientRect();
        tooltip.style.left = (rect.left + rect.width/2) + 'px';
        tooltip.style.top = (rect.top - 35) + 'px';

        document.body.appendChild(tooltip);

        setTimeout(() => tooltip.remove(), 2000);
      });
    }
  });

  // ===== VOTER CARD POPUP CLOSE =====
  const overlay = document.querySelector('.voter-card-overlay');
  if (overlay) {
    overlay.addEventListener('click', function(e) {
      if (e.target === this) {
        window.history.back();
      }
    });

    // Swipe down to close
    let startY = 0;
    const popup = overlay.querySelector('.voter-card-popup');

    if (popup) {
      popup.addEventListener('touchstart', function(e) {
        startY = e.touches[0].clientY;
      }, { passive: true });

      popup.addEventListener('touchmove', function(e) {
        const deltaY = e.touches[0].clientY - startY;
        if (deltaY > 0) {
          this.style.transform = `translateY(${deltaY}px)`;
        }
      }, { passive: true });

      popup.addEventListener('touchend', function(e) {
        const deltaY = e.changedTouches[0].clientY - startY;
        if (deltaY > 100) {
          window.history.back();
        } else {
          this.style.transform = '';
        }
      }, { passive: true });
    }
  }

  // ===== STREAK BADGE PULSE =====
  document.querySelectorAll('.streak-badge').forEach(badge => {
    badge.style.animation = 'pulse 2s infinite';
  });

  // ===== FOLLOW BUTTON TOGGLE =====
  document.querySelectorAll('.btn').forEach(btn => {
    if (btn.textContent.trim() === 'Follow') {
      btn.addEventListener('click', function(e) {
        e.preventDefault();
        if (this.textContent === 'Follow') {
          this.textContent = 'Following';
          this.classList.remove('btn-primary');
          this.classList.add('btn-secondary');
        } else {
          this.textContent = 'Follow';
          this.classList.remove('btn-secondary');
          this.classList.add('btn-primary');
        }
      });
    }
  });

  // ===== LEVEL PROGRESS ANIMATION =====
  document.querySelectorAll('.voice-level-pip').forEach((pip, i) => {
    if (pip.classList.contains('filled')) {
      pip.style.opacity = '0';
      pip.style.transition = 'opacity 0.3s ease';
      setTimeout(() => {
        pip.style.opacity = '1';
      }, 100 * i);
    }
  });

  console.log('CIVIQ Wireframe Interactivity Loaded');
});

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
  @keyframes ripple {
    to {
      transform: scale(4);
      opacity: 0;
    }
  }

  @keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.05); }
  }

  .accordion-content {
    transition: max-height 0.2s ease, opacity 0.2s ease;
    overflow: hidden;
  }

  .toggle-option {
    transition: all 0.2s ease;
  }

  .btn {
    transition: transform 0.1s ease;
  }

  .nav-item {
    transition: color 0.2s ease;
  }
`;
document.head.appendChild(style);
