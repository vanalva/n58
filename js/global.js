/* global.js — loaded on all pages */
document.addEventListener('DOMContentLoaded', function () {
    console.log("✅ global.js loaded");
  
    /* === Custom Cursor === */
    const tricksCursor = document.querySelector('.cursor');
  
    if (tricksCursor) {
      const cursorMove = (e) => {
        tricksCursor.style.top = `${e.clientY}px`;
        tricksCursor.style.left = `${e.clientX}px`;
      };
  
      // Default tracking
      window.addEventListener('mousemove', cursorMove);
  
      // Stick cursor to hovered elements
      const stickSelectors = ".to-the-bottom, .nav-link, .servicios-item-icon, .button, .cursor-stick, .link";
  
      $(stickSelectors).mouseenter(function () {
        window.removeEventListener("mousemove", cursorMove);
  
        const tricksWidth = $(this).outerWidth() / 2;
        const tricksHeight = $(this).outerHeight() / 2;
        const tricksTop = $(this).offset().top - $(document).scrollTop();
        const tricksLeft = $(this).offset().left;
  
        tricksCursor.style.top = `${tricksTop + tricksHeight}px`;
        tricksCursor.style.left = `${tricksLeft + tricksWidth}px`;
      });
  
      $(stickSelectors).mouseleave(function () {
        window.addEventListener("mousemove", cursorMove);
      });
  
      // Focus effects
      $(".cursor-stick").on("mouseenter", function () {
        $('.cursor').addClass('cursor-focus');
      }).on("mouseleave", function () {
        $('.cursor').removeClass('cursor-focus');
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
  
    /* === Notch Button Duplicate === */
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
  });
  