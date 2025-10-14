/* ========================================
   Performance Utilities
   Shared throttle, debounce, and timing functions
   ======================================== */

/**
 * Throttle function using requestAnimationFrame
 * Limits function calls to once per animation frame
 * @param {Function} func - Function to throttle
 * @returns {Function} Throttled function
 */
export const throttle = (func) => {
  let ticking = false;
  return function(...args) {
    if (!ticking) {
      requestAnimationFrame(() => {
        func.apply(this, args);
        ticking = false;
      });
      ticking = true;
    }
  };
};

/**
 * Debounce function with configurable wait time
 * Delays function execution until after wait time has passed
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
export const debounce = (func, wait) => {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
};

/**
 * Wait for Largest Contentful Paint (LCP) + idle time
 * Used to defer non-critical scripts until page is ready
 * @returns {Promise} Resolves when ready
 */
export const whenReady = (() => {
  const MIN_DELAY_AFTER_LCP_MS = 400;
  
  return new Promise((resolve) => {
    let resolved = false;
    const safeResolve = () => {
      if (resolved) return;
      resolved = true;
      setTimeout(resolve, MIN_DELAY_AFTER_LCP_MS);
    };

    try {
      const po = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        if (!entries.length) return;
        if ('requestIdleCallback' in window) {
          requestIdleCallback(safeResolve, { timeout: 800 });
        } else {
          setTimeout(safeResolve, 800);
        }
        po.disconnect();
      });
      po.observe({ type: 'largest-contentful-paint', buffered: true });

      window.addEventListener('load', () => setTimeout(safeResolve, 1000));
      setTimeout(safeResolve, 2000);
    } catch (e) {
      window.addEventListener('load', () => setTimeout(safeResolve, 1000));
      setTimeout(safeResolve, 2000);
    }
  });
})();

/**
 * Wait for main thread to be quiet (no long tasks)
 * @param {number} quietWindowMs - How long thread must be quiet (default 500ms)
 * @param {number} timeoutMs - Maximum wait time (default 4000ms)
 * @returns {Promise} Resolves when thread is quiet or timeout reached
 */
export const waitForMainThreadQuiet = (quietWindowMs = 500, timeoutMs = 4000) => {
  return new Promise((resolve) => {
    let lastLongTaskAt = performance.now();
    let po = null;
    try {
      po = new PerformanceObserver(() => {
        lastLongTaskAt = performance.now();
      });
      po.observe({ type: 'longtask', buffered: true });
    } catch (_) {
      setTimeout(resolve, quietWindowMs);
      return;
    }

    const interval = setInterval(() => {
      if (performance.now() - lastLongTaskAt >= quietWindowMs) {
        clearInterval(interval);
        clearTimeout(timeout);
        if (po) po.disconnect();
        resolve();
      }
    }, 200);

    const timeout = setTimeout(() => {
      clearInterval(interval);
      if (po) po.disconnect();
      resolve();
    }, timeoutMs);
  });
};

