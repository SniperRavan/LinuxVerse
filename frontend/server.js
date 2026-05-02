    // ── CURSOR ──
    const dot = document.getElementById('dot');
    const ring = document.getElementById('ring');
    let mx = 0, my = 0, rx = 0, ry = 0;
    document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
    function animCursor() {
    dot.style.left = mx + 'px'; dot.style.top = my + 'px';
    rx += (mx - rx) * 0.12; ry += (my - ry) * 0.12;
    ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
    requestAnimationFrame(animCursor);
    }
    animCursor();

    // ── SCROLL REVEAL ──
    const observer = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
    }, { threshold: 0.12 });
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

    // ── HERO REVEAL ──
    window.addEventListener('load', () => {
    document.querySelectorAll('.hero .reveal').forEach(el => {
    setTimeout(() => el.classList.add('visible'), 300);
    });
    });

    // ── NAVBAR SCROLL GLASS ──
    window.addEventListener('scroll', () => {
    const nav = document.querySelector('nav');
    if (window.scrollY > 40) {
    nav.style.background = 'rgba(0,0,0,0.6)';
    nav.style.backdropFilter = 'blur(20px)';
    nav.style.borderBottom = '1px solid rgba(255,255,255,0.06)';
    } else {
    nav.style.background = '';
    nav.style.backdropFilter = '';
    nav.style.borderBottom = '';
    }
    });

    // ── TERMINAL TYPEWRITER ──
    const commands = [
    { prompt: true, text: 'echo "Welcome to LinuxVerse"' },
    { prompt: false, text: 'Welcome to LinuxVerse' },
    { prompt: true, text: 'cat /etc/os-release | head -2' },
    { prompt: false, text: 'NAME="Ubuntu"' },
    { prompt: false, text: 'VERSION="22.04.3 LTS (Jammy Jellyfish)"' },
    ];
    // typewriter is decorative — terminal body is already populated statically