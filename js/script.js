/* ============================================================
   PORTFOLIO — script.js
   Ian Louis Motol
   ============================================================ */

/* ── 1. THEME TOGGLE ── */
const themeToggle = document.getElementById('themeToggle');
const root = document.documentElement;

const savedTheme = localStorage.getItem('theme');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
root.setAttribute('data-theme', savedTheme || (prefersDark ? 'dark' : 'light'));

themeToggle.addEventListener('click', () => {
    const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
});


/* ── 2. SCROLL SPY ── */
const navLinks = document.querySelectorAll('.nav-links a[data-section]');
const sections = Array.from(navLinks)
    .map(l => document.getElementById(l.dataset.section))
    .filter(Boolean);

function setActiveLink(id) {
    navLinks.forEach(l => l.classList.toggle('active', l.dataset.section === id));
}

const spyObserver = new IntersectionObserver(entries => {
    const visible = entries.filter(e => e.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
    if (visible.length) setActiveLink(visible[0].target.id);
}, { rootMargin: '-25% 0px -55% 0px', threshold: [0, 0.25, 0.5, 1] });

sections.forEach(s => spyObserver.observe(s));
navLinks.forEach(l => l.addEventListener('click', () => setActiveLink(l.dataset.section)));


/* ── 3. NAV SHADOW ON SCROLL ── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 8);
}, { passive: true });


/* ── 4. PAGE PROGRESS BAR ── */
const progressBar = document.createElement('div');
progressBar.id = 'progress-bar';
document.body.prepend(progressBar);

window.addEventListener('scroll', () => {
    const scrolled = window.scrollY / (document.body.scrollHeight - window.innerHeight);
    progressBar.style.transform = `scaleX(${scrolled})`;
}, { passive: true });


/* ── 5. SCROLL REVEAL WITH STAGGER ── */
const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach((el, i) => {
    el.style.transitionDelay = `${(i % 4) * 80}ms`;
    revealObserver.observe(el);
});


/* ── 6. HERO ENTRANCE ANIMATION ── */
(function heroEntrance() {
    const heroContent = document.querySelector('.hero-content');
    const heroImage   = document.querySelector('.hero-image-wrapper');
    if (!heroContent || !heroImage) return;

    heroContent.style.cssText  = 'opacity:0; transform:translateY(28px)';
    heroImage.style.cssText    = 'opacity:0; transform:translateX(28px)';

    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            heroContent.style.cssText = 'opacity:1; transform:translateY(0); transition: opacity 0.8s ease, transform 0.8s ease';
            setTimeout(() => {
                heroImage.style.cssText = 'opacity:1; transform:translateX(0); transition: opacity 0.8s ease, transform 0.8s ease';
            }, 220);
        });
    });
})();


/* ── 7. TYPEWRITER EFFECT on hero H1 ── */
(function typewriter() {
    const el = document.querySelector('h1');
    if (!el) return;

    const lines = ['Building Powerful', 'Software That', 'That Drives Business Growth.'];
    let lineIndex = 0;
    let charIndex = 0;
    let rendered  = '';

    function buildHTML() {
        let html = '';
        lines.forEach((line, i) => {
            if (i < lineIndex) {
                html += (i === lines.length - 1)
                    ? `<span class="highlight">${line}</span><br>`
                    : `${line}<br>`;
            } else if (i === lineIndex) {
                const partial = line.slice(0, charIndex);
                html += (i === lines.length - 1)
                    ? `<span class="highlight">${partial}</span><span class="tw-cursor">|</span><br>`
                    : `${partial}<span class="tw-cursor">|</span><br>`;
            }
        });
        return html;
    }

    el.innerHTML = '';
    el.style.visibility = 'visible';

    // delay start so hero entrance finishes first
    setTimeout(function tick() {
        const currentLine = lines[lineIndex];

        if (charIndex < currentLine.length) {
            charIndex++;
            el.innerHTML = buildHTML();
            setTimeout(tick, 42);
        } else {
            lineIndex++;
            charIndex = 0;
            if (lineIndex < lines.length) {
                el.innerHTML = buildHTML();
                setTimeout(tick, 260);
            } else {
                // remove cursor when done
                const cursor = el.querySelector('.tw-cursor');
                if (cursor) cursor.remove();
                el.innerHTML = `Building Powerful<br>Software That<br><span class="highlight">That Drives Business Growth.</span>`;
            }
        }
    }, 700);
})();


/* ── 8. ANIMATED COUNTERS (stat cards) ── */
function animateCounter(el, target, suffix = '') {
    const duration = 1600;
    const start    = performance.now();
    const isFloat  = target % 1 !== 0;

    function update(now) {
        const elapsed  = Math.min((now - start) / duration, 1);
        const eased    = 1 - Math.pow(1 - elapsed, 3); // ease-out cubic
        const value    = target * eased;
        el.textContent = (isFloat ? value.toFixed(1) : Math.round(value)) + suffix;
        if (elapsed < 1) requestAnimationFrame(update);
    }

    requestAnimationFrame(update);
}

const counterObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const strong = entry.target.querySelector('strong');
        if (!strong) return;

        const raw     = strong.textContent.trim();
        const num     = parseFloat(raw.replace(/[^0-9.]/g, ''));
        const suffix  = raw.replace(/[0-9.]/g, '');

        if (!isNaN(num)) animateCounter(strong, num, suffix);
        counterObserver.unobserve(entry.target);
    });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-card').forEach(c => counterObserver.observe(c));


/* ── 9. TIMELINE DRAW-IN ANIMATION ── */
const timelineLine = document.querySelector('.timeline::before');
const timeline     = document.querySelector('.timeline');

if (timeline) {
    const timelineObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                timeline.classList.add('timeline-animate');
                timelineObserver.unobserve(timeline);
            }
        });
    }, { threshold: 0.15 });

    timelineObserver.observe(timeline);

    // Stagger timeline items
    document.querySelectorAll('.timeline-item').forEach((item, i) => {
        item.style.opacity    = '0';
        item.style.transform  = 'translateX(-16px)';
        item.style.transition = `opacity 0.5s ease ${i * 160}ms, transform 0.5s ease ${i * 160}ms`;

        const itemObserver = new IntersectionObserver(entries => {
            entries.forEach(e => {
                if (e.isIntersecting) {
                    e.target.style.opacity   = '1';
                    e.target.style.transform = 'translateX(0)';
                    itemObserver.unobserve(e.target);
                }
            });
        }, { threshold: 0.2 });

        itemObserver.observe(item);
    });
}


/* ── 10. MAGNETIC BUTTONS ── */
document.querySelectorAll('.btn-dark, .btn-primary, .btn-light').forEach(btn => {
    btn.addEventListener('mousemove', e => {
        const rect = btn.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width  - 0.5) * 12;
        const y = ((e.clientY - rect.top)  / rect.height - 0.5) * 8;
        btn.style.transform = `translate(${x}px, ${y}px) translateY(-2px)`;
    });

    btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
        btn.style.transition = 'transform 0.4s cubic-bezier(0.23, 1, 0.32, 1)';
        setTimeout(() => btn.style.transition = '', 400);
    });
});


/* ── 11. CURSOR GLOW (desktop only) ── */
if (window.matchMedia('(pointer: fine)').matches) {
    const glow = document.createElement('div');
    glow.id = 'cursor-glow';
    document.body.appendChild(glow);

    let mx = -200, my = -200;
    let cx = -200, cy = -200;

    document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

    function animGlow() {
        cx += (mx - cx) * 0.08;
        cy += (my - cy) * 0.08;
        glow.style.transform = `translate(${cx - 200}px, ${cy - 200}px)`;
        requestAnimationFrame(animGlow);
    }
    requestAnimationFrame(animGlow);

    // Enlarge on hoverable elements
    const hoverables = 'a, button, .project-card, .award-card, .stack-pill, .stat-card';
    document.querySelectorAll(hoverables).forEach(el => {
        el.addEventListener('mouseenter', () => glow.classList.add('hovered'));
        el.addEventListener('mouseleave', () => glow.classList.remove('hovered'));
    });
}


/* ── 12. PARALLAX ON HERO IMAGE ── */
(function parallax() {
    const wrapper = document.querySelector('.hero-image-wrapper');
    if (!wrapper) return;

    window.addEventListener('scroll', () => {
        const y = window.scrollY;
        if (y < window.innerHeight * 1.5) {
            wrapper.style.transform = `translateY(${y * 0.1}px)`;
        }
    }, { passive: true });
})();


/* ── 13. STACK PILL RIPPLE ── */
document.querySelectorAll('.stack-pill').forEach(pill => {
    pill.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        ripple.className = 'ripple';
        const rect = pill.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        ripple.style.cssText = `
            width: ${size}px; height: ${size}px;
            left: ${e.clientX - rect.left - size / 2}px;
            top:  ${e.clientY - rect.top  - size / 2}px;
        `;
        pill.style.position = 'relative';
        pill.style.overflow = 'hidden';
        pill.appendChild(ripple);
        ripple.addEventListener('animationend', () => ripple.remove());
    });
});


/* ── 14. YEAR TOGGLE (GitHub) ── */
document.querySelectorAll('.year-toggles span').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.year-toggles span').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
    });
});


/* ── 15. SMOOTH SECTION HIGHLIGHT (underline drawn in) ── */
// Already handled by CSS slideIn keyframe on .active::after
