document.addEventListener('DOMContentLoaded', () => {

  // ─── Scroll Progress Bar ───
  const scrollProgress = document.getElementById('scroll-progress');
  if (scrollProgress) {
    window.addEventListener('scroll', () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      const pct = total > 0 ? window.scrollY / total : 0;
      scrollProgress.style.transform = `scaleX(${pct.toFixed(4)})`;
    }, { passive: true });
  }

  // ─── Nav: shadow on scroll + active section tracking ───
  const nav = document.querySelector('nav');
  const navLinks = document.querySelectorAll('nav a[href^="#"]');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });

  // Highlight the nav link whose section is most in view
  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(l => l.classList.remove('active'));
        const link = document.querySelector(`nav a[href="#${entry.target.id}"]`);
        if (link) link.classList.add('active');
      }
    });
  }, {
    threshold: 0,
    rootMargin: '-15% 0px -70% 0px'
  });

  sections.forEach(s => sectionObserver.observe(s));

  // ─── Smooth scroll for nav links ───
  navLinks.forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute('href'));
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  // ─── Entrance Animations ───
  // Single reusable observer — marks element visible when it enters viewport
  const enterObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        enterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.06, rootMargin: '0px 0px -24px 0px' });

  // Section headings + subtitles — fade in as unit
  document.querySelectorAll('.section h2, .section .section-subtitle').forEach(el => {
    el.classList.add('fade-in');
    enterObserver.observe(el);
  });

  // Helper: assign stagger delays and observe a NodeList
  function staggerAndObserve(selector, delayStep) {
    document.querySelectorAll(selector).forEach((el, i) => {
      el.classList.add('animate-stagger');
      el.style.setProperty('--stagger-delay', `${i * delayStep}ms`);
      enterObserver.observe(el);
    });
  }

  // Deepdive cards — 70ms apart
  staggerAndObserve('.card-grid > .card', 70);

  // Blog items — 45ms apart
  staggerAndObserve('.blog-list > .blog-item', 45);

  // Thesis cards — 90ms apart (slightly slower for wide cards)
  staggerAndObserve('.thesis-track > .thesis-card', 90);

  // Knowledge cards
  staggerAndObserve('.knowledge-card', 60);

  // Topic list items — short delay, there are many
  staggerAndObserve('.topic-list > li', 28);

  // ─── Thesis Carousel ───
  const track = document.querySelector('.thesis-track');
  const progressBar = document.querySelector('.thesis-progress-bar');
  if (!track || !progressBar) return;

  function updateProgress() {
    const maxScroll = track.scrollWidth - track.clientWidth;
    if (maxScroll <= 0) { progressBar.style.width = '100%'; return; }
    progressBar.style.width = Math.max(8, (track.scrollLeft / maxScroll) * 100) + '%';
  }

  track.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();

  document.querySelectorAll('.thesis-nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const card = track.querySelector('.thesis-card');
      track.scrollBy({ left: (card.offsetWidth + 16) * parseInt(btn.dataset.dir, 10), behavior: 'smooth' });
    });
  });

  // Drag to scroll
  let isDragging = false, startX = 0, scrollStart = 0, hasDragged = false;

  track.addEventListener('mousedown', e => {
    isDragging = true;
    hasDragged = false;
    startX = e.pageX;
    scrollStart = track.scrollLeft;
    track.style.scrollBehavior = 'auto';
  });

  window.addEventListener('mousemove', e => {
    if (!isDragging) return;
    const dx = e.pageX - startX;
    if (Math.abs(dx) > 4) hasDragged = true;
    track.scrollLeft = scrollStart - dx;
  });

  window.addEventListener('mouseup', () => {
    isDragging = false;
    track.style.scrollBehavior = '';
  });

  track.querySelectorAll('.thesis-card').forEach(card => {
    card.addEventListener('click', e => { if (hasDragged) e.preventDefault(); });
  });

});
