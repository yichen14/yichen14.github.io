/* Interactive figures for "Reading Sound Without Ears" (posts/reading-sound-without-ears.html).
   Data comes from data.js (window.RSWE). Every visible label is emitted in both languages as
   data-i18n pairs, so zine.css shows the active one and the 中/EN toggle needs no extra code.
   Styling lives in assets/zine.css, section 17 (interactive figures). */
(function () {
  'use strict';
  var D = window.RSWE;
  if (!D) return;

  var $ = function (s, r) { return (r || document).querySelector(s); };
  function el(tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  function bi(zh, en) { return '<span data-i18n="zh" lang="zh-Hans">' + zh + '</span><span data-i18n="en" lang="en">' + en + '</span>'; }
  function pct(v, d) { return v.toFixed(d == null ? 1 : d) + '%'; }

  /* ---------- tooltip ---------- */
  var tip = el('div', 'fig-tip'); tip.setAttribute('role', 'tooltip'); document.body.appendChild(tip);
  function moveTip(e) { var w = tip.offsetWidth, h = tip.offsetHeight, x = e.clientX + 14, y = e.clientY + 14; if (x + w > innerWidth - 8) x = e.clientX - w - 14; if (y + h > innerHeight - 8) y = e.clientY - h - 14; tip.style.left = x + 'px'; tip.style.top = y + 'px'; }
  function hover(node, html) {
    node.addEventListener('pointerenter', function (e) { tip.innerHTML = html; tip.classList.add('is-on'); moveTip(e); });
    node.addEventListener('pointermove', moveTip);
    node.addEventListener('pointerleave', function () { tip.classList.remove('is-on'); });
  }

  var COND = {
    A: ['只看题目', 'question only'], L: ['+ 片段时长', '+ clip length'], B: ['+ 频谱图', '+ spectrogram'],
    E: ['+ 频谱查询工具', '+ spectrogram tool'], D: ['+ 转写', '+ transcript'], C: ['+ 频谱图与转写', '+ spectrogram & transcript']
  };
  var ORDER = ['A', 'L', 'B', 'E', 'D', 'C'];
  var MODEL = { opus: 'Opus 5.5', fable: 'Fable 5.2' };
  var TASK = { sound: ['声音', 'Sound'], music: ['音乐', 'Music'], speech: ['语音', 'Speech'] };

  function legend(extraZh, extraEn) {
    var l = el('div', 'fig-legend');
    l.innerHTML = '<span><i class="fig-key o"></i>Opus 5.5</span><span><i class="fig-key f"></i>Fable 5.2</span>' + (extraZh ? '<span class="fig-legend-note">' + bi(extraZh, extraEn) + '</span>' : '');
    return l;
  }
  function axis(ticks, pos, fmt, marginLeft) {
    var ax = el('div', 'fig-axis'); if (marginLeft) ax.style.marginLeft = marginLeft;
    ticks.forEach(function (v) { var s = el('span', null, fmt(v)); s.style.left = pos(v) + '%'; ax.appendChild(s); });
    return ax;
  }

  /* ---------- Figure 2: accuracy by condition ---------- */
  (function () {
    var root = $('#fig-main'); if (!root) return;
    var X0 = 20, X1 = 98, px = function (v) { return (v - X0) / (X1 - X0) * 100; };
    root.appendChild(legend('虚线：随机 25.5% · 人类 82.2%', 'dashed: random 25.5% · human 82.2%'));
    var g = el('div', 'fig-bars');
    ORDER.forEach(function (c) {
      var o = D.res.opus[c], f = D.res.fable[c]; if (!o || !f) return;
      g.appendChild(el('div', 'fig-lab', '<b>' + c + '</b> <small>' + bi(COND[c][0], COND[c][1]) + '</small>'));
      var t = el('div', 'fig-track');
      [25.5, 82.2].forEach(function (v) { var r = el('div', 'fig-ref'); r.style.left = px(v) + '%'; t.appendChild(r); });
      [['o', o.all, 'opus'], ['f', f.all, 'fable']].forEach(function (a) {
        var b = el('div', 'fig-bar ' + a[0]); b.style.width = px(a[1]) + '%'; t.appendChild(b);
        var s = el('div', 'fig-val ' + a[0], pct(a[1])); s.style.left = 'calc(' + px(a[1]) + '% + 6px)'; t.appendChild(s);
        hover(b, '<b>' + MODEL[a[2]] + ' · ' + c + '</b><br>' + bi(COND[c][0], COND[c][1]) + '<br>' + bi('1,000 题中答对 ' + pct(a[1]), pct(a[1]) + ' of 1,000 questions'));
      });
      g.appendChild(t);
    });
    root.appendChild(g);
    root.appendChild(axis([20, 30, 40, 50, 60, 70, 80, 90], px, function (v) { return v + '%'; }));
  })();

  /* ---------- Figure 3: by domain ---------- */
  (function () {
    var root = $('#fig-tasks'); if (!root) return;
    var X0 = 20, X1 = 90, px = function (v) { return (v - X0) / (X1 - X0) * 100; };
    var human = { sound: 86.3, music: 78.2, speech: 82.2 };
    root.appendChild(legend('虚线：人类', 'dashed: human listeners'));
    var m = el('div', 'fig-multiples');
    ['sound', 'music', 'speech'].forEach(function (task) {
      var box = el('div', 'fig-mini');
      box.appendChild(el('h4', null, bi(TASK[task][0], TASK[task][1]) + ' <small>n = ' + D.n[task] + '</small>'));
      var g = el('div', 'fig-mb');
      ORDER.forEach(function (c) {
        var o = D.res.opus[c], f = D.res.fable[c]; if (!o || !f) return;
        g.appendChild(el('div', null, c));
        var t = el('div', 'fig-t2'); var r = el('div', 'fig-ref'); r.style.left = px(human[task]) + '%'; t.appendChild(r);
        [['o', o[task], 'opus'], ['f', f[task], 'fable']].forEach(function (a) {
          var b = el('div', 'fig-bar ' + a[0]); b.style.width = px(a[1]) + '%'; t.appendChild(b);
          hover(b, '<b>' + MODEL[a[2]] + ' · ' + c + '</b> · ' + bi(TASK[task][0], TASK[task][1]) + '<br>' + pct(a[1]) + '<br>' + bi('人类：', 'human: ') + human[task] + '%');
        });
        g.appendChild(t);
      });
      box.appendChild(g);
      box.appendChild(axis([20, 50, 80], px, function (v) { return v + '%'; }, '26px'));
      m.appendChild(box);
    });
    root.appendChild(m);
  })();

  /* ---------- Figure 4: accuracy by number of tool calls ---------- */
  (function () {
    var root = $('#fig-tools'); if (!root) return;
    var sc = function (v) { return v * 0.72; };
    root.appendChild(legend());
    var g = el('div', 'fig-bars');
    D.tools.opus.forEach(function (o, i) {
      var f = D.tools.fable[i];
      g.appendChild(el('div', 'fig-lab', '<b>' + o.k + '</b> <small>' + bi('次调用', 'tool calls') + '</small>'));
      var t = el('div', 'fig-track');
      [['o', o, 'opus'], ['f', f, 'fable']].forEach(function (a) {
        var d = a[1];
        var b = el('div', 'fig-bar ' + a[0]); b.style.width = sc(d.acc) + '%'; t.appendChild(b);
        var s = el('div', 'fig-val ' + a[0], d.acc.toFixed(0) + '%  (n=' + d.n + ')'); s.style.left = 'calc(' + sc(d.acc) + '% + 6px)'; t.appendChild(s);
        hover(b, '<b>' + MODEL[a[2]] + '</b> · ' + bi(o.k + ' 次调用', o.k + ' tool calls') + '<br>' + bi(d.n + ' 题，答对 ' + pct(d.acc), d.n + ' questions, ' + pct(d.acc) + ' correct'));
      });
      g.appendChild(t);
    });
    root.appendChild(g);
    root.appendChild(axis([0, 25, 50, 75, 100], sc, function (v) { return v + '%'; }));
  })();

  /* ---------- Figure 5: timing vs sound quality (diverging) ---------- */
  (function () {
    var root = $('#fig-split'); if (!root || !D.split) return;
    var LO = -30, HI = 55, pos = function (v) { return (v - LO) / (HI - LO) * 100; }, z = pos(0);
    var CN = { B: ['图片 (B)', 'picture (B)'], E: ['数值工具 (E)', 'numeric tool (E)'] };
    root.appendChild(legend('条：相对"只给时长"(L) 的增减（百分点）', 'bars: points gained or lost vs. clip length only (L)'));
    D.split.forEach(function (g) {
      var box = el('div', 'fig-split-grp');
      box.appendChild(el('h4', null, bi(g.labelZh, g.label) + ' <small>· ' + bi(g.subZh, g.sub) + ' · n = ' + g.n + '</small>'));
      var rows = el('div', 'fig-bars fig-bars-tight');
      g.rows.forEach(function (r) {
        var d = Math.round((r.to - r.from) * 10) / 10;
        var k = r.m === 'opus' ? 'o' : 'f';
        rows.appendChild(el('div', 'fig-lab', MODEL[r.m].split(' ')[0] + ' · ' + bi(CN[r.c][0], CN[r.c][1])));
        var t = el('div', 'fig-dtrack'); var zl = el('div', 'fig-zero'); zl.style.left = z + '%'; t.appendChild(zl);
        var b = el('div', 'fig-bar ' + k); b.style.left = Math.min(z, pos(d)) + '%'; b.style.width = Math.abs(pos(d) - z) + '%'; t.appendChild(b);
        var longTxt = (d > 0 ? '+' : '') + d.toFixed(1) + '  (' + Math.round(r.from) + '→' + Math.round(r.to) + '%' + (r.p !== 'n.s.' ? ', p' + r.p : '') + ')';
        var shortTxt = (d > 0 ? '+' : '') + d.toFixed(1) + (r.p !== 'n.s.' ? ' (p' + r.p + ')' : '');
        var v = el('div', 'fig-val ' + k, longTxt); v.dataset.long = longTxt; v.dataset.short = shortTxt;
        if (d >= 0) v.style.left = 'calc(' + pos(d) + '% + 6px)'; else v.style.right = 'calc(' + (100 - pos(d)) + '% + 6px)';
        t.appendChild(v);
        hover(b, '<b>' + MODEL[r.m] + ' · ' + bi(CN[r.c][0], CN[r.c][1]) + '</b><br>' + bi(g.labelZh, g.label) + ' (n = ' + g.n + ')<br>L ' + r.from + '% → ' + r.to + '%<br>' +
          bi('多对 ' + r.gain + ' 题，多错 ' + r.loss + ' 题', r.gain + ' gained, ' + r.loss + ' lost') + ' · p ' + r.p);
        rows.appendChild(t);
      });
      box.appendChild(rows); root.appendChild(box);
    });
    root.appendChild(axis([-30, -20, -10, 0, 10, 20, 30, 40, 50], pos, function (v) { return (v > 0 ? '+' : '') + v; }));
    function fit() {
      var p = root.getBoundingClientRect();
      root.querySelectorAll('.fig-dtrack .fig-val').forEach(function (v) {
        v.textContent = v.dataset.long; var r = v.getBoundingClientRect();
        if (r.right > p.right - 4 || r.left < p.left + 4) v.textContent = v.dataset.short;
      });
    }
    requestAnimationFrame(fit); addEventListener('resize', fit);
  })();

  /* ---------- Figure 6: heat table by sub-skill ---------- */
  (function () {
    var t = $('#fig-heat'); if (!t) return;
    var th = el('tr'); th.appendChild(el('th', null, bi('子技能', 'Sub-skill'))); th.appendChild(el('th', null, 'n'));
    D.heatCols.forEach(function (c) { th.appendChild(el('th', null, esc(c.label))); });
    t.appendChild(el('thead')).appendChild(th);
    var tb = el('tbody'); t.appendChild(tb); var maxAbs = 45;
    D.heat.forEach(function (r) {
      var tr = el('tr');
      tr.appendChild(el('td', 'fig-heat-name', bi(r.taskZh + ' · ' + r.nameZh, r.task + ' · ' + esc(r.name))));
      tr.appendChild(el('td', null, String(r.n)));
      D.heatCols.forEach(function (c, i) {
        var d = r.d[i], td = el('td', 'fig-heat-cell'), s = el('span', null, (d > 0 ? '+' : '') + d.toFixed(0));
        var a = Math.min(1, Math.abs(d) / maxAbs);
        if (d !== 0) {
          s.style.background = 'color-mix(in srgb, ' + (d > 0 ? 'var(--cobalt)' : 'var(--ink)') + ' ' + Math.round(a * (d > 0 ? 80 : 62)) + '%, transparent)';
          if (a > 0.5) s.style.color = 'var(--paper)';
        }
        td.appendChild(s); tr.appendChild(td);
        hover(td, '<b>' + bi(r.nameZh, esc(r.name)) + '</b><br>' + esc(c.label) + ': ' + r.from[i] + '% → ' + r.to[i] + '%<br>' + (d > 0 ? '+' : '') + d.toFixed(1) + bi(' 个百分点', ' points') + ' (n = ' + r.n + ')');
      });
      tb.appendChild(tr);
    });
  })();

  /* ---------- tool-call trace ---------- */
  (function () { var t = $('#fig-trace-0001'); if (t && D.trace) t.textContent = D.trace; })();

  /* ---------- audio examples: draggable spectrogram players ---------- */
  var current = null;
  function fmt(s) { s = Math.max(0, s); return Math.floor(s / 60) + ':' + (s % 60).toFixed(1).padStart(4, '0'); }
  var SAID = { zh: '模型说它在频谱图里看到了什么（英文原文）', en: 'What the models said they saw in the spectrogram' };
  document.querySelectorAll('.spec-ex[data-id]').forEach(function (box) {
    var d = D.ex[box.dataset.id]; if (!d) { box.textContent = 'missing ' + box.dataset.id; return; }
    var head = el('div', 'spec-head');
    head.appendChild(el('span', 'spec-q', esc(d.question)));
    head.appendChild(el('span', 'spec-id', bi(d.taskZh + ' · ' + d.subZh, d.task + ' · ' + esc(d.sub)) + ' · ' + d.id + ' · ' + d.dur.toFixed(1) + ' s'));
    box.appendChild(head);
    var ul = el('ul', 'spec-opts');
    d.choices.forEach(function (c, i) { var L = 'ABCDEFGH'[i]; var li = el('li', d.gold.indexOf(L) >= 0 ? 'is-gold' : '', '(' + L + ') ' + esc(c) + (d.gold.indexOf(L) >= 0 ? ' <em>' + bi('✓ 正确', '✓ correct') + '</em>' : '')); ul.appendChild(li); });
    box.appendChild(ul);

    var pl = el('div', 'spec-player');
    var yax = el('div', 'spec-yax'); pl.appendChild(yax);
    var stage = el('div', 'spec-stage'); stage.tabIndex = 0; stage.setAttribute('role', 'slider');
    stage.setAttribute('aria-label', 'Playback position for ' + d.id + '; drag or use arrow keys');
    stage.setAttribute('aria-valuemin', '0'); stage.setAttribute('aria-valuemax', d.dur.toFixed(1));
    var img = el('img'); img.alt = 'Spectrogram of ' + d.id; img.draggable = false; img.decoding = 'async'; img.loading = 'lazy'; stage.appendChild(img);
    var ann = el('div', 'spec-ann'); stage.appendChild(ann);
    var played = el('div', 'spec-played'); stage.appendChild(played);
    var headLine = el('div', 'spec-head-line'); stage.appendChild(headLine);
    pl.appendChild(stage);
    var xax = el('div', 'spec-xax'); pl.appendChild(xax);
    var step = d.dur > 20 ? 5 : d.dur > 8 ? 2 : 1;
    for (var tt = 0; tt <= d.dur + 1e-6; tt += step) { var s = el('span', null, tt + 's'); s.style.left = (tt / d.dur * 100) + '%'; xax.appendChild(s); }
    var ctrl = el('div', 'spec-ctrl');
    var play = el('button', 'spec-play', bi('▶ 播放', '▶ Play')); play.type = 'button';
    var time = el('span', 'spec-time', '0:00.0 / ' + fmt(d.dur));
    var vFull = el('button', null, '0–8 kHz'), vLow = el('button', null, bi('0–2 kHz 放大', '0–2 kHz zoom')), vAnn = el('button', null, bi('模型标注', 'Model marks'));
    [vFull, vLow, vAnn].forEach(function (b) { b.type = 'button'; });
    ctrl.appendChild(play); ctrl.appendChild(time); ctrl.appendChild(el('span', 'spec-sp')); ctrl.appendChild(vFull); ctrl.appendChild(vLow); ctrl.appendChild(vAnn);
    pl.appendChild(ctrl); box.appendChild(pl);

    var audio = new Audio(); audio.preload = 'none'; audio.src = d.audio;
    var view = d.view || 'full', showAnn = true;
    function lab(m, i) { return m.length > i + 1 ? bi(esc(m[i + 1]), esc(m[i])) : esc(m[i]); }
    function drawAnn() {
      ann.innerHTML = ''; var fmax = view === 'full' ? 8000 : 2000;
      (d.marks.spans || []).forEach(function (m) { var a = el('div', 'ann-sp'); a.style.left = (m[0] / d.dur * 100) + '%'; a.style.width = ((m[1] - m[0]) / d.dur * 100) + '%'; if (m[2]) a.appendChild(el('i', null, lab(m, 2))); ann.appendChild(a); });
      (d.marks.points || []).forEach(function (m) { var a = el('div', 'ann-pt'); a.style.left = (m[0] / d.dur * 100) + '%'; if (m[1]) a.appendChild(el('i', null, lab(m, 1))); ann.appendChild(a); });
      // alternate horizontal-line labels between the right and left edge so close lines do not overlap
      (d.marks.hlines || []).forEach(function (m, i) { if (m[0] > fmax) return; var a = el('div', 'ann-hl'); a.style.top = ((1 - m[0] / fmax) * 100) + '%'; if (m[1]) { var lb = el('i', null, lab(m, 1)); if (i % 2) { lb.style.right = 'auto'; lb.style.left = '4px'; } a.appendChild(lb); } ann.appendChild(a); });
    }
    function setView(v) {
      view = v; img.src = v === 'full' ? d.full : d.low;
      vFull.setAttribute('aria-pressed', v === 'full'); vLow.setAttribute('aria-pressed', v === 'low');
      yax.innerHTML = ''; var ticks = v === 'full' ? [8, 6, 4, 2, 0] : [2, 1.5, 1, 0.5, 0], top = ticks[0];
      ticks.forEach(function (k) { var s = el('span', null, (k >= 1 || k === 0 ? k + ' kHz' : (k * 1000) + ' Hz')); s.style.top = ((1 - k / top) * 100) + '%'; yax.appendChild(s); });
      drawAnn();
    }
    vFull.onclick = function () { setView('full'); }; vLow.onclick = function () { setView('low'); };
    vAnn.setAttribute('aria-pressed', 'true');
    vAnn.onclick = function () { showAnn = !showAnn; stage.classList.toggle('no-ann', !showAnn); vAnn.setAttribute('aria-pressed', showAnn); };
    if (!d.marks || (!d.marks.spans && !d.marks.points && !d.marks.hlines)) vAnn.style.display = 'none';
    setView(view);

    function render() { var t = audio.currentTime || 0, p = Math.min(100, t / d.dur * 100); headLine.style.left = p + '%'; played.style.width = p + '%'; time.textContent = fmt(t) + ' / ' + fmt(d.dur); stage.setAttribute('aria-valuenow', t.toFixed(1)); }
    var raf = 0; function loop() { render(); if (!audio.paused) raf = requestAnimationFrame(loop); }
    function doPlay() { if (current && current !== audio) current.pause(); current = audio; var p = audio.play(); if (p) p.catch(function () {}); }
    audio.addEventListener('play', function () { play.innerHTML = bi('❚❚ 暂停', '❚❚ Pause'); cancelAnimationFrame(raf); loop(); });
    audio.addEventListener('pause', function () { play.innerHTML = bi('▶ 播放', '▶ Play'); render(); });
    audio.addEventListener('ended', function () { play.innerHTML = bi('▶ 播放', '▶ Play'); render(); });
    play.onclick = function () { audio.paused ? doPlay() : audio.pause(); };
    var pos = 0; function now() { return audio.readyState > 0 ? audio.currentTime : pos; }
    function seekTo(t) {
      t = Math.max(0, Math.min(d.dur - 0.01, t)); pos = t;
      if (audio.readyState === 0) { if (audio.networkState !== 2) audio.load(); audio.addEventListener('loadedmetadata', function () { audio.currentTime = t; render(); }, { once: true }); }
      else audio.currentTime = t;
      headLine.style.left = (t / d.dur * 100) + '%'; played.style.width = (t / d.dur * 100) + '%'; time.textContent = fmt(t) + ' / ' + fmt(d.dur);
    }
    function tAt(e) { var r = stage.getBoundingClientRect(); return (e.clientX - r.left) / r.width * d.dur; }
    var dragging = false;
    stage.addEventListener('pointerdown', function (e) { dragging = true; stage.setPointerCapture(e.pointerId); seekTo(tAt(e)); if (audio.paused) doPlay(); e.preventDefault(); stage.focus({ preventScroll: true }); });
    stage.addEventListener('pointermove', function (e) { if (dragging) seekTo(tAt(e)); });
    stage.addEventListener('pointerup', function () { dragging = false; });
    stage.addEventListener('pointercancel', function () { dragging = false; });
    stage.addEventListener('keydown', function (e) {
      if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); audio.paused ? doPlay() : audio.pause(); }
      else if (e.key === 'ArrowRight') { e.preventDefault(); seekTo(now() + 0.5); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); seekTo(now() - 0.5); }
    });

    // answers by condition
    var at = el('div', 'fig-tablewrap'); var tbl = el('table', 'spec-answers');
    var hr = el('tr'); hr.appendChild(el('th'));
    [['A', COND.A], ['B', COND.B], ['E', COND.E], ['C', COND.C]].forEach(function (h) { hr.appendChild(el('th', null, h[0] + ' · ' + bi(h[1][0].replace('+ ', ''), h[1][1].replace('+ ', '')))); });
    tbl.appendChild(el('thead')).appendChild(hr); var tbody = el('tbody'); tbl.appendChild(tbody);
    ['opus', 'fable'].forEach(function (k) {
      var tr = el('tr'); tr.appendChild(el('td', null, '<i class="fig-key ' + (k === 'opus' ? 'o' : 'f') + '"></i>' + MODEL[k]));
      ['A', 'B', 'E', 'C'].forEach(function (c) { var a = d.ans[k][c], ok = d.gold.indexOf(a) >= 0; tr.appendChild(el('td', null, a + ' <span class="' + (ok ? 'is-ok' : 'is-no') + '">' + (ok ? '✓' : '✗') + '</span>')); });
      tbody.appendChild(tr);
    });
    at.appendChild(tbl); box.appendChild(at);

    if (d.obs && (d.obs.opus || d.obs.fable)) {
      var det = el('details', 'spec-said'); det.appendChild(el('summary', null, bi(SAID.zh, SAID.en)));
      ['opus', 'fable'].forEach(function (k) {
        var o = d.obs[k]; if (!o) return; var ok = d.gold.indexOf(o.a) >= 0;
        det.appendChild(el('div', 'spec-who', '<i class="fig-key ' + (k === 'opus' ? 'o' : 'f') + '"></i>' + MODEL[k] + ' → ' + bi('答 ' + o.a + (ok ? '（正确）' : '（错误）'), 'answered ' + o.a + (ok ? ' (correct)' : ' (wrong)'))));
        var q = el('blockquote'); q.textContent = o.t; q.lang = 'en'; det.appendChild(q);
      });
      if (d.etrace) { det.appendChild(el('div', 'spec-who', bi('条件 E 中的工具调用', 'Tool calls in condition E'))); var pre = el('pre', 'fig-trace'); pre.textContent = d.etrace; det.appendChild(pre); }
      box.appendChild(det);
    }
    if (d.note) box.appendChild(el('p', 'spec-note', bi(d.noteZh || d.note, d.note)));
  });
})();
