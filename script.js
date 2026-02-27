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
      const click = ctx.createOscillator();
      const cg = ctx.createGain();
      click.type = 'square';
      click.frequency.setValueAtTime(1800, now);
      click.frequency.exponentialRampToValueAtTime(400, now + 0.03);
      cg.gain.setValueAtTime(0.12, now);
      cg.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
      click.connect(cg).connect(ctx.destination);
      click.start(now); click.stop(now + 0.06);

      const thud = ctx.createOscillator();
      const tg = ctx.createGain();
      thud.type = 'sine';
      thud.frequency.setValueAtTime(180, now + 0.02);
      thud.frequency.exponentialRampToValueAtTime(80, now + 0.1);
      tg.gain.setValueAtTime(0.08, now + 0.02);
      tg.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
      thud.connect(tg).connect(ctx.destination);
      thud.start(now + 0.02); thud.stop(now + 0.12);

      const bufSz = ctx.sampleRate * 0.04;
      const buf = ctx.createBuffer(1, bufSz, ctx.sampleRate);
      const d = buf.getChannelData(0);
      for (let i = 0; i < bufSz; i++) d[i] = (Math.random() * 2 - 1) * 0.5;
      const ns = ctx.createBufferSource();
      const ng = ctx.createGain();
      const nf = ctx.createBiquadFilter();
      ns.buffer = buf; nf.type = 'bandpass'; nf.frequency.value = 3000; nf.Q.value = 1.5;
      ng.gain.setValueAtTime(0.06, now);
      ng.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
      ns.connect(nf).connect(ng).connect(ctx.destination);
      ns.start(now); ns.stop(now + 0.04);
    } catch (e) {}
  }

  function playEjectSound() {
    try {
      const ctx = getAudioCtx();
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(500, now);
      osc.frequency.exponentialRampToValueAtTime(1400, now + 0.04);
      g.gain.setValueAtTime(0.08, now);
      g.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
      osc.connect(g).connect(ctx.destination);
      osc.start(now); osc.stop(now + 0.06);

      const sp = ctx.createOscillator();
      const sg = ctx.createGain();
      sp.type = 'sine';
      sp.frequency.setValueAtTime(600, now + 0.01);
      sp.frequency.exponentialRampToValueAtTime(900, now + 0.05);
      sg.gain.setValueAtTime(0.04, now + 0.01);
      sg.gain.exponentialRampToValueAtTime(0.001, now + 0.07);
      sp.connect(sg).connect(ctx.destination);
      sp.start(now + 0.01); sp.stop(now + 0.07);
    } catch (e) {}
  }

  // ─── Floppy Accordion ───

  const floppies = document.querySelectorAll('.floppy[data-folder]');
  let currentOpen = null;

  function applyStagger(wrapper, show) {
    const items = wrapper.querySelectorAll('.card, .thesis-card, .blog-item, .knowledge-card, .topic-list li');
    items.forEach((el, i) => {
      el.style.transitionDelay = show ? `${60 + i * 30}ms` : '0ms';
    });
  }

  function closeFolder(name, silent) {
    const fl = document.querySelector(`.floppy[data-folder="${name}"]`);
    const wr = document.querySelector(`.folder-wrapper[data-for="${name}"]`);
    if (!fl || !wr) return;
    if (!silent) playEjectSound();
    applyStagger(wr, false);
    fl.classList.remove('open');
    fl.setAttribute('aria-expanded', 'false');
    wr.classList.remove('expanded');
    wr.style.maxHeight = '0px';
    currentOpen = null;
  }

  function openFolder(name) {
    if (currentOpen && currentOpen !== name) closeFolder(currentOpen, true);
    const fl = document.querySelector(`.floppy[data-folder="${name}"]`);
    const wr = document.querySelector(`.folder-wrapper[data-for="${name}"]`);
    if (!fl || !wr) return;
    playInsertSound();
    applyStagger(wr, true);
    fl.classList.add('open');
    fl.setAttribute('aria-expanded', 'true');
    wr.classList.add('expanded');
    wr.style.maxHeight = wr.scrollHeight + 'px';
    currentOpen = name;
    setTimeout(() => wr.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 120);
  }

  function toggleFolder(name) {
    currentOpen === name ? closeFolder(name) : openFolder(name);
  }

  floppies.forEach(fl => {
    fl.addEventListener('click', e => { e.preventDefault(); toggleFolder(fl.dataset.folder); });
    fl.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleFolder(fl.dataset.folder); }
    });
  });

  document.querySelectorAll('.folder-close').forEach(btn => {
    btn.addEventListener('click', () => { if (currentOpen) closeFolder(currentOpen); });
  });

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (currentOpen) {
        const wr = document.querySelector(`.folder-wrapper[data-for="${currentOpen}"]`);
        if (wr && wr.classList.contains('expanded')) wr.style.maxHeight = wr.scrollHeight + 'px';
      }
      // Study plan uses CSS max-height: 60vh with overflow-y: auto, no JS override needed
    }, 150);
  });

  // ─── Study Plan Toggle ───

  document.querySelectorAll('.study-plan-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const collapsible = btn.nextElementSibling;
      if (!collapsible) return;
      const isOpen = collapsible.classList.contains('open');
      const parentWr = currentOpen
        ? document.querySelector(`.folder-wrapper[data-for="${currentOpen}"]`)
        : null;

      if (isOpen) {
        collapsible.style.maxHeight = '0px';
        collapsible.classList.remove('open');
        btn.setAttribute('aria-expanded', 'false');
        if (parentWr) {
          setTimeout(() => { parentWr.style.maxHeight = parentWr.scrollHeight + 'px'; }, 520);
        }
      } else {
        collapsible.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
        // CSS handles max-height: 60vh + overflow-y: auto, just clear any inline override
        collapsible.style.maxHeight = '';
        if (parentWr) {
          parentWr.style.maxHeight = (parentWr.scrollHeight + 800) + 'px';
          setTimeout(() => { parentWr.style.maxHeight = parentWr.scrollHeight + 'px'; }, 520);
        }
      }
    });
  });

  // ─── Cursor Parallax on Floppy Grid ───

  const floppySection = document.querySelector('.floppy-section');
  if (floppySection) {
    floppySection.addEventListener('mousemove', e => {
      const rect = floppySection.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      document.querySelectorAll('.floppy-row').forEach(row => {
        row.querySelectorAll('.floppy-disk').forEach(disk => {
          if (!disk.closest('.floppy.open') && !disk.closest('.floppy:hover')) {
            disk.style.transform = `rotateX(${8 - y * 4}deg) rotateY(${-4 + x * 4}deg)`;
          }
        });
      });
    });

    floppySection.addEventListener('mouseleave', () => {
      document.querySelectorAll('.floppy-disk').forEach(disk => {
        disk.style.transform = '';
      });
    });
  }

  // ─── Page Load: Stagger Floppies ───

  document.querySelectorAll('.floppy-row').forEach((row, rowIdx) => {
    row.querySelectorAll('.floppy').forEach((fl, i) => {
      const delay = 600 + rowIdx * 200 + i * 100;
      fl.style.opacity = '0';
      fl.style.transform = 'translateY(18px)';
      fl.style.transition = 'none';
      setTimeout(() => {
        fl.style.transition = 'opacity 0.55s cubic-bezier(0.16,1,0.3,1), transform 0.55s cubic-bezier(0.16,1,0.3,1)';
        fl.style.opacity = '1';
        fl.style.transform = 'translateY(0)';
        fl.classList.add('visible');
      }, delay);
    });
  });

  // ─── Back to Top ───

  const btt = document.getElementById('backToTop');
  if (btt) {
    window.addEventListener('scroll', () => {
      btt.classList.toggle('visible', window.scrollY > 400);
    }, { passive: true });

    btt.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ─── Entrance Animations (for below-fold) ───

  const enterObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        enterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.06, rootMargin: '0px 0px -24px 0px' });

  document.querySelectorAll('.fade-in').forEach(el => enterObserver.observe(el));

});
