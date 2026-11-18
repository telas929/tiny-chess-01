"""Unit tests for makefun_agent.py (stdlib unittest). They run only inside python:3.13-slim:
tests/unit/agent-sdk.test.ts executes ``python3 -P -s /sdk/test_makefun_agent.py`` with
``PYTHONHASHSEED=0``, as the grader runs an entry, and reads RNG_VECTORS and NOW_VECTORS from this file to
hold the TypeScript twin to the same values.
"""

import collections
import datetime
import http.server
import json
import os
import sys
import tempfile
import threading
import time
import unittest

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

import makefun_agent as sdk  # noqa: E402

# What both twins draw (tests/unit/agent-sdk.test.ts checks makefun-agent.ts against these same lines).
RNG_VECTORS = {"u64": {"seed": "42", "label": "", "values": ["4137094702334473335", "5318256015188640443", "1020154753782104900", "4228938176729436454", "6734875358881523287"]}, "labelled": {"seed": "42", "label": "catalogue", "values": ["6876644466993197191", "4480409280243318058", "9118656323424270704"]}, "floats": {"seed": "7", "label": "f", "values": [0.9394197187425578, 0.8457166492913037, 0.8022636755324389]}, "ints": {"seed": "7", "label": "ints", "lo": -3, "hi": 9, "values": [-2, 9, 0, 3, 9, 8, 1, 1]}, "shuffle": {"seed": "99", "label": "shuffle", "items": ["a", "b", "c", "d", "e", "f", "g"], "values": ["g", "d", "a", "b", "c", "f", "e"], "pick": "x"}}
NOW_VECTORS = [["2026-11-02T09:00:00Z", 1793610000000, "2026-11-02T09:00:00.000Z"], ["2026-11-02T09:00:00.123456Z", 1793610000123, "2026-11-02T09:00:00.123Z"], ["2026-11-02T04:00:00-05:00", 1793610000000, "2026-11-02T09:00:00.000Z"], ["2024-02-29T23:59:59+14:00", 1709200799000, "2024-02-29T09:59:59.000Z"], ["1793610000000", 1793610000000, "2026-11-02T09:00:00.000Z"]]
BAD_NOWS = ["", "2026-11-02", "2026-11-02T09:00:00", "2026-02-29T00:00:00Z", "2026-13-01T00:00:00Z", "2026-11-02T24:00:00Z", "2026-11-02 09:00:00Z", "1969-12-31T23:59:59Z", "2026-11-02T09:00:00+24:00", "now", "-5"]

GRAPHQL_PATH = "/admin/api/2026-10/graphql.json"
TOKEN = "-".join(["fixture", "shop", "access"])


class FakeServer:
    """A loopback HTTP server answering scripted responses in order and recording every request."""

    def __init__(self):
        self.script = collections.deque()
        self.seen = []
        self.in_flight = 0
        self.max_in_flight = 0
        self._lock = threading.Lock()
        fake = self

        class Handler(http.server.BaseHTTPRequestHandler):
            def log_message(self, *args):
                pass

            def _serve(self):
                length = int(self.headers.get("Content-Length") or 0)
                body = self.rfile.read(length) if length else b""
                with fake._lock:
                    fake.in_flight += 1
                    fake.max_in_flight = max(fake.max_in_flight, fake.in_flight)
                    fake.seen.append({"method": self.command, "path": self.path, "headers": {k.lower(): v for k, v in self.headers.items()}, "body": body})
                    status, payload, delay = fake.script.popleft() if fake.script else (500, {"error": "script ran out"}, 0)
                if delay:
                    time.sleep(delay)
                raw = payload if isinstance(payload, bytes) else json.dumps(payload).encode("utf-8")
                with fake._lock:
                    fake.in_flight -= 1
                self.send_response(status)
                self.send_header("Content-Type", "application/json")
                self.send_header("Content-Length", str(len(raw)))
                self.end_headers()
                self.wfile.write(raw)

            do_GET = _serve
            do_POST = _serve

        self.httpd = http.server.ThreadingHTTPServer(("127.0.0.1", 0), Handler)
        self.port = self.httpd.server_address[1]
        self.thread = threading.Thread(target=self.httpd.serve_forever, daemon=True)
        self.thread.start()

    def url(self, path=""):
        return f"http://127.0.0.1:{self.port}{path}"

    def answer(self, status, payload, delay=0):
        self.script.append((status, payload, delay))

    def close(self):
        self.httpd.shutdown()
        self.httpd.server_close()


