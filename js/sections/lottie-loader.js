document.addEventListener('DOMContentLoaded', () => {
    const lottieContainers = document.querySelectorAll('[data-lottie]');
    if (!lottieContainers.length) return;
  
    const loadLottieScript = () => {
      return new Promise((resolve) => {
        if (window.lottie) return resolve();
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/bodymovin/5.10.2/lottie.min.js';
        script.onload = resolve;
        document.body.appendChild(script);
      });
    };
  
    const injectLottieAnimations = () => {
      lottieContainers.forEach(container => {
        const jsonURL = container.getAttribute('data-lottie');
        if (!jsonURL) return;
  
        const anim = window.lottie.loadAnimation({
          container,
          renderer: 'svg',
          loop: false,
          autoplay: true,
          path: jsonURL
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
            anim.setDirection(-1);
            anim.setSpeed(1); // Normal reverse speed
            anim.play();
          });
  
          container.addEventListener('mouseleave', () => {
            anim.setDirection(1);
            anim.setSpeed(1); // Ensure not super fast
            anim.play();      // Always resume from current frame
          });
        }
      });
    };
  
    const lazyLoadLotties = () => {
      loadLottieScript().then(() => {
        injectLottieAnimations();
      });
    };
  
    if ('requestIdleCallback' in window) {
      requestIdleCallback(lazyLoadLotties);
    } else {
      setTimeout(lazyLoadLotties, 1200);
    }
  });
  