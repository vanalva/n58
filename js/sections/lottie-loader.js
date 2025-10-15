document.addEventListener('DOMContentLoaded', () => {
  const lottieContainers = document.querySelectorAll('[data-lottie]');
  if (!lottieContainers.length) return;

  // Defer Lottie loading - load after critical content
  const LOTTIE_DELAY_MS = 2000;  // Wait only 2 seconds after page load
  const IO_ROOT_MARGIN = '200px 0px';  // Load when reasonably close

  let scriptLoading = null;
  let lottieReady = false;

  const loadLottieScript = () => {
    if (window.lottie) return Promise.resolve();
    if (scriptLoading) return scriptLoading;

    scriptLoading = new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/bodymovin/5.10.2/lottie.min.js';
      script.async = true;
      script.defer = true;
      script.onload = () => resolve();
      document.head.appendChild(script);
    });

    return scriptLoading;
  };

  const initOneLottie = (container) => {
    if (container.__lottieInitialized) return;

    const jsonURL = container.getAttribute('data-lottie');
    if (!jsonURL) return;

    // Fade-in entrance
    container.classList.add('lottie-enter');

    const anim = window.lottie.loadAnimation({
      container,
      renderer: 'svg',
      loop: false,
      autoplay: true,
      path: jsonURL,
      rendererSettings: {
        progressiveLoad: true,
        preserveAspectRatio: 'xMidYMid slice',
        hideOnTransparent: true
      }
    });

    anim.addEventListener('complete', () => {
      const direction = anim.playDirection;
      if (direction === 1) {
        anim.goToAndStop(anim.totalFrames - 1, true);
      } else {
        anim.goToAndStop(0, true);
      }
    });

    if (container.classList.contains('lottie-logo')) {
      container.addEventListener('mouseenter', () => {
        const skipFrames = 15;
        const adjusted = Math.max(anim.currentFrame - skipFrames, 0);
        anim.goToAndStop(adjusted, true);
        anim.setDirection(-1);
        anim.setSpeed(1);
        anim.play();
      });

      container.addEventListener('mouseleave', () => {
        anim.setDirection(1);
        anim.setSpeed(1);
        anim.play();
      });
    }

    // Smooth initialization - wait for first frame before marking as ready
    anim.addEventListener('DOMLoaded', () => {
      container.__lottieAnimation = anim;
      
      // Trigger transition on next frames
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          container.classList.add('lottie-enter-active');
          container.classList.remove('lottie-enter');
        });
      });
      
      container.__lottieInitialized = true;
    });
  };

  const startLottieLoading = () => {
    if (lottieReady) return;
    lottieReady = true;

    // Wait for page to be fully loaded and idle before loading Lottie
    const whenReady = new Promise((resolve) => {
      window.addEventListener('load', () => {
        setTimeout(resolve, LOTTIE_DELAY_MS);
      });
      // Fallback timeout
      setTimeout(resolve, LOTTIE_DELAY_MS + 2000);
    });

    whenReady.then(() => {
      // Load script only when truly idle
      if ('requestIdleCallback' in window) {
        requestIdleCallback(() => {
          loadLottieScript().then(() => {
            setupIntersectionObserver();
          });
        }, { timeout: 3000 }); // Shorter timeout for Lottie
      } else {
        setTimeout(() => {
          loadLottieScript().then(() => {
            setupIntersectionObserver();
          });
        }, 500); // Much shorter fallback for Lottie
      }
    });
  };

  const setupIntersectionObserver = () => {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !entry.target.__lottieInitialized) {
          initOneLottie(entry.target);
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: IO_ROOT_MARGIN, threshold: 0.3 }); // Lower threshold for Lottie

    // Observe all containers
    lottieContainers.forEach((container) => {
      io.observe(container);
    });
  };

  // Start Lottie loading immediately when preloader finishes
  const checkPreloaderFinished = () => {
    if (document.body.classList.contains('loaded')) {
      startLottieLoading();
    } else {
      // Check again in 50ms
      setTimeout(checkPreloaderFinished, 50);
    }
  };

  // Start checking immediately
  checkPreloaderFinished();
});