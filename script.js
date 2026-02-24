document.addEventListener('DOMContentLoaded', () => {
  const elements = document.querySelectorAll('.section, .card, .blog-item, .thesis-card, .knowledge-card');

  elements.forEach(el => el.classList.add('fade-in'));

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );

  elements.forEach(el => observer.observe(el));

  document.querySelectorAll('nav a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  const nav = document.querySelector('nav');
  window.addEventListener('scroll', () => {
    nav.style.borderBottomColor = window.scrollY > 100 ? '#e0e0e0' : '#e5e5e5';
  }, { passive: true });

  // ─── Thesis Carousel ───
  const track = document.querySelector('.thesis-track');
  const progressBar = document.querySelector('.thesis-progress-bar');
  if (!track) return;

  function updateProgress() {
    const maxScroll = track.scrollWidth - track.clientWidth;
    if (maxScroll <= 0) {
      progressBar.style.width = '100%';
      return;
    }
    const pct = (track.scrollLeft / maxScroll) * 100;
    progressBar.style.width = Math.max(10, pct) + '%';
  }

  track.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();

  // Arrow buttons
  document.querySelectorAll('.thesis-nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const dir = parseInt(btn.dataset.dir, 10);
      const card = track.querySelector('.thesis-card');
      const scrollAmt = (card.offsetWidth + 20) * dir;
      track.scrollBy({ left: scrollAmt, behavior: 'smooth' });
    });
  });

  // Drag to scroll
  let isDragging = false;
  let startX = 0;
  let scrollStart = 0;
  let hasDragged = false;

  track.addEventListener('mousedown', (e) => {
    isDragging = true;
    hasDragged = false;
    startX = e.pageX;
    scrollStart = track.scrollLeft;
    track.style.scrollBehavior = 'auto';
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    const dx = e.pageX - startX;
    if (Math.abs(dx) > 4) hasDragged = true;
    track.scrollLeft = scrollStart - dx;
  });

  window.addEventListener('mouseup', () => {
    isDragging = false;
    track.style.scrollBehavior = '';
  });

  // Prevent click navigation when dragging
  track.querySelectorAll('.thesis-card').forEach(card => {
    card.addEventListener('click', (e) => {
      if (hasDragged) e.preventDefault();
    });
  });
});
