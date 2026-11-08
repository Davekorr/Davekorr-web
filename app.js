/* davekorr.com — lock screen, Mac desktop / iPhone home, and apps.
   Content lives in config.js; this file is the engine. */
(function () {
  'use strict';
  var S = window.SITE;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var store = {
    get: function (k, d) { try { var v = localStorage.getItem('dk:' + k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
    set: function (k, v) { try { localStorage.setItem('dk:' + k, JSON.stringify(v)); } catch (e) {} }
  };
  function toast(msg) {
    var t = $('#toast'); t.textContent = msg; t.hidden = false; t.style.opacity = 1;
    clearTimeout(toast.t); toast.t = setTimeout(function () { t.style.opacity = 0; setTimeout(function () { t.hidden = true; }, 250); }, 1800);
  }
  function copy(text, ok) {
    try {
      navigator.clipboard.writeText(text).then(function () { toast(ok || 'Copied'); }, function () { toast('Couldn’t copy — select and copy manually'); });
    } catch (e) { toast('Couldn’t copy — select and copy manually'); }
  }

  /* ---------------- Icons ---------------- */
  var GLYPH = {
    photos: '<svg viewBox="0 0 60 60" aria-hidden="true"><g fill="none" stroke="#fff" stroke-width="2.6" stroke-linejoin="round"><rect x="15" y="18" width="26" height="22" rx="3" transform="rotate(-10 28 29)" fill="rgba(255,255,255,.25)"/><rect x="20" y="20" width="26" height="22" rx="3" fill="rgba(255,255,255,.92)" stroke="#fff"/></g><circle cx="38" cy="27" r="2.6" fill="#e9853f"/><path d="M22 40l7-8 5 5 3-3 7 6z" fill="#b85c2a"/></svg>',
    safari: '<svg viewBox="0 0 60 60" aria-hidden="true"><g fill="none" stroke="#fff" stroke-width="2.4"><circle cx="30" cy="30" r="15"/><ellipse cx="30" cy="30" rx="6.5" ry="15"/><path d="M15 30h30M17.5 22h25M17.5 38h25"/></g></svg>',
    notes: '<svg viewBox="0 0 60 60" aria-hidden="true"><g stroke="#d9cdb4" stroke-width="1.6"><path d="M14 22h32M14 30h32M14 38h24"/></g><path d="M38 44l12-12 4 4-12 12-6 2z" fill="#b85c2a"/><path d="M50 32l4 4" stroke="#7a3a17" stroke-width="2"/></svg>',
    camera: '<svg viewBox="0 0 60 60" aria-hidden="true"><rect x="12" y="20" width="36" height="24" rx="5" fill="#d9d9dc"/><rect x="22" y="15" width="12" height="7" rx="2" fill="#d9d9dc"/><circle cx="30" cy="32" r="9" fill="#2a2a2d"/><circle cx="30" cy="32" r="5.5" fill="#3d5a80"/><circle cx="28" cy="30" r="1.6" fill="#fff" opacity=".8"/><circle cx="42" cy="25" r="1.6" fill="#e9853f"/></svg>',
    mail: '<svg viewBox="0 0 60 60" aria-hidden="true"><rect x="12" y="18" width="36" height="25" rx="4" fill="#fff"/><path d="M13 20l17 13 17-13" fill="none" stroke="#b85c2a" stroke-width="2.4" stroke-linejoin="round"/></svg>',
    instagram: '<svg viewBox="0 0 60 60" aria-hidden="true"><g fill="none" stroke="#fff" stroke-width="3"><rect x="16" y="16" width="28" height="28" rx="8"/><circle cx="30" cy="30" r="6.5"/></g><circle cx="38.5" cy="21.5" r="2" fill="#fff"/></svg>'
  };
  function iconSrc(id) {
    var c = S.iconImages && S.iconImages[id]; if (!c) return null;
    if (typeof c === 'string') return c;
    return c[mode] || c.phone || c.mac || null;
  }
  function icon(id) {
    var src = iconSrc(id);
    if (src) {
      var macArt = mode === 'mac' && typeof S.iconImages[id] === 'object' && !!S.iconImages[id].mac;
      var ov = '';
      if (id === 'calendar') { // keep the date live on top of the artwork
        var d = new Date();
        ov = '<span class="cal-ov m">' + d.toLocaleDateString(undefined, { month: 'short' }).toUpperCase() + '</span><span class="cal-ov d">' + d.getDate() + '</span>';
      }
      return '<span class="ic ic-img' + (macArt ? ' ic-macimg' : '') + '"><img src="' + esc(src) + '" alt="">' + ov + '</span>';
    }
    if (id === 'calendar') {
      var dd = new Date();
      return '<span class="ic ic-calendar" style="font-size:var(--icsz,54px)"><span class="cal-dow">' + dd.toLocaleDateString(undefined, { weekday: 'short' }) + '</span><span class="cal-day">' + dd.getDate() + '</span></span>';
    }
    return '<span class="ic ic-' + id + '">' + (GLYPH[id] || '') + '</span>';
  }

  /* ---------------- Apps registry ---------------- */
  var APPS = {
    photos:   { name: 'Photos',   size: [940, 620], render: Photos },
    safari:   { name: 'Safari',   size: [1000, 650], render: Safari },
    notes:    { name: 'Notes',    size: [780, 540], render: Notes },
    calendar: { name: 'Calendar', size: [380, 560], render: Calendar },
    camera:   { name: 'Camera',   size: [820, 560], render: Camera },
    mail:     { name: 'Mail',     size: [520, 340], render: Mail },
    instagram:{ name: 'Instagram', link: 'https://instagram.com/' + S.instagram }
  };
  var MAC_DOCK = ['calendar', 'photos', 'safari', 'notes', 'camera', '|', 'mail', 'instagram'];
  var PHONE_GRID = ['calendar', 'camera', 'instagram', 'mail'];
  var PHONE_DOCK = ['photos', 'safari', 'notes'];

  var mode = null, unlocked = false, instances = {};
  function isPhone() { return matchMedia('(max-width: 767px)').matches; }

  function openApp(id, opts, fromEl) {
    var app = APPS[id]; if (!app) return;
    if (app.link) { window.open(app.link, '_blank', 'noopener'); return; }
    if (mode === 'mac') WM.open(id, opts || {}); else Phone.open(id, opts || {}, fromEl);
  }

  /* ---------------- Clock ---------------- */
  function tick() {
    var d = new Date();
    var t = d.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
    $('#lockTime').textContent = t.replace(/\s?[AP]M$/i, '');
    $('#lockDate').textContent = d.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' });
    $('#mbClock').textContent = d.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' }) + ' ' + t;
    $('#stClock').textContent = t.replace(/\s?[AP]M$/i, '');
  }

  /* ---------------- Lock screen ---------------- */
  var lock = $('#lock');
  function buildLock() {
    $('#lockWall').src = mode === 'phone' ? S.wallpapers.lockPhone : S.wallpapers.lockDesktop;
    $('#lockNotes').innerHTML = (S.notifications || []).map(function (n, i) {
      var tag = n.link ? 'a href="' + esc(n.link) + '" target="_blank" rel="noopener"' : 'button type="button"';
      return '<' + tag + ' class="ntf" data-n="' + i + '" style="animation-delay:' + (300 + i * 140) + 'ms">' +
        '<span class="ntf-ic">' + icon(n.app) + '</span><span class="ntf-main"><span class="ntf-row"><span class="ntf-title">' + esc(n.title) +
        '</span><span class="ntf-time">' + esc(n.time) + '</span></span><span class="ntf-body">' + esc(n.body) + '</span></span></' + (n.link ? 'a' : 'button') + '>';
    }).join('');
  }
  $('#lockNotes').addEventListener('click', function (e) {
    var el = e.target.closest('.ntf'); if (!el) return;
    var n = S.notifications[+el.dataset.n];
    if (n.link) return; // opens in new tab
    unlock(function () { if (n.open) openApp(n.open.app, n.open); });
  });
  $('#unlockBtn').addEventListener('click', function () { unlock(); });
  (function swipe() {
    var y0 = null, t0 = 0, dy = 0, onHint = false;
    lock.addEventListener('pointerdown', function (e) {
      if (e.target.closest('.ntf')) return;
      onHint = !!e.target.closest('.lock-hint'); y0 = e.clientY; t0 = Date.now(); dy = 0; lock.setPointerCapture(e.pointerId); lock.style.transition = 'none';
    });
    lock.addEventListener('pointermove', function (e) {
      if (y0 == null) return; dy = Math.min(0, e.clientY - y0);
      lock.style.transform = 'translateY(' + dy + 'px)'; lock.style.opacity = String(1 + dy / (innerHeight * 1.2));
    });
    function end() {
      if (y0 == null) return; var v = dy / Math.max(1, Date.now() - t0); y0 = null;
      if (dy < -80 || v < -0.6) unlock();
      else if (Math.abs(dy) < 6) { lock.style.transform = ''; lock.style.opacity = ''; if (onHint) unlock(); }
      else { lock.style.transition = 'transform .35s cubic-bezier(.2,.9,.25,1.2), opacity .35s'; lock.style.transform = ''; lock.style.opacity = ''; }
    }
    lock.addEventListener('pointerup', end); lock.addEventListener('pointercancel', end);
    document.addEventListener('keydown', function (e) {
      if (!unlocked && (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowUp') && !e.target.closest('.ntf')) { e.preventDefault(); unlock(); }
    });
  })();
  function unlock(then) {
    if (unlocked) { if (then) then(); return; }
    unlocked = true;
    var shell = $('#shell'); shell.removeAttribute('aria-hidden');
    lock.style.transition = reduce ? 'none' : 'transform .5s cubic-bezier(.3,.7,.2,1), opacity .5s';
    lock.style.transform = 'translateY(-100%)'; lock.style.opacity = '0';
    if (!reduce) shell.animate([{ transform: 'scale(1.06)', opacity: 0.4 }, { transform: 'none', opacity: 1 }], { duration: 550, easing: 'cubic-bezier(.2,.9,.25,1)' });
    setTimeout(function () {
      lock.hidden = true;
      if (then) then();
      if (mode === 'mac') setTimeout(macBanner, 1800);
    }, reduce ? 0 : 480);
  }
  function relock() {
    WM.closeAll(); Phone.close(true); unlocked = false; lock.hidden = false;
    lock.style.transition = 'none'; lock.style.transform = 'translateY(-100%)'; lock.style.opacity = '0';
    $('#shell').setAttribute('aria-hidden', 'true'); buildLock();
    requestAnimationFrame(function () { requestAnimationFrame(function () {
      lock.style.transition = 'transform .45s cubic-bezier(.2,.9,.25,1), opacity .45s'; lock.style.transform = ''; lock.style.opacity = '';
    }); });
  }

  /* ---------------- Mac: dock, menubar, windows ---------------- */
  function buildMac() {
    $('#macWall').src = S.wallpapers.desktop;
    $('#mbName').textContent = S.menuName;
    var dock = $('#dock');
    dock.innerHTML = MAC_DOCK.map(function (id) {
      if (id === '|') return '<span class="dk-sep" aria-hidden="true"></span>';
      var a = APPS[id], label = id === 'instagram' ? 'Instagram @' + S.instagram : a.name;
      var tag = a.link ? 'a href="' + esc(a.link) + '" target="_blank" rel="noopener"' : 'button type="button"';
      return '<' + tag + ' class="dk" data-app="' + id + '" aria-label="' + esc(label) + '">' + icon(id) +
        '<span class="dk-tip">' + esc(label) + '</span><span class="dk-dot"></span></' + (a.link ? 'a' : 'button') + '>';
    }).join('');
  }
  $('#dock').addEventListener('click', function (e) {
    var b = e.target.closest('.dk'); if (!b || APPS[b.dataset.app].link) return;
    var id = b.dataset.app;
    if (WM.wins[id] && WM.wins[id].min) WM.restore(id); else WM.open(id, {});
  });
  // Dock magnification
  $('#dock').addEventListener('mousemove', function (e) {
    if (reduce) return;
    Array.prototype.forEach.call(this.querySelectorAll('.dk'), function (d) {
      var r = d.getBoundingClientRect(), c = r.left + r.width / 2, dist = Math.abs(e.clientX - c);
      d.style.setProperty('--s', (1 + 0.45 * Math.max(0, 1 - dist / 130)).toFixed(3));
    });
  });
  $('#dock').addEventListener('mouseleave', function () { Array.prototype.forEach.call(this.querySelectorAll('.dk'), function (d) { d.style.setProperty('--s', 1); }); });
  $('#mbName').addEventListener('click', function (e) { e.stopPropagation(); var m = $('#mbMenu'); m.hidden = !m.hidden; });
  document.addEventListener('click', function () { $('#mbMenu').hidden = true; });
  $('#mbMenu').addEventListener('click', function (e) {
    var b = e.target.closest('[data-menu]'); if (!b) return;
    if (b.dataset.menu === 'lock') relock(); else openApp('notes', { doc: '21.01' });
  });
  function macBanner() {
    if (mode !== 'mac' || !unlocked || $('.mac-banner')) return;
    var b = document.createElement('button'); b.type = 'button'; b.className = 'mac-banner';
    b.innerHTML = '<span class="ntf-ic">' + icon('notes') + '</span><span class="ntf-main"><span class="ntf-row"><span class="ntf-title">Field Notes 📓</span><span class="ntf-time">now</span></span><span class="ntf-body">Notes from my trips.</span></span>';
    b.addEventListener('click', function () { b.remove(); openApp('notes', { doc: '11.00' }); });
    $('#mac').appendChild(b);
    setTimeout(function () { if (b.isConnected) { b.style.transition = 'opacity .4s, transform .4s'; b.style.opacity = 0; b.style.transform = 'translateX(30px)'; setTimeout(function () { b.remove(); }, 400); } }, 9000);
  }

  var WM = {
    wins: {}, z: 10, n: 0,
    area: function () { return { top: 28, bottom: innerHeight - 92, w: innerWidth }; },
    open: function (id, opts) {
      var w = this.wins[id];
      if (w) { if (w.min) this.restore(id); this.focus(id); if (w.ctl && w.ctl.update) w.ctl.update(opts); return; }
      var app = APPS[id], A = this.area();
      var W = Math.min(app.size[0], innerWidth - 40), H = Math.min(app.size[1], A.bottom - A.top - 16);
      var off = (this.n++ % 6) * 26;
      var x = Math.max(12, Math.round((innerWidth - W) / 2) - 60 + off), y = Math.max(36, Math.round(A.top + (A.bottom - A.top - H) / 2) - 30 + off);
      x = Math.min(x, innerWidth - W - 12); y = Math.min(y, A.bottom - H);
      var el = document.createElement('section');
      el.className = 'win'; el.setAttribute('role', 'dialog'); el.setAttribute('aria-label', app.name);
      el.style.cssText = 'left:' + x + 'px;top:' + Math.max(32, y) + 'px;width:' + W + 'px;height:' + H + 'px';
      el.innerHTML = '<div class="win-bar"><div class="lights"><button class="l-close" type="button" aria-label="Close ' + app.name + '"></button><button class="l-min" type="button" aria-label="Minimize"></button><button class="l-zoom" type="button" aria-label="Zoom"></button></div><div class="win-title">' + app.name + '</div></div><div class="win-body"></div>';
      $('#winLayer').appendChild(el);
      w = this.wins[id] = { el: el, min: false };
      var self = this;
      el.addEventListener('pointerdown', function () { self.focus(id); }, true);
      el.querySelector('.l-close').onclick = function () { self.close(id); };
      el.querySelector('.l-min').onclick = function () { self.minimize(id); };
      el.querySelector('.l-zoom').onclick = function () { self.zoom(id); };
      el.querySelector('.win-bar').addEventListener('dblclick', function (e) { if (!e.target.closest('button')) self.zoom(id); });
      drag(el, el.querySelector('.win-bar'));
      w.ctl = app.render(el.querySelector('.win-body'), opts, { close: function () { self.close(id); }, open: openApp });
      this.focus(id);
      var dk = $('.dk[data-app="' + id + '"]');
      if (dk) { dk.classList.add('open'); dk.classList.remove('bounce'); void dk.offsetWidth; dk.classList.add('bounce'); }
    },
    focus: function (id) {
      var w = this.wins[id]; if (!w) return;
      Object.keys(this.wins).forEach(function (k) { WM.wins[k].el.classList.toggle('focused', k === id); });
      w.el.style.zIndex = ++this.z; $('#mbApp').textContent = APPS[id].name;
    },
    close: function (id) {
      var w = this.wins[id]; if (!w) return; delete this.wins[id];
      if (w.ctl && w.ctl.destroy) w.ctl.destroy();
      var dk = $('.dk[data-app="' + id + '"]'); if (dk) dk.classList.remove('open');
      var done = function () { w.el.remove(); };
      if (reduce) done(); else w.el.animate([{ opacity: 1, transform: 'none' }, { opacity: 0, transform: 'scale(.95)' }], { duration: 150, easing: 'ease-in' }).onfinish = done;
      var rest = Object.keys(this.wins).filter(function (k) { return !WM.wins[k].min; });
      if (rest.length) this.focus(rest.sort(function (a, b) { return WM.wins[b].el.style.zIndex - WM.wins[a].el.style.zIndex; })[0]);
      else $('#mbApp').textContent = 'Finder';
    },
    closeAll: function () { Object.keys(this.wins).forEach(function (k) { WM.wins[k].el.remove(); var dk = $('.dk[data-app="' + k + '"]'); if (dk) dk.classList.remove('open'); }); this.wins = {}; $('#mbApp').textContent = 'Finder'; },
    genie: function (w, id, out) {
      var dk = $('.dk[data-app="' + id + '"]'), r = w.el.getBoundingClientRect(), d = dk ? dk.getBoundingClientRect() : { left: innerWidth / 2, top: innerHeight, width: 0, height: 0 };
      var tx = d.left + d.width / 2 - (r.left + r.width / 2), ty = d.top + d.height / 2 - (r.top + r.height / 2);
      var a = [{ transform: 'none', opacity: 1 }, { transform: 'translate(' + tx + 'px,' + ty + 'px) scale(.06)', opacity: 0 }];
      return w.el.animate(out ? a : a.reverse(), { duration: reduce ? 1 : 380, easing: out ? 'cubic-bezier(.5,0,.75,.6)' : 'cubic-bezier(.2,.8,.3,1)' });
    },
    minimize: function (id) {
      var w = this.wins[id]; if (!w || w.min) return; w.min = true;
      this.genie(w, id, true).onfinish = function () { w.el.style.visibility = 'hidden'; };
      $('#mbApp').textContent = 'Finder';
    },
    restore: function (id) {
      var w = this.wins[id]; if (!w) return; w.min = false; w.el.style.visibility = '';
      this.genie(w, id, false); this.focus(id);
    },
    zoom: function (id) {
      var w = this.wins[id], el = w.el; el.classList.add('zooming');
      if (w.prev) { el.style.left = w.prev[0]; el.style.top = w.prev[1]; el.style.width = w.prev[2]; el.style.height = w.prev[3]; w.prev = null; }
      else { w.prev = [el.style.left, el.style.top, el.style.width, el.style.height]; el.style.left = '6px'; el.style.top = '34px'; el.style.width = (innerWidth - 12) + 'px'; el.style.height = (innerHeight - 34 - 96) + 'px'; }
      setTimeout(function () { el.classList.remove('zooming'); }, 280);
    }
  };
  function drag(el, handle) {
    var s = null;
    handle.addEventListener('pointerdown', function (e) {
      if (e.target.closest('button')) return;
      s = { x: e.clientX, y: e.clientY, l: el.offsetLeft, t: el.offsetTop }; handle.setPointerCapture(e.pointerId);
    });
    handle.addEventListener('pointermove', function (e) {
      if (!s) return;
      var l = Math.min(innerWidth - 120, Math.max(120 - el.offsetWidth, s.l + e.clientX - s.x));
      var t = Math.min(innerHeight - 60, Math.max(28, s.t + e.clientY - s.y));
      el.style.left = l + 'px'; el.style.top = t + 'px';
    });
    var up = function () { s = null; };
    handle.addEventListener('pointerup', up); handle.addEventListener('pointercancel', up);
  }

  /* ---------------- iPhone: home + full-screen apps ---------------- */
  function buildPhone() {
    $('#phoneWall').src = S.wallpapers.phoneHome;
    var latest = S.photos[0], alb = S.albums[0];
    var tile = function (id, label) {
      var a = APPS[id], tag = a.link ? 'a href="' + esc(a.link) + '" target="_blank" rel="noopener"' : 'button type="button"';
      return '<' + tag + ' class="app-tile" data-app="' + id + '" aria-label="' + esc(id === 'instagram' ? 'Instagram @' + S.instagram : a.name) + '"><span class="tile-ic">' + icon(id) + '</span>' +
        (label ? '<span class="tile-label">' + esc(a.name) + '</span>' : '') + '</' + (a.link ? 'a' : 'button') + '>';
    };
    $('#home').innerHTML = '<div class="home-grid">' +
      '<button type="button" class="widget" data-widget="1" aria-label="Open ' + esc(alb.name) + ' album"><img src="' + esc(latest.thumb) + '" alt=""><span class="w-cap"><b>' + esc(alb.name) + '</b>New album</span></button>' +
      PHONE_GRID.map(function (id) { return tile(id, true); }).join('') + '</div>' +
      '<div class="pdock">' + PHONE_DOCK.map(function (id) { return tile(id, false); }).join('') + '</div>';
    Array.prototype.forEach.call(document.querySelectorAll('#home .ic-calendar'), function (c) { c.style.setProperty('--icsz', '62px'); });
  }
  $('#home').addEventListener('click', function (e) {
    var w = e.target.closest('[data-widget]'); if (w) { Phone.open('photos', { album: S.albums[0].id }, w); return; }
    var t = e.target.closest('.app-tile'); if (!t || APPS[t.dataset.app].link) return;
    Phone.open(t.dataset.app, {}, t.querySelector('.tile-ic'));
  });
  var Phone = {
    cur: null,
    open: function (id, opts, fromEl) {
      if (this.cur && this.cur.id === id) { if (this.cur.ctl && this.cur.ctl.update) this.cur.ctl.update(opts); return; }
      if (this.cur) this.close(true);
      if (!fromEl) { var t = $('#home .app-tile[data-app="' + id + '"] .tile-ic'); fromEl = t || null; }
      var el = document.createElement('div'); el.className = 'papp'; el.setAttribute('role', 'dialog'); el.setAttribute('aria-label', APPS[id].name);
      el.innerHTML = '<div class="papp-body"></div><div class="home-bar" role="button" tabindex="0" aria-label="Go to Home Screen"><span></span></div>';
      $('#appLayer').appendChild(el);
      var self = this;
      this.cur = { id: id, el: el, from: fromEl };
      this.cur.ctl = APPS[id].render(el.querySelector('.papp-body'), opts, { close: function () { self.close(); }, open: openApp });
      $('#home').classList.add('behind');
      this.zoom(el, fromEl, true);
      var bar = el.querySelector('.home-bar'), y0 = null;
      bar.addEventListener('pointerdown', function (e) { y0 = e.clientY; bar.setPointerCapture(e.pointerId); });
      bar.addEventListener('pointerup', function (e) { if (y0 != null && e.clientY - y0 < 10) self.close(); y0 = null; });
      bar.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') self.close(); });
    },
    zoom: function (el, fromEl, opening) {
      if (reduce) return { onfinish: null };
      var from = { transform: 'scale(.85)', opacity: 0, borderRadius: '40px' };
      if (fromEl && fromEl.isConnected) {
        var r = fromEl.getBoundingClientRect(), W = innerWidth, H = innerHeight;
        var s = Math.max(r.width / W, 0.05), tx = r.left + r.width / 2 - W / 2, ty = r.top + r.height / 2 - H / 2;
        from = { transform: 'translate(' + tx + 'px,' + ty + 'px) scale(' + s + ',' + (r.height / H) + ')', opacity: 0.4, borderRadius: '120px' };
      }
      var kf = [from, { transform: 'none', opacity: 1, borderRadius: '0px' }];
      return el.animate(opening ? kf : kf.reverse(), { duration: opening ? 460 : 360, easing: opening ? 'cubic-bezier(.2,.9,.25,1)' : 'cubic-bezier(.4,0,.8,.4)', fill: 'forwards' });
    },
    close: function (instant) {
      var c = this.cur; if (!c) return; this.cur = null;
      if (c.ctl && c.ctl.destroy) c.ctl.destroy();
      $('#home').classList.remove('behind');
      if (instant || reduce) { c.el.remove(); return; }
      var a = this.zoom(c.el, c.from, false); a.onfinish = function () { c.el.remove(); };
    }
  };

  /* =============================================================
     APPS — each gets a root element and returns {update, destroy}
     ============================================================= */
  function fmtDate(iso, long) {
    var d = new Date(iso);
    return long ? d.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }) + ' · ' + d.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })
      : d.toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' });
  }
  var byDate = S.photos.slice(); // config order = display order
  function albumOf(p) { return S.albums.filter(function (a) { return a.id === p.album; })[0] || {}; }
  function albumPhotos(id) { return byDate.filter(function (p) { return p.album === id; }); }
  var I = {
    grid: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>',
    lib: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 15l5-5 4 4 3-3 6 6"/></svg>',
    share: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M12 3v12M7 8l5-5 5 5"/><path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7"/></svg>',
    heart: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/></svg>',
    info: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5v.5"/></svg>'
  };

  /* ---------- Photos ---------- */
  function Photos(root, opts) {
    var tab = 'library', album = null, list = [], vi = -1, info = false;
    var liked = store.get('liked', {});
    root.innerHTML = '<div class="app"><div class="app-h"><button class="back" type="button" data-act="back" hidden>‹ Albums</button><h2></h2><span class="sub"></span></div>' +
      '<div class="app-scroll" data-body></div><nav class="ph-tabs"><button type="button" data-tab="library">' + I.lib + 'Library</button><button type="button" data-tab="albums">' + I.grid + 'Albums</button></nav></div>';
    var app = root.firstChild, body = $('[data-body]', root), h2 = $('h2', root), sub = $('.sub', root), back = $('.back', root);
    function cells(ps, start) {
      start = start || 0;
      return '<div class="ph-grid">' + ps.map(function (p, j) {
        var i = start + j;
        return '<button type="button" class="ph-cell" data-act="view" data-i="' + i + '" style="--d:' + Math.min(j * 35, 500) + 'ms" aria-label="' + esc(p.alt) + '"><img src="' + esc(p.thumb) + '" alt="" loading="lazy"></button>';
      }).join('') + '</div>';
    }
    function draw() {
      Array.prototype.forEach.call(root.querySelectorAll('.ph-tabs button'), function (b) { b.classList.toggle('on', b.dataset.tab === tab); });
      back.hidden = !album;
      if (album) {
        var a = S.albums.filter(function (x) { return x.id === album; })[0]; list = albumPhotos(album);
        h2.textContent = a ? a.name : ''; sub.textContent = list.length ? list.length + ' photos' : '';
        var story = (a && a.story && a.story.length) ? '<div class="alb-story"><div class="eyebrow">' + esc(a.eyebrow || '') + '</div><div class="txt">' + a.story.map(function (t) { return '<p>' + esc(t) + '</p>'; }).join('') + '</div>' + (a.story.length > 1 ? '<button type="button" class="more" data-act="more">Read more</button>' : '') + '</div>' : '';
        body.innerHTML = list.length ? story + cells(list) : '<div class="empty"><b>No photos yet</b>New photos from ' + esc(a.name) + ' are coming soon.</div>';
      } else if (tab === 'library') {
        list = byDate; h2.textContent = 'Library'; sub.textContent = list.length + ' photos';
        var html = '', start = 0;
        S.albums.forEach(function (a) {
          var ps = albumPhotos(a.id); if (!ps.length) return;
          html += '<div class="ph-section">' + esc(a.name) + '</div>' + cells(ps, start); start += ps.length;
        });
        body.innerHTML = html;
      } else {
        h2.textContent = 'Albums'; sub.textContent = '';
        body.innerHTML = '<div class="ph-section">My Albums</div><div class="ph-albums">' + S.albums.map(function (a, i) {
          var ps = albumPhotos(a.id);
          return '<button type="button" class="alb" data-act="album" data-id="' + esc(a.id) + '" style="--d:' + i * 50 + 'ms"><span class="alb-cover">' +
            (ps.length ? '<img src="' + esc(ps[0].thumb) + '" alt="" loading="lazy">' : 'Coming soon') + '</span><b>' + esc(a.name) + '</b><span>' + ps.length + '</span></button>';
        }).join('') + '</div>';
      }
      body.scrollTop = 0;
    }
    function viewer(i) {
      vi = (i + list.length) % list.length; var p = list[vi];
      var v = $('.viewer', root);
      if (!v) {
        v = document.createElement('div'); v.className = 'viewer'; v.tabIndex = -1; app.appendChild(v);
        v.innerHTML = '<div class="v-top"><button class="back" type="button" data-act="close">‹ Back</button><div class="v-title"><b></b><span></span></div><span style="width:60px;text-align:right;color:var(--muted);font-size:13px" data-count></span></div>' +
          '<div class="v-stage"><button type="button" class="v-nav prev" data-act="prev" aria-label="Previous photo">‹</button><button type="button" class="v-nav next" data-act="next" aria-label="Next photo">›</button></div>' +
          '<div class="v-strip"></div><div class="v-tools"><button type="button" data-act="share" aria-label="Copy link">' + I.share + '</button><button type="button" data-act="like" aria-label="Favorite">' + I.heart + '</button><button type="button" data-act="info" aria-label="Info">' + I.info + '</button></div>';
        swipeStage($('.v-stage', v));
        v.addEventListener('keydown', function (e) {
          if (e.key === 'ArrowRight') viewer(vi + 1); else if (e.key === 'ArrowLeft') viewer(vi - 1); else if (e.key === 'Escape') closeViewer();
        });
        v.focus();
      }
      $('.v-title b', v).textContent = p.title || albumOf(p).name || '';
      $('.v-title span', v).textContent = p.taken ? fmtDate(p.taken, true) : (p.title ? albumOf(p).name || '' : '');
      $('[data-count]', v).textContent = (vi + 1) + ' / ' + list.length;
      var stage = $('.v-stage', v), old = $('img', stage); if (old) old.remove();
      var img = new Image(); img.src = p.src; img.alt = p.alt; img.draggable = false; stage.insertBefore(img, stage.firstChild);
      $('.v-strip', v).innerHTML = list.map(function (q, j) { return '<button type="button" data-act="jump" data-i="' + j + '" class="' + (j === vi ? 'on' : '') + '" aria-label="Photo ' + (j + 1) + '"><img src="' + esc(q.thumb) + '" alt=""></button>'; }).join('');
      var on = $('.v-strip .on', v); if (on && on.scrollIntoView) on.scrollIntoView({ block: 'nearest', inline: 'center' });
      $('[data-act="like"]', v).classList.toggle('liked', !!liked[p.id]);
      var old2 = $('.v-info', v); if (old2) old2.remove();
      if (info) {
        var box = document.createElement('div'); box.className = 'v-info';
        var ex = [p.fl, p.f, p.ss && p.ss + 's', p.iso && 'ISO ' + p.iso].filter(Boolean);
        box.innerHTML = '<h3>' + esc(p.title || p.alt) + '</h3><div class="muted">' + esc(p.taken ? fmtDate(p.taken, true) : albumOf(p).name || '') + '</div>' +
          (p.camera ? '<div style="margin-top:8px">' + esc(p.camera) + '<div class="muted">' + esc(p.lens || '') + '</div></div>' : '') +
          (ex.length ? '<div class="exif">' + ex.map(function (x) { return '<span>' + esc(x) + '</span>'; }).join('') + '</div>' : '<div class="muted" style="margin-top:8px">Camera details not available</div>');
        stage.appendChild(box);
      }
    }
    function closeViewer() { var v = $('.viewer', root); if (v) v.remove(); vi = -1; info = false; }
    function swipeStage(stage) {
      var x0 = null, y0 = 0, dx = 0, dy = 0;
      stage.addEventListener('pointerdown', function (e) { if (e.target.closest('button,.v-info')) return; x0 = e.clientX; y0 = e.clientY; dx = dy = 0; stage.setPointerCapture(e.pointerId); });
      stage.addEventListener('pointermove', function (e) {
        if (x0 == null) return; dx = e.clientX - x0; dy = e.clientY - y0; var img = $('img', stage); if (!img) return;
        img.style.transition = 'none'; img.style.animation = 'none';
        img.style.transform = Math.abs(dy) > Math.abs(dx) && dy > 0 ? 'translateY(' + dy + 'px) scale(' + Math.max(.7, 1 - dy / 1200) + ')' : 'translateX(' + dx + 'px)';
      });
      var end = function () {
        if (x0 == null) return; x0 = null; var img = $('img', stage);
        if (dy > 120 && Math.abs(dy) > Math.abs(dx)) return closeViewer();
        if (dx < -60) return viewer(vi + 1); if (dx > 60) return viewer(vi - 1);
        if (img) { img.style.transition = 'transform .3s cubic-bezier(.2,.9,.25,1.2)'; img.style.transform = ''; }
      };
      stage.addEventListener('pointerup', end); stage.addEventListener('pointercancel', end);
    }
    root.addEventListener('click', function (e) {
      var t = e.target.closest('[data-tab]'); if (t) { tab = t.dataset.tab; album = null; closeViewer(); draw(); return; }
      var b = e.target.closest('[data-act]'); if (!b) return;
      var act = b.dataset.act;
      if (act === 'view') viewer(+b.dataset.i);
      else if (act === 'album') { album = b.dataset.id; draw(); }
      else if (act === 'back') { album = null; tab = 'albums'; draw(); }
      else if (act === 'more') { var st = b.closest('.alb-story'); st.classList.toggle('open'); b.textContent = st.classList.contains('open') ? 'Show less' : 'Read more'; }
      else if (act === 'close') closeViewer();
      else if (act === 'next') viewer(vi + 1);
      else if (act === 'prev') viewer(vi - 1);
      else if (act === 'jump') viewer(+b.dataset.i);
      else if (act === 'info') { info = !info; viewer(vi); }
      else if (act === 'like') { var id = list[vi].id; liked[id] = !liked[id]; store.set('liked', liked); b.classList.toggle('liked', liked[id]); toast(liked[id] ? 'Added to Favorites' : 'Removed from Favorites'); }
      else if (act === 'share') copy('https://davekorr.com', 'Link to davekorr.com copied');
    });
    function update(o) {
      o = o || {};
      if (o.album) { album = o.album; tab = 'albums'; closeViewer(); draw(); }
      if (o.tab) { tab = o.tab; album = null; closeViewer(); draw(); }
      if (o.photo) { var i = byDate.map(function (p) { return p.id; }).indexOf(o.photo); if (i > -1) { album = null; tab = 'library'; draw(); viewer(i); } }
    }
    draw(); update(opts);
    return { update: update };
  }

  /* ---------- Safari (projects) ---------- */
  function Safari(root) {
    var cur = 0;
    root.innerHTML = '<div class="app"><div class="sf-tabs" role="tablist"></div><div class="sf-url"><span class="u"></span></div><div class="app-scroll sf-page" data-page></div></div>';
    function draw() {
      $('.sf-tabs', root).innerHTML = S.projects.map(function (p, i) { return '<button type="button" role="tab" aria-selected="' + (i === cur) + '" class="' + (i === cur ? 'on' : '') + '" data-i="' + i + '">' + esc(p.title) + '</button>'; }).join('');
      var p = S.projects[cur]; $('.u', root).textContent = p.url;
      $('[data-page]', root).innerHTML = '<div class="sf-hero"><img src="' + esc(p.image) + '" alt=""></div><div class="sf-card"><h3>' + esc(p.title) + '</h3><div style="color:#6b625a;font-size:14px">' + esc(p.desc) + '</div><p>' + esc(p.body) + '</p><a class="go" href="' + esc(p.url) + '" target="_blank" rel="noopener">Visit site ↗</a></div>';
    }
    root.addEventListener('click', function (e) { var b = e.target.closest('.sf-tabs button'); if (b) { cur = +b.dataset.i; draw(); } });
    draw(); return {};
  }

  /* ---------- Notes (Johnny Decimal notes, leave a note, testimonials) ---------- */
  function Notes(root, opts, api) {
    var phone = mode === 'phone', notes = S.notes || [];
    var first = notes.filter(function (n) { return n.type === 'text'; })[0] || notes[0];
    var doc = first ? first.id : null, showList = phone;
    function byType(t) { return notes.filter(function (n) { return n.type === t; })[0]; }
    function find(id) { return notes.filter(function (n) { return n.id === id; })[0]; }
    function preview(n) {
      if (n.type === 'compose') return 'Say something about the site';
      if (n.type === 'testimonials') return (S.testimonials || []).length + ' notes';
      var t = n.body || ((S.albums.filter(function (a) { return a.id === n.album; })[0] || {}).story || [''])[0];
      return String(t).replace(/\s+/g, ' ').slice(0, 60);
    }
    root.innerHTML = '<div class="app"><div class="nt"><div class="nt-list"></div><div class="nt-doc" tabindex="-1"></div></div></div>';
    var listEl = $('.nt-list', root), docEl = $('.nt-doc', root);
    function draw() {
      var html = phone ? '<div class="app-h"><h2>Notes</h2></div>' : '', area = null;
      notes.forEach(function (n) {
        if (n.area !== area) { area = n.area; html += '<div class="nt-area">' + esc(area) + '</div>'; }
        html += '<button type="button" class="nt-item' + (n.id === doc && !phone ? ' on' : '') + '" data-doc="' + esc(n.id) + '"><b><span class="jd">' + esc(n.id) + '</span> ' + esc(n.title) + '</b><span>' + esc(preview(n)) + '</span></button>';
      });
      listEl.innerHTML = html;
      listEl.hidden = phone && !showList; docEl.hidden = phone && showList;
      var n = find(doc); if (!n) { docEl.innerHTML = ''; return; }
      var head = (phone ? '<button type="button" class="back" data-act="list">‹ Notes</button>' : '') + '<div class="jd-id">' + esc(n.id) + '</div><h3>' + esc(n.title) + '</h3>';
      if (n.type === 'testimonials') {
        docEl.innerHTML = head + ((S.testimonials || []).length ? S.testimonials.map(function (t) { return '<div class="tst">“' + esc(t.text) + '”<div style="color:var(--muted);font-size:13px;margin-top:6px">— ' + esc(t.name) + '</div></div>'; }).join('') : '<p style="color:var(--muted)">No notes yet — be the first.</p>') +
          (byType('compose') ? '<button type="button" class="pill primary" data-doc="' + esc(byType('compose').id) + '">Leave a note</button>' : '');
      } else if (n.type === 'compose') {
        var draft = store.get('draft', { name: '', text: '' });
        docEl.innerHTML = head + '<form data-form><label class="field">Your name<input name="name" autocomplete="name" value="' + esc(draft.name) + '"></label><label class="field">Your note<textarea name="text" required placeholder="What did you think of the site or the photos?">' + esc(draft.text) + '</textarea></label><button class="pill primary" type="submit">Get it ready to send</button></form><div data-result></div>';
        var f = $('[data-form]', docEl), fN = f.elements['name'], fT = f.elements['text'];
        f.addEventListener('input', function () { store.set('draft', { name: fN.value, text: fT.value }); });
        f.addEventListener('submit', function (e) {
          e.preventDefault(); if (!fT.value.trim()) return;
          var msg = fT.value.trim() + (fN.value.trim() ? '\n\n— ' + fN.value.trim() : '');
          var href = 'mailto:' + S.email + '?subject=' + encodeURIComponent('A note for Dave') + '&body=' + encodeURIComponent(msg);
          $('[data-result]', docEl).innerHTML = '<div class="note-result">Your note is ready. Send it to <b style="user-select:all">' + esc(S.email) + '</b><div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:10px"><a class="pill primary" href="' + esc(href) + '">Open in Mail</a><button type="button" class="pill" data-act="copy">Copy note</button></div></div>';
          $('[data-act="copy"]', docEl).onclick = function () { copy(msg, 'Note copied'); };
        });
      } else {
        var alb = n.album && S.albums.filter(function (a) { return a.id === n.album; })[0];
        var paras = n.body ? [n.body] : (alb ? alb.story : []);
        docEl.innerHTML = head + (alb && alb.eyebrow ? '<div class="nt-eyebrow">' + esc(alb.eyebrow) + '</div>' : '') +
          paras.map(function (t) { return '<p>' + esc(t) + '</p>'; }).join('') +
          (alb ? '<button type="button" class="pill primary" data-open-album="' + esc(alb.id) + '">Open album in Photos</button>' : '') +
          (n.id === (byType('text') || {}).id ? '' : '');
      }
      docEl.scrollTop = 0;
    }
    root.addEventListener('click', function (e) {
      var oa = e.target.closest('[data-open-album]'); if (oa) { api.open('photos', { album: oa.dataset.openAlbum }); return; }
      var d = e.target.closest('[data-doc]'); if (d) { doc = d.dataset.doc; showList = false; draw(); return; }
      if (e.target.closest('[data-act="list"]')) { showList = true; draw(); }
    });
    function update(o) {
      o = o || {};
      if (o.compose && byType('compose')) { doc = byType('compose').id; showList = false; }
      if (o.doc) { doc = o.doc; showList = false; }
      draw();
    }
    update(opts || {});
    return { update: update };
  }

  /* ---------- Calendar (book a shoot) ---------- */
  function Calendar(root) {
    var today = new Date(), view = new Date(today.getFullYear(), today.getMonth(), 1), sel = new Date(today);
    root.innerHTML = '<div class="app"><div class="app-scroll"><div class="cal"></div></div></div>';
    var el = $('.cal', root);
    function same(a, b) { return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate(); }
    function draw() {
      var y = view.getFullYear(), m = view.getMonth(), start = new Date(y, m, 1 - new Date(y, m, 1).getDay()), cells = '';
      for (var i = 0; i < 42; i++) {
        var d = new Date(start.getFullYear(), start.getMonth(), start.getDate() + i);
        cells += '<button type="button" data-d="' + d.toISOString() + '" class="' + (d.getMonth() !== m ? 'out ' : '') + (same(d, today) ? 'today ' : '') + (same(d, sel) ? 'sel' : '') + '" aria-label="' + d.toDateString() + '">' + d.getDate() + '</button>';
      }
      var dow = ['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(function (x) { return '<span class="dow">' + x + '</span>'; }).join('');
      var label = sel.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' });
      var href = 'mailto:' + S.email + '?subject=' + encodeURIComponent('Photo shoot request — ' + label) + '&body=' + encodeURIComponent('Hi Dave,\n\nI’d like to book a shoot on ' + label + '.\n\n');
      el.innerHTML = '<div class="cal-h"><button type="button" data-m="-1" aria-label="Previous month">‹</button><b>' + view.toLocaleDateString(undefined, { month: 'long', year: 'numeric' }) + '</b><button type="button" data-m="1" aria-label="Next month">›</button></div>' +
        '<div class="cal-g">' + dow + cells + '</div><div class="cal-foot"><div style="display:flex;justify-content:space-between;align-items:center;gap:10px"><b>' + esc(label) + '</b><a class="pill primary" href="' + esc(href) + '">Book a shoot</a></div><div style="color:var(--muted);margin-top:10px;font-size:13px">Opens your email app. Or write to <span style="user-select:all">' + esc(S.email) + '</span></div></div>';
    }
    root.addEventListener('click', function (e) {
      var b = e.target.closest('[data-m]'); if (b) { view = new Date(view.getFullYear(), view.getMonth() + (+b.dataset.m), 1); draw(); return; }
      var d = e.target.closest('[data-d]'); if (d) { sel = new Date(d.dataset.d); if (sel.getMonth() !== view.getMonth()) view = new Date(sel.getFullYear(), sel.getMonth(), 1); draw(); }
    });
    draw(); return {};
  }

  /* ---------- Camera (viewfinder through your photos) ---------- */
  function Camera(root, opts, api) {
    var i = 0, busy = false;
    root.innerHTML = '<div class="cam"><div class="cam-frame"><img alt=""><div class="cam-grid"></div><div class="cam-af"></div><div class="cam-exif"></div><div class="cam-blade t"></div><div class="cam-blade b"></div></div>' +
      '<div class="cam-ctrl" style="position:relative"><div class="cam-mode">PHOTO</div><button type="button" class="cam-thumb" data-act="open" aria-label="Open this photo in Photos"><img alt=""></button>' +
      '<button type="button" class="cam-shutter" data-act="shoot" aria-label="Shutter — next frame"><span></span></button>' +
      '<button type="button" class="cam-flip" data-act="prev" aria-label="Previous frame"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" aria-hidden="true"><path d="M4 12a8 8 0 0 1 14-5.3M20 12a8 8 0 0 1-14 5.3"/><path d="M18 3v4h-4M6 21v-4h4"/></svg></button></div></div>';
    function show() {
      var p = byDate[i], img = $('.cam-frame img', root);
      img.src = p.src; img.alt = p.alt;
      $('.cam-thumb img', root).src = byDate[(i + byDate.length - 1) % byDate.length].thumb;
      $('.cam-exif', root).innerHTML = [p.fl, p.f, p.ss, p.iso && 'ISO ' + p.iso].filter(Boolean).map(function (x) { return '<span>' + esc(x) + '</span>'; }).join('') || '<span>' + esc(albumOf(p).name || '') + '</span>';
      var af = $('.cam-af', root); af.classList.remove('lock'); void af.offsetWidth; af.classList.add('lock');
    }
    root.addEventListener('click', function (e) {
      var b = e.target.closest('[data-act]'); if (!b || busy) return;
      if (b.dataset.act === 'open') { api.open('photos', { photo: byDate[(i + byDate.length - 1) % byDate.length].id }); return; }
      if (b.dataset.act === 'prev') { i = (i + byDate.length - 1) % byDate.length; show(); return; }
      busy = true;
      var blades = root.querySelectorAll('.cam-blade');
      var close = function (el) { return el.animate([{ transform: 'scaleY(0)' }, { transform: 'scaleY(1)' }], { duration: reduce ? 1 : 90, easing: 'ease-in', fill: 'forwards' }); };
      var a = close(blades[0]); close(blades[1]);
      a.onfinish = function () {
        i = (i + 1) % byDate.length; show();
        Array.prototype.forEach.call(blades, function (el) { el.animate([{ transform: 'scaleY(1)' }, { transform: 'scaleY(0)' }], { duration: reduce ? 1 : 200, easing: 'ease-out', fill: 'forwards' }); });
        setTimeout(function () { busy = false; }, 220);
      };
    });
    show(); return {};
  }

  /* ---------- Mail (contact) ---------- */
  function Mail(root) {
    root.innerHTML = '<div class="app"><div class="ml"><h2 style="margin:0 0 6px">Get in touch</h2><p style="color:var(--muted);margin:0 0 16px">Shoots, prints, or just to say hi.</p><div class="addr">' + esc(S.email) + '</div>' +
      '<div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:16px"><a class="pill primary" href="mailto:' + esc(S.email) + '">Open in Mail</a><button type="button" class="pill" data-act="copy">Copy address</button><a class="pill" href="https://instagram.com/' + esc(S.instagram) + '" target="_blank" rel="noopener">Instagram @' + esc(S.instagram) + '</a></div></div></div>';
    $('[data-act="copy"]', root).onclick = function () { copy(S.email, 'Email address copied'); };
    return {};
  }

  /* ---------------- Boot / mode switching ---------------- */
  function setMode() {
    var m = isPhone() ? 'phone' : 'mac';
    if (m === mode) return;
    mode = m; document.body.className = 'mode-' + m;
    WM.closeAll(); Phone.close(true); $('#home').classList.remove('behind');
    var bn = $('.mac-banner'); if (bn) bn.remove();
    buildLock(); if (m === 'mac') buildMac(); else buildPhone();
  }
  var rt; addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(setMode, 150); });
  setMode(); tick(); setInterval(tick, 10000);
  // Deep links (used by old portfolio URLs): #albums, #album-<id>
  (function () {
    var h = (location.hash || '').slice(1); if (!h) return;
    if (h === 'albums') unlock(function () { openApp('photos', { tab: 'albums' }); });
    else if (h.indexOf('album-') === 0 && S.albums.some(function (a) { return a.id === h.slice(6); })) unlock(function () { openApp('photos', { album: h.slice(6) }); });
  })();
})();
