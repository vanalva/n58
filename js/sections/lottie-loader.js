document.addEventListener('DOMContentLoaded', () => {
  const lottieContainers = document.querySelectorAll('[data-lottie]');
  if (!lottieContainers.length) return;

  let scriptLoading = null;

  const loadLottieScript = () => {
    if (window.lottie) return Promise.resolve();
    if (scriptLoading) return scriptLoading;

    scriptLoading = new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/bodymovin/5.10.2/lottie.min.js';
      script.async = true;
      script.onload = resolve;
      document.body.appendChild(script);
    });

    return scriptLoading;
  };

  const initOneLottie = (container) => {
    if (container.__lottieInitialized) return;

    const jsonURL = container.getAttribute('data-lottie');
    if (!jsonURL) return;

    const anim = window.lottie.loadAnimation({
      container,
      renderer: 'svg',
      loop: false,
      autoplay: true,
      path: jsonURL,
      rendererSettings: {
        progressiveLoad: true
      }
    });

    anim.addEventListener('complete', () => {
      const direction = anim.playDirection;
      if (direction === 1) {
        anim.goToAndStop(anim.totalFrames - 1, true);
      } else {
        anim.goToAndStop(0, true);
      }
    });

    if (container.classList.contains('lottie-logo')) {
      container.addEventListener('mouseenter', () => {
        const skipFrames = 15;
        const adjusted = Math.max(anim.currentFrame - skipFrames, 0);
        anim.goToAndStop(adjusted, true);
        anim.setDirection(-1);
        anim.setSpeed(1);
        anim.play();
      });

      container.addEventListener('mouseleave', () => {
        anim.setDirection(1);
        anim.setSpeed(1);
        anim.play();
      });
    }

    container.__lottieInitialized = true;
  };

  // Gate: wait for LCP (Largest Contentful Paint) + brief idle window.
  const whenReady = new Promise((resolve) => {
    let resolved = false;
    const safeResolve = () => {
      if (resolved) return;
      resolved = true;
      resolve();
    };

    try {
      const po = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        if (!entries.length) return;
        if ('requestIdleCallback' in window) {
          requestIdleCallback(safeResolve, { timeout: 800 });
        } else {
          setTimeout(safeResolve, 800);
        }
        po.disconnect();
      });
      po.observe({ type: 'largest-contentful-paint', buffered: true });

      // Backstops if LCP doesn't fire
      window.addEventListener('load', () => setTimeout(safeResolve, 1000));
      setTimeout(safeResolve, 1500);
    } catch (e) {
      // Older browsers: fall back
      window.addEventListener('load', () => setTimeout(safeResolve, 1000));
      setTimeout(safeResolve, 1500);
    }
  });

  // Only init when near viewport, after the "ready" gate
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      whenReady.then(() => {
        const start = () => loadLottieScript().then(() => initOneLottie(entry.target));
        if ('requestIdleCallback' in window) {
          requestIdleCallback(start, { timeout: 2000 });
        } else {
          setTimeout(start, 300);
        }
      });

      io.unobserve(entry.target);
    });
  }, { root: null, rootMargin: '200px 0px', threshold: 0.15 });

  lottieContainers.forEach((el) => io.observe(el));
});