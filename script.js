document.addEventListener('DOMContentLoaded', () => {

  // ─── Sound Effects (Web Audio API) ───

  let audioCtx = null;

  function getAudioCtx() {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    return audioCtx;
  }

  function playInsertSound() {
    try {
      const ctx = getAudioCtx();
      const now = ctx.currentTime;

      // Mechanical click
      const clickOsc = ctx.createOscillator();
      const clickGain = ctx.createGain();
      clickOsc.type = 'square';
      clickOsc.frequency.setValueAtTime(1800, now);
      clickOsc.frequency.exponentialRampToValueAtTime(400, now + 0.03);
      clickGain.gain.setValueAtTime(0.12, now);
      clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
      clickOsc.connect(clickGain).connect(ctx.destination);
      clickOsc.start(now);
      clickOsc.stop(now + 0.06);

      // Soft thud body
      const thud = ctx.createOscillator();
      const thudGain = ctx.createGain();
      thud.type = 'sine';
      thud.frequency.setValueAtTime(180, now + 0.02);
      thud.frequency.exponentialRampToValueAtTime(80, now + 0.1);
      thudGain.gain.setValueAtTime(0.08, now + 0.02);
      thudGain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
      thud.connect(thudGain).connect(ctx.destination);
      thud.start(now + 0.02);
      thud.stop(now + 0.12);

      // Subtle noise burst (floppy texture)
      const bufferSize = ctx.sampleRate * 0.04;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1) * 0.5;
      const noise = ctx.createBufferSource();
      const noiseGain = ctx.createGain();
      const noiseFilter = ctx.createBiquadFilter();
      noise.buffer = noiseBuffer;
      noiseFilter.type = 'bandpass';
      noiseFilter.frequency.value = 3000;
      noiseFilter.Q.value = 1.5;
      noiseGain.gain.setValueAtTime(0.06, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
      noise.connect(noiseFilter).connect(noiseGain).connect(ctx.destination);
      noise.start(now);
      noise.stop(now + 0.04);
    } catch (e) {
      // Audio not supported, fail silently
    }
  }

  function playEjectSound() {
    try {
      const ctx = getAudioCtx();
      const now = ctx.currentTime;

      // Reverse click (ascending)
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(500, now);
      osc.frequency.exponentialRampToValueAtTime(1400, now + 0.04);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
      osc.connect(gain).connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.06);

      // Light spring release
      const spring = ctx.createOscillator();
      const springGain = ctx.createGain();
      spring.type = 'sine';
      spring.frequency.setValueAtTime(600, now + 0.01);
      spring.frequency.exponentialRampToValueAtTime(900, now + 0.05);
      springGain.gain.setValueAtTime(0.04, now + 0.01);
      springGain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);
      spring.connect(springGain).connect(ctx.destination);
      spring.start(now + 0.01);
      spring.stop(now + 0.07);
    } catch (e) {
      // Audio not supported, fail silently
    }
  }

  // ─── Floppy Accordion ───

  const floppies = document.querySelectorAll('.floppy[data-folder]');
  let currentOpen = null;

  function closeFolder(folderName, silent) {
    const floppy = document.querySelector(`.floppy[data-folder="${folderName}"]`);
    const wrapper = document.querySelector(`.folder-wrapper[data-for="${folderName}"]`);
    if (!floppy || !wrapper) return;

    if (!silent) playEjectSound();

    floppy.classList.remove('open');
    floppy.setAttribute('aria-expanded', 'false');
    wrapper.classList.remove('expanded');
    wrapper.style.maxHeight = '0px';
    currentOpen = null;
  }

  function openFolder(folderName) {
    if (currentOpen && currentOpen !== folderName) {
      closeFolder(currentOpen, true);
    }

    const floppy = document.querySelector(`.floppy[data-folder="${folderName}"]`);
    const wrapper = document.querySelector(`.folder-wrapper[data-for="${folderName}"]`);
    if (!floppy || !wrapper) return;

    playInsertSound();

    floppy.classList.add('open');
    floppy.setAttribute('aria-expanded', 'true');
    wrapper.classList.add('expanded');
    wrapper.style.maxHeight = wrapper.scrollHeight + 'px';
    currentOpen = folderName;

    setTimeout(() => {
      wrapper.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 120);
  }

  function toggleFolder(folderName) {
    if (currentOpen === folderName) {
      closeFolder(folderName);
    } else {
      openFolder(folderName);
    }
  }

  floppies.forEach(floppy => {
    floppy.addEventListener('click', (e) => {
      e.preventDefault();
      toggleFolder(floppy.dataset.folder);
    });

    floppy.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleFolder(floppy.dataset.folder);
      }
    });
  });

  document.querySelectorAll('.folder-close').forEach(btn => {
    btn.addEventListener('click', () => {
      if (currentOpen) closeFolder(currentOpen);
    });
  });

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (currentOpen) {
        const wrapper = document.querySelector(`.folder-wrapper[data-for="${currentOpen}"]`);
        if (wrapper && wrapper.classList.contains('expanded')) {
          wrapper.style.maxHeight = wrapper.scrollHeight + 'px';
        }
      }
    }, 150);
  });

  // ─── Entrance Animations ───

  const enterObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        enterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.06, rootMargin: '0px 0px -24px 0px' });

  document.querySelectorAll('.fade-in').forEach(el => enterObserver.observe(el));

  document.querySelectorAll('.floppy-row').forEach(row => {
    row.querySelectorAll('.floppy').forEach((floppy, i) => {
      floppy.style.setProperty('--stagger-delay', `${i * 80}ms`);
      floppy.style.transitionDelay = `${i * 80}ms`;
    });
  });

});
