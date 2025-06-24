document.addEventListener("DOMContentLoaded", () => {
    const splineContainers = document.querySelectorAll('[data-spline]');
    if (!splineContainers.length) return;
  
    // Step 1: Load the viewer script
    const loadSplineViewerScript = () => {
      return new Promise((resolve) => {
        const script = document.createElement('script');
        script.type = 'module';
        script.src = 'https://unpkg.com/@splinetool/viewer@1.10.14/build/spline-viewer.js';
        script.onload = resolve;
        document.body.appendChild(script);
      });
    };
  
    // Step 2: Inject spline-viewers after script loads
    const loadSplines = () => {
      loadSplineViewerScript().then(() => {
        splineContainers.forEach(container => {
          const sceneURL = container.getAttribute('data-spline');
          if (!sceneURL) return;
  
          container.innerHTML = `
            <spline-viewer
              url="${sceneURL}"
              style="width: 100%; height: 100%; display: block;"></spline-viewer>
          `;
        });
      });
    };
  
    // Step 3: Defer until browser is idle
    if ('requestIdleCallback' in window) {
      requestIdleCallback(loadSplines);
    } else {
      setTimeout(loadSplines, 1200);
    }
  });
  