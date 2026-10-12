// Consentement cookies + Google Analytics (GA4), chargé uniquement après acceptation

(function () {
  var GA_ID = 'G-TN0VT3LSKW';
  var STORAGE_KEY = 'fmg-cookie-consent';
  var consent = localStorage.getItem(STORAGE_KEY);

  // Contenus tiers intégrés (flux Instagram SnapWidget) : chargés seulement après consentement
  // global, ou pour la visite en cours si le visiteur clique sur « Afficher les publications ».
  function loadEmbed(el) {
    if (el.querySelector('iframe')) return;
    var iframe = document.createElement('iframe');
    iframe.src = el.getAttribute('data-consent-embed');
    iframe.title = el.getAttribute('data-consent-title') || '';
    iframe.setAttribute('allowtransparency', 'true');
    iframe.setAttribute('scrolling', 'no');
    iframe.loading = 'lazy';
    el.innerHTML = '';
    el.appendChild(iframe);
  }

  function loadEmbeds() {
    document.querySelectorAll('[data-consent-embed]').forEach(loadEmbed);
  }

  function loadGA() {
    if (window.fmgGaLoaded) return;
    window.fmgGaLoaded = true;
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', GA_ID);
  }

  if (consent === 'accepted') loadGA();

  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('[data-consent-embed]').forEach(function (el) {
      var btn = el.querySelector('[data-consent-load]');
      if (btn) btn.addEventListener('click', function () { loadEmbed(el); });
    });
    if (consent === 'accepted') loadEmbeds();
    if (consent) return;

    var banner = document.createElement('div');
    banner.className = 'cookie-banner';
    banner.innerHTML =
      '<p>Ce site utilise des cookies de mesure d’audience (Google Analytics) et peut afficher nos publications Instagram via un service tiers (SnapWidget). Vous pouvez accepter ou refuser.</p>' +
      '<div class="cookie-banner-actions">' +
      '<button type="button" id="cookie-refuse">Refuser</button>' +
      '<button type="button" id="cookie-accept">Accepter</button>' +
      '</div>';
    document.body.appendChild(banner);

    document.getElementById('cookie-accept').addEventListener('click', function () {
      localStorage.setItem(STORAGE_KEY, 'accepted');
      banner.remove();
      loadGA();
      loadEmbeds();
    });
    document.getElementById('cookie-refuse').addEventListener('click', function () {
      localStorage.setItem(STORAGE_KEY, 'refused');
      banner.remove();
    });
  });
})();
