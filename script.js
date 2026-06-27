// ============================================================================
// ADVANCED PARTICLE SYSTEM WITH PHYSICS ENGINE
// ============================================================================

class Particle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.vx = (Math.random() - 0.5) * 4;
        this.vy = (Math.random() - 0.5) * 4;
        this.ax = 0;
        this.ay = 0.1; // gravity
        this.mass = Math.random() * 0.5 + 0.5;
        this.life = 1;
        this.maxLife = Math.random() * 3 + 5;
        this.element = null;
        this.color = Math.random() > 0.5 ? '#8B5CF6' : '#06B6D4';
    }

    update() {
        this.vx += this.ax;
        this.vy += this.ay;
        this.x += this.vx;
        this.y += this.vy;
        
        this.life -= 1 / (60 * this.maxLife);
        this.life = Math.max(0, this.life);
    }

    applyForce(fx, fy) {
        this.ax += fx / this.mass;
        this.ay += fy / this.mass;
    }

    draw(container) {
        if (!this.element) {
            this.element = document.createElement('div');
            this.element.className = 'particle-advanced';
            container.appendChild(this.element);
        }

        this.element.style.left = this.x + 'px';
        this.element.style.top = this.y + 'px';
        this.element.style.opacity = this.life;
        this.element.style.backgroundColor = this.color;
        this.element.style.width = (this.mass * 4) + 'px';
        this.element.style.height = (this.mass * 4) + 'px';
    }

    isAlive() {
        return this.life > 0;
    }

    remove() {
        if (this.element) {
            this.element.remove();
        }
    }
}

class ParticleSystem {
    constructor() {
        this.particles = [];
        this.container = document.querySelector('.particles');
        this.lastTime = Date.now();
        this.animate();
    }

    addParticle(x, y) {
        this.particles.push(new Particle(x, y));
    }

    addBurst(x, y, count = 10) {
        for (let i = 0; i < count; i++) {
            const angle = (Math.PI * 2 * i) / count;
            const particle = new Particle(x, y);
            particle.vx = Math.cos(angle) * 3;
            particle.vy = Math.sin(angle) * 3;
            this.particles.push(particle);
        }
    }

    update() {
        // Apply wind force (sine wave)
        const windForce = Math.sin(Date.now() / 1000) * 0.02;
        
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const particle = this.particles[i];
            
            particle.applyForce(windForce, 0);
            particle.update();
            particle.draw(this.container);

            if (!particle.isAlive()) {
                particle.remove();
                this.particles.splice(i, 1);
            }
        }
    }

    animate() {
        this.update();
        requestAnimationFrame(() => this.animate());
    }
}

const particleSystem = new ParticleSystem();

// Generate initial particles
for (let i = 0; i < 60; i++) {
    particleSystem.addParticle(
        Math.random() * window.innerWidth,
        Math.random() * window.innerHeight
    );
}

// ============================================================================
// MOUSE-BASED PARTICLE BURST WITH SMOOTH INTERPOLATION
// ============================================================================

let mouseX = 0;
let mouseY = 0;
let lastMouseX = 0;
let lastMouseY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    // Calculate distance moved
    const dx = mouseX - lastMouseX;
    const dy = mouseY - lastMouseY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Create particles every 5px of movement
    if (distance > 5) {
        particleSystem.addBurst(mouseX, mouseY, 2);
        lastMouseX = mouseX;
        lastMouseY = mouseY;
    }
});

// ============================================================================
// ADVANCED NAVBAR EFFECTS WITH BEZIER EASING
// ============================================================================

function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
}

function easeInOutQuad(t) {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section');

window.addEventListener('scroll', () => {
    let current = '';
    const scrollY = window.scrollY;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;

        if (scrollY >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + current) {
            link.classList.add('active');
        }
    });
});

// ============================================================================
// SMOOTH SCROLL WITH EASING
// ============================================================================

navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);

        if (targetSection) {
            const startY = window.scrollY;
            const endY = targetSection.offsetTop - 80;
            const distance = endY - startY;
            const duration = 1000; // 1 second
            let startTime = null;

            function scroll(currentTime) {
                if (startTime === null) startTime = currentTime;
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);

                const easeProgress = easeInOutQuad(progress);
                window.scrollY = startY + distance * easeProgress;
                window.scrollTo(0, startY + distance * easeProgress);

                if (progress < 1) {
                    requestAnimationFrame(scroll);
                }
            }

            requestAnimationFrame(scroll);
        }
    });
});

// ============================================================================
// ADVANCED BUTTON EFFECTS WITH RIPPLE & GLOW
// ============================================================================

const buttons = document.querySelectorAll('.btn, .access-btn');

