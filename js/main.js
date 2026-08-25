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

  // Formulaire de contact : le champ "honeypot" filtre une partie du spam,
  // l'envoi réel est géré par le service configuré dans l'attribut action (voir README).
});
