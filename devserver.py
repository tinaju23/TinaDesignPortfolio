#!/usr/bin/env python3
"""Local dev server that disables caching, so browsers always fetch the
latest file instead of serving a stale snapshot (including inline <style>
and <script> content) from disk/bfcache."""
import sys
from http.server import HTTPServer, SimpleHTTPRequestHandler

class NoCacheHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()

if __name__ == '__main__':
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8743
    HTTPServer(('', port), NoCacheHandler).serve_forever()
