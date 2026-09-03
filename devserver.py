#!/usr/bin/env python3
"""Local dev server that disables caching, so browsers always fetch the
latest file instead of serving a stale snapshot (including inline <style>
and <script> content) from disk/bfcache. Threaded, so one long-lived
connection (e.g. a streaming <video>) cannot block every other request.

Also mirrors Vercel's cleanUrls + rewrites (vercel.json) so /portfolio
serves portfolio.html and /work serves index.html locally."""
import os
import sys
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler

REWRITES = {'/work': '/index.html', '/contact': '/index.html'}

class NoCacheHandler(SimpleHTTPRequestHandler):
    def translate_path(self, path):
        clean = path.split('?', 1)[0].split('#', 1)[0]
        if clean in REWRITES:
            clean = REWRITES[clean]
        elif clean != '/' and not os.path.splitext(clean)[1]:
            candidate = super().translate_path(clean + '.html')
            if os.path.isfile(candidate):
                clean += '.html'
        return super().translate_path(clean)

    def end_headers(self):
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()

if __name__ == '__main__':
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8743
    ThreadingHTTPServer(('', port), NoCacheHandler).serve_forever()
