# Personal Portfolio Website

## Overview

A cutting-edge, responsive personal portfolio website showcasing my skills, projects, and professional experience. This portfolio features immersive 3D effects, advanced animations, and interactive elements powered by Three.js, creating a truly modern web experience.

## Live Demo

[View Portfolio](https://portfolio-gold-theta-66.vercel.app/)

## ✨ Features

### 🎆 **3D Effects & Animations**
- **Three.js Integration**: Immersive 3D background with floating geometric shapes
- **Interactive Particle Systems**: Dynamic particle effects that respond to mouse movement
- **3D Portfolio Cards**: Each project showcases its own mini 3D scene
- **Hero Section Effects**: Orbital geometry, particle trails, and dynamic lighting
- **Skills Visualization**: 3D bar chart displaying technical skills
- **Contact Form Effects**: Floating shapes that respond to form interactions

### 🎨 **Visual Excellence**
- **Responsive Design**: Fully responsive layout that works on all devices
- **Performance Optimized**: Adaptive effects based on device capabilities
- **Smooth Animations**: GSAP and Anime.js powered transitions
- **Dynamic Color Schemes**: Section-based color themes with smooth transitions
- **Interactive UI Elements**: Hover effects, click animations, and 3D transforms

### 🛠 **Technical Features**
- **WebGL Detection**: Automatic fallback for unsupported devices
- **Scroll Prevention**: Smooth page loading without unwanted scrolling
- **Progressive Enhancement**: Reduced effects on low-power devices
- **Accessibility Focus**: Respects reduced motion preferences
- **Memory Management**: Efficient cleanup of 3D resources

## 🚀 Technologies Used

### **Frontend**
- HTML5, CSS3, JavaScript (ES6+)
- Three.js (r128) for 3D graphics and WebGL
- GSAP for advanced animations
- Anime.js for smooth UI transitions
- Particles.js for background effects

### **Performance & Optimization**
- Intersection Observer API for scroll-triggered animations
- RequestAnimationFrame for smooth 60fps animations
- WebGL shaders for particle effects
- Mobile-first responsive design
- Lazy loading and resource optimization

## 📊 Performance Optimizations

### **Device Adaptation**
- Automatic detection of mobile devices and low-power hardware
- Reduced particle count and geometry complexity on mobile
- WebGL capability detection with graceful fallbacks
- Adaptive frame rates based on device capabilities

### **Memory Management**
- Efficient geometry and material disposal
- Resource cleanup on page unload
- Optimized shader programs for better GPU utilization
- Animation queuing to prevent performance bottlenecks

### **User Experience**
- Smooth scroll prevention during page load
- Progressive loading of 3D effects
- Reduced motion support for accessibility
- Touch-optimized interactions for mobile devices

## 🏗 Project Structure

```
portfolio/
├── index.html                 # Main HTML file
├── README.md                 # Project documentation
├── css/
│   ├── index.css            # Main styles
│   ├── animations.css       # Animation definitions
│   ├── three-effects.css    # 3D effects styling
│   ├── click-effects.css    # Interactive effects
│   └── color-*.css          # Theme color variations
├── js/
│   ├── three-effects.js     # Main 3D effects system
│   ├── hero-three-effects.js # Hero section 3D effects
│   ├── advanced-three-effects.js # Interactive 3D elements
│   ├── scroll-prevention.js # Smooth loading system
│   ├── page-transitions.js  # Section transitions
│   └── libs/                # External libraries
└── images/                  # Asset files
```

## 🌟 Sections

- **🏠 Home/Hero**: Interactive 3D background with orbital geometry
- **👨‍💻 About Me**: Personal introduction with floating elements
- **⚡ Skills & Expertise**: 3D visualization of technical skills
- **💼 Portfolio/Projects**: Interactive project showcases with 3D previews
- **📞 Contact**: Dynamic contact form with particle effects

## 🎮 Interactive Features

### **Mouse Interactions**
- Camera follows mouse movement smoothly
- 3D objects react to mouse proximity
- Interactive particle systems respond to cursor position
- Click effects create particle explosions

### **Section-Based Effects**
- Dynamic color schemes for each section
- Smooth transitions between effect themes
- Adaptive lighting based on current section
- Progressive enhancement of visual elements

### **Performance Features**
- Real-time FPS monitoring and adjustment
- Automatic quality scaling based on performance
- Memory usage optimization
- Battery-aware rendering on mobile devices

## 🌐 Browser Support

**Fully Compatible:**
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

**3D Effects Support:**
- Requires WebGL support
- Automatic fallback to 2D effects on unsupported browsers
- Progressive enhancement ensures basic functionality on all browsers

## 🚀 Local Development

### **Quick Start**
1. Clone the repository
   ```bash
   git clone https://github.com/Monu2310/portfolio.git
   ```
2. Navigate to the project directory
   ```bash
   cd portfolio
   ```
3. Start a local development server
   ```bash
   # Using Python
   python3 -m http.server 8000
   
   # Using Node.js
   npx serve .
   
   # Or simply open index.html in your browser
   ```
4. Open your browser and navigate to `http://localhost:8000`

### **Development Tips**
- Use browser developer tools to monitor WebGL performance
- Test on different devices to ensure optimal performance
- Check console for any 3D effect warnings or fallbacks
- Disable JavaScript to test progressive enhancement

## 📱 Mobile Optimization

- **Touch Interactions**: Optimized touch events for mobile devices
- **Performance Scaling**: Automatic reduction of 3D complexity on mobile
- **Battery Awareness**: Conservative rendering to preserve battery life
- **Responsive 3D**: Adaptive 3D effects based on screen size
- **Progressive Loading**: Staged loading of effects to prevent blocking

## 🎯 Performance Metrics

- **Initial Load**: < 3 seconds on 3G networks
- **3D Initialization**: < 1 second on desktop browsers
- **60 FPS**: Maintained on modern devices with WebGL support
- **Memory Usage**: < 100MB for 3D effects on desktop
- **Battery Impact**: Minimal on mobile devices with optimization

## 🛠 Customization

### **Color Themes**
- Six pre-built color themes available
- Easy theme switching via settings panel
- Smooth transitions between themes
- 3D effects adapt to selected theme

### **3D Effect Settings**
- Particle density adjustment
- Geometry complexity settings  
- Animation speed controls
- Performance mode toggles

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 📞 Contact

- **Website**: [Portfolio](https://portfolio-gold-theta-66.vercel.app/)
- **GitHub**: [@Monu2310](https://github.com/Monu2310)
- **LinkedIn**: [Mayank Monu](https://www.linkedin.com/in/mayank-monu-aa2333231/)
- **Email**: mayank.monu2310@gmail.com

---

⭐ **If you like this project, please give it a star on GitHub!** ⭐
