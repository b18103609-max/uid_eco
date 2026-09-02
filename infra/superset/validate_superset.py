#!/usr/bin/env python3
"""Execute every bootstrapped chart through the Superset REST API."""

from __future__ import annotations

import json
import os
from pathlib import Path

from bootstrap_superset import SupersetApi, load_env


def main() -> None:
    env = {**load_env(), **os.environ}
    result = json.loads(Path("bootstrap-result.json").read_text(encoding="utf-8"))
    api_url = os.getenv("SUPERSET_INTERNAL_URL") or env.get("SUPERSET_PUBLIC_ORIGIN")
    api = SupersetApi(env["SUPERSET_ADMIN_USERNAME"], env["SUPERSET_ADMIN_PASSWORD"], api_url)

    failures: list[dict[str, object]] = []
    checked = 0
    for dashboard in result["dashboards"].values():
        for chart in dashboard["charts"]:
            checked += 1
            try:
                response = api.get(f"/api/v1/chart/{chart['id']}/data/")
                if not response.get("result"):
                    failures.append({"id": chart["id"], "title": chart["title"], "error": "empty result"})
            except Exception as error:  # validation should report all broken charts
                failures.append({"id": chart["id"], "title": chart["title"], "error": str(error)})

    print(json.dumps({"checked": checked, "failed": failures}, ensure_ascii=False, indent=2))
    raise SystemExit(1 if failures else 0)


if __name__ == "__main__":
    main()
