/**
 * Enhanced Particles Animation System - Performance Optimized
 * Using Anime.js for fluid particle effects with better performance
 */

// Create and manage advanced particle animations
class EnhancedParticles {
  constructor(options = {}) {
    // Default configuration
    this.options = {
      selector: options.selector || '#particles',
      particleColor: options.particleColor || '#ffffff',
      particleCount: options.particleCount || 100,
      connectParticles: options.connectParticles !== undefined ? options.connectParticles : true,
      maxDistance: options.maxDistance || 160,
      sizeVariation: options.sizeVariation !== undefined ? options.sizeVariation : true,
      speed: options.speed || 1,
      responsive: options.responsive || [
        {
          breakpoint: 1024,
          options: {
            particleCount: 60,
            connectParticles: true,
            maxDistance: 120
          }
        },
        {
          breakpoint: 768,
          options: {
            particleCount: 40,
            connectParticles: false
          }
        }, 
        {
          breakpoint: 425,
          options: {
            particleCount: 30,
            connectParticles: false
          }
        }
      ]
    };
    
    // Performance detection
    this.isLowPerformance = this.detectLowPerformanceDevice();
    
    // Properties
    this.particles = [];
    this.initialized = false;
    this.canvas = null;
    this.ctx = null;
    this.width = 0;
    this.height = 0;
    this.dpr = this.isLowPerformance ? 1 : (window.devicePixelRatio || 1);
    this.currentOptions = { ...this.options };
    this.lastFrameTime = 0;
    this.targetFPS = 60;
    this.frameInterval = 1000 / this.targetFPS;
    this.animationActive = true;
    this.visibilityThreshold = 200; // Pixels below viewport where animation starts
    this.isVisible = true;
    
    // Apply performance optimizations if needed
    if (this.isLowPerformance) {
      this.applyLowPerformanceSettings();
    }
    
    // Initialize if selector exists
    const container = document.querySelector(this.options.selector);
    if (container) {
      this.init();
    }
  }
  
  // Detect if this is a low performance device
  detectLowPerformanceDevice() {
    return (
      'ontouchstart' in window || 
      navigator.maxTouchPoints > 0 || 
      window.innerWidth < 768 || 
      (navigator.hardwareConcurrency !== undefined && navigator.hardwareConcurrency <= 4)
    );
  }
  
  // Apply settings optimized for low performance devices
  applyLowPerformanceSettings() {
    this.options.particleCount = Math.min(this.options.particleCount, 30);
    this.options.connectParticles = false;
    this.targetFPS = 30;
    this.frameInterval = 1000 / this.targetFPS;
  }
  
  // Initialize the particle system
  init() {
    if (this.initialized) return;
    
    // Create canvas element
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');
    
    // Append canvas to container
    const container = document.querySelector(this.options.selector);
    container.appendChild(this.canvas);
    
    // Set canvas size
    this.setCanvasSize();
    
    // Apply responsive options
    this.applyResponsiveOptions();
    
    // Create initial particles
    this.createParticles();
    
    // Setup event listeners
    this.setupEventListeners();
    
    // Start animation only if element is visible
    this.checkVisibility();
    
    this.initialized = true;
  }
  
  // Set canvas dimensions
  setCanvasSize() {
    const container = document.querySelector(this.options.selector);
    this.width = container.offsetWidth;
    this.height = container.offsetHeight;
    
    // Account for device pixel ratio for sharper rendering
    this.canvas.width = this.width * this.dpr;
    this.canvas.height = this.height * this.dpr;
    this.canvas.style.width = this.width + 'px';
    this.canvas.style.height = this.height + 'px';
    this.ctx.scale(this.dpr, this.dpr);
  }
  
