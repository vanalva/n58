document.addEventListener("DOMContentLoaded", () => {
    const splineContainers = document.querySelectorAll('[data-spline]');
    if (!splineContainers.length) return;
  
    // Only load on desktop (width > 1024px)
    if (window.innerWidth <= 1024) {
        return;
    }
  
    // Step 1: Load the Spline Web Component script
    const loadSplineViewerScript = () => {
      return new Promise((resolve) => {
        const script = document.createElement('script');
        script.type = 'module';
        script.src = 'https://unpkg.com/@splinetool/viewer@1.10.14/build/spline-viewer.js';
        script.onload = resolve;
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
    };
  
    // Step 3: Lazy load after idle
    const lazyLoadSplines = () => {
      loadSplineViewerScript().then(() => {
        injectSplineScenes();
      });
    };
  
    if ('requestIdleCallback' in window) {
      requestIdleCallback(lazyLoadSplines);
    } else {
      setTimeout(lazyLoadSplines, 1200);
    }
  });
  