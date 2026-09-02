#!/usr/bin/env python3
"""Create specification-led UID datasets, charts and embedded dashboards."""

from __future__ import annotations

import http.cookiejar
import json
import os
import sys
import urllib.error
import urllib.parse
import urllib.request
import uuid
from pathlib import Path
from typing import Any

from dashboard_spec import DATASET_TABLES, DASHBOARDS, ChartSpec, Metric


BASE_URL = os.getenv("SUPERSET_INTERNAL_URL", "http://127.0.0.1:8088")
NAMESPACE = uuid.UUID("5fd7a67a-9b67-49f1-9010-acdebd264637")
OLD_CHART_PREFIXES = (
    "Обзор исполнения договоров ·",
    "Договоры и показатели ·",
    "Рейтинг бригад ·",
    "Промышленная безопасность ·",
    "Нарушения по договору ·",
    "Предупреждающие и корректирующие мероприятия ·",
    "Допретензионная работа ·",
)


def load_env(path: str = ".env") -> dict[str, str]:
    result: dict[str, str] = {}
    source = Path(path)
    if not source.exists():
        return result
    for line in source.read_text(encoding="utf-8").splitlines():
        if line and not line.startswith("#") and "=" in line:
            key, value = line.split("=", 1)
            result[key] = value
    return result


class SupersetApi:
    def __init__(self, username: str, password: str, base_url: str | None = None) -> None:
        self.base_url = (base_url or BASE_URL).rstrip("/")
        self.cookies = http.cookiejar.CookieJar()
        self.opener = urllib.request.build_opener(urllib.request.HTTPCookieProcessor(self.cookies))
        login = self._raw("POST", "/api/v1/security/login", {
            "username": username,
            "password": password,
            "provider": "db",
            "refresh": True,
        }, authenticated=False)
        self.token = login["access_token"]
        self.csrf = self._raw("GET", "/api/v1/security/csrf_token/")["result"]

    def _raw(self, method: str, path: str, payload: dict[str, Any] | None = None,
             authenticated: bool = True) -> dict[str, Any]:
        data = json.dumps(payload).encode() if payload is not None else None
        headers = {"Content-Type": "application/json"} if data is not None else {}
        if authenticated and hasattr(self, "token"):
            headers["Authorization"] = f"Bearer {self.token}"
        if authenticated and hasattr(self, "csrf") and method not in {"GET", "HEAD"}:
            headers.update({"X-CSRFToken": self.csrf, "Referer": f"{self.base_url}/", "Origin": self.base_url})
        request = urllib.request.Request(f"{self.base_url}{path}", data=data, headers=headers, method=method)
        try:
            with self.opener.open(request, timeout=60) as response:
                body = response.read()
                return json.loads(body) if body else {}
        except urllib.error.HTTPError as error:
            detail = error.read().decode("utf-8", errors="replace")
            raise RuntimeError(f"Superset API {method} {path} failed: {error.code} {detail}") from error

    def get(self, path: str) -> dict[str, Any]:
        return self._raw("GET", path)

    def post(self, path: str, payload: dict[str, Any]) -> dict[str, Any]:
        return self._raw("POST", path, payload)

    def put(self, path: str, payload: dict[str, Any]) -> dict[str, Any]:
        return self._raw("PUT", path, payload)

    def delete(self, path: str) -> dict[str, Any]:
        return self._raw("DELETE", path)

    def list(self, resource: str) -> list[dict[str, Any]]:
        return self.get(f"/api/v1/{resource}/?q=(page:0,page_size:500)").get("result", [])


def stable_uuid(kind: str, name: str) -> str:
    return str(uuid.uuid5(NAMESPACE, f"{kind}:{name}"))


def metric_payload(metric: Metric) -> dict[str, Any]:
    return {
        "aggregate": metric.aggregate,
        "column": {
            "column_name": metric.column,
            "description": None,
            "expression": None,
            "filterable": True,
            "groupby": True,
            "id": None,
            "is_dttm": False,
            "python_date_format": None,
            "type": "NUMERIC" if metric.aggregate != "COUNT_DISTINCT" else "TEXT",
            "verbose_name": None,
        },
        "expressionType": "SIMPLE",
        "hasCustomLabel": True,
        "label": metric.label,
        "optionName": f"metric_{stable_uuid('metric', metric.label + metric.column)[:8]}",
        "sqlExpression": None,
    }


