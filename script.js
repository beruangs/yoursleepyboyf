// Global variables
let canvas, ctx;
let particles = [];
let stars = [];
let isLetterOpen = false;

// Initialize everything when the page loads
document.addEventListener('DOMContentLoaded', function() {
    initCanvas();
    initEventListeners();
    createStars();
    animateBackground();
    
    // Add some cute sound effects
    addSoundEffects();
});

// Initialize canvas for cute animations
function initCanvas() {
    canvas = document.getElementById('cuteCanvas');
    ctx = canvas.getContext('2d');
    
    // Set canvas size
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
}

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

// Initialize event listeners
function initEventListeners() {
    const openLetterBtn = document.getElementById('openLetterBtn');
    const backBtn = document.getElementById('backBtn');
    const envelope = document.getElementById('envelope');
    
    openLetterBtn.addEventListener('click', openLetter);
    backBtn.addEventListener('click', closeLetter);
    envelope.addEventListener('click', openLetter);
    
    // Add mouse move effect for particles
    document.addEventListener('mousemove', createParticle);
}

// Open letter function
function openLetter() {
    const envelopeSection = document.getElementById('envelopeSection');
    const letterSection = document.getElementById('letterSection');
    const envelope = document.getElementById('envelope');
    
    // Animate envelope opening
    envelope.classList.add('open');
    
    // Play background music (force play for mobile)
    const backgroundMusic = document.getElementById('backgroundMusic');
    if (backgroundMusic) {
        // Try to play immediately, fallback to user gesture
        const playPromise = backgroundMusic.play();
        if (playPromise !== undefined) {
            playPromise.catch(() => {
                document.body.addEventListener('touchstart', () => {
                    backgroundMusic.play();
                }, { once: true });
                document.body.addEventListener('click', () => {
                    backgroundMusic.play();
                }, { once: true });
            });
        }
    }
    
    // Transition to letter
    setTimeout(() => {
        envelopeSection.style.display = 'none';
        letterSection.classList.add('show');
        isLetterOpen = true;
        
        // Create celebration particles
        createCelebrationParticles();
    }, 800);
}

// Close letter function
function closeLetter() {
    const envelopeSection = document.getElementById('envelopeSection');
    const letterSection = document.getElementById('letterSection');
    const envelope = document.getElementById('envelope');
    
    letterSection.classList.remove('show');
    
    setTimeout(() => {
        envelopeSection.style.display = 'block';
        envelope.classList.remove('open');
        isLetterOpen = false;
    }, 500);
}

// Create stars for background
function createStars() {
    for (let i = 0; i < 50; i++) {
        stars.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 2 + 1,
            opacity: Math.random() * 0.8 + 0.2,
            twinkleSpeed: Math.random() * 0.02 + 0.01
        });
    }
}

// Create particle on mouse move
function createParticle(e) {
    if (particles.length > 50) return; // Limit particles for performance
    
    particles.push({
        x: e.clientX,
        y: e.clientY,
        vx: (Math.random() - 0.5) * 4,
        vy: (Math.random() - 0.5) * 4,
        life: 1,
        decay: 0.02,
        size: Math.random() * 8 + 4,
        color: getRandomColor()
    });
}

// Create celebration particles
function createCelebrationParticles() {
    for (let i = 0; i < 30; i++) {
        setTimeout(() => {
            particles.push({
                x: Math.random() * canvas.width,
                y: canvas.height,
                vx: (Math.random() - 0.5) * 8,
                vy: -Math.random() * 15 - 5,
                life: 1,
                decay: 0.01,
                size: Math.random() * 12 + 6,
                color: getRandomColor(),
                gravity: 0.3
            });
        }, i * 100);
    }
}

// Get random color for particles
function getRandomColor() {
    const colors = ['#ff69b4', '#ff1493', '#ffb6c1', '#ffc0cb', '#ff91a4', '#ff8fa3'];
    return colors[Math.floor(Math.random() * colors.length)];
}

