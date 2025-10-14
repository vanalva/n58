document.addEventListener("DOMContentLoaded", () => {
  const splineContainers = document.querySelectorAll('[data-spline]');
  if (!splineContainers.length) {
    console.log('No Spline containers found');
    return;
  }
  
  console.log(`Found ${splineContainers.length} Spline containers`);

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
    if (splineScriptLoaded) {
      console.log('Spline script already loaded');
      return Promise.resolve();
    }
    if (scriptLoading) {
      console.log('Spline script already loading');
      return scriptLoading;
    }

    console.log('Loading Spline script...');
    scriptLoading = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.type = 'module';
      script.src = 'https://unpkg.com/@splinetool/viewer@1.10.14/build/spline-viewer.js';
      script.onload = () => {
        console.log('Spline script loaded successfully');
        splineScriptLoaded = true;
        resolve();
      };
      script.onerror = (error) => {
        console.error('Failed to load Spline script:', error);
        reject(error);
      };
      document.body.appendChild(script);
    });

    return scriptLoading;
  };

  const injectOneSpline = (container) => {
    if (container.__splineInitialized) {
      console.log('Spline already initialized for container');
      return;
    }

    const sceneURL = container.getAttribute('data-spline');
    if (!sceneURL) {
      console.error('No data-spline URL found on container');
      return;
    }

    if (container.querySelector('spline-viewer')) {
      console.log('Spline viewer already exists in container');
      container.__splineInitialized = true;
      return;
    }

    console.log(`Injecting Spline viewer with URL: ${sceneURL}`);
    console.log('Container computed styles:', window.getComputedStyle(container));
    
    const viewer = document.createElement('spline-viewer');
    viewer.setAttribute('url', sceneURL);
    viewer.style.width = '100%';
    viewer.style.height = '100%';
    viewer.style.display = 'block';
    viewer.style.visibility = 'visible';
    viewer.style.opacity = '1';

    container.appendChild(viewer);
    
    // Wait for Spline to actually load before fading in
    viewer.addEventListener('load', () => {
      console.log('Spline viewer loaded successfully');
      console.log('Container dimensions:', container.offsetWidth, 'x', container.offsetHeight);
      console.log('Viewer dimensions:', viewer.offsetWidth, 'x', viewer.offsetHeight);
      setTimeout(() => {
        container.classList.add('spline-loaded');
        console.log('Added spline-loaded class');
      }, 100);
    });

    // Fallback: Apply class after 3 seconds regardless
    setTimeout(() => {
      if (!container.classList.contains('spline-loaded')) {
        console.log('Fallback: Adding spline-loaded class after 3s timeout');
        container.classList.add('spline-loaded');
      }
    }, 3000);

    // Add error handling
    viewer.addEventListener('error', (error) => {
      console.error('Spline viewer error:', error);
    });

    // Debug after a delay to see if anything renders
    setTimeout(() => {
      console.log('Spline debug after 2s:');
      console.log('- Container visible:', container.offsetWidth > 0 && container.offsetHeight > 0);
      console.log('- Viewer visible:', viewer.offsetWidth > 0 && viewer.offsetHeight > 0);
      console.log('- Viewer in DOM:', document.contains(viewer));
    }, 2000);

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
  