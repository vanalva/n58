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
  
      // Stick cursor to hovered elements
      const stickSelectors = ".to-the-bottom, .nav-link, .servicios-item-icon, .button, .cursor-stick, .link";
  
      document.querySelectorAll(stickSelectors).forEach(el => {
          el.addEventListener('mouseenter', function() {
              window.removeEventListener("mousemove", throttledMouseMove);
  
              const tricksWidth = this.offsetWidth / 2;
              const tricksHeight = this.offsetHeight / 2;
              const tricksTop = this.getBoundingClientRect().top + window.scrollY;
              const tricksLeft = this.getBoundingClientRect().left;
  
              tricksCursor.style.top = `${tricksTop + tricksHeight}px`;
              tricksCursor.style.left = `${tricksLeft + tricksWidth}px`;
          });
  
          el.addEventListener('mouseleave', function() {
              window.addEventListener("mousemove", throttledMouseMove);
          });
      });
  
      // Focus effects
      document.querySelectorAll(".cursor-stick").forEach(el => {
          el.addEventListener("mouseenter", function() {
              tricksCursor.classList.add('cursor-focus');
          });
          el.addEventListener("mouseleave", function() {
              tricksCursor.classList.remove('cursor-focus');
          });
      });
  
      // Adaptive width (for elements like code blocks or buttons)
      document.querySelectorAll('.cursor-adapt').forEach(element => {
        element.addEventListener('mouseover', () => {
          const { width } = element.getBoundingClientRect();
          const cursorElement = document.querySelector('.cursor-code');
          if (cursorElement) {
            cursorElement.style.width = `${width}px`;
          }
        });
  
        element.addEventListener('mouseout', () => {
          const cursorElement = document.querySelector('.cursor-code');
          if (cursorElement) {
            cursorElement.style.width = '';
          }
        });
      });
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
  
    function preventScroll(event) {
      event.preventDefault();
    }
  
    function preventScrollKeys(event) {
      const keys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' ', 'PageUp', 'PageDown'];
      if (keys.includes(event.key)) {
        event.preventDefault();
      }
    }
  
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
  
  