/* Shared behaviour: theme (light paper / night press) + colophon stamps.
   Defaults to light paper, matching the previous site. */
(function () {
  var root = document.documentElement;

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
    if (ts) {
      ts.textContent = d.toISOString().slice(0, 10).replace(/-/g, '.');
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', ready);
  } else {
    ready();
  }
})();
