#!/usr/bin/env python3
"""davekorr.com photo publisher.

Reads album folders in Titan's "15 Web" share, makes one web master per photo
(max 3000px, sRGB, no metadata = no GPS), uploads new/changed masters to the
Cloudflare R2 bucket behind images.davekorr.com, then writes the photo list
(manifest) the website reads.

  publish-site               -> upload + write manifest-preview.js (preview site only)
  publish-site --dry-run     -> build masters locally, upload nothing
  publish-site --live        -> copy the current preview manifest to manifest.js (live site)
                                and post "N new photos in <album>" to news.js (the lock-screen notification)

Fails loud: any error stops the run with a non-zero exit, nothing half-published.
"""
import argparse, hashlib, json, os, subprocess, sys, tempfile, time, urllib.request
from datetime import datetime, timezone

WEB = os.environ.get('DK_WEB_DIR', '/Volumes/photos/15 Web')
BUCKET = 'davekorr-images'
BASE = 'https://images.davekorr.com'
HERE = os.path.dirname(os.path.abspath(__file__))
STATE = os.path.join(HERE, 'state.json')
MAX = 3000

def die(msg):
    print(f'\n✖ {msg}', file=sys.stderr); sys.exit(1)

def wrangler(*args, stdin=None):
    cmd = ['npx', '--yes', 'wrangler@4'] + list(args)
    r = subprocess.run(cmd, capture_output=True, text=True, input=stdin)
    if r.returncode != 0:
        die('wrangler failed: ' + ' '.join(args[:4]) + '\n' + (r.stderr or r.stdout)[-1500:])
    return r.stdout

def put(key, path, ctype, cache):
    wrangler('r2', 'object', 'put', f'{BUCKET}/{key}', '--file', path, '--content-type', ctype,
             '--cache-control', cache, '--remote')

def head_ok(key, size=None):
    # curl instead of urllib: avoids Python certificate-store problems on macOS
    r = subprocess.run(['curl', '-sSI', '--max-time', '30', f'{BASE}/{key}?check={int(time.time())}'], capture_output=True, text=True)
    if r.returncode != 0 or not r.stdout.startswith(('HTTP/2 200', 'HTTP/1.1 200')): return False
    if size is None: return True
    for line in r.stdout.splitlines():
        if line.lower().startswith('content-length:'): return int(line.split(':')[1]) == size
    return True

def num(v):
    try:
        if isinstance(v, tuple): return v[0] / v[1]
        return float(v)
    except Exception:
        return None

def fmt_meta(e):
    from PIL import ExifTags
    ex = e.get_ifd(0x8769)
    taken = ex.get(36867) or e.get(306) or ''
    iso_taken = ''
    if taken:
        try: iso_taken = datetime.strptime(str(taken)[:19], '%Y:%m:%d %H:%M:%S').strftime('%Y-%m-%dT%H:%M')
        except ValueError: pass
    fl, fn, ss, iso = num(ex.get(37386)), num(ex.get(33437)), num(ex.get(33434)), ex.get(34855)
    model = str(e.get(272, '') or '').strip(); make = str(e.get(271, '') or '').strip()
    return {
        'taken': iso_taken,
        'camera': (make + ' ' + model).strip() if model and make and not model.upper().startswith(make.upper()) else model,
        'lens': str(ex.get(42036, '') or '').strip(),
        'fl': f'{round(fl)}mm' if fl else '',
        'f': f'f/{fn:g}' if fn else '',
        'ss': (f'1/{round(1/ss)}' if ss < 1 else f'{ss:g}') if ss else '',
        'iso': str(iso) if iso else '',
    }

