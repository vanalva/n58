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
          loop: false, // Play once on load
          autoplay: true,
          path: jsonURL
        });
  
        // When animation finishes, pause at last frame
        anim.addEventListener('complete', () => {
          anim.goToAndStop(anim.totalFrames - 1, true); // force stop at visual end
        });
  
        // Apply special hover behavior to navbar logo
        if (container.classList.contains('lottie-logo')) {
          container.addEventListener('mouseenter', () => {
            anim.setDirection(-1); // reverse
            anim.play();
          });
  
          container.addEventListener('mouseleave', () => {
            anim.setDirection(1); // forward
            
            // Skip past dead frames if needed
            const skipFrames = 100; // tweak this number if needed
            const current = anim.currentFrame;
            const adjusted = Math.min(current + skipFrames, anim.totalFrames - 1);
            anim.goToAndStop(adjusted, true);
  
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
  // Test for git q alias