def env_for(server, prompt_file, **extra):
    env = {
        "MAKEFUN_PROMPT_FILE": prompt_file,
        "MAKEFUN_SHOP_GRAPHQL_URL": server.url(GRAPHQL_PATH),
        "MAKEFUN_SHOP_TOKEN": TOKEN,
        "MAKEFUN_TRIAL_SEED": "42",
        "MAKEFUN_TRIAL_NOW": "2026-11-02T09:00:00Z",
        "ANTHROPIC_BASE_URL": server.url(),
        "OPENAI_BASE_URL": server.url("/v1"),
        "ANTHROPIC_API_KEY": "makefun-trial",
        "OPENAI_API_KEY": "makefun-trial",
    }
    env.update(extra)
    return {k: v for k, v in env.items() if v is not None}


class Base(unittest.TestCase):
    def setUp(self):
        self.server = FakeServer()
        self.dir = tempfile.mkdtemp()
        self.prompt_file = os.path.join(self.dir, "prompt.txt")
        with open(self.prompt_file, "wb") as f:
            f.write("\ufeffSell calm ceramics.\r\nShip to US.\n".encode("utf-8"))
        self.trial = sdk.read_trial(env_for(self.server, self.prompt_file))

    def tearDown(self):
        self.server.close()


class TrialTest(Base):
    def test_reads_the_trial(self):
        t = self.trial
        self.assertEqual(t.prompt, "Sell calm ceramics.\r\nShip to US.\n")
        self.assertEqual(t.shop_graphql_url, self.server.url(GRAPHQL_PATH))
        self.assertEqual(t.shop_token, TOKEN)
        self.assertEqual(t.supplier_url, self.server.url("/supplier/v1"))
        self.assertEqual(t.seed, "42")
        self.assertEqual(t.now_ms, 1793610000000)
        self.assertEqual(t.now_iso, "2026-11-02T09:00:00.000Z")
        self.assertEqual(t.anthropic.base_url, self.server.url())
        self.assertEqual(t.openai.base_url, self.server.url("/v1"))
        self.assertEqual(t.anthropic.api_key, "makefun-trial")

    def test_defaults_and_explicit_supplier(self):
        t = sdk.read_trial(env_for(self.server, self.prompt_file, ANTHROPIC_BASE_URL=None, OPENAI_BASE_URL="", ANTHROPIC_API_KEY=None, MAKEFUN_SUPPLIER_URL="http://store:8080/supplier/v1/"))
        self.assertEqual(t.anthropic.base_url, sdk.DEFAULT_ANTHROPIC_BASE_URL)
        self.assertEqual(t.anthropic.api_key, "")
        self.assertEqual(t.openai.base_url, sdk.DEFAULT_OPENAI_BASE_URL)
        self.assertEqual(t.supplier_url, "http://store:8080/supplier/v1")

    def test_env_url(self):
        self.assertEqual(self.trial.env_url, self.server.url(), "unset, the shop's origin")
        t = sdk.read_trial(env_for(self.server, self.prompt_file, MAKEFUN_ENV_URL="http://store:8080/"))
        self.assertEqual((t.env_url, sdk.env_url(t)), ("http://store:8080", "http://store:8080"))
        self.assertEqual(sdk.read_trial(env_for(self.server, self.prompt_file, MAKEFUN_ENV_URL=" ")).env_url, self.server.url())
        with self.assertRaisesRegex(sdk.TrialConfigError, "MAKEFUN_ENV_URL is not an http"):
            sdk.read_trial(env_for(self.server, self.prompt_file, MAKEFUN_ENV_URL="store:8080"))
        self.assertEqual(sdk.env_url(env={"MAKEFUN_ENV_URL": "http://store:8080/"}), "http://store:8080")
        with self.assertRaisesRegex(sdk.TrialConfigError, "MAKEFUN_ENV_URL is not set"):
            sdk.env_url(env={})
        old = sdk.Trial("p", "p.txt", "http://store:8080" + GRAPHQL_PATH, TOKEN, "http://store:8080/supplier/v1", "42", 0, self.trial.anthropic, self.trial.openai)
        self.assertEqual(old.env_url, "http://store:8080", "a Trial built without env_url takes the shop's origin")

    def test_missing_and_bad_values_name_the_variable(self):
        for name in ("MAKEFUN_PROMPT_FILE", "MAKEFUN_SHOP_GRAPHQL_URL", "MAKEFUN_SHOP_TOKEN", "MAKEFUN_TRIAL_SEED", "MAKEFUN_TRIAL_NOW"):
            with self.assertRaisesRegex(sdk.TrialConfigError, name):
                sdk.read_trial(env_for(self.server, self.prompt_file, **{name: None}))
        with self.assertRaisesRegex(sdk.TrialConfigError, "MAKEFUN_SHOP_GRAPHQL_URL is not an http"):
            sdk.read_trial(env_for(self.server, self.prompt_file, MAKEFUN_SHOP_GRAPHQL_URL="ftp://store/graphql"))
        with self.assertRaisesRegex(sdk.TrialConfigError, "cannot read the prompt"):
            sdk.read_trial(env_for(self.server, os.path.join(self.dir, "missing.txt")))
        bad = os.path.join(self.dir, "bad.txt")
        with open(bad, "wb") as f:
            f.write(b"\xff\xfe")
        with self.assertRaisesRegex(sdk.TrialConfigError, "as UTF-8"):
            sdk.read_trial(env_for(self.server, bad))

    def test_trial_now(self):
        for text, ms, iso in NOW_VECTORS:
            self.assertEqual(sdk.parse_trial_now(text), ms, text)
            self.assertEqual(sdk.format_ms(ms), iso)
        for text in BAD_NOWS:
            with self.assertRaises(sdk.TrialConfigError, msg=text):
                sdk.parse_trial_now(text)
        now = sdk.trial_now(self.trial)
        self.assertEqual(now, datetime.datetime(2026, 11, 2, 9, 0, tzinfo=datetime.timezone.utc))
        self.assertEqual(sdk.trial_now(env={"MAKEFUN_TRIAL_NOW": "2026-11-02T10:00:00+01:00"}), now)


