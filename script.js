// ============================================================================
// HERO CANVAS ANIMATION
// ============================================================================

class CanvasAnimation {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.resize();
        window.addEventListener('resize', () => this.resize());
        this.animate();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createParticles() {
        this.particles = [];
        const count = Math.min(100, Math.floor(window.innerWidth / 10));
        for (let i = 0; i < count; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 2,
                vy: (Math.random() - 0.5) * 2,
                radius: Math.random() * 2 + 1,
                opacity: Math.random() * 0.5 + 0.2,
                color: Math.random() > 0.5 ? '#8B5CF6' : '#06B6D4'
            });
        }
    }

    update() {
        this.particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;

            // Bounce off edges
            if (p.x < 0 || p.x > this.canvas.width) p.vx *= -1;
            if (p.y < 0 || p.y > this.canvas.height) p.vy *= -1;
        });
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.particles.forEach((p, i) => {
            // Draw particle
            this.ctx.fillStyle = p.color;
            this.ctx.globalAlpha = p.opacity;
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            this.ctx.fill();

            // Draw connections
            for (let j = i + 1; j < this.particles.length; j++) {
                const p2 = this.particles[j];
                const dx = p.x - p2.x;
                const dy = p.y - p2.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 150) {
                    this.ctx.strokeStyle = p.color;
                    this.ctx.globalAlpha = (1 - distance / 150) * 0.3;
                    this.ctx.beginPath();
                    this.ctx.moveTo(p.x, p.y);
                    this.ctx.lineTo(p2.x, p2.y);
                    this.ctx.stroke();
                }
            }
        });

        this.ctx.globalAlpha = 1;
    }

    animate() {
        this.update();
        this.draw();
        requestAnimationFrame(() => this.animate());
    }
}

const canvasAnim = new CanvasAnimation('canvas-hero');
canvasAnim.createParticles();

// ============================================================================
// SCROLL ANIMATIONS
// ============================================================================

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'none';
            setTimeout(() => {
                entry.target.style.animation = '';
            }, 10);
        }
    });
}, observerOptions);

document.querySelectorAll('.feature-item, .tech-card, .stat-card, .pipeline-stage').forEach(el => {
    observer.observe(el);
});

// ============================================================================
// COUNTER ANIMATION FOR STATS
// ============================================================================

function animateCounters() {
    const statValues = document.querySelectorAll('.stat-value[data-target]');
    const observerCount = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.dataset.target);
                let current = 0;
                const increment = target / 50;
                const interval = setInterval(() => {
                    current += increment;
                    if (current >= target) {
                        entry.target.textContent = target;
                        clearInterval(interval);
                    } else {
                        entry.target.textContent = Math.floor(current);
                    }
                }, 30);
                observerCount.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    statValues.forEach(el => observerCount.observe(el));
}

animateCounters();

// ============================================================================
// MOUSE MOVEMENT FOR HERO VISUAL
// ============================================================================

const heroVisual = document.querySelector('.hero-visual');
if (heroVisual) {
    document.addEventListener('mousemove', (e) => {
        const x = (e.clientX / window.innerWidth - 0.5) * 20;
        const y = (e.clientY / window.innerHeight - 0.5) * 20;
        heroVisual.style.transform = `perspective(1000px) rotateY(${x}deg) rotateX(${-y}deg)`;
    });

    document.addEventListener('mouseleave', () => {
        heroVisual.style.transform = 'perspective(1000px) rotateY(0) rotateX(0)';
    });
}

// ============================================================================
// BUTTON INTERACTIONS
// ============================================================================

const buttons = document.querySelectorAll('.cta-button');
buttons.forEach(button => {
    button.addEventListener('click', function(e) {
        // Create ripple effect
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: rgba(255, 255, 255, 0.6);
            border-radius: 50%;
            pointer-events: none;
            animation: ripple 0.6s ease-out;
        `;

        this.style.position = 'relative';
        this.style.overflow = 'hidden';
        this.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
    });
});

// ============================================================================
// SMOOTH SCROLL WITH EASING
// ============================================================================

function easeInOutQuad(t) {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

function smoothScroll(target, duration = 1000) {
    const startY = window.scrollY;
    const endY = target.offsetTop - 100;
    const distance = endY - startY;
    let startTime = null;

    function scroll(currentTime) {
        if (startTime === null) startTime = currentTime;
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const ease = easeInOutQuad(progress);
        window.scrollTo(0, startY + distance * ease);
        if (progress < 1) requestAnimationFrame(scroll);
    }

    requestAnimationFrame(scroll);
}

// ============================================================================
// SCROLL PARALLAX EFFECT
// ============================================================================

function handleParallax() {
    const scrollY = window.scrollY;
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        heroContent.style.transform = `translateY(${scrollY * 0.3}px)`;
    }
}

window.addEventListener('scroll', handleParallax, { passive: true });

// ============================================================================
// PERFORMANCE OPTIMIZATION
// ============================================================================

let isSlowDevice = false;
if (navigator.deviceMemory) {
    isSlowDevice = navigator.deviceMemory < 4;
}

if (isSlowDevice) {
    console.log('Performance mode: Low-end device detected');
    canvasAnim.particles = canvasAnim.particles.slice(0, 30);
}

// ============================================================================
// KEYBOARD SHORTCUTS
// ============================================================================

let easterEggSequence = '';
const easterEgg = 'quantum';

document.addEventListener('keydown', (e) => {
    easterEggSequence += e.key.toLowerCase();
    easterEggSequence = easterEggSequence.slice(-easterEgg.length);

    if (easterEggSequence === easterEgg) {
        triggerEasterEgg();
    }
});

function triggerEasterEgg() {
    console.log('%c🚀 QUANTUM MODE ACTIVATED!', 'font-size: 30px; color: #8B5CF6; font-weight: bold;');
    document.body.style.animation = 'quantumFlash 0.5s ease-out';
    
    const style = document.createElement('style');
    style.textContent = `
        @keyframes quantumFlash {
            0% { filter: hue-rotate(0deg) brightness(1); }
            50% { filter: hue-rotate(360deg) brightness(1.2); }
            100% { filter: hue-rotate(0deg) brightness(1); }
        }
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}

// ============================================================================
// CONSOLE WELCOME
// ============================================================================

console.clear();
console.log(`
%c╔════════════════════════════════════════╗
║  🚀 WELCOME TO 10BI v2.0.1 🚀          ║
║  Next Generation Development Platform  ║
╚════════════════════════════════════════╝
`, 'color: #8B5CF6; font-weight: bold; font-size: 14px;');

console.log('%c✨ Premium Features:', 'color: #06B6D4; font-weight: bold;');
console.log('%c• Physics-based Canvas Animations', 'color: #10B981;');
console.log('%c• Smooth Scroll with Easing', 'color: #10B981;');
console.log('%c• Parallax Scrolling', 'color: #10B981;');
console.log('%c• Advanced Particle System', 'color: #10B981;');
console.log('%c• Counter Animations', 'color: #10B981;');
console.log('%c• Responsive Design', 'color: #10B981;');

console.log('%c🔑 Easter Egg: Type "quantum" on your keyboard!', 'color: #EF4444; font-weight: bold;');