def adhoc_filter(column: str, value: Any) -> dict[str, Any]:
    return {
        "clause": "WHERE",
        "comparator": value,
        "expressionType": "SIMPLE",
        "filterOptionName": f"filter_{stable_uuid('filter', column + str(value))[:8]}",
        "fromFormData": True,
        "operator": "==",
        "sqlExpression": None,
        "subject": column,
    }


def chart_params(spec: ChartSpec, dataset_id: int) -> dict[str, Any]:
    metrics = [metric_payload(item) for item in spec.metrics]
    filters = [adhoc_filter(column, value) for column, value in spec.filters]
    common: dict[str, Any] = {
        "datasource": f"{dataset_id}__table",
        "adhoc_filters": filters,
        "row_limit": 10000,
        "time_range": "No filter",
        "emit_filter": True,
        "show_legend": True,
        "rich_tooltip": True,
        "color_scheme": "supersetColors",
    }
    if spec.kind == "kpi":
        return {**common, "viz_type": "big_number_total", "metric": metrics[0],
                "header_font_size": 0.34, "subheader_font_size": 0.14, "y_axis_format": "SMART_NUMBER"}
    if spec.kind == "table":
        return {**common, "viz_type": "table", "query_mode": "raw", "all_columns": list(spec.columns),
                "order_by_cols": [], "server_pagination": True, "include_search": True,
                "table_timestamp_format": "smart_date"}
    if spec.kind == "pie":
        return {**common, "viz_type": "pie", "groupby": list(spec.dimensions), "metric": metrics[0],
                "sort_by_metric": True, "label_type": "key_value_percent", "donut": True, "innerRadius": 42}
    if spec.kind == "treemap":
        return {**common, "viz_type": "treemap_v2", "groupby": list(spec.dimensions), "metric": metrics[0],
                "show_labels": True, "show_upper_labels": True}
    if spec.kind == "heatmap":
        return {**common, "viz_type": "heatmap_v2", "x_axis": spec.dimensions[1],
                "groupby": [spec.dimensions[0]], "metric": metrics[0], "normalize_across": False,
                "show_values": True, "sort_x_axis": "alpha_asc", "sort_y_axis": "alpha_asc"}
    if spec.kind == "sankey":
        return {**common, "viz_type": "sankey_v2", "source": spec.dimensions[0],
                "target": spec.dimensions[1], "groupby": list(spec.dimensions), "metric": metrics[0]}
    if spec.kind == "funnel":
        return {**common, "viz_type": "funnel", "groupby": [spec.dimensions[0]], "metric": metrics[0],
                "show_labels": True}
    if spec.kind == "bubble":
        return {**common, "viz_type": "bubble", "entity": spec.dimensions[0],
                "series": spec.dimensions[1] if len(spec.dimensions) > 1 else None,
                "x": metrics[0], "y": metrics[1], "size": metrics[2], "max_bubble_size": "25"}
    if spec.kind == "line":
        return {**common, "viz_type": "echarts_timeseries_line", "x_axis": spec.dimensions[0],
                "time_grain_sqla": "P1M", "metrics": metrics,
                "groupby": list(spec.dimensions[1:]), "show_value": False, "legendOrientation": "top"}
    # Histogram and Pareto are represented by sorted bars when the installed
    # Superset build does not provide a dedicated plugin, as allowed by §14.
    return {**common, "viz_type": "echarts_timeseries_bar", "x_axis": spec.dimensions[0],
            "metrics": metrics, "groupby": list(spec.dimensions[1:]), "show_value": True,
            "orientation": "vertical", "stack": spec.kind == "stacked_bar",
            "contributionMode": "row" if spec.kind == "stacked_bar" else None,
            "x_axis_sort": metrics[0]["label"], "x_axis_sort_asc": False}


