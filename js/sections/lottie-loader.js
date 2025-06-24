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
          loop: false, // 👈 Only play once on load
          autoplay: true,
          path: jsonURL
        });
  
        anim.addEventListener('complete', () => {
          anim.pause(); // ⏸ Pause at the end of first loop
        });
  
        // Add hover interactions for logos
        if (container.classList.contains('lottie-logo')) {
          container.addEventListener('mouseenter', () => {
            anim.setDirection(-1); // 👈 Reverse
            anim.play();
          });
  
          container.addEventListener('mouseleave', () => {
            anim.setDirection(1); // ▶️ Forward again
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
  