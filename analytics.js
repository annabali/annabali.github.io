(function () {
  function readStoredUtm() {
    try {
      var raw = localStorage.getItem('cv_utm_params');
      return raw ? JSON.parse(raw) : {};
    } catch (e) {
      return {};
    }
  }

  function saveUtm(params) {
    try {
      localStorage.setItem('cv_utm_params', JSON.stringify(params));
    } catch (e) {
      // ignore storage errors
    }
  }

  function getCurrentUtm() {
    var search = new URLSearchParams(window.location.search);
    var utm = {
      utm_source: search.get('utm_source') || '',
      utm_medium: search.get('utm_medium') || '',
      utm_campaign: search.get('utm_campaign') || ''
    };

    var hasAny = utm.utm_source || utm.utm_medium || utm.utm_campaign;
    if (hasAny) {
      saveUtm(utm);
      return utm;
    }

    return readStoredUtm();
  }

  function trackContactClick(channel, utm) {
    if (typeof window.plausible !== 'function') return;

    window.plausible('Contact Click', {
      props: {
        channel: channel,
        source: utm.utm_source || 'direct',
        medium: utm.utm_medium || 'none',
        campaign: utm.utm_campaign || 'none',
        page_lang: document.documentElement.lang || 'unknown'
      }
    });
  }

  function bindContactTracking() {
    var utm = getCurrentUtm();
    var links = document.querySelectorAll('[data-contact-channel]');

    links.forEach(function (link) {
      link.addEventListener('click', function () {
        var channel = link.getAttribute('data-contact-channel') || 'unknown';
        trackContactClick(channel, utm);
      });
    });
  }

  document.addEventListener('DOMContentLoaded', bindContactTracking);
})();
