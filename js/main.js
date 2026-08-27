// FMG Metal Studio, interactions front-end (sans dépendance)

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

  // Filtres de la page Réalisations (cases à cocher, sélection multiple)
  const filterInputs = document.querySelectorAll('.filters input[data-filter]');
  const filtersReset = document.getElementById('filters-reset');
  const projects = document.querySelectorAll('[data-category]');
  if (filterInputs.length) {
    const applyFilters = () => {
      const active = Array.from(filterInputs).filter((i) => i.checked).map((i) => i.dataset.filter);
      projects.forEach((card) => {
        const match = active.length === 0 || active.includes(card.dataset.category);
        card.hidden = !match;
      });
      if (filtersReset) filtersReset.hidden = active.length === 0;
    };

    filterInputs.forEach((input) => input.addEventListener('change', applyFilters));

    if (filtersReset) {
      filtersReset.addEventListener('click', () => {
        filterInputs.forEach((input) => { input.checked = false; });
        applyFilters();
      });
    }

    // Pré-sélection depuis un lien externe, ex. realisations.html?filter=portails
    const requested = new URLSearchParams(window.location.search).get('filter');
    if (requested) {
      const wanted = requested.split(',').map((v) => v.trim()).filter(Boolean);
      filterInputs.forEach((input) => {
        if (wanted.includes(input.dataset.filter)) input.checked = true;
      });
    }
    applyFilters();
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

  // Fiche détaillée des réalisations : clic sur une carte -> description, localisation, galerie
  const modal = document.getElementById('project-modal');
  if (modal) {
    const pmImg = document.getElementById('pm-img');
    const pmCategory = document.getElementById('pm-category');
    const pmTitle = document.getElementById('pm-title');
    const pmLocation = document.getElementById('pm-location');
    const pmDesc = document.getElementById('pm-desc');
    const pmCount = document.getElementById('pm-count');
    const pmPrev = document.getElementById('pm-prev');
    const pmNext = document.getElementById('pm-next');
    const pmClose = document.getElementById('pm-close');

    let images = [];
    let index = 0;
    let lastFocused = null;

    const render = () => {
      const item = images[index];
      pmImg.src = item.src;
      pmImg.alt = item.alt || '';
      pmCount.textContent = images.length > 1 ? `${index + 1} / ${images.length}` : '';
      pmCount.hidden = images.length <= 1;
      pmPrev.hidden = pmNext.hidden = images.length <= 1;
    };

    const open = (card) => {
      try {
        images = JSON.parse(card.dataset.images);
      } catch (e) {
        return;
      }
      if (!images.length) return;
      index = 0;
      const filterEl = document.querySelector(`.filters [data-filter="${card.dataset.category}"]`);
      const filterLabel = filterEl
        ? (filterEl.tagName === 'INPUT' ? filterEl.closest('label')?.textContent.trim() : filterEl.textContent)
        : '';
      pmCategory.textContent = card.dataset.eyebrow || filterLabel || '';
      pmTitle.textContent = card.querySelector('h3')?.textContent || '';
      pmLocation.textContent = card.dataset.location || '';
      pmDesc.textContent = card.dataset.description || '';
      render();
      lastFocused = document.activeElement;
      modal.hidden = false;
      document.body.style.overflow = 'hidden';
      pmClose.focus();
    };

    const close = () => {
      modal.hidden = true;
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

    pmPrev.addEventListener('click', () => { index = (index - 1 + images.length) % images.length; render(); });
    pmNext.addEventListener('click', () => { index = (index + 1) % images.length; render(); });
    pmClose.addEventListener('click', close);
    modal.addEventListener('click', (e) => { if (e.target === modal) close(); });
    document.addEventListener('keydown', (e) => {
      if (modal.hidden) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') pmPrev.click();
      if (e.key === 'ArrowRight') pmNext.click();
    });
  }

  // Formulaire de contact : le champ "honeypot" filtre une partie du spam,
  // l'envoi réel est géré par le service configuré dans l'attribut action (voir README).
});
