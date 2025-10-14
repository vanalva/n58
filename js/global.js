/* global.js — loaded on all pages */

// ✅ Initialize page loader immediately (before DOM ready)
initPageLoader();

document.addEventListener('DOMContentLoaded', function () {
    initCustomCursor();
    initNotchButtons();
    initNavbarScrollBlock();
});

function initPageLoader() {
    // Create loader HTML
    const loaderHTML = `
        <div id="n58-page-loader">
            <div class="loader-content">
                <div class="loader-logo">N58</div>
                <div class="loader-text">Cargando experiencia digital</div>
                <div class="bar-container">
                    <div class="bar-fill"></div>
                </div>
            </div>
        </div>
    `;
    
    // Inject loader immediately
    document.body.insertAdjacentHTML('afterbegin', loaderHTML);
    
    // Hide loader when page is fully loaded
    window.addEventListener('load', () => {
        document.body.classList.add('loaded');
        
        // Remove loader from DOM after fade out
        setTimeout(() => {
            const loader = document.getElementById('n58-page-loader');
            if (loader) loader.remove();
        }, 300);
    });
}

function initCustomCursor() {
    // Skip on touch devices (mobile/tablets)
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) return;
    
    const tricksCursor = document.querySelector('.cursor');
    if (!tricksCursor) return;
  
    const cursorMove = (e) => {
      tricksCursor.style.top = `${e.clientY}px`;
      tricksCursor.style.left = `${e.clientX}px`;
    };

    // Throttle mousemove events
    const throttledMouseMove = throttle(cursorMove);
    window.addEventListener('mousemove', throttledMouseMove, { passive: true });
}

function throttle(func) {
    let ticking = false;
    return function() {
        if (!ticking) {
            requestAnimationFrame(() => {
                func.apply(this, arguments);
                ticking = false;
            });
            ticking = true;
        }
    };
}

function initNotchButtons() {
    // Cache the querySelectorAll result
    const buttons = document.querySelectorAll('.notch-button');
  
    buttons.forEach((button, index) => {
      const wrapper = button.closest('.button-wrapper');
  
      if (wrapper) {
        // Remove existing duplicate if any
        const existing = wrapper.querySelector('.notch-button-duplicate');
        if (existing) existing.remove();
  
        const clone = button.cloneNode(true);
        clone.classList.remove('notch-button');
        clone.classList.add('notch-button-duplicate');
        wrapper.appendChild(clone);
      }
    });
}

function initNavbarScrollBlock() {
    const body = document.body;
    const navbarTriggers = document.querySelectorAll('.section_main-navbar');
    const dropdownTriggers = document.querySelectorAll('.dropdown-trigger');
    let isScrollBlocked = false;
  
    function blockScroll() {
      if (!isScrollBlocked) {
        window.addEventListener('wheel', preventScroll, { passive: false });
        window.addEventListener('touchmove', preventScroll, { passive: false });
        window.addEventListener('keydown', preventScrollKeys, { passive: false });
        isScrollBlocked = true;
      }
    }
  
    function allowScroll() {
      if (isScrollBlocked) {
        window.removeEventListener('wheel', preventScroll);
        window.removeEventListener('touchmove', preventScroll);
        window.removeEventListener('keydown', preventScrollKeys);
        isScrollBlocked = false;
      }
    }
  
    // Cache event handlers to avoid recreating them
    const preventScroll = (event) => event.preventDefault();
    const preventScrollKeys = (event) => {
        const keys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' ', 'PageUp', 'PageDown'];
        if (keys.includes(event.key)) {
            event.preventDefault();
        }
    };
  
    // Desktop hover scroll-lock
    if (window.innerWidth > 1024) {
      navbarTriggers.forEach(trigger => {
        trigger.addEventListener('mouseover', blockScroll);
        trigger.addEventListener('mouseout', allowScroll);
      });
    }
  
    // Mobile click scroll-lock
    if (window.innerWidth <= 1024) {
      dropdownTriggers.forEach(trigger => {
        trigger.addEventListener('click', (e) => {
          e.stopPropagation();
          isScrollBlocked ? allowScroll() : blockScroll();
        });
      });
  
      // Click outside closes dropdown + enables scroll
      document.addEventListener('click', (e) => {
        const inside = e.target.closest('.dropdown-trigger') || e.target.closest('.Main\ Navbar\ Dropdown');
        if (!inside) allowScroll();
      });
    }
}
  
  