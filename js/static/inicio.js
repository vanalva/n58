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
  let wasDragged = false;

  function debounce(func, wait) {
    let timeout;
    return function() {
      const context = this, args = arguments;
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(context, args), wait);
    };
  }

  if (isDesktop()) {
    Draggable.create(fixedButtons, {
      type: "x,y",
      bounds: "body",
      edgeResistance: 0.65,
      onDragStart: function() {
        wasDragged = true;
      },
      onDrag: function() {
        const rect = this.target.getBoundingClientRect();
        if (rect.right < 0 || rect.bottom < 0 || rect.left > window.innerWidth || rect.top > window.innerHeight) {
          gsap.set(this.target, { x: 0, y: 0 });
        }
      }
    });

    window.addEventListener("scroll", debounce(function() {
      if (wasDragged) {
        gsap.set(fixedButtons, { clearProps: "x,y" });
        wasDragged = false;
      }
    }, 100));
  }
});

