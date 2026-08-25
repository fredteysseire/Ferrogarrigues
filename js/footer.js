// Pied de page injecté sur toutes les pages (évite la duplication en HTML statique)

document.addEventListener('DOMContentLoaded', () => {
  const el = document.getElementById('site-footer');
  if (!el) return;
  const year = new Date().getFullYear();
  el.innerHTML = `
    <div class="wrap">
      <div class="footer-grid">
        <div>
          <h4>FMG Metal Studio</h4>
          <p>Atelier d'architecture métallique.<br>Garde-corps, escaliers, verrières et menuiserie acier sur mesure — créateur de la collection Pleine Lumière®.</p>
        </div>
        <div>
          <h4>Navigation</h4>
          <ul>
            <li><a href="atelier.html">L'Atelier</a></li>
            <li><a href="realisations.html">Réalisations</a></li>
            <li><a href="pleine-lumiere.html">Pleine Lumière®</a></li>
            <li><a href="contact.html">Contact</a></li>
          </ul>
        </div>
        <div>
          <h4>Contact</h4>
          <ul>
            <li><a href="tel:+33661067375">06 61 06 73 75</a></li>
            <li><a href="mailto:contact@ferrogarrigues.fr">contact@ferrogarrigues.fr</a></li>
            <li>305 chemin de la Gravière<br>30210 Sernhac</li>
            <li>Sud de la France — déplacements France entière selon projet</li>
          </ul>
          <div class="social-icons" style="margin-top: 1rem;">
            <a href="https://www.instagram.com/fmgmetalstudio/" target="_blank" rel="noopener" aria-label="FMG Metal Studio sur Instagram">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.2c3.2 0 3.58.01 4.85.07 1.17.05 1.97.24 2.43.4a4.9 4.9 0 0 1 1.77 1.15 4.9 4.9 0 0 1 1.15 1.77c.16.46.35 1.26.4 2.43.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.24 1.97-.4 2.43a4.9 4.9 0 0 1-1.15 1.77 4.9 4.9 0 0 1-1.77 1.15c-.46.16-1.26.35-2.43.4-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.97-.24-2.43-.4a4.9 4.9 0 0 1-1.77-1.15 4.9 4.9 0 0 1-1.15-1.77c-.16-.46-.35-1.26-.4-2.43C2.21 15.58 2.2 15.2 2.2 12s.01-3.58.07-4.85c.05-1.17.24-1.97.4-2.43a4.9 4.9 0 0 1 1.15-1.77A4.9 4.9 0 0 1 5.6 1.8c.46-.16 1.26-.35 2.43-.4C9.3 1.34 9.68 1.33 12 1.33m0-1.33C8.74 0 8.33.01 7.05.07c-1.28.06-2.15.26-2.91.56A6.9 6.9 0 0 0 1.62 2.15 6.9 6.9 0 0 0 .1 4.67c-.3.76-.5 1.63-.56 2.9C-.52 8.86-.53 9.27-.53 12.53s.01 3.67.07 4.95c.06 1.27.26 2.14.56 2.9a6.9 6.9 0 0 0 1.52 2.52 6.9 6.9 0 0 0 2.52 1.52c.76.3 1.63.5 2.9.56 1.28.06 1.69.07 4.95.07s3.67-.01 4.95-.07c1.27-.06 2.14-.26 2.9-.56a6.9 6.9 0 0 0 2.52-1.52 6.9 6.9 0 0 0 1.52-2.52c.3-.76.5-1.63.56-2.9.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.06-1.27-.26-2.14-.56-2.9A6.9 6.9 0 0 0 21.85 2.15 6.9 6.9 0 0 0 19.33.63c-.76-.3-1.63-.5-2.9-.56C15.15.01 14.74 0 12 0Z" transform="translate(0 .8) scale(.96)"/><path d="M12 5.84a6.16 6.16 0 1 0 0 12.32 6.16 6.16 0 0 0 0-12.32Zm0 10.16a4 4 0 1 1 0-8 4 4 0 0 1 0 8Zm6.4-10.4a1.44 1.44 0 1 1-2.88 0 1.44 1.44 0 0 1 2.88 0Z"/></svg>
            </a>
            <!-- TODO : remplacer # par l'URL de la page Facebook une fois transmise -->
            <a href="#" target="_blank" rel="noopener" aria-label="FMG Metal Studio sur Facebook">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06C2 17.08 5.66 21.23 10.44 22v-7.03H7.9v-2.91h2.54V9.85c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.44 2.91h-2.34V22C18.34 21.23 22 17.08 22 12.06Z"/></svg>
            </a>
          </div>
        </div>
      </div>
      <div class="footer-bottom">
        <span>© ${year} FMG Metal Studio. Tous droits réservés.</span>
        <span>Pleine Lumière® est une marque déposée de FMG Metal Studio.</span>
      </div>
    </div>
  `;
});
