// Typewriter Effect for Logo
document.addEventListener('DOMContentLoaded', () => {
    const typewriterElement = document.getElementById('typewriter');
    if (!typewriterElement) return;

    const text = 'Jitendra Pradhan';
    let index = 0;

    function type() {
        if (index < text.length) {
            typewriterElement.textContent += text.charAt(index);
            index++;
            setTimeout(type, 100); // 100ms delay between each letter
        } else {
            // Remove cursor after typing is complete
            setTimeout(() => {
                typewriterElement.style.setProperty('--cursor-display', 'none');
            }, 500);
        }
    }

    type();
});

// Dark Mode Toggle
document.addEventListener('DOMContentLoaded', () => {
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    const body = document.body;

    // Check for saved preference, default to dark mode if no preference
    const savedMode = localStorage.getItem('darkMode');
    const isDarkMode = savedMode === null ? true : savedMode === 'true';

    if (isDarkMode) {
        body.classList.add('dark-mode');
    }

    // Toggle dark mode
    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', () => {
            body.classList.toggle('dark-mode');
            const darkModeEnabled = body.classList.contains('dark-mode');
            localStorage.setItem('darkMode', darkModeEnabled);
        });
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const loadMoreBtn = document.getElementById('load-more-btn');
    const hiddenProjects = document.querySelectorAll('.hidden-project');

    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', (e) => {
            e.preventDefault();

            const isExpanded = loadMoreBtn.getAttribute('data-expanded') === 'true';

            if (!isExpanded) {
                // Show Projects
                hiddenProjects.forEach(project => {
                    project.style.display = 'flex'; // Handled by CSS flex on parents
                    project.style.animation = 'fade-in-up 0.5s ease forwards';
                });
                loadMoreBtn.textContent = 'View Less';
                loadMoreBtn.setAttribute('data-expanded', 'true');
            } else {
                // Hide Projects
                hiddenProjects.forEach(project => {
                    project.style.display = 'none';
                });
                loadMoreBtn.textContent = 'See More Projects';
                loadMoreBtn.setAttribute('data-expanded', 'false');

                // Optional: Smooth scroll back to projects section
                document.getElementById('work').scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    // Scroll Animation Observer
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);

    const scrollElements = document.querySelectorAll('.reveal-on-scroll');
    scrollElements.forEach((el) => observer.observe(el));

    // Hide Scroll Indicator on Scroll
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                scrollIndicator.classList.add('hidden');
            } else {
                scrollIndicator.classList.remove('hidden');
            }
        });
    }

    // Three.js Hero Scene
    const initThreeJS = () => {
        const canvasContainer = document.getElementById('hero-canvas');
        if (!canvasContainer || typeof THREE === 'undefined') return;

        const scene = new THREE.Scene();
        // Use window dimensions for fullscreen
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

        renderer.setSize(window.innerWidth, window.innerHeight);
        canvasContainer.appendChild(renderer.domElement);

        // Geometry: Icosahedron Wireframe
        const geometry = new THREE.IcosahedronGeometry(1.8, 0); // Slightly larger
        const material = new THREE.MeshBasicMaterial({
            color: 0x0ea5e9, // Primary Blue
            wireframe: true,
            transparent: true,
            opacity: 0.3 // More subtle
        });
        const sphere = new THREE.Mesh(geometry, material);
        scene.add(sphere);

        // Particles System (Surrounding stars)
        const particlesGeometry = new THREE.BufferGeometry();
        const particlesCount = 700; // Increased count
        const posArray = new Float32Array(particlesCount * 3);

        for (let i = 0; i < particlesCount * 3; i++) {
            posArray[i] = (Math.random() - 0.5) * 15; // Spread much wider
        }

        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
        const particlesMaterial = new THREE.PointsMaterial({
            size: 0.02,
            color: 0xa78bfa, // Accent Purple
        });
        const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
        scene.add(particlesMesh);

        camera.position.z = 4; // Move back slightly

        // Interaction state
        let mouseX = 0;
        let mouseY = 0;

        document.addEventListener('mousemove', (event) => {
            mouseX = event.clientX / window.innerWidth - 0.5;
            mouseY = event.clientY / window.innerHeight - 0.5;
        });

        // Animation Loop
        const animate = () => {
            requestAnimationFrame(animate);

            // Rotate main object
            sphere.rotation.y += 0.002;
            sphere.rotation.x += 0.001;

            // Rotate particles slowly
            particlesMesh.rotation.y = -mouseX * 0.2; // Softer parallax
            particlesMesh.rotation.x = -mouseY * 0.2;

            // Interactive Tilt
            sphere.rotation.y += mouseX * 0.05;
            sphere.rotation.x += mouseY * 0.05;

            renderer.render(scene, camera);
        };
        animate();

        // Handle Resize
        window.addEventListener('resize', () => {
            renderer.setSize(window.innerWidth, window.innerHeight);
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
        });
    };

    // Check if Three is loaded, if not wait a bit (CDN latency)
    if (typeof THREE !== 'undefined') {
        initThreeJS();
    } else {
        window.addEventListener('load', initThreeJS);
    }
});
