/**
 * INTELLIMIZE NUKER - AGGRESSIVE VERSION
 * Completely destroys Intellimize with maximum force
 */

(function() {
  'use strict';
  
  console.log('💥 INTELLIMIZE NUKER ACTIVATED');
  
  // IMMEDIATE BLOCKING - Run before any other scripts
  
  // 1. Block all Intellimize domains immediately
  const blockDomains = [
    'cdn.intellimize.co',
    'api.intellimize.co', 
    'intellimize.co',
    '*.intellimize.co'
  ];
  
  // 2. Override fetch immediately
  if (window.fetch) {
    const originalFetch = window.fetch;
    window.fetch = function(url, options) {
      if (typeof url === 'string') {
        for (const domain of blockDomains) {
          if (url.includes(domain.replace('*.', ''))) {
            console.log('💥 NUKED Intellimize fetch:', url);
            return Promise.reject(new Error('Intellimize NUKED'));
          }
        }
      }
      return originalFetch.call(this, url, options);
    };
  }
  
  // 3. Override XMLHttpRequest immediately
  if (window.XMLHttpRequest) {
    const originalOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(method, url) {
      if (typeof url === 'string') {
        for (const domain of blockDomains) {
          if (url.includes(domain.replace('*.', ''))) {
            console.log('💥 NUKED Intellimize XHR:', url);
            return;
          }
        }
      }
      return originalOpen.call(this, method, url);
    };
  }
  
  // 4. Block script creation immediately
  const originalCreateElement = document.createElement;
  document.createElement = function(tagName) {
    const element = originalCreateElement.call(this, tagName);
    
    if (tagName.toLowerCase() === 'script') {
      const originalSetAttribute = element.setAttribute;
      element.setAttribute = function(name, value) {
        if (name === 'src' && typeof value === 'string') {
          for (const domain of blockDomains) {
            if (value.includes(domain.replace('*.', ''))) {
              console.log('💥 NUKED Intellimize script:', value);
              return; // Don't set src
            }
          }
        }
        return originalSetAttribute.call(this, name, value);
      };
    }
    
    return element;
  };
  
  // 5. Nuke Intellimize from window object
  const nukeIntellimize = () => {
    // Delete Intellimize objects
    delete window.intellimize;
    delete window.Intellimize;
    delete window._intellimize;
    
    // Delete Intellimize functions
    const keys = Object.keys(window);
    keys.forEach(key => {
      if (key.toLowerCase().includes('intellimize')) {
        console.log('💥 NUKED window.' + key);
        delete window[key];
      }
    });
    
    // Create dummy Intellimize to prevent errors
    window.intellimize = {
      init: () => {},
      track: () => {},
      identify: () => {},
      page: () => {},
      experiment: () => {},
      variation: () => {},
      ready: () => {},
      on: () => {},
      off: () => {}
    };
  };
  
  // 6. Nuke Intellimize storage
  const nukeStorage = () => {
    // Nuke cookies
    document.cookie.split(';').forEach(cookie => {
      const name = cookie.split('=')[0].trim();
      if (name.toLowerCase().includes('intellimize')) {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=.${window.location.hostname}`;
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
        console.log('💥 NUKED cookie:', name);
      }
    });
    
    // Nuke localStorage
    Object.keys(localStorage).forEach(key => {
      if (key.toLowerCase().includes('intellimize')) {
        localStorage.removeItem(key);
        console.log('💥 NUKED localStorage:', key);
      }
    });
    
    // Nuke sessionStorage
    Object.keys(sessionStorage).forEach(key => {
      if (key.toLowerCase().includes('intellimize')) {
        sessionStorage.removeItem(key);
        console.log('💥 NUKED sessionStorage:', key);
      }
    });
  };
  
  // 7. Nuke Intellimize elements
  const nukeElements = () => {
    // Remove scripts
    document.querySelectorAll('script').forEach(script => {
      if (script.src) {
        for (const domain of blockDomains) {
          if (script.src.includes(domain.replace('*.', ''))) {
            console.log('💥 NUKED script:', script.src);
            script.remove();
          }
        }
      }
    });
    
    // Remove iframes
    document.querySelectorAll('iframe').forEach(iframe => {
      if (iframe.src) {
        for (const domain of blockDomains) {
          if (iframe.src.includes(domain.replace('*.', ''))) {
            console.log('💥 NUKED iframe:', iframe.src);
            iframe.remove();
          }
        }
      }
    });
    
    // Remove stylesheets
    document.querySelectorAll('link[rel="stylesheet"]').forEach(link => {
      if (link.href) {
        for (const domain of blockDomains) {
          if (link.href.includes(domain.replace('*.', ''))) {
            console.log('💥 NUKED stylesheet:', link.href);
            link.remove();
          }
        }
      }
    });
  };
  
  // 8. Continuous nuking
  const continuousNuke = () => {
    nukeIntellimize();
    nukeStorage();
    nukeElements();
  };
  
  // Start nuking immediately
  continuousNuke();
  
  // Nuke on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', continuousNuke);
  } else {
    continuousNuke();
  }
  
  // Nuke on window load
  window.addEventListener('load', continuousNuke);
  
  // Continuous nuking every 100ms for first 10 seconds
  let nukeCount = 0;
  const nukeInterval = setInterval(() => {
    continuousNuke();
    nukeCount++;
    if (nukeCount >= 100) { // 10 seconds
      clearInterval(nukeInterval);
      console.log('💥 Initial nuking phase complete');
    }
  }, 100);
  
  // Periodic nuking every 5 seconds
  setInterval(continuousNuke, 5000);
  
  console.log('💥 INTELLIMIZE NUKER READY - Intellimize will be DESTROYED');
})();
