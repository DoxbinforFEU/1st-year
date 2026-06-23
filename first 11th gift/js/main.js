/* Main entry point */

document.addEventListener('DOMContentLoaded', () => {
  gsap.config({ nullTargetWarn: false });

  if (LuxuryUtils.prefersReducedMotion()) {
    gsap.globalTimeline.timeScale(0.001);
  }

  initLoading(() => {
    initMusicPlayer();
    initCursor();
    initMouseParallax();
    initAnimations();
    initSurprise();

    window.addEventListener('resize', LuxuryUtils.debounce(() => {
      ScrollTrigger.refresh();
    }, 250));
  });
});
