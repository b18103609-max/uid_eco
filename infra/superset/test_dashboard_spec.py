from __future__ import annotations

import re
import unittest
from pathlib import Path

from dashboard_spec import DASHBOARDS, DEFERRED_VISUALS


ROOT = Path(__file__).resolve().parents[2]
VIEWS_SQL = (ROOT / "infra/superset/analytics/views.sql").read_text(encoding="utf-8")


class DashboardSpecificationTest(unittest.TestCase):
    def test_only_six_specification_sections_are_published(self) -> None:
        self.assertEqual(
            [dashboard.slug for dashboard in DASHBOARDS],
            ["overview", "contracts", "rating", "breaches", "pcm", "preclaims"],
        )

    def test_every_visual_has_spec_code_and_period_mode(self) -> None:
        for dashboard in DASHBOARDS:
            for chart in dashboard.charts:
                self.assertRegex(chart.code, r"^(FA|CT|FL|VN|PK|DP|DQ)-")
                self.assertIn(chart.mode, {"за период", "на дату"})

    def test_every_available_specification_visual_is_present_or_deferred(self) -> None:
        expected = {
            **{f"FA-{number:02d}": "" for number in range(1, 15)},
            **{f"CT-{number:02d}": "" for number in range(1, 13)},
            **{f"FL-{number:02d}": "" for number in range(1, 15)},
            **{f"VN-{number:02d}": "" for number in range(1, 12)},
            **{f"PK-{number:02d}": "" for number in range(1, 13)},
            **{f"DP-{number:02d}": "" for number in range(1, 16)},
        }
        implemented = {
            re.match(r"^[A-Z]{2}-\d{2}", chart.code).group(0)
            for dashboard in DASHBOARDS for chart in dashboard.charts
            if re.match(r"^[A-Z]{2}-\d{2}", chart.code)
        }
        missing = set(expected) - implemented - set(DEFERRED_VISUALS)
        self.assertEqual(missing, set())

    def test_deferred_visuals_are_not_silently_approximated(self) -> None:
        implemented = {chart.code for dashboard in DASHBOARDS for chart in dashboard.charts}
        self.assertTrue(set(DEFERRED_VISUALS).isdisjoint(implemented))
        for reason in DEFERRED_VISUALS.values():
            self.assertGreater(len(reason), 20)

    def test_counts_use_distinct_business_ids(self) -> None:
        object_columns = {"contract_id", "contractor_id", "brigade_id", "violation_id", "pcm_id", "dpr_id", "signal_id"}
        for dashboard in DASHBOARDS:
            for chart in dashboard.charts:
                for metric in chart.metrics:
                    if metric.column in object_columns and metric.label not in {"Стоимость, ₽"}:
                        self.assertEqual(metric.aggregate, "COUNT_DISTINCT", f"{chart.code}: {metric.label}")

    def test_filters_use_contractor_identifier(self) -> None:
        for dashboard in DASHBOARDS:
            filter_columns = {column for column, _ in dashboard.filters}
            self.assertNotIn("contractor", filter_columns)
            self.assertIn("contractor_id", filter_columns)

    def test_each_dashboard_has_detail_or_action_table_with_link(self) -> None:
        for dashboard in DASHBOARDS:
            tables = [chart for chart in dashboard.charts if chart.kind == "table"]
            self.assertTrue(any("object_url" in chart.columns for chart in tables), dashboard.slug)

    def test_sql_encodes_non_negotiable_calculation_rules(self) -> None:
        required_fragments = (
            "c.start_date <= c.report_date AND c.report_date <= c.end_date",
            "count(DISTINCT b.id)",
            "greatest(c.amount_mln - c.cumulative_fact_mln, 0)",
            "WHEN c.finance_plan_mln = 0 THEN NULL",
            "WHERE r.service IN ('Бурение', 'ТКРС') AND NOT r.preliminary",
            "previous_incident_date IS NOT NULL AND incident_date - previous_incident_date <= 90",
            "status_code NOT IN ('Реализовано', 'Отменено') AND planned_end_date < max_report_date",
            "closure_status = 'в работе' AND deviation > 0",
        )
        for fragment in required_fragments:
            self.assertIn(fragment, VIEWS_SQL)


if __name__ == "__main__":
    unittest.main()
