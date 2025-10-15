document.addEventListener('DOMContentLoaded', () => {
  const lottieContainers = document.querySelectorAll('[data-lottie]');
  if (!lottieContainers.length) return;

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

    // Load script first
    loadLottieScript().then(() => {
      // Start all visible Lotties immediately
      lottieContainers.forEach((container) => {
        const rect = container.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
        
        if (isVisible) {
          initOneLottie(container);
        }
      });

      // Set up intersection observer for remaining ones
      const io = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            initOneLottie(entry.target);
            io.unobserve(entry.target);
          }
        });
      }, { rootMargin: '100px 0px', threshold: 0.1 });

      // Observe containers that weren't immediately visible
      lottieContainers.forEach((container) => {
        if (!container.__lottieInitialized) {
          io.observe(container);
        }
      });
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