class RngTest(unittest.TestCase):
    def test_vectors(self):
        v = RNG_VECTORS
        r = sdk.Rng(v["u64"]["seed"])
        self.assertEqual([str(r.next_u64()) for _ in v["u64"]["values"]], v["u64"]["values"])
        r = sdk.Rng(v["labelled"]["seed"], v["labelled"]["label"])
        self.assertEqual([str(r.next_u64()) for _ in v["labelled"]["values"]], v["labelled"]["values"])
        r = sdk.Rng(v["floats"]["seed"], v["floats"]["label"])
        self.assertEqual([r.random() for _ in v["floats"]["values"]], v["floats"]["values"])
        r = sdk.Rng(v["ints"]["seed"], v["ints"]["label"])
        self.assertEqual([r.randint(v["ints"]["lo"], v["ints"]["hi"]) for _ in v["ints"]["values"]], v["ints"]["values"])
        r = sdk.Rng(v["shuffle"]["seed"], v["shuffle"]["label"])
        self.assertEqual(r.shuffle(list(v["shuffle"]["items"])), v["shuffle"]["values"])
        self.assertEqual(r.choice(["x", "y", "z"]), v["shuffle"]["pick"])

    def test_streams(self):
        self.assertEqual(sdk.Rng(42).next_u64(), sdk.Rng("42").next_u64())
        trial = type("T", (), {"seed": "42"})()
        self.assertEqual(sdk.trial_rng(trial, "catalogue").next_u64(), sdk.Rng("42", "catalogue").next_u64())
        self.assertNotEqual(sdk.Rng("42", "a").next_u64(), sdk.Rng("42", "b").next_u64())
        r = sdk.Rng("1", "bounds")
        draws = [r.randint(5, 7) for _ in range(300)]
        self.assertEqual(sorted(set(draws)), [5, 6, 7])
        self.assertTrue(all(0 <= sdk.Rng("2").random() < 1 for _ in range(10)))
        with self.assertRaises(ValueError):
            r.randint(3, 2)
        with self.assertRaises(IndexError):
            r.choice([])
        with self.assertRaises(TypeError):
            sdk.Rng(True)


