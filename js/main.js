// FMG Metal Studio — interactions front-end (sans dépendance)

document.addEventListener('DOMContentLoaded', () => {
  // Menu mobile
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      const open = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    links.querySelectorAll('a').forEach((a) =>
      a.addEventListener('click', () => links.classList.remove('open'))
    );
  }

  // Filtres de la page Réalisations
  const filterBtns = document.querySelectorAll('.filters [data-filter]');
  const projects = document.querySelectorAll('[data-category]');
  if (filterBtns.length) {
    filterBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        filterBtns.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.dataset.filter;
        projects.forEach((card) => {
          const match = filter === 'all' || card.dataset.category === filter;
          card.hidden = !match;
        });
      });
    });
  }

  // Carrousel de réalisations (accueil)
  const track = document.querySelector('.carousel-track');
  const prevBtn = document.querySelector('[data-carousel-prev]');
  const nextBtn = document.querySelector('[data-carousel-next]');
  if (track && prevBtn && nextBtn) {
    const scrollByCard = (dir) => {
      const card = track.querySelector('.carousel-item');
      const gap = parseFloat(getComputedStyle(track).gap) || 0;
      const distance = card ? card.getBoundingClientRect().width + gap : 300;
      track.scrollBy({ left: dir * distance, behavior: 'smooth' });
    };
    prevBtn.addEventListener('click', () => scrollByCard(-1));
    nextBtn.addEventListener('click', () => scrollByCard(1));
  }

  // Visionneuse (lightbox) des réalisations : clic sur une carte -> galerie photo
  const lightbox = document.getElementById('lightbox');
  if (lightbox) {
    const lbImg = document.getElementById('lightbox-img');
    const lbTitle = document.getElementById('lightbox-title');
    const lbMeta = document.getElementById('lightbox-meta');
    const lbCount = document.getElementById('lightbox-count');
    const lbPrev = document.getElementById('lightbox-prev');
    const lbNext = document.getElementById('lightbox-next');
    const lbClose = document.getElementById('lightbox-close');

    let images = [];
    let index = 0;
    let lastFocused = null;

    const render = () => {
      const item = images[index];
      lbImg.src = item.src;
      lbImg.alt = item.alt || '';
      lbCount.textContent = images.length > 1 ? `${index + 1} / ${images.length}` : '';
      lbPrev.hidden = lbNext.hidden = images.length <= 1;
    };

    const open = (card) => {
      try {
        images = JSON.parse(card.dataset.images);
      } catch (e) {
        return;
      }
      if (!images.length) return;
      index = 0;
      lbTitle.textContent = card.querySelector('h3')?.textContent || '';
      lbMeta.innerHTML = card.querySelector('.meta')?.innerHTML || '';
      render();
      lastFocused = document.activeElement;
      lightbox.hidden = false;
      document.body.style.overflow = 'hidden';
      lbClose.focus();
    };

    const close = () => {
      lightbox.hidden = true;
      document.body.style.overflow = '';
      if (lastFocused) lastFocused.focus();
    };

    document.querySelectorAll('.project-card[data-images]').forEach((card) => {
      card.addEventListener('click', () => open(card));
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          open(card);
        }
      });
    });

    lbPrev.addEventListener('click', () => { index = (index - 1 + images.length) % images.length; render(); });
    lbNext.addEventListener('click', () => { index = (index + 1) % images.length; render(); });
    lbClose.addEventListener('click', close);
    lightbox.addEventListener('click', (e) => { if (e.target === lightbox) close(); });
    document.addEventListener('keydown', (e) => {
      if (lightbox.hidden) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') lbPrev.click();
      if (e.key === 'ArrowRight') lbNext.click();
    });
  }

  // Formulaire de contact : le champ "honeypot" filtre une partie du spam,
  // l'envoi réel est géré par le service configuré dans l'attribut action (voir README).
});
