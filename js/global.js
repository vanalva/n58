/* global.js — loaded on all pages */
document.addEventListener('DOMContentLoaded', function () {
    console.log("✅ global.js loaded");
    
    initCustomCursor();
    initNotchButtons();
    initNavbarScrollBlock();
});

function initCustomCursor() {
    const tricksCursor = document.querySelector('.cursor');
  
    if (tricksCursor) {
      const cursorMove = (e) => {
        tricksCursor.style.top = `${e.clientY}px`;
        tricksCursor.style.left = `${e.clientX}px`;
      };
  
      // Throttle mousemove events
      const throttledMouseMove = throttle(cursorMove, 16); // 60fps
      window.addEventListener('mousemove', throttledMouseMove);
  
     
    }
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

function initNotchButtons() {
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
  
        console.log(`🌀 Cloned notch-button ${index + 1}`);
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
        console.log("🛑 Scroll blocked");
      }
    }
  
    function allowScroll() {
      if (isScrollBlocked) {
        window.removeEventListener('wheel', preventScroll);
        window.removeEventListener('touchmove', preventScroll);
        window.removeEventListener('keydown', preventScrollKeys);
        isScrollBlocked = false;
        console.log("✅ Scroll allowed");
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
  
  