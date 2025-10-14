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
});

