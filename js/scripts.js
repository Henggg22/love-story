document.addEventListener('DOMContentLoaded', () => {

    // --- Customization Variables ---
    const anniversaryStartDate = new Date('October 19, 2024 00:00:00'); // SET YOUR START DATE HERE!
    const confettiShapes = ['circle', 'square', 'triangle'];
    const commonColors = ['#FFC0CB', '#E6E6FA', '#FFFDD0', '#ff69b4', '#ADD8E6', 'white'];
    const fireworkColors = ['#FFC0CB', '#ff69b4', '#9932CC', '#FFFDD0', '#FFA500']; // Pink, Hot Pink, Purple, Cream, Orange

    // --- 1. Theme Toggle Logic ---
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;

    themeToggle.addEventListener('click', () => {
        const currentTheme = body.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        body.setAttribute('data-theme', newTheme);
        themeToggle.textContent = newTheme === 'dark' ? '☀️' : '🌙';
        localStorage.setItem('theme', newTheme); // Save preference
    });

    // Apply saved theme preference
    const savedTheme = localStorage.getItem('theme') || 'light';
    body.setAttribute('data-theme', savedTheme);
    themeToggle.textContent = savedTheme === 'dark' ? '☀️' : '🌙';


    // --- 2. Live Love Clock / Day Count Logic ---
    const elements = {
        days: document.getElementById('days'),
        hours: document.getElementById('hours'),
        minutes: document.getElementById('minutes'),
        seconds: document.getElementById('seconds'),
        startDateInfo: document.getElementById('start-date')
    };

    elements.startDateInfo.textContent = anniversaryStartDate.toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric'
    });

    function updateDayCount() {
        const now = new Date();
        const diff = now.getTime() - anniversaryStartDate.getTime();

        const totalSeconds = Math.floor(diff / 1000);
        const totalMinutes = Math.floor(totalSeconds / 60);
        const totalHours = Math.floor(totalMinutes / 60);
        const totalDays = Math.floor(totalHours / 24);

        const seconds = totalSeconds % 60;
        const minutes = totalMinutes % 60;
        const hours = totalHours % 24;

        elements.days.textContent = totalDays.toLocaleString();
        elements.hours.textContent = String(hours).padStart(2, '0');
        elements.minutes.textContent = String(minutes).padStart(2, '0');
        elements.seconds.textContent = String(seconds).padStart(2, '0');
    }

    updateDayCount();
    setInterval(updateDayCount, 1000);


    // --- 3. Scroll Fade-in Animations ---
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // observer.unobserve(entry.target); // Uncomment to run animation only once
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right').forEach(element => {
        observer.observe(element);
    });


    // --- 4. Lightbox Functionality ---
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const closeBtn = document.querySelector('.close-btn');

    document.querySelectorAll('.polaroid').forEach(polaroid => {
        polaroid.addEventListener('click', () => {
            lightbox.style.display = "block";
            lightboxImg.src = polaroid.getAttribute('data-src');
        });
    });

    closeBtn.addEventListener('click', () => {
        lightbox.style.display = "none";
    });

    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) { // Only close if clicking the background
             lightbox.style.display = "none";
        }
    });

    // --- 5. Enhanced Particle System ---
    const globalFloatingContainer = document.getElementById('global-floating-elements');
    const sectionContainers = document.querySelectorAll('.section-particles');
    const fireworksContainer = document.getElementById('fireworks-container');
    const snowfallContainer = document.getElementById('snowfall-container');

    const particleEmoji = {
        hearts: ['❤️', '💖', '💕'],
        petals: ['🌸', '🌷', '🌹'],
        sparkles: ['✨', '🌟'],
        stars: ['⭐', '💫'],
        balloons: ['🎈', '🎉'],
    };

    function getRandom(min, max) {
        return Math.random() * (max - min) + min;
    }
    
    function createParticle(container, type, options = {}) {
        const particle = document.createElement('div');
        particle.classList.add('floating-particle', `particle-${type}`);
        
        let emoji = '';
        if (particleEmoji[type]) {
            emoji = particleEmoji[type][Math.floor(Math.random() * particleEmoji[type].length)];
            particle.textContent = emoji;
        }

        const size = getRandom(1, 2.5); // size in em for consistent scaling
        particle.style.fontSize = `${size}em`;
        particle.style.left = `${getRandom(0, 100)}%`;
        particle.style.setProperty('--duration', `${getRandom(10, 25)}s`);
        particle.style.animationDelay = `-${getRandom(0, 15)}s`;
        particle.style.setProperty('--rotation', `${getRandom(0, 720)}deg`); // For petals/confetti rotation
        particle.style.setProperty('--x-offset', `${getRandom(-50, 50)}px`); // For sway

        if (type === 'confetti') {
            const confettiSize = `${getRandom(8, 15)}px`;
            particle.style.setProperty('--size', confettiSize);
            particle.style.setProperty('--border-radius', Math.random() > 0.5 ? '50%' : '2px'); // Circle or square
            particle.style.backgroundColor = commonColors[Math.floor(Math.random() * commonColors.length)];
        } else if (type === 'snow') {
            const snowSize = `${getRandom(5, 12)}px`;
            particle.style.setProperty('--size', snowSize);
            particle.style.opacity = getRandom(0.5, 1);
        } else {
            // Default color for emoji particles, or use custom CSS vars
            particle.style.color = getComputedStyle(document.body).getPropertyValue('--c-particle');
        }
        
        container.appendChild(particle);

        particle.addEventListener('animationend', () => {
            particle.remove();
        });
    }

    // Global Floating Elements (hearts, petals, sparkles)
    setInterval(() => {
        createParticle(globalFloatingContainer, 'hearts');
        createParticle(globalFloatingContainer, 'petals');
        createParticle(globalFloatingContainer, 'sparkles');
    }, 800);

    // Section-specific particle generation based on data-particles attribute
    document.querySelectorAll('section[data-particles]').forEach(section => {
        const particleTypes = section.dataset.particles.split(',');
        const sectionParticlesContainer = section.querySelector('.section-particles');
        
        if (!sectionParticlesContainer) return; // Skip if no container
        
        // Use IntersectionObserver to only generate particles when section is visible
        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Start generating particles
                    section.particleInterval = setInterval(() => {
                        particleTypes.forEach(type => {
                            if (type === 'fireworks') {
                                createFirework(fireworksContainer);
                            } else if (type === 'snow') {
                                createParticle(snowfallContainer, 'snow');
                            } else if (type === 'confetti') {
                                createParticle(sectionParticlesContainer, 'confetti');
                            }
                             else {
                                createParticle(sectionParticlesContainer, type); // Generic emoji particles
                            }
                        });
                    }, 500); // Generate every 0.5 seconds
                } else {
                    // Stop generating particles when not visible
                    if (section.particleInterval) {
                        clearInterval(section.particleInterval);
                    }
                }
            });
        }, { threshold: 0.1 }); // Trigger when 10% of the section is visible
        
        sectionObserver.observe(section);
    });

    // --- Fireworks Animation (More dynamic with JS) ---
    function createFirework(container) {
        const firework = document.createElement('div');
        firework.classList.add('firework');
        
        const startX = getRandom(10, 90);
        const startY = getRandom(80, 100); // Starts from bottom of screen
        const endY = getRandom(10, 40);    // Explodes higher up

        firework.style.left = `${startX}vw`;
        firework.style.top = `${startY}vh`;
        firework.style.setProperty('--end-y', `${endY}vh`);
        firework.style.setProperty('--duration', `${getRandom(2, 4)}s`);
        
        const randomColor = fireworkColors[Math.floor(Math.random() * fireworkColors.length)];
        firework.style.setProperty('--firework-color', randomColor);

        container.appendChild(firework);

        // Animate rocket launch
        const rocket = document.createElement('div');
        rocket.classList.add('firework-rocket');
        rocket.style.backgroundColor = 'white';
        rocket.style.left = `calc(${startX}vw)`;
        rocket.style.top = `calc(${startY}vh)`;
        rocket.style.setProperty('--end-y', `${endY}vh`);
        container.appendChild(rocket);

        rocket.animate([
            { transform: `translateY(0)`, opacity: 0.8 },
            { transform: `translateY(calc(${endY}vh - ${startY}vh))`, opacity: 0 }
        ], {
            duration: getRandom(1000, 2000),
            easing: 'ease-out'
        }).onfinish = () => {
            rocket.remove();
            // Create explosion particles
            createExplosion(firework, randomColor);
            firework.remove();
        };
    }

    function createExplosion(parentFirework, color) {
        const numParticles = getRandom(30, 60);
        const size = getRandom(3, 8);

        for (let i = 0; i < numParticles; i++) {
            const particle = document.createElement('div');
            particle.classList.add('firework-spark');
            particle.style.backgroundColor = color;
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.left = `${parentFirework.offsetLeft + parentFirework.offsetWidth / 2}px`;
            particle.style.top = `${parentFirework.offsetTop + parentFirework.offsetHeight / 2}px`;

            const angle = Math.random() * Math.PI * 2;
            const velocity = getRandom(2, 5);
            const duration = getRandom(1500, 2500);

            particle.animate([
                { transform: `translate(0, 0)`, opacity: 1 },
                { transform: `translate(${Math.cos(angle) * velocity * 50}px, ${Math.sin(angle) * velocity * 50}px)`, opacity: 0 }
            ], {
                duration: duration,
                easing: 'ease-out'
            }).onfinish = () => {
                particle.remove();
            };
            fireworksContainer.appendChild(particle); // Append to main container
        }
    }
});