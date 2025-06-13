document.addEventListener('DOMContentLoaded', () => {
    console.log("✅ marquee.js loaded");
  
    document.querySelectorAll('.marquee_container').forEach(container => {
      const marqueeId = 'marquee_' + Math.random().toString(36).substr(2, 9);
      container.dataset.marqueeId = marqueeId;
  
      container.addEventListener('mouseenter', (e) => {
        const elements = e.currentTarget.querySelectorAll('.marquee_elements-container');
        elements.forEach(element => {
          const style = window.getComputedStyle(element);
          element.dataset.pausedTransform = style.transform;
        });
      });
  
      container.addEventListener('mouseleave', (e) => {
        const elements = e.currentTarget.querySelectorAll('.marquee_elements-container');
        elements.forEach(element => {
          delete element.dataset.pausedTransform;
        });
      });
    });
  });
  