/**
 * INTELLIMIZE BLOCKER
 * Completely blocks and disables Intellimize to improve performance
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';
  
  console.log('🚫 INTELLIMIZE BLOCKER ACTIVATED');
  
  // Method 1: Block Intellimize domains via CSP
  const blockIntellimizeCSP = () => {
    const meta = document.createElement('meta');
    meta.httpEquiv = 'Content-Security-Policy';
    meta.content = `
      default-src 'self';
      script-src 'self' 'unsafe-inline' 'unsafe-eval' https://n58.pages.dev https://cdnjs.cloudflare.com https://unpkg.com;
      style-src 'self' 'unsafe-inline' https://n58.pages.dev;
      img-src 'self' data: https:;
      connect-src 'self' https://n58.pages.dev;
      font-src 'self' https://n58.pages.dev;
      object-src 'none';
      base-uri 'self';
      form-action 'self';
      frame-ancestors 'none';
    `.replace(/\s+/g, ' ').trim();
    document.head.appendChild(meta);
    console.log('🛡️ CSP blocking Intellimize domains');
  };
  
  // Method 2: Block Intellimize script loading
  const blockIntellimizeScripts = () => {
    // Override document.createElement to block Intellimize scripts
    const originalCreateElement = document.createElement;
    document.createElement = function(tagName) {
      const element = originalCreateElement.call(this, tagName);
      
      if (tagName.toLowerCase() === 'script') {
        const originalSetAttribute = element.setAttribute;
        element.setAttribute = function(name, value) {
          if (name === 'src' && (
            value.includes('intellimize') ||
            value.includes('cdn.intellimize.co') ||
            value.includes('api.intellimize.co')
          )) {
            console.log('🚫 Blocked Intellimize script:', value);
            return; // Don't set the src attribute
          }
          return originalSetAttribute.call(this, name, value);
        };
      }
      
      return element;
    };
    
    // Block existing Intellimize scripts
    const intellimizeScripts = document.querySelectorAll('script[src*="intellimize"]');
    intellimizeScripts.forEach(script => {
      console.log('🚫 Removing existing Intellimize script:', script.src);
      script.remove();
    });
  };
  
  // Method 3: Block Intellimize network requests
  const blockIntellimizeRequests = () => {
    // Override fetch
    const originalFetch = window.fetch;
    window.fetch = function(url, options) {
      if (typeof url === 'string' && (
        url.includes('intellimize') ||
        url.includes('cdn.intellimize.co') ||
        url.includes('api.intellimize.co')
      )) {
        console.log('🚫 Blocked Intellimize fetch request:', url);
        return Promise.reject(new Error('Intellimize request blocked'));
      }
      return originalFetch.call(this, url, options);
    };
    
    // Override XMLHttpRequest
    const originalXHROpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(method, url) {
      if (typeof url === 'string' && (
        url.includes('intellimize') ||
        url.includes('cdn.intellimize.co') ||
        url.includes('api.intellimize.co')
      )) {
        console.log('🚫 Blocked Intellimize XHR request:', url);
        return;
      }
      return originalXHROpen.call(this, method, url);
    };
  };
  
  // Method 4: Remove Intellimize from window object
  const removeIntellimizeGlobal = () => {
    // Remove Intellimize from window
    if (window.intellimize) {
      console.log('🚫 Removing window.intellimize');
      delete window.intellimize;
    }
    
    // Remove Intellimize functions
    const intellimizeKeys = Object.keys(window).filter(key => 
      key.toLowerCase().includes('intellimize')
    );
    intellimizeKeys.forEach(key => {
      console.log('🚫 Removing window.' + key);
      delete window[key];
    });
  };
  
  // Method 5: Block Intellimize iframes
  const blockIntellimizeIframes = () => {
    const intellimizeIframes = document.querySelectorAll('iframe[src*="intellimize"]');
    intellimizeIframes.forEach(iframe => {
      console.log('🚫 Removing Intellimize iframe:', iframe.src);
      iframe.remove();
    });
    
    // Monitor for new iframes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.tagName === 'IFRAME' && node.src && node.src.includes('intellimize')) {
            console.log('🚫 Blocked new Intellimize iframe:', node.src);
            node.remove();
          }
        });
      });
    });
    
    observer.observe(document.body, { childList: true, subtree: true });
  };
  
  // Method 6: Override Intellimize functions
  const overrideIntellimizeFunctions = () => {
    // Create dummy Intellimize object
    window.intellimize = {
      init: () => console.log('🚫 Intellimize.init() blocked'),
      track: () => console.log('🚫 Intellimize.track() blocked'),
      identify: () => console.log('🚫 Intellimize.identify() blocked'),
      page: () => console.log('🚫 Intellimize.page() blocked'),
      experiment: () => console.log('🚫 Intellimize.experiment() blocked'),
      variation: () => console.log('🚫 Intellimize.variation() blocked')
    };
    
    // Override common Intellimize function names
    const functionNames = [
      'intellimizeInit',
      'intellimizeTrack', 
      'intellimizeIdentify',
      'intellimizePage',
      'intellimizeExperiment',
      'intellimizeVariation'
    ];
    
    functionNames.forEach(funcName => {
      window[funcName] = () => console.log(`🚫 ${funcName}() blocked`);
    });
  };
  
  // Method 7: Remove Intellimize CSS
  const removeIntellimizeCSS = () => {
    const intellimizeStyles = document.querySelectorAll('style, link[rel="stylesheet"]');
    intellimizeStyles.forEach(style => {
      if (style.textContent && style.textContent.includes('intellimize')) {
        console.log('🚫 Removing Intellimize CSS');
        style.remove();
      }
      if (style.href && style.href.includes('intellimize')) {
        console.log('🚫 Removing Intellimize CSS link:', style.href);
        style.remove();
      }
    });
  };
  
  // Method 8: Block Intellimize cookies and localStorage
  const blockIntellimizeStorage = () => {
    // Block Intellimize cookies
    const intellimizeCookies = document.cookie.split(';').filter(cookie => 
      cookie.includes('intellimize')
    );
    intellimizeCookies.forEach(cookie => {
      const cookieName = cookie.split('=')[0].trim();
      document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
      console.log('🚫 Removed Intellimize cookie:', cookieName);
    });
    
    // Block Intellimize localStorage
    const intellimizeKeys = Object.keys(localStorage).filter(key => 
      key.toLowerCase().includes('intellimize')
    );
    intellimizeKeys.forEach(key => {
      console.log('🚫 Removed Intellimize localStorage:', key);
      localStorage.removeItem(key);
    });
  };
  
  // Initialize all blocking methods
  const initIntellimizeBlocker = () => {
    console.log('🚫 Initializing Intellimize blocker...');
    
    // Apply all blocking methods
    blockIntellimizeCSP();
    blockIntellimizeScripts();
    blockIntellimizeRequests();
    removeIntellimizeGlobal();
    blockIntellimizeIframes();
    overrideIntellimizeFunctions();
    removeIntellimizeCSS();
    blockIntellimizeStorage();
    
    console.log('✅ Intellimize completely blocked!');
  };
  
  // Start blocking immediately
  initIntellimizeBlocker();
  
  // Re-apply blocking after page load (in case Intellimize loads later)
  window.addEventListener('load', () => {
    setTimeout(() => {
      removeIntellimizeGlobal();
      blockIntellimizeStorage();
      console.log('🔄 Re-applied Intellimize blocking');
    }, 1000);
  });
  
  // Monitor for any remaining Intellimize activity
  setInterval(() => {
    if (window.intellimize && typeof window.intellimize === 'object') {
      console.log('🚫 Intellimize detected, re-blocking...');
      removeIntellimizeGlobal();
      overrideIntellimizeFunctions();
    }
  }, 5000);
});
