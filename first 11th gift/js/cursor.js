/* Custom cursor & spotlight */

function initCursor() {
  if (LuxuryUtils.prefersReducedMotion() || window.innerWidth <= 768) return;

  const cursor = document.getElementById('cursor');
  const cursorGlow = document.getElementById('cursorGlow');
  if (!cursor || !cursorGlow) return;

  const dot = cursor.querySelector('.cursor__dot');
  const ring = cursor.querySelector('.cursor__ring');

  let mouseX = 0, mouseY = 0;
  let ringX = 0, ringY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    gsap.to(dot, { x: mouseX, y: mouseY, duration: 0.08, ease: 'power2.out' });
    gsap.to(cursorGlow, { x: mouseX, y: mouseY, duration: 0.6, ease: 'power2.out' });
  });

  gsap.ticker.add(() => {
    ringX += (mouseX - ringX) * 0.15;
    ringY += (mouseY - ringY) * 0.15;
    gsap.set(ring, { x: ringX, y: ringY });
  });

  const interactives = document.querySelectorAll('a, button, .gallery__frame, .surprise-card, .memory-card, .dream-card, .luxury-card, .music-player__btn, .music-player__progress-wrap');
  interactives.forEach((el) => {
    el.addEventListener('mouseenter', () => cursor.classList.add('is-hover'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('is-hover'));
  });

  initMagneticButtons();
  initTiltCards();
}

function initMagneticButtons() {
  const magneticEls = document.querySelectorAll('.music-player__btn, .surprise-card');
  magneticEls.forEach((el) => {
    el.setAttribute('data-magnetic', '');
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      gsap.to(el, { x: x * 0.3, y: y * 0.3, duration: 0.4, ease: 'power2.out' });
    });
    el.addEventListener('mouseleave', () => {
      gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.5)' });
    });
  });
}

function initTiltCards() {
  document.querySelectorAll('[data-tilt]').forEach((card) => {
    const inner = card.querySelector('.memory-card__inner') || card;
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      gsap.to(inner, {
        rotateY: x * 15,
        rotateX: -y * 15,
        duration: 0.4,
        ease: 'power2.out',
        transformPerspective: 1000
      });
    });
    card.addEventListener('mouseleave', () => {
      gsap.to(inner, { rotateY: 0, rotateX: 0, duration: 0.6, ease: 'power2.out' });
    });
  });
}

function initMouseParallax() {
  if (window.innerWidth <= 768) return;

  document.querySelectorAll('.hero__parallax, .story__parallax').forEach((el) => {
    const speed = parseFloat(el.dataset.speed) || 0.5;
    document.addEventListener('mousemove', (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 30 * speed;
      const y = (e.clientY / window.innerHeight - 0.5) * 20 * speed;
      gsap.to(el, { x, y, duration: 1, ease: 'power2.out' });
    });
  });
}

window.initCursor = initCursor;
window.initMouseParallax = initMouseParallax;
