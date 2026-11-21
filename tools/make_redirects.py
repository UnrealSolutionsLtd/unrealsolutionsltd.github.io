"""Generate redirect pages for old URLs that search engines still know about.

GitHub Pages can't send real 301 redirects, so each old URL gets a tiny HTML
page with a canonical link, a 0-second meta refresh and a JS redirect. Google
treats that as a permanent redirect. Anything not listed here falls through to
the root 404.html, which applies the same rules in JS.

Run from the repo root:  python tools/make_redirects.py
"""
import os

SITE = 'https://unrealsolutions.com'
DOCS = '/docs/products/runtime-video-recorder'

# Old RVR docs lived under /products/runtime-video-recorder/ before /docs/ existed.
DOC_PAGES = ['faq', 'quick-start', 'installation', 'troubleshooting', 'project-settings', 'how-to']
HOWTO = ['boss-fights', 'bug-report-button', 'crash-recovery', 'hotkey-recording', 'instant-replay',
         'minimap-replay', 'multi-camera', 'no-voice-chat', 'photo-mode', 'security-camera', 'time-lapse']
API = ['encoder-settings', 'events', 'runtime-video-recorder']

REDIRECTS = {}
for p in DOC_PAGES:
    REDIRECTS[f'products/runtime-video-recorder/{p}.html'] = f'{DOCS}/{p}'
for p in HOWTO:
    REDIRECTS[f'products/runtime-video-recorder/how-to/{p}.html'] = f'{DOCS}/how-to/{p}'
for p in API:
    REDIRECTS[f'products/runtime-video-recorder/api/{p}.html'] = f'{DOCS}/api/{p}'

# Removed products and articles.
for p in ['index', 'unity', 'unreal-engine', 'vs-betahub']:
    REDIRECTS[f'products/bugit/{p}.html'] = '/products/'
REDIRECTS['products/bugit/index.html'] = '/products/'
REDIRECTS['products/cinematic-director/index.html'] = '/products/'
REDIRECTS['insights/ai-game-testing-vlm-agents.html'] = '/insights/unreal-engine-ai-agents-mcp.html'
REDIRECTS['insights/cannot-reproduce-bugs-cost.html'] = '/insights/video-recording-game-testing-roi.html'
REDIRECTS['agents/bugit.html'] = '/agents/'

TEMPLATE = '''<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Moved</title>
  <link rel="canonical" href="{url}">
  <meta http-equiv="refresh" content="0; url={url}">
  <script>location.replace("{path}" + location.search + location.hash);</script>
</head>
<body>
  <p>This page has moved to <a href="{url}">{url}</a>.</p>
</body>
</html>
'''

if __name__ == '__main__':
    root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    for src, dst in sorted(REDIRECTS.items()):
        out = os.path.join(root, src)
        os.makedirs(os.path.dirname(out), exist_ok=True)
        with open(out, 'w', encoding='utf-8', newline='\n') as f:
            f.write(TEMPLATE.format(url=SITE + dst, path=dst))
    print(f'{len(REDIRECTS)} redirect pages written')
