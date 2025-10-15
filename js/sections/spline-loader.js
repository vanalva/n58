document.addEventListener("DOMContentLoaded", () => {
  const splineContainers = document.querySelectorAll('[data-spline]');
  if (!splineContainers.length) return;

  // Load Spline MUCH later - after critical content is rendered
  const LOAD_DELAY_MS = 8000;           // Wait 8 seconds after page load
  const STAGGER_MS = 200;               // Slower stagger to reduce impact
  const IO_ROOT_MARGIN = '100px 0px';  // Only load when very close to viewport

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

  const createSplinePreloader = (container) => {
    // Get the container's background color for the preloader
    const computedStyle = window.getComputedStyle(container);
    const containerBgColor = computedStyle.backgroundColor || 'transparent';
    
    // Create a mini preloader using the same design as main preloader
    const preloader = document.createElement('div');
    preloader.className = 'spline-preloader';
    preloader.innerHTML = `
      <div class="spline-preloader-content">
        <div class="spline-preloader-bar">
          <div class="spline-preloader-fill"></div>
          <div class="spline-preloader-percentage">0%</div>
        </div>
      </div>
    `;
    
    // Style the preloader - NO background, just overlay
    preloader.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10;
      opacity: 1;
      transition: opacity 0.5s ease-out;
    `;
    
    const content = preloader.querySelector('.spline-preloader-content');
    content.style.cssText = `
      text-align: center;
      font-family: 'Nugros', sans-serif;
    `;
    
    const bar = preloader.querySelector('.spline-preloader-bar');
    bar.style.cssText = `
      width: 200px;
      height: 16px;
      background: transparent;
      border: 2px solid var(--te-quiero-verde);
      border-radius: 0;
      overflow: hidden;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
    `;
    
    const fill = preloader.querySelector('.spline-preloader-fill');
    fill.style.cssText = `
      width: 0%;
      height: 100%;
      background: var(--te-quiero-verde);
      border-radius: 0;
      transition: width 0.3s ease;
      position: absolute;
      top: 0;
      left: 0;
    `;
    
    const percentage = preloader.querySelector('.spline-preloader-percentage');
    percentage.style.cssText = `
      font-size: 12px;
      color: var(--te-quiero-verde);
      font-weight: 600;
      z-index: 1;
      position: relative;
    `;
    
    // Animate the progress bar and percentage
    let progress = 0;
    const animateProgress = () => {
      progress += Math.random() * 15;
      if (progress > 90) progress = 90;
      fill.style.width = progress + '%';
      percentage.textContent = Math.round(progress) + '%';
      
      if (progress < 90) {
        setTimeout(animateProgress, 200 + Math.random() * 300);
      }
    };
    animateProgress();
    
    return preloader;
  };

  const hideSplinePreloader = (container) => {
    const preloader = container.querySelector('.spline-preloader');
    if (preloader) {
      preloader.style.opacity = '0';
      setTimeout(() => {
        preloader.remove();
      }, 500);
    }
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
    
    // Add performance hints for LCP optimization
    viewer.setAttribute('fetchpriority', 'high');
    viewer.setAttribute('loading', 'eager');

    container.appendChild(viewer);
    
    // Wait for Spline to actually load before crossfade
    viewer.addEventListener('load', () => {
      console.log('Spline viewer loaded successfully');
      // Hide the preloader
      hideSplinePreloader(container);
      // Immediate crossfade - no delay for perfect sync
      container.classList.add('spline-loaded');
      console.log('Added spline-loaded class');
      console.log('Container classes:', container.className);
      console.log('Container has spline-loaded:', container.classList.contains('spline-loaded'));
    });

    // Fallback: Apply class after 2.5 seconds (shorter timeout)
    setTimeout(() => {
      if (!container.classList.contains('spline-loaded')) {
        console.log('Fallback: Adding spline-loaded class after 2.5s timeout');
        // Hide the preloader on fallback too
        hideSplinePreloader(container);
        container.classList.add('spline-loaded');
      }
    }, 2500);


    // Add error handling
    viewer.addEventListener('error', (error) => {
      console.error('Spline viewer error:', error);
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
    
    // Load Spline ONLY when user scrolls to it or after long delay
    whenReady.then(() => {
      const run = () => loadSplineViewerScript().then(() => injectOneSpline(container));
      
      // Use requestIdleCallback with longer timeout - only load when truly idle
      if ('requestIdleCallback' in window) {
        requestIdleCallback(run, { timeout: 10000 }); // 10 second timeout
      } else {
        // Fallback: wait much longer
        setTimeout(run, 2000);
      }
    });
  };

  let initIndex = 0;
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      
      const container = entry.target;
      if (container.__splineInitialized) return;
      
      // Only start loading when container is actually visible
      const myIndex = initIndex++;
      whenReady.then(() => {
        const run = () => startForContainer(container);
        setTimeout(run, myIndex * STAGGER_MS);
      });
      io.unobserve(container);
    });
  }, { root: null, rootMargin: IO_ROOT_MARGIN, threshold: 0.5 }); // Higher threshold - only when 50% visible

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

  // Show preloaders immediately for all Spline containers
  splineContainers.forEach(container => {
    if (shouldLoadSpline()) {
      const preloader = createSplinePreloader(container);
      container.appendChild(preloader);
    }
  });
});
  