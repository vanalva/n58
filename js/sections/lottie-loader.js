document.addEventListener('DOMContentLoaded', () => {
    const lottieContainers = document.querySelectorAll('[data-lottie]');
    if (!lottieContainers.length) return;
  
    const loadLottieScript = () => {
      return new Promise((resolve) => {
        if (window.lottie) return resolve(); // Already loaded
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
          container: container,
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
            anim.play();
          });
  
          container.addEventListener('mouseleave', () => {
            const skipFrames = 100; // your original logic
            const current = anim.currentFrame;
            const adjusted = Math.min(current + skipFrames, anim.totalFrames - 1);
  
            // ✅ Only skip frames if we’re not already near the end
            if (adjusted > current) {
              anim.goToAndStop(adjusted, true);
            }
  
            anim.setDirection(1);
            anim.play();
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
  