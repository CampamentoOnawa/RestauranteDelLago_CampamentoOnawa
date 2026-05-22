/* ══════════════════════════════════════════
   main.js — Restaurante del Lago · Inauguración
══════════════════════════════════════════ */

(function () {
  'use strict';

  const WA_NUMBER  = '5215530086410';
  const WA_MSG_FAB = encodeURIComponent('Hola, tengo una duda sobre la inauguración del Restaurante del Lago en Campamento Onawa.');

  /* ────────────────────────────────────────
     1. HERO SLIDESHOW  (fade, 6 s)
  ──────────────────────────────────────── */
  const slides    = document.querySelectorAll('.hero__slide');
  const slideDots = document.querySelectorAll('.hero__slide-dot');
  let   current   = 0;
  let   timer;

  function goToSlide(idx) {
    slides[current].classList.remove('active');
    slideDots[current].classList.remove('active');
    current = (idx + slides.length) % slides.length;
    slides[current].classList.add('active');
    slideDots[current].classList.add('active');
  }

  function startSlideshow() {
    timer = setInterval(() => goToSlide(current + 1), 6000);
  }

  if (slides.length) {
    // first slide already has .active in HTML
    startSlideshow();
    slideDots.forEach((dot, i) => {
      dot.addEventListener('click', () => {
        clearInterval(timer);
        goToSlide(i);
        startSlideshow();
      });
    });
  }

  /* ────────────────────────────────────────
     2. STICKY NAV
  ──────────────────────────────────────── */
  const nav      = document.getElementById('site-nav');
  const sections = document.querySelectorAll('[data-nav]');
  const navLinks = document.querySelectorAll('.nav__link');

  function updateNav() {
    const scrolled = window.scrollY > 40;
    nav.classList.toggle('site-nav--solid',       scrolled);
    nav.classList.toggle('site-nav--transparent', !scrolled);
  }

  function updateActiveLink() {
    let active = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 80) active = sec.dataset.nav;
    });
    navLinks.forEach(l => l.classList.toggle('active', l.dataset.section === active));
  }

  if (nav) {
    nav.classList.add('site-nav--transparent');
    window.addEventListener('scroll', () => { updateNav(); updateActiveLink(); }, { passive: true });
    updateNav();
  }

  /* ────────────────────────────────────────
     3. REVEAL ON SCROLL
  ──────────────────────────────────────── */
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        revealObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.07, rootMargin: '0px 0px -20px 0px' });

  document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

  /* ────────────────────────────────────────
     4. INFO STRIP  — arrow + dots
  ──────────────────────────────────────── */
  const infoScroll = document.getElementById('info-scroll');
  const infoDots   = document.querySelectorAll('#info-dots .strip-dot');
  const infoPrev   = document.getElementById('info-prev');
  const infoNext   = document.getElementById('info-next');

  function scrollInfoToIdx(idx) {
    const items = infoScroll.querySelectorAll('.info-item');
    if (items[idx]) {
      infoScroll.scrollTo({ left: items[idx].offsetLeft, behavior: 'smooth' });
    }
  }

  function updateInfoDots() {
    const items = infoScroll.querySelectorAll('.info-item');
    const iw    = items[0] ? items[0].offsetWidth : 1;
    const idx   = Math.round(infoScroll.scrollLeft / iw);
    infoDots.forEach((d, i) => d.classList.toggle('active', i === idx));
  }

  if (infoScroll) {
    infoScroll.addEventListener('scroll', updateInfoDots, { passive: true });
    infoDots.forEach((dot, i) => dot.addEventListener('click', () => scrollInfoToIdx(i)));

    if (infoPrev) infoPrev.addEventListener('click', () => {
      const items = infoScroll.querySelectorAll('.info-item');
      const iw    = items[0] ? items[0].offsetWidth : 300;
      const idx   = Math.round(infoScroll.scrollLeft / iw);
      scrollInfoToIdx(Math.max(0, idx - 1));
    });

    if (infoNext) infoNext.addEventListener('click', () => {
      const items = infoScroll.querySelectorAll('.info-item');
      const iw    = items[0] ? items[0].offsetWidth : 300;
      const idx   = Math.round(infoScroll.scrollLeft / iw);
      scrollInfoToIdx(Math.min(items.length - 1, idx + 1));
    });

    updateInfoDots();
  }

  /* ────────────────────────────────────────
     5. PHOTO STRIP  — progress bar + arrows
  ──────────────────────────────────────── */
  const photoScroll = document.getElementById('photo-scroll');
  const photoBar    = document.getElementById('photo-progress-bar');
  const photoPrev   = document.getElementById('photo-prev');
  const photoNext   = document.getElementById('photo-next');

  function updatePhotoBar() {
    const max = photoScroll.scrollWidth - photoScroll.clientWidth;
    const pct = max > 0 ? (photoScroll.scrollLeft / max) * 100 : 0;
    if (photoBar) photoBar.style.width = `${pct}%`;
  }

  if (photoScroll) {
    photoScroll.addEventListener('scroll', updatePhotoBar, { passive: true });

    const scrollByCard = (dir) => {
      const card = photoScroll.querySelector('.photo-card');
      const step = card ? card.offsetWidth + 12 : 220;
      photoScroll.scrollBy({ left: dir * step, behavior: 'smooth' });
    };

    if (photoPrev) photoPrev.addEventListener('click', () => scrollByCard(-1));
    if (photoNext) photoNext.addEventListener('click', () => scrollByCard(1));
    updatePhotoBar();
  }

  /* ────────────────────────────────────────
     6. WHATSAPP FIXED FAB
  ──────────────────────────────────────── */
  const waFab = document.getElementById('wa-fab');
  if (waFab) {
    waFab.href = `https://wa.me/${WA_NUMBER}?text=${WA_MSG_FAB}`;

    // show after user scrolls past hero
    const heroEl = document.querySelector('.hero');
    const fabObs = new IntersectionObserver(([entry]) => {
      waFab.classList.toggle('show', !entry.isIntersecting);
    }, { threshold: 0 });
    if (heroEl) fabObs.observe(heroEl);
  }

})();