buttons.forEach(button => {
    button.addEventListener('click', function (e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Create ripple
        const ripple = document.createElement('span');
        ripple.className = 'ripple-effect';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        this.appendChild(ripple);

        // Trigger animation
        setTimeout(() => ripple.classList.add('active'), 10);
        setTimeout(() => ripple.remove(), 800);

        // Add particle burst at button
        particleSystem.addBurst(rect.left + x, rect.top + y, 8);
    });

    // Glow effect on hover
    button.addEventListener('mouseenter', function () {
        const rect = this.getBoundingClientRect();
        particleSystem.addBurst(
            rect.left + rect.width / 2,
            rect.top + rect.height / 2,
            3
        );
    });
});

// ============================================================================
// 3D LOGO GLITCH EFFECT WITH SINE WAVES
// ============================================================================

const logoText = document.querySelector('.logo-text');

function updateLogoGlitch() {
    const time = Date.now() / 1000;
    const glitch = Math.sin(time * 3) * 2;
    const skew = Math.sin(time * 2) * 1;

    logoText.style.transform = `skewX(${skew}deg) translateX(${glitch}px)`;
    logoText.style.filter = `hue-rotate(${Math.sin(time) * 10}deg)`;

    requestAnimationFrame(updateLogoGlitch);
}

updateLogoGlitch();

// ============================================================================
// FLOATING CARDS ADVANCED PHYSICS WITH HARMONIC MOTION
// ============================================================================

const floatingCards = document.querySelectorAll('.floating-card');

class FloatingCardPhysics {
    constructor(element) {
        this.element = element;
        this.time = 0;
        this.offset = Math.random() * Math.PI * 2;
        this.frequency = 0.5 + Math.random() * 0.5;
        this.amplitude = 20;
        this.startY = parseFloat(this.element.style.top || 0);
        this.startX = parseFloat(this.element.style.left || 0);
    }

    update() {
        this.time += 0.016; // ~60fps
        
        // Harmonic oscillation
        const yOffset = Math.sin(this.time * this.frequency + this.offset) * this.amplitude;
        const xOffset = Math.cos(this.time * this.frequency * 0.7 + this.offset) * (this.amplitude * 0.5);
        const rotation = Math.sin(this.time * this.frequency * 0.3) * 2;

        this.element.style.transform = `translate(${xOffset}px, ${yOffset}px) rotateZ(${rotation}deg)`;
    }

    animate() {
        this.update();
        requestAnimationFrame(() => this.animate());
    }
}

floatingCards.forEach(card => {
    const physics = new FloatingCardPhysics(card);
    physics.animate();
});

// ============================================================================
// FEATURE CARDS - MAGNETIC HOVER EFFECT
// ============================================================================

const featureCards = document.querySelectorAll('.feature-card');

featureCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        // Calculate angle and distance
        const angleX = (y - centerY) / rect.height;
        const angleY = (centerX - x) / rect.width;

        const rotationX = angleX * 15;
        const rotationY = angleY * 15;

        card.style.transform = `perspective(1000px) rotateX(${rotationX}deg) rotateY(${rotationY}deg) scale(1.02)`;

        // Add glow at mouse position
        const glowX = (x / rect.width) * 100;
        const glowY = (y / rect.height) * 100;
        card.style.backgroundPosition = `${glowX}% ${glowY}%`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
    });
});

// ============================================================================
// INTERSECTION OBSERVER FOR SCROLL ANIMATIONS
// ============================================================================

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            // Stagger animation
            setTimeout(() => {
                entry.target.style.animation = 'slideInUp 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards';
                
                // Add particle burst
                const rect = entry.target.getBoundingClientRect();
                particleSystem.addBurst(
                    rect.left + rect.width / 2,
                    rect.top + rect.height / 2,
                    5
                );
            }, index * 100);

            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Add animation keyframes
const animationStyle = document.createElement('style');
animationStyle.textContent = `
    @keyframes slideInUp {
        from {
            opacity: 0;
            transform: translateY(50px) rotateX(-20deg);
        }
        to {
            opacity: 1;
            transform: translateY(0) rotateX(0);
        }
    }

    @keyframes rippleEffect {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }

    .ripple-effect {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.6);
        width: 20px;
        height: 20px;
        margin: -10px 0 0 -10px;
        animation: rippleEffect 0.8s ease-out;
    }

    .ripple-effect.active {
        animation: rippleEffect 0.8s ease-out;
    }

    .particle-advanced {
        position: fixed;
        border-radius: 50%;
        pointer-events: none;
        will-change: transform, opacity;
    }
`;
document.head.appendChild(animationStyle);

// Observe feature cards
featureCards.forEach(card => observer.observe(card));

// ============================================================================
// SCROLL PARALLAX WITH EASING FUNCTIONS
// ============================================================================

