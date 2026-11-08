#!/bin/sh
# Run after editing app.js/config.js/styles.css/map.js: updates ?v= stamps in index.html so browsers fetch the new files.
cd "$(dirname "$0")" && python3 - <<'PY'
import hashlib,re
h=open('index.html').read()
for f in ['styles.css','config.js','map.js','app.js']:
    v=hashlib.md5(open(f,'rb').read()).hexdigest()[:8]
    h=re.sub(r'(["\'])'+re.escape(f)+r'(\?v=[0-9a-f]+)?\1', r'\g<1>'+f+'?v='+v+r'\1', h)
open('index.html','w').write(h)
print('stamped')
PY
