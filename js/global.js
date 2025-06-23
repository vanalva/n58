/* global.js — loaded on all pages */
document.addEventListener('DOMContentLoaded', function () {
    initCustomCursor();
    initNotchButtons();
    initNavbarScrollBlock();
});

function initCustomCursor() {
    const tricksCursor = document.querySelector('.cursor');
    if (!tricksCursor) return;
    
    // Cache selectors
    const stickElements = document.querySelectorAll(".to-the-bottom, .nav-link, .servicios-item-icon, .button, .cursor-stick, .link");
    const cursorStickElements = document.querySelectorAll(".cursor-stick");
    const cursorAdaptElements = document.querySelectorAll('.cursor-adapt');
    const cursorCodeElement = document.querySelector('.cursor-code');
  
    const cursorMove = (e) => {
      tricksCursor.style.top = `${e.clientY}px`;
      tricksCursor.style.left = `${e.clientX}px`;
    };

    // Throttle mousemove events
    const throttledMouseMove = throttle(cursorMove);
    window.addEventListener('mousemove', throttledMouseMove);
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
  
    // Cache options objects
    const wheelOptions = { passive: false };
    const touchOptions = { passive: false };
    const keyOptions = { passive: false };
  
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
  
  