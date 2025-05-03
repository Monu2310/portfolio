/**
 * Framer Motion-like Animation System - Performance Optimized
 * Lightweight animation library for portfolio website 
 */

// Performance detection
const isMobile = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
const isLowPowerDevice = isMobile || window.innerWidth < 768 || 
                         (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4);
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Animation configuration based on device capability
const framerConfig = {
  // Reduce complexity on low-power devices
  duration: isLowPowerDevice ? 0.4 : 0.6,
  staggerDelay: isLowPowerDevice ? 0.05 : 0.08,
  easingFunction: isLowPowerDevice ? 'cubic-bezier(0.25, 0.1, 0.25, 1.0)' : 'cubic-bezier(0.16, 1, 0.3, 1)',
  disableStaggering: isLowPowerDevice || prefersReducedMotion,
  disableComplexAnimations: isLowPowerDevice || prefersReducedMotion,
  maxConcurrentAnimations: isLowPowerDevice ? 3 : 6
};

// Animation queue for better performance
let animationQueue = [];
let activeAnimations = 0;
let isProcessingQueue = false;

class FramerAnimations {
  constructor() {
    this.animations = {
      // Scale animations
      scaleUp: {
        initial: { opacity: 0, scale: 0.9 },
        animate: { opacity: 1, scale: 1 },
        transition: { duration: framerConfig.duration, ease: framerConfig.easingFunction }
      },
      scaleDown: {
        initial: { opacity: 0, scale: 1.1 },
        animate: { opacity: 1, scale: 1 },
        transition: { duration: framerConfig.duration, ease: framerConfig.easingFunction }
      },
      
      // Fade animations (lighter)
      fade: {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        transition: { duration: framerConfig.duration * 0.8, ease: 'ease-out' }
      },
      
      // Directional animations
      fadeUp: {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: framerConfig.duration, ease: framerConfig.easingFunction }
      },
      fadeDown: {
        initial: { opacity: 0, y: -20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: framerConfig.duration, ease: framerConfig.easingFunction }
      },
      fadeLeft: {
        initial: { opacity: 0, x: 20 },
        animate: { opacity: 1, x: 0 },
        transition: { duration: framerConfig.duration, ease: framerConfig.easingFunction }
      },
      fadeRight: {
        initial: { opacity: 0, x: -20 },
        animate: { opacity: 1, x: 0 },
        transition: { duration: framerConfig.duration, ease: framerConfig.easingFunction }
      }
    };
  }
  
  // Apply animation to element
  animate(element, animationName, options = {}) {
    // Skip if element doesn't exist
    if (!element) return;
    
    // Get animation definition
    const animation = this.animations[animationName];
    if (!animation) {
      console.warn(`Animation "${animationName}" not found.`);
      return;
    }
    
    // Merge default transition with custom options
    const transition = {
      ...animation.transition,
      delay: options.delay || 0,
      ...options.transition
    };
    
    // Apply initial state immediately
    this.applyStyles(element, animation.initial);
    
    // Prepare animation function (will be queued)
    const runAnimation = () => {
      // Force browser to acknowledge initial state
      void element.offsetWidth;
      
      // Create animation with CSS transitions for better performance
      element.style.transition = this.createTransitionString(animation.initial, animation.animate, transition);
      
      // Apply final state
      this.applyStyles(element, animation.animate);
      
      // Clean up after animation completes
      const onAnimationComplete = () => {
        element.removeEventListener('transitionend', onAnimationComplete);
        activeAnimations--;
        
        // Run callback if provided
        if (options.onComplete) {
          options.onComplete();
        }
        
        // Process next animation in queue
        processNextAnimation();
      };
      
      // Listen for animation completion
      element.addEventListener('transitionend', onAnimationComplete, { once: true });
      
      // Safety timeout in case transitionend doesn't fire
      setTimeout(() => {
        if (element.transitionTimedOut) return;
        element.transitionTimedOut = true;
        onAnimationComplete();
      }, (transition.duration * 1000) + 100);
    };
    
    // Add to queue
    queueAnimation(runAnimation);
  }
  
  // Apply CSS styles to element
  applyStyles(element, styles) {
    if (!element || !styles) return;
    
    // Apply transform properties efficiently
    const transform = [];
    
    if (styles.x !== undefined) transform.push(`translateX(${styles.x}px)`);
    if (styles.y !== undefined) transform.push(`translateY(${styles.y}px)`);
    if (styles.scale !== undefined) transform.push(`scale(${styles.scale})`);
    if (styles.rotate !== undefined) transform.push(`rotate(${styles.rotate}deg)`);
    
    // Only set transform if there are transform properties
    if (transform.length > 0) {
      element.style.transform = transform.join(' ');
    }
    
    // Apply opacity directly
    if (styles.opacity !== undefined) {
      element.style.opacity = styles.opacity;
    }
  }
  
  // Create CSS transition string
  createTransitionString(initial, animate, transition) {
    const properties = [];
    
    // Add transform if any transform property is being animated
    if (
      (initial.x !== undefined && animate.x !== undefined) ||
      (initial.y !== undefined && animate.y !== undefined) ||
      (initial.scale !== undefined && animate.scale !== undefined) ||
      (initial.rotate !== undefined && animate.rotate !== undefined)
    ) {
      properties.push(`transform ${transition.duration}s ${transition.ease} ${transition.delay}s`);
    }
    
    // Add opacity if being animated
    if (initial.opacity !== undefined && animate.opacity !== undefined) {
      properties.push(`opacity ${transition.duration}s ${transition.ease} ${transition.delay}s`);
    }
    
    return properties.join(', ');
  }
  
  // Setup staggered animations for a group of elements
  setupStaggeredAnimations() {
    if (framerConfig.disableStaggering) return;
    
    // Find all stagger parent elements
    const staggerParents = document.querySelectorAll('[data-framer-stagger-parent]');
    
    staggerParents.forEach(parent => {
      // Find all stagger children
      const children = parent.querySelectorAll('[data-framer-stagger-child]');
      
      // Skip if no children found
      if (children.length === 0) return;
      
      // Set up observer for the parent
      const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            // Animate children with staggered delay
            Array.from(children).forEach((child, index) => {
              const animationName = child.dataset.framerAnimate || 'fadeUp';
              const baseDelay = parseFloat(child.dataset.framerDelay || 0) / 1000;
              const staggerDelay = framerConfig.staggerDelay * index;
              
              this.animate(child, animationName, {
                delay: baseDelay + staggerDelay
              });
            });
            
            // Unobserve after triggering
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1 });
      
      observer.observe(parent);
    });
  }
  
  // Initialize animations based on data attributes
  init() {
    // Skip heavy animations on low-power devices
    if (prefersReducedMotion) {
      // Just show all elements without animation
      document.querySelectorAll('[data-framer-animate]').forEach(element => {
        element.style.opacity = 1;
        element.style.transform = 'none';
      });
      return;
    }
    
    // Find all elements with framer animation attributes
    const animatedElements = document.querySelectorAll('[data-framer-animate]:not([data-framer-stagger-child])');
    
    // Set up IntersectionObserver for each animation type
    const observerByAnimation = {};
    
    // Group elements by animation type for better performance
    animatedElements.forEach(element => {
      const animationName = element.dataset.framerAnimate;
      
      if (!observerByAnimation[animationName]) {
        observerByAnimation[animationName] = new IntersectionObserver(entries => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              const element = entry.target;
              const delay = parseFloat(element.dataset.framerDelay || 0) / 1000;
              
              this.animate(element, animationName, { delay });
              
              // Unobserve after animation is triggered
              observerByAnimation[animationName].unobserve(element);
            }
          });
        }, { threshold: 0.1 });
      }
      
      observerByAnimation[animationName].observe(element);
    });
    
    // Set up staggered animations
    this.setupStaggeredAnimations();
  }
}

// Queue management for animations
function queueAnimation(animationFn) {
  animationQueue.push(animationFn);
  
  if (!isProcessingQueue) {
    processNextAnimation();
  }
}

function processNextAnimation() {
  if (animationQueue.length === 0) {
    isProcessingQueue = false;
    return;
  }
  
  isProcessingQueue = true;
  
  // Process animations if we have capacity
  while (animationQueue.length > 0 && activeAnimations < framerConfig.maxConcurrentAnimations) {
    const animationFn = animationQueue.shift();
    activeAnimations++;
    animationFn();
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // Delay initialization slightly to prioritize critical rendering
  setTimeout(() => {
    const framer = new FramerAnimations();
    framer.init();
    
    // Make available globally
    window.framerAnimations = framer;
  }, 100);
});