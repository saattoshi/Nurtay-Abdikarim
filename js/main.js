/* =============================================
   SIYAR LAW — main.js
   Each feature is its own named function.
   Call them all at the bottom of this file.
   ============================================= */


/* True when the user has asked the OS for reduced motion. */
function prefersReducedMotion() {
  return window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}


/* =============================================
   0. HERO LOAD SEQUENCE
   Adds .is-loaded to the hero so its content settles
   in order (eyebrow → rule → headline → subtext → CTA).
   The CSS handles the actual staggered transitions.
   ============================================= */
function initHeroLoad() {
  var hero = document.getElementById('hero');
  if (!hero) return;

  // Wait one frame so the browser registers the start state, then animate.
  requestAnimationFrame(function () {
    requestAnimationFrame(function () {
      hero.classList.add('is-loaded');
    });
  });
}


/* =============================================
   1. LANGUAGE TOGGLE (Russian / Kazakh)
   Reads data-ru / data-kz attributes on elements
   and swaps all visible text at once.
   ============================================= */
function initLanguageToggle() {
  var btnRu = document.getElementById('btn-ru');
  var btnKz = document.getElementById('btn-kz');

  // Figure out which language was last used, default to Russian
  var currentLang = localStorage.getItem('siyar-lang') || 'ru';
  applyLanguage(currentLang);

  btnRu.addEventListener('click', function () {
    applyLanguage('ru');
  });

  btnKz.addEventListener('click', function () {
    applyLanguage('kz');
  });

  // Swap all text nodes and update button states
  function applyLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('siyar-lang', lang);

    // Find every element that has a data-ru attribute (all translatable elements)
    var elements = document.querySelectorAll('[data-ru]');
    elements.forEach(function (el) {
      var text = el.getAttribute('data-' + lang);
      if (text) {
        el.textContent = text;
      }
    });

    // Update button active states
    if (lang === 'ru') {
      btnRu.classList.add('lang-btn--active');
      btnKz.classList.remove('lang-btn--active');
      btnRu.setAttribute('aria-pressed', 'true');
      btnKz.setAttribute('aria-pressed', 'false');
      document.documentElement.setAttribute('lang', 'ru');
    } else {
      btnKz.classList.add('lang-btn--active');
      btnRu.classList.remove('lang-btn--active');
      btnKz.setAttribute('aria-pressed', 'true');
      btnRu.setAttribute('aria-pressed', 'false');
      document.documentElement.setAttribute('lang', 'kk');
    }
  }
}


/* =============================================
   2. STICKY NAV
   Adds a .scrolled class to the header once the
   user scrolls past the hero. This triggers the
   dark background in CSS.
   ============================================= */
function initStickyNav() {
  var header = document.getElementById('site-header');
  var hero   = document.getElementById('hero');

  function checkScroll() {
    // Get how tall the hero is, then watch if we've scrolled past it
    var heroBottom = hero.getBoundingClientRect().bottom;
    if (heroBottom <= 0) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', checkScroll, { passive: true });
  checkScroll(); // run once on load in case page is already scrolled
}


/* =============================================
   3. MOBILE MENU
   Toggles the mobile dropdown when the
   hamburger button is clicked.
   ============================================= */
function initMobileMenu() {
  var hamburger  = document.getElementById('nav-hamburger');
  var mobileMenu = document.getElementById('mobile-menu');

  if (!hamburger || !mobileMenu) return;

  hamburger.addEventListener('click', function () {
    var isOpen = mobileMenu.classList.contains('is-open');

    if (isOpen) {
      mobileMenu.classList.remove('is-open');
      hamburger.classList.remove('is-open');
      hamburger.setAttribute('aria-expanded', 'false');
      mobileMenu.setAttribute('aria-hidden', 'true');
    } else {
      mobileMenu.classList.add('is-open');
      hamburger.classList.add('is-open');
      hamburger.setAttribute('aria-expanded', 'true');
      mobileMenu.setAttribute('aria-hidden', 'false');
    }
  });

  // Close the menu when a link inside it is clicked
  var mobileLinks = mobileMenu.querySelectorAll('.mobile-nav-link, .mobile-cta');
  mobileLinks.forEach(function (link) {
    link.addEventListener('click', function () {
      mobileMenu.classList.remove('is-open');
      hamburger.classList.remove('is-open');
      hamburger.setAttribute('aria-expanded', 'false');
      mobileMenu.setAttribute('aria-hidden', 'true');
    });
  });
}


/* =============================================
   4. FAQ ACCORDION
   Opens and closes FAQ answer panels.
   Only one item is open at a time.
   ============================================= */
function initFAQAccordion() {
  var faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(function (item) {
    var questionBtn = item.querySelector('.faq-question');

    questionBtn.addEventListener('click', function () {
      var isAlreadyOpen = item.classList.contains('is-open');

      // Close all items first
      faqItems.forEach(function (otherItem) {
        otherItem.classList.remove('is-open');
        otherItem.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
      });

      // If the clicked item was closed, open it now
      if (!isAlreadyOpen) {
        item.classList.add('is-open');
        questionBtn.setAttribute('aria-expanded', 'true');
      }
    });
  });
}


/* =============================================
   5. SCROLL REVEAL
   Watches elements with class .reveal-item and
   adds .is-visible when they enter the viewport.
   Uses IntersectionObserver (no library needed).
   ============================================= */
function initScrollReveal() {
  // If the browser doesn't support IntersectionObserver, just show everything
  if (!('IntersectionObserver' in window)) {
    document.querySelectorAll('.reveal-item').forEach(function (el) {
      el.classList.add('is-visible');
    });
    return;
  }

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          // Stop watching this element once it's visible
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1,    // trigger when 10% of the element is visible
      rootMargin: '0px 0px -40px 0px' // trigger slightly before the full bottom edge
    }
  );

  document.querySelectorAll('.reveal-item').forEach(function (el) {
    observer.observe(el);
  });
}


