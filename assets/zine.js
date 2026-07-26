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

  /* ---------- language ----------
     Stored choice wins. Failing that, readers whose browser is not set to
     Chinese get the translation, since they are the ones who need it; the
     Chinese original remains the default everywhere else. Set before first
     paint so neither language flashes. */
  var savedLang = null;
  try { savedLang = localStorage.getItem('lang'); } catch (e) {}

  var lang;
  if (savedLang === 'zh' || savedLang === 'en') {
    lang = savedLang;
  } else {
    var nav = (navigator.language || navigator.userLanguage || 'en').toLowerCase();
    lang = nav.indexOf('zh') === 0 ? 'zh' : 'en';
  }
  root.setAttribute('data-lang', lang);

  function paintLang(next) {
    root.setAttribute('data-lang', next);
    var btn = document.getElementById('langToggle');
    if (btn) {
      btn.innerHTML = next === 'zh'
        ? '<span class="on">中</span> / EN'
        : '中 / <span class="on">EN</span>';
      btn.setAttribute('aria-label',
        next === 'zh' ? 'Switch to English' : '切换到中文');
    }
    // Swap the document title if the page supplies both.
    var b = document.body;
    if (b) {
      var t = b.getAttribute(next === 'zh' ? 'data-title-zh' : 'data-title-en');
      if (t) document.title = t;
    }
  }

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
    ['.plate-fig', 0]          // wipe reveal
    // The portrait (.specimen) is deliberately absent from this list: it should
    // simply be there on load rather than perform an entrance.
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

  /* ---------- eased in-page navigation ----------
     Own the animation rather than leaning on scroll-behavior:smooth, so the
     duration and curve match the rest of the motion. Steps are written with
     behavior:'instant' so the CSS smooth-scroll cannot fight this. */
  var ANCHOR_GAP = 26;   // px of air above an anchored section
  var scrollAnim = null;

  function easeOutQuart(t) { return 1 - Math.pow(1 - t, 4); }

  function glideTo(targetY, done) {
    var startY = window.pageYOffset || root.scrollTop || 0;
    var maxY = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
    var endY = Math.min(Math.max(0, targetY), maxY);
    var dist = endY - startY;

    if (Math.abs(dist) < 2) { if (done) done(); return; }

    // Longer trips take longer, but never crawl and never overstay.
    var dur = Math.min(900, Math.max(420, Math.abs(dist) * 0.55));
    var t0 = (window.performance && performance.now) ? performance.now() : +new Date();
    scrollAnim = (t0 + dur);

    function step(now) {
      var t = Math.min(1, (now - t0) / dur);
      window.scrollTo({ top: startY + dist * easeOutQuart(t), behavior: 'instant' });
      if (t < 1) {
        window.requestAnimationFrame(step);
      } else {
        scrollAnim = null;
        if (done) done();
      }
    }
    window.requestAnimationFrame(step);
  }

  function wireAnchors() {
    document.addEventListener('click', function (e) {
      if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      if (e.button !== undefined && e.button !== 0) return;

      var a = e.target && e.target.closest ? e.target.closest('a[href]') : null;
      if (!a) return;

      var href = a.getAttribute('href') || '';
      if (href.charAt(0) !== '#' || href.length < 2) return;   // same-page only

      var el = document.getElementById(href.slice(1));
      if (!el) return;

      e.preventDefault();
      var top = el.getBoundingClientRect().top + (window.pageYOffset || 0) - ANCHOR_GAP;
      glideTo(top, function () {
        // Keep the URL shareable and move focus for keyboard users, without
        // letting focus() perform a second jump.
        try { history.replaceState(null, '', href); } catch (err) {}
        if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '-1');
        try { el.focus({ preventScroll: true }); } catch (err) {}
      });
    }, false);
  }

  /* Off-register drift on the wordmark, reading progress on post pages, and
     the section index. One rAF-coalesced passive scroll handler drives all
     three; it writes custom properties and one attribute, so no layout thrash. */
  function scrollEffects() {
    var wordmark = document.querySelector('.wordmark');
    var article  = document.querySelector('.post-content');
    var sidenav  = document.querySelector('.sidenav');
    var navLinks = sidenav ? sidenav.querySelectorAll('a[href^="#"]') : [];
    var sections = [];

    for (var i = 0; i < navLinks.length; i++) {
      var sec = document.getElementById(navLinks[i].getAttribute('href').slice(1));
      if (sec) sections.push({ link: navLinks[i], el: sec });
    }
    var activeIdx = -1;

    var rule = null;
    if (article) {
      rule = document.createElement('div');
      rule.className = 'progress-rule';
      rule.setAttribute('aria-hidden', 'true');
      document.body.appendChild(rule);
    }
    if (!wordmark && !rule && !sections.length) return;

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

      if (sections.length) {
        // Active = the last section whose top has passed a line a third of
        // the way down the viewport. At the very bottom, force the last one so
        // short trailing sections can still be reached.
        var line = y + window.innerHeight * 0.34;
        var idx = 0;
        for (var j = 0; j < sections.length; j++) {
          if (sections[j].el.getBoundingClientRect().top + y <= line) idx = j;
        }
        if (y + window.innerHeight >= document.documentElement.scrollHeight - 4) {
          idx = sections.length - 1;
        }
        if (idx !== activeIdx) {
          if (activeIdx >= 0) sections[activeIdx].link.removeAttribute('aria-current');
          sections[idx].link.setAttribute('aria-current', 'true');
          activeIdx = idx;
        }

        if (sidenav) {
          // Hold the index back until the poster has been scrolled past.
          var show = y > window.innerHeight * 0.42;
          sidenav.classList[show ? 'add' : 'remove']('is-visible');
        }
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

  /* Copy-to-clipboard for the citation blocks. Async clipboard where
     available, with the legacy textarea path for older/insecure contexts. */
  function wireCopyButtons() {
    var btns = document.querySelectorAll('.copy-btn[data-copy]');

    function legacyCopy(text) {
      var ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.cssText = 'position:absolute;left:-9999px;top:0';
      document.body.appendChild(ta);
      ta.select();
      var ok = false;
      try { ok = document.execCommand('copy'); } catch (e) {}
      document.body.removeChild(ta);
      return ok;
    }

    function feedback(btn, ok) {
      var prev = btn.getAttribute('data-label') || btn.textContent;
      btn.setAttribute('data-label', prev);
      btn.textContent = ok ? 'copied' : 'select & copy';
      btn.setAttribute('data-state', ok ? 'done' : '');
      window.setTimeout(function () {
        btn.textContent = btn.getAttribute('data-label');
        btn.removeAttribute('data-state');
      }, 1800);
    }

    for (var i = 0; i < btns.length; i++) {
      btns[i].addEventListener('click', function () {
        var btn = this;
        var src = document.getElementById(btn.getAttribute('data-copy'));
        if (!src) return;
        var text = src.textContent.replace(/\s+$/, '');

        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(text).then(
            function () { feedback(btn, true); },
            function () { feedback(btn, legacyCopy(text)); }
          );
        } else {
          feedback(btn, legacyCopy(text));
        }
      });
    }
  }

  /* ---------- boot ---------- */
  function ready() {
    paint(initial);
    paintLang(lang);

    var langBtn = document.getElementById('langToggle');
    if (langBtn) {
      langBtn.addEventListener('click', function () {
        var next = root.getAttribute('data-lang') === 'zh' ? 'en' : 'zh';
        try { localStorage.setItem('lang', next); } catch (e) {}
        paintLang(next);
      });
    }

    wireCopyButtons();

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
      wireAnchors();
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