class StoreTest(Base):
    def test_graphql_sends_the_token_and_returns_the_answer(self):
        store = sdk.StoreClient(self.trial)
        self.server.answer(200, {"data": {"shop": {"name": "Lumen"}}, "extensions": {"cost": {"requestedQueryCost": 1}}})
        r = store.graphql("query($n: Int) { shop { name } }", {"n": 1}, "Q")
        self.assertEqual(r["data"], {"shop": {"name": "Lumen"}})
        seen = self.server.seen[0]
        self.assertEqual((seen["method"], seen["path"]), ("POST", GRAPHQL_PATH))
        self.assertEqual(seen["headers"]["x-shopify-access-token"], TOKEN)
        self.assertEqual(seen["headers"]["content-type"], "application/json")
        self.assertEqual(seen["body"], b'{"query":"query($n: Int) { shop { name } }","variables":{"n":1},"operationName":"Q"}')
        self.assertEqual(store.requests, 1)

    def test_throttled_is_retried_and_errors_raise(self):
        store = sdk.StoreClient(self.trial, max_throttle_retries=2)
        throttled = {"errors": [{"message": "Throttled", "extensions": {"code": "THROTTLED"}}]}
        self.server.answer(200, throttled)
        self.server.answer(200, {"data": {"ok": True}})
        self.assertEqual(store.request("{ ok }"), {"ok": True})
        self.assertEqual(store.requests, 2)
        for _ in range(3):
            self.server.answer(200, throttled)
        self.assertEqual(store.graphql("{ ok }"), throttled)
        self.assertEqual(store.requests, 5)
        self.server.answer(200, {"errors": [{"message": "Field 'nope' doesn't exist", "extensions": {"code": "undefinedField"}}]})
        with self.assertRaisesRegex(sdk.GraphQLRequestError, "undefinedField: Field 'nope'"):
            store.request("{ nope }")
        self.server.answer(401, {"errors": "[API] Invalid access token"})
        with self.assertRaises(sdk.StoreHttpError) as caught:
            store.graphql("{ ok }")
        self.assertEqual(caught.exception.status, 401)
        self.server.answer(200, b"<html>")
        with self.assertRaisesRegex(sdk.StoreHttpError, "not JSON"):
            store.graphql("{ ok }")

    def test_one_request_at_a_time_in_call_order(self):
        store = sdk.StoreClient(self.trial)
        for i in range(4):
            self.server.answer(200, {"data": {"i": i}}, delay=0.05)
        results = {}

        def call(i):
            results[i] = store.request("query { i }", {"i": i})

        threads = []
        for i in range(4):
            t = threading.Thread(target=call, args=(i,))
            threads.append(t)
            t.start()
            time.sleep(0.01)
        for t in threads:
            t.join()
        self.assertEqual(self.server.max_in_flight, 1)
        self.assertEqual([json.loads(s["body"])["variables"]["i"] for s in self.server.seen], [0, 1, 2, 3])

    def test_supplier(self):
        store = sdk.StoreClient(self.trial)
        self.server.answer(200, {"products": [], "total": 0})
        self.server.answer(409, {"error": {"code": "OUT_OF_STOCK", "message": "out", "line": 0}})
        r = store.supplier_get("/products", {"query": "pot plant", "category": None, "first": 5, "inStock": True})
        self.assertEqual(r, {"status": 200, "body": {"products": [], "total": 0}})
        r = store.supplier_post("/quotes", {"lines": [{"sku": "A", "quantity": 1}], "countryCode": "US"})
        self.assertEqual(r["status"], 409)
        self.assertEqual(r["body"]["error"]["code"], "OUT_OF_STOCK")
        get, post = self.server.seen
        self.assertEqual((get["method"], get["path"]), ("GET", "/supplier/v1/products?query=pot+plant&first=5&inStock=true"))
        self.assertEqual((post["method"], post["path"], post["body"]), ("POST", "/supplier/v1/quotes", b'{"lines":[{"sku":"A","quantity":1}],"countryCode":"US"}'))
        with self.assertRaises(ValueError):
            store.supplier("GET", "products")

    def test_proxies_are_ignored(self):
        store = sdk.StoreClient(self.trial)
        self.server.answer(200, {"data": {"ok": True}})
        saved = {k: os.environ.get(k) for k in ("http_proxy", "HTTP_PROXY", "no_proxy", "NO_PROXY")}
        os.environ.update({"http_proxy": "http://127.0.0.1:9", "HTTP_PROXY": "http://127.0.0.1:9", "no_proxy": "", "NO_PROXY": ""})
        try:
            self.assertEqual(store.request("{ ok }"), {"ok": True})
        finally:
            for k, v in saved.items():
                if v is None:
                    os.environ.pop(k, None)
                else:
                    os.environ[k] = v