/* =============================================
   6. STAT COUNTER ANIMATION
   Counts up numbers in the About section stats
   when they scroll into view.
   ============================================= */
function initStatCounters() {
  var statNumbers = document.querySelectorAll('.stat-number');

  // No IntersectionObserver, or the user prefers reduced motion:
  // skip the count-up and show the final number straight away.
  if (!('IntersectionObserver' in window) || prefersReducedMotion()) {
    statNumbers.forEach(function (el) {
      el.textContent = el.getAttribute('data-target');
    });
    return;
  }

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  statNumbers.forEach(function (el) {
    observer.observe(el);
  });

  // Counts from 0 to the data-target value over ~1.2 seconds
  function animateCounter(el) {
    var target   = parseInt(el.getAttribute('data-target'), 10);
    var duration = 1200; // milliseconds
    var start    = null;

    function step(timestamp) {
      if (!start) start = timestamp;
      var progress = Math.min((timestamp - start) / duration, 1);
      // Ease-out curve so it decelerates near the end
      var easedProgress = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(easedProgress * target);
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = target;
      }
    }

    requestAnimationFrame(step);
  }
}


/* =============================================
   7. CERTIFICATE SLIDER
   Shows 3 cards at once on desktop (prev, active,
   next). On mobile only the active card is visible.
   Controlled with left/right arrows and dot buttons.
   ============================================= */
function initCertSlider() {
  var slides        = document.querySelectorAll('.cert-slide');
  var prevBtn       = document.getElementById('cert-prev');
  var nextBtn       = document.getElementById('cert-next');
  var dotsContainer = document.getElementById('cert-dots');

  if (!slides.length || !prevBtn || !nextBtn) return;

  var current = 0;
  var total   = slides.length;

  // Build one dot per slide and wire up click handlers
  slides.forEach(function (_, index) {
    var dot = document.createElement('button');
    dot.className = 'cert-dot';
    dot.setAttribute('aria-label', 'Сертификат ' + (index + 1));
    dot.setAttribute('role', 'listitem');
    dot.addEventListener('click', function () {
      goTo(index);
    });
    dotsContainer.appendChild(dot);
  });

  // Move to a specific slide index (wraps around)
  function goTo(index) {
    current = (index + total) % total;

    var prevIndex = (current - 1 + total) % total;
    var nextIndex = (current + 1) % total;

    // Assign state classes to each slide
    slides.forEach(function (slide, i) {
      slide.classList.remove('is-active', 'is-prev', 'is-next', 'is-hidden');

      if (i === current)   { slide.classList.add('is-active'); }
      else if (i === prevIndex) { slide.classList.add('is-prev'); }
      else if (i === nextIndex) { slide.classList.add('is-next'); }
      else                 { slide.classList.add('is-hidden'); }
    });

    // Sync dot active state
    var dots = dotsContainer.querySelectorAll('.cert-dot');
    dots.forEach(function (dot, i) {
      dot.classList.toggle('is-active', i === current);
    });
  }

  prevBtn.addEventListener('click', function () { goTo(current - 1); });
  nextBtn.addEventListener('click', function () { goTo(current + 1); });

  // Start on the first slide
  goTo(0);
}


/* =============================================
   8. SMOOTH SCROLL FOR NAV LINKS
   Offsets the scroll position by the nav height
   so sections don't hide under the sticky header.
   ============================================= */
function initSmoothScroll() {
  var navHeight = document.getElementById('site-header').offsetHeight;

  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var targetId = link.getAttribute('href');
      if (targetId === '#') return; // skip "#" links

      var targetEl = document.querySelector(targetId);
      if (!targetEl) return;

      e.preventDefault();

      var targetTop = targetEl.getBoundingClientRect().top + window.scrollY - navHeight;
      window.scrollTo({ top: targetTop, behavior: 'smooth' });
    });
  });
}


/* =============================================
   INIT — run everything once the page is ready
   ============================================= */
document.addEventListener('DOMContentLoaded', function () {
  initLanguageToggle();
  initHeroLoad();
  initStickyNav();
  initMobileMenu();
  initFAQAccordion();
  initScrollReveal();
  initStatCounters();
  initCertSlider();
  initSmoothScroll();
});
