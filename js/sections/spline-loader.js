document.addEventListener("DOMContentLoaded", () => {
  const splineContainers = document.querySelectorAll('[data-spline]');
  if (!splineContainers.length) return;

  // Simplified timing - no complex LCP waiting
  const LOAD_DELAY_MS = 2000;           // Simple delay after page load
  const STAGGER_MS = 100;               // Faster stagger
  const IO_ROOT_MARGIN = '300px 0px';   // Start loading earlier

  let splineScriptLoaded = false;
  let scriptLoading = null;

  const shouldLoadSpline = () => window.innerWidth > 1024;

  const loadSplineViewerScript = () => {
    if (splineScriptLoaded) return Promise.resolve();
    if (scriptLoading) return scriptLoading;

    scriptLoading = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.type = 'module';
      script.src = 'https://unpkg.com/@splinetool/viewer@1.10.14/build/spline-viewer.js';
      script.onload = () => {
        splineScriptLoaded = true;
        resolve();
      };
      script.onerror = (error) => {
        reject(error);
      };
      document.body.appendChild(script);
    });

    return scriptLoading;
  };

  const injectOneSpline = (container) => {
    if (container.__splineInitialized) return;

    const sceneURL = container.getAttribute('data-spline');
    if (!sceneURL) return;

    if (container.querySelector('spline-viewer')) {
      container.__splineInitialized = true;
      return;
    }
    
    const viewer = document.createElement('spline-viewer');
    viewer.setAttribute('url', sceneURL);
    viewer.style.width = '100%';
    viewer.style.height = '100%';
    viewer.style.display = 'block';
    viewer.style.visibility = 'visible';
    viewer.style.opacity = '1';
    
    // Add performance hints for LCP optimization
    viewer.setAttribute('fetchpriority', 'high');
    viewer.setAttribute('loading', 'eager');

    container.appendChild(viewer);
    
    // Wait for Spline to actually load before crossfade
    viewer.addEventListener('load', () => {
      container.classList.add('spline-loaded');
    });

    // Fallback: Apply class after 2.5 seconds
    setTimeout(() => {
      if (!container.classList.contains('spline-loaded')) {
        container.classList.add('spline-loaded');
      }
    }, 2500);

    container.__splineInitialized = true;
  };

  const removeAllSplines = () => {
    splineContainers.forEach(container => {
      container.querySelectorAll('spline-viewer').forEach(v => v.remove());
      container.classList.remove('spline-loaded');
      container.__splineInitialized = false;
    });
  };

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

  const startForContainer = (container) => {
    if (!shouldLoadSpline()) return;
    whenReady.then(() => {
      const run = () => loadSplineViewerScript().then(() => injectOneSpline(container));
      if ('requestIdleCallback' in window) {
        requestIdleCallback(run, { timeout: 2000 });
      } else {
        setTimeout(run, 300);
      }
    });
  };

  let initIndex = 0;
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const myIndex = initIndex++;
      whenReady.then(() => {
        const run = () => startForContainer(entry.target);
        setTimeout(run, myIndex * STAGGER_MS);
      });
      io.unobserve(entry.target);
    });
  }, { root: null, rootMargin: IO_ROOT_MARGIN, threshold: 0.1 });

  splineContainers.forEach((el) => io.observe(el));

  let resizeTimeout;
  const handleResize = () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      if (!shouldLoadSpline()) {
        removeAllSplines();
        splineContainers.forEach((el) => {
          try { io.observe(el); } catch (_) {}
        });
      } else {
        splineContainers.forEach((el) => {
          if (!el.__splineInitialized) {
            try { io.observe(el); } catch (_) {}
          }
        });
      }
    }, 150);
  };

  window.addEventListener('resize', handleResize);
});
  