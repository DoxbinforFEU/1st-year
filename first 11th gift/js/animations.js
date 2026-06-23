/* GSAP ScrollTrigger animations for all sections */

function initAnimations() {
  gsap.registerPlugin(ScrollTrigger);

  initHeroAnimations();
  initSpecialSection();
  initMemoriesSection();
  initGallerySection();
  initStorySection();
  initFutureSection();
  initSurpriseHeader();
  initFooter();
  initGlobalReveals();

  ScrollTrigger.refresh();
}

function initHeroAnimations() {
  const heroParticles = document.getElementById('heroParticles');
  if (heroParticles) {
    const particles = LuxuryUtils.createParticles(heroParticles, 25, 'hero__particle');
    gsap.to(particles, {
      y: 'random(-100, 100)',
      x: 'random(-50, 50)',
      opacity: 'random(0.1, 0.6)',
      duration: 'random(4, 8)',
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      stagger: { amount: 3, from: 'random' }
    });
  }

  document.querySelectorAll('.hero__title-line[data-split="chars"]').forEach((el) => {
    if (!el.querySelector('.split-char')) LuxuryUtils.splitChars(el);
  });

  const heroTl = gsap.timeline({ delay: 0.3 });
  heroTl.addLabel('start');

  const titleChars = document.querySelectorAll('.hero__title .split-char');
  heroTl.from(titleChars, {
    opacity: 0,
    y: 80,
    rotateX: -90,
    duration: 1,
    stagger: { amount: 0.8, from: 'start' },
    ease: 'power4.out'
  }, 'start');

  heroTl.from('.hero__eyebrow', {
    opacity: 0,
    y: 30,
    duration: 0.8,
    ease: 'power3.out'
  }, 'start+=0.3');

  heroTl.from('.hero__subtitle', {
    opacity: 0,
    y: 20,
    filter: 'blur(8px)',
    duration: 1,
    ease: 'power2.out'
  }, 'start+=0.8');

  heroTl.to('.hero__gold-line', {
    scaleX: 1,
    duration: 1.2,
    ease: 'power3.inOut'
  }, 'start+=1.2');

  heroTl.from('#scrollIndicator', {
    opacity: 0,
    y: 20,
    duration: 0.8,
    ease: 'power2.out'
  }, 'start+=1.5');

  gsap.to('.hero__layer--back .hero__image', {
    scale: 1.2,
    duration: 20,
    repeat: -1,
    yoyo: true,
    ease: 'none'
  });

  gsap.to('.hero__layer--front .hero__image', {
    scale: 1.15,
    duration: 15,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut'
  });

  gsap.to('.hero__layer--back .hero__image-wrap', {
    y: -80,
    ease: 'none',
    scrollTrigger: {
      trigger: '#hero',
      start: 'top top',
      end: 'bottom top',
      scrub: 1
    }
  });

  gsap.to('.hero__layer--front .hero__image-wrap', {
    y: -120,
    ease: 'none',
    scrollTrigger: {
      trigger: '#hero',
      start: 'top top',
      end: 'bottom top',
      scrub: 1.5
    }
  });

  gsap.to('.hero__content', {
    opacity: 0,
    y: -50,
    ease: 'none',
    scrollTrigger: {
      trigger: '#hero',
      start: 'center top',
      end: 'bottom top',
      scrub: true
    }
  });
}

function initSpecialSection() {
  gsap.from('.special__image-frame--1', {
    clipPath: 'inset(100% 0 0 0)',
    scale: 1.3,
    duration: 1.4,
    ease: 'power4.out',
    scrollTrigger: {
      trigger: '#special',
      start: 'top 70%',
      toggleActions: 'play none none reverse'
    }
  });

  gsap.from('.special__image-frame--2', {
    clipPath: 'inset(0 0 100% 0)',
    scale: 1.2,
    duration: 1.4,
    delay: 0.2,
    ease: 'power4.out',
    scrollTrigger: {
      trigger: '#special',
      start: 'top 70%',
      toggleActions: 'play none none reverse'
    }
  });

  gsap.to('.special__img', {
    scale: 1,
    ease: 'none',
    scrollTrigger: {
      trigger: '#special',
      start: 'top bottom',
      end: 'bottom top',
      scrub: 1
    }
  });

  gsap.utils.toArray('.luxury-card').forEach((card, i) => {
    gsap.to(card, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      delay: i * 0.15,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: card,
        start: 'top 85%',
        toggleActions: 'play none none reverse'
      }
    });
  });
}

function initMemoriesSection() {
  const track = document.getElementById('memoriesTrack');
  if (!track) return;

  const cards = track.querySelectorAll('.memory-card');
  const totalScroll = track.scrollWidth - window.innerWidth + 200;

  gsap.to(track, {
    x: () => -(track.scrollWidth - window.innerWidth + 100),
    ease: 'none',
    scrollTrigger: {
      trigger: '#memories',
      start: 'top top',
      end: () => `+=${totalScroll}`,
      pin: '.memories__pin-wrap',
      scrub: 1,
      anticipatePin: 1,
      invalidateOnRefresh: true
    }
  });

  cards.forEach((card, i) => {
    gsap.from(card, {
      opacity: 0,
      rotateY: 45,
      z: -200,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '#memories',
        start: `top+=${i * 200} 60%`,
        toggleActions: 'play none none reverse'
      }
    });

    gsap.to(card.querySelector('img'), {
      scale: 1.08,
      ease: 'none',
      scrollTrigger: {
        trigger: '#memories',
        start: 'top center',
        end: 'bottom center',
        scrub: 1
      }
    });
  });
}

