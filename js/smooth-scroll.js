/**
 * Smooth Scroll Implementation - Performance Optimized
 * Provides smooth scrolling with better performance
 */

class SmoothScroll {
  constructor(options = {}) {
    this.options = {
      wrapper: options.wrapper || window,
      content: options.content || document.documentElement,
      smooth: options.smooth !== undefined ? options.smooth : true,
      smoothFactor: options.smoothFactor || 0.1,
      touchMultiplier: options.touchMultiplier || 2,
      ...options
    };
    
    // Reference to DOM elements
    this.wrapper = typeof this.options.wrapper === 'string'
      ? document.querySelector(this.options.wrapper)
      : this.options.wrapper;
    
    this.content = typeof this.options.content === 'string'
      ? document.querySelector(this.options.content)
      : this.options.content;
    
    // State variables
    this.isActive = false;
    this.isTouch = 'ontouchstart' in window || navigator.msMaxTouchPoints > 0;
    this.scrollTarget = 0;
    this.currentScroll = 0;
    this.scrollHeight = 0;
    this.requestId = null;
    
    // Performance optimizations
    this.lastScrollTop = 0;
    this.useRaf = true; // Use requestAnimationFrame
    this.rafThrottle = 1; // Only process every nth frame
    this.rafCount = 0;
    
    // Skip initialization on mobile devices
    if (this.isTouch || window.innerWidth <= 768) {
      console.log('Smooth scroll disabled for touch devices and small screens');
      return;
    }
    
    // Init
    this.init();
  }
  
  init() {
    if (this.isActive) return;
    
    this.isActive = true;
    this.calculateDimensions();
    this.setupEvents();
    this.startRender();
    
    // Initial force render
    this.render();
  }
  
  calculateDimensions() {
    // Calculate content height and set it to wrapper
    this.scrollHeight = this.content.scrollHeight;
    this.wrapper.style.height = `${this.scrollHeight}px`;
    
    // Set transform property on content with hardware acceleration
    this.content.style.position = 'fixed';
    this.content.style.top = '0';
    this.content.style.left = '0';
    this.content.style.width = '100%';
    this.content.style.overflow = 'visible';
    this.content.style.willChange = 'transform';
    this.content.style.transform = 'translate3d(0, 0, 0)';
  }
  
  setupEvents() {
    // Resize event with debounce
    let resizeTimeout;
    window.addEventListener('resize', () => {
      if (resizeTimeout) clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(this.onResize.bind(this), 200);
    }, { passive: true });
    
    // When images or other resources load, recalculate height
    window.addEventListener('load', this.calculateDimensions.bind(this));
    
    // Optimized wheel event
    this.wrapper.addEventListener('wheel', this.onWheel.bind(this), { passive: true });
  }
  
  onResize() {
    this.calculateDimensions();
  }
  
  onWheel(e) {
    // Add wheel delta to scroll target
    this.scrollTarget += e.deltaY;
    
    // Clamp scroll target between 0 and max scroll height
    this.scrollTarget = Math.max(0, Math.min(this.scrollTarget, this.scrollHeight - window.innerHeight));
  }
  
  startRender() {
    // Cancel any existing animation frame
    if (this.requestId) {
      cancelAnimationFrame(this.requestId);
      this.requestId = null;
    }
    
    // Start the render loop
    this.render();
  }
  
  render() {
    // Performance optimization: throttle render on RAF
    if (this.useRaf) {
      this.rafCount++;
      if (this.rafCount % this.rafThrottle !== 0) {
        this.requestId = requestAnimationFrame(this.render.bind(this));
        return;
      }
    }
    
    // Calculate smooth scrolling using lerp (linear interpolation)
    if (this.options.smooth) {
      // Only update if there's significant change to avoid tiny calculations
      if (Math.abs(this.scrollTarget - this.currentScroll) > 0.1) {
        this.currentScroll += (this.scrollTarget - this.currentScroll) * this.options.smoothFactor;
      } else {
        this.currentScroll = this.scrollTarget;
      }
    } else {
      this.currentScroll = this.scrollTarget;
    }
    
    // Round to avoid subpixel rendering - improves performance
    const targetRounded = Math.round(this.currentScroll);
    
    // Apply transform using translate3d for better performance
    this.content.style.transform = `translate3d(0, ${-targetRounded}px, 0)`;
    
    // Update scroll position for scroll-dependent elements only when necessary
    if (Math.abs(this.lastScrollTop - targetRounded) > 5) {
      this.lastScrollTop = targetRounded;
      
      // Dispatch custom optimized scroll event instead of multiple events
      window.dispatchEvent(new CustomEvent('optimizedScroll', {
        detail: { scrollY: targetRounded }
      }));
    }
    
    // Continue animation
    this.requestId = requestAnimationFrame(this.render.bind(this));
  }
  
  destroy() {
    if (!this.isActive) return;
    
    this.isActive = false;
    
    // Stop rendering
    if (this.requestId) {
      cancelAnimationFrame(this.requestId);
      this.requestId = null;
    }
    
    // Reset styles
    this.content.style.transform = '';
    this.content.style.position = '';
    this.content.style.top = '';
    this.content.style.left = '';
    this.content.style.width = '';
    this.content.style.willChange = '';
    this.wrapper.style.height = '';
  }
  
  // Public method to scroll to a specific element
  scrollTo(target, options = {}) {
    const targetElement = typeof target === 'string'
      ? document.querySelector(target)
      : target;
    
    if (!targetElement) return;
    
    const offset = options.offset || 0;
    const duration = options.duration || 1000;
    
    const targetPosition = targetElement.getBoundingClientRect().top + this.currentScroll + offset;
    this.scrollTarget = targetPosition;
  }
}

// Create and initialize smooth scroll only for desktop devices
document.addEventListener('DOMContentLoaded', () => {
  // Device detection for performance
  const isMobile = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  const isLowPowerDevice = isMobile || window.innerWidth < 768 || navigator.hardwareConcurrency <= 4;
  
  // Disable smooth scroll if there are page transition conflicts
  const hasPageTransitions = document.querySelector('.page-transition-overlay');
  
  if (!isLowPowerDevice && !hasPageTransitions) {
    // Only initialize for desktop/high-performance devices without page transitions
    window.smoothScroll = new SmoothScroll({
      smoothFactor: 0.12, // Slightly higher for more responsive feel
    });
    
    // Make it available globally
    window.smoothScrollInstance = window.smoothScroll;
    document.documentElement.classList.add('smooth-scroll');
  } else {
    // Use native smooth scroll for lower power devices or when page transitions are present
    document.documentElement.style.scrollBehavior = 'smooth';
    document.documentElement.classList.add('native-scroll');
  }
});