/**
 * Advanced 3D Interactive Elements
 * Specialized 3D effects for different portfolio sections
 */

class AdvancedThreeEffects {
    constructor() {
        this.scenes = {};
        this.renderers = {};
        this.cameras = {};
        this.isInitialized = false;
        
        this.init();
    }
    
    init() {
        // Wait for main Three.js effects to load
        setTimeout(() => {
            this.createPortfolioCard3D();
            this.createSkillsVisualization();
            this.createContactFormEffects();
            this.isInitialized = true;
        }, 2000);
    }
    
    createPortfolioCard3D() {
        const portfolioCards = document.querySelectorAll('.portfolio');
        
        portfolioCards.forEach((card, index) => {
            const canvas = document.createElement('canvas');
            canvas.width = 400;
            canvas.height = 300;
            canvas.style.position = 'absolute';
            canvas.style.top = '0';
            canvas.style.left = '0';
            canvas.style.width = '100%';
            canvas.style.height = '100%';
            canvas.style.opacity = '0.3';
            canvas.style.pointerEvents = 'none';
            canvas.style.zIndex = '1';
            
            const portfolioImage = card.querySelector('.portfolio-image');
            if (portfolioImage) {
                portfolioImage.style.position = 'relative';
                portfolioImage.appendChild(canvas);
            }
            
            // Create mini 3D scene for each card
            const scene = new THREE.Scene();
            const camera = new THREE.PerspectiveCamera(75, 400/300, 0.1, 1000);
            const renderer = new THREE.WebGLRenderer({ 
                canvas: canvas,
                alpha: true,
                antialias: true
            });
            
            renderer.setSize(400, 300);
            renderer.setClearColor(0x000000, 0);
            
            // Create floating elements for the card
            const geometry = new THREE.BoxGeometry(0.2, 0.2, 0.2);
            const material = new THREE.MeshBasicMaterial({ 
                color: 0xff2a75,
                wireframe: true,
                transparent: true,
                opacity: 0.6
            });
            
            const cubes = [];
            for (let i = 0; i < 8; i++) {
                const cube = new THREE.Mesh(geometry, material.clone());
                cube.position.set(
                    (Math.random() - 0.5) * 4,
                    (Math.random() - 0.5) * 4,
                    (Math.random() - 0.5) * 4
                );
                cube.userData = {
                    rotationSpeed: {
                        x: Math.random() * 0.02,
                        y: Math.random() * 0.02,
                        z: Math.random() * 0.02
                    }
                };
                cubes.push(cube);
                scene.add(cube);
            }
            
            camera.position.z = 5;
            
            // Animation loop for this card
            const animate = () => {
                requestAnimationFrame(animate);
                
                cubes.forEach(cube => {
                    cube.rotation.x += cube.userData.rotationSpeed.x;
                    cube.rotation.y += cube.userData.rotationSpeed.y;
                    cube.rotation.z += cube.userData.rotationSpeed.z;
                });
                
                renderer.render(scene, camera);
            };
            
            animate();
            
            // Hover effects
            card.addEventListener('mouseenter', () => {
                gsap.to(canvas.style, {
                    duration: 0.5,
                    opacity: 0.8
                });
                
                cubes.forEach((cube, i) => {
                    gsap.to(cube.material, {
                        duration: 0.5,
                        opacity: 1,
                        delay: i * 0.05
                    });
                });
            });
            
            card.addEventListener('mouseleave', () => {
                gsap.to(canvas.style, {
                    duration: 0.5,
                    opacity: 0.3
                });
                
                cubes.forEach(cube => {
                    gsap.to(cube.material, {
                        duration: 0.5,
                        opacity: 0.6
                    });
                });
            });
        });
    }
    
    createSkillsVisualization() {
        const skillsSection = document.getElementById('skills');
        if (!skillsSection) return;
        
        // Create a 3D bar chart for skills
        const skillContainer = document.createElement('div');
        skillContainer.style.position = 'absolute';
        skillContainer.style.top = '0';
        skillContainer.style.right = '0';
        skillContainer.style.width = '300px';
        skillContainer.style.height = '300px';
        skillContainer.style.opacity = '0.7';
        skillContainer.style.pointerEvents = 'none';
        skillContainer.style.zIndex = '1';
        
        skillsSection.style.position = 'relative';
        skillsSection.appendChild(skillContainer);
        
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        
        renderer.setSize(300, 300);
        renderer.setClearColor(0x000000, 0);
        skillContainer.appendChild(renderer.domElement);
        
        // Create 3D skill bars
        const skillLevels = [90, 85, 80, 85, 75, 80]; // Skill percentages
        const skillBars = [];
        
        skillLevels.forEach((level, index) => {
            const height = (level / 100) * 3;
            const geometry = new THREE.BoxGeometry(0.3, height, 0.3);
            const material = new THREE.MeshLambertMaterial({
                color: new THREE.Color().setHSL(index * 0.15, 1, 0.5),
                transparent: true,
                opacity: 0.8
            });
            
            const bar = new THREE.Mesh(geometry, material);
            bar.position.set(
                (index - 2.5) * 0.8,
                height / 2 - 1.5,
                0
            );
            
            skillBars.push(bar);
            scene.add(bar);
        });
        
        // Add lighting
        const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
        scene.add(ambientLight);
        
        const pointLight = new THREE.PointLight(0xff2a75, 0.8, 100);
        pointLight.position.set(0, 5, 5);
        scene.add(pointLight);
        
        camera.position.set(0, 0, 8);
        camera.lookAt(0, 0, 0);
        
        // Animation
        let time = 0;
        const animateSkills = () => {
            requestAnimationFrame(animateSkills);
            time += 0.016;
            
            skillBars.forEach((bar, index) => {
                bar.rotation.y = time * 0.5 + index * 0.2;
                bar.position.y = Math.sin(time + index * 0.5) * 0.2 + 
                    (skillLevels[index] / 100) * 1.5 - 1.5;
            });
            
            camera.position.x = Math.sin(time * 0.2) * 2;
            camera.position.y = Math.cos(time * 0.15) * 1;
            camera.lookAt(0, 0, 0);
            
            renderer.render(scene, camera);
        };
        
        animateSkills();
    }
    
