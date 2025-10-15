/**
 * ULTIMATE PERFORMANCE OPTIMIZER
 * Fixes all identified bottlenecks for mobile performance
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';
  
  console.log('🚀 ULTIMATE PERFORMANCE OPTIMIZER STARTING...');
  
  // Remove duplicate CSS links
  const removeDuplicateCSS = () => {
    const cssLinks = document.querySelectorAll('link[rel="stylesheet"]');
    const seenHrefs = new Set();
    
    cssLinks.forEach(link => {
      const href = link.href;
      if (seenHrefs.has(href)) {
        console.log(`🗑️ Removing duplicate CSS: ${href}`);
        link.remove();
      } else {
        seenHrefs.add(href);
      }
    });
  };
  
  // Defer non-critical CSS (only your custom CSS files)
  const deferNonCriticalCSS = () => {
    const nonCriticalCSS = [
      'cambio-marquee.css',
      'inicio.css'
    ];
    
    nonCriticalCSS.forEach(cssFile => {
      const existingLink = document.querySelector(`link[href*="${cssFile}"]`);
      if (existingLink) {
        // Convert to preload, then load as stylesheet
        existingLink.rel = 'preload';
        existingLink.as = 'style';
        existingLink.onload = function() {
          this.rel = 'stylesheet';
        };
        console.log(`⏳ Deferred CSS: ${cssFile}`);
      }
    });
  };
  
  // Optimize Webflow CSS loading
  const optimizeWebflowCSS = () => {
    const webflowCSS = document.querySelector('link[href*="webflow.css"]');
    if (webflowCSS) {
      // Add media query to load only on larger screens initially
      webflowCSS.media = 'screen and (min-width: 768px)';
      
      // Load for mobile after page load
      window.addEventListener('load', () => {
        setTimeout(() => {
          webflowCSS.media = 'all';
          console.log('📱 Webflow CSS loaded for mobile');
        }, 1000);
      });
    }
  };
  
  // Critical resource hints
  const addCriticalResourceHints = () => {
    const hints = [
      { rel: 'preconnect', href: 'https://n58.pages.dev' },
      { rel: 'preconnect', href: 'https://cdn.prod.website-files.com' },
      { rel: 'dns-prefetch', href: 'https://cdnjs.cloudflare.com' }
    ];
    
    hints.forEach(hint => {
      // Check if hint already exists
      const existing = document.querySelector(`link[rel="${hint.rel}"][href="${hint.href}"]`);
      if (!existing) {
        const link = document.createElement('link');
        link.rel = hint.rel;
        link.href = hint.href;
        document.head.appendChild(link);
        console.log(`🔗 Added resource hint: ${hint.rel} ${hint.href}`);
      }
    });
  };
  
  // Optimize font loading
  const optimizeFonts = () => {
    // Preload critical fonts with highest priority
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
      link.setAttribute('fetchpriority', 'high');
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
    
    console.log('🔤 Fonts optimized');
  };
  
  // Optimize images for mobile
  const optimizeMobileImages = () => {
    if (window.innerWidth <= 768) {
      // Preload critical hero image
      const heroImage = document.createElement('link');
      heroImage.rel = 'preload';
      heroImage.as = 'image';
      heroImage.href = 'https://n58.pages.dev/images/n58-main-hero-fallback.webp';
      heroImage.setAttribute('fetchpriority', 'high');
      heroImage.setAttribute('loading', 'eager');
      document.head.appendChild(heroImage);
      
      // Optimize Spline containers for mobile
      const splineContainers = document.querySelectorAll('.spline-container');
      splineContainers.forEach(container => {
        container.style.contentVisibility = 'auto';
        container.style.containIntrinsicSize = '50vh';
      });
      
      // Optimize all images for mobile
      const allImages = document.querySelectorAll('img');
      allImages.forEach(img => {
        if (!img.hasAttribute('loading')) {
          img.setAttribute('loading', 'lazy');
        }
        if (!img.hasAttribute('decoding')) {
          img.setAttribute('decoding', 'async');
        }
      });
      
      console.log('📱 Mobile images optimized');
    }
  };
  
  // Defer non-critical JavaScript
  const deferNonCriticalJS = () => {
    const nonCriticalScripts = [
      'js/sections/chatbot-loader.js',
      'js/sections/cambio-marquee.js'
    ];
    
    // Load after page is interactive
    window.addEventListener('load', () => {
      setTimeout(() => {
        nonCriticalScripts.forEach(scriptSrc => {
          const script = document.createElement('script');
          script.src = scriptSrc;
          script.async = true;
          script.defer = true;
          document.body.appendChild(script);
          console.log(`⏳ Deferred JS: ${scriptSrc}`);
        });
      }, 2000);
    });
  };
  
  // Critical CSS injection
  const injectCriticalCSS = () => {
    const criticalCSS = `
      /* Critical mobile-first CSS */
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
        border-bottom: 1px solid var(--te-quiero-verde);
      }
      
      .spline-header {
        min-height: 60vh;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
      }
      
      .spline-container.home {
        width: 100%;
        height: 100%;
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;
        min-height: 30vh;
      }
      
      .main-title {
        font-size: 2rem;
        font-weight: 700;
        line-height: 1.3;
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
      
      .bar-container {
        width: 280px;
        height: 14px;
        background: transparent;
        border: 2px solid var(--te-quiero-verde);
        position: relative;
        overflow: hidden;
      }
      
      .bar-fill {
        height: 100%;
        background: var(--te-quiero-verde);
        width: 0%;
        animation: barLoad 2s ease-out forwards;
        position: absolute;
        top: 0;
        left: 0;
      }
      
      @keyframes barLoad {
        0% { width: 0%; }
        100% { width: 100%; }
      }
      
      body.loaded #n58-page-loader {
        opacity: 0;
        visibility: hidden;
        transition: opacity 0.3s ease, visibility 0.3s ease;
      }
      
      /* Desktop optimizations */
      @media screen and (min-width: 768px) {
        .main-title { font-size: 3rem; line-height: 1.2; }
        .spline-header { min-height: 100vh; }
        .spline-container.home { min-height: 50vh; }
        .bar-container { width: 320px; height: 16px; }
      }
    `;
    
    const style = document.createElement('style');
    style.id = 'critical-mobile-css';
    style.textContent = criticalCSS;
    document.head.insertBefore(style, document.head.firstChild);
    
    console.log('🎨 Critical CSS injected');
  };
  
  // Initialize all optimizations
  const initUltimateOptimizations = () => {
    console.log('🚀 Starting ultimate performance optimizations...');
    
    // 1. Remove duplicates first
    removeDuplicateCSS();
    
    // 2. Add critical resource hints
    addCriticalResourceHints();
    
    // 3. Inject critical CSS immediately
    injectCriticalCSS();
    
    // 4. Optimize fonts
    optimizeFonts();
    
    // 5. Optimize mobile images
    optimizeMobileImages();
    
    // 6. Defer non-critical CSS
    setTimeout(deferNonCriticalCSS, 50);
    
    // 7. Optimize Webflow CSS
    setTimeout(optimizeWebflowCSS, 100);
    
    // 8. Defer non-critical JS
    deferNonCriticalJS();
    
    console.log('✅ Ultimate performance optimizations completed!');
  };
  
  // Start optimizations immediately
  initUltimateOptimizations();
  
  // Clean up after page load
  window.addEventListener('load', () => {
    setTimeout(() => {
      // Remove any unused performance scripts
      const unusedScripts = document.querySelectorAll('script[data-unused]');
      unusedScripts.forEach(script => script.remove());
      
      console.log('🧹 Cleanup completed');
    }, 3000);
  });
});
