/**
 * Hero Section 3D Effects
 * Special 3D effects for the main header/hero section
 */

class HeroThreeEffects {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.headerModel = null;
        this.textMesh = null;
        this.mouse = { x: 0, y: 0 };
        this.time = 0;
        
        this.init();
    }
    
    init() {
        const heroContainer = document.getElementById('header');
        if (!heroContainer) return;
        
        this.createHeroCanvas();
        this.createScene();
        this.createCamera();
        this.createRenderer();
        this.createHeroElements();
        this.setupEventListeners();
        this.animate();
    }
    
    createHeroCanvas() {
        this.canvas = document.createElement('canvas');
        this.canvas.style.position = 'absolute';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.zIndex = '0';
        this.canvas.style.pointerEvents = 'none';
        
        const heroContainer = document.getElementById('header');
        heroContainer.style.position = 'relative';
        heroContainer.insertBefore(this.canvas, heroContainer.firstChild);
    }
    
    createScene() {
        this.scene = new THREE.Scene();
        this.scene.fog = new THREE.Fog(0x000000, 10, 100);
    }
    
    createCamera() {
        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        this.camera.position.set(0, 0, 30);
    }
    
    createRenderer() {
        this.renderer = new THREE.WebGLRenderer({ 
            canvas: this.canvas,
            alpha: true,
            antialias: true
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.setClearColor(0x000000, 0);
    }
    
    createHeroElements() {
        // Create floating geometric shapes around the hero
        this.createFloatingShapes();
        
        // Create particle trail effect
        this.createParticleTrail();
        
        // Create animated background mesh
        this.createBackgroundMesh();
        
        // Add dynamic lighting
        this.createDynamicLighting();
    }
    
    createFloatingShapes() {
        this.floatingShapes = [];
        
        const geometries = [
            new THREE.IcosahedronGeometry(1, 0),
            new THREE.OctahedronGeometry(1),
            new THREE.TetrahedronGeometry(1),
            new THREE.DodecahedronGeometry(1),
            new THREE.BoxGeometry(1, 1, 1),
            new THREE.SphereGeometry(1, 16, 16)
        ];
        
        for (let i = 0; i < 20; i++) {
            const geometry = geometries[Math.floor(Math.random() * geometries.length)];
            const material = new THREE.MeshPhongMaterial({
                color: new THREE.Color().setHSL(Math.random(), 0.7, 0.6),
                transparent: true,
                opacity: 0.3,
                wireframe: Math.random() > 0.5
            });
            
            const mesh = new THREE.Mesh(geometry, material);
            
            // Position in a sphere around the center
            const radius = 20 + Math.random() * 30;
            const phi = Math.random() * Math.PI * 2;
            const theta = Math.random() * Math.PI;
            
            mesh.position.set(
                radius * Math.sin(theta) * Math.cos(phi),
                radius * Math.sin(theta) * Math.sin(phi),
                radius * Math.cos(theta)
            );
            
            mesh.userData = {
                originalPosition: mesh.position.clone(),
                rotationSpeed: {
                    x: (Math.random() - 0.5) * 0.02,
                    y: (Math.random() - 0.5) * 0.02,
                    z: (Math.random() - 0.5) * 0.02
                },
                floatSpeed: Math.random() * 0.02 + 0.01,
                floatOffset: Math.random() * Math.PI * 2,
                orbitSpeed: Math.random() * 0.01 + 0.005,
                orbitRadius: radius
            };
            
            this.floatingShapes.push(mesh);
            this.scene.add(mesh);
        }
    }
    
    createParticleTrail() {
        const particleCount = 300;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);
        const sizes = new Float32Array(particleCount);
        
        for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3;
            
            // Create a spiral pattern
            const angle = (i / particleCount) * Math.PI * 8;
            const radius = (i / particleCount) * 15;
            
            positions[i3] = Math.cos(angle) * radius;
            positions[i3 + 1] = Math.sin(angle) * radius;
            positions[i3 + 2] = (i / particleCount) * 20 - 10;
            
            // Gradient colors
            const hue = (i / particleCount) * 0.3 + 0.8;
            const color = new THREE.Color().setHSL(hue, 1, 0.6);
            colors[i3] = color.r;
            colors[i3 + 1] = color.g;
            colors[i3 + 2] = color.b;
            
            sizes[i] = Math.random() * 2 + 1;
        }
        
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
        
        const material = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 }
            },
            vertexShader: `
                uniform float time;
                attribute float size;
                attribute vec3 color;
                varying vec3 vColor;
                
                void main() {
                    vColor = color;
                    
                    vec3 pos = position;
                    pos.x += sin(time * 0.001 + position.z * 0.01) * 3.0;
                    pos.y += cos(time * 0.001 + position.z * 0.01) * 3.0;
                    
                    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
                    gl_Position = projectionMatrix * mvPosition;
                    gl_PointSize = size * (300.0 / -mvPosition.z);
                }
            `,
            fragmentShader: `
                varying vec3 vColor;
                
                void main() {
                    float distanceToCenter = distance(gl_PointCoord, vec2(0.5));
                    float alpha = 1.0 - smoothstep(0.0, 0.5, distanceToCenter);
                    
                    gl_FragColor = vec4(vColor, alpha * 0.6);
                }
            `,
            blending: THREE.AdditiveBlending,
            depthTest: false,
            transparent: true,
            vertexColors: true
        });
        
        this.particleTrail = new THREE.Points(geometry, material);
        this.scene.add(this.particleTrail);
    }
    
    createBackgroundMesh() {
        const geometry = new THREE.PlaneGeometry(100, 100, 50, 50);
        const material = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                mouse: { value: new THREE.Vector2() }
            },
            vertexShader: `
                uniform float time;
                uniform vec2 mouse;
                varying vec2 vUv;
                varying float vDisplacement;
                
                void main() {
                    vUv = uv;
                    
                    vec3 pos = position;
                    
                    // Create waves
                    float wave1 = sin(pos.x * 0.1 + time * 0.001) * 2.0;
                    float wave2 = cos(pos.y * 0.1 + time * 0.0015) * 1.5;
                    
                    // Mouse interaction
                    float mouseInfluence = length(mouse - uv) * 10.0;
                    mouseInfluence = 1.0 / (mouseInfluence + 1.0);
                    
                    pos.z += wave1 + wave2 + mouseInfluence * 5.0;
                    vDisplacement = pos.z;
                    
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
                }
            `,
            fragmentShader: `
                uniform float time;
                varying vec2 vUv;
                varying float vDisplacement;
                
                void main() {
                    vec3 color1 = vec3(1.0, 0.165, 0.459); // #ff2a75
                    vec3 color2 = vec3(0.957, 0.263, 0.212); // #f44336
                    vec3 color3 = vec3(0.0, 0.0, 0.0);
                    
                    float mixFactor = sin(vDisplacement * 0.5 + time * 0.001) * 0.5 + 0.5;
                    vec3 finalColor = mix(color3, mix(color1, color2, vUv.x), mixFactor);
                    
                    float alpha = 0.1 + vDisplacement * 0.02;
                    gl_FragColor = vec4(finalColor, alpha);
                }
            `,
            transparent: true,
            side: THREE.DoubleSide
        });
        
        this.backgroundMesh = new THREE.Mesh(geometry, material);
        this.backgroundMesh.position.z = -20;
        this.scene.add(this.backgroundMesh);
    }
    
    createDynamicLighting() {
        // Ambient light
        const ambientLight = new THREE.AmbientLight(0x404040, 0.3);
        this.scene.add(ambientLight);
        
        // Moving point lights
        this.pointLights = [];
        const colors = [0xff2a75, 0xf44336, 0xff9e80, 0x00bcd4];
        
        for (let i = 0; i < 4; i++) {
            const light = new THREE.PointLight(colors[i], 0.8, 50);
            light.userData = {
                originalIntensity: 0.8,
                orbitRadius: 15 + Math.random() * 10,
                orbitSpeed: 0.01 + Math.random() * 0.02,
                orbitOffset: (Math.PI * 2 / 4) * i
            };
            this.pointLights.push(light);
            this.scene.add(light);
        }
    }
    
    setupEventListeners() {
        // Mouse movement
        document.addEventListener('mousemove', (event) => {
            this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        });
        
        // Window resize
        window.addEventListener('resize', () => {
            this.onWindowResize();
        });
        
        // Typing effect integration
        const textElement = document.querySelector('.txt-rotate');
        if (textElement) {
            const observer = new MutationObserver(() => {
                this.pulseEffect();
            });
            observer.observe(textElement, { childList: true, subtree: true });
        }
    }
    
    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    }
    
    pulseEffect() {
        // Create a pulse effect when text changes
        this.floatingShapes.forEach((shape, index) => {
            gsap.to(shape.scale, {
                duration: 0.8,
                x: shape.scale.x * 1.3,
                y: shape.scale.y * 1.3,
                z: shape.scale.z * 1.3,
                delay: index * 0.05,
                yoyo: true,
                repeat: 1,
                ease: "power2.inOut"
            });
            
            gsap.to(shape.material, {
                duration: 0.8,
                opacity: 0.8,
                delay: index * 0.05,
                yoyo: true,
                repeat: 1,
                ease: "power2.inOut"
            });
        });
    }
    
    animate() {
        requestAnimationFrame(() => this.animate());
        
        this.time += 0.016;
        
        // Update floating shapes
        this.floatingShapes.forEach((shape, index) => {
            const userData = shape.userData;
            
            // Orbital motion
            const orbitAngle = this.time * userData.orbitSpeed + userData.floatOffset;
            shape.position.x = Math.cos(orbitAngle) * userData.orbitRadius;
            shape.position.y = Math.sin(orbitAngle) * userData.orbitRadius * 0.5;
            shape.position.z = Math.sin(orbitAngle * 0.5) * 10;
            
            // Rotation
            shape.rotation.x += userData.rotationSpeed.x;
            shape.rotation.y += userData.rotationSpeed.y;
            shape.rotation.z += userData.rotationSpeed.z;
            
            // Mouse interaction
            const mouseDistance = Math.sqrt(
                Math.pow(this.mouse.x * 20 - shape.position.x, 2) +
                Math.pow(this.mouse.y * 20 - shape.position.y, 2)
            );
            
            if (mouseDistance < 10) {
                const force = (10 - mouseDistance) / 10;
                shape.position.x += (this.mouse.x * 20 - shape.position.x) * force * 0.1;
                shape.position.y += (this.mouse.y * 20 - shape.position.y) * force * 0.1;
            }
        });
        
        // Update particle trail
        if (this.particleTrail && this.particleTrail.material.uniforms) {
            this.particleTrail.material.uniforms.time.value = this.time * 1000;
            this.particleTrail.rotation.z += 0.005;
        }
        
        // Update background mesh
        if (this.backgroundMesh && this.backgroundMesh.material.uniforms) {
            this.backgroundMesh.material.uniforms.time.value = this.time * 1000;
            this.backgroundMesh.material.uniforms.mouse.value.set(this.mouse.x, this.mouse.y);
        }
        
        // Update dynamic lighting
        this.pointLights.forEach((light, index) => {
            const userData = light.userData;
            const angle = this.time * userData.orbitSpeed + userData.orbitOffset;
            
            light.position.x = Math.cos(angle) * userData.orbitRadius;
            light.position.y = Math.sin(angle) * userData.orbitRadius * 0.7;
            light.position.z = Math.sin(angle * 0.5) * 5;
            
            // Intensity variation
            light.intensity = userData.originalIntensity * (0.5 + Math.sin(this.time * 2 + index) * 0.3);
        });
        
        // Camera movement
        this.camera.position.x += (this.mouse.x * 5 - this.camera.position.x) * 0.02;
        this.camera.position.y += (this.mouse.y * 5 - this.camera.position.y) * 0.02;
        this.camera.lookAt(0, 0, 0);
        
        this.renderer.render(this.scene, this.camera);
    }
}

// Initialize hero 3D effects
document.addEventListener('DOMContentLoaded', () => {
    // Wait for other scripts to load
    setTimeout(() => {
        if (window.innerWidth > 768) { // Only on desktop for performance
            window.heroThreeEffects = new HeroThreeEffects();
        }
    }, 2000);
});
