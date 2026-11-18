"""Zero-dependency local server for the offline demo and optional AI drafts."""
from __future__ import annotations

import argparse
import json
import os
import socket
import urllib.error
import urllib.request
from http import HTTPStatus
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

ALLOWED_KINDS = {"email", "plan", "landing_page", "linkedin"}
MAX_BODY = 50_000


def configured() -> tuple[str, str, str] | None:
    base_url = os.getenv("OPENAI_BASE_URL", "").rstrip("/")
    model = os.getenv("OPENAI_MODEL", "")
    api_key = os.getenv("OPENAI_API_KEY", "")
    return (base_url, model, api_key) if base_url and model and api_key else None


def generate(payload: dict) -> str:
    if payload.get("kind") not in ALLOWED_KINDS:
        raise ValueError("不支持的生成任务类型")
    config = configured()
    if not config:
        raise RuntimeError("AI 服务未配置：请设置 OPENAI_BASE_URL、OPENAI_MODEL 和 OPENAI_API_KEY")
    base_url, model, api_key = config
    requirements = payload.get("requirements")
    if not isinstance(requirements, dict):
        raise ValueError("需要已保存的需求摘要")
    prompt = {
        "role": "user",
        "content": "Generate only the requested draft for this simulated case. Do not invent product facts. "
        + json.dumps({"kind": payload["kind"], "target": payload.get("target", "unspecified"), "task_purpose": payload.get("task_purpose"), "case": payload.get("case"), "product_facts": "RelayChat AI is a simulated China-based B2B SaaS for Shopify merchants with multilingual AI customer support; it has an English site and early overseas trials. Do not claim unsupported capabilities or outcomes.", "requirements": requirements, "confirmed_plan": payload.get("confirmed_plan")}, ensure_ascii=False),
    }
    request = urllib.request.Request(
        f"{base_url}/chat/completions",
        data=json.dumps({"model": model, "messages": [prompt], "temperature": 0.2}).encode("utf-8"),
        headers={"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"},
        method="POST",
    )
    try:
        with urllib.request.urlopen(request, timeout=float(os.getenv("OPENAI_TIMEOUT_SECONDS", "15"))) as response:
            result = json.loads(response.read().decode("utf-8"))
    except (TimeoutError, socket.timeout) as exc:
        raise TimeoutError("AI 服务超时") from exc
    except (urllib.error.URLError, urllib.error.HTTPError) as exc:
        raise ConnectionError("AI 服务请求失败") from exc
    choices = result.get("choices")
    if not isinstance(choices, list) or not choices or not isinstance(choices[0], dict):
        raise ValueError("AI 服务响应缺少 choices[0]")
    message = choices[0].get("message")
    if not isinstance(message, dict):
        raise ValueError("AI 服务响应缺少 message")
    content = message.get("content")
    if not isinstance(content, str) or not content.strip():
        raise ValueError("AI 服务返回的内容无效")
    return content.strip()


class Handler(SimpleHTTPRequestHandler):
    STATIC_FILES = {"/", "/index.html", "/styles.css", "/app.mjs", "/demo-data.mjs", "/logic.mjs", "/workflow.mjs", "/favicon.ico"}

    def do_GET(self) -> None:
        if self.path not in self.STATIC_FILES:
            self.send_error(HTTPStatus.NOT_FOUND)
            return
        super().do_GET()

    def send_json(self, status: int, data: dict) -> None:
        body = json.dumps(data, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_POST(self) -> None:
        if self.path != "/api/generate":
            self.send_error(HTTPStatus.NOT_FOUND)
            return
        origin = self.headers.get("Origin")
        if origin and origin != f"http://{self.headers.get('Host')}":
            self.send_json(HTTPStatus.FORBIDDEN, {"error": "只接受同源浏览器请求"})
            return
        try:
            length = int(self.headers.get("Content-Length", "0"))
            if length <= 0 or length > MAX_BODY:
                raise ValueError("请求体无效或过大")
            payload = json.loads(self.rfile.read(length).decode("utf-8"))
            if not isinstance(payload, dict):
                raise ValueError("请求必须是对象")
            self.send_json(HTTPStatus.OK, {"content": generate(payload), "source": "真实 AI 生成（兼容 OpenAI）"})
        except RuntimeError as exc:
            self.send_json(HTTPStatus.SERVICE_UNAVAILABLE, {"error": str(exc)})
        except TimeoutError as exc:
            self.send_json(HTTPStatus.GATEWAY_TIMEOUT, {"error": str(exc)})
        except (ValueError, json.JSONDecodeError, UnicodeDecodeError) as exc:
            self.send_json(HTTPStatus.BAD_REQUEST, {"error": str(exc)})
        except (ConnectionError, urllib.error.HTTPError) as exc:
            self.send_json(HTTPStatus.BAD_GATEWAY, {"error": "AI 服务请求失败"})


def create_server(port: int) -> ThreadingHTTPServer:
    return ThreadingHTTPServer(("127.0.0.1", port), lambda *args, **kwargs: Handler(*args, directory=str(Path(__file__).parent), **kwargs))


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--port", type=int, default=4174)
    args = parser.parse_args()
    create_server(args.port).serve_forever()
