document.addEventListener("DOMContentLoaded", () => {
  const splineContainers = document.querySelectorAll('[data-spline]');
  if (!splineContainers.length) return;

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
    viewer.classList.add('spline-enter');

    container.appendChild(viewer);
    container.classList.add('spline-loaded');

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        viewer.classList.add('spline-enter-active');
        viewer.classList.remove('spline-enter');
      });
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

      window.addEventListener('load', () => setTimeout(safeResolve, 1000));
      setTimeout(safeResolve, 1500);
    } catch (e) {
      window.addEventListener('load', () => setTimeout(safeResolve, 1000));
      setTimeout(safeResolve, 1500);
    }
  });

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

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      startForContainer(entry.target);
      io.unobserve(entry.target);
    });
  }, { root: null, rootMargin: '200px 0px', threshold: 0.1 });

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
  