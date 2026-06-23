/* Cinematic loading screen */

function initLoading(onComplete) {
  const loader = document.getElementById('loader');
  const loaderText = document.getElementById('loaderText');
  const loaderProgress = document.getElementById('loaderProgress');
  const loaderParticles = document.getElementById('loaderParticles');
  const main = document.getElementById('main');
  const text = 'can you be my one and only forever?';

  document.body.classList.add('loading');

  const words = text.split(' ');
  loaderText.innerHTML = words.map((word) => {
    const wordSpan = document.createElement('span');
    wordSpan.className = 'loader__word';
    [...word].forEach((char) => {
      const charSpan = document.createElement('span');
      charSpan.className = 'loader__char';
      charSpan.textContent = char;
      wordSpan.appendChild(charSpan);
    });
    return wordSpan.outerHTML;
  }).join(' ');

  const allChars = loaderText.querySelectorAll('.loader__char');
  const particles = LuxuryUtils.createParticles(loaderParticles, 40);

  gsap.to(particles, {
    y: 'random(-80, 80)',
    x: 'random(-40, 40)',
    opacity: 'random(0.2, 0.8)',
    duration: 'random(3, 6)',
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut',
    stagger: { amount: 2, from: 'random' }
  });

  gsap.to(particles, {
    scale: 'random(0.5, 1.5)',
    duration: 'random(2, 4)',
    repeat: -1,
    yoyo: true,
    ease: 'power1.inOut',
    stagger: { each: 0.1, from: 'random' }
  });

  const tl = gsap.timeline({
    onComplete: () => {
      gsap.to(loader, {
        opacity: 0,
        duration: 1.2,
        ease: 'power3.inOut',
        onComplete: () => {
          loader.style.display = 'none';
          loader.setAttribute('aria-hidden', 'true');
          main.classList.remove('hidden');
          main.style.display = 'block';
          document.body.classList.remove('loading');
          gsap.from(main, { opacity: 0, duration: 0.8 });
          if (onComplete) onComplete();
        }
      });
    }
  });

  tl.to(loaderProgress, {
    width: '100%',
    duration: 3.5,
    ease: 'power2.inOut'
  }, 0);

  tl.to(allChars, {
    opacity: 1,
    filter: 'blur(0px)',
    y: 0,
    duration: 0.6,
    stagger: { amount: 2, from: 'start' },
    ease: 'power3.out'
  }, 0.3);

  tl.fromTo(allChars, {
    y: 30,
    scale: 0.8
  }, {
    y: 0,
    scale: 1,
    duration: 0.8,
    stagger: { amount: 1.5, from: 'random' },
    ease: 'back.out(1.4)'
  }, 0.5);

  tl.to('.loader__content', {
    y: -10,
    duration: 2,
    repeat: 1,
    yoyo: true,
    ease: 'sine.inOut'
  }, 1);

  tl.to('.loader__shimmer', {
    left: '150%',
    duration: 1.5,
    ease: 'power2.inOut'
  }, 2);

  tl.to(allChars, {
    color: '#D4AF37',
    duration: 0.4,
    stagger: { amount: 0.8, from: 'center' },
    yoyo: true,
    repeat: 1,
    ease: 'power1.inOut'
  }, 2.2);

  tl.to(allChars, {
    scale: 1.05,
    duration: 0.5,
    stagger: { amount: 0.5, from: 'center' },
    yoyo: true,
    repeat: 1,
    ease: 'power2.inOut'
  }, 3);

  tl.to(allChars, {
    filter: 'blur(4px)',
    opacity: 0.5,
    duration: 0.8,
    stagger: { amount: 0.6, from: 'end' },
    ease: 'power2.in'
  }, 3.8);

  return tl;
}

window.initLoading = initLoading;
