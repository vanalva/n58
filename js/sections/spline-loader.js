document.addEventListener("DOMContentLoaded", () => {
  const splineContainers = document.querySelectorAll('[data-spline]');
  if (!splineContainers.length) return;

  // Tuning knobs - Balanced for smooth loading without harsh black
  const MIN_DELAY_AFTER_LCP_MS = 600;   // Slight delay to prioritize content
  const QUIET_WINDOW_MS = 400;          // Shorter quiet window
  const QUIET_TIMEOUT_MS = 3500;        // Faster timeout
  const STAGGER_MS = 100;               // Faster stagger
  const IO_ROOT_MARGIN = '400px 0px';   // Start loading earlier to avoid black space

  let splineScriptLoaded = false;
  let scriptLoading = null;

  const shouldLoadSpline = () => window.innerWidth > 1024;

  const loadSplineViewerScript = () => {
    if (splineScriptLoaded) return Promise.resolve();
    if (scriptLoading) return scriptLoading;

    scriptLoading = new Promise((resolve) => {
      const script = document.createElement('script');
      script.type = 'module';
      script.src = 'https://unpkg.com/@splinetool/viewer@1.10.14/build/spline-viewer.js';
      script.onload = () => {
        splineScriptLoaded = true;
        resolve();
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

    container.appendChild(viewer);
    
    // Wait for Spline to actually load before fading in
    viewer.addEventListener('load', () => {
      setTimeout(() => {
        container.classList.add('spline-loaded');
      }, 100);
    });

    container.__splineInitialized = true;
  };

  const removeAllSplines = () => {
    splineContainers.forEach(container => {
      container.querySelectorAll('spline-viewer').forEach(v => v.remove());
      container.classList.remove('spline-loaded');
      container.__splineInitialized = false;
    });
  };

  const whenReady = new Promise((resolve) => {
    let resolved = false;
    const safeResolve = () => {
      if (resolved) return;
      resolved = true;
      // Enforce minimum extra delay after LCP
      setTimeout(resolve, MIN_DELAY_AFTER_LCP_MS);
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

      window.addEventListener('load', () => setTimeout(safeResolve, 1000));
      setTimeout(safeResolve, 2000);
    } catch (e) {
      window.addEventListener('load', () => setTimeout(safeResolve, 1000));
      setTimeout(safeResolve, 2000);
    }
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
      whenReady
        .then(() => waitForMainThreadQuiet())
        .then(() => {
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
  