/* ============================================
   WISEMAN — Script.js
   Cinematic love letter website
   ============================================ */

gsap.registerPlugin(ScrollTrigger, Draggable);

/* ======================== CURSOR ======================== */
const cursorGlow = document.getElementById('cursorGlow');
const cursorDot  = document.getElementById('cursorDot');
let mx = 0, my = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX;
  my = e.clientY;
  cursorDot.style.left  = mx + 'px';
  cursorDot.style.top   = my + 'px';
  gsap.to(cursorGlow, { x: mx, y: my, duration: 0.6, ease: 'power2.out' });
});

document.querySelectorAll('a, button, .h-card, .s-card, .ctrl-btn').forEach(el => {
  el.addEventListener('mouseenter', () => {
    gsap.to(cursorGlow, { width: 80, height: 80, duration: 0.3 });
  });
  el.addEventListener('mouseleave', () => {
    gsap.to(cursorGlow, { width: 40, height: 40, duration: 0.3 });
  });
});

/* ======================== PARTICLES ======================== */
const canvas  = document.getElementById('particleCanvas');
const ctx     = canvas.getContext('2d');
let particles = [];
let W, H;

function resizeCanvas() {
  W = canvas.width  = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

function Particle() {
  this.reset = function() {
    this.x    = Math.random() * W;
    this.y    = Math.random() * H;
    this.r    = Math.random() * 1.5 + 0.3;
    this.a    = Math.random() * Math.PI * 2;
    this.vx   = (Math.random() - 0.5) * 0.2;
    this.vy   = -Math.random() * 0.3 - 0.05;
    this.life = Math.random();
    this.maxLife = Math.random() * 0.8 + 0.2;
  };
  this.reset();
}

for (let i = 0; i < 80; i++) {
  const p = new Particle();
  p.life = Math.random();
  particles.push(p);
}

let mouseParallaxX = 0, mouseParallaxY = 0;
document.addEventListener('mousemove', e => {
  mouseParallaxX = (e.clientX / W - 0.5) * 0.3;
  mouseParallaxY = (e.clientY / H - 0.5) * 0.3;
});

function drawParticles() {
  ctx.clearRect(0, 0, W, H);
  particles.forEach(p => {
    p.life += 0.003;
    if (p.life > p.maxLife) p.reset();
    const alpha = Math.sin((p.life / p.maxLife) * Math.PI) * 0.4;
    ctx.beginPath();
    ctx.arc(p.x + mouseParallaxX * 20, p.y + mouseParallaxY * 20, p.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(217, 179, 130, ${alpha})`;
    ctx.fill();
    p.x += p.vx;
    p.y += p.vy;
  });
  requestAnimationFrame(drawParticles);
}
drawParticles();

/* ======================== HERO MOUSE DEPTH ======================== */
const heroContent = document.getElementById('heroContent');
const heroBg      = document.getElementById('heroBg');
document.addEventListener('mousemove', e => {
  const rx = (e.clientX / W - 0.5) * 30;
  const ry = (e.clientY / H - 0.5) * 20;
  gsap.to(heroContent, { x: rx * 0.4, y: ry * 0.4, duration: 1.2, ease: 'power2.out' });
  gsap.to(heroBg, { x: rx * 1.2, y: ry * 0.8, duration: 1.5, ease: 'power2.out' });
});

/* ======================== LOADER → HERO INTRO ======================== */
window.addEventListener('load', () => {
  setTimeout(() => {
    gsap.to('#loader', {
      opacity: 0,
      duration: 1,
      ease: 'power2.inOut',
      onComplete: () => {
        document.getElementById('loader').style.display = 'none';
        startHeroAnim();
      }
    });
  }, 2200);
});

function startHeroAnim() {
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
  tl.to('#heroEyebrow', { opacity: 1, y: 0, duration: 1, delay: 0.2 })
    .to('#titleLine1',  { opacity: 1, y: 0, duration: 1.2 }, '-=0.6')
    .to('#titleLine2',  { opacity: 1, y: 0, duration: 1.2 }, '-=0.9')
    .to('#heroSubtitle',{ opacity: 1, duration: 1 }, '-=0.7')
    .to('#heroDivider', { width: 200, duration: 1.2, ease: 'power2.out' }, '-=0.5')
    .to('#heroDate',    { opacity: 1, duration: 0.8 }, '-=0.6');
}

/* ======================== SCROLL INDICATOR ======================== */
const scrollInd = document.getElementById('scrollIndicator');
window.addEventListener('scroll', () => {
  if (window.scrollY > 200) scrollInd.classList.add('hidden');
  else scrollInd.classList.remove('hidden');
}, { passive: true });

/* ======================== PARALLAX ON SCROLL ======================== */
document.querySelectorAll('.parallax-img').forEach(img => {
  const factor = parseFloat(img.closest('[data-parallax]')?.dataset.parallax || 0.15);
  gsap.fromTo(img,
    { y: '-5%' },
    {
      y: `${factor * 100}%`,
      ease: 'none',
      scrollTrigger: {
        trigger: img,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      }
    }
  );
});

/* Full width images */
document.querySelectorAll('.fullwidth-img').forEach(img => {
  const factor = parseFloat(img.dataset.parallax || 0.25);
  gsap.fromTo(img,
    { y: `-${factor * 40}%` },
    {
      y: `${factor * 40}%`,
      ease: 'none',
      scrollTrigger: {
        trigger: img.closest('.fullwidth-photo'),
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      }
    }
  );
});

/* ======================== REVEAL ANIMATIONS ======================== */
// Story quotes & bodies
gsap.utils.toArray('.story-quote').forEach(el => {
  gsap.to(el, {
    opacity: 1, y: 0, duration: 1.4,
    ease: 'power3.out',
    scrollTrigger: { trigger: el, start: 'top 80%' }
  });
});
gsap.utils.toArray('.story-body').forEach(el => {
  gsap.to(el, {
    opacity: 1, y: 0, duration: 1.2, delay: 0.2,
    ease: 'power3.out',
    scrollTrigger: { trigger: el, start: 'top 80%' }
  });
});

// Fullwidth text
gsap.utils.toArray('.fullwidth-eyebrow').forEach(el => {
  gsap.to(el, {
    opacity: 1, duration: 1,
    scrollTrigger: { trigger: el, start: 'top 80%' }
  });
});
gsap.utils.toArray('.fullwidth-heading').forEach(el => {
  gsap.to(el, {
    opacity: 1, y: 0, duration: 1.4,
    ease: 'power3.out',
    scrollTrigger: { trigger: el, start: 'top 80%' }
  });
});

// Generic [data-reveal]
gsap.utils.toArray('[data-reveal]').forEach(el => {
  if (!el.classList.contains('story-quote') && !el.classList.contains('story-body')) {
    gsap.fromTo(el,
      { opacity: 0, y: 30 },
      {
        opacity: 1, y: 0, duration: 1.2,
        ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 82%' }
      }
    );
  }
});

// Gallery row label
gsap.to('.gallery-row-label', {
  opacity: 1, duration: 1,
  scrollTrigger: { trigger: '.gallery-row-section', start: 'top 80%' }
});

// Stacked label
gsap.to('.stacked-label', {
  opacity: 0.7, duration: 1,
  scrollTrigger: { trigger: '.stacked-section', start: 'top 80%' }
});

// Stacked cards
gsap.utils.toArray('.s-card').forEach((card, i) => {
  gsap.to(card, {
    opacity: 1, y: 0, duration: 1.4,
    delay: i * 0.15,
    ease: 'power3.out',
    scrollTrigger: { trigger: card, start: 'top 85%' }
  });
});

// Letter
gsap.to('.letter-inner', {
  opacity: 1, y: 0, duration: 1.5,
  ease: 'power3.out',
  scrollTrigger: { trigger: '.letter-section', start: 'top 70%' }
});

// Footer
gsap.to('.footer-top', {
  opacity: 1, duration: 1.2,
  ease: 'power3.out',
  scrollTrigger: { trigger: '.site-footer', start: 'top 85%' }
});

/* ======================== HORIZONTAL GALLERY (DRAG) ======================== */
const gallery    = document.getElementById('horizontalGallery');
const galleryWrap = document.querySelector('.horizontal-gallery-wrap');
let isDown = false, startX = 0, scrollLeft = 0;

galleryWrap.addEventListener('mousedown', e => {
  isDown = true;
  startX = e.pageX - galleryWrap.offsetLeft;
  scrollLeft = galleryWrap.scrollLeft || 0;
});
galleryWrap.addEventListener('mouseleave', () => { isDown = false; });
galleryWrap.addEventListener('mouseup', () => { isDown = false; });
galleryWrap.addEventListener('mousemove', e => {
  if (!isDown) return;
  e.preventDefault();
  const x    = e.pageX - galleryWrap.offsetLeft;
  const walk = (x - startX) * 1.5;
  galleryWrap.scrollLeft = scrollLeft - walk;
});

// Touch support
galleryWrap.addEventListener('touchstart', e => {
  startX = e.touches[0].pageX;
  scrollLeft = galleryWrap.scrollLeft;
}, { passive: true });
galleryWrap.addEventListener('touchmove', e => {
  const x    = e.touches[0].pageX;
  const walk = (startX - x) * 1.2;
  galleryWrap.scrollLeft = scrollLeft + walk;
}, { passive: true });

/* ======================== MUSIC PLAYER ======================== */
const audio       = document.getElementById('audioEl');
const playPauseBtn= document.getElementById('playPauseBtn');
const playIcon    = document.getElementById('playIcon');
const pauseIcon   = document.getElementById('pauseIcon');
const progressBar = document.getElementById('progressBar');
const progressWrap= document.getElementById('progressBarWrap');
const currentTimeEl = document.getElementById('currentTime');
const totalTimeEl   = document.getElementById('totalTime');
const volSlider     = document.getElementById('volumeSlider');
const playerEl      = document.getElementById('musicPlayer');
const playerToggle  = document.getElementById('playerToggle');
const playerHeader  = document.getElementById('playerHeader');
const waveCanvas    = document.getElementById('waveformCanvas');
const wCtx          = waveCanvas.getContext('2d');

audio.volume = 0.7;

function formatTime(s) {
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec < 10 ? '0' : ''}${sec}`;
}

function setPlaying(playing) {
  if (playing) {
    playIcon.style.display  = 'none';
    pauseIcon.style.display = 'block';
    playerEl.classList.add('playing');
  } else {
    playIcon.style.display  = 'block';
    pauseIcon.style.display = 'none';
    playerEl.classList.remove('playing');
  }
}

playPauseBtn.addEventListener('click', () => {
  if (audio.paused) { audio.play(); setPlaying(true); }
  else { audio.pause(); setPlaying(false); }
});

audio.addEventListener('timeupdate', () => {
  if (!audio.duration) return;
  const pct = (audio.currentTime / audio.duration) * 100;
  progressBar.style.width = pct + '%';
  currentTimeEl.textContent = formatTime(audio.currentTime);
  drawWaveform(pct / 100);
});
audio.addEventListener('loadedmetadata', () => {
  totalTimeEl.textContent = formatTime(audio.duration);
});
audio.addEventListener('ended', () => { setPlaying(false); });

progressWrap.addEventListener('click', e => {
  const rect = progressWrap.getBoundingClientRect();
  const pct  = (e.clientX - rect.left) / rect.width;
  audio.currentTime = pct * audio.duration;
});

volSlider.addEventListener('input', () => {
  audio.volume = parseFloat(volSlider.value);
});

// Collapse/expand
playerToggle.addEventListener('click', () => {
  playerEl.classList.toggle('collapsed');
});

// Draggable player header
let dragStartX = 0, dragStartY = 0, playerLeft = 30, playerBottom = 30;
let isDragging = false;

playerHeader.addEventListener('mousedown', e => {
  if (e.target === playerToggle) return;
  isDragging = true;
  dragStartX = e.clientX - playerEl.getBoundingClientRect().left;
  dragStartY = e.clientY - playerEl.getBoundingClientRect().top;
  document.body.style.userSelect = 'none';
});
document.addEventListener('mousemove', e => {
  if (!isDragging) return;
  const x = e.clientX - dragStartX;
  const y = e.clientY - dragStartY;
  playerEl.style.left   = Math.max(0, Math.min(window.innerWidth  - playerEl.offsetWidth,  x)) + 'px';
  playerEl.style.top    = Math.max(0, Math.min(window.innerHeight - playerEl.offsetHeight, y)) + 'px';
  playerEl.style.bottom = 'auto';
  playerEl.style.right  = 'auto';
});
document.addEventListener('mouseup', () => {
  isDragging = false;
  document.body.style.userSelect = '';
});

/* ======================== WAVEFORM VISUALIZER ======================== */
let waveData = [];
for (let i = 0; i < 40; i++) {
  waveData.push(Math.random() * 0.8 + 0.1);
}

function drawWaveform(progress) {
  const w = waveCanvas.width;
  const h = waveCanvas.height;
  const barW = w / waveData.length - 1.5;
  wCtx.clearRect(0, 0, w, h);

  waveData.forEach((val, i) => {
    const x   = i * (barW + 1.5);
    const barH = val * h * 0.8;
    const played = (i / waveData.length) < progress;
    const grad = wCtx.createLinearGradient(0, h, 0, h - barH);
    if (played) {
      grad.addColorStop(0, 'rgba(201,123,99,0.9)');
      grad.addColorStop(1, 'rgba(217,179,130,0.7)');
    } else {
      grad.addColorStop(0, 'rgba(217,179,130,0.2)');
      grad.addColorStop(1, 'rgba(217,179,130,0.1)');
    }
    wCtx.fillStyle = grad;
    wCtx.fillRect(x, h - barH, barW, barH);
  });
}
drawWaveform(0);

// Animate waveform when playing
setInterval(() => {
  if (!audio.paused) {
    waveData = waveData.map(v => {
      const delta = (Math.random() - 0.5) * 0.15;
      return Math.max(0.08, Math.min(1, v + delta));
    });
  }
}, 150);

/* ======================== AUTOPLAY ATTEMPT ======================== */
// Try autoplay after user first interacts
let autoplayAttempted = false;
function tryAutoplay() {
  if (!autoplayAttempted) {
    autoplayAttempted = true;
    audio.volume = 0;
    audio.play().then(() => {
      setPlaying(true);
      gsap.to(audio, { volume: 0.7, duration: 3 });
    }).catch(() => {});
  }
}
['click', 'scroll', 'touchstart', 'keydown'].forEach(evt => {
  document.addEventListener(evt, tryAutoplay, { once: true });
});

/* ======================== EASTER EGG ======================== */
const easterEgg = document.getElementById('easterEgg');
const eeHearts  = document.getElementById('eeHearts');
const eeClose   = document.getElementById('eeClose');

function spawnHearts() {
  eeHearts.innerHTML = '';
  const emojis = ['♥', '✦', '♡', '✧', '⋆'];
  for (let i = 0; i < 20; i++) {
    const h = document.createElement('span');
    h.classList.add('ee-heart');
    h.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    h.style.left  = Math.random() * 100 + '%';
    h.style.top   = Math.random() * 100 + '%';
    h.style.animationDelay = (Math.random() * 2) + 's';
    h.style.animationDuration = (Math.random() * 2 + 3) + 's';
    h.style.color = ['#C97B63','#D9B382','#F5E6D3'][Math.floor(Math.random() * 3)];
    eeHearts.appendChild(h);
  }
}

document.addEventListener('keydown', e => {
  if (e.key === 'l' || e.key === 'L') {
    easterEgg.classList.add('active');
    spawnHearts();
  }
});
eeClose.addEventListener('click', () => {
  easterEgg.classList.remove('active');
});

/* ======================== AMBIENT BACKGROUND PARALLAX ======================== */
document.addEventListener('scroll', () => {}, { passive: true });

/* ======================== IMAGE HOVER DISTORTION ======================== */
document.querySelectorAll('.story-image-inner').forEach(wrap => {
  wrap.addEventListener('mousemove', e => {
    const rect = wrap.getBoundingClientRect();
    const xPct = (e.clientX - rect.left) / rect.width - 0.5;
    const yPct = (e.clientY - rect.top)  / rect.height - 0.5;
    const img  = wrap.querySelector('.story-img');
    gsap.to(img, {
      x: xPct * 12,
      y: yPct * 12,
      scale: 1.04,
      duration: 0.8,
      ease: 'power2.out'
    });
  });
  wrap.addEventListener('mouseleave', () => {
    const img = wrap.querySelector('.story-img');
    gsap.to(img, { x: 0, y: 0, scale: 1, duration: 0.8, ease: 'power2.out' });
  });
});

/* ======================== SECTION TRANSITION BACKGROUNDS ======================== */
const sectionBgs = [
  'radial-gradient(ellipse at 20% 80%, rgba(201,123,99,0.08), transparent)',
  'radial-gradient(ellipse at 80% 20%, rgba(217,179,130,0.07), transparent)',
  'radial-gradient(ellipse at 50% 50%, rgba(74,52,40,0.2), transparent)',
];
let bgIndex = 0;
ScrollTrigger.create({
  trigger: 'body',
  start: 'top top',
  end: 'bottom bottom',
  onUpdate: self => {
    const idx = Math.floor(self.progress * sectionBgs.length) % sectionBgs.length;
    if (idx !== bgIndex) {
      bgIndex = idx;
    }
  }
});

/* ======================== CINEMATIC SECTION TRANSITIONS ======================== */
gsap.utils.toArray('.chapter').forEach((section, i) => {
  gsap.fromTo(section,
    { opacity: 0.6 },
    {
      opacity: 1,
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        start: 'top 90%',
        end: 'top 30%',
        scrub: true,
      }
    }
  );
});

/* ======================== STACKED CARDS HOVER ======================== */
document.querySelectorAll('.s-card').forEach(card => {
  card.addEventListener('mouseenter', () => {
    gsap.to(card, { scale: 1.01, duration: 0.6, ease: 'power2.out' });
  });
  card.addEventListener('mouseleave', () => {
    gsap.to(card, { scale: 1, duration: 0.6, ease: 'power2.out' });
  });
});

/* ======================== FOOTER HEADING PARALLAX ======================== */
gsap.to('.footer-heading', {
  y: -40,
  ease: 'none',
  scrollTrigger: {
    trigger: '.site-footer',
    start: 'top bottom',
    end: 'bottom top',
    scrub: true,
  }
});

/* ======================== REFRESH ST ======================== */
ScrollTrigger.refresh();
