/* Section 7 — Special surprise interactions */

function initSurprise() {
  const giftCard = document.getElementById('giftCard');
  const giftCard2 = document.getElementById('giftCard2');
  const giftReveal = document.getElementById('giftReveal');
  const giftReveal2 = document.getElementById('giftReveal2');
  const surpriseFx = document.getElementById('surpriseFx');
  const surpriseParticles = document.getElementById('surpriseParticles');

  if (!giftCard || !giftCard2) return;

  if (surpriseParticles) {
    const particles = LuxuryUtils.createParticles(surpriseParticles, 20, 'fx-sparkle');
    gsap.to(particles, {
      y: 'random(-60, 60)',
      opacity: 'random(0.1, 0.5)',
      duration: 'random(3, 6)',
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      stagger: { amount: 2, from: 'random' }
    });
  }

  let giftOpened = false;
  let gift2Opened = false;

  giftCard.addEventListener('click', () => {
    if (giftOpened) return;
    giftOpened = true;
    openGift(giftCard, giftReveal, () => { giftOpened = false; });
  });

  giftCard2.addEventListener('click', () => {
    if (gift2Opened) return;
    gift2Opened = true;
    openGift(giftCard2, giftReveal2, () => { gift2Opened = false; }, { variant: 'second' });
  });

  function openGift(card, reveal, onClose, options = {}) {
    const lid = card.querySelector('.surprise-card__lid');
    const box = card.querySelector('.surprise-card__box');
    const isSecond = options.variant === 'second';

    const tl = gsap.timeline();

    tl.to(lid, {
      rotateX: -120,
      duration: 0.8,
      ease: 'back.out(1.5)',
      transformOrigin: 'bottom center',
      transformPerspective: 800
    });

    tl.to(box, {
      scale: 1.1,
      duration: 0.3,
      yoyo: true,
      repeat: 1,
      ease: 'power2.inOut'
    }, '-=0.4');

    tl.to(card, {
      scale: 0,
      opacity: 0,
      duration: 0.5,
      ease: 'power3.in',
      pointerEvents: 'none'
    }, '-=0.2');

    tl.add(() => {
      reveal.classList.remove('hidden');
      burstConfetti(surpriseFx, 60);
      burstSparkles(surpriseFx, 40);
      burstHearts(surpriseFx, 15);
      if (isSecond) particleExplosion(surpriseFx, 50);
    });

    tl.fromTo(reveal.querySelector('img'), {
      scale: isSecond ? 0.6 : 0.5,
      opacity: 0,
      filter: 'blur(20px)',
      rotateY: isSecond ? 0 : 90,
      rotateZ: isSecond ? -15 : 0
    }, {
      scale: 1,
      opacity: 1,
      filter: 'blur(0px)',
      rotateY: 0,
      rotateZ: 0,
      duration: 1.2,
      ease: isSecond ? 'power4.out' : 'power3.out',
      transformPerspective: 1000
    });

    tl.fromTo(reveal.querySelector('.surprise__message'), {
      opacity: 0,
      y: 30,
      scale: isSecond ? 0.9 : 1
    }, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.8,
      ease: isSecond ? 'back.out(1.4)' : 'power2.out'
    }, '-=0.4');

    tl.add(() => {
      reveal.addEventListener('click', () => closeGiftReveal(card, reveal, onClose));
    });
  }

  function closeGiftReveal(card, reveal, onClose) {
    gsap.to(reveal, {
      opacity: 0,
      duration: 0.5,
      onComplete: () => {
        reveal.classList.add('hidden');
        reveal.style.opacity = '';
        onClose();
        gsap.set(card.querySelector('.surprise-card__lid'), { rotateX: 0 });
        gsap.set(card.querySelector('.surprise-card__box'), { scale: 1, clearProps: 'transform' });
        gsap.set(card, { scale: 1, opacity: 1, pointerEvents: 'auto' });
      }
    });
  }
}

function burstConfetti(container, count) {
  const colors = ['#D4AF37', '#E8C547', '#C3B091', '#8B6B4A', '#F8F3E9'];
  for (let i = 0; i < count; i++) {
    const el = document.createElement('div');
    el.className = 'fx-particle fx-confetti';
    el.style.background = colors[Math.floor(Math.random() * colors.length)];
    el.style.left = `${50 + (Math.random() - 0.5) * 20}%`;
    el.style.top = '50%';
    container.appendChild(el);

    gsap.to(el, {
      x: (Math.random() - 0.5) * window.innerWidth,
      y: (Math.random() - 0.5) * window.innerHeight,
      rotation: Math.random() * 720,
      opacity: 0,
      duration: 2 + Math.random() * 2,
      ease: 'power2.out',
      onComplete: () => el.remove()
    });
  }
}

function burstSparkles(container, count) {
  for (let i = 0; i < count; i++) {
    const el = document.createElement('div');
    el.className = 'fx-particle fx-sparkle';
    el.style.left = `${Math.random() * 100}%`;
    el.style.top = `${Math.random() * 100}%`;
    container.appendChild(el);

    gsap.fromTo(el, {
      scale: 0,
      opacity: 1
    }, {
      scale: 2,
      opacity: 0,
      duration: 1 + Math.random(),
      delay: Math.random() * 0.5,
      ease: 'power2.out',
      onComplete: () => el.remove()
    });
  }
}

function burstHearts(container, count) {
  for (let i = 0; i < count; i++) {
    const el = document.createElement('div');
    el.className = 'fx-particle fx-heart';
    el.textContent = '❤';
    el.style.left = `${40 + Math.random() * 20}%`;
    el.style.top = `${40 + Math.random() * 20}%`;
    container.appendChild(el);

    gsap.to(el, {
      y: -200 - Math.random() * 200,
      x: (Math.random() - 0.5) * 150,
      opacity: 0,
      rotation: (Math.random() - 0.5) * 60,
      duration: 2.5 + Math.random(),
      ease: 'power1.out',
      onComplete: () => el.remove()
    });
  }
}

function particleExplosion(container, count) {
  for (let i = 0; i < count; i++) {
    const el = document.createElement('div');
    el.className = 'fx-particle fx-sparkle';
    el.style.left = '50%';
    el.style.top = '50%';
    container.appendChild(el);

    const angle = (Math.PI * 2 * i) / count;
    const dist = 200 + Math.random() * 300;

    gsap.to(el, {
      x: Math.cos(angle) * dist,
      y: Math.sin(angle) * dist,
      scale: 0,
      opacity: 0,
      duration: 1.5 + Math.random(),
      ease: 'power3.out',
      onComplete: () => el.remove()
    });
  }
}

window.initSurprise = initSurprise;
