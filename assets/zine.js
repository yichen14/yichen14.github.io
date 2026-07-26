/* Shared behaviour: theme (light paper / night press), colophon stamps,
   and the scroll motion layer.

   Motion contract: every hidden-until-revealed state in the stylesheet is
   scoped to html[data-motion="on"], and only this file sets that flag. If
   this script fails, is blocked, or the reader prefers reduced motion, the
   flag is never set (or is removed) and the page renders fully visible.
   Content must never depend on JS to appear. */
(function () {
  var root = document.documentElement;

  var reduced = false;
  try {
    reduced = window.matchMedia &&
              window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch (e) {}

  var canMove = !reduced &&
                'IntersectionObserver' in window &&
                'requestAnimationFrame' in window;

  /* Set the flag before first paint so revealed elements never flash
     visible and then hide. Removed again if wiring up fails. */
  if (canMove) root.setAttribute('data-motion', 'on');

  /* ---------- theme ---------- */
  function paint(theme) {
    var icon = document.getElementById('themeIcon');
    var text = document.getElementById('themeText');
    if (icon) icon.textContent = theme === 'dark' ? '☀' : '☾';
    if (text) text.textContent = theme === 'dark' ? 'paper' : 'press';
  }

  var saved = null;
  try { saved = localStorage.getItem('theme'); } catch (e) {}
  var initial = saved === 'dark' || saved === 'light' ? saved : 'light';
  root.setAttribute('data-theme', initial);

  /* ---------- motion ---------- */

  // Which things settle into place, and in what grouping they stagger.
  var REVEAL = [
    ['.leaf', 0],              // whole section
    ['.leaf > .rail', 0],      // its marginalia (CSS adds a 90ms trail)
    ['.plate', 70],            // publication entries, printed one by one
    ['.diary-item', 70],       // notebook entries
    ['.figure', 0],
    ['.callout', 0],
    ['.post-content h2', 0],
    ['.plate-fig', 0],         // wipe reveal
    ['.specimen', 0]
  ];

  function markReveals() {
    REVEAL.forEach(function (pair) {
      var nodes = document.querySelectorAll(pair[0]);
      var step = pair[1];
      for (var i = 0; i < nodes.length; i++) {
        nodes[i].setAttribute('data-reveal', '');
        if (step) {
          // Stagger caps out so a long list never crawls in.
          nodes[i].style.setProperty(
            '--reveal-delay', Math.min(i * step, 280) + 'ms'
          );
        }
      }
    });
  }

  function observeReveals() {
    var targets = document.querySelectorAll('[data-reveal]');
    if (!targets.length) return;

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        el.classList.add('is-in');
        io.unobserve(el);                       // reveal once, never re-hide
        // Drop the compositor hint after the longest transition.
        window.setTimeout(function () { el.classList.add('is-done'); }, 1100);
      });
    }, {
      // Trigger a little before the element's top edge arrives, and allow
      // anything already on screen at load to reveal immediately.
      rootMargin: '0px 0px -12% 0px',
      threshold: 0.01
    });

    for (var i = 0; i < targets.length; i++) io.observe(targets[i]);
  }

  /* Off-register drift on the wordmark + reading progress on post pages.
     One rAF-coalesced passive scroll handler drives both; it only ever
     writes two custom properties, so there is no layout thrash. */
  function scrollEffects() {
    var wordmark = document.querySelector('.wordmark');
    var article  = document.querySelector('.post-content');

    var rule = null;
    if (article) {
      rule = document.createElement('div');
      rule.className = 'progress-rule';
      rule.setAttribute('aria-hidden', 'true');
      document.body.appendChild(rule);
    }
    if (!wordmark && !rule) return;

    var queued = false;

    function apply() {
      queued = false;
      var y = window.pageYOffset || root.scrollTop || 0;

      if (wordmark) {
        // 0 -> 4px of slip over the first 600px of scroll.
        var slip = Math.min(y / 600, 1) * 4;
        wordmark.style.setProperty('--scroll-slip', slip.toFixed(2) + 'px');
      }

      if (rule) {
        var box   = article.getBoundingClientRect();
        var start = box.top + y;                       // article top in doc space
        var span  = Math.max(box.height - window.innerHeight, 1);
        var read  = (y - start) / span;
        read = read < 0 ? 0 : read > 1 ? 1 : read;
        rule.style.setProperty('--read', read.toFixed(4));
      }
    }

    function onScroll() {
      if (queued) return;
      queued = true;
      window.requestAnimationFrame(apply);
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    apply();
  }

  /* ---------- boot ---------- */
  function ready() {
    paint(initial);

    var toggle = document.getElementById('themeToggle');
    if (toggle) {
      toggle.addEventListener('click', function () {
        var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        root.setAttribute('data-theme', next);
        try { localStorage.setItem('theme', next); } catch (e) {}
        paint(next);
      });
    }

    var d = new Date();
    var year = document.getElementById('year');
    if (year) year.textContent = d.getFullYear();

    var ts = document.getElementById('ts');
    if (ts) ts.textContent = d.toISOString().slice(0, 10).replace(/-/g, '.');

    if (!canMove) return;

    try {
      markReveals();
      observeReveals();
      scrollEffects();
    } catch (e) {
      // Anything unexpected: drop the flag so the stylesheet stops hiding
      // content, and strip the hooks that were already applied.
      root.removeAttribute('data-motion');
      var stuck = document.querySelectorAll('[data-reveal]');
      for (var i = 0; i < stuck.length; i++) {
        stuck[i].removeAttribute('data-reveal');
      }
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', ready);
  } else {
    ready();
  }

  /* Last-resort net: if anything is still hidden a few seconds in, show it.
     Cheap insurance against a reader staring at blank paper. */
  window.setTimeout(function () {
    if (root.getAttribute('data-motion') !== 'on') return;
    var hidden = document.querySelectorAll('[data-reveal]:not(.is-in)');
    for (var i = 0; i < hidden.length; i++) {
      var b = hidden[i].getBoundingClientRect();
      if (b.top < window.innerHeight && b.bottom > 0) hidden[i].classList.add('is-in');
    }
  }, 3000);
})();