const heroCube = document.querySelector('.code-cube');
const heroContent = document.querySelector('.hero-content');

function updateParallax() {
    const scrolled = window.scrollY;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = scrolled / maxScroll;

    if (heroCube) {
        const cubeRotation = scrollPercent * 360;
        const cubeTranslateY = scrolled * 0.5;
        heroCube.style.transform = `translate(-50%, -50%) rotateX(${20 + scrollPercent * 20}deg) rotateY(${-20 + cubeRotation}deg) rotateZ(${5 + scrollPercent * 10}deg) translateY(${cubeTranslateY}px)`;
    }

    if (heroContent) {
        const contentTranslate = Math.min(scrolled * 0.3, 100);
        const contentOpacity = Math.max(1 - scrolled / (window.innerHeight * 2), 0);
        heroContent.style.transform = `translateY(${contentTranslate}px)`;
        heroContent.style.opacity = contentOpacity;
    }
}

window.addEventListener('scroll', updateParallax, { passive: true });

// ============================================================================
// KEYBOARD INTERACTION & EASTER EGG
// ============================================================================

let easterEggSequence = '';
const easterEggKey = 'copilot';

document.addEventListener('keydown', (e) => {
    easterEggSequence += e.key.toLowerCase();
    easterEggSequence = easterEggSequence.slice(-easterEggKey.length);

    if (easterEggSequence === easterEggKey) {
        activateEasterEgg();
    }
});

function activateEasterEgg() {
    console.log('%c🎉 EASTER EGG ACTIVATED!', 'font-size: 30px; color: #8B5CF6; font-weight: bold;');
    console.log('%cYou found the secret sequence! Type "copilot"', 'font-size: 14px; color: #06B6D4;');

    // Create particle explosion
    for (let i = 0; i < 50; i++) {
        particleSystem.addBurst(
            window.innerWidth / 2 + (Math.random() - 0.5) * 200,
            window.innerHeight / 2 + (Math.random() - 0.5) * 200,
            5
        );
    }

    // Flash effect
    const flash = document.createElement('div');
    flash.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: radial-gradient(circle, rgba(139, 92, 246, 0.8), transparent);
        pointer-events: none;
        animation: flashPulse 0.6s ease-out;
        z-index: 999;
    `;
    document.body.appendChild(flash);
    setTimeout(() => flash.remove(), 600);
}

// ============================================================================
// PERFORMANCE MONITORING
// ============================================================================

let frameCount = 0;
let lastFrameTime = Date.now();
let fps = 60;

function measureFPS() {
    frameCount++;
    const currentTime = Date.now();
    const deltaTime = currentTime - lastFrameTime;

    if (deltaTime >= 1000) {
        fps = frameCount;
        frameCount = 0;
        lastFrameTime = currentTime;
    }

    requestAnimationFrame(measureFPS);
}

measureFPS();

// ============================================================================
// CONSOLE MESSAGES
// ============================================================================

console.clear();
console.log('%c╔════════════════════════════════════════╗', 'color: #8B5CF6; font-weight: bold;');
console.log('%c║         WELCOME TO 10BI v2.0.1        ║', 'color: #8B5CF6; font-weight: bold;');
console.log('%c║    Build The Future With Code         ║', 'color: #06B6D4; font-weight: bold;');
console.log('%c╚════════════════════════════════════════╝', 'color: #8B5CF6; font-weight: bold;');
console.log('\n%c✨ Advanced Features Loaded:', 'color: #10B981; font-size: 14px; font-weight: bold;');
console.log('%c• Physics-Based Particle System', 'color: #06B6D4;');
console.log('%c• Harmonic Motion Animations', 'color: #06B6D4;');
console.log('%c• Bezier Easing Functions', 'color: #06B6D4;');
console.log('%c• Magnetic Hover Effects', 'color: #06B6D4;');
console.log('%c• Advanced Parallax Scrolling', 'color: #06B6D4;');
console.log('%c• Mouse-Driven Particle Bursts', 'color: #06B6D4;');
console.log('\n%c🔑 Easter Egg Tip:', 'color: #EF4444; font-weight: bold;');
console.log('%cType "copilot" on your keyboard!', 'color: #EF4444;');

// ============================================================================
// RESPONSIVE HANDLING
// ============================================================================

window.addEventListener('resize', () => {
    // Reinitialize if needed
});

// Prevent lag by throttling animations on low-end devices
const isSlowDevice = navigator.deviceMemory < 4 || navigator.hardwareConcurrency < 2;
if (isSlowDevice) {
    // Reduce particle count
    while (particleSystem.particles.length > 30) {
        particleSystem.particles[0].remove();
        particleSystem.particles.shift();
    }
    console.log('%c⚡ Performance mode enabled for low-end device', 'color: #EF4444;');
}