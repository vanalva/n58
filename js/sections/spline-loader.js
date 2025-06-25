document.addEventListener("DOMContentLoaded", () => {
    const splineContainers = document.querySelectorAll('[data-spline]');
    if (!splineContainers.length) return;
  
    // Only load on desktop (width > 1024px) and in portrait orientation
    if (window.innerWidth <= 1024 || window.innerHeight < window.innerWidth) {
        console.log('Spline loader: Skipping on non-desktop or horizontal orientation');
        return;
    }
  
    // Step 1: Load the Spline Web Component script with timeout
    const loadSplineViewerScript = () => {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.type = 'module';
            script.src = 'https://unpkg.com/@splinetool/viewer@1.10.14/build/spline-viewer.js';
            
            // Set a timeout for script loading
            const timeout = setTimeout(() => {
                reject(new Error('Spline script loading timeout'));
            }, 8000); // 8 second timeout
            
            script.onload = () => {
                clearTimeout(timeout);
                resolve();
            };
            
            script.onerror = () => {
                clearTimeout(timeout);
                reject(new Error('Spline script failed to load'));
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
  
            // Add loading timeout for individual scenes
            const sceneTimeout = setTimeout(() => {
            }, 10000); // 10 second timeout for scene loading
  
            viewer.addEventListener('load', () => {
                clearTimeout(sceneTimeout);
                container.classList.add('spline-loaded');
            });
  
            viewer.addEventListener('error', () => {
                clearTimeout(sceneTimeout);
                container.classList.add('spline-fallback');
            });
  
            container.appendChild(viewer);
        });
    };
  
    // Step 3: Lazy load after idle with error handling
    const lazyLoadSplines = async () => {
        try {
            await loadSplineViewerScript();
            injectSplineScenes();
        } catch (error) {
            // Add fallback class to all containers
            splineContainers.forEach(container => {
                container.classList.add('spline-fallback');
            });
        }
    };
  
    if ('requestIdleCallback' in window) {
      requestIdleCallback(lazyLoadSplines);
    } else {
      setTimeout(lazyLoadSplines, 1200);
    }
  });
  