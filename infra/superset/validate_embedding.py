#!/usr/bin/env python3
"""Validate the public guest-token flow and guest access to a chart."""

from __future__ import annotations

import json
import os
import urllib.request
from pathlib import Path

from bootstrap_superset import SupersetApi, load_env


BASE_URL = os.getenv("SUPERSET_PUBLIC_URL", "https://94.125.100.176")
ORIGIN = os.getenv("EMBED_ORIGIN", "https://b18103609-max.github.io")
BOOTSTRAP_RESULT = json.loads(Path("bootstrap-result.json").read_text(encoding="utf-8"))
OVERVIEW_DASHBOARD = BOOTSTRAP_RESULT["dashboards"]["overview"]
OVERVIEW_CHART_ID = OVERVIEW_DASHBOARD["charts"][0]["id"]


def read_json(request: urllib.request.Request) -> dict[str, object]:
    with urllib.request.urlopen(request, timeout=30) as response:
        return json.loads(response.read())


broker_request = urllib.request.Request(
    f"{BASE_URL}/api/guest-token?dashboard=overview",
    headers={"Origin": ORIGIN},
)
token = read_json(broker_request)["token"]
if os.getenv("PRINT_DASHBOARD_CHARTS") == "true":
    dashboard_charts = read_json(urllib.request.Request(
        f"{BASE_URL}/api/v1/dashboard/{OVERVIEW_DASHBOARD['id']}/charts",
        headers={"X-GuestToken": str(token)},
    ))
    print(json.dumps(dashboard_charts, ensure_ascii=False, indent=2))
if os.getenv("VALIDATE_METADATA") == "true":
    metadata_request = urllib.request.Request(
        f"{BASE_URL}/api/v1/chart/{OVERVIEW_CHART_ID}?q=(columns:!(owners.first_name,owners.last_name),keys:!(none))",
        headers={"X-GuestToken": str(token)},
    )
    read_json(metadata_request)
env = {**load_env(), **os.environ}
api_url = os.getenv("SUPERSET_INTERNAL_URL") or env.get("SUPERSET_PUBLIC_ORIGIN")
admin = SupersetApi(env["SUPERSET_ADMIN_USERNAME"], env["SUPERSET_ADMIN_PASSWORD"], api_url)
query_file = os.getenv("QUERY_CONTEXT_FILE")
if query_file:
    query_context = Path(query_file).read_bytes()
else:
    saved_chart = admin.get(f"/api/v1/chart/{OVERVIEW_CHART_ID}")["result"]
    query_context = saved_chart["query_context"].encode()
chart_request = urllib.request.Request(
    f"{BASE_URL}/api/v1/chart/data",
    data=query_context,
    method="POST",
    headers={
        "Content-Type": "application/json",
        "X-GuestToken": str(token),
        "Referer": f"{BASE_URL}/embedded/1f44ca22-e850-4fa5-8d6e-c4289bf054dd",
    },
)
chart = read_json(chart_request)
if os.getenv("PRINT_RESPONSE") == "true":
    print(json.dumps(chart, ensure_ascii=False, indent=2))
result = chart.get("result", [])
if not result or result[0].get("status") != "success":
    raise SystemExit(f"Embedded chart validation failed: {chart}")
print(json.dumps({"guest_token": "ok", "chart_status": "success", "rows": result[0].get("rowcount")}))
