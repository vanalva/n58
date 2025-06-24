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
  
        // Pause at start or end depending on direction
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
            anim.setDirection(1);
  
            // 🧠 If it's stuck at frame 0, bump to frame 1 to force animation to resume
            if (Math.floor(anim.currentFrame) === 0) {
              anim.goToAndStop(1, true);
            }
  
            // Optional skip logic if you still want it
            // const skipFrames = 100;
            // const adjusted = Math.min(anim.currentFrame + skipFrames, anim.totalFrames - 1);
            // anim.goToAndStop(adjusted, true);
  
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
  