// Animate background elements
function animateBackground() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw and animate stars
    stars.forEach(star => {
        star.opacity += Math.sin(Date.now() * star.twinkleSpeed) * 0.01;
        star.opacity = Math.max(0.2, Math.min(1, star.opacity));
        
        ctx.save();
        ctx.globalAlpha = star.opacity;
        ctx.fillStyle = '#ffe4e1';
        ctx.beginPath();
        drawStar(star.x, star.y, 5, star.size, star.size * 0.5);
        ctx.fill();
        ctx.restore();
    });
    
    // Draw and animate particles
    for (let i = particles.length - 1; i >= 0; i--) {
        const particle = particles[i];
        
        // Update particle
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.life -= particle.decay;
        
        if (particle.gravity) {
            particle.vy += particle.gravity;
        }
        
        // Remove dead particles
        if (particle.life <= 0) {
            particles.splice(i, 1);
            continue;
        }
        
        // Draw particle
        ctx.save();
        ctx.globalAlpha = particle.life;
        ctx.fillStyle = particle.color;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size * particle.life, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
    
    // Draw floating cute shapes
    drawFloatingShapes();
    
    requestAnimationFrame(animateBackground);
}

// Draw star shape
function drawStar(x, y, spikes, outerRadius, innerRadius) {
    let rot = Math.PI / 2 * 3;
    let step = Math.PI / spikes;
    
    ctx.moveTo(x, y - outerRadius);
    
    for (let i = 0; i < spikes; i++) {
        ctx.lineTo(x + Math.cos(rot) * outerRadius, y + Math.sin(rot) * outerRadius);
        rot += step;
        ctx.lineTo(x + Math.cos(rot) * innerRadius, y + Math.sin(rot) * innerRadius);
        rot += step;
    }
    
    ctx.lineTo(x, y - outerRadius);
}

// Draw floating cute shapes
function drawFloatingShapes() {
    const time = Date.now() * 0.001;
    
    // Floating hearts
    for (let i = 0; i < 3; i++) {
        const x = (canvas.width / 4) * (i + 1) + Math.sin(time + i) * 50;
        const y = 100 + Math.cos(time + i * 0.5) * 30;
        
        drawHeart(x, y, 8, '#ffb6c1');
    }
    
    // Floating flowers
    for (let i = 0; i < 2; i++) {
        const x = (canvas.width / 3) * (i + 1) + Math.cos(time + i * 2) * 40;
        const y = canvas.height - 150 + Math.sin(time + i) * 25;
        
        drawFlower(x, y, 6, '#ffc0cb');
    }
}

// Draw heart shape
function drawHeart(x, y, size, color) {
    ctx.save();
    ctx.fillStyle = color;
    ctx.globalAlpha = 0.6;
    ctx.beginPath();
    ctx.moveTo(x, y + size);
    ctx.bezierCurveTo(x, y, x - size, y, x - size, y + size);
    ctx.bezierCurveTo(x - size, y + size * 2, x, y + size * 2, x, y + size * 3);
    ctx.bezierCurveTo(x, y + size * 2, x + size, y + size * 2, x + size, y + size);
    ctx.bezierCurveTo(x + size, y, x, y, x, y + size);
    ctx.fill();
    ctx.restore();
}

// Draw flower shape
function drawFlower(x, y, size, color) {
    ctx.save();
    ctx.fillStyle = color;
    ctx.globalAlpha = 0.5;
    
    // Draw petals
    for (let i = 0; i < 6; i++) {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate((i * Math.PI) / 3);
        ctx.beginPath();
        ctx.ellipse(0, -size, size * 0.6, size * 1.2, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
    
    // Draw center
    ctx.fillStyle = '#ff69b4';
    ctx.beginPath();
    ctx.arc(x, y, size * 0.4, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.restore();
}

// Add sound effects
function addSoundEffects() {
    // Create audio context for sound effects
    let audioContext;
    
    try {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    } catch (e) {
        console.log('Audio context not supported');
        return;
    }
    
    // Add hover sound to buttons
    const buttons = document.querySelectorAll('.open-letter-btn, .back-btn');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', () => {
            playTone(audioContext, 800, 0.1, 'sine', 0.1);
        });
        
        button.addEventListener('click', () => {
            playTone(audioContext, 600, 0.2, 'sine', 0.2);
        });
    });
}

