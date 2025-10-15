/**
 * Critical CSS Optimization for FCP Performance
 * Inlines critical CSS and defers non-critical styles
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';
  
  // Critical CSS for above-the-fold content
  const criticalCSS = `
    /* Critical above-the-fold styles */
    body {
      font-family: 'Nugros', sans-serif;
      margin: 0;
      padding: 0;
      background-color: var(--oro-negro);
      color: var(--caldito-de-pollo);
    }
    
    /* Critical header styles */
    .main-navbar {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 1000;
      background: var(--oro-negro);
      border-bottom: 1px solid var(--te-quiero-verde);
    }
    
    /* Critical hero section */
    .spline-header {
      min-height: 100vh;
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
    }
    
    /* Critical text styles */
    .main-title {
      font-size: 3rem;
      font-weight: 700;
      line-height: 1.2;
      color: var(--caldito-de-pollo);
      text-align: center;
      margin: 0;
    }
    
    /* Critical button styles */
    .notch-button {
      background: var(--te-quiero-verde);
      color: var(--oro-negro);
      border: none;
      padding: 1rem 2rem;
      font-family: 'Nugros', sans-serif;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
    }
    
    /* Critical loader styles */
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
      width: 320px;
      height: 16px;
      background: transparent;
      border: 2px solid var(--te-quiero-verde);
      position: relative;
      overflow: hidden;
    }
    
    .bar-fill {
      height: 100%;
      background: var(--te-quiero-verde);
      width: 0%;
      animation: barLoad 2.5s ease-out forwards;
      position: absolute;
      top: 0;
      left: 0;
    }
    
    @keyframes barLoad {
      0% { width: 0%; }
      100% { width: 100%; }
    }
    
    /* Hide loader when loaded */
    body.loaded #n58-page-loader {
      opacity: 0;
      visibility: hidden;
      transition: opacity 0.3s ease, visibility 0.3s ease;
    }
    
    /* Critical responsive styles */
    @media screen and (max-width: 767px) {
      .main-title {
        font-size: 2rem;
        line-height: 1.3;
      }
      
      .spline-header {
        min-height: 60vh;
      }
      
      .spline-container.home {
        min-height: 30vh;
      }
    }
  `;
  
  // Inject critical CSS immediately
  const injectCriticalCSS = () => {
    const style = document.createElement('style');
    style.id = 'critical-css';
    style.textContent = criticalCSS;
    document.head.insertBefore(style, document.head.firstChild);
    console.log('Critical CSS injected');
  };
  
  // Defer non-critical CSS
  const deferNonCriticalCSS = () => {
    const nonCriticalCSS = [
      'css/sections/cambio-marquee.css',
      'css/sections/chatbot.css',
      'css/sections/forms.css'
    ];
    
    nonCriticalCSS.forEach(cssFile => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'style';
      link.href = cssFile;
      link.onload = function() {
        this.rel = 'stylesheet';
      };
      document.head.appendChild(link);
    });
    
    console.log('Non-critical CSS deferred');
  };
  
  // Optimize font loading
  const optimizeFontLoading = () => {
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
    
    // Add font-display: swap for better performance
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
    
    console.log('Font loading optimized');
  };
  
  // Initialize critical optimizations
  const initCriticalOptimizations = () => {
    // Inject critical CSS immediately
    injectCriticalCSS();
    
    // Optimize font loading
    optimizeFontLoading();
    
    // Defer non-critical CSS after a short delay
    setTimeout(deferNonCriticalCSS, 100);
    
    console.log('Critical optimizations initialized');
  };
  
  // Start optimizations immediately
  initCriticalOptimizations();
});
