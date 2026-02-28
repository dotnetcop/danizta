document.addEventListener('DOMContentLoaded', () => {
    // ============================================================
    //  THEME & PALETTE SYSTEM
    // ============================================================
    const htmlEl = document.documentElement;

    // All toggle buttons (navbar + panel)
    const navbarToggle = document.getElementById('theme-toggle');
    const panelToggle = document.getElementById('theme-toggle-panel');
    const modeLabel = document.getElementById('mode-label');

    // Palette picker
    const pickerToggle = document.getElementById('palette-picker-toggle');
    const palettePanel = document.getElementById('palette-panel');
    const swatchBtns = document.querySelectorAll('.palette-swatch-btn');

    // ── Restore saved preferences ──────────────────────────────
    const savedTheme = localStorage.getItem('danizta-theme') || 'dark';
    const savedPalette = localStorage.getItem('danizta-palette') || 'default';

    applyTheme(savedTheme);
    applyPalette(savedPalette);

    // ── Core helpers ───────────────────────────────────────────
    function applyTheme(theme) {
        document.body.classList.add('theme-transition');
        htmlEl.setAttribute('data-theme', theme);
        localStorage.setItem('danizta-theme', theme);
        updateModeLabel(theme);
        // Sync slider positions on both toggles
        [navbarToggle, panelToggle].forEach(btn => {
            if (!btn) return;
            if (theme === 'light') {
                btn.classList.add('light-mode');
            } else {
                btn.classList.remove('light-mode');
            }
        });
        setTimeout(() => document.body.classList.remove('theme-transition'), 500);
    }

    function applyPalette(palette) {
        // Remove old palette attributes
        htmlEl.removeAttribute('data-palette');
        if (palette !== 'default') {
            htmlEl.setAttribute('data-palette', palette);
        }
        localStorage.setItem('danizta-palette', palette);
        // Update active swatch highlight
        swatchBtns.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.palette === palette);
        });
    }

    function updateModeLabel(theme) {
        if (modeLabel) {
            modeLabel.textContent = theme === 'light' ? 'Light Mode' : 'Dark Mode';
        }
    }

    function toggleTheme() {
        const current = htmlEl.getAttribute('data-theme') || 'dark';
        applyTheme(current === 'dark' ? 'light' : 'dark');
    }

    // ── Toggle listeners ───────────────────────────────────────
    if (navbarToggle) navbarToggle.addEventListener('click', toggleTheme);
    if (panelToggle) panelToggle.addEventListener('click', toggleTheme);

    // ── Palette swatch listeners ───────────────────────────────
    swatchBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            document.body.classList.add('theme-transition');
            applyPalette(btn.dataset.palette);
            setTimeout(() => document.body.classList.remove('theme-transition'), 500);
        });
    });

    // ── Palette panel open / close ─────────────────────────────
    function togglePanel() {
        const isOpen = palettePanel.classList.contains('open');
        palettePanel.classList.toggle('open', !isOpen);
        pickerToggle.classList.toggle('open', !isOpen);
    }

    if (pickerToggle) pickerToggle.addEventListener('click', (e) => { e.stopPropagation(); togglePanel(); });

    // Close panel on outside click
    document.addEventListener('click', (e) => {
        const container = document.getElementById('palette-picker-container');
        if (container && !container.contains(e.target)) {
            palettePanel.classList.remove('open');
            pickerToggle.classList.remove('open');
        }
    });

    // Custom Cursor (skip when user prefers reduced motion)
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (cursorDot && cursorOutline && !prefersReducedMotion) {
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

        const clickables = document.querySelectorAll('a, button, .nav-toggle');
        clickables.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursorOutline.classList.add('cursor-hover');
                cursorOutline.style.transform = 'translate(-50%, -50%) scale(1.5)';
                cursorDot.style.opacity = '0';
            });
            el.addEventListener('mouseleave', () => {
                cursorOutline.classList.remove('cursor-hover');
                cursorOutline.style.transform = 'translate(-50%, -50%) scale(1)';
                cursorDot.style.opacity = '1';
            });
        });
    }

    // Navbar Toggle
    const navToggle = document.getElementById('nav-toggle');
    const navLinks = document.getElementById('nav-links');

    navToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        navToggle.classList.toggle('active');
        if (navLinks.classList.contains('active')) {
            navToggle.innerHTML = '<i class="fas fa-times"></i>';
        } else {
            navToggle.innerHTML = '<i class="fas fa-bars"></i>';
        }
    });

    // Contact form: no backend — prevent submit, show message and open mailto
    const contactForm = document.getElementById('contactForm');
    const contactFormMessage = document.getElementById('contact-form-message');
    if (contactForm && contactFormMessage) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const nameEl = document.getElementById('name');
            const emailEl = document.getElementById('email');
            const messageEl = document.getElementById('message');
            const name = (nameEl && nameEl.value) ? nameEl.value.trim() : '';
            const email = (emailEl && emailEl.value) ? emailEl.value.trim() : '';
            const message = (messageEl && messageEl.value) ? messageEl.value.trim() : '';
            const subject = encodeURIComponent('Contact from Danizta website' + (name ? ` – ${name}` : ''));
            const body = encodeURIComponent(
                (message ? `${message}\n\n` : '') +
                '---\n' + (name ? `Name: ${name}\n` : '') + (email ? `Email: ${email}` : '')
            );
            contactFormMessage.textContent = "Opening your email client to send your message to hello@danizta.com.";
            contactFormMessage.hidden = false;
            window.location.href = `mailto:hello@danizta.com?subject=${subject}&body=${body}`;
        });
    }

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
        if (entries[0].isIntersecting && !counted) {
            const counters = document.querySelectorAll('.stat-number');
            counters.forEach(counter => {
                const target = +counter.getAttribute('data-target');
                const duration = 2000; // 2 seconds
                const increment = target / (duration / 16); // 60fps

                let current = 0;
                const updateCounter = () => {
                    current += increment;
                    if (current < target) {
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

    if (statsSection) {
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
