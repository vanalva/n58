document.addEventListener("DOMContentLoaded", () => {
  const splineContainers = document.querySelectorAll('[data-spline]');
  if (!splineContainers.length) return;

  // Load Spline immediately when visible - no artificial delays
  const LOAD_DELAY_MS = 0;              // No delay - load immediately
  const STAGGER_MS = 50;                // Minimal stagger
  const IO_ROOT_MARGIN = '300px 0px';  // Load when approaching viewport

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
    
    // Store references for real Spline progress tracking
    container.__splinePreloaderFill = fill;
    container.__splinePreloaderPercentage = percentage;
    
    // Initial progress
    fill.style.width = '0%';
    percentage.textContent = '0%';
    
    return preloader;
  };

  const updateSplineProgress = (container, progress) => {
    const fill = container.__splinePreloaderFill;
    const percentage = container.__splinePreloaderPercentage;
    
    if (fill && percentage) {
      fill.style.width = progress + '%';
      percentage.textContent = Math.round(progress) + '%';
    }
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
    viewer.style.visibility = 'hidden';
    viewer.style.opacity = '0';
    viewer.style.transform = 'translateY(20px)';
    viewer.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    
    // Add performance hints for LCP optimization
    viewer.setAttribute('fetchpriority', 'high');
    viewer.setAttribute('loading', 'eager');

    container.appendChild(viewer);
    
    // Track real Spline loading progress with fallback simulation
    let progressSimulation = null;
    let realProgressReceived = false;
    
    // Start progress simulation immediately (fallback)
    const startProgressSimulation = () => {
      let simulatedProgress = 0;
      progressSimulation = setInterval(() => {
        if (realProgressReceived) return; // Stop if real progress is received
        
        simulatedProgress += Math.random() * 8 + 2; // 2-10% increments
        if (simulatedProgress > 85) simulatedProgress = 85; // Cap at 85%
        
        updateSplineProgress(container, simulatedProgress);
        console.log(`Simulated Spline progress: ${Math.round(simulatedProgress)}%`);
      }, 200);
    };
    
    startProgressSimulation();
    
    // Try to track real Spline loading progress
    viewer.addEventListener('progress', (event) => {
      realProgressReceived = true;
      if (progressSimulation) {
        clearInterval(progressSimulation);
        progressSimulation = null;
      }
      
      const progress = event.detail.progress * 100; // Convert to percentage
      console.log(`Real Spline loading progress: ${progress}%`);
      updateSplineProgress(container, progress);
    });
    
    // Wait for Spline to actually load before crossfade
    viewer.addEventListener('load', () => {
      console.log('Spline viewer loaded successfully');
      
      // Clean up progress simulation
      if (progressSimulation) {
        clearInterval(progressSimulation);
        progressSimulation = null;
      }
      
      // Update to 100% before hiding
      updateSplineProgress(container, 100);
      
      // Perfect synchronization: Hide preloader first, then show Spline
      hideSplinePreloader(container);
      
      // Small delay to ensure preloader is hidden before showing Spline
      setTimeout(() => {
        // Show Spline with fade-from-below effect
        viewer.style.visibility = 'visible';
        viewer.style.opacity = '1';
        viewer.style.transform = 'translateY(0)';
        
        // Mark as loaded
        container.classList.add('spline-loaded');
        console.log('Added spline-loaded class');
      }, 100); // Small delay for perfect sync
    });

    // Fallback: Apply class after 2 seconds (reasonable timeout)
    setTimeout(() => {
      if (!container.classList.contains('spline-loaded')) {
        console.log('Fallback: Adding spline-loaded class after 2s timeout');
        
        // Clean up progress simulation
        if (progressSimulation) {
          clearInterval(progressSimulation);
          progressSimulation = null;
        }
        
        // Update to 100% on fallback
        updateSplineProgress(container, 100);
        // Hide the preloader on fallback too
        hideSplinePreloader(container);
        
        // Show Spline with fade-from-below effect
        setTimeout(() => {
          viewer.style.visibility = 'visible';
          viewer.style.opacity = '1';
          viewer.style.transform = 'translateY(0)';
          container.classList.add('spline-loaded');
        }, 100);
      }
    }, 2000);


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
    
    // Load Spline immediately when visible - no delays
    loadSplineViewerScript().then(() => injectOneSpline(container));
  };

  let initIndex = 0;
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      
      const container = entry.target;
      if (container.__splineInitialized) return;
      
      // Start loading immediately with minimal stagger
      const myIndex = initIndex++;
      setTimeout(() => startForContainer(container), myIndex * STAGGER_MS);
      io.unobserve(container);
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

  // Show preloaders immediately for all Spline containers
  splineContainers.forEach(container => {
    if (shouldLoadSpline()) {
      const preloader = createSplinePreloader(container);
      container.appendChild(preloader);
    }
  });
});
  