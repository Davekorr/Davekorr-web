// Builds one real HTML page per section (davekorr.com/photos/letchworth, /music, /contact ...)
// so links can be shared and search engines / link previews see real titles, text and images.
// Each page is index.html with its own <title>, description, preview image and a text summary for
// screen readers and search engines. The site's code then opens the matching app on load.
// Run by stamp.sh. Reads config.js and tools/pages/r2-manifest.js (snapshot of the live photo list).
const fs = require('fs'), path = require('path'), vm = require('vm');
const ROOT = path.join(__dirname, '..', '..'), ORIGIN = 'https://davekorr.com';
const box = { window: {} }; vm.createContext(box);
vm.runInContext(fs.readFileSync(path.join(ROOT, 'config.js'), 'utf8'), box);
const S = box.window.SITE;
let R2 = [];
try { const m = { window: {} }; vm.createContext(m); vm.runInContext(fs.readFileSync(path.join(__dirname, 'r2-manifest.js'), 'utf8'), m); R2 = m.window.R2_MANIFEST.photos; } catch (e) {}
const esc = s => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const abs = u => /^https?:/.test(u) ? u : ORIGIN + '/' + u.replace(/^\//, '');
const r2img = (key, w) => `https://images.davekorr.com/cdn-cgi/image/width=${w},quality=82,fit=scale-down,format=jpeg/${key}`;
function albumPhotos(id) {
  const local = (S.photos || []).filter(p => p.album === id).map(p => ({ title: p.title, alt: p.alt, img: abs(p.src) }));
  const text = (S.r2 && S.r2.text) || {};
  const r2 = R2.filter(p => p.album === id).map(p => ({ title: (text[p.id] || {}).title || '', alt: (text[p.id] || {}).alt || '', img: r2img(p.key, 1200) }));
  const mode = ((S.r2 && S.r2.albums) || {})[id];
  return mode === 'append' ? local.concat(r2) : (r2.length ? r2 : local);
}
const albums = S.albums.map(a => ({ ...a, photos: albumPhotos(a.id) })).filter(a => a.photos.length);
const DEF_IMG = abs('img/hero.webp'), INTRO = (S.about && S.about.bio) || 'Photographer based in Rochester, New York.';
const albumLinks = () => '<ul>' + albums.map(a => `<li><a href="/photos/${a.id}">${esc(a.name)}</a> (${a.photos.length} photos)</li>`).join('') + '</ul>';
const nav = '<nav><a href="/">Home</a> · <a href="/photos">Photos</a> · <a href="/music">Music</a> · <a href="/contact">Contact</a> · <a href="/prints">Prints</a></nav>';
const pages = [
  { p: '', title: 'Dave Korr — Photographer', desc: 'Dave Korr — photographer based in Rochester, New York. ' + INTRO,
    body: `<h1>Dave Korr</h1><p>${esc(INTRO)}</p>${nav}<h2>Albums</h2>${albumLinks()}` },
  { p: 'photos', title: 'Photos — Dave Korr', desc: 'Photo albums by Dave Korr: upstate New York, Rochester and the cities he travels through.',
    body: `<h1>Photos by Dave Korr</h1>${nav}${albumLinks()}` },
  ...albums.map(a => ({ p: 'photos/' + a.id, title: a.name + ' — Dave Korr', img: a.photos[0].img,
    desc: `${a.name}: ${a.photos.length} photographs by Dave Korr.` + (a.story && a.story.length ? ' ' + a.story[0] : ''),
    body: `<h1>${esc(a.name)}</h1><p>${a.photos.length} photographs by Dave Korr.</p>${nav}<ul>` +
      a.photos.map(ph => `<li>${esc(ph.title || ph.alt)}${ph.alt && ph.alt !== ph.title ? ': ' + esc(ph.alt) : ''}</li>`).join('') + '</ul>' })),
  { p: 'music', title: 'Music — Dave Korr', desc: "Dave's favourites and what he's had on lately. Refreshed every Sunday. Suggest a song.",
    body: `<h1>Music</h1><p>Dave's favourites and what he's had on lately. Refreshed every Sunday.</p>${nav}` },
  { p: 'contact', title: 'Contact — Dave Korr', desc: 'Get in touch with Dave Korr, photographer in Rochester, NY. Email, Instagram and a contact card to save.',
    body: `<h1>Contact Dave Korr</h1><p>${esc(INTRO)}</p><p>Email: <a href="mailto:${esc(S.email)}">${esc(S.email)}</a> · Instagram: <a href="https://instagram.com/${esc(S.instagram)}">@${esc(S.instagram)}</a> · <a href="/dave-korr.vcf">Save contact card</a></p>${nav}` },
  { p: 'about', alias: 'contact' },
  { p: 'prints', title: 'Prints — Dave Korr', desc: 'Signed prints by Dave Korr, made to order.', body: `<h1>Prints</h1><p>Signed prints, made to order.</p>${nav}` },
  { p: 'notes', title: 'Notes — Dave Korr', desc: 'Field notes from Dave Korr.', body: `<h1>Notes</h1>${nav}` }
];
const tpl = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
const byP = Object.fromEntries(pages.filter(x => !x.alias).map(x => [x.p, x]));
const sitemap = [];
for (const pg of pages) {
  const src = pg.alias ? { ...byP[pg.alias], p: pg.p } : pg;
  const url = ORIGIN + '/' + (pg.alias ? pg.alias : pg.p), img = src.img || DEF_IMG;
  const meta = `<!--META-->\n<title>${esc(src.title)}</title>\n<meta name="description" content="${esc(src.desc)}">\n` +
    `<link rel="canonical" href="${url}">\n<meta property="og:type" content="website">\n<meta property="og:site_name" content="Dave Korr">\n` +
    `<meta property="og:title" content="${esc(src.title)}">\n<meta property="og:description" content="${esc(src.desc)}">\n<meta property="og:url" content="${url}">\n` +
    `<meta property="og:image" content="${esc(img)}">\n<meta name="twitter:card" content="summary_large_image">\n<!--/META-->`;
  let html = tpl.replace(/<!--META-->[\s\S]*?<!--\/META-->/, meta)
                .replace(/<!--SEO-->[\s\S]*?<!--\/SEO-->/, `<!--SEO--><main id="seo" class="sr-only">${src.body}</main><!--/SEO-->`);
  const out = pg.p ? path.join(ROOT, pg.p, 'index.html') : path.join(ROOT, 'index.html');
  fs.mkdirSync(path.dirname(out), { recursive: true }); fs.writeFileSync(out, html);
  if (!pg.alias) sitemap.push(url);
}
fs.writeFileSync(path.join(ROOT, 'sitemap.xml'), '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
  sitemap.map(u => `  <url><loc>${u}</loc></url>`).join('\n') + '\n</urlset>\n');
fs.writeFileSync(path.join(ROOT, 'robots.txt'), 'User-agent: *\nAllow: /\n\nSitemap: ' + ORIGIN + '/sitemap.xml\n');
console.log('pages:', pages.length, '| albums:', albums.map(a => a.id + '(' + a.photos.length + ')').join(' '));