  // Create particles based on current options
  createParticles() {
    this.particles = [];
    
    // Create the specified number of particles
    for (let i = 0; i < this.currentOptions.particleCount; i++) {
      const size = this.currentOptions.sizeVariation ? Math.floor(Math.random() * 3) + 1 : 1;
      
      this.particles.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        vx: Math.random() * 2 - 1,
        vy: Math.random() * 2 - 1,
        size: size,
        color: this.currentOptions.particleColor,
        opacity: Math.random() * 0.5 + 0.3
      });
    }
  }
  
  // Apply responsive options based on screen size
  applyResponsiveOptions() {
    // Start with default options
    this.currentOptions = { ...this.options };
    
    // Apply responsive overrides if any
    if (this.options.responsive) {
      // Sort by breakpoint in descending order to apply the most appropriate settings
      const sortedResponsive = [...this.options.responsive].sort((a, b) => b.breakpoint - a.breakpoint);
      
      for (const item of sortedResponsive) {
        if (window.innerWidth <= item.breakpoint) {
          this.currentOptions = { ...this.currentOptions, ...item.options };
          break; // Apply only the first matching breakpoint
        }
      }
    }
  }
  
  // Animation frame
  animate(timestamp) {
    if (!this.animationActive) return;
    
    // Skip frames to maintain target FPS
    if (timestamp - this.lastFrameTime < this.frameInterval) {
      this.requestId = requestAnimationFrame(this.animate.bind(this));
      return;
    }
    
    this.lastFrameTime = timestamp;
    
    // Clear canvas
    this.ctx.clearRect(0, 0, this.width, this.height);
    
    // Update and draw particles
    this.updateParticles();
    this.drawParticles();
    
    // Connect particles if enabled
    if (this.currentOptions.connectParticles && !this.isLowPerformance) {
      this.connectParticles();
    }
    
    // Continue animation loop
    this.requestId = requestAnimationFrame(this.animate.bind(this));
  }
  
  // Update particle positions
  updateParticles() {
    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];
      
      // Move particles
      p.x += p.vx * this.currentOptions.speed;
      p.y += p.vy * this.currentOptions.speed;
      
      // Bounce off edges
      if (p.x < 0) {
        p.x = 0;
        p.vx *= -1;
      } else if (p.x > this.width) {
        p.x = this.width;
        p.vx *= -1;
      }
      
      if (p.y < 0) {
        p.y = 0;
        p.vy *= -1;
      } else if (p.y > this.height) {
        p.y = this.height;
        p.vy *= -1;
      }
    }
  }
  
  // Draw all particles
  drawParticles() {
    // Performance optimization: batch all similar particles together
    this.ctx.beginPath();
    this.ctx.fillStyle = this.currentOptions.particleColor;
    
    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];
      
      this.ctx.globalAlpha = p.opacity;
      this.ctx.moveTo(p.x, p.y);
      this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    }
    
    this.ctx.fill();
    this.ctx.globalAlpha = 1;
  }
  
  // Connect particles with lines - optimized
  connectParticles() {
    const maxDistance = this.currentOptions.maxDistance;
    const maxDistanceSquared = maxDistance * maxDistance;
    
    this.ctx.beginPath();
    this.ctx.strokeStyle = this.currentOptions.particleColor;
    this.ctx.lineWidth = 0.5;
    
    // Use fewer connections for better performance
    const connectionStep = this.isLowPerformance ? 3 : 1;
    
    for (let i = 0; i < this.particles.length; i++) {
      for (let j = i + connectionStep; j < this.particles.length; j += connectionStep) {
        const p1 = this.particles[i];
        const p2 = this.particles[j];
        
        // Calculate distance using square distance for performance (avoids square root)
        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        const distanceSquared = dx * dx + dy * dy;
        
        // Draw line if particles are close enough
        if (distanceSquared < maxDistanceSquared) {
          // Calculate alpha based on distance
          const alpha = (maxDistance - Math.sqrt(distanceSquared)) / maxDistance;
          this.ctx.globalAlpha = alpha;
          this.ctx.moveTo(p1.x, p1.y);
          this.ctx.lineTo(p2.x, p2.y);
        }
      }
    }
    
    this.ctx.stroke();
    this.ctx.globalAlpha = 1;
  }
  
  // Setup necessary event listeners
  setupEventListeners() {
    // Debounced resize handler
    let resizeTimeout;
    window.addEventListener('resize', () => {
      if (resizeTimeout) clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => this.handleResize(), 200);
    }, { passive: true });
    
    // Throttled mousemove for interactive effect
    let lastMove = 0;
    const moveThrottle = 50; // Only process mouse moves every 50ms
    
    const container = document.querySelector(this.options.selector);
    container.addEventListener('mousemove', (e) => {
      const now = Date.now();
      if (now - lastMove > moveThrottle) {
        lastMove = now;
        this.handleMouseMove(e);
      }
    }, { passive: true });
    
    // Scroll visibility optimization
    window.addEventListener('scroll', () => this.checkVisibility(), { passive: true });
    
    // Pause animation when tab is not visible
    document.addEventListener('visibilitychange', () => {
      this.animationActive = document.visibilityState === 'visible';
      if (this.animationActive && this.isVisible) {
        this.startAnimation();
      }
    });
  }
  
  // Check if the particles container is visible in viewport
  checkVisibility() {
    const container = document.querySelector(this.options.selector);
    if (!container) return;
    
    const rect = container.getBoundingClientRect();
    const wasVisible = this.isVisible;
    
    // Consider element visible if it's just above or within viewport
    this.isVisible = (
      rect.bottom > -this.visibilityThreshold && 
      rect.top < window.innerHeight + this.visibilityThreshold
    );
    
    // Handle visibility change
    if (this.isVisible && !wasVisible) {
      this.startAnimation();
    } else if (!this.isVisible && wasVisible) {
      this.stopAnimation();
    }
  }
  
  // Start the animation
  startAnimation() {
    if (!this.requestId && this.animationActive) {
      this.lastFrameTime = 0;
      this.requestId = requestAnimationFrame(this.animate.bind(this));
    }
  }
  
  // Stop the animation
  stopAnimation() {
    if (this.requestId) {
      cancelAnimationFrame(this.requestId);
      this.requestId = null;
    }
  }
  
  // Handle window resize
  handleResize() {
    this.setCanvasSize();
    this.applyResponsiveOptions();
    
    // Only recreate particles if count has changed
    if (this.particles.length !== this.currentOptions.particleCount) {
      this.createParticles();
    } else {
      // Adjust existing particles to fit new dimensions
      for (let i = 0; i < this.particles.length; i++) {
        const p = this.particles[i];
        if (p.x > this.width) p.x = this.width;
        if (p.y > this.height) p.y = this.height;
      }
    }
  }
  
  // Handle mouse movement for interactive particles - optimized
  handleMouseMove(e) {
    if (this.isLowPerformance) return; // Skip interactive effects on low performance devices
    
    const rect = this.canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const interactionRadius = 80;
    const interactionRadiusSquared = interactionRadius * interactionRadius;
    
    // Affect only a limited number of nearby particles
    let affectedCount = 0;
    const maxAffectedParticles = 10;
    
    for (let i = 0; i < this.particles.length && affectedCount < maxAffectedParticles; i++) {
      const p = this.particles[i];
      const dx = mouseX - p.x;
      const dy = mouseY - p.y;
      const distanceSquared = dx * dx + dy * dy;
      
      if (distanceSquared < interactionRadiusSquared) {
        // Push particles away from cursor
        const angle = Math.atan2(dy, dx);
        const force = (interactionRadius - Math.sqrt(distanceSquared)) / 10;
        p.vx -= Math.cos(angle) * force * 0.05;
        p.vy -= Math.sin(angle) * force * 0.05;
        affectedCount++;
      }
    }
  }
  
  // Clean up resources
  destroy() {
    this.stopAnimation();
    
    // Remove canvas
    if (this.canvas && this.canvas.parentNode) {
      this.canvas.parentNode.removeChild(this.canvas);
    }
    
    // Clear particles
    this.particles = [];
    this.initialized = false;
  }
}