    createContactFormEffects() {
        const contactForm = document.querySelector('.contact-form');
        if (!contactForm) return;
        
        // Create floating contact icons
        const iconContainer = document.createElement('div');
        iconContainer.style.position = 'absolute';
        iconContainer.style.top = '0';
        iconContainer.style.left = '0';
        iconContainer.style.width = '100%';
        iconContainer.style.height = '100%';
        iconContainer.style.pointerEvents = 'none';
        iconContainer.style.zIndex = '1';
        
        contactForm.style.position = 'relative';
        contactForm.appendChild(iconContainer);
        
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        
        renderer.setSize(400, 400);
        renderer.setClearColor(0x000000, 0);
        iconContainer.appendChild(renderer.domElement);
        
        // Create floating geometric shapes representing communication
        const shapes = [];
        const geometries = [
            new THREE.SphereGeometry(0.1, 8, 8),
            new THREE.BoxGeometry(0.1, 0.1, 0.1),
            new THREE.ConeGeometry(0.05, 0.2, 6)
        ];
        
        for (let i = 0; i < 15; i++) {
            const geometry = geometries[Math.floor(Math.random() * geometries.length)];
            const material = new THREE.MeshBasicMaterial({
                color: new THREE.Color().setHSL(Math.random(), 1, 0.5),
                transparent: true,
                opacity: 0.6
            });
            
            const shape = new THREE.Mesh(geometry, material);
            shape.position.set(
                (Math.random() - 0.5) * 6,
                (Math.random() - 0.5) * 6,
                (Math.random() - 0.5) * 6
            );
            
            shape.userData = {
                velocity: {
                    x: (Math.random() - 0.5) * 0.02,
                    y: (Math.random() - 0.5) * 0.02,
                    z: (Math.random() - 0.5) * 0.02
                },
                rotationSpeed: {
                    x: Math.random() * 0.05,
                    y: Math.random() * 0.05,
                    z: Math.random() * 0.05
                }
            };
            
            shapes.push(shape);
            scene.add(shape);
        }
        
        camera.position.z = 8;
        
        // Animation
        const animateContact = () => {
            requestAnimationFrame(animateContact);
            
            shapes.forEach(shape => {
                // Movement
                shape.position.x += shape.userData.velocity.x;
                shape.position.y += shape.userData.velocity.y;
                shape.position.z += shape.userData.velocity.z;
                
                // Boundary checking
                if (Math.abs(shape.position.x) > 3) shape.userData.velocity.x *= -1;
                if (Math.abs(shape.position.y) > 3) shape.userData.velocity.y *= -1;
                if (Math.abs(shape.position.z) > 3) shape.userData.velocity.z *= -1;
                
                // Rotation
                shape.rotation.x += shape.userData.rotationSpeed.x;
                shape.rotation.y += shape.userData.rotationSpeed.y;
                shape.rotation.z += shape.userData.rotationSpeed.z;
            });
            
            renderer.render(scene, camera);
        };
        
        animateContact();
        
        // Form interaction effects
        const formInputs = contactForm.querySelectorAll('input, textarea');
        formInputs.forEach(input => {
            input.addEventListener('focus', () => {
                shapes.forEach(shape => {
                    gsap.to(shape.material, {
                        duration: 0.5,
                        opacity: 1
                    });
                    gsap.to(shape.userData.velocity, {
                        duration: 0.5,
                        x: shape.userData.velocity.x * 2,
                        y: shape.userData.velocity.y * 2,
                        z: shape.userData.velocity.z * 2
                    });
                });
            });
            
            input.addEventListener('blur', () => {
                shapes.forEach(shape => {
                    gsap.to(shape.material, {
                        duration: 0.5,
                        opacity: 0.6
                    });
                    gsap.to(shape.userData.velocity, {
                        duration: 0.5,
                        x: shape.userData.velocity.x / 2,
                        y: shape.userData.velocity.y / 2,
                        z: shape.userData.velocity.z / 2
                    });
                });
            });
        });
    }
    
    // Method to create special effects on button clicks
    createClickEffect(element) {
        if (!this.isInitialized) return;
        
        const rect = element.getBoundingClientRect();
        const x = (rect.left + rect.width / 2 - window.innerWidth / 2) / 100;
        const y = -(rect.top + rect.height / 2 - window.innerHeight / 2) / 100;
        
        if (window.threeEffects) {
            window.threeEffects.createExplosion(x, y, 0);
        }
    }
}

// Initialize advanced effects
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        window.advancedThreeEffects = new AdvancedThreeEffects();
        
        // Add click effects to interactive elements
        document.querySelectorAll('.button button, .service, .cv button').forEach(button => {
            button.addEventListener('click', (e) => {
                if (window.advancedThreeEffects) {
                    window.advancedThreeEffects.createClickEffect(e.target);
                }
            });
        });
    }, 3000);
});
