/**
 * 湘南ボカ波 /shonan/ SCRIPT
 *  1. Mobile global nav toggle
 *  2. Sidebar local nav: highlight current section
 *  3. Page-top button visibility
 */
(function () {
  'use strict';

  /* 1. Mobile global nav toggle */
  var toggle = document.getElementById('svNavToggle');
  var gnav = document.getElementById('svGnav');

  if (toggle && gnav) {
    toggle.addEventListener('click', function () {
      var open = gnav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.setAttribute('aria-label', open ? 'メニューを閉じる' : 'メニューを開く');
    });

    gnav.querySelectorAll('a[href^="#"]').forEach(function (link) {
      link.addEventListener('click', function () {
        gnav.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-label', 'メニューを開く');
      });
    });
  }

  /* 2. Sidebar local nav: highlight current section */
  var localNav = document.getElementById('svLocalNav');
  if (localNav && 'IntersectionObserver' in window) {
    var links = Array.prototype.slice.call(localNav.querySelectorAll('a[href^="#"]'));
    var sections = links
      .map(function (a) { return document.querySelector(a.getAttribute('href')); })
      .filter(Boolean);

    var setCurrent = function (id) {
      links.forEach(function (a) {
        a.classList.toggle('is-current', a.getAttribute('href') === '#' + id);
      });
    };

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) setCurrent(entry.target.id);
      });
    }, { rootMargin: '-30% 0px -60% 0px' });

    sections.forEach(function (sec) { observer.observe(sec); });
  }

  /* 3. Page-top button visibility */
  var pageTop = document.getElementById('svPageTop');
  if (pageTop) {
    var onScroll = function () {
      pageTop.classList.toggle('is-visible', window.scrollY > 400);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }
})();
