// Consentement cookies + Google Analytics (GA4), chargé uniquement après acceptation

(function () {
  var GA_ID = 'G-TN0VT3LSKW';
  var STORAGE_KEY = 'fmg-cookie-consent';
  var consent = localStorage.getItem(STORAGE_KEY);

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
    if (consent) return;

    var banner = document.createElement('div');
    banner.className = 'cookie-banner';
    banner.innerHTML =
      '<p>Ce site utilise des cookies de mesure d’audience (Google Analytics). Vous pouvez accepter ou refuser.</p>' +
      '<div class="cookie-banner-actions">' +
      '<button type="button" id="cookie-refuse">Refuser</button>' +
      '<button type="button" id="cookie-accept">Accepter</button>' +
      '</div>';
    document.body.appendChild(banner);

    // Tant que le bandeau est affiché, le bouton WhatsApp flottant se place au-dessus de lui.
    function placeWhatsapp() {
      document.body.style.setProperty('--cookie-banner-h', banner.offsetHeight + 'px');
    }
    document.body.classList.add('has-cookie-banner');
    placeWhatsapp();
    window.addEventListener('resize', placeWhatsapp);
    function closeBanner() {
      banner.remove();
      document.body.classList.remove('has-cookie-banner');
      window.removeEventListener('resize', placeWhatsapp);
    }

    document.getElementById('cookie-accept').addEventListener('click', function () {
      localStorage.setItem(STORAGE_KEY, 'accepted');
      closeBanner();
      loadGA();
    });
    document.getElementById('cookie-refuse').addEventListener('click', function () {
      localStorage.setItem(STORAGE_KEY, 'refused');
      closeBanner();
    });
  });
})();