def make_master(src, out):
    from PIL import Image, ImageOps, ImageCms
    im = Image.open(src); meta = fmt_meta(im.getexif())
    im = ImageOps.exif_transpose(im).convert('RGB')
    im.thumbnail((MAX, MAX), Image.LANCZOS)
    srgb = ImageCms.ImageCmsProfile(ImageCms.createProfile('sRGB')).tobytes()
    # Only copyright info goes into the file (never GPS or camera serials): Artist, Copyright, and an
    # XMP note that AI training / data mining is not allowed (IPTC "Data Mining: prohibited")
    year = (meta.get('taken') or '')[:4] or time.strftime('%Y')
    ex = Image.Exif(); ex[0x013B] = 'Dave Korir'; ex[0x8298] = f'Copyright {year} Dave Korir (Dave Korr). All rights reserved. No AI training.'  # EXIF text is plain ASCII
    xmp = ('<x:xmpmeta xmlns:x="adobe:ns:meta/"><rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#">'
           '<rdf:Description xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:xmpRights="http://ns.adobe.com/xap/1.0/rights/" '
           'xmlns:plus="http://ns.useplus.org/ldf/xmp/1.0/">'
           f'<dc:creator><rdf:Seq><rdf:li>Dave Korir</rdf:li></rdf:Seq></dc:creator>'
           f'<dc:rights><rdf:Alt><rdf:li xml:lang="x-default">© {year} Dave Korir (Dave Korr). All rights reserved.</rdf:li></rdf:Alt></dc:rights>'
           '<xmpRights:Marked>True</xmpRights:Marked><xmpRights:WebStatement>https://davekorr.com/copyright</xmpRights:WebStatement>'
           '<plus:DataMining>http://ns.useplus.org/ldf/vocab/DMI-PROHIBITED</plus:DataMining>'
           '</rdf:Description></rdf:RDF></x:xmpmeta>')
    kw = dict(quality=90, optimize=True, progressive=True, icc_profile=srgb, exif=ex.tobytes())
    try: im.save(out, 'JPEG', xmp=xmp.encode(), **kw)        # Pillow 11+ can write XMP
    except TypeError: im.save(out, 'JPEG', **kw)
    return im.size, meta

def sha(path):
    h = hashlib.sha256()
    with open(path, 'rb') as f:
        for b in iter(lambda: f.read(1 << 20), b''): h.update(b)
    return h.hexdigest()

def albums():
    if not os.path.isdir(WEB): die(f'Titan is not mounted: {WEB} not found. Mount the "photos" share in Finder first.')
    out = {}
    for a in sorted(os.listdir(WEB)):
        d = os.path.join(WEB, a)
        if a.startswith(('_', '.')) or not os.path.isdir(d): continue
        files = sorted(f for f in os.listdir(d) if f.lower().endswith(('.jpg', '.jpeg')) and not f.startswith('.'))
        if files: out[a] = [os.path.join(d, f) for f in files]
    if not out: die('No photos found in any album folder of 15 Web.')
    return out

def manifest_js(photos):
    data = {'base': BASE, 'generated': datetime.now(timezone.utc).strftime('%Y-%m-%dT%H:%MZ'), 'photos': photos}
    return 'window.R2_MANIFEST=' + json.dumps(data, separators=(',', ':')) + ';\n'

def fetch_js(name, var):
    """Read one of the site's data files (e.g. manifest.js) back from images.davekorr.com. None if missing."""
    try:
        raw = urllib.request.urlopen(urllib.request.Request(f'{BASE}/{name}?t={int(time.time())}',
                                     headers={'User-Agent': 'davekorr-publish/1.0'}), timeout=20).read().decode()
    except Exception:
        return None
    raw = raw.strip()
    if not raw.startswith(f'window.{var}='): return None
    return json.loads(raw[len(f'window.{var}='):].rstrip(';'))

def live_keys():
    m = fetch_js('manifest.js', 'R2_MANIFEST')
    return None if m is None else {p['key'] for p in m.get('photos', [])}