// Play tone function
function playTone(audioContext, frequency, duration, type, volume) {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = frequency;
    oscillator.type = type;
    
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(volume, audioContext.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + duration);
}

// Add cute cursor trail effect
let cursorTrail = [];

document.addEventListener('mousemove', function(e) {
    cursorTrail.push({
        x: e.clientX,
        y: e.clientY,
        life: 20
    });
    
    // Limit trail length
    if (cursorTrail.length > 15) {
        cursorTrail.shift();
    }
});

// Animate cursor trail
function animateCursorTrail() {
    cursorTrail.forEach((point, index) => {
        point.life--;
        if (point.life <= 0) {
            cursorTrail.splice(index, 1);
        }
    });
    
    requestAnimationFrame(animateCursorTrail);
}

animateCursorTrail();

// Add typing effect to letter
function addTypingEffect() {
    if (!isLetterOpen) return;
    
    const letterBody = document.querySelector('.letter-body');
    const paragraphs = letterBody.querySelectorAll('p:not(.greeting)');
    
    paragraphs.forEach((p, index) => {
        setTimeout(() => {
            p.style.opacity = '0';
            p.style.transform = 'translateY(20px)';
            p.style.transition = 'all 0.5s ease';
            
            setTimeout(() => {
                p.style.opacity = '1';
                p.style.transform = 'translateY(0)';
            }, 100);
        }, index * 300);
    });
}

// Auto-play soft background music (Note: Most browsers block autoplay)
function initBackgroundMusic() {
    const music = document.getElementById('backgroundMusic');
    
    // Try to play music when user interacts with the page
    document.addEventListener('click', function() {
        if (music.paused) {
            music.play().catch(e => console.log('Music play failed:', e));
        }
    }, { once: true });
}

// Initialize background music
initBackgroundMusic();

// Add window focus/blur effects
window.addEventListener('focus', function() {
    document.title = 'My Apology Letter 💕';
});

window.addEventListener('blur', function() {
    document.title = 'Come back baby! 😔💕';
});

// Add seasonal/time-based effects
function addTimeBasedEffects() {
    const hour = new Date().getHours();
    
    if (hour >= 18 || hour <= 6) {
        // Night time - add moon and more stars
        document.body.style.background = 'linear-gradient(135deg, #2d1b69 0%, #11998e 50%, #38ef7d 100%)';
        
        // Add moon
        const moon = document.createElement('div');
        moon.innerHTML = '🌙';
        moon.style.position = 'fixed';
        moon.style.top = '10%';
        moon.style.right = '10%';
        moon.style.fontSize = '3rem';
        moon.style.zIndex = '2';
        moon.style.animation = 'float 4s ease-in-out infinite';
        document.body.appendChild(moon);
    }
}

// Call time-based effects
addTimeBasedEffects();

// Easter egg: Konami code
let konamiCode = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];
let konamiIndex = 0;

document.addEventListener('keydown', function(e) {
    if (e.keyCode === konamiCode[konamiIndex]) {
        konamiIndex++;
        if (konamiIndex === konamiCode.length) {
            // Easter egg activated!
            createFireworks();
            konamiIndex = 0;
        }
    } else {
        konamiIndex = 0;
    }
});

// Create fireworks effect
function createFireworks() {
    for (let i = 0; i < 50; i++) {
        setTimeout(() => {
            const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 20,
                vy: (Math.random() - 0.5) * 20,
                life: 1,
                decay: 0.02,
                size: Math.random() * 8 + 4,
                color: colors[Math.floor(Math.random() * colors.length)]
            });
        }, i * 50);
    }
}
