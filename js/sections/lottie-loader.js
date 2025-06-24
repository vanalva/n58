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
  
        window.lottie.loadAnimation({
          container: container,
          renderer: 'svg',
          loop: true,
          autoplay: true,
          path: jsonURL
        });
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
  