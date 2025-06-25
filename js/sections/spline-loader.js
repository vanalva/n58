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
  
    // Step 2: Inject each spline-viewer element dynamically
    const injectSplineScenes = () => {
      splineContainers.forEach(container => {
        const sceneURL = container.getAttribute('data-spline');
        if (!sceneURL) return;
  
        const viewer = document.createElement('spline-viewer');
        viewer.setAttribute('url', sceneURL);
        viewer.style.width = '100%';
        viewer.style.height = '100%';
        viewer.style.display = 'block';
  
        container.appendChild(viewer);
      });
      splineLoaded = true;
    };
  
    // Step 3: Remove Spline content
    const removeSplineScenes = () => {
      splineContainers.forEach(container => {
        const viewer = container.querySelector('spline-viewer');
        if (viewer) {
          container.removeChild(viewer);
        }
      });
      splineLoaded = false;
    };
  
    // Step 4: Lazy load after idle
    const lazyLoadSplines = () => {
      if (!shouldLoadSpline()) return;
      
      loadSplineViewerScript().then(() => {
        injectSplineScenes();
      });
    };
  
    // Step 5: Handle window resize
    const handleResize = () => {
      const shouldLoad = shouldLoadSpline();
      
      if (shouldLoad && !splineLoaded) {
        // Load Spline when resizing to desktop
        if ('requestIdleCallback' in window) {
          requestIdleCallback(lazyLoadSplines);
        } else {
          setTimeout(lazyLoadSplines, 300);
        }
      } else if (!shouldLoad && splineLoaded) {
        // Remove Spline when resizing to mobile
        removeSplineScenes();
      }
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
  