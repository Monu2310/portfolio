/**
 * Three.js 3D Effects System - Portfolio Enhancement
 * Creates immersive 3D backgrounds and interactive elements
 */

class ThreeEffects {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.geometries = [];
        this.particles = null;
        this.mouse = { x: 0, y: 0 };
        this.targetMouse = { x: 0, y: 0 };
        this.time = 0;
        this.isActive = false;
        this.currentSection = 'home';
        
        // Performance settings
        this.isMobile = window.innerWidth < 768;
        this.particleCount = this.isMobile ? 500 : 1000;
        this.geometryCount = this.isMobile ? 15 : 30;
        
        this.init();
    }
    
    init() {
        this.createScene();
        this.createCamera();
        this.createRenderer();
        this.createLights();
        this.createParticleSystem();
        this.createFloatingGeometry();
        this.setupEventListeners();
        this.animate();
        this.isActive = true;
    }
    
    createScene() {
        this.scene = new THREE.Scene();
        this.scene.fog = new THREE.Fog(0x000000, 1, 1000);
    }
    
    createCamera() {
        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        this.camera.position.z = 5;
    }
    
    createRenderer() {
        this.renderer = new THREE.WebGLRenderer({ 
            antialias: !this.isMobile,
            alpha: true,
            powerPreference: "high-performance"
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.setClearColor(0x000000, 0);
        
        // Add to DOM
        const container = document.getElementById('particles');
        if (container) {
            container.appendChild(this.renderer.domElement);
            this.renderer.domElement.style.position = 'absolute';
            this.renderer.domElement.style.top = '0';
            this.renderer.domElement.style.left = '0';
            this.renderer.domElement.style.zIndex = '1';
            this.renderer.domElement.style.pointerEvents = 'none';
        }
    }
    
    createLights() {
        // Ambient Light
        const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
        this.scene.add(ambientLight);
        
        // Point Light
        const pointLight = new THREE.PointLight(0xff2a75, 1, 100);
        pointLight.position.set(10, 10, 10);
        this.scene.add(pointLight);
        
        // Directional Light
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
        directionalLight.position.set(-1, 1, 1);
        this.scene.add(directionalLight);
    }
    
    createParticleSystem() {
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(this.particleCount * 3);
        const colors = new Float32Array(this.particleCount * 3);
        const sizes = new Float32Array(this.particleCount);
        
        const colorPalette = [
            new THREE.Color(0xff2a75), // Primary
            new THREE.Color(0xf44336), // Secondary
            new THREE.Color(0xff9e80), // Tertiary
            new THREE.Color(0xffffff), // White
            new THREE.Color(0x00bcd4)  // Cyan
        ];
        
        for (let i = 0; i < this.particleCount; i++) {
            const i3 = i * 3;
            
            // Positions
            positions[i3] = (Math.random() - 0.5) * 100;
            positions[i3 + 1] = (Math.random() - 0.5) * 100;
            positions[i3 + 2] = (Math.random() - 0.5) * 100;
            
            // Colors
            const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
            colors[i3] = color.r;
            colors[i3 + 1] = color.g;
            colors[i3 + 2] = color.b;
            
            // Sizes
            sizes[i] = Math.random() * 3 + 1;
        }
        
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
        
        const material = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                pixelRatio: { value: Math.min(window.devicePixelRatio, 2) }
            },
            vertexShader: `
                uniform float time;
                uniform float pixelRatio;
                attribute float size;
                attribute vec3 color;
                varying vec3 vColor;
                varying float vSize;
                
                void main() {
                    vColor = color;
                    vSize = size;
                    
                    vec3 pos = position;
                    pos.x += sin(time * 0.001 + position.y * 0.01) * 2.0;
                    pos.y += cos(time * 0.001 + position.x * 0.01) * 2.0;
                    pos.z += sin(time * 0.001 + position.x * 0.01 + position.y * 0.01) * 1.0;
                    
                    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
                    gl_Position = projectionMatrix * mvPosition;
                    gl_PointSize = size * pixelRatio * (300.0 / -mvPosition.z);
                }
            `,
            fragmentShader: `
                varying vec3 vColor;
                varying float vSize;
                
                void main() {
                    float distanceToCenter = distance(gl_PointCoord, vec2(0.5));
                    float alpha = 1.0 - smoothstep(0.0, 0.5, distanceToCenter);
                    
                    gl_FragColor = vec4(vColor, alpha * 0.8);
                }
            `,
            blending: THREE.AdditiveBlending,
            depthTest: false,
            transparent: true,
            vertexColors: true
        });
        
        this.particles = new THREE.Points(geometry, material);
        this.scene.add(this.particles);
    }
    
    createFloatingGeometry() {
        const geometryTypes = [
            new THREE.BoxGeometry(1, 1, 1),
            new THREE.SphereGeometry(0.5, 16, 16),
            new THREE.ConeGeometry(0.5, 1, 8),
            new THREE.CylinderGeometry(0.3, 0.3, 1, 8),
            new THREE.OctahedronGeometry(0.6),
            new THREE.TetrahedronGeometry(0.7),
            new THREE.IcosahedronGeometry(0.5),
            new THREE.DodecahedronGeometry(0.5)
        ];
        
        for (let i = 0; i < this.geometryCount; i++) {
            const geometry = geometryTypes[Math.floor(Math.random() * geometryTypes.length)];
            
            // Create material with random properties
            const material = new THREE.MeshPhongMaterial({
                color: Math.random() * 0xffffff,
                transparent: true,
                opacity: 0.6,
                shininess: 100,
                wireframe: Math.random() > 0.7
            });
            
            const mesh = new THREE.Mesh(geometry, material);
            
            // Random position
            mesh.position.set(
                (Math.random() - 0.5) * 50,
                (Math.random() - 0.5) * 50,
                (Math.random() - 0.5) * 50
            );
            
            // Random rotation
            mesh.rotation.set(
                Math.random() * Math.PI * 2,
                Math.random() * Math.PI * 2,
                Math.random() * Math.PI * 2
            );
            
            // Random scale
            const scale = Math.random() * 2 + 0.5;
            mesh.scale.set(scale, scale, scale);
            
            // Store animation properties
            mesh.userData = {
                originalPosition: mesh.position.clone(),
                rotationSpeed: {
                    x: (Math.random() - 0.5) * 0.02,
                    y: (Math.random() - 0.5) * 0.02,
                    z: (Math.random() - 0.5) * 0.02
                },
                floatOffset: Math.random() * Math.PI * 2,
                floatSpeed: Math.random() * 0.01 + 0.005
            };
            
            this.geometries.push(mesh);
            this.scene.add(mesh);
        }
    }
    
    setupEventListeners() {
        // Mouse movement
        document.addEventListener('mousemove', (event) => {
            this.targetMouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            this.targetMouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        });
        
        // Window resize
        window.addEventListener('resize', () => {
            this.onWindowResize();
        });
        
        // Section change detection
        window.addEventListener('sectionChange', (event) => {
            this.onSectionChange(event.detail.sectionId);
        });
        
        // Scroll-based effects
        window.addEventListener('scroll', () => {
            this.onScroll();
        });
    }
    
    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    }
    
    onSectionChange(sectionId) {
        this.currentSection = sectionId;
        this.updateEffectsForSection(sectionId);
    }
    
    onScroll() {
        const scrollY = window.pageYOffset;
        const scrollProgress = scrollY / (document.body.scrollHeight - window.innerHeight);
        
        // Adjust camera position based on scroll
        this.camera.position.z = 5 + scrollProgress * 10;
        this.camera.rotation.x = scrollProgress * 0.1;
    }
    
    updateEffectsForSection(sectionId) {
        const colorSchemes = {
            home: { primary: 0xff2a75, secondary: 0xf44336, tertiary: 0xff9e80 },
            about: { primary: 0x00bcd4, secondary: 0x4caf50, tertiary: 0x8bc34a },
            portfolio: { primary: 0x9c27b0, secondary: 0x673ab7, tertiary: 0x3f51b5 },
            contact: { primary: 0xff5722, secondary: 0xff9800, tertiary: 0xffc107 }
        };
        
        const scheme = colorSchemes[sectionId] || colorSchemes.home;
        
        // Update particle colors based on section
        if (this.particles && this.particles.material.uniforms) {
            // Animate to new color scheme
            gsap.to(this.scene.fog.color, {
                duration: 2,
                r: (scheme.primary >> 16 & 255) / 255 * 0.1,
                g: (scheme.primary >> 8 & 255) / 255 * 0.1,
                b: (scheme.primary & 255) / 255 * 0.1
            });
        }
        
        // Update geometry materials
        this.geometries.forEach((mesh, index) => {
            const delay = index * 0.1;
            const colors = [scheme.primary, scheme.secondary, scheme.tertiary];
            const newColor = colors[index % colors.length];
            
            gsap.to(mesh.material.color, {
                duration: 1.5,
                delay: delay,
                r: (newColor >> 16 & 255) / 255,
                g: (newColor >> 8 & 255) / 255,
                b: (newColor & 255) / 255
            });
        });
    }
    
    animate() {
        if (!this.isActive) return;
        
        requestAnimationFrame(() => this.animate());
        
        this.time += 0.016; // Approximate 60fps
        
        // Smooth mouse following
        this.mouse.x += (this.targetMouse.x - this.mouse.x) * 0.05;
        this.mouse.y += (this.targetMouse.y - this.mouse.y) * 0.05;
        
        // Update camera based on mouse
        this.camera.position.x += (this.mouse.x * 2 - this.camera.position.x) * 0.02;
        this.camera.position.y += (this.mouse.y * 2 - this.camera.position.y) * 0.02;
        this.camera.lookAt(this.scene.position);
        
        // Update particles
        if (this.particles && this.particles.material.uniforms) {
            this.particles.material.uniforms.time.value = this.time * 1000;
            this.particles.rotation.y += 0.001;
        }
        
        // Update floating geometry
        this.geometries.forEach((mesh) => {
            const userData = mesh.userData;
            
            // Rotation
            mesh.rotation.x += userData.rotationSpeed.x;
            mesh.rotation.y += userData.rotationSpeed.y;
            mesh.rotation.z += userData.rotationSpeed.z;
            
            // Floating animation
            mesh.position.y = userData.originalPosition.y + 
                Math.sin(this.time * userData.floatSpeed + userData.floatOffset) * 2;
            
            // Mouse interaction
            const distance = mesh.position.distanceTo(this.camera.position);
            if (distance < 15) {
                const force = (15 - distance) / 15;
                mesh.position.x += (this.mouse.x * 5 - mesh.position.x) * force * 0.01;
                mesh.position.z += (this.mouse.y * 5 - mesh.position.z) * force * 0.01;
            }
        });
        
        this.renderer.render(this.scene, this.camera);
    }
    
    // Special effects methods
    createExplosion(x, y, z) {
        const particleCount = 50;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const velocities = [];
        
        for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3;
            positions[i3] = x;
            positions[i3 + 1] = y;
            positions[i3 + 2] = z;
            
            velocities.push({
                x: (Math.random() - 0.5) * 10,
                y: (Math.random() - 0.5) * 10,
                z: (Math.random() - 0.5) * 10
            });
        }
        
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        
        const material = new THREE.PointsMaterial({
            color: 0xff2a75,
            size: 0.5,
            transparent: true,
            opacity: 1
        });
        
        const explosion = new THREE.Points(geometry, material);
        this.scene.add(explosion);
        
        // Animate explosion
        gsap.to(material, {
            duration: 2,
            opacity: 0,
            onComplete: () => {
                this.scene.remove(explosion);
            }
        });
    }
    
    pulseEffect() {
        this.geometries.forEach((mesh, index) => {
            gsap.to(mesh.scale, {
                duration: 0.5,
                x: mesh.scale.x * 1.5,
                y: mesh.scale.y * 1.5, 
                z: mesh.scale.z * 1.5,
                delay: index * 0.1,
                yoyo: true,
                repeat: 1,
                ease: "power2.inOut"
            });
        });
    }
    
    destroy() {
        this.isActive = false;
        
        if (this.renderer) {
            this.renderer.dispose();
            if (this.renderer.domElement && this.renderer.domElement.parentNode) {
                this.renderer.domElement.parentNode.removeChild(this.renderer.domElement);
            }
        }
        
        // Clean up geometries and materials
        this.geometries.forEach(mesh => {
            if (mesh.geometry) mesh.geometry.dispose();
            if (mesh.material) mesh.material.dispose();
        });
        
        if (this.particles) {
            if (this.particles.geometry) this.particles.geometry.dispose();
            if (this.particles.material) this.particles.material.dispose();
        }
    }
}

// Initialize Three.js effects when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Check if device can handle 3D effects
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    
    if (gl && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        // Wait for particles container to be available
        const checkParticles = setInterval(() => {
            const particlesContainer = document.getElementById('particles');
            if (particlesContainer) {
                clearInterval(checkParticles);
                
                // Initialize after a short delay to ensure other scripts are loaded
                setTimeout(() => {
                    window.threeEffects = new ThreeEffects();
                    
                    // Add interaction triggers
                    document.querySelectorAll('.button button, .service').forEach(element => {
                        element.addEventListener('click', () => {
                            if (window.threeEffects) {
                                window.threeEffects.pulseEffect();
                            }
                        });
                    });
                    
                }, 1000);
            }
        }, 100);
    } else {
        console.log('3D effects disabled: WebGL not supported or reduced motion preferred');
    }
});

// Clean up on page unload
window.addEventListener('beforeunload', () => {
    if (window.threeEffects) {
        window.threeEffects.destroy();
    }
});
