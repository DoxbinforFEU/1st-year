/* ═══════════════════════════════════════════════════════════
   MIKHAIL & CHACHIE — script.js
   GSAP Cinematic Animations + Music Player + All Interactivity
   ═══════════════════════════════════════════════════════════ */

/* ── GSAP Plugin Registration ── */
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

/* ════════════════════════════════════════════════
   1. GRAIN / NOISE CANVAS (global + loader)
   ════════════════════════════════════════════════ */
function initGrain(canvasId, opacity) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let w, h, animId;

  function resize() {
    w = canvas.width  = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }

  function draw() {
    const imageData = ctx.createImageData(w, h);
    const buf = imageData.data;
    for (let i = 0; i < buf.length; i += 4) {
      const v = (Math.random() * 255) | 0;
      buf[i] = buf[i+1] = buf[i+2] = v;
      buf[i+3] = 255;
    }
    ctx.putImageData(imageData, 0, 0);
    animId = requestAnimationFrame(draw);
  }

  resize();
  draw();
  window.addEventListener('resize', resize);
}

initGrain('grainOverlay');
initGrain('loaderGrain');

/* ════════════════════════════════════════════════
   2. STARFIELD (hero background)
   ════════════════════════════════════════════════ */
function initStars() {
  const canvas = document.getElementById('starsCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let w, h, stars = [], raf;

  const NUM_STARS = 200;

  function resize() {
    w = canvas.width  = canvas.offsetWidth;
    h = canvas.height = canvas.offsetHeight;
    buildStars();
  }

  function buildStars() {
    stars = Array.from({ length: NUM_STARS }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 0.8 + 0.2,
      a: Math.random(),
      speed: Math.random() * 0.004 + 0.001,
      dir: Math.random() > 0.5 ? 1 : -1,
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);
    stars.forEach(s => {
      s.a += s.speed * s.dir;
      if (s.a >= 1 || s.a <= 0) s.dir *= -1;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(237,232,225,${s.a * 0.55})`;
      ctx.fill();
    });
    raf = requestAnimationFrame(draw);
  }

  resize();
  draw();
  window.addEventListener('resize', resize);
}

initStars();

/* ════════════════════════════════════════════════
   3. CUSTOM CURSOR
   ════════════════════════════════════════════════ */
function initCursor() {
  const cursor = document.getElementById('cursor');
  const ring   = document.getElementById('cursorRing');
  if (!cursor || !ring) return;

  let mx = -100, my = -100;
  let rx  = -100, ry  = -100;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    gsap.to(cursor, { x: mx, y: my, duration: 0.1, overwrite: true });
  });

  // Smooth follower
  function loop() {
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    gsap.set(ring, { x: rx, y: ry });
    requestAnimationFrame(loop);
  }
  loop();

  // Expand on hover over interactive elements
  const hoverables = document.querySelectorAll('a, button, .place-card, .mem-card, .player__prog, .player__vol-range');
  hoverables.forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('hovered'));
    el.addEventListener('mouseleave', () => ring.classList.remove('hovered'));
  });
}

initCursor();

/* ════════════════════════════════════════════════
   4. LOADER ANIMATION
   ════════════════════════════════════════════════ */
function initLoader(onComplete) {
  const loader    = document.getElementById('loader');
  const barFill   = document.getElementById('loaderBarFill');
  const pctEl     = document.getElementById('loaderPct');
  const names     = loader.querySelector('.loader__names');
  const months    = loader.querySelector('.loader__months');

  let pct = 0;

  // Animate names/months in
  const tl = gsap.timeline();
  tl.to(names,  { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out' })
    .to(months, { opacity: 1, duration: 0.8, ease: 'power2.out' }, '-=0.6');

  // Progress bar counting
  const countUp = setInterval(() => {
    pct += Math.random() * 4 + 1;
    if (pct >= 100) { pct = 100; clearInterval(countUp); exitLoader(); }
    barFill.style.width = pct + '%';
    pctEl.textContent   = Math.floor(pct);
  }, 55);

  function exitLoader() {
    gsap.timeline()
      .to(loader, {
        opacity: 0,
        duration: 1.4,
        ease: 'power2.inOut',
        delay: 0.4,
        onComplete: () => {
          loader.style.display = 'none';
          onComplete();
        }
      });
  }
}

/* ════════════════════════════════════════════════
   5. HERO INTRO TIMELINE (after loader)
   ════════════════════════════════════════════════ */
function initHeroTimeline() {
  const eyebrow = document.querySelector('.hero__eyebrow');
  const names   = document.querySelectorAll('.hero__name');
  const amp     = document.querySelector('.hero__amp');
  const sub     = document.querySelector('.hero__sub');
  const btn     = document.querySelector('.hero__btn');
  const scroll  = document.getElementById('scrollHint');
  const player  = document.getElementById('player');

  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  tl.to(eyebrow, { opacity: 1, y: 0, duration: 1.1 })
    .to(names[0], { opacity: 1, duration: 1.2 }, '-=0.6')
    .to(amp,      { opacity: 1, duration: 0.8 }, '-=0.8')
    .to(names[1], { opacity: 1, duration: 1.2 }, '-=0.8')
    .to(sub,      { opacity: 1, duration: 1 },   '-=0.5')
    .to(btn,      { opacity: 1, duration: 0.9 }, '-=0.5')
    .to(scroll,   { opacity: 1, duration: 0.8 }, '-=0.2')
    // Slide in music player dock
    .add(() => {
      player.classList.add('player--up');
    }, '-=0.3');
}

/* ════════════════════════════════════════════════
   6. HERO BUTTON — smooth scroll
   ════════════════════════════════════════════════ */
function initBeginBtn() {
  const btn = document.getElementById('beginBtn');
  if (!btn) return;
  btn.addEventListener('click', e => {
    e.preventDefault();
    gsap.to(window, {
      scrollTo: { y: '#story', offsetY: 0 },
      duration: 2.2,
      ease: 'power3.inOut'
    });
  });
}

/* ════════════════════════════════════════════════
   7. SCROLL-TRIGGERED ANIMATIONS
   ════════════════════════════════════════════════ */
function initScrollAnimations() {

  /* Helper: fade + slide up */
  function fadeUp(el, trigger, delay = 0, extraVars = {}) {
    gsap.fromTo(el,
      { opacity: 0, y: 40 },
      {
        opacity: 1, y: 0,
        duration: 1.4,
        delay,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: trigger || el,
          start: 'top 82%',
          toggleActions: 'play none none none'
        },
        ...extraVars
      }
    );
  }

  /* Helper: stagger a group */
  function staggerGroup(els, trigger, stagger = 0.15) {
    gsap.fromTo(els,
      { opacity: 0, y: 35 },
      {
        opacity: 1, y: 0,
        duration: 1.3,
        stagger,
        ease: 'power3.out',
        scrollTrigger: {
          trigger,
          start: 'top 80%',
          toggleActions: 'play none none none'
        }
      }
    );
  }

  /* ── Chapter: How We Met ── */
  const chapterMet = document.getElementById('story');
  fadeUp(chapterMet.querySelector('.chapter__num'),   chapterMet, 0);
  fadeUp(chapterMet.querySelector('.chapter__title'), chapterMet, 0.15);
  fadeUp(chapterMet.querySelector('.chapter__image-box'), chapterMet, 0.25, { x: -30, y: 0 });
  fadeUp(chapterMet.querySelector('.chapter__copy'),  chapterMet, 0.4);

  /* ── Parallax on image boxes ── */
  document.querySelectorAll('[data-parallax]').forEach(el => {
    gsap.to(el, {
      yPercent: -8,
      ease: 'none',
      scrollTrigger: {
        trigger: el,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1.5
      }
    });
  });

  /* ── Chapter: Late Nights ── */
  const nights = document.getElementById('nights');
  fadeUp(nights.querySelector('.chapter__num'),   nights, 0);
  fadeUp(nights.querySelector('.chapter__title'), nights, 0.15);
  fadeUp(nights.querySelector('.chapter__copy'),  nights, 0.25);
  fadeUp(nights.querySelector('.chapter__image-box'), nights, 0.35, { x: 30, y: 0 });

  /* ── Memories horizontal scroll ── */
  initMemoriesScroll();

  /* ── Milestone ── */
  const milestone = document.getElementById('milestone');
  fadeUp(milestone.querySelector('.chapter__num'),     milestone, 0);
  fadeUp(milestone.querySelector('.milestone__count'), milestone, 0.1);
  fadeUp(milestone.querySelector('.milestone__label'), milestone, 0.2);

  gsap.fromTo(milestone.querySelector('.milestone__divider'),
    { scaleX: 0 },
    { scaleX: 1, duration: 1.2, ease: 'power3.out',
      scrollTrigger: { trigger: milestone, start: 'top 75%', toggleActions: 'play none none none' },
      delay: 0.3
    }
  );

  staggerGroup(milestone.querySelectorAll('.milestone__body'), milestone, 0.2);

  /* ── Big quotes ── */
  document.querySelectorAll('[data-quote]').forEach((block, i) => {
    gsap.fromTo(block,
      { opacity: 0, y: 50 },
      {
        opacity: 1, y: 0,
        duration: 1.6,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: block,
          start: 'top 80%',
          toggleActions: 'play none none none'
        }
      }
    );
  });

  /* ── Forever ── */
  const forever = document.getElementById('forever');
  fadeUp(forever.querySelector('.chapter__num'),   forever, 0);
  fadeUp(forever.querySelector('.forever__title'), forever, 0.1);
  staggerGroup(forever.querySelectorAll('.forever__body'), forever, 0.18);
  fadeUp(forever.querySelector('.forever__symbol'), forever, 0.4);
  fadeUp(forever.querySelector('.forever__names'),  forever, 0.5);

  /* ── Places ── */
  const places = document.getElementById('places');
  staggerGroup(places.querySelectorAll('.places__eyebrow, .places__title, .places__sub'), places, 0.15);

  const placeCards = places.querySelectorAll('.place-card');
  placeCards.forEach((card, i) => {
    gsap.fromTo(card,
      { opacity: 0, y: 30 },
      {
        opacity: 1, y: 0,
        duration: 1.2,
        delay: i * 0.2,
        ease: 'power3.out',
        scrollTrigger: { trigger: places, start: 'top 72%', toggleActions: 'play none none none' }
      }
    );
  });

  // Animate connector + route line
  gsap.fromTo(places.querySelector('.places__connector'),
    { opacity: 0 },
    {
      opacity: 1, duration: 1.4,
      scrollTrigger: { trigger: places, start: 'top 72%', toggleActions: 'play none none none' },
      delay: 0.5,
      onComplete: animateRouteLine
    }
  );

  /* ── Footer ── */
  const footer = document.getElementById('footer');
  gsap.fromTo(footer.querySelector('.footer__line'),
    { scaleX: 0, opacity: 0 },
    {
      scaleX: 1, opacity: 1,
      duration: 1.4, ease: 'power3.out',
      scrollTrigger: { trigger: footer, start: 'top 85%', toggleActions: 'play none none none' }
    }
  );
  staggerGroup(footer.querySelectorAll('.footer__quote, .footer__names'), footer, 0.2);
}

/* ── Animate route SVG line ── */
function animateRouteLine() {
  const path = document.getElementById('routeAnimated');
  if (!path) return;
  gsap.to(path, {
    strokeDashoffset: 0,
    duration: 2.2,
    ease: 'power2.inOut'
  });
}

/* ════════════════════════════════════════════════
   8. MEMORIES — HORIZONTAL SCROLL (GSAP pinning)
   ════════════════════════════════════════════════ */
function initMemoriesScroll() {
  const wrap  = document.getElementById('memories');
  const track = document.getElementById('memoriesTrack');
  const cards = document.querySelectorAll('.mem-card');
  const title = wrap.querySelector('.memories__title');

  // Reveal chapter num + title
  const chapterNum = wrap.querySelector('.chapter__num');
  gsap.fromTo([chapterNum, title],
    { opacity: 0, y: 35 },
    { opacity: 1, y: 0, duration: 1.3, stagger: 0.15, ease: 'power3.out',
      scrollTrigger: { trigger: wrap, start: 'top 80%', toggleActions: 'play none none none' } }
  );

  // On desktop: horizontal scroll; on mobile: vertical
  const isMobile = window.innerWidth < 900;
  if (isMobile) {
    gsap.fromTo(cards,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1.1, stagger: 0.15, ease: 'power3.out',
        scrollTrigger: { trigger: wrap, start: 'top 75%', toggleActions: 'play none none none' } }
    );
    return;
  }

  // Calculate total scroll distance
  const totalWidth = track.scrollWidth;
  const viewWidth  = window.innerWidth;
  const scrollDist = totalWidth - viewWidth + 200; // extra buffer

  // Set wrapper height to create scroll distance
  wrap.style.height = `${scrollDist + window.innerHeight}px`;

  // Pin the sticky inner and drive horizontal
  const sticky = wrap.querySelector('.memories__sticky');

  ScrollTrigger.create({
    trigger: wrap,
    start: 'top top',
    end: `+=${scrollDist}`,
    pin: sticky,
    anticipatePin: 1,
    onUpdate: self => {
      gsap.set(track, { x: -self.progress * scrollDist });
    }
  });

  // Stagger card reveals during horizontal scroll
  cards.forEach((card, i) => {
    gsap.fromTo(card,
      { opacity: 0, y: 28 },
      {
        opacity: 1, y: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: wrap,
          start: `top+=${i * (scrollDist / cards.length)} top`,
          toggleActions: 'play none none none',
          containerAnimation: null
        }
      }
    );
  });
}

/* ════════════════════════════════════════════════
   9. PLACE CARD HOVER — GSAP micro-animation
   ════════════════════════════════════════════════ */
function initPlaceCardHover() {
  document.querySelectorAll('.place-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
      gsap.to(card, { y: -6, duration: 0.5, ease: 'power2.out' });
    });
    card.addEventListener('mouseleave', () => {
      gsap.to(card, { y: 0, duration: 0.6, ease: 'power2.inOut' });
    });
  });
}

/* ════════════════════════════════════════════════
   10. MUSIC PLAYER
   ════════════════════════════════════════════════ */
function initPlayer() {
  const audio       = document.getElementById('audio');
  const playBtn     = document.getElementById('playBtn');
  const iconPlay    = document.getElementById('iconPlay');
  const iconPause   = document.getElementById('iconPause');
  const progressBar = document.getElementById('progressBar');
  const progFill    = document.getElementById('progressFill');
  const progThumb   = document.querySelector('.player__prog-thumb');
  const currentTimeEl = document.getElementById('currentTime');
  const totalTimeEl   = document.getElementById('totalTime');
  const volRange    = document.getElementById('volRange');
  const playerEl    = document.getElementById('player');
  const artEl       = document.getElementById('playerArt');

  if (!audio) return;

  let isPlaying = false;

  // Format seconds → M:SS
  function fmt(s) {
    if (isNaN(s)) return '0:00';
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60).toString().padStart(2, '0');
    return `${m}:${sec}`;
  }

  // Play / Pause toggle
  function togglePlay() {
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch(() => {
        /* Browser may block autoplay — user gesture required */
      });
    }
  }

  playBtn.addEventListener('click', togglePlay);

  audio.addEventListener('play', () => {
    isPlaying = true;
    iconPlay.style.display  = 'none';
    iconPause.style.display = 'block';
    playerEl.classList.add('player--playing');
  });

  audio.addEventListener('pause', () => {
    isPlaying = false;
    iconPlay.style.display  = 'block';
    iconPause.style.display = 'none';
    playerEl.classList.remove('player--playing');
  });

  // Duration
  audio.addEventListener('loadedmetadata', () => {
    totalTimeEl.textContent = fmt(audio.duration);
  });

  // Progress update
  audio.addEventListener('timeupdate', () => {
    if (!audio.duration) return;
    const pct = (audio.currentTime / audio.duration) * 100;
    progFill.style.width = pct + '%';
    progThumb.style.left = pct + '%';
    currentTimeEl.textContent = fmt(audio.currentTime);
  });

  // Seek on click
  progressBar.addEventListener('click', e => {
    const rect = progressBar.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    audio.currentTime = ratio * audio.duration;
  });

  // Volume
  audio.volume = parseFloat(volRange.value);
  volRange.addEventListener('input', () => {
    audio.volume = parseFloat(volRange.value);
  });

  // Attempt autoplay (may be blocked without user interaction)
  audio.volume = 0.7;
  audio.play().catch(() => {});
}

/* ════════════════════════════════════════════════
   11. AMBIENT SECTION BACKGROUNDS (subtle motion)
   ════════════════════════════════════════════════ */
function initAmbientMotion() {
  // Very slow floating of smoke elements
  document.querySelectorAll('.chapter__ambient').forEach((el, i) => {
    gsap.to(el, {
      x: `${i % 2 === 0 ? '+=30' : '-=30'}`,
      y: '+=20',
      duration: 18 + i * 4,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1
    });
  });

  // Slow parallax on hero smokes via scroll
  const smokes = document.querySelectorAll('.hero__smoke');
  smokes.forEach((s, i) => {
    gsap.to(s, {
      yPercent: (i + 1) * -10,
      ease: 'none',
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 2
      }
    });
  });
}

/* ════════════════════════════════════════════════
   12. KEYBOARD / ACCESSIBILITY
   ════════════════════════════════════════════════ */
function initKeyboard() {
  // Space to play/pause
  document.addEventListener('keydown', e => {
    if (e.code === 'Space' && e.target.tagName !== 'INPUT') {
      e.preventDefault();
      document.getElementById('playBtn')?.click();
    }
  });
}

/* ════════════════════════════════════════════════
   BOOT — everything starts here
   ════════════════════════════════════════════════ */
window.addEventListener('load', () => {
  // Loader → Hero timeline → rest
  initLoader(() => {
    initHeroTimeline();
    initBeginBtn();
    initScrollAnimations();
    initAmbientMotion();
    initPlaceCardHover();
  });

  // Player and cursor can init immediately
  initPlayer();
  initKeyboard();
});