def query_context(dataset_id: int, params: dict[str, Any]) -> dict[str, Any]:
    viz_type = params["viz_type"]
    metric = params.get("metric")
    metrics = params.get("metrics") or [item for item in (
        metric, params.get("x"), params.get("y"), params.get("size")
    ) if item]
    if viz_type == "table":
        columns = params.get("all_columns", [])
    elif viz_type == "echarts_timeseries_line":
        columns = params.get("groupby", [])
    else:
        columns = list(dict.fromkeys([
            *params.get("groupby", []),
            *[params[key] for key in ("x_axis", "entity", "series", "source", "target")
              if params.get(key)],
        ]))
    filters = [
        {"col": item["subject"], "op": item["operator"], "val": item["comparator"]}
        for item in params.get("adhoc_filters", [])
        if item.get("expressionType") == "SIMPLE" and item.get("clause") == "WHERE"
    ]
    query: dict[str, Any] = {
        "filters": filters,
        "extras": {"having": "", "where": ""},
        "applied_time_extras": {},
        "columns": columns,
        "metrics": metrics,
        "orderby": [[metrics[0], False]] if metrics else [],
        "annotation_layers": [],
        "row_limit": params.get("row_limit", 10000),
        "series_limit": 0,
        "order_desc": True,
        "url_params": {},
        "custom_params": {},
        "custom_form_data": {},
        "post_processing": [],
        "time_range": params.get("time_range", "No filter"),
        "is_timeseries": viz_type == "echarts_timeseries_line",
    }
    if viz_type == "echarts_timeseries_line":
        query["granularity"] = params["x_axis"]
        query["time_grain_sqla"] = params.get("time_grain_sqla", "P1M")
    return {
        "datasource": {"id": dataset_id, "type": "table"},
        "force": False,
        "queries": [query],
        "form_data": params,
        "result_format": "json",
        "result_type": "full",
    }


def native_filters(dataset_id: int, columns: tuple[tuple[str, str], ...]) -> list[dict[str, Any]]:
    result: list[dict[str, Any]] = []
    for column, label in columns:
        filter_id = f"NATIVE_FILTER-{stable_uuid('native-filter', f'{dataset_id}:{column}')[:8]}"
        if column in {"fact_date", "opened_at"}:
            result.append({
                "id": filter_id,
                "name": label,
                "filterType": "filter_time",
                "targets": [{"column": {"name": column}, "datasetId": dataset_id}],
                "defaultDataMask": {"extraFormData": {}, "filterState": {"value": "No filter"}, "ownState": {}},
                "cascadeParentIds": [],
                "scope": {"rootPath": ["ROOT_ID"], "excluded": []},
                "type": "NATIVE_FILTER",
                "description": "Для потоков — период; для срезов дата окончания используется как дата среза.",
            })
            continue
        result.append({
            "id": filter_id,
            "controlValues": {"enableEmptyFilter": False, "defaultToFirstItem": False,
                              "multiSelect": True, "searchAllOptions": True, "inverseSelection": False},
            "name": label,
            "filterType": "filter_select",
            "targets": [{"column": {"name": column}, "datasetId": dataset_id}],
            "defaultDataMask": {"extraFormData": {}, "filterState": {}, "ownState": {}},
            "cascadeParentIds": [],
            "scope": {"rootPath": ["ROOT_ID"], "excluded": []},
            "type": "NATIVE_FILTER",
            "description": "",
        })
    return result


def dashboard_layout(charts: list[dict[str, Any]]) -> str:
    layout: dict[str, Any] = {
        "DASHBOARD_VERSION_KEY": "v2",
        "ROOT_ID": {"id": "ROOT_ID", "type": "ROOT", "children": ["GRID_ID"]},
        "GRID_ID": {"id": "GRID_ID", "type": "GRID", "children": [], "parents": ["ROOT_ID"]},
        "HEADER_ID": {"id": "HEADER_ID", "type": "HEADER", "meta": {"text": ""}},
    }
    rows: list[list[dict[str, Any]]] = []
    current: list[dict[str, Any]] = []
    for chart in charts:
        desired = 4 if chart["kind"] == "kpi" else 1 if chart["kind"] == "table" else 2
        if current and (current[0]["kind"] != chart["kind"] or len(current) >= desired):
            rows.append(current)
            current = []
        current.append(chart)
    if current:
        rows.append(current)
    for row_number, row_charts in enumerate(rows, 1):
        row_id = f"ROW-{row_number}"
        layout[row_id] = {"id": row_id, "type": "ROW", "children": [],
                          "parents": ["ROOT_ID", "GRID_ID"], "meta": {"background": "BACKGROUND_TRANSPARENT"}}
        layout["GRID_ID"]["children"].append(row_id)
        for chart in row_charts:
            chart_id = f"CHART-{chart['uuid']}"
            width = 3 if chart["kind"] == "kpi" else 12 if chart["kind"] == "table" else 6
            height = 24 if chart["kind"] == "kpi" else 54
            layout[chart_id] = {
                "id": chart_id, "type": "CHART", "children": [],
                "parents": ["ROOT_ID", "GRID_ID", row_id],
                "meta": {"chartId": chart["id"], "height": height, "width": width, "uuid": chart["uuid"]},
            }
            layout[row_id]["children"].append(chart_id)
    return json.dumps(layout, ensure_ascii=False)


