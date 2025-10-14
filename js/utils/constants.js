/* ========================================
   Global Constants
   Centralized breakpoints, timing, and config values
   ======================================== */

/**
 * Responsive breakpoints (in pixels)
 */
export const BREAKPOINTS = {
  MOBILE: 767,
  TABLET: 1024,
  DESKTOP: 1024
};

/**
 * Performance timing constants (in milliseconds)
 */
export const PERFORMANCE = {
  CHATBOT_LOAD_DELAY: 4000,
  IDLE_CALLBACK_TIMEOUT: 800,
  OBSERVER_ROOT_MARGIN: '300px 0px',
  RESIZE_DEBOUNCE: 150,
  SCROLL_DEBOUNCE: 100,
  LCP_MIN_DELAY: 400,
  QUIET_WINDOW: 500,
  QUIET_TIMEOUT: 4000
};

/**
 * Animation timing constants (in milliseconds)
 */
export const ANIMATIONS = {
  LOTTIE_STAGGER: 120,
  SPLINE_STAGGER: 150,
  MARQUEE_DURATION: 15000 // 15 seconds
};

/**
 * Scroll blocking keys (keyboard)
 */
export const SCROLL_BLOCK_KEYS = [
  'ArrowUp', 
  'ArrowDown', 
  'ArrowLeft', 
  'ArrowRight', 
  ' ', 
  'PageUp', 
  'PageDown'
];

