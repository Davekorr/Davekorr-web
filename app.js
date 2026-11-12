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

  /* Full-size photo: phones get the 1200px copy in img/md/, big screens the 2000px original */
  function setPhoto(img, p) {
    if (p.md) { img.sizes = '100vw'; img.srcset = p.md + ' 1200w, ' + p.src + ' 2000w'; }           // R2: Cloudflare-resized copies
    else if (/^img\//.test(p.src)) { img.sizes = '100vw'; img.srcset = p.src.replace(/^img\//, 'img/md/') + ' 1200w, ' + p.src + ' 2000w'; }
    else img.removeAttribute('srcset');
    img.src = p.src;
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
      var s192 = src.replace(/\.png$/, '-192.png');
      return '<span class="ic ic-img' + (macArt ? ' ic-macimg' : '') + '"><img src="' + esc(s192) + '" srcset="' + esc(s192) + ' 192w, ' + esc(src) + ' 512w" sizes="64px" alt="" decoding="async">' + ov + '</span>';
    }
    if (id === 'calendar') {
      var dd = new Date();
      return '<span class="ic ic-calendar" style="font-size:var(--icsz,54px)"><span class="cal-dow">' + dd.toLocaleDateString(undefined, { weekday: 'short' }) + '</span><span class="cal-day">' + dd.getDate() + '</span></span>';
    }
    return '<span class="ic ic-' + id + '">' + (GLYPH[id] || '') + '</span>';
  }

  /* ---------------- Apps registry ---------------- */
  var APPS = {
    photos:   { name: 'Photos',   size: [940, 620], render: Photos, full: true },
    safari:   { name: 'Safari',   size: [1000, 650], render: Safari },
    notes:    { name: 'Notes',    size: [780, 540], render: Notes },
    calendar: { name: 'Calendar', size: [380, 560], render: Calendar },
    camera:   { name: 'Camera',   size: [820, 560], render: Camera },
    mail:     { name: 'Mail',     size: [520, 340], render: Mail },
    contacts: { name: 'Contacts', size: [560, 720], render: Contacts },
    music:    { name: 'Music',    size: [640, 640], render: Music },
    instagram:{ name: 'Instagram', link: 'https://instagram.com/' + S.instagram }
  };
  var MAC_DOCK = ['calendar', 'photos', 'safari', 'notes', 'contacts', 'music', 'camera', '|', 'mail', 'instagram'];
  var PHONE_GRID = ['calendar', 'notes', 'instagram', 'mail'];   // camera is hidden on phones (still in the code: add 'camera' back here to show it)
  var PHONE_DOCK = ['photos', 'safari', 'music', 'contacts'];

  var mode = null, unlocked = false, instances = {};
  function isPhone() { return matchMedia('(max-width: 767px)').matches; }

  /* Permanent addresses: davekorr.com/photos/letchworth, /music, /contact ... The address bar follows what's open,
     and opening one of those links opens that app straight away (tools/pages/build.js makes the matching pages). */
  var APP_PATH = { photos: 'photos', music: 'music', contacts: 'contact', notes: 'notes' };
  var PATH_APP = { photos: 'photos', music: 'music', contact: 'contacts', about: 'contacts', notes: 'notes', prints: 'safari', reading: 'safari', now: 'safari' };
  function setPath(p, title) {
    try { if (location.pathname.replace(/\/$/, '') !== '/' + p && !(p === '' && location.pathname === '/')) history.replaceState(history.state, '', '/' + p); } catch (e) {}
    document.title = title || 'Dave Korr — Photographer';
  }
  function routeFromPath() {
    var parts = location.pathname.replace(/^\/+|\/+$/g, '').split('/'), id = PATH_APP[parts[0]];
    if (!id) return null;
    var o = {};
    if (parts[0] === 'prints') o.tab = 'shop';
    if (parts[0] === 'reading' || parts[0] === 'now') o.tab = parts[0];
    if (id === 'photos' && parts[1] && S.albums.some(function (a) { return a.id === parts[1]; })) o.album = parts[1];
    return { id: id, opts: o };
  }
  function openApp(id, opts, fromEl) {
    var app = APPS[id]; if (!app) return;
    if (app.link) { window.open(app.link, '_blank', 'noopener'); return; }
    if (mode === 'mac') WM.open(id, opts || {}); else Phone.open(id, opts || {}, fromEl);
  }
  var photosPath = ['photos', 'Photos — Dave Korr'], safariPath = ['prints', 'Prints — Dave Korr'];
  function pathFor(id) {
    if (id === 'photos') setPath(photosPath[0], photosPath[1]);
    else if (id === 'safari') setPath(safariPath[0], safariPath[1]);
    else setPath(APP_PATH[id] || '', APPS[id] ? APPS[id].name + ' — Dave Korr' : '');
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
  /* Rochester's sun (NOAA formula): sunrise / sunset as Date objects for the given day */
  var ROC = { lat: 43.1566, lon: -77.6088 };
  function sunTimes(day) {
    var rad = Math.PI / 180, d0 = Date.UTC(day.getFullYear(), day.getMonth(), day.getDate());
    var n = Math.round((d0 - Date.UTC(day.getFullYear(), 0, 0)) / 864e5);
    var g = 2 * Math.PI / 365 * (n - 1);
    var eq = 229.18 * (0.000075 + 0.001868 * Math.cos(g) - 0.032077 * Math.sin(g) - 0.014615 * Math.cos(2 * g) - 0.040849 * Math.sin(2 * g));
    var dec = 0.006918 - 0.399912 * Math.cos(g) + 0.070257 * Math.sin(g) - 0.006758 * Math.cos(2 * g) + 0.000907 * Math.sin(2 * g) - 0.002697 * Math.cos(3 * g) + 0.00148 * Math.sin(3 * g);
    var ha = Math.acos(Math.cos(90.833 * rad) / (Math.cos(ROC.lat * rad) * Math.cos(dec)) - Math.tan(ROC.lat * rad) * Math.tan(dec)) / rad;
    var noon = 720 - 4 * ROC.lon - eq;                       // minutes after UTC midnight
    return { rise: new Date(d0 + (noon - 4 * ha) * 6e4), set: new Date(d0 + (noon + 4 * ha) * 6e4) };
  }
  function rocTime(d) { return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', timeZone: 'America/New_York' }); }
  function liveNote() {
    var now = new Date(), t = sunTimes(now), min = function (a) { return Math.round((a - now) / 6e4); };
    var toSet = min(t.set), toRise = min(t.rise), open = { app: 'photos', tab: 'library' };
    var dur = function (m) { return m >= 60 ? Math.floor(m / 60) + ' h ' + (m % 60) + ' min' : m + ' min'; };
    if (toSet > 60 && toSet <= 180) return { app: 'photos', title: '🌅 Golden hour in Rochester in ' + dur(toSet - 60), body: 'Sunset at ' + rocTime(t.set) + ' today. The best light of the day.', time: 'live', open: open };
    if (toSet > 0 && toSet <= 60) return { app: 'photos', title: '🌅 Golden hour in Rochester, right now', body: toSet + ' min of warm light left before sunset.', time: 'live', open: open };
    if (toSet <= 0 && toSet > -35) return { app: 'photos', title: '🌙 Blue hour in Rochester', body: 'The sun set at ' + rocTime(t.set) + '. The sky is turning blue.', time: 'live', open: open };
    if (toRise > -60 && toRise <= 30) return { app: 'photos', title: toRise > 0 ? '🌄 Sunrise in Rochester in ' + toRise + ' min' : '🌄 Morning light in Rochester', body: 'Sunrise ' + (toRise > 0 ? 'at ' : 'was at ') + rocTime(t.rise) + '. Golden hour, round one.', time: 'live', open: open };
    if (toRise <= -60 && toSet > 180) return null;   // daytime: no light card (the "New drop" card is always there)
    var nextRise = toRise > 0 ? t.rise : sunTimes(new Date(now.getTime() + 864e5)).rise;
    return { app: 'photos', title: '🌙 ' + rocTime(now) + ' in Rochester', body: 'Next sunrise at ' + rocTime(nextRise) + '.', time: 'live', open: open };
  }
  function ago(iso) {
    var m = Math.round((Date.now() - new Date(iso)) / 6e4);
    return m < 60 ? Math.max(1, m) + 'm ago' : m < 1440 ? Math.round(m / 60) + 'h ago' : Math.round(m / 1440) + 'd ago';
  }
  function newsNote() {
    var days = function (iso) { return (Date.now() - new Date(iso)) / 864e5; };
    var n = (window.R2_NEWS || []).filter(function (x) { return x.kind === 'photos' && x.at && days(x.at) <= 14; })[0];
    if (n) {
      var a = S.albums.filter(function (x) { return x.id === n.album; })[0];
      var mo = new Date(n.at).getMonth(), sea = mo < 2 || mo === 11 ? ['Winter', '❄️'] : mo < 5 ? ['Spring', '🌱'] : mo < 8 ? ['Summer', '☀️'] : ['Fall', '🍂'];
      return { app: 'photos', title: sea[0] + ' photos have dropped ' + sea[1], body: (a ? a.name : n.album) + ' is live — fresh frames.', time: ago(n.at), open: { app: 'photos', album: n.album } };
    }
    var M = S.music || {};
    if (M.updated && days(M.updated) <= 7) return { app: 'music', title: 'Playlist refreshed 🎵', body: 'Dave\'s favourites and what he\'s had on lately.', time: ago(M.updated), open: { app: 'music' } };
    return null;
  }
  var lockList = [];
  function buildLock() {
    $('#lockWall').src = mode === 'phone' ? S.wallpapers.lockPhone : S.wallpapers.lockDesktop;
    var ev = S.notifications || [], day = Math.floor((Date.now() - new Date().getTimezoneOffset() * 6e4) / 864e5);
    // Up to 3 cards: New drop (newest album, always), Rochester's light (when there's something to say),
    // then the latest news, or the daily rotating one when there's no news.
    var na = S.albums.filter(function (a) { return albumPhotos(a.id).length; })[0];
    var mo = new Date().getMonth(), leaf = mo < 2 || mo === 11 ? '❄️' : mo < 5 ? '🌱' : mo < 8 ? '☀️' : '🍂';
    var drop = na ? { app: 'photos', title: 'New drop ' + leaf, body: na.name + ' is live — fresh frames.', time: 'new', open: { app: 'photos', album: na.id } } : null;
    var live = liveNote(), news = newsNote();
    if (news && drop && news.open && news.open.album === drop.open.album) { drop.time = news.time; news = null; }
    lockList = [drop, live, news || (ev.length ? ev[day % ev.length] : null)].filter(Boolean);
    var music = nowPlayingMini();
    $('#lockMusic').innerHTML = mode === 'mac' ? music : '';   // computers: top right of the lock screen. Phones: shown after unlocking
    $('#lock').classList.toggle('has-music', mode === 'mac' && !!music);
    $('#lockNotes').innerHTML = lockList.map(function (n, i) {
      var tag = n.link ? 'a href="' + esc(n.link) + '" target="_blank" rel="noopener"' : 'button type="button"';
      return '<' + tag + ' class="ntf" data-n="' + i + '" style="animation-delay:' + (300 + i * 140) + 'ms">' +
        '<span class="ntf-ic">' + icon(n.app) + '</span><span class="ntf-main"><span class="ntf-row"><span class="ntf-title">' + esc(n.title) +
        '</span><span class="ntf-time">' + esc(n.time || '') + '</span></span><span class="ntf-body">' + esc(n.body) + '</span></span></' + (n.link ? 'a' : 'button') + '>';
    }).join('');
  }
  function lockTap(e) {
    var el = e.target.closest('.ntf'); if (!el) return;
    if (el.classList.contains('npc')) { if (!e.target.closest('.npc-play')) unlock(function () { openApp('music'); }); return; }
    var n = lockList[+el.dataset.n];
    if (n.link) return; // opens in new tab
    unlock(function () { if (n.open) openApp(n.open.app, n.open); });
  }
  $('#lockNotes').addEventListener('click', lockTap);
  $('#lockMusic').addEventListener('click', lockTap);
  $('#unlockBtn').addEventListener('click', function () { unlock(); });
  var EASE = 'cubic-bezier(.32,.72,0,1)'; // iOS-style deceleration curve
  function lockProgress(p) { // p: 0 = locked, 1 = fully unlocked (drives the home screen behind the lock)
    var sh = $('#shell');
    sh.style.transform = 'scale(' + (1.06 - 0.06 * p) + ') translateZ(0)';
    sh.style.opacity = String(0.35 + 0.65 * p);
  }
  (function swipe() {
    var y0 = null, dy = 0, onHint = false, samples = [], raf = 0;
    function paint() {
      raf = 0;
      var H = innerHeight, d = dy < 0 ? dy : dy / 4; // rubber-band when pulled down
      lock.style.transform = 'translate3d(0,' + d + 'px,0)';
      lock.style.opacity = String(Math.max(0, 1 + d / (H * 0.9)));
      lockProgress(Math.min(1, Math.max(0, -d / (H * 0.6))));
    }
    lock.addEventListener('pointerdown', function (e) {
      stopNudge();
      if (unlocked || e.target.closest('.ntf,.np')) return;
      onHint = !!e.target.closest('.lock-hint'); y0 = e.clientY; dy = 0; samples = [[performance.now(), 0]];
      lock.setPointerCapture(e.pointerId); lock.style.transition = 'none'; $('#shell').style.transition = 'none';
      lock.classList.add('dragging');
    });
    lock.addEventListener('pointermove', function (e) {
      if (y0 == null) return; dy = e.clientY - y0;
      var t = performance.now(); samples.push([t, dy]); while (samples.length > 2 && t - samples[0][0] > 90) samples.shift();
      if (!raf) raf = requestAnimationFrame(paint);
    });
    function end() {
      if (y0 == null) return; y0 = null; lock.classList.remove('dragging');
      if (raf) { cancelAnimationFrame(raf); raf = 0; paint(); }
      var a = samples[0], b = samples[samples.length - 1], v = (b[1] - a[1]) / Math.max(1, b[0] - a[0]); // px per ms
      if (dy < -innerHeight * 0.18 || (v < -0.45 && dy < -10)) return unlock(null, v);
      if (Math.abs(dy) < 6) { reset(0); if (onHint || lock.classList.contains('nudged')) unlock(); return; }
      reset(380);
    }
    function reset(ms) {
      var tr = ms ? 'transform ' + ms + 'ms ' + EASE + ', opacity ' + ms + 'ms ' + EASE : 'none';
      lock.style.transition = tr; $('#shell').style.transition = tr;
      lock.style.transform = ''; lock.style.opacity = ''; lockProgress(0);
    }
    lock.addEventListener('pointerup', end); lock.addEventListener('pointercancel', end);
    /* First-visit help: after 3 s with no swipe, the lock screen "peeks" up and tapping anywhere enters */
    var nudgeT = null, hintTxt = $('#unlockBtn span');
    function stopNudge() { clearTimeout(nudgeT); lock.classList.remove('nudge'); }
    window.startNudge = function () {
      stopNudge(); lock.classList.remove('nudged'); hintTxt.textContent = 'Swipe up to unlock';
      nudgeT = setTimeout(function () {
        if (unlocked) return;
        lock.classList.add('nudge', 'nudged');
        hintTxt.textContent = mode === 'phone' ? 'Swipe up or tap to enter' : 'Click anywhere to enter';
      }, 3000);
    };
    startNudge();
    document.addEventListener('keydown', function (e) {
      if (!unlocked && (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowUp') && !e.target.closest('.ntf')) { e.preventDefault(); unlock(); }
    });
  })();
  function unlock(then, v) {
    if (unlocked) { if (then) then(); return; }
    unlocked = true;
    var shell = $('#shell'); shell.removeAttribute('aria-hidden');
    // duration follows the finger: a fast flick finishes faster
    var cur = new DOMMatrix(getComputedStyle(lock).transform).m42 || 0, left = innerHeight + cur;
    var ms = reduce ? 0 : Math.round(Math.max(240, Math.min(460, v ? left / Math.max(1.4, -v * 1.6) : 440)));
    var tr = ms ? 'transform ' + ms + 'ms ' + EASE + ', opacity ' + ms + 'ms ' + EASE : 'none';
    lock.style.transition = tr; shell.style.transition = tr; document.body.classList.add('animating');
    requestAnimationFrame(function () {
      lock.style.transform = 'translate3d(0,-100%,0)'; lock.style.opacity = '0';
      shell.style.transform = ''; shell.style.opacity = '';
    });
    setTimeout(function () {
      lock.hidden = true; shell.style.transition = ''; document.body.classList.remove('animating');
      if (then) then();
      if (mode === 'mac') setTimeout(macBanner, 1800);
    }, ms ? ms - 40 : 0);
  }
  function relock() {
    WM.closeAll(); Phone.close(true); unlocked = false; lock.hidden = false; if (window.startNudge) startNudge();
    lock.style.transition = 'none'; lock.style.transform = 'translate3d(0,-100%,0)'; lock.style.opacity = '0';
    $('#shell').setAttribute('aria-hidden', 'true'); buildLock();
    requestAnimationFrame(function () { requestAnimationFrame(function () {
      lock.style.transition = 'transform 420ms ' + EASE + ', opacity 420ms ' + EASE; lock.style.transform = ''; lock.style.opacity = '';
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
    if (!unlocked || $('.mac-banner')) return;
    if (mode === 'phone' && Phone.cur) return;           // not on top of an app someone just opened
    var b = document.createElement('button'); b.type = 'button'; b.className = 'mac-banner';
    var s = pinSong(); if (!s) return;
    b.innerHTML = '<span class="ntf-ic">' + cover(s, 36) + '</span><span class="ntf-main"><span class="ntf-row"><span class="ntf-title">Check out what Dave\'s listening to 🎵</span></span><span class="ntf-body">' + esc(s.title) + ' · ' + esc(s.artist) + '</span></span>';
    b.addEventListener('click', function () { b.remove(); openApp('music'); });
    $(mode === 'mac' ? '#mac' : '#phone').appendChild(b);
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
      if (app.full) el.classList.add('full');           // opens full screen (Photos); the green button toggles a normal window
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
      pathFor(id); dockAuto();
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
      if (!Object.keys(this.wins).length) setPath('');
      dockAuto();
    },
    closeAll: function () { Object.keys(this.wins).forEach(function (k) { WM.wins[k].el.remove(); var dk = $('.dk[data-app="' + k + '"]'); if (dk) dk.classList.remove('open'); }); this.wins = {}; $('#mbApp').textContent = 'Finder'; },
    genie: function (w, id, out) {
      var dk = $('.dk[data-app="' + id + '"]'), r = w.el.getBoundingClientRect(), d = dk ? dk.getBoundingClientRect() : { left: innerWidth / 2, top: innerHeight, width: 0, height: 0 };
      var tx = d.left + d.width / 2 - (r.left + r.width / 2), ty = d.top + d.height / 2 - (r.top + r.height / 2);
      var a = [{ transform: 'none', opacity: 1 }, { transform: 'translate(' + tx + 'px,' + ty + 'px) scale(.06)', opacity: 0 }];
      return w.el.animate(out ? a : a.reverse(), { duration: reduce ? 1 : 380, easing: out ? 'cubic-bezier(.5,0,.75,.6)' : EASE });
    },
    minimize: function (id) {
      var w = this.wins[id]; if (!w || w.min) return; w.min = true;
      this.genie(w, id, true).onfinish = function () { w.el.style.visibility = 'hidden'; };
      $('#mbApp').textContent = 'Finder';
      setTimeout(dockAuto, 400);
    },
    restore: function (id) {
      var w = this.wins[id]; if (!w) return; w.min = false; w.el.style.visibility = '';
      this.genie(w, id, false); this.focus(id);
    },
    zoom: function (id) {
      var w = this.wins[id], el = w.el;
      if (APPS[id].full && !w.prev) { el.classList.toggle('full'); dockAuto(); return; }
      el.classList.add('zooming');
      if (w.prev) { el.style.left = w.prev[0]; el.style.top = w.prev[1]; el.style.width = w.prev[2]; el.style.height = w.prev[3]; w.prev = null; }
      else { w.prev = [el.style.left, el.style.top, el.style.width, el.style.height]; el.style.left = '6px'; el.style.top = '34px'; el.style.width = (innerWidth - 12) + 'px'; el.style.height = (innerHeight - 34 - 96) + 'px'; }
      setTimeout(function () { el.classList.remove('zooming'); }, 280);
    }
  };
  /* While a full-screen window is in front, the dock slides away; it comes back when the pointer reaches the bottom edge */
  function dockAuto() {
    var top = null, z = -1;
    Object.keys(WM.wins).forEach(function (k) { var w = WM.wins[k]; if (!w.min && +w.el.style.zIndex > z) { z = +w.el.style.zIndex; top = w; } });
    document.body.classList.toggle('dock-auto', !!(top && top.el.classList.contains('full')));
  }
  document.addEventListener('pointermove', function (e) {
    if (!document.body.classList.contains('dock-auto')) return;
    if (e.clientY > innerHeight - 8) document.body.classList.add('dock-peek');
    else if (e.clientY < innerHeight - 110) document.body.classList.remove('dock-peek');
  });
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
      '<button type="button" class="widget" data-widget="1" aria-label="' + esc(alb.name) + ', new album"><img src="' + esc(latest.thumb) + '" alt=""><span class="w-cap"><b>' + esc(alb.name) + '</b>New album</span></button>' +
      PHONE_GRID.map(function (id) { return tile(id, true); }).join('') + '</div>' + nowPlayingCard('np-home') +
      '<div class="pdock">' + PHONE_DOCK.map(function (id) { return tile(id, false); }).join('') + '</div>';

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
      el.innerHTML = '<div class="papp-body"></div><button type="button" class="home-btn" aria-label="Back to Home Screen"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 11l9-7 9 7"/><path d="M5 10v10h14V10"/></svg>Home</button><div class="home-bar" role="button" tabindex="0" aria-label="Go to Home Screen"><span></span></div>';
      el.querySelector('.home-btn').addEventListener('click', function () { self.close(); });
      // phone/browser Back gesture returns to the home screen
      try { history.pushState({ dkApp: id }, ''); this.pushed = true; } catch (e) {}
      pathFor(id);
      $('#appLayer').appendChild(el);
      var self = this;
      this.cur = { id: id, el: el, from: fromEl };
      this.cur.ctl = APPS[id].render(el.querySelector('.papp-body'), opts, { close: function () { self.close(); }, open: openApp });
      $('#home').classList.add('behind');
      this.zoom(el, fromEl, true);
      var bar = el.querySelector('.home-bar'), g = null, raf = 0;
      function paint() {
        raf = 0; if (!g) return;
        var H = innerHeight, up = Math.max(0, -g.dy), p = Math.min(1, up / (H * 0.5));
        el.style.transform = 'translate3d(' + (g.dx * 0.4) + 'px,' + (-up * 0.55) + 'px,0) scale(' + (1 - p * 0.45) + ')';
        el.style.borderRadius = (12 + p * 40) + 'px';
        $('#home').style.transform = 'scale(' + (0.94 + p * 0.06) + ')'; $('#home').style.opacity = String(0.5 + p * 0.5);
      }
      bar.addEventListener('pointerdown', function (e) {
        g = { x0: e.clientX, y0: e.clientY, dx: 0, dy: 0, s: [[performance.now(), 0]] };
        bar.setPointerCapture(e.pointerId); el.style.transition = 'none'; $('#home').style.transition = 'none';
        el.classList.add('dragging');
      });
      bar.addEventListener('pointermove', function (e) {
        if (!g) return; g.dx = e.clientX - g.x0; g.dy = e.clientY - g.y0;
        var t = performance.now(); g.s.push([t, g.dy]); while (g.s.length > 2 && t - g.s[0][0] > 90) g.s.shift();
        if (!raf) raf = requestAnimationFrame(paint);
      });
      function endDrag() {
        if (!g) return; var G = g; g = null; el.classList.remove('dragging');
        var a = G.s[0], b = G.s[G.s.length - 1], v = (b[1] - a[1]) / Math.max(1, b[0] - a[0]);
        $('#home').style.transition = ''; $('#home').style.transform = ''; $('#home').style.opacity = '';
        if (Math.abs(G.dy) < 8 || G.dy < -innerHeight * 0.12 || v < -0.4) { self.close(); return; }
        el.style.transition = 'transform 380ms ' + EASE + ', border-radius 380ms ' + EASE;
        el.style.transform = ''; el.style.borderRadius = '';
      }
      bar.addEventListener('pointerup', endDrag); bar.addEventListener('pointercancel', endDrag);
      bar.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') self.close(); });
    },
    zoom: function (el, fromEl, opening) {
      if (reduce) return { onfinish: null };
      var target = 'translate3d(0,0,0) scale(.86)';
      if (fromEl && fromEl.isConnected) {
        var r = fromEl.getBoundingClientRect(), W = innerWidth, H = innerHeight;
        var tx = r.left + r.width / 2 - W / 2, ty = r.top + r.height / 2 - H / 2;
        target = 'translate3d(' + tx + 'px,' + ty + 'px,0) scale(' + Math.max(r.width / W, 0.12) + ')';
      }
      var now = getComputedStyle(el).transform; if (!now || now === 'none') now = 'translate3d(0,0,0) scale(1)';
      el.classList.add('zooming'); document.body.classList.add('animating');
      var kf = opening ? [{ transform: target, opacity: 0.3 }, { transform: 'translate3d(0,0,0) scale(1)', opacity: 1 }]
                       : [{ transform: now, opacity: 1 }, { transform: target, opacity: 0 }];
      var an = el.animate(kf, { duration: opening ? 480 : 380, easing: EASE, fill: 'forwards' });
      an.onfinish = function () { el.classList.remove('zooming'); document.body.classList.remove('animating'); if (opening) an.cancel(); }; // release so finger-drag can move it
      return an;
    },
    close: function (instant, fromPop) {
      var c = this.cur; if (!c) return; this.cur = null;
      if (this.pushed && !fromPop) { this.pushed = false; this.skipPop = true; try { history.back(); } catch (e) {} }
      if (fromPop) this.pushed = false;
      if (c.ctl && c.ctl.destroy) c.ctl.destroy();
      $('#home').classList.remove('behind');
      if (instant || reduce) { c.el.remove(); return; }
      var a = this.zoom(c.el, c.from, false); a.onfinish = function () { c.el.remove(); document.body.classList.remove('animating'); };
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
    pin: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M12 21s-6-5.7-6-11a6 6 0 0 1 12 0c0 5.3-6 11-6 11z"/><circle cx="12" cy="10" r="2.2"/></svg>',
    print: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M7 8V3h10v5"/><rect x="3" y="8" width="18" height="9" rx="2"/><path d="M7 14h10v7H7z"/></svg>',
    info: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5v.5"/></svg>'
  };

  /* ---------- Places map + print sheet ---------- */
  function placesMap() {
    var M = window.SITE_MAP; if (!M) return '<div class="empty">Map unavailable</div>';
    var pins = S.albums.map(function (a) {
      var p = M.pins[a.id], ps = albumPhotos(a.id); if (!p || !ps.length) return '';
      var x = (p[0] - M.vb[0]) / M.vb[2] * 100, y = (p[1] - M.vb[1]) / M.vb[3] * 100;
      return '<button type="button" class="pl-pin" data-act="album" data-id="' + esc(a.id) + '" style="left:' + x + '%;top:' + y + '%" aria-label="' + esc(a.name) + ', ' + ps.length + ' photos">' +
        '<span class="pl-bub"><img src="' + esc(ps[0].thumb) + '" alt=""><i>' + ps.length + '</i></span><span class="pl-lbl">' + esc(a.pin || a.name.split(',')[0]) + '</span></button>';
    }).join('');
    return '<div class="pl-wrap"><div class="pl-map"><svg viewBox="' + M.vb.join(' ') + '" preserveAspectRatio="xMidYMid meet" aria-hidden="true">' +
      '<defs><linearGradient id="oc" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0b1633"/><stop offset="1" stop-color="#16285a"/></linearGradient></defs>' +
      '<rect x="' + M.vb[0] + '" y="' + M.vb[1] + '" width="' + M.vb[2] + '" height="' + M.vb[3] + '" fill="url(#oc)"/>' +
      '<path d="' + M.nation + '" fill="#3f8a75" stroke="#2f6e5e" stroke-width=".8"/><path d="' + M.states + '" fill="none" stroke="rgba(255,255,255,.14)" stroke-width=".5"/>' +
      [190, 330, 470].map(function (y) { return '<line x1="' + M.vb[0] + '" x2="' + (M.vb[0] + M.vb[2]) + '" y1="' + y + '" y2="' + y + '" stroke="rgba(255,255,255,.28)" stroke-width=".8" stroke-dasharray="3 3"/>'; }).join('') +
      '<text x="960" y="380" text-anchor="middle" class="pl-ocean">North<tspan x="960" dy="13">Atlantic</tspan><tspan x="960" dy="13">Ocean</tspan></text>' +
      '<text x="690" y="455" text-anchor="middle" class="pl-ocean">Gulf of<tspan x="690" dy="13">Mexico</tspan></text>' +
      '</svg>' + pins + '</div></div>';
  }
  /* ---------- Photos ---------- */
  function Photos(root, opts) {
    var tab = 'library', album = null, list = [], vi = -1, info = false;
    var liked = store.get('liked', {});
    var side = '<aside class="ph-side" aria-label="Photos sidebar"><button type="button" data-tab="library">' + I.lib + 'Library</button><button type="button" data-tab="albums">' + I.grid + 'Albums</button><button type="button" data-tab="places">' + I.pin + 'Places</button>' +
      '<div class="ph-side-h">My Albums</div>' + S.albums.map(function (a) { var n = albumPhotos(a.id).length; return '<button type="button" class="ph-side-a" data-act="album" data-id="' + esc(a.id) + '"><span>' + esc(a.name) + '</span><i>' + (n || '') + '</i></button>'; }).join('') + '</aside>';
    root.innerHTML = '<div class="app photos">' + side + '<div class="app-h"><button class="back" type="button" data-act="back" hidden>‹ Albums</button><h2></h2><span class="sub"></span></div>' +
      '<div class="app-scroll" data-body></div><nav class="ph-tabs"><button type="button" data-tab="library">' + I.lib + 'Library</button><button type="button" data-tab="albums">' + I.grid + 'Albums</button><button type="button" data-tab="places">' + I.pin + 'Places</button></nav></div>';
    var app = root.firstChild, body = $('[data-body]', root), h2 = $('h2', root), sub = $('.sub', root), back = $('.back', root);
    function cells(ps, start) {
      start = start || 0;
      return '<div class="ph-grid">' + ps.map(function (p, j) {
        var i = start + j;
        return '<button type="button" class="ph-cell" data-act="view" data-i="' + i + '" style="--d:' + Math.min(j * 35, 500) + 'ms" aria-label="' + esc(p.alt) + '"><img src="' + esc(p.thumb) + '" alt="" loading="lazy"></button>';
      }).join('') + '</div>';
    }
    function draw() {
      var al = album && S.albums.filter(function (a) { return a.id === album; })[0];
      photosPath = [al ? 'photos/' + al.id : 'photos', (al ? al.name : 'Photos') + ' — Dave Korr']; setPath(photosPath[0], photosPath[1]);
      Array.prototype.forEach.call(root.querySelectorAll('.ph-tabs button, .ph-side [data-tab]'), function (b) { b.classList.toggle('on', !album && b.dataset.tab === tab); });
      Array.prototype.forEach.call(root.querySelectorAll('.ph-side-a'), function (b) { b.classList.toggle('on', b.dataset.id === album); });
      back.hidden = !album;
      if (album) {
        var a = S.albums.filter(function (x) { return x.id === album; })[0]; list = albumPhotos(album);
        h2.textContent = a ? a.name : ''; sub.textContent = list.length ? list.length + ' photos' : '';
        var story = (a && a.story && a.story.length) ? '<div class="alb-story"><div class="eyebrow">' + esc(a.eyebrow || '') + '</div><div class="txt">' + a.story.map(function (t) { return '<p>' + esc(t) + '</p>'; }).join('') + '</div>' + (a.story.length > 1 ? '<button type="button" class="more" data-act="more">Read more</button>' : '') + '</div>' : '';
        body.innerHTML = list.length ? story + cells(list) : '<div class="empty"><b>No photos yet</b>New photos from ' + esc(a.name) + ' are coming soon.</div>';
      } else if (tab === 'places') {
        h2.textContent = 'Places'; sub.textContent = S.albums.length + ' locations';
        body.innerHTML = placesMap();
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
        v.innerHTML = '<div class="v-top"><button class="back" type="button" data-act="close">‹ Back</button><div class="v-title"><b></b><span></span><em class="v-exif"></em></div><span style="width:60px;text-align:right;color:var(--muted);font-size:13px" data-count></span></div>' +
          '<div class="v-stage"><button type="button" class="v-nav prev" data-act="prev" aria-label="Previous photo">‹</button><button type="button" class="v-nav next" data-act="next" aria-label="Next photo">›</button></div>' +
          '<div class="v-strip"></div><div class="v-tools"><button type="button" data-act="share" aria-label="Copy link">' + I.share + '</button><button type="button" data-act="like" aria-label="Favorite">' + I.heart + '</button><button type="button" data-act="info" aria-label="Info">' + I.info + '</button></div>';
        swipeStage($('.v-stage', v));
        var win = root.closest('.win'); if (win) win.classList.add('viewing');
        if (mode === 'mac') {                 // controls fade after 2 s without the mouse moving
          var idleT = null, wake = function () { v.classList.remove('idle'); clearTimeout(idleT); idleT = setTimeout(function () { if (!v.querySelector('.v-info')) v.classList.add('idle'); }, 2000); };
          v.addEventListener('pointermove', wake); v.addEventListener('keydown', wake); wake();
        }
        v.addEventListener('keydown', function (e) {
          if (e.key === 'ArrowRight') viewer(vi + 1); else if (e.key === 'ArrowLeft') viewer(vi - 1); else if (e.key === 'Escape') closeViewer();
        });
        v.focus();
      }
      $('.v-title b', v).textContent = p.title || albumOf(p).name || '';
      $('.v-title span', v).textContent = p.taken ? fmtDate(p.taken, true) : (p.title ? albumOf(p).name || '' : '');
      $('[data-count]', v).textContent = (vi + 1) + ' / ' + list.length;
      $('.v-exif', v).textContent = [p.camera, p.fl, p.f, p.ss && p.ss + 's', p.iso && 'ISO ' + p.iso].filter(Boolean).join(' · ');
      var stage = $('.v-stage', v), old = $('img', stage); if (old) old.remove();
      if (stage.resetZoom) stage.resetZoom();
      var img = new Image(); setPhoto(img, p); img.alt = p.alt; img.draggable = false; stage.insertBefore(img, stage.firstChild);
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
    function closeViewer() { var v = $('.viewer', root); if (v) v.remove(); vi = -1; info = false; var win = root.closest('.win'); if (win) win.classList.remove('viewing'); }
    /* Viewer gestures: swipe left/right = next/prev, swipe down = close,
       double-tap / double-click / pinch / scroll wheel = zoom (loads the full-size master), drag = pan while zoomed. */
    function swipeStage(stage) {
      var x0 = null, y0 = 0, dx = 0, dy = 0, pts = {}, pinch = null, z = 1, px = 0, py = 0, lastTap = 0, moved = false;
      var img = function () { return $('img', stage); };
      function clamp() {
        var i = img(); if (!i) return;
        var mx = Math.max(0, (i.clientWidth * z - stage.clientWidth) / 2), my = Math.max(0, (i.clientHeight * z - stage.clientHeight) / 2);
        px = Math.max(-mx, Math.min(mx, px)); py = Math.max(-my, Math.min(my, py));
      }
      function apply(anim) {
        var i = img(); if (!i) return; clamp();
        i.style.animation = 'none'; i.style.transition = anim ? 'transform .28s cubic-bezier(.2,.9,.25,1)' : 'none';
        i.style.transform = z === 1 ? '' : 'translate(' + px + 'px,' + py + 'px) scale(' + z + ')';
        stage.classList.toggle('zoomed', z > 1);
        if (z > 1.2) hires();
      }
      function hires() {                      // swap in the full-size master once, when zooming
        var i = img(), p = list[vi]; if (!i || !p || !p.zoom || i.dataset.hi) return;
        i.dataset.hi = '1'; var pre = new Image();
        pre.onload = function () { if (img() === i) { i.removeAttribute('srcset'); i.src = p.zoom; } };
        pre.src = p.zoom;
      }
      function zoomAt(nz, cx, cy, anim) {
        var r = stage.getBoundingClientRect(), ox = cx - r.left - r.width / 2, oy = cy - r.top - r.height / 2;
        nz = Math.max(1, Math.min(5, nz));
        px = ox - (ox - px) * nz / z; py = oy - (oy - py) * nz / z; z = nz;
        if (z === 1) px = py = 0; apply(anim);
      }
      stage.resetZoom = function () { z = 1; px = py = 0; stage.classList.remove('zoomed'); };
      stage.addEventListener('wheel', function (e) { if (!img()) return; e.preventDefault(); zoomAt(z * (e.deltaY < 0 ? 1.15 : 0.87), e.clientX, e.clientY, false); }, { passive: false });
      stage.addEventListener('pointerdown', function (e) {
        if (e.target.closest('button,.v-info')) return;
        stage.setPointerCapture(e.pointerId); pts[e.pointerId] = [e.clientX, e.clientY];
        var ids = Object.keys(pts);
        if (ids.length === 2) { var a = pts[ids[0]], b = pts[ids[1]]; pinch = { d: Math.hypot(a[0] - b[0], a[1] - b[1]), z: z }; x0 = null; return; }
        x0 = e.clientX; y0 = e.clientY; dx = dy = 0; moved = false;
      });
      stage.addEventListener('pointermove', function (e) {
        if (!pts[e.pointerId]) return;
        var prev = pts[e.pointerId]; pts[e.pointerId] = [e.clientX, e.clientY];
        var ids = Object.keys(pts);
        if (pinch && ids.length === 2) {
          var a = pts[ids[0]], b = pts[ids[1]];
          zoomAt(pinch.z * Math.hypot(a[0] - b[0], a[1] - b[1]) / pinch.d, (a[0] + b[0]) / 2, (a[1] + b[1]) / 2, false); return;
        }
        if (x0 == null) return;
        dx = e.clientX - x0; dy = e.clientY - y0; if (Math.abs(dx) > 6 || Math.abs(dy) > 6) moved = true;
        if (z > 1) { px += e.clientX - prev[0]; py += e.clientY - prev[1]; apply(false); return; }   // pan
        var i = img(); if (!i) return;
        i.style.transition = 'none'; i.style.animation = 'none';
        i.style.transform = Math.abs(dy) > Math.abs(dx) && dy > 0 ? 'translateY(' + dy + 'px) scale(' + Math.max(.7, 1 - dy / 1200) + ')' : 'translateX(' + dx + 'px)';
      });
      var end = function (e) {
        delete pts[e.pointerId];
        if (pinch) { if (!Object.keys(pts).length) pinch = null; x0 = null; return; }
        if (x0 == null) return; x0 = null;
        if (!moved) {                                  // a tap: two quick taps toggle zoom
          var now = Date.now();
          if (now - lastTap < 320) { lastTap = 0; zoomAt(z > 1 ? 1 : 2.5, e.clientX, e.clientY, true); }
          else lastTap = now;
          return;
        }
        if (z > 1) return;
        var i = img();
        if (dy > 120 && Math.abs(dy) > Math.abs(dx)) return closeViewer();
        if (dx < -60) return viewer(vi + 1); if (dx > 60) return viewer(vi - 1);
        if (i) { i.style.transition = 'transform .3s cubic-bezier(.2,.9,.25,1.2)'; i.style.transform = ''; }
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
      var sp = { reading: ['reading', 'Reading'], store: ['prints', 'Prints'], now: ['now', 'Now'] }[p.type] || ['', 'Safari'];
      safariPath = [sp[0], sp[1] + ' — Dave Korr'];
      setPath(safariPath[0], safariPath[1]);
      if (p.type === 'store') { $('[data-page]', root).innerHTML = storePage(); return; }
      if (p.type === 'reading') { $('[data-page]', root).innerHTML = readingPage(); return; }
      if (p.type === 'now') { $('[data-page]', root).innerHTML = nowPage(); return; }
      $('[data-page]', root).innerHTML = '<div class="sf-hero"><img src="' + esc(p.image) + '" alt=""></div><div class="sf-card"><h3>' + esc(p.title) + '</h3><div style="color:#6b625a;font-size:14px">' + esc(p.desc) + '</div><p>' + esc(p.body) + '</p><a class="go" href="' + esc(p.url) + '" target="_blank" rel="noopener">Visit site ↗</a></div>';
    }
    root.addEventListener('click', function (e) {
      var b = e.target.closest('.sf-tabs button'); if (b) { cur = +b.dataset.i; draw(); return; }
      var nt = e.target.closest('[data-now-tab]'); if (nt) { update({ tab: nt.dataset.nowTab }); return; }
      var na = e.target.closest('[data-now-app]'); if (na) { openApp(na.dataset.nowApp); return; }
    });
    function update(o) { o = o || {}; if (o.tab) { S.projects.forEach(function (p, i) { if (p.id === o.tab) cur = i; }); draw(); } }
    draw(); update(arguments[1]); return { update: update };
  }

  function nowPage() {
    var N = S.now || { items: [] }, rows = (N.items || []).slice();
    var book = (S.reading || []).filter(function (b) { return b.status === 'reading'; })[0], song = pinSong();
    if (book) rows.push({ label: 'Reading', text: book.title + ' by ' + book.author + '.', tab: 'reading' });
    if (song) rows.push({ label: 'Listening', text: song.title + ' by ' + song.artist + ' on repeat.', app: 'music' });
    var when = N.updated ? new Date(N.updated + 'T12:00:00').toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : '';
    return '<div class="rd nw"><h3>Now</h3><p>What I\'m up to at the moment.' + (when ? ' Updated ' + esc(when) + '.' : '') + '</p><dl>' +
      rows.map(function (r) {
        var more = r.tab ? ' <button type="button" class="nw-go" data-now-tab="' + r.tab + '">See list →</button>' : r.app ? ' <button type="button" class="nw-go" data-now-app="' + r.app + '">Open →</button>' : '';
        return '<dt>' + esc(r.label) + '</dt><dd>' + esc(r.text) + more + '</dd>';
      }).join('') + '</dl></div>';
  }

  function readingPage() {
    var R = S.reading || [], groups = [['reading', 'Reading now'], ['next', 'Up next'], ['finished', 'Finished']];
    var card = function (b) {
      return '<div class="rd-book"><span class="rd-cover"><i aria-hidden="true">' + esc(b.title) + '</i>' + (b.cover ? '<img src="' + esc(b.cover) + '" alt="Cover of ' + esc(b.title) + '" loading="lazy" onerror="this.remove()">' : '') +
        '</span><b>' + esc(b.title) + '</b><span>' + esc(b.author) + '</span></div>';
    };
    return '<div class="rd"><h3>Reading</h3><p>What\'s on my nightstand: the book I\'m in, the one waiting, and the ones I\'ve finished.</p>' +
      groups.map(function (g) {
        var list = R.filter(function (b) { return b.status === g[0]; });
        return list.length ? '<h4>' + g[1] + '</h4><div class="rd-row">' + list.map(card).join('') + '</div>' : '';
      }).join('') + '</div>';
  }

  function storePage() {
    var SH = S.shop || { prices: [] }, from = SH.prices.length ? '$' + SH.prices[0].price : '';
    var btn = function (id) { return SH.shopUrl ? '<a class="pill primary" href="' + esc(SH.shopUrl) + '" target="_blank" rel="noopener">Shop prints ↗</a>' : '<span class="pill st-soon">Opening soon</span>'; };
    var cards = S.albums.map(function (a) {
      var ps = albumPhotos(a.id); if (!ps.length) return '';
      return '<div class="st-card"><img src="' + esc(ps[0].thumb) + '" alt=""><div class="st-meta"><b>' + esc(a.name) + '</b><span>' + ps.length + ' images · prints from ' + from + '</span>' + btn(a.id) + '</div></div>';
    }).join('');
    var table = '<div class="st-prices">' + SH.prices.map(function (p) { return '<div><b>' + esc(p.size) + '</b><span>$' + p.price + '</span></div>'; }).join('') + '</div>';
    return '<div class="st"><h3>Dave Korr — Print Shop</h3><p>Signed, made-to-order prints on lustre or fine-art paper, produced by a professional lab and shipped to you.</p>' + table + '<div class="st-grid">' + cards + '</div></div>';
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
    var CAL = S.calendar || {}, until = CAL.blockWeekendsUntil ? new Date(CAL.blockWeekendsUntil + 'T23:59:59') : null;
    function blocked(d) { var w = d.getDay(); return !!until && (w === 0 || w === 6) && d <= until && d >= new Date(today.getFullYear(), today.getMonth(), today.getDate()); }
    function same(a, b) { return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate(); }
    function draw() {
      var y = view.getFullYear(), m = view.getMonth(), start = new Date(y, m, 1 - new Date(y, m, 1).getDay()), cells = '';
      for (var i = 0; i < 42; i++) {
        var d = new Date(start.getFullYear(), start.getMonth(), start.getDate() + i);
        var bl = blocked(d);
        cells += '<button type="button" data-d="' + d.toISOString() + '" class="' + (d.getMonth() !== m ? 'out ' : '') + (same(d, today) ? 'today ' : '') + (same(d, sel) ? 'sel ' : '') + (bl ? 'blk' : '') + '" aria-label="' + d.toDateString() + (bl ? ', ' + esc(CAL.label) : '') + '">' + d.getDate() + '</button>';
      }
      var dow = ['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(function (x) { return '<span class="dow">' + x + '</span>'; }).join('');
      var label = sel.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' });
      var href = 'mailto:' + S.email + '?subject=' + encodeURIComponent('Photo shoot request — ' + label) + '&body=' + encodeURIComponent('Hi Dave,\n\nI’d like to book a shoot on ' + label + '.\n\n');
      el.innerHTML = '<div class="cal-h"><button type="button" data-m="-1" aria-label="Previous month">‹</button><b>' + view.toLocaleDateString(undefined, { month: 'long', year: 'numeric' }) + '</b><button type="button" data-m="1" aria-label="Next month">›</button></div>' +
        '<div class="cal-g">' + dow + cells + '</div><div class="cal-foot"><div style="display:flex;justify-content:space-between;align-items:center;gap:10px"><b>' + esc(label) + '</b>' + (blocked(sel) ? '<span class="pill cal-off">✈︎ ' + esc(CAL.label) + '</span>' : '<a class="pill primary" href="' + esc(href) + '">Book a shoot</a>') + '</div><div style="color:var(--muted);margin-top:10px;font-size:13px">Opens your email app. Or write to <span style="user-select:all">' + esc(S.email) + '</span></div></div>';
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
      setPhoto(img, p); img.alt = p.alt;
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


  /* ---------- Music ---------- */
  function amUrl(s) { return s.url || 'https://music.apple.com/us/search?term=' + encodeURIComponent(s.title + ' ' + s.artist); }
  function pinSong() { var M = S.music || {}; return M.pin && M.pin.title ? M.pin : (M.songs || [])[0]; }
  function cover(s, size, cls) { return s.art ? '<img class="' + (cls || 'cover') + '" src="' + esc(s.art) + '" width="' + size + '" height="' + size + '" alt="" loading="lazy">' : artTile(s, size); }
  function mmss(x) { x = Math.max(0, Math.round(x)); return Math.floor(x / 60) + ':' + ('0' + x % 60).slice(-2); }
  function artTile(s, size) {
    var h = 0, k = s.title + s.artist; for (var i = 0; i < k.length; i++) h = (h * 31 + k.charCodeAt(i)) % 360;
    return '<span class="art" style="width:' + size + 'px;height:' + size + 'px;background:linear-gradient(140deg,hsl(' + h + ',55%,42%),hsl(' + ((h + 50) % 360) + ',60%,22%))">' + esc(s.title.charAt(0)) + '</span>';
  }
  /* Lock screen "Now Playing": notification-sized, starts 1:23 in and keeps ticking while the lock screen is up */
  var npTimer = null;
  function nowPlayingMini() {
    var s = pinSong(); if (!s) return '';
    var total = +s.dur || 210, t0 = NP_T0, START = 83;
    clearInterval(npTimer);
    npTimer = setInterval(function () {
      var el = $('#lock .npc'); if (!el) return clearInterval(npTimer);
      if (unlocked) return;
      var t = (START + (Date.now() - t0) / 1000) % total;
      $('.npc-el', el).textContent = mmss(t); $('.npc-rem', el).textContent = '-' + mmss(total - t);
      $('.npc-bar b', el).style.width = (t / total * 100).toFixed(2) + '%';
    }, 1000);
    return '<div class="ntf npc">' +
      '<span class="npc-kicker">🎵 Check out what Dave\'s listening to</span>' +
      '<span class="ntf-ic">' + cover(s, 38) + '</span><span class="ntf-main"><span class="ntf-row"><button type="button" class="ntf-title npc-open">' + esc(s.title) + '</button>' +
      '<span class="ntf-time"></span></span><span class="ntf-body">' + esc(s.artist) + '</span>' +
      '<span class="npc-bar"><span class="npc-el">' + mmss(START) + '</span><i><b style="width:' + (START / total * 100).toFixed(2) + '%"></b></i><span class="npc-rem">-' + mmss(total - START) + '</span></span></span>' +
      '<a class="npc-play" href="' + esc(amUrl(s)) + '" target="_blank" rel="noopener" aria-label="Play ' + esc(s.title) + ' in Apple Music">' + SV.play + '</a></div>';
  }
  /* Phone home screen: compact Now Playing (one row), same running time as the lock screen (starts 1:23 in) */
  var NP_T0 = Date.now(), npHomeT = null;
  document.addEventListener('click', function (e) { var b = e.target.closest('.npm-open'); if (b) openApp('music', null, b); });
  function npTimes(total) { var t = (83 + (Date.now() - NP_T0) / 1000) % total; return { t: t, left: total - t, pct: t / total * 100 }; }
  function nowPlayingCard(cls) {
    var s = pinSong(); if (!s) return '';
    var total = +s.dur || 210, x = npTimes(total);
    clearInterval(npHomeT);
    npHomeT = setInterval(function () {
      var el = $('.np-mini'); if (!el) return clearInterval(npHomeT);
      var y = npTimes(total); $('.npm-el', el).textContent = mmss(y.t); $('.npm-rem', el).textContent = '-' + mmss(y.left); $('.npm-bar b', el).style.width = y.pct.toFixed(2) + '%';
    }, 1000);
    return '<div class="np-mini ' + (cls || '') + '"><button type="button" class="npm-open" data-open="music" aria-label="Open Music: ' + esc(s.title) + ' by ' + esc(s.artist) + '">' + cover(s, 44) +
      '<span class="npm-txt"><b>' + esc(s.title) + '</b><span>' + esc(s.artist) + '</span>' +
      '<span class="npm-bar"><span class="npm-el">' + mmss(x.t) + '</span><i><b style="width:' + x.pct.toFixed(2) + '%"></b></i><span class="npm-rem">-' + mmss(x.left) + '</span></span></span></button>' +
      '<a class="npm-play" href="' + esc(amUrl(s)) + '" target="_blank" rel="noopener" aria-label="Play ' + esc(s.title) + ' in Apple Music">' + SV.play + '</a></div>';
  }
  var SV = {
    play: '<svg width="34" height="34" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4.5v15l13-7.5z" fill="currentColor"/></svg>',
    prev: '<svg width="30" height="30" viewBox="0 0 24 24" aria-hidden="true"><path d="M11.5 6v12L3 12zM21 6v12l-8.5-6z" fill="currentColor"/></svg>',
    next: '<svg width="30" height="30" viewBox="0 0 24 24" aria-hidden="true"><path d="M12.5 6v12L21 12zM3 6v12l8.5-6z" fill="currentColor"/></svg>'
  };
  var IC = {
    shuffle: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M16 4h4v4M4 20 20 4M20 16v4h-4M15 15l5 5M4 4l5 5" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    repeat: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M17 2l3 3-3 3M4 11V9a4 4 0 0 1 4-4h12M7 22l-3-3 3-3M20 13v2a4 4 0 0 1-4 4H4" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    more: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="5" cy="12" r="2" fill="currentColor"/><circle cx="12" cy="12" r="2" fill="currentColor"/><circle cx="19" cy="12" r="2" fill="currentColor"/></svg>'
  };
  /* Music: styled after the Apple Music playlist view (black, red accents, Play / Shuffle, song rows, mini player) */
  function Music(root) {
    var M = S.music || { songs: [] }, L = M.songs, sk = (M.suggest || {}).turnstileSiteKey, cur = 0;
    var upd = M.updated ? new Date(M.updated).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '';
    var row = function (s) {
      var by = s.src === 'suggested' ? '<em> · Suggested by ' + esc(s.by || 'a visitor') + '</em>' : '';
      return '<a class="am-row" href="' + esc(amUrl(s)) + '" target="_blank" rel="noopener"><span class="am-star" aria-hidden="true">' + (s.fav ? '★' : '') + '</span>' +
        cover(s, 46, 'am-art') + '<span class="am-t"><b>' + esc(s.title) + '</b><span class="am-ar1">' + esc(s.artist) + by + '</span></span>' +
        '<span class="am-ar2">' + esc(s.artist) + '</span><span class="am-d">' + (s.dur ? mmss(s.dur) : '') + '</span><span class="am-more">' + IC.more + '</span></a>';
    };
    root.innerHTML = '<div class="app am"><div class="app-scroll">' +
      '<div class="am-h"><h2>' + esc(M.playlist || 'Music') + '</h2><span class="sub">' + L.length + ' songs' + (upd ? ' · updated ' + esc(upd) : '') + '</span></div>' +
      (L.length ? '<div class="am-btns"><a class="am-btn" href="' + esc(amUrl(L[0])) + '" target="_blank" rel="noopener">' + SV.play + 'Play</a>' +
        '<a class="am-btn" data-act="shuffle" href="' + esc(amUrl(L[0])) + '" target="_blank" rel="noopener">' + IC.shuffle + 'Shuffle</a></div>' : '') +
      (sk ? '<div class="sg-wrap"><button type="button" class="am-sg" data-act="suggest">+ Suggest a song</button></div>' +
        '<form class="sg" hidden novalidate><h3>Suggest a song</h3><p>Know something Dave should hear? It goes straight to him, never shown publicly.</p>' +
        '<label>Song<input name="title" maxlength="120" required autocomplete="off" placeholder="Essence"></label>' +
        '<label>Artist<input name="artist" maxlength="120" required autocomplete="off" placeholder="Wizkid"></label>' +
        '<label>Your name <i>optional</i><input name="by" maxlength="60" autocomplete="name"></label>' +
        '<label>Why he\'d like it <i>optional</i><textarea name="why" maxlength="280" rows="2"></textarea></label>' +
        '<div class="sg-ts"></div><p class="sg-err" role="alert"></p><div class="sg-btns"><button type="button" class="pill" data-act="sg-cancel">Cancel</button><button type="submit" class="pill primary">Send</button></div></form>' : '') +
      '<div class="am-list">' + L.map(row).join('') + '</div>' +
      '<p class="am-foot">Dave\'s favourites and what he\'s had on lately. Refreshed every Sunday. Songs open in Apple Music.</p></div>' +
      (L.length ? '<div class="am-mini"><button type="button" class="am-ic am-x" data-act="m-shuffle" aria-label="Shuffle">' + IC.shuffle + '</button>' +
        '<button type="button" class="am-ic" data-act="m-prev" aria-label="Previous">' + SV.prev + '</button>' +
        '<a class="am-ic am-play" target="_blank" rel="noopener" aria-label="Play in Apple Music">' + SV.play + '</a>' +
        '<button type="button" class="am-ic" data-act="m-next" aria-label="Next">' + SV.next + '</button>' +
        '<span class="am-ic am-x" aria-hidden="true">' + IC.repeat + '</span>' +
        '<a class="am-now" target="_blank" rel="noopener"></a><span class="am-ic am-x" aria-hidden="true">' + IC.more + '</span></div>' : '') + '</div>';
    // Mini player = what's "playing": starts on the lock-screen song, then ◀◀ / ▶▶ step through the playlist
    var pin = pinSong(), key = function (s) { return (s.title + '|' + s.artist).toLowerCase(); };
    var Q = pin && !L.some(function (s) { return key(s) === key(pin); }) ? [pin].concat(L) : L.slice();
    function show(i) {
      cur = (i + Q.length) % Q.length; var s = Q[cur], u = amUrl(s);
      $('.am-play', root).href = u; var n = $('.am-now', root); n.href = u;
      n.innerHTML = cover(s, 40, 'am-art') + '<span><b>' + esc(s.title) + '</b><span>' + esc(s.artist) + '</span></span>';
    }
    if (Q.length) show(pin ? Q.indexOf(pin) < 0 ? 0 : Q.indexOf(pin) : 0);
    root.addEventListener('click', function (e) {
      var a = e.target.closest('[data-act]'); if (!a) return;
      var act = a.dataset.act;
      if (act === 'shuffle') { e.preventDefault(); window.open(amUrl(L[Math.floor(Math.random() * L.length)]), '_blank', 'noopener'); }
      else if (act === 'm-next') show(cur + 1);
      else if (act === 'm-prev') show(cur - 1);
      else if (act === 'm-shuffle') show(Math.floor(Math.random() * Q.length));
    });
    if (sk) suggestForm(root, sk);
    return {};
  }


  /* ---------- Contacts: Dave's card. Front = details, back = pass with a QR that saves the contact. Flips on its own until touched. ---------- */
  function Contacts(root) {
    var A = S.about || {}, ua = navigator.userAgent || '';
    var dev = /iPhone|iPad|iPod/.test(ua) || (/Macintosh/.test(ua) && 'ontouchend' in document) ? 'ios' : /Android/.test(ua) ? 'android' : 'pc';
    var saveLbl = { ios: 'Add to Contacts', android: 'Save contact', pc: 'Download contact card' }[dev];
    var saveSub = { ios: 'Opens in your iPhone Contacts', android: 'Opens in your Android contacts', pc: 'A .vcf file for Outlook, Windows People or Mac Contacts' }[dev];
    var m = new Date().getMonth(), season = m < 2 || m === 11 ? 'WINTER' : m < 5 ? 'SPRING' : m < 8 ? 'SUMMER' : 'FALL';
    var albums = S.albums.filter(function (a) { return albumPhotos(a.id).length; }), cover = albums.length ? albumPhotos(albums[0].id)[0] : null;
    var ic = {
      mail: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></svg>',
      ig: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/></svg>',
      prints: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 8h8M8 12h8M8 16h5"/></svg>',
      save: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v12M7 10l5 5 5-5M5 21h14"/></svg>',
      flip: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12a8 8 0 0 1 14-5.3M20 12a8 8 0 0 1-14 5.3M18 3v4h-4M6 21v-4h4"/></svg>'
    };
    var row = function (k, v) { return v ? '<span class="ct-k">' + k + '</span><span class="ct-v">' + v + '</span>' : ''; };
    root.innerHTML = '<div class="app ct"><div class="app-scroll"><div class="ct-wrap">' +
      '<div class="ct-card" role="group" aria-label="Dave\'s contact card. Tap to flip."><div class="ct-inner">' +
        '<section class="ct-face ct-front" aria-label="Front">' +
          '<div class="ct-head"><span class="ct-av">DK</span><div><b>' + esc(A.name || S.name) + '</b><span>' + esc((A.role || 'Photographer') + ' · Rochester, NY') + '</span></div></div>' +
          '<div class="ct-acts">' +
            '<a href="mailto:' + esc(S.email) + '">' + ic.mail + 'mail</a>' +
            '<a href="https://instagram.com/' + esc(S.instagram) + '" target="_blank" rel="noopener">' + ic.ig + 'instagram</a>' +
            '<button type="button" data-act="prints">' + ic.prints + 'prints</button>' +
            '<a href="/dave-korr.vcf" download="Dave Korr.vcf">' + ic.save + 'save</a></div>' +
          '<div class="ct-rows">' + row('email', '<a href="mailto:' + esc(S.email) + '">' + esc(S.email) + '</a>') +
            row('instagram', '<a href="https://instagram.com/' + esc(S.instagram) + '" target="_blank" rel="noopener">@' + esc(S.instagram) + '</a>') +
            row('home', esc(A.home || '')) + row('available for', esc(A.availableFor || '')) + row('note', esc(A.bio || '')) + '</div>' +
        '</section>' +
        '<section class="ct-face ct-back" aria-label="Back: photographer pass">' +
          '<div class="ps-top"><span class="ps-logo">DK</span><b>davekorr.com</b><span class="ps-season"><i>SEASON</i>' + season + ' ' + new Date().getFullYear() + '</span></div>' +
          (cover ? '<img class="ps-img" src="' + esc(cover.md || cover.thumb) + '" alt="">' : '') +
          '<div class="ps-body"><div class="ps-f"><i>PHOTOGRAPHER</i><b class="ps-name">' + esc(A.name || S.name) + '</b></div>' +
          '<div class="ps-grid"><div class="ps-f"><i>BASE</i><b>Rochester, NY</b></div><div class="ps-f"><i>ROOTS</i><b>Kenya</b></div><div class="ps-f"><i>CAMERA</i><b>' + esc((A.camera || '').replace('Fujifilm ', 'Fuji ')) + '</b></div>' +
          '<div class="ps-f"><i>ALBUMS</i><b>' + albums.length + '</b></div><div class="ps-f"><i>PHOTOS</i><b>' + S.photos.length + '</b></div><div class="ps-f"><i>BEST LIGHT</i><b>Golden hour</b></div></div></div>' +
          '<div class="ps-qr"><img src="img/contact-qr.svg" alt="QR code that saves Dave\'s contact" width="96" height="96"><div><b>Scan to save my contact</b><span>Point any phone camera here. Works on iPhone and Android.</span></div></div>' +
        '</section>' +
      '</div></div>' +
      '<div class="ct-btns">' +
        '<a class="ct-btn primary" href="/dave-korr.vcf" download="Dave Korr.vcf">' + ic.save + '<span>' + saveLbl + '<small>' + saveSub + '</small></span></a></div>' +
      '<p class="ct-other">Tap the card to flip it. On another device? Scan the code on the back.</p>' +
      '</div></div></div>';
    var card = $('.ct-card', root), timers = [], flipped = false;
    function flip(v) { flipped = typeof v === 'boolean' ? v : !flipped; card.classList.toggle('flipped', flipped); }
    function stopAuto() { timers.forEach(clearTimeout); timers = []; }
    // Shows the back once (after 1 s), holds it for 2 s, turns back to the front, then stays there
    if (!reduce) timers = [setTimeout(function () { flip(true); }, 1000), setTimeout(function () { flip(false); }, 3000)];
    card.addEventListener('click', function (e) { if (e.target.closest('a,button')) return; stopAuto(); flip(); });
    root.addEventListener('click', function (e) {
      var b = e.target.closest('[data-act]'); if (!b) return; stopAuto();
      if (b.dataset.act === 'flip') flip();
      else if (b.dataset.act === 'prints') openApp('safari', { tab: 'shop' });
    });
    root.addEventListener('pointerdown', stopAuto);
    return { destroy: stopAuto };
  }

  /* "Suggest a song": Cloudflare Turnstile (spam check) + /api/suggest (Pages Function, stored privately in KV) */
  function suggestForm(root, siteKey) {
    var form = $('.sg', root), btn = $('[data-act="suggest"]', root), err = $('.sg-err', form), widget = null;
    function loadTS(cb) {
      if (window.turnstile) return cb();
      var s = document.createElement('script'); s.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'; s.async = true;
      s.onload = cb; s.onerror = function () { err.textContent = "Couldn't load the spam check. Try again later."; }; document.head.appendChild(s);
    }
    btn.onclick = function () {
      form.hidden = false; btn.hidden = true; $('input', form).focus();
      loadTS(function () { if (widget === null) widget = window.turnstile.render($('.sg-ts', form), { sitekey: siteKey, theme: 'dark', size: 'flexible' }); });
    };
    $('[data-act="sg-cancel"]', form).onclick = function () { form.hidden = true; btn.hidden = false; err.textContent = ''; };
    form.addEventListener('input', function () { err.textContent = ''; });
    form.onsubmit = function (e) {
      e.preventDefault();
      var d = { title: form.title.value.trim(), artist: form.artist.value.trim(), by: form.by.value.trim(), why: form.why.value.trim(),
                token: widget !== null && window.turnstile ? window.turnstile.getResponse(widget) : '' };
      if (!d.title || !d.artist) { err.textContent = 'Add the song and the artist.'; return; }
      if (!d.token) { err.textContent = 'Finish the quick check above first.'; return; }
      var send = $('[type=submit]', form); send.disabled = true; send.textContent = 'Sending…';
      fetch('/api/suggest', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(d) })
        .then(function (r) { return r.json().catch(function () { return {}; }).then(function (j) { return { ok: r.ok, j: j }; }); })
        .then(function (r) {
          if (!r.ok) throw new Error(r.j.error || 'Something went wrong');
          form.innerHTML = '<h3>Thanks!</h3><p>Dave will give "' + esc(d.title) + '" a listen.</p>';
        })
        .catch(function (x) { err.textContent = x.message + '. Try again.'; send.disabled = false; send.textContent = 'Send'; if (window.turnstile && widget !== null) window.turnstile.reset(widget); });
    };
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
  addEventListener('popstate', function () {
    if (Phone.skipPop) { Phone.skipPop = false; setPath(''); return; }
    if (mode === 'phone' && Phone.cur) Phone.close(false, true);
    if (mode === 'phone') setPath('');
  });
  var rt; addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(setMode, 150); });
  setMode(); tick(); setInterval(tick, 10000);
  /* Spotlight (computers only): ⌘K / Ctrl+K or the magnifier in the menu bar. Searches apps, albums,
     songs and quick actions; arrow keys + Enter, Esc closes. */
  var Spot = (function () {
    var el = null, items = [], hits = [], sel = 0;
    function build() {
      var go = function (id, o) { return function () { unlock(function () { openApp(id, o); }); }; };
      var link = function (u) { return function () { window.open(u, u.indexOf('mailto:') === 0 ? '_self' : '_blank', 'noopener'); }; };
      items = [];
      ['photos', 'music', 'contacts', 'notes', 'calendar', 'safari', 'camera', 'mail'].forEach(function (id) {
        if (APPS[id]) items.push({ kind: 'App', title: APPS[id].name, keys: id === 'contacts' ? 'about contact dave card' : id === 'safari' ? 'projects prints shop' : '', icon: id, run: go(id) });
      });
      S.albums.forEach(function (a) { if (albumPhotos(a.id).length) items.push({ kind: 'Album', title: a.name, keys: (a.pin || '') + ' photos ' + (a.eyebrow || ''), icon: 'photos', run: go('photos', { album: a.id }) }); });
      items.push({ kind: 'Action', title: 'Email Dave', keys: 'contact mail hello', icon: 'mail', run: link('mailto:' + S.email) });
      items.push({ kind: 'Action', title: 'Save Dave\'s contact card', keys: 'vcard download contact about', icon: 'contacts', run: function () { location.href = '/dave-korr.vcf'; } });
      items.push({ kind: 'Action', title: 'Now: what Dave is up to', keys: 'now currently update shooting', icon: 'safari', run: go('safari', { tab: 'now' }) });
      items.push({ kind: 'Action', title: 'Reading list', keys: 'books reading what dave reads ' + (S.reading || []).map(function (b) { return b.title + ' ' + b.author; }).join(' '), icon: 'safari', run: go('safari', { tab: 'reading' }) });
      items.push({ kind: 'Action', title: 'Buy a print', keys: 'prints shop store', icon: 'safari', run: go('safari', { tab: 'shop' }) });
      items.push({ kind: 'Action', title: 'Suggest a song', keys: 'music recommend playlist', icon: 'music', run: function () { unlock(function () { openApp('music'); setTimeout(function () { var b = document.querySelector('.am [data-act="suggest"]'); if (b) b.click(); }, 400); }); } });
      items.push({ kind: 'Action', title: 'Instagram @' + S.instagram, keys: 'instagram social follow', icon: 'instagram', run: link('https://instagram.com/' + S.instagram) });
      ((S.music || {}).songs || []).forEach(function (t) { items.push({ kind: 'Song', title: t.title, sub: t.artist, keys: t.artist, icon: 'music', run: link(amUrl(t)) }); });
    }
    function search(q) {
      q = q.trim().toLowerCase();
      if (!q) return items.filter(function (i) { return i.kind === 'App' || i.kind === 'Action'; }).slice(0, 8);
      return items.map(function (i) {
        var t = i.title.toLowerCase(), k = ((i.sub || '') + ' ' + (i.keys || '')).toLowerCase();
        var sc = t.indexOf(q) === 0 ? 3 : t.indexOf(' ' + q) > -1 ? 2 : t.indexOf(q) > -1 ? 1.5 : k.indexOf(q) > -1 ? 1 : 0;
        return { i: i, sc: sc && sc + (i.kind === 'App' ? .3 : i.kind === 'Album' ? .2 : 0) };
      }).filter(function (x) { return x.sc > 0; }).sort(function (a, b) { return b.sc - a.sc; }).slice(0, 9).map(function (x) { return x.i; });
    }
    function draw() {
      var list = $('.sp-list', el);
      list.innerHTML = hits.length ? hits.map(function (h, n) {
        return '<button type="button" class="sp-item' + (n === sel ? ' on' : '') + '" data-n="' + n + '" role="option" aria-selected="' + (n === sel) + '">' +
          '<span class="sp-ic">' + icon(h.icon) + '</span><span class="sp-t"><b>' + esc(h.title) + '</b>' + (h.sub ? '<span>' + esc(h.sub) + '</span>' : '') + '</span><i>' + h.kind + '</i></button>';
      }).join('') : '<p class="sp-none">No matches. Try "Letchworth", "music" or "contact".</p>';
      var on = $('.sp-item.on', el); if (on) on.scrollIntoView({ block: 'nearest' });
    }
    function open() {
      if (mode !== 'mac') return;
      if (!el) {
        el = document.createElement('div'); el.className = 'sp'; el.hidden = true;
        el.innerHTML = '<div class="sp-box" role="dialog" aria-label="Search davekorr.com"><div class="sp-in"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.5 15.5L21 21"/></svg>' +
          '<input type="search" placeholder="Search photos, albums, music, contact…" aria-label="Search" autocomplete="off" spellcheck="false"><kbd>esc</kbd></div><div class="sp-list" role="listbox"></div></div>';
        document.body.appendChild(el);
        var inp = $('input', el);
        inp.addEventListener('input', function () { hits = search(inp.value); sel = 0; draw(); });
        inp.addEventListener('keydown', function (e) {
          if (e.key === 'ArrowDown') { e.preventDefault(); sel = Math.min(sel + 1, hits.length - 1); draw(); }
          else if (e.key === 'ArrowUp') { e.preventDefault(); sel = Math.max(sel - 1, 0); draw(); }
          else if (e.key === 'Enter' && hits[sel]) { var h = hits[sel]; close(); h.run(); }
          else if (e.key === 'Escape') close();
        });
        el.addEventListener('click', function (e) {
          var b = e.target.closest('.sp-item'); if (b) { var h = hits[+b.dataset.n]; close(); h.run(); return; }
          if (!e.target.closest('.sp-box')) close();
        });
      }
      build(); el.hidden = false; var inp2 = $('input', el); inp2.value = ''; hits = search(''); sel = 0; draw(); inp2.focus();
    }
    function close() { if (el) el.hidden = true; }
    document.addEventListener('keydown', function (e) {
      if ((e.metaKey || e.ctrlKey) && (e.key === 'k' || e.key === 'K')) { if (mode !== 'mac') return; e.preventDefault(); if (el && !el.hidden) close(); else open(); }
    });
    $('#mbSearch').addEventListener('click', open);
    return { open: open, close: close };
  })();

  // Deep links: davekorr.com/photos/<album>, /music, /contact ... skip the lock screen and open that app.
  // Old portfolio links (#albums, #album-<id>) still work.
  (function () {
    var r = routeFromPath();
    if (r) { unlock(function () { openApp(r.id, r.opts); }); return; }
    if (location.pathname !== '/') setPath('');
    var h = (location.hash || '').slice(1); if (!h) return;
    if (h === 'albums') unlock(function () { openApp('photos', { tab: 'albums' }); });
    else if (h.indexOf('album-') === 0 && S.albums.some(function (a) { return a.id === h.slice(6); })) unlock(function () { openApp('photos', { album: h.slice(6) }); });
  })();
})();
