document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Smooth Loader ---
    const splashScreen = document.getElementById('splash-screen');
    const progressBar = document.getElementById('loader-progress');
    const statusText = document.getElementById('loader-status-text');
    
    // Simulate loading progress
    let progress = 0;
    const loadingInterval = setInterval(() => {
        progress += Math.floor(Math.random() * 20) + 5;
        if (progress > 100) progress = 100;
        
        progressBar.style.width = progress + '%';
        
        if (progress > 30 && progress < 70) {
            statusText.textContent = "Loading Graphic Assets...";
        } else if (progress >= 70 && progress < 100) {
            statusText.textContent = "Finalizing Animations...";
        }

        if (progress === 100) {
            clearInterval(loadingInterval);
            statusText.textContent = "SYSTEM READY";
            setTimeout(() => {
                splashScreen.classList.add('hidden');
                document.body.style.overflowY = 'auto';
                handleScrollAnimations();
                initAnimations(); // Initialize other JS animations
            }, 800);
        }
    }, 300);

    document.body.style.overflowY = 'hidden';

    // --- 2. Scroll Animation Observer ---
    const animatedElements = document.querySelectorAll('.fade-up');
    
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15 // Trigger when 15% of element is visible
    };

    const scrollObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optional: stop observing once animated to keep it visible
                scrollObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    animatedElements.forEach(el => scrollObserver.observe(el));

    // Animate skill bars when skills section scrolls into view
    const skillBars = document.querySelectorAll('.skill-bar-fill');
    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bar = entry.target;
                bar.style.width = bar.style.width; // trigger reflow
                const target = bar.getAttribute('data-width') || bar.style.width;
                bar.style.width = '0%';
                setTimeout(() => { bar.style.width = target; }, 100);
                skillObserver.unobserve(bar);
            }
        });
    }, { threshold: 0.3 });

    skillBars.forEach(bar => {
        bar.setAttribute('data-width', bar.style.width);
        bar.style.width = '0%';
        skillObserver.observe(bar);
    });

    // Fallback handle for immediate viewport elements upon splash exit
    function handleScrollAnimations() {
        const triggers = document.querySelectorAll('.fade-up:not(.visible)');
        triggers.forEach(el => {
            const rect = el.getBoundingClientRect();
            if(rect.top < window.innerHeight - 100) {
                el.classList.add('visible');
                scrollObserver.unobserve(el);
            }
        });
    }

    // --- 3. Active Nav Link based on Scroll Section ---
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a');

    window.addEventListener('scroll', () => {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            // Add a small offset so it triggers smoothly
            if (pageYOffset >= (sectionTop - sectionHeight / 3)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
    });

    // --- 4. Form Submission Simulation ---
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = contactForm.querySelector('button[type="submit"]');
            const originalText = btn.textContent;
            
            // Visual feedback
            btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';
            btn.style.opacity = '0.8';
            btn.disabled = true;

            // Simulate API call
            setTimeout(() => {
                btn.innerHTML = '<i class="fa-solid fa-check"></i> Message Sent!';
                btn.style.backgroundColor = 'var(--green-status)';
                btn.style.boxShadow = '0 0 15px rgba(0, 255, 0, 0.4)';
                
                contactForm.reset();

                setTimeout(() => {
                    btn.textContent = originalText;
                    btn.style.backgroundColor = '';
                    btn.style.boxShadow = '';
                    btn.style.opacity = '1';
                    btn.disabled = false;
                }, 3000);
            }, 1500);
        });
    }

    // --- Initialize complex animations after load ---
    function initAnimations() {
        // --- 5. Custom Cursor ---
        const cursor = document.querySelector('.custom-cursor');
        const follower = document.querySelector('.custom-cursor-follower');
        
        let mouseX = window.innerWidth / 2, mouseY = window.innerHeight / 2;
        let cursorX = window.innerWidth / 2, cursorY = window.innerHeight / 2;
        
        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            
            // Immediate update for the dot
            cursor.style.transform = `translate3d(${mouseX - 4}px, ${mouseY - 4}px, 0)`;
        });
        
        // Smooth follow for the ring
        const renderCursor = () => {
            cursorX += (mouseX - cursorX) * 0.2;
            cursorY += (mouseY - cursorY) * 0.2;
            if(follower) {
                follower.style.transform = `translate3d(${cursorX - 20}px, ${cursorY - 20}px, 0)`;
            }
            requestAnimationFrame(renderCursor);
        };
        requestAnimationFrame(renderCursor);
        
        // Add hover effect to links and buttons
        const interactables = document.querySelectorAll('a, button, input, textarea, .sharingan-hover');
        interactables.forEach(el => {
            el.addEventListener('mouseenter', () => follower.classList.add('hover-active'));
            el.addEventListener('mouseleave', () => follower.classList.remove('hover-active'));
        });

        // --- 6. Parallax Background & Microinteractions ---
        const parallaxLayers = document.querySelectorAll('.parallax-bg .layer');
        
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            parallaxLayers.forEach(layer => {
                const speed = layer.getAttribute('data-speed');
                layer.style.transform = `translateY(${scrolled * speed}px)`;
            });
        });

        // Button Microinteractions (scale down on click)
        const buttons = document.querySelectorAll('.btn');
        buttons.forEach(btn => {
            btn.addEventListener('mousedown', () => btn.style.transform = 'scale(0.95)');
            btn.addEventListener('mouseup', () => btn.style.transform = 'scale(1)');
            btn.addEventListener('mouseleave', () => btn.style.transform = 'scale(1)');
        });

        // --- 7. 3D Card Tilt Effect ---
        const tiltCards = document.querySelectorAll('.tilt-card');
        
        tiltCards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left; // x position within the element.
                const y = e.clientY - rect.top;  // y position within the element.
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                // Calculate rotation (max rotation is 15 degrees)
                const rotateX = ((y - centerY) / centerY) * -15;
                const rotateY = ((x - centerX) / centerX) * 15;
                
                card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = `rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
            });
        });
    }

});

    // --- Hero video hover ---
    const heroCard  = document.getElementById('hero-card');
    const heroVideo = document.getElementById('hero-video');

    if (heroCard && heroVideo) {
        // Start paused — first frame acts as thumbnail
        heroVideo.pause();
        heroVideo.currentTime = 0;

        heroCard.addEventListener('mouseenter', () => {
            heroVideo.play().catch(() => {});
        });

        heroCard.addEventListener('mouseleave', () => {
            // Pause exactly on current frame — no reset, no blank
            heroVideo.pause();
        });
    }

    // --- About video hover ---
    const aboutCard  = document.getElementById('about-card');
    const aboutVideo = document.getElementById('about-video');

    if (aboutCard && aboutVideo) {
        aboutVideo.pause();
        aboutVideo.currentTime = 0;

        aboutCard.addEventListener('mouseenter', () => {
            aboutVideo.play().catch(() => {});
        });

        aboutCard.addEventListener('mouseleave', () => {
            aboutVideo.pause();
        });
    }