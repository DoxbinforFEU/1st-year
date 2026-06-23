/* Premium floating music player */

function initMusicPlayer() {
  const audio = document.getElementById('audio');
  const playBtn = document.getElementById('playBtn');
  const pauseBtn = document.getElementById('pauseBtn');
  const muteBtn = document.getElementById('muteBtn');
  const vinyl = document.getElementById('vinylDisc');
  const progressBar = document.getElementById('progressBar');
  const progressWrap = document.getElementById('progressWrap');
  const currentTimeEl = document.getElementById('currentTime');
  const durationEl = document.getElementById('duration');
  const volumeSlider = document.getElementById('volumeSlider');
  const player = document.getElementById('musicPlayer');

  if (!audio) return;

  audio.volume = 0.7;
  let hasInteracted = false;
  let isPlaying = false;

  audio.addEventListener('loadedmetadata', () => {
    durationEl.textContent = LuxuryUtils.formatTime(audio.duration);
  });

  audio.addEventListener('timeupdate', () => {
    if (audio.duration) {
      const pct = (audio.currentTime / audio.duration) * 100;
      progressBar.style.width = `${pct}%`;
      currentTimeEl.textContent = LuxuryUtils.formatTime(audio.currentTime);
    }
  });

  function play() {
    audio.play().then(() => {
      isPlaying = true;
      playBtn.classList.add('music-player__btn--hidden');
      pauseBtn.classList.remove('music-player__btn--hidden');
      vinyl.classList.add('is-playing');
    }).catch(() => {});
  }

  function pause() {
    audio.pause();
    isPlaying = false;
    pauseBtn.classList.add('music-player__btn--hidden');
    playBtn.classList.remove('music-player__btn--hidden');
    vinyl.classList.remove('is-playing');
  }

  playBtn.addEventListener('click', () => {
    hasInteracted = true;
    play();
  });

  pauseBtn.addEventListener('click', pause);

  progressWrap.addEventListener('click', (e) => {
    const rect = progressWrap.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    audio.currentTime = pct * audio.duration;
  });

  volumeSlider.addEventListener('input', () => {
    audio.volume = volumeSlider.value;
    audio.muted = false;
    muteBtn.querySelector('.icon-volume').classList.remove('icon-hidden');
    muteBtn.querySelector('.icon-muted').classList.add('icon-hidden');
  });

  muteBtn.addEventListener('click', () => {
    audio.muted = !audio.muted;
    muteBtn.querySelector('.icon-volume').classList.toggle('icon-hidden', audio.muted);
    muteBtn.querySelector('.icon-muted').classList.toggle('icon-hidden', !audio.muted);
  });

  function tryAutoplay() {
    if (!hasInteracted) {
      hasInteracted = true;
      play();
    }
  }

  document.addEventListener('click', tryAutoplay, { once: true });
  document.addEventListener('touchstart', tryAutoplay, { once: true });
  document.addEventListener('keydown', tryAutoplay, { once: true });

  gsap.from(player, {
    y: 80,
    opacity: 0,
    duration: 1,
    delay: 0.5,
    ease: 'power3.out'
  });
}

window.initMusicPlayer = initMusicPlayer;
