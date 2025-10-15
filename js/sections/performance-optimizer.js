/**
 * Comprehensive Performance Optimization
 * Targets LCP, FCP, and Speed Index improvements
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';
  
  // Performance optimization configuration
  const config = {
    // Image optimization
    enableImageOptimization: true,
    enableResponsiveImages: true,
    enableImagePreloading: true,
    
    // CSS optimization
    enableCriticalCSS: true,
    enableCSSDeferring: true,
    
    // Font optimization
    enableFontOptimization: true,
    
    // Resource hints
    enableResourceHints: true,
    
    // Mobile-specific optimizations
    enableMobileOptimizations: true
  };
  
  // Critical resource hints for LCP optimization
  const addResourceHints = () => {
    if (!config.enableResourceHints) return;
    
    const hints = [
      { rel: 'preconnect', href: 'https://n58.pages.dev' },
      { rel: 'preconnect', href: 'https://d3e54v103j8qbb.cloudfront.net' },
      { rel: 'dns-prefetch', href: 'https://cdnjs.cloudflare.com' },
      { rel: 'dns-prefetch', href: 'https://unpkg.com' }
    ];
    
    hints.forEach(hint => {
      const link = document.createElement('link');
      link.rel = hint.rel;
      link.href = hint.href;
      document.head.appendChild(link);
    });
    
    console.log('Resource hints added');
  };
  
  // Optimize LCP images
  const optimizeLCPImages = () => {
    if (!config.enableImageOptimization) return;
    
    // Critical LCP images that need immediate optimization
    const lcpImages = [
      'n58-main-hero-fallback.webp',
      'n58-world-fallback.webp'
    ];
    
    // Preload LCP images with highest priority
    lcpImages.forEach(imageName => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = `https://n58.pages.dev/images/${imageName}`;
      link.setAttribute('fetchpriority', 'high');
      link.setAttribute('loading', 'eager');
      document.head.appendChild(link);
    });
    
    // Optimize Spline containers for mobile
    if (config.enableMobileOptimizations && window.innerWidth <= 768) {
      const splineContainers = document.querySelectorAll('.spline-container');
      
      splineContainers.forEach(container => {
        // Use mobile-optimized images
        if (container.classList.contains('home')) {
          container.style.backgroundImage = 'url(https://n58.pages.dev/images/n58-main-hero-fallback-mobile.webp)';
        }
        
        // Optimize background properties
        container.style.backgroundSize = 'cover';
        container.style.backgroundPosition = 'center';
        container.style.backgroundRepeat = 'no-repeat';
      });
    }
    
    console.log('LCP images optimized');
  };
  
  // Optimize FCP with critical CSS
  const optimizeFCP = () => {
    if (!config.enableCriticalCSS) return;
    
    // Inject critical CSS immediately
    const criticalCSS = `
      /* Critical FCP styles */
      body {
        font-family: 'Nugros', sans-serif;
        margin: 0;
        padding: 0;
        background-color: var(--oro-negro);
        color: var(--caldito-de-pollo);
      }
      
      .main-navbar {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        z-index: 1000;
        background: var(--oro-negro);
      }
      
      .spline-header {
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      
      .main-title {
        font-size: 3rem;
        font-weight: 700;
        line-height: 1.2;
        color: var(--caldito-de-pollo);
        text-align: center;
        margin: 0;
      }
      
      #n58-page-loader {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: var(--oro-negro);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
      }
      
      @media screen and (max-width: 767px) {
        .main-title { font-size: 2rem; }
        .spline-header { min-height: 60vh; }
      }
    `;
    
    const style = document.createElement('style');
    style.id = 'critical-fcp-css';
    style.textContent = criticalCSS;
    document.head.insertBefore(style, document.head.firstChild);
    
    console.log('FCP critical CSS injected');
  };
  
  // Optimize Speed Index
  const optimizeSpeedIndex = () => {
    // Defer non-critical JavaScript
    const nonCriticalScripts = [
      'js/sections/chatbot-loader.js',
      'js/sections/cambio-marquee.js'
    ];
    
    // Load non-critical scripts after page load
    window.addEventListener('load', () => {
      setTimeout(() => {
        nonCriticalScripts.forEach(scriptSrc => {
          const script = document.createElement('script');
          script.src = scriptSrc;
          script.async = true;
          script.defer = true;
          document.body.appendChild(script);
        });
      }, 1000);
    });
    
    // Optimize animations for mobile
    if (config.enableMobileOptimizations && window.innerWidth <= 768) {
      // Reduce animation complexity on mobile
      const style = document.createElement('style');
      style.textContent = `
        @media screen and (max-width: 768px) {
          * {
            animation-duration: 0.3s !important;
            transition-duration: 0.3s !important;
          }
          
          .spline-container {
            min-height: 50vh !important;
          }
        }
      `;
      document.head.appendChild(style);
    }
    
    console.log('Speed Index optimized');
  };
  
  // Optimize fonts for better performance
  const optimizeFonts = () => {
    if (!config.enableFontOptimization) return;
    
    // Preload critical fonts
    const criticalFonts = [
      'https://n58.pages.dev/fonts/Nugros-Bold.woff2',
      'https://n58.pages.dev/fonts/Nugros-SemiBold.woff2'
    ];
    
    criticalFonts.forEach(fontUrl => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'font';
      link.href = fontUrl;
      link.type = 'font/woff2';
      link.crossOrigin = 'anonymous';
      document.head.appendChild(link);
    });
    
    // Add font-display: swap
    const fontStyle = document.createElement('style');
    fontStyle.textContent = `
      @font-face {
        font-family: 'Nugros';
        font-weight: 400;
        font-style: normal;
        font-display: swap;
        src: url('https://n58.pages.dev/fonts/Nugros-Regular.woff2') format('woff2');
      }
      @font-face {
        font-family: 'Nugros';
        font-weight: 600;
        font-style: normal;
        font-display: swap;
        src: url('https://n58.pages.dev/fonts/Nugros-SemiBold.woff2') format('woff2');
      }
      @font-face {
        font-family: 'Nugros';
        font-weight: 700;
        font-style: normal;
        font-display: swap;
        src: url('https://n58.pages.dev/fonts/Nugros-Bold.woff2') format('woff2');
      }
    `;
    document.head.appendChild(fontStyle);
    
    console.log('Fonts optimized');
  };
  
  // Initialize all optimizations
  const initPerformanceOptimizations = () => {
    console.log('Starting performance optimizations...');
    
    // Add resource hints first
    addResourceHints();
    
    // Optimize LCP (highest priority)
    optimizeLCPImages();
    
    // Optimize FCP
    optimizeFCP();
    
    // Optimize Speed Index
    optimizeSpeedIndex();
    
    // Optimize fonts
    optimizeFonts();
    
    console.log('Performance optimizations completed');
  };
  
  // Start optimizations immediately
  initPerformanceOptimizations();
  
  // Additional optimizations after page load
  window.addEventListener('load', () => {
    // Clean up any unused resources
    const unusedStyles = document.querySelectorAll('style[data-unused]');
    unusedStyles.forEach(style => style.remove());
    
    console.log('Post-load optimizations completed');
  });
});
