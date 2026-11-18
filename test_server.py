import json
import os
import threading
import time
import unittest
import urllib.error
import urllib.request
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from unittest.mock import patch

import server


class Upstream(BaseHTTPRequestHandler):
    mode = "success"
    def do_POST(self):
        if self.mode == "slow": time.sleep(0.15)
        if self.mode == "error": self.send_response(500); self.end_headers(); return
        shape = {"empty": {"choices": []}, "missing_message": {"choices": [{}]}, "invalid_json": b"not-json"}
        payload = shape.get(self.mode, {"choices": [{"message": {"content": "Generated draft"}}]})
        body = payload if isinstance(payload, bytes) else json.dumps(payload).encode()
        try:
            self.send_response(200); self.send_header("Content-Type", "application/json"); self.send_header("Content-Length", str(len(body))); self.end_headers(); self.wfile.write(body)
        except (BrokenPipeError, ConnectionAbortedError):
            pass
    def log_message(self, *_): pass


class ServerTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.upstream = ThreadingHTTPServer(("127.0.0.1", 0), Upstream); threading.Thread(target=cls.upstream.serve_forever, daemon=True).start()
    @classmethod
    def tearDownClass(cls): cls.upstream.shutdown()
    def payload(self): return {"kind": "plan", "case": "RelayChat AI", "requirements": {"clientSaid": "two-week, RMB 15000"}}
    def test_unconfigured(self):
        with patch.dict(os.environ, {}, clear=True):
            with self.assertRaisesRegex(RuntimeError, "未配置"): server.generate(self.payload())
    def test_success_error_and_timeout(self):
        base = f"http://127.0.0.1:{self.upstream.server_port}"
        with patch.dict(os.environ, {"OPENAI_BASE_URL": base, "OPENAI_MODEL": "fake", "OPENAI_API_KEY": "fake", "OPENAI_TIMEOUT_SECONDS": "0.05"}, clear=True):
            Upstream.mode = "success"; self.assertEqual(server.generate(self.payload()), "Generated draft")
            Upstream.mode = "error"; self.assertRaises(ConnectionError, server.generate, self.payload())
            Upstream.mode = "slow"; self.assertRaises(TimeoutError, server.generate, self.payload())
            Upstream.mode = "empty"; self.assertRaisesRegex(ValueError, "choices", server.generate, self.payload())
            Upstream.mode = "missing_message"; self.assertRaisesRegex(ValueError, "message", server.generate, self.payload())
            Upstream.mode = "invalid_json"; self.assertRaisesRegex(ValueError, "JSON|Expecting", server.generate, self.payload())


if __name__ == "__main__": unittest.main()
