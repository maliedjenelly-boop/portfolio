/* ============================================================
   Nelly Maliedje — Portfolio interactions (vanilla JS)
   ============================================================ */
(function () {
  'use strict';

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- Set reveal delays from data attribute ---- */
  document.querySelectorAll('[data-reveal-delay]').forEach(function (el) {
    el.style.setProperty('--rd', el.getAttribute('data-reveal-delay'));
  });

  /* ---- Scroll reveal ---- */
  const reveals = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window && !prefersReduced) {
    const io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---- Navbar scrolled state + scroll progress ---- */
  const navbar = document.getElementById('navbar');
  const progress = document.getElementById('scrollProgress');
  function onScroll() {
    const y = window.scrollY;
    if (navbar) navbar.classList.toggle('scrolled', y > 40);
    if (progress) {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.width = (h > 0 ? (y / h) * 100 : 0) + '%';
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---- Active nav link (scroll spy) ---- */
  const sections = ['about', 'work', 'skills', 'journey', 'contact']
    .map(function (id) { return document.getElementById(id); })
    .filter(Boolean);
  const navLinksMap = {};
  document.querySelectorAll('.nav-link').forEach(function (a) {
    const href = a.getAttribute('href');
    if (href && href.charAt(0) === '#') navLinksMap[href.slice(1)] = a;
  });
  if ('IntersectionObserver' in window && sections.length) {
    const spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          Object.values(navLinksMap).forEach(function (a) { a.classList.remove('active'); });
          const link = navLinksMap[entry.target.id];
          if (link) link.classList.add('active');
        }
      });
    }, { threshold: 0.5, rootMargin: '-20% 0px -40% 0px' });
    sections.forEach(function (s) { spy.observe(s); });
  }

  /* ---- Mobile nav toggle ---- */
  const toggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  if (toggle && navLinks) {
    toggle.addEventListener('click', function () {
      const open = navLinks.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      document.body.style.overflow = open ? 'hidden' : '';
    });
    navLinks.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        navLinks.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  /* ---- Animated counters ---- */
  function formatFr(n) { return n.toLocaleString('fr-FR'); }
  function animateCount(el) {
    const target = parseFloat(el.getAttribute('data-count'));
    const suffix = el.getAttribute('data-suffix') || '';
    const isFr = el.getAttribute('data-format') === 'fr';
    const dur = 1500;
    const start = performance.now();
    function tick(now) {
      const p = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      const val = Math.round(target * eased);
      el.textContent = (isFr ? formatFr(val) : val) + suffix;
      if (p < 1) requestAnimationFrame(tick);
      else el.textContent = (isFr ? formatFr(target) : target) + suffix;
    }
    requestAnimationFrame(tick);
  }
  const counters = document.querySelectorAll('[data-count]');
  if ('IntersectionObserver' in window && !prefersReduced) {
    const cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { animateCount(entry.target); cio.unobserve(entry.target); }
      });
    }, { threshold: 0.6 });
    counters.forEach(function (el) { cio.observe(el); });
  } else {
    counters.forEach(function (el) {
      const t = parseFloat(el.getAttribute('data-count'));
      const s = el.getAttribute('data-suffix') || '';
      el.textContent = (el.getAttribute('data-format') === 'fr' ? formatFr(t) : t) + s;
    });
  }

  /* ---- Cursor glow (desktop, fine pointer) ---- */
  const glow = document.getElementById('cursorGlow');
  const finePointer = window.matchMedia('(pointer: fine)').matches;
  if (glow && finePointer && !prefersReduced) {
    let gx = window.innerWidth / 2, gy = window.innerHeight / 2, cx = gx, cy = gy;
    window.addEventListener('mousemove', function (e) {
      gx = e.clientX; gy = e.clientY; glow.style.opacity = '1';
    });
    document.addEventListener('mouseleave', function () { glow.style.opacity = '0'; });
    (function loop() {
      cx += (gx - cx) * 0.14; cy += (gy - cy) * 0.14;
      glow.style.transform = 'translate(' + cx + 'px,' + cy + 'px) translate(-50%,-50%)';
      requestAnimationFrame(loop);
    })();
  }

  /* ---- Card spotlight (mouse-follow radial) ---- */
  document.querySelectorAll('[data-spotlight]').forEach(function (card) {
    card.addEventListener('mousemove', function (e) {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
      card.style.setProperty('--my', (e.clientY - r.top) + 'px');
    });
  });

  /* ---- Magnetic buttons ---- */
  if (finePointer && !prefersReduced) {
    document.querySelectorAll('[data-magnetic]').forEach(function (el) {
      const strength = 0.28;
      el.addEventListener('mousemove', function (e) {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left - r.width / 2) * strength;
        const y = (e.clientY - r.top - r.height / 2) * strength;
        el.style.transform = 'translate(' + x + 'px,' + y + 'px)';
      });
      el.addEventListener('mouseleave', function () { el.style.transform = ''; });
    });
  }

  /* ---- "Monde data" : fond anime (courbes + barres) dans le hero ---- */
  (function initDataWorld() {
    const canvas = document.getElementById('heroData');
    if (!canvas || !canvas.getContext) return;
    const ctx = canvas.getContext('2d');

    const css = getComputedStyle(document.documentElement);
    function hexToRgb(h) {
      h = (h || '').trim().replace('#', '');
      if (h.length === 3) h = h.split('').map(function (c) { return c + c; }).join('');
      const n = parseInt(h || '9d4edd', 16);
      return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
    }
    const A = hexToRgb(css.getPropertyValue('--accent') || '#9d4edd');
    const B = hexToRgb(css.getPropertyValue('--accent-2') || '#c77dff');
    const rgba = function (c, a) { return 'rgba(' + c[0] + ',' + c[1] + ',' + c[2] + ',' + a + ')'; };

    let W = 0, H = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    function resize() {
      W = canvas.clientWidth; H = canvas.clientHeight;
      canvas.width = Math.max(1, W * dpr); canvas.height = Math.max(1, H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    window.addEventListener('resize', resize, { passive: true });

    const barW = 26, gap = 16;
    function draw(t) {
      ctx.clearRect(0, 0, W, H);

      // --- Bar chart (bas du hero) ---
      const count = Math.ceil(W / (barW + gap)) + 1;
      const baseY = H * 0.9;
      const maxH = H * 0.4;
      for (let i = 0; i < count; i++) {
        const x = i * (barW + gap);
        const seed = Math.sin(i * 12.9898) * 43758.5453;
        const rnd = seed - Math.floor(seed);
        const h = (0.16 + 0.84 * Math.abs(Math.sin(t * 0.0006 + i * 0.55 + rnd * 6.28))) * maxH * (0.45 + rnd * 0.55);
        const y = baseY - h, r = 4;
        const g = ctx.createLinearGradient(0, y, 0, baseY);
        g.addColorStop(0, rgba(A, 0.18));
        g.addColorStop(1, rgba(A, 0.01));
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.moveTo(x, baseY); ctx.lineTo(x, y + r);
        ctx.quadraticCurveTo(x, y, x + r, y);
        ctx.lineTo(x + barW - r, y);
        ctx.quadraticCurveTo(x + barW, y, x + barW, y + r);
        ctx.lineTo(x + barW, baseY); ctx.closePath(); ctx.fill();
      }

      // --- Line charts (courbes qui ondulent) ---
      const series = [
        { col: A, amp: H * 0.10, mid: H * 0.40, f1: 0.0055, f2: 0.013, sp: 0.0011, w: 1.6, a: 0.55 },
        { col: B, amp: H * 0.075, mid: H * 0.54, f1: 0.0072, f2: 0.017, sp: -0.0015, w: 1.4, a: 0.45 }
      ];
      series.forEach(function (s) {
        ctx.beginPath();
        for (let x = 0; x <= W; x += 6) {
          const y = s.mid + s.amp * (Math.sin(x * s.f1 + t * s.sp) + 0.5 * Math.sin(x * s.f2 - t * s.sp * 1.6));
          if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = rgba(s.col, s.a);
        ctx.lineWidth = s.w;
        ctx.shadowColor = rgba(s.col, 0.5); ctx.shadowBlur = 8;
        ctx.stroke();
        ctx.shadowBlur = 0;
        // point de donnée qui se déplace
        const px = (t * 0.055) % W;
        const py = s.mid + s.amp * (Math.sin(px * s.f1 + t * s.sp) + 0.5 * Math.sin(px * s.f2 - t * s.sp * 1.6));
        ctx.beginPath(); ctx.arc(px, py, 2.6, 0, 6.283);
        ctx.fillStyle = rgba(s.col, 0.9); ctx.fill();
      });
    }

    if (prefersReduced) { draw(0); return; }
    let last = 0;
    (function loop(now) {
      if (now - last > 33) { draw(now); last = now; }  // ~30 fps
      requestAnimationFrame(loop);
    })(0);
  })();
})();
