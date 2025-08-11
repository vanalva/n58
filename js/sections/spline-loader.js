document.addEventListener("DOMContentLoaded", () => {
    const splineContainers = document.querySelectorAll('[data-spline]');
    if (!splineContainers.length) return;
  
    let splineLoaded = false;
    let splineScriptLoaded = false;
  
    // Check if we should load Spline based on current window size
    const shouldLoadSpline = () => window.innerWidth > 1024;
  
    // Step 1: Load the Spline Web Component script
    const loadSplineViewerScript = () => {
      if (splineScriptLoaded) return Promise.resolve();
      
      return new Promise((resolve) => {
        const script = document.createElement('script');
        script.type = 'module';
        script.src = 'https://unpkg.com/@splinetool/viewer@1.10.14/build/spline-viewer.js';
        script.onload = () => {
          splineScriptLoaded = true;
          resolve();
        };
        document.body.appendChild(script);
      });
    };
  
    // Step 2: Inject each spline-viewer element dynamically (idempotent)
    const injectSplineScenes = () => {
      splineContainers.forEach(container => {
        const sceneURL = container.getAttribute('data-spline');
        if (!sceneURL) return;

        // Prevent duplicate injections per container
        if (container.querySelector('spline-viewer')) return;

        const viewer = document.createElement('spline-viewer');
        viewer.setAttribute('url', sceneURL);
        viewer.style.width = '100%';
        viewer.style.height = '100%';
        viewer.style.display = 'block';

        container.appendChild(viewer);
        container.classList.add('spline-loaded');
      });
      splineLoaded = true;
    };
  
    // Step 3: Remove ALL Spline content (not just the first)
    const removeSplineScenes = () => {
      splineContainers.forEach(container => {
        container.querySelectorAll('spline-viewer').forEach(v => v.remove());
        container.classList.remove('spline-loaded');
      });
      splineLoaded = false;
    };
  
    // Step 4: Lazy load after idle (guard against duplicates)
    const lazyLoadSplines = () => {
      if (splineLoaded || !shouldLoadSpline()) return;

      loadSplineViewerScript().then(() => {
        if (splineLoaded) return; // double-guard in case multiple callbacks fire
        injectSplineScenes();
      });
    };
  
    // Step 5: Handle window resize (debounced to reduce spam)
    let resizeTimeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        const shouldLoad = shouldLoadSpline();

        if (shouldLoad && !splineLoaded) {
          if ('requestIdleCallback' in window) {
            requestIdleCallback(lazyLoadSplines);
          } else {
            setTimeout(lazyLoadSplines, 300);
          }
        } else if (!shouldLoad && splineLoaded) {
          removeSplineScenes();
        }
      }, 150);
    };
  
    // Initial load
    if (shouldLoadSpline()) {
      if ('requestIdleCallback' in window) {
        requestIdleCallback(lazyLoadSplines);
      } else {
        setTimeout(lazyLoadSplines, 1200);
      }
    }
  
    // Listen for window resize
    window.addEventListener('resize', handleResize);
  });
  