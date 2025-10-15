document.addEventListener('DOMContentLoaded', () => {
  const lottieContainers = document.querySelectorAll('[data-lottie]');
  if (!lottieContainers.length) return;

  // Optimized timing for smooth Lottie playback
  const LOAD_DELAY_MS = 1000;           // Faster loading
  const STAGGER_MS = 50;                // Minimal stagger
  const IO_ROOT_MARGIN = '500px 0px';    // Load earlier to avoid stutter

  let scriptLoading = null;

  const loadLottieScript = () => {
    if (window.lottie) return Promise.resolve();
    if (scriptLoading) return scriptLoading;

    scriptLoading = new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/bodymovin/5.10.2/lottie.min.js';
      script.async = true;
      script.defer = true;
      
      // Small delay to let script settle before resolving
      script.onload = () => setTimeout(resolve, 50);
      document.head.appendChild(script);
    });

    return scriptLoading;
  };

  const initOneLottie = (container) => {
    if (container.__lottieInitialized) return;

    const jsonURL = container.getAttribute('data-lottie');
    if (!jsonURL) return;

    // Fade-in entrance
    container.classList.add('lottie-enter');

    const anim = window.lottie.loadAnimation({
      container,
      renderer: 'svg',
      loop: false,
      autoplay: true,
      path: jsonURL,
      rendererSettings: {
        progressiveLoad: true,
        preserveAspectRatio: 'xMidYMid slice',
        hideOnTransparent: true
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

    // Smooth initialization - wait for first frame before marking as ready
    anim.addEventListener('DOMLoaded', () => {
      container.__lottieAnimation = anim;
      
      // Trigger transition on next frames
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          container.classList.add('lottie-enter-active');
          container.classList.remove('lottie-enter');
        });
      });
      
      container.__lottieInitialized = true;
    });
  };

  // Gate: wait for LCP (Largest Contentful Paint) + brief idle window.
  // Simple delay after page load - no complex LCP waiting
  const whenReady = new Promise((resolve) => {
    window.addEventListener('load', () => {
      setTimeout(resolve, LOAD_DELAY_MS);
    });
    // Fallback timeout
    setTimeout(resolve, LOAD_DELAY_MS + 1000);
  });

  // Wait until the main thread has been quiet for a bit (no long tasks)
  const waitForMainThreadQuiet = (quietWindowMs = QUIET_WINDOW_MS, timeoutMs = QUIET_TIMEOUT_MS) => {
    return new Promise((resolve) => {
      let lastLongTaskAt = performance.now();
      let po = null;
      try {
        po = new PerformanceObserver(() => {
          lastLongTaskAt = performance.now();
        });
        po.observe({ type: 'longtask', buffered: true });
      } catch (_) {
        // Long Tasks API not supported; resolve after quietWindowMs
        setTimeout(resolve, quietWindowMs);
        return;
      }

      const interval = setInterval(() => {
        if (performance.now() - lastLongTaskAt >= quietWindowMs) {
          clearInterval(interval);
          clearTimeout(timeout);
          if (po) po.disconnect();
          resolve();
        }
      }, 200);

      const timeout = setTimeout(() => {
        clearInterval(interval);
        if (po) po.disconnect();
        resolve();
      }, timeoutMs);
    });
  };

  // Only init when near viewport, after the "ready" gate
  let initIndex = 0;
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      const myIndex = initIndex++;
      whenReady.then(() => {
        const start = () => loadLottieScript().then(() => initOneLottie(entry.target));
        setTimeout(start, myIndex * STAGGER_MS);
      });

      io.unobserve(entry.target);
    });
  }, { root: null, rootMargin: IO_ROOT_MARGIN, threshold: 0.15 });

  lottieContainers.forEach((el) => io.observe(el));
});