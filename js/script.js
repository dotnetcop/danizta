document.addEventListener('DOMContentLoaded', () => {
    // Custom Cursor
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');
    
    window.addEventListener('mousemove', (e) => {
        const posX = e.clientX;
        const posY = e.clientY;
        
        cursorDot.style.left = `${posX}px`;
        cursorDot.style.top = `${posY}px`;
        
        cursorOutline.animate({
            left: `${posX}px`,
            top: `${posY}px`
        }, { duration: 500, fill: "forwards" });
    });

    // Cursor Hover Effect
    const clickables = document.querySelectorAll('a, button, .nav-toggle');
    clickables.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursorOutline.style.transform = 'translate(-50%, -50%) scale(1.5)';
            cursorOutline.style.backgroundColor = 'rgba(100, 255, 218, 0.1)';
            cursorDot.style.opacity = '0';
        });
        el.addEventListener('mouseleave', () => {
            cursorOutline.style.transform = 'translate(-50%, -50%) scale(1)';
            cursorOutline.style.backgroundColor = 'transparent';
            cursorDot.style.opacity = '1';
        });
    });

    // Navbar Toggle
    const navToggle = document.getElementById('nav-toggle');
    const navLinks = document.getElementById('nav-links');
    
    navToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        navToggle.classList.toggle('active');
        if(navLinks.classList.contains('active')) {
             navToggle.innerHTML = '<i class="fas fa-times"></i>';
        } else {
             navToggle.innerHTML = '<i class="fas fa-bars"></i>';
        }
    });

    // Close mobile menu when link is clicked
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            navToggle.innerHTML = '<i class="fas fa-bars"></i>';
        });
    });

    // Intersection Observer for Animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active-reveal');
                if (entry.target.classList.contains('fade-in-up')) {
                    entry.target.classList.add('active-reveal');
                }
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.fade-in-up, .reveal-up, .reveal-left, .reveal-right');
    animatedElements.forEach(el => observer.observe(el));

    // Number Counter Animation
    const statsSection = document.querySelector('.stats-grid');
    let counted = false;

    const statsObserver = new IntersectionObserver((entries) => {
        if(entries[0].isIntersecting && !counted) {
            const counters = document.querySelectorAll('.stat-number');
            counters.forEach(counter => {
                const target = +counter.getAttribute('data-target');
                const duration = 2000; // 2 seconds
                const increment = target / (duration / 16); // 60fps
                
                let current = 0;
                const updateCounter = () => {
                    current += increment;
                    if(current < target) {
                        counter.innerText = Math.ceil(current);
                        requestAnimationFrame(updateCounter);
                    } else {
                        counter.innerText = target;
                    }
                };
                updateCounter();
            });
            counted = true;
        }
    }, { threshold: 0.5 });

    if(statsSection) {
        statsObserver.observe(statsSection);
    }

    // Dynamic Header Background (Parallax/Movement)
    const header = document.querySelector('.hero');
    header.addEventListener('mousemove', (e) => {
        const x = (window.innerWidth - e.pageX * 2) / 100;
        const y = (window.innerHeight - e.pageY * 2) / 100;
        
        document.querySelector('.hero-bg-animation').style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`;
    });
});