function initGallerySection() {
  gsap.utils.toArray('[data-gallery]').forEach((item, i) => {
    gsap.from(item, {
      opacity: 0,
      scale: 0.85,
      y: 60,
      duration: 1,
      delay: i * 0.15,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: item,
        start: 'top 85%',
        toggleActions: 'play none none reverse'
      }
    });

    gsap.from(item.querySelector('img'), {
      scale: 1.3,
      duration: 1.5,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: item,
        start: 'top 85%',
        toggleActions: 'play none none reverse'
      }
    });
  });
}

function initStorySection() {
  const introEl = document.querySelector('.memories__intro');
  if (introEl) {
    const originalText = introEl.textContent;
    introEl.textContent = '';
    ScrollTrigger.create({
      trigger: introEl,
      start: 'top 85%',
      once: true,
      onEnter: () => LuxuryUtils.typewriter(introEl, originalText, 35)
    });
  }

  const storyDates = document.querySelectorAll('.story__date');
  storyDates.forEach((date) => {
    const finalText = date.textContent;
    ScrollTrigger.create({
      trigger: date,
      start: 'top 90%',
      once: true,
      onEnter: () => LuxuryUtils.scrambleText(date, finalText, 0.8)
    });
  });

  gsap.to('.story__line', {
    scaleY: 1,
    duration: 1.5,
    ease: 'power2.inOut',
    scrollTrigger: {
      trigger: '#story',
      start: 'top 60%',
      end: 'bottom 40%',
      scrub: 1
    }
  });

  gsap.utils.toArray('[data-milestone]').forEach((milestone, i) => {
    gsap.to(milestone, {
      opacity: 1,
      x: 0,
      duration: 0.8,
      delay: i * 0.2,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: milestone,
        start: 'top 80%',
        toggleActions: 'play none none reverse'
      }
    });
  });

  gsap.to('.story__image-wrap:first-child', {
    y: -40,
    ease: 'none',
    scrollTrigger: {
      trigger: '#story',
      start: 'top bottom',
      end: 'bottom top',
      scrub: 1
    }
  });

  gsap.to('.story__image-wrap:last-child', {
    y: 40,
    ease: 'none',
    scrollTrigger: {
      trigger: '#story',
      start: 'top bottom',
      end: 'bottom top',
      scrub: 1.5
    }
  });
}

function initFutureSection() {
  gsap.utils.toArray('[data-dream]').forEach((card, i) => {
    gsap.to(card, {
      opacity: 1,
      y: 0,
      rotateX: 0,
      duration: 1,
      delay: i * 0.2,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: card,
        start: 'top 85%',
        toggleActions: 'play none none reverse'
      }
    });

    gsap.to(card, {
      y: -20,
      ease: 'none',
      scrollTrigger: {
        trigger: card,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1
      }
    });
  });
}

function initSurpriseHeader() {
  gsap.from('.surprise-card', {
    opacity: 0,
    y: 60,
    rotateY: -30,
    duration: 1,
    stagger: 0.3,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '#surprise',
      start: 'top 70%',
      toggleActions: 'play none none reverse'
    }
  });

  gsap.to('.surprise-card__box', {
    y: -8,
    duration: 2,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut',
    stagger: 0.5
  });
}

function initFooter() {
  gsap.from('.footer__text', {
    opacity: 0,
    y: 30,
    duration: 1,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '.footer',
      start: 'top 90%',
      toggleActions: 'play none none reverse'
    }
  });

  gsap.from('.footer__gold', {
    scaleX: 0,
    duration: 1,
    ease: 'power3.inOut',
    scrollTrigger: {
      trigger: '.footer',
      start: 'top 85%',
      toggleActions: 'play none none reverse'
    }
  });
}

function initGlobalReveals() {
  document.querySelectorAll('[data-split="words"]').forEach((el) => {
    const words = LuxuryUtils.splitWords(el);
    gsap.from(words, {
      y: '110%',
      opacity: 0,
      duration: 0.8,
      stagger: 0.08,
      ease: 'power4.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        toggleActions: 'play none none reverse'
      }
    });
  });

  document.querySelectorAll('[data-split="chars"]').forEach((el) => {
    if (el.closest('#hero') || el.querySelector('.split-char')) return;
    const chars = LuxuryUtils.splitChars(el);
    gsap.from(chars, {
      opacity: 0,
      y: 40,
      rotateX: -60,
      duration: 0.6,
      stagger: 0.03,
      ease: 'back.out(1.5)',
      scrollTrigger: {
        trigger: el.closest('section') || el,
        start: 'top 80%',
        toggleActions: 'play none none reverse'
      }
    });
  });

  gsap.utils.toArray('.section-label').forEach((label) => {
    gsap.from(label, {
      opacity: 0,
      letterSpacing: '0.6em',
      duration: 1,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: label,
        start: 'top 90%',
        toggleActions: 'play none none reverse'
      }
    });
  });
}

window.initAnimations = initAnimations;