class LlmTest(Base):
    def test_anthropic_messages(self):
        delays = []
        llm = sdk.Anthropic(self.trial, sleep=delays.append)
        reply = {"id": "msg_1", "type": "message", "role": "assistant", "model": "m", "content": [{"type": "text", "text": "hi"}], "stop_reason": "end_turn", "stop_sequence": None, "usage": {}}
        self.server.answer(529, {"type": "error", "error": {"type": "overloaded_error", "message": "busy"}})
        self.server.answer(200, reply)
        body = {"model": "claude-haiku-5-5", "max_tokens": 64, "messages": [{"role": "user", "content": "hello"}]}
        self.assertEqual(llm.messages(body), reply)
        self.assertEqual(delays, [1.0])
        first, second = self.server.seen
        self.assertEqual((second["method"], second["path"]), ("POST", "/v1/messages"))
        self.assertEqual(second["headers"]["anthropic-version"], sdk.ANTHROPIC_VERSION)
        self.assertEqual(second["headers"]["x-api-key"], "makefun-trial")
        self.assertEqual(first["body"], second["body"])
        self.assertEqual(json.loads(second["body"]), body)

    def test_refusals_are_final_and_errors_carry_the_type(self):
        delays = []
        llm = sdk.Anthropic(self.trial, sleep=delays.append)
        self.server.answer(429, {"type": "error", "error": {"type": "budget_exhausted", "message": "spent"}})
        with self.assertRaises(sdk.LlmRefusalError) as caught:
            llm.messages({"model": "m", "max_tokens": 8, "messages": []})
        self.assertEqual((caught.exception.status, caught.exception.type, caught.exception.route), (429, "budget_exhausted", "anthropic.messages"))
        self.assertEqual(delays, [])
        for _ in range(3):
            self.server.answer(503, {"type": "error", "error": {"type": "api_error", "message": "down"}})
        with self.assertRaises(sdk.LlmError) as caught:
            llm.messages({"model": "m", "max_tokens": 8, "messages": []})
        self.assertNotIsInstance(caught.exception, sdk.LlmRefusalError)
        self.assertEqual(delays, [1.0, 2.0])
        self.assertEqual(len(self.server.seen), 4)
        self.server.answer(400, {"type": "error", "error": {"type": "invalid_request_error", "message": "bad"}})
        with self.assertRaisesRegex(sdk.LlmError, "400 invalid_request_error: bad"):
            llm.messages({"model": "m", "max_tokens": 8, "messages": []})
        with self.assertRaisesRegex(ValueError, "max_tokens"):
            llm.messages({"model": "m", "messages": []})
        with self.assertRaisesRegex(ValueError, "stream"):
            llm.messages({"model": "m", "max_tokens": 8, "messages": [], "stream": True})
        dead = sdk.Anthropic(sdk.LlmEndpoint("http://127.0.0.1:9"), sleep=delays.append)
        with self.assertRaises(sdk.LlmError) as caught:
            dead.messages({"model": "m", "max_tokens": 8, "messages": []})
        self.assertEqual(caught.exception.status, 0)

    def test_openai_chat(self):
        llm = sdk.OpenAI(self.trial, sleep=lambda s: None)
        reply = {"id": "c1", "object": "chat.completion", "model": "m", "choices": [{"index": 0, "message": {"role": "assistant", "content": "hi"}, "finish_reason": "stop"}]}
        self.server.answer(200, reply)
        self.assertEqual(llm.chat({"model": "gpt-5-mini", "max_completion_tokens": 32, "messages": [{"role": "user", "content": "hello"}]}), reply)
        seen = self.server.seen[0]
        self.assertEqual((seen["method"], seen["path"]), ("POST", "/v1/chat/completions"))
        self.assertEqual(seen["headers"]["authorization"], "Bearer makefun-trial")
        self.server.answer(429, {"error": {"type": "request_cap", "code": "request_cap", "message": "cap"}})
        with self.assertRaises(sdk.LlmRefusalError):
            llm.chat({"model": "m", "max_tokens": 8, "messages": []})
        with self.assertRaisesRegex(ValueError, "max_completion_tokens"):
            llm.chat({"model": "m", "messages": []})
        self.server.answer(200, {"data": [{"id": "gpt-5-mini"}]})
        self.assertEqual(llm.models(), {"data": [{"id": "gpt-5-mini"}]})
        self.assertEqual(self.server.seen[-1]["path"], "/v1/models")


if __name__ == "__main__":
    unittest.main()
