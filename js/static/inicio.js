document.addEventListener('DOMContentLoaded', async () => {
  // BCV data is now managed by N8N workflow -> Webflow CMS
  // No custom JavaScript needed for display

  let isScrollBlocked = false;

  const isMobile = () => window.innerWidth <= 767;

  function blockScroll() {
    if (isScrollBlocked) return;
    document.body.style.overflow = "hidden";
    isScrollBlocked = true;
  }

  function allowScroll() {
    if (!isScrollBlocked) return;
    document.body.style.overflow = "";
    isScrollBlocked = false;
  }

  document.addEventListener("click", function (e) {
    const el = e.target.closest("[chatbot-no-scroll]");
    if (!el) return;

    const action = el.getAttribute("chatbot-no-scroll");

    if (action === "open" && isMobile()) {
      blockScroll();
    }

    if (action === "close") {
      allowScroll();
    }
  });

  window.addEventListener("resize", () => {
    if (!isMobile()) {
      allowScroll();
    }
  });

  const fixedButtons = document.querySelector(".fixed-buttons");

  if (!fixedButtons) return;

  const isDesktop = () => window.innerWidth >= 992;

  function debounce(func, wait) {
    let timeout;
    return function() {
      const context = this, args = arguments;
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(context, args), wait);
    };
  }

  if (isDesktop()) {
    let isDragging = false;
    let currentX = 0, currentY = 0, initialX = 0, initialY = 0;
    let xOffset = 0, yOffset = 0;

    // Load saved position from localStorage
    const saved = localStorage.getItem('fixedButtonsPosition');
    if (saved) {
      const pos = JSON.parse(saved);
      fixedButtons.style.transform = `translate(${pos.x}px, ${pos.y}px)`;
      xOffset = pos.x;
      yOffset = pos.y;
    }

    fixedButtons.addEventListener('mousedown', (e) => {
      initialX = e.clientX - xOffset;
      initialY = e.clientY - yOffset;
      isDragging = true;
      fixedButtons.style.cursor = 'grabbing';
    });

    document.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      
      e.preventDefault();
      currentX = e.clientX - initialX;
      currentY = e.clientY - initialY;
      xOffset = currentX;
      yOffset = currentY;

      // Boundary check
      const rect = fixedButtons.getBoundingClientRect();
      if (rect.right > 0 && rect.bottom > 0 && 
          rect.left < window.innerWidth && rect.top < window.innerHeight) {
        fixedButtons.style.transform = `translate(${currentX}px, ${currentY}px)`;
      }
    });

    document.addEventListener('mouseup', () => {
      if (isDragging) {
        isDragging = false;
        fixedButtons.style.cursor = 'grab';
        
        // Save position to localStorage
        localStorage.setItem('fixedButtonsPosition', JSON.stringify({
          x: xOffset,
          y: yOffset
        }));
      }
    });

    // Reset position on scroll
    window.addEventListener('scroll', debounce(() => {
      fixedButtons.style.transform = '';
      xOffset = 0;
      yOffset = 0;
      localStorage.removeItem('fixedButtonsPosition');
    }, 100));
  }
});

