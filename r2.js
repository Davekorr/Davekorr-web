/* davekorr.com — photos served from Cloudflare R2 (images.davekorr.com).
   Runs after config.js and the manifest, before app.js.
   The manifest (written by tools/publish/publish-site) lists every photo in Titan's "15 Web" folders.
   If the manifest can't load, the site simply keeps the photos listed in config.js. */
(function () {
  'use strict';
  var S = window.SITE, M = window.R2_MANIFEST;
  if (!S || !M || !M.photos || !M.photos.length) return;
  var R = S.r2 || {}, base = M.base || 'https://images.davekorr.com';
  // Cloudflare resizes on the fly: one master per photo, any width we ask for, WebP/AVIF when the browser supports it
  var sized = function (key, w) { return base + '/cdn-cgi/image/width=' + w + ',quality=82,fit=scale-down,format=auto/' + key; };
  var titleCase = function (id) { return id.replace(/-/g, ' ').replace(/\b\w/g, function (c) { return c.toUpperCase(); }); };

  var byAlbum = {};
  M.photos.forEach(function (p) { (byAlbum[p.album] = byAlbum[p.album] || []).push(p); });

  Object.keys(byAlbum).forEach(function (a) {
    var mode = (R.albums || {})[a] || 'replace';
    if (mode === 'skip') return;
    var album = S.albums.filter(function (x) { return x.id === a; })[0];
    if (!album) { album = { id: a, name: titleCase(a), eyebrow: 'Portfolio', story: [] }; S.albums.unshift(album); } // new folder = new album
    var text = R.text || {};
    var fresh = byAlbum[a].map(function (p) {
      var t = text[p.id] || {};
      return {
        id: 'r2-' + a + '-' + p.id, album: a, r2: p.key, w: p.w, h: p.h,
        thumb: sized(p.key, 520), md: sized(p.key, 1200), src: sized(p.key, 2000), zoom: base + '/' + p.key,
        title: t.title || '', alt: t.alt || t.title || album.name + ' photo',
        taken: p.taken || undefined, camera: p.camera, lens: p.lens, fl: p.fl, f: p.f, ss: p.ss, iso: p.iso
      };
    });
    var order = (R.order || {})[a];
    if (order) fresh.sort(function (x, y) { return order.indexOf(x.id.split('-').pop()) - order.indexOf(y.id.split('-').pop()); });
    var legacy = S.photos.filter(function (p) { return p.album === a; });
    S.photos = S.photos.filter(function (p) { return p.album !== a; });
    var list = mode === 'append' ? legacy.concat(fresh) : fresh;
    S.photos = S.photos.concat(list);
  });
  // keep the site's rule: photos appear in album order (newest album first)
  var rank = {}; S.albums.forEach(function (a, i) { rank[a.id] = i; });
  S.photos = S.photos.map(function (p, i) { return [p, i]; })
    .sort(function (x, y) { return ((rank[x[0].album] ?? 999) - (rank[y[0].album] ?? 999)) || (x[1] - y[1]); })
    .map(function (x) { return x[0]; });
})();