def post_news(before, prev_path):
    """Lock-screen news: one line per album that gained photos in this go-live. Keeps the newest 10."""
    if before is None:
        print('  (news: could not read the old live list, so no "new photos" notification this time)'); return
    prev = json.loads(open(prev_path).read().strip()[len('window.R2_MANIFEST='):].rstrip(';'))
    added = {}
    for p in prev['photos']:
        if p['key'] not in before: added[p['album']] = added.get(p['album'], 0) + 1
    if not added:
        print('  (news: no new photos, nothing to announce)'); return
    now = datetime.now(timezone.utc).strftime('%Y-%m-%dT%H:%MZ')
    news = fetch_js('news.js', 'R2_NEWS') or []
    news = [{'at': now, 'kind': 'photos', 'album': a, 'count': n} for a, n in added.items()] + news
    path = os.path.join(tempfile.mkdtemp(prefix='dknews-'), 'news.js')
    open(path, 'w').write('window.R2_NEWS=' + json.dumps(news[:10], separators=(',', ':')) + ';\n')
    put('news.js', path, 'application/javascript', 'no-cache')
    print('  Lock-screen news: ' + ', '.join(f'{n} new in {a}' for a, n in added.items()))

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--dry-run', action='store_true')
    ap.add_argument('--live', action='store_true')
    ap.add_argument('--limit', type=int, default=0)
    a = ap.parse_args()

    if a.live:
        prev = os.path.join(HERE, 'manifest-preview.js')
        if not os.path.exists(prev): die('No preview manifest yet. Run publish-site first and check the preview.')
        before = live_keys()                       # what visitors saw until now
        put('manifest.js', prev, 'application/javascript', 'no-cache')
        if not head_ok('manifest.js', os.path.getsize(prev)): die('Live manifest upload could not be verified.')
        print('✔ Live: davekorr.com now shows the photos from your last preview.')
        post_news(before, prev); return

    state = json.load(open(STATE)) if os.path.exists(STATE) else {}
    alb = albums(); photos = []; up = skip = 0; n = 0
    work = tempfile.mkdtemp(prefix='dkpub-')
    print(f'Albums: ' + ', '.join(f'{k} ({len(v)})' for k, v in alb.items()))
    for album, files in alb.items():
        for src in files:
            n += 1
            if a.limit and n > a.limit: break
            stem = os.path.splitext(os.path.basename(src))[0].replace(' ', '_')
            digest = sha(src); rec = state.get(f'{album}/{stem}')
            if rec and rec.get('sha') == digest and not a.dry_run:
                photos.append(rec['photo']); skip += 1; continue
            out = os.path.join(work, stem + '.jpg')
            (w, h), meta = make_master(src, out)
            key = f'albums/{album}/{stem}-{digest[:8]}.jpg'
            photo = dict(id=stem, album=album, key=key, w=w, h=h, **meta)
            if a.dry_run:
                print(f'  [dry] {key}  {w}x{h}  {os.path.getsize(out)//1024} KB  {meta["taken"]}')
            else:
                put(key, out, 'image/jpeg', 'public, max-age=31536000, immutable')
                if not head_ok(key, os.path.getsize(out)): die(f'Uploaded {key} but could not read it back from {BASE}.')
                state[f'{album}/{stem}'] = {'sha': digest, 'photo': photo}
                json.dump(state, open(STATE, 'w'), indent=1)  # save progress after every photo
                print(f'  ↑ {key}')
            photos.append(photo); up += 1
    photos.sort(key=lambda p: (p['album'], p['taken'] or '', p['id']))
    js = manifest_js(photos)
    prev = os.path.join(HERE, 'manifest-preview.js')
    if a.dry_run:
        open(os.path.join(work, 'manifest-preview.js'), 'w').write(js)
        print(f'\nDry run OK: {up} masters built in {work}. Nothing uploaded.'); return
    open(prev, 'w').write(js)
    put('manifest-preview.js', prev, 'application/javascript', 'no-cache')
    if not head_ok('manifest-preview.js', os.path.getsize(prev)): die('Preview manifest upload could not be verified.')
    print(f'\n✔ Preview updated: {up} uploaded, {skip} unchanged, {len(photos)} photos total.')
    print('  Check https://r2-images.davekorr-web.pages.dev — then run: publish-site --live')

if __name__ == '__main__':
    main()
