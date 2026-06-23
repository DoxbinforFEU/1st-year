/* Utility helpers — particles, split text, scramble, format time */

const LuxuryUtils = {
  formatTime(seconds) {
    if (!isFinite(seconds)) return '0:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  },

  splitChars(element) {
    const text = element.textContent;
    element.textContent = '';
    element.setAttribute('aria-label', text);
    return [...text].map((char) => {
      const span = document.createElement('span');
      span.className = 'split-char loader__char';
      span.textContent = char === ' ' ? '\u00A0' : char;
      span.setAttribute('aria-hidden', 'true');
      element.appendChild(span);
      return span;
    });
  },

  splitWords(element) {
    const text = element.textContent.trim();
    element.innerHTML = '';
    return text.split(/\s+/).map((word, i, arr) => {
      const wrap = document.createElement('span');
      wrap.className = 'split-word word';
      const inner = document.createElement('span');
      inner.className = 'split-char';
      inner.textContent = word;
      wrap.appendChild(inner);
      element.appendChild(wrap);
      if (i < arr.length - 1) {
        element.appendChild(document.createTextNode(' '));
      }
      return inner;
    });
  },

  splitLines(container, selector) {
    const elements = container.querySelectorAll(selector);
    elements.forEach((el) => {
      const text = el.textContent;
      el.innerHTML = '';
      const line = document.createElement('span');
      line.className = 'split-line';
      const inner = document.createElement('span');
      inner.className = 'split-char';
      inner.textContent = text;
      line.appendChild(inner);
      el.appendChild(line);
      el._splitChar = inner;
    });
  },

  scrambleText(element, finalText, duration = 1.2) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$';
    const length = finalText.length;
    let frame = 0;
    const totalFrames = Math.floor(duration * 60);

    return new Promise((resolve) => {
      const interval = setInterval(() => {
        frame++;
        const progress = frame / totalFrames;
        let result = '';
        for (let i = 0; i < length; i++) {
          if (finalText[i] === ' ') {
            result += ' ';
          } else if (progress > i / length) {
            result += finalText[i];
          } else {
            result += chars[Math.floor(Math.random() * chars.length)];
          }
        }
        element.textContent = result;
        if (frame >= totalFrames) {
          element.textContent = finalText;
          clearInterval(interval);
          resolve();
        }
      }, 1000 / 60);
    });
  },

  createParticles(container, count, className = 'loader__particle') {
    const particles = [];
    for (let i = 0; i < count; i++) {
      const p = document.createElement('div');
      p.className = className;
      p.style.left = `${Math.random() * 100}%`;
      p.style.top = `${Math.random() * 100}%`;
      container.appendChild(p);
      particles.push(p);
    }
    return particles;
  },

  prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  },

  debounce(fn, wait) {
    let t;
    return (...args) => {
      clearTimeout(t);
      t = setTimeout(() => fn(...args), wait);
    };
  },

  typewriter(element, text, speed = 50) {
    element.textContent = '';
    let i = 0;
    return new Promise((resolve) => {
      const tick = () => {
        if (i < text.length) {
          element.textContent += text.charAt(i);
          i++;
          setTimeout(tick, speed);
        } else {
          resolve();
        }
      };
      tick();
    });
  }
};

window.LuxuryUtils = LuxuryUtils;
