/**
 * Image Optimization for LCP Performance
 * Optimizes Spline fallback images to improve LCP scores
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';
  
  // Critical images that need immediate optimization
  const criticalImages = [
    'n58-main-hero-fallback.webp',
    'n58-world-fallback.webp', 
    'n58-folder-fallback.webp',
    'n58-alan-fallback.webp',
    'n58-form-fallback.webp',
    'n58-phone-fallback.webp',
    'n58-bag-fallback.webp',
    'n58-jenga-fallback.webp',
    'n58-shop-fallback.webp'
  ];
  
  // Preload critical images with high priority
  const preloadCriticalImages = () => {
    criticalImages.forEach(imageName => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = `https://n58.pages.dev/images/${imageName}`;
      link.setAttribute('fetchpriority', 'high');
      link.setAttribute('loading', 'eager');
      document.head.appendChild(link);
    });
  };
  
  // Optimize Spline container images for mobile
  const optimizeSplineImages = () => {
    const splineContainers = document.querySelectorAll('.spline-container');
    
    splineContainers.forEach(container => {
      // Add loading="lazy" to non-critical containers
      if (!container.classList.contains('home')) {
        container.style.contentVisibility = 'auto';
        container.style.containIntrinsicSize = '100vh';
      }
      
      // Optimize background images for mobile
      const computedStyle = window.getComputedStyle(container);
      const backgroundImage = computedStyle.backgroundImage;
      
      if (backgroundImage && backgroundImage !== 'none') {
        // Extract image URL from background-image CSS
        const urlMatch = backgroundImage.match(/url\(['"]?([^'"]+)['"]?\)/);
        if (urlMatch) {
          const imageUrl = urlMatch[1];
          
          // Create optimized image element
          const img = new Image();
          img.loading = 'eager';
          img.fetchpriority = 'high';
          img.decoding = 'async';
          
          // Preload the image
          img.src = imageUrl;
          
          // Add error handling
          img.onerror = () => {
            console.warn(`Failed to preload image: ${imageUrl}`);
          };
          
          img.onload = () => {
            console.log(`Successfully preloaded: ${imageUrl}`);
          };
        }
      }
    });
  };
  
  // Add responsive image loading
  const addResponsiveImageLoading = () => {
    // Create a style element for responsive image optimization
    const style = document.createElement('style');
    style.textContent = `
      /* Optimize Spline container images for mobile */
      @media screen and (max-width: 767px) {
        .spline-container {
          background-size: cover !important;
          background-position: center !important;
        }
        
        /* Reduce image quality on mobile for faster loading */
        .spline-container.home {
          background-image: url('https://n58.pages.dev/images/n58-main-hero-fallback-mobile.webp') !important;
        }
        
        .spline-container.conocenos {
          background-image: url('https://n58.pages.dev/images/n58-world-fallback-mobile.webp') !important;
        }
        
        .spline-container.documentos {
          background-image: url('https://n58.pages.dev/images/n58-folder-fallback-mobile.webp') !important;
        }
        
        .spline-container.preguntas-frecuentes {
          background-image: url('https://n58.pages.dev/images/n58-alan-fallback-mobile.webp') !important;
        }
        
        .spline-container.boletines {
          background-image: url('https://n58.pages.dev/images/n58-form-fallback-mobile.webp') !important;
        }
        
        .spline-container.reclamos {
          background-image: url('https://n58.pages.dev/images/n58-phone-fallback-mobile.webp') !important;
        }
        
        .spline-container.limites {
          background-image: url('https://n58.pages.dev/images/n58-bag-fallback-mobile.webp') !important;
        }
        
        .spline-container.empresas {
          background-image: url('https://n58.pages.dev/images/n58-jenga-fallback-mobile.webp') !important;
        }
        
        .spline-container.categorias {
          background-image: url('https://n58.pages.dev/images/n58-world-fallback-mobile.webp') !important;
        }
        
        .spline-container.personas {
          background-image: url('https://n58.pages.dev/images/n58-shop-fallback-mobile.webp') !important;
        }
      }
      
      /* Optimize for tablets */
      @media screen and (min-width: 768px) and (max-width: 1024px) {
        .spline-container {
          background-size: cover !important;
          background-position: center !important;
        }
      }
    `;
    
    document.head.appendChild(style);
  };
  
  // Initialize image optimization
  const initImageOptimization = () => {
    // Preload critical images immediately
    preloadCriticalImages();
    
    // Optimize Spline containers
    optimizeSplineImages();
    
    // Add responsive loading
    addResponsiveImageLoading();
    
    console.log('Image optimization initialized');
  };
  
  // Start optimization immediately
  initImageOptimization();
  
  // Also optimize on window load for any missed images
  window.addEventListener('load', () => {
    optimizeSplineImages();
  });
});
