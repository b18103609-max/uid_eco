#!/usr/bin/env python3
"""Small allow-listed guest-token broker for embedded Superset dashboards."""

from __future__ import annotations

import base64
import hashlib
import hmac
import json
import os
import time
from http import HTTPStatus
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import parse_qs, urlparse


DASHBOARDS = json.loads(
    Path(__file__).with_name("dashboards.json").read_text(encoding="utf-8")
)
JWT_SECRET = os.environ["GUEST_TOKEN_JWT_SECRET"].encode()
JWT_AUDIENCE = os.getenv("GUEST_TOKEN_JWT_AUDIENCE", "superset")
ALLOWED_ORIGINS = {
    origin.strip()
    for origin in os.getenv("EMBED_ALLOWED_ORIGINS", "").split(",")
    if origin.strip()
}
TOKEN_LIFETIME_SECONDS = min(int(os.getenv("GUEST_TOKEN_LIFETIME_SECONDS", "300")), 600)


def b64url(value: bytes) -> str:
    return base64.urlsafe_b64encode(value).rstrip(b"=").decode("ascii")


def token_for(dashboard: str) -> str:
    now = int(time.time())
    header = {"alg": "HS256", "typ": "JWT"}
    payload = {
        "user": {"username": "uid-embedded", "first_name": "UID", "last_name": "Viewer"},
        "resources": [{"type": "dashboard", "id": DASHBOARDS[dashboard]}],
        "rls_rules": [],
        "iat": now,
        "exp": now + TOKEN_LIFETIME_SECONDS,
        "aud": JWT_AUDIENCE,
        "type": "guest",
    }
    signing_input = ".".join(
        b64url(json.dumps(part, separators=(",", ":")).encode())
        for part in (header, payload)
    )
    signature = hmac.new(JWT_SECRET, signing_input.encode(), hashlib.sha256).digest()
    return f"{signing_input}.{b64url(signature)}"


class Handler(BaseHTTPRequestHandler):
    server_version = "UIDGuestToken/1.0"

    def send_json(self, status: HTTPStatus, body: dict[str, object], origin: str | None = None) -> None:
        payload = json.dumps(body, ensure_ascii=False).encode()
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(payload)))
        self.send_header("Cache-Control", "no-store")
        self.send_header("X-Content-Type-Options", "nosniff")
        if origin in ALLOWED_ORIGINS:
            self.send_header("Access-Control-Allow-Origin", origin)
            self.send_header("Vary", "Origin")
        self.end_headers()
        self.wfile.write(payload)

    def do_OPTIONS(self) -> None:  # noqa: N802
        origin = self.headers.get("Origin")
        if origin not in ALLOWED_ORIGINS:
            self.send_json(HTTPStatus.FORBIDDEN, {"error": "origin_not_allowed"})
            return
        self.send_response(HTTPStatus.NO_CONTENT)
        self.send_header("Access-Control-Allow-Origin", origin)
        self.send_header("Access-Control-Allow-Methods", "GET, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.send_header("Access-Control-Max-Age", "600")
        self.send_header("Vary", "Origin")
        self.end_headers()

    def do_HEAD(self) -> None:  # noqa: N802
        if urlparse(self.path).path != "/health":
            self.send_response(HTTPStatus.NOT_FOUND)
        else:
            self.send_response(HTTPStatus.OK)
        self.end_headers()

    def do_GET(self) -> None:  # noqa: N802
        parsed = urlparse(self.path)
        if parsed.path == "/health":
            self.send_json(HTTPStatus.OK, {"status": "ok"})
            return
        if parsed.path != "/api/guest-token":
            self.send_json(HTTPStatus.NOT_FOUND, {"error": "not_found"})
            return

        origin = self.headers.get("Origin")
        if origin not in ALLOWED_ORIGINS:
            self.send_json(HTTPStatus.FORBIDDEN, {"error": "origin_not_allowed"})
            return
        dashboard = parse_qs(parsed.query).get("dashboard", [""])[0]
        if dashboard not in DASHBOARDS:
            self.send_json(HTTPStatus.NOT_FOUND, {"error": "unknown_dashboard"}, origin)
            return
        self.send_json(HTTPStatus.OK, {"token": token_for(dashboard)}, origin)

    def log_message(self, format: str, *args: object) -> None:
        print(f"{self.address_string()} - {format % args}", flush=True)


if __name__ == "__main__":
    ThreadingHTTPServer(("0.0.0.0", 8090), Handler).serve_forever()