// Create and initialize particles when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  // Initialize enhanced particles but only if we're not on a low-end device
  const isMobile = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  const isLowPerformance = isMobile || window.innerWidth < 768 || (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4);
  
  const particleCount = isLowPerformance ? 30 : 60;
  const useConnections = !isLowPerformance;
  const particleSpeed = isLowPerformance ? 0.5 : 0.7;
  
  window.enhancedParticles = new EnhancedParticles({
    selector: '#particles',
    particleColor: '#ffffff',
    particleCount: particleCount,
    connectParticles: useConnections,
    maxDistance: 100,
    speed: particleSpeed
  });
  
  // Apply animation to particles on scroll with throttling
  let lastScrollTime = 0;
  const scrollThrottle = 50; // ms
  
  window.addEventListener('scroll', function() {
    const now = Date.now();
    if (now - lastScrollTime < scrollThrottle) return;
    lastScrollTime = now;
    
    const scrollPosition = window.scrollY;
    const headerHeight = document.querySelector('#header')?.offsetHeight || 800;
    const scrollRatio = Math.min(scrollPosition / headerHeight, 1);
    
    // Add parallax effect to particles as user scrolls
    const particles = document.querySelector('#particles');
    if (particles) {
      // Use translateY for better performance
      particles.style.transform = `translateY(${scrollPosition * 0.4}px)`;
      particles.style.opacity = 1 - scrollRatio;
    }
  }, { passive: true });
});