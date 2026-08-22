#!/usr/bin/env bash
# Re-stamps every page's stylesheet link with the current content hash of
# styles.css. Run after ANY edit to styles.css, before committing.
#
# Why: Cloudflare caches styles.css for four hours (max-age=14400) and a
# stylesheet served under an unchanging URL cannot tell the cache its bytes
# changed. A hash in the query string makes a changed stylesheet a new URL,
# so visitors get it immediately instead of whenever their edge copy expires.
set -euo pipefail
cd "$(dirname "$0")"
H=$(shasum -a 256 styles.css | cut -c1-8)
python3 - "$H" <<'PY'
import re, glob, sys
h = sys.argv[1]; n = 0
for f in glob.glob('**/*.html', recursive=True):
    if '/.git/' in f: continue
    s = open(f, encoding='utf-8').read()
    s2 = re.sub(r'(href="(?:\.\./)*/?styles\.css)(?:\?v=[^"]*)?"', r'\1?v=' + h + '"', s)
    if s2 != s:
        open(f, 'w', encoding='utf-8').write(s2); n += 1
print(f"styles.css?v={h} stamped on {n} page(s)")
PY