def main() -> None:
    env = {**load_env(), **os.environ}
    # Production uses Secure session cookies. Prefer the configured HTTPS
    # origin unless an explicit internal URL was supplied for local runs.
    api_url = os.getenv("SUPERSET_INTERNAL_URL") or env.get("SUPERSET_PUBLIC_ORIGIN") or BASE_URL
    api = SupersetApi(env["SUPERSET_ADMIN_USERNAME"], env["SUPERSET_ADMIN_PASSWORD"], api_url)
    db_name = "UID ECO Analytics"
    database = next((item for item in api.list("database") if item.get("database_name") == db_name), None)
    if database:
        database_id = database["id"]
    else:
        password = urllib.parse.quote_plus(env["ANALYTICS_DB_PASSWORD"])
        database_id = api.post("/api/v1/database/", {
            "database_name": db_name,
            "sqlalchemy_uri": f"postgresql+psycopg2://uid_analytics:{password}@analytics-db:5432/uid_analytics",
            "expose_in_sqllab": True,
            "allow_dml": False,
            "allow_ctas": False,
            "allow_cvas": False,
            "allow_file_upload": False,
            "allow_run_async": False,
            "cache_timeout": 300,
            "extra": json.dumps({"allows_virtual_table_explore": True}),
            "uuid": stable_uuid("database", db_name),
        })["id"]

    existing_datasets = api.list("dataset")
    dataset_ids: dict[str, int] = {}
    for table in DATASET_TABLES:
        existing = next((item for item in existing_datasets if item.get("table_name") == table), None)
        if existing:
            dataset_ids[table] = existing["id"]
        else:
            dataset_ids[table] = api.post("/api/v1/dataset/", {
                "database": database_id, "schema": "public", "table_name": table,
                "normalize_columns": True, "uuid": stable_uuid("dataset", table),
            })["id"]

    existing_dashboards = api.list("dashboard")
    existing_charts = api.list("chart")
    results: dict[str, Any] = {"database_id": database_id, "datasets": dataset_ids, "dashboards": {}}
    expected_titles: set[str] = set()

    for dashboard_spec in DASHBOARDS:
        dashboard = next((item for item in existing_dashboards if item.get("slug") == dashboard_spec.slug), None)
        dashboard_uuid = stable_uuid("dashboard", dashboard_spec.slug)
        if dashboard:
            dashboard_id = dashboard["id"]
        else:
            dashboard_id = api.post("/api/v1/dashboard/", {
                "dashboard_title": dashboard_spec.title, "slug": dashboard_spec.slug,
                "published": True, "uuid": dashboard_uuid, "json_metadata": "{}",
                "position_json": "{}", "css": "",
            })["id"]

        dashboard_charts: list[dict[str, Any]] = []
        for spec in dashboard_spec.charts:
            title = f"{spec.code} · {spec.title} — {spec.mode}"
            expected_titles.add(title)
            dataset_id = dataset_ids[spec.dataset]
            params = chart_params(spec, dataset_id)
            chart_uuid = stable_uuid("chart", title)
            existing = next((item for item in existing_charts if item.get("slice_name") == title), None)
            payload = {
                "slice_name": title,
                "datasource_id": dataset_id,
                "datasource_type": "table",
                "viz_type": params["viz_type"],
                "params": json.dumps(params, ensure_ascii=False),
                "query_context": json.dumps(query_context(dataset_id, params), ensure_ascii=False),
                "query_context_generation": True,
                "dashboards": [dashboard_id],
                "description": spec.description or f"Визуал {spec.code} по спецификации дашборда УИД.",
                "uuid": chart_uuid,
            }
            if existing:
                chart_id = existing["id"]
                api.put(f"/api/v1/chart/{chart_id}", payload)
            else:
                chart_id = api.post("/api/v1/chart/", payload)["id"]
            params.update({"slice_id": chart_id, "dashboards": [dashboard_id]})
            payload["params"] = json.dumps(params, ensure_ascii=False)
            payload["query_context"] = json.dumps(query_context(dataset_id, params), ensure_ascii=False)
            api.put(f"/api/v1/chart/{chart_id}", payload)
            dashboard_charts.append({"id": chart_id, "uuid": chart_uuid, "title": title, "kind": spec.kind})

        chart_configuration = {
            str(item["id"]): {"id": item["id"], "crossFilters": {"scope": "global", "chartsInScope": []}}
            for item in dashboard_charts if item["kind"] not in {"kpi", "table"}
        }
        metadata = {
            "native_filter_configuration": native_filters(dataset_ids[dashboard_spec.primary_dataset], dashboard_spec.filters),
            "timed_refresh_immune_slices": [], "expanded_slices": {}, "default_filters": "{}",
            "chart_configuration": chart_configuration,
            "global_chart_configuration": {"scope": {"rootPath": ["ROOT_ID"], "excluded": []}, "chartsInScope": []},
            "color_scheme": "supersetColors", "refresh_frequency": 0,
        }
        api.put(f"/api/v1/dashboard/{dashboard_id}", {
            "dashboard_title": dashboard_spec.title, "slug": dashboard_spec.slug, "published": True,
            "json_metadata": json.dumps(metadata, ensure_ascii=False),
            "position_json": dashboard_layout(dashboard_charts),
            "css": ".dashboard-header{margin-bottom:8px}.chart-header{font-weight:600}",
        })
        embedded_payload = {"allowed_domains": [
            "https://b18103609-max.github.io", "http://localhost:4173", "http://localhost:5173",
        ]}
        try:
            api.get(f"/api/v1/dashboard/{dashboard_id}/embedded")
            api.put(f"/api/v1/dashboard/{dashboard_id}/embedded", embedded_payload)
        except RuntimeError as error:
            if "404" not in str(error):
                raise
            api.post(f"/api/v1/dashboard/{dashboard_id}/embedded", embedded_payload)
        embedded = api.get(f"/api/v1/dashboard/{dashboard_id}/embedded").get("result", {})
        results["dashboards"][dashboard_spec.slug] = {
            "id": dashboard_id, "uuid": dashboard_uuid, "embedded_uuid": embedded.get("uuid"),
            "title": dashboard_spec.title, "charts": dashboard_charts,
        }

    managed_codes = tuple(f"{prefix}-" for prefix in ("FA", "CT", "FL", "VN", "PK", "DP"))
    for chart in existing_charts:
        title = chart.get("slice_name", "")
        is_managed = title.startswith(OLD_CHART_PREFIXES) or title.startswith(managed_codes)
        if is_managed and title not in expected_titles:
            api.delete(f"/api/v1/chart/{chart['id']}")

    obsolete_safety = next((item for item in existing_dashboards if item.get("slug") == "safety"), None)
    if obsolete_safety:
        api.delete(f"/api/v1/dashboard/{obsolete_safety['id']}")

    Path("bootstrap-result.json").write_text(json.dumps(results, ensure_ascii=False, indent=2), encoding="utf-8")
    Path("guest-token/dashboards.json").write_text(json.dumps({
        slug: item["embedded_uuid"] or item["uuid"] for slug, item in results["dashboards"].items()
    }, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({
        "database_id": database_id, "datasets": len(dataset_ids), "dashboards": len(results["dashboards"]),
        "charts": sum(len(item["charts"]) for item in results["dashboards"].values()),
        "removed_dashboard": bool(obsolete_safety), "output": "bootstrap-result.json",
    }, ensure_ascii=False))


if __name__ == "__main__":
    try:
        main()
    except Exception as error:
        print(str(error), file=sys.stderr)
        raise
