(function () {
  'use strict';

  // ── Footer year ──────────────────────────────────────────────────
  var yearEl = document.getElementById('ailab-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ── Header scroll state ──────────────────────────────────────────
  var header = document.getElementById('ailab-header');
  var onScroll = function () {
    header.classList.toggle('is-scrolled', window.scrollY > 20);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run once on load

  // ── Mobile menu ─────────────────────────────────────────────────
  var hamburger  = document.getElementById('ailab-hamburger');
  var mobileMenu = document.getElementById('ailab-mobile-menu');
  var menuClose  = document.getElementById('ailab-menu-close');

  function openMenu() {
    mobileMenu.classList.add('is-open');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    menuClose.focus();
  }
  function closeMenu() {
    mobileMenu.classList.remove('is-open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    hamburger.focus();
  }

  hamburger.addEventListener('click', openMenu);
  menuClose.addEventListener('click', closeMenu);
  mobileMenu.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', closeMenu);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && mobileMenu.classList.contains('is-open')) closeMenu();
  });

  // ── Scroll animations ────────────────────────────────────────────
  // Hero elements animate on load (not scroll)
  var heroEls = document.querySelectorAll('.ailab-hero .ailab-animate');
  heroEls.forEach(function (el) {
    setTimeout(function () { el.classList.add('is-visible'); }, 60);
  });

  // All other .ailab-animate elements use IntersectionObserver
  var scrollEls = document.querySelectorAll('.ailab-animate:not(.ailab-hero .ailab-animate)');
  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    scrollEls.forEach(function (el) { observer.observe(el); });
  } else {
    // Fallback: show all immediately
    scrollEls.forEach(function (el) { el.classList.add('is-visible'); });
  }

  // ── What We Build accordion (mobile only) ───────────────────────
  var buildRows = document.querySelectorAll('.ailab-build__row');
  buildRows.forEach(function (row) {
    row.addEventListener('click', function () {
      if (window.innerWidth >= 768) return;
      var wasOpen = row.classList.contains('is-open');
      buildRows.forEach(function (r) { r.classList.remove('is-open'); });
      if (!wasOpen) row.classList.add('is-open');
    });
    // Keyboard support
    row.setAttribute('tabindex', '0');
    row.addEventListener('keydown', function (e) {
      if (window.innerWidth >= 768) return;
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        row.click();
      }
    });
  });

  // ── FAQ accordion ────────────────────────────────────────────────
  var faqItems = document.querySelectorAll('.ailab-faq__item');
  faqItems.forEach(function (item) {
    var trigger = item.querySelector('.ailab-faq__trigger');
    trigger.addEventListener('click', function () {
      var isOpen = item.classList.contains('is-open');
      // Close all
      faqItems.forEach(function (i) {
        i.classList.remove('is-open');
        i.querySelector('.ailab-faq__trigger').setAttribute('aria-expanded', 'false');
      });
      // Open this one if it was closed
      if (!isOpen) {
        item.classList.add('is-open');
        trigger.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // ── Form submit (frontend-only prototype) ────────────────────────
  var submitBtn    = document.getElementById('ailab-submit-btn');
  var contactForm  = document.getElementById('ailab-contact-form');
  var contactInput = document.getElementById('ailab-field-contact');
  var taskInput    = document.getElementById('ailab-field-task');

  if (submitBtn && contactForm) {
    function isValidContact(val) {
      var v = val.trim();
      // Telegram: @username
      if (/^@[\w]{3,}$/.test(v)) return true;
      // Phone: digits, spaces, dashes, parens, +, min 7 digits total
      var digits = v.replace(/\D/g, '');
      if (digits.length >= 7 && /^[+\d][\d\s\-().]{5,}$/.test(v)) return true;
      return false;
    }

    submitBtn.addEventListener('click', function () {
      var contact = contactInput.value.trim();
      var valid   = true;

      contactInput.classList.remove('is-error');
      taskInput.classList.remove('is-error');

      if (!contact || !isValidContact(contact)) {
        contactInput.classList.add('is-error');
        contactInput.focus();
        valid = false;
      }
      if (!valid) return;

      contactForm.classList.add('is-submitted');
    });

    contactInput.addEventListener('input', function () { contactInput.classList.remove('is-error'); });
    taskInput.addEventListener('input', function () { taskInput.classList.remove('is-error'); });
  }

  // ── Smooth scroll for anchor links ───────────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var href = link.getAttribute('href');
      if (href === '#') return;
      var target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      var headerH = header ? header.offsetHeight : 0;
      var top = target.getBoundingClientRect().top + window.scrollY - headerH - 8;
      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  });

  // ── Cases carousel ────────────────────────────────────────
  (function() {
    var track = document.getElementById('amc-track');
    if (!track) return;
    var total = 7;
    var cur = 0;
    var dots = document.querySelectorAll('#amc-dots .amc-dot');
    var curEl = document.getElementById('amc-cur');
    var startX = 0;

    function goTo(n) {
      cur = (n + total) % total;
      track.style.transform = 'translateX(-' + (cur * 100) + '%)';
      dots.forEach(function(d, i) {
        d.classList.toggle('is-active', i === cur);
        d.setAttribute('aria-selected', i === cur ? 'true' : 'false');
      });
      curEl.textContent = (cur + 1).toString().padStart(2, '0');
    }

    document.getElementById('amc-prev').addEventListener('click', function() { goTo(cur - 1); });
    document.getElementById('amc-next').addEventListener('click', function() { goTo(cur + 1); });

    dots.forEach(function(dot) {
      dot.addEventListener('click', function() { goTo(parseInt(this.dataset.idx)); });
    });

    // Keyboard
    document.getElementById('amc-track').addEventListener('keydown', function(e) {
      if (e.key === 'ArrowLeft')  { e.preventDefault(); goTo(cur - 1); }
      if (e.key === 'ArrowRight') { e.preventDefault(); goTo(cur + 1); }
    });

    // Touch / swipe
    track.addEventListener('touchstart', function(e) { startX = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchend', function(e) {
      var dx = startX - e.changedTouches[0].clientX;
      if (Math.abs(dx) > 50) goTo(dx > 0 ? cur + 1 : cur - 1);
    });
  })();

  // ── Landscape carousel auto-scroll (mobile only) ─────────────────
  (function () {
    var grid = document.getElementById('landscape-grid');
    if (!grid) return;

    var autoTimer = null;

    function isMobile() { return window.innerWidth <= 640; }

    function scrollToNext() {
      if (!isMobile()) return;
      var cols = grid.querySelectorAll('.landscape__col');
      if (!cols.length) return;
      var colW = cols[0].offsetWidth + 12;
      var maxScroll = grid.scrollWidth - grid.clientWidth;
      var next = grid.scrollLeft + colW;
      grid.scrollTo({ left: next >= maxScroll ? 0 : next, behavior: 'smooth' });
    }

    function startAuto() {
      if (autoTimer) return;
      autoTimer = setInterval(scrollToNext, 3000);
    }

    function stopAuto() {
      clearInterval(autoTimer);
      autoTimer = null;
    }

    grid.addEventListener('touchstart', stopAuto, { passive: true });
    grid.addEventListener('touchend', function () {
      setTimeout(startAuto, 4000);
    }, { passive: true });

    if (isMobile()) startAuto();
    window.addEventListener('resize', function () {
      if (isMobile()) startAuto(); else stopAuto();
    });
  })();

  // ── Cases / Products tab switching ───────────────────────────────
  (function () {
    var tabs = document.querySelectorAll('.cases__tab');
    if (!tabs.length) return;
    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        var target = tab.dataset.tab;
        tabs.forEach(function (t) { t.classList.remove('cases__tab--active'); });
        tab.classList.add('cases__tab--active');
        document.querySelectorAll('.cases__pane').forEach(function (pane) {
          pane.classList.add('cases__pane--hidden');
        });
        var pane = document.getElementById('cases-pane-' + target);
        if (pane) pane.classList.remove('cases__pane--hidden');
      });
    });
  })();

})();
