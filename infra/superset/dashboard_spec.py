"""Specification-led catalog for UID Superset dashboards.

The codes and wording are taken from ``Спецификация_дашборда_УИД_ЛК.md``.
Charts that require unavailable history or entities are deliberately listed in
``DEFERRED_VISUALS`` instead of being approximated from current-state rows.
"""

from __future__ import annotations

from dataclasses import dataclass, field
from typing import Any


@dataclass(frozen=True)
class Metric:
    column: str
    aggregate: str
    label: str


@dataclass(frozen=True)
class ChartSpec:
    code: str
    title: str
    dataset: str
    kind: str
    mode: str
    dimensions: tuple[str, ...] = ()
    metrics: tuple[Metric, ...] = ()
    filters: tuple[tuple[str, Any], ...] = ()
    columns: tuple[str, ...] = ()
    description: str = ""


@dataclass(frozen=True)
class DashboardSpec:
    slug: str
    title: str
    primary_dataset: str
    filters: tuple[tuple[str, str], ...]
    charts: tuple[ChartSpec, ...]


def m(column: str, aggregate: str, label: str) -> Metric:
    return Metric(column, aggregate, label)


def c(
    code: str,
    title: str,
    dataset: str,
    kind: str,
    mode: str,
    *,
    dimensions: tuple[str, ...] = (),
    metrics: tuple[Metric, ...] = (),
    filters: tuple[tuple[str, Any], ...] = (),
    columns: tuple[str, ...] = (),
    description: str = "",
) -> ChartSpec:
    return ChartSpec(code, title, dataset, kind, mode, dimensions, metrics, filters, columns, description)


COMMON_FILTERS = (
    ("fact_date", "Дата начала / дата окончания"),
    ("subsidiary", "ДО"),
    ("function_name", "Функция"),
    ("service_group", "Группа услуг"),
    ("service", "Услуга КТ-777"),
    ("kt777", "Код КТ-777"),
    ("contractor_id", "ПО (устойчивый ID)"),
    ("portfolio", "Перечень договора"),
    ("contract_number", "Договор"),
)


FOCUS_CHARTS = (
    c("FA-01.1", "Критичные нарушения ПБ", "v_focus_signals_spec", "kpi", "на дату", metrics=(m("signal_id", "COUNT_DISTINCT", "Сигналы"),), filters=(("signal_rule", "Критичное нарушение ПБ/стоп-фактор"),)),
    c("FA-01.2", "Новые переходы бригад в красную зону", "v_focus_signals_spec", "kpi", "на дату", metrics=(m("signal_id", "COUNT_DISTINCT", "Сигналы"),), filters=(("signal_rule", "Новая красная зона"),)),
    c("FA-01.3", "Просроченные ДПР", "v_focus_signals_spec", "kpi", "на дату", metrics=(m("signal_id", "COUNT_DISTINCT", "Сигналы"),), filters=(("signal_rule", "Просроченная ДПР"),)),
    c("FA-01.4", "Просроченные ПКМ", "v_focus_signals_spec", "kpi", "на дату", metrics=(m("signal_id", "COUNT_DISTINCT", "Сигналы"),), filters=(("signal_rule", "Просроченный ПКМ"),)),
    c("FA-01.5", "Высокорисковые договоры без ЕОЛ/КИ", "v_focus_signals_spec", "kpi", "на дату", metrics=(m("signal_id", "COUNT_DISTINCT", "Сигналы"),), filters=(("signal_rule", "Высокорисковый договор без команды"),)),
    c("FA-02", "Очередь внимания", "v_focus_signals_spec", "table", "на дату", columns=("priority", "signal_rule", "object_type", "object_number", "contractor", "subsidiary", "function_name", "opened_at", "age_days", "responsible", "object_url")),
    c("FA-03.1", "Активные договоры", "v_contracts_spec", "kpi", "на дату", metrics=(m("contract_id", "COUNT_DISTINCT", "Договоры"),), filters=(("is_active", True),)),
    c("FA-03.2", "Стоимость портфеля", "v_contracts_spec", "kpi", "на дату", metrics=(m("contract_amount_rub", "SUM", "Стоимость, ₽"),), filters=(("is_active", True),)),
    c("FA-03.3", "Подрядные организации", "v_contracts_spec", "kpi", "на дату", metrics=(m("contractor_id", "COUNT_DISTINCT", "ПО"),), filters=(("is_active", True),)),
    c("FA-03.4", "Договорные нарушения", "v_violations_spec", "kpi", "за период", metrics=(m("violation_id", "COUNT_DISTINCT", "Нарушения"),)),
    c("FA-04", "Денежная структура портфеля", "v_contracts_spec", "treemap", "на дату", dimensions=("service_group", "service"), metrics=(m("contract_amount_rub", "SUM", "Стоимость, ₽"),), filters=(("is_active", True),)),
    c("FA-05", "Концентрация портфеля — Pareto ПО", "v_contracts_spec", "bar", "на дату", dimensions=("contractor",), metrics=(m("contract_amount_rub", "SUM", "Стоимость, ₽"),), filters=(("is_active", True),)),
    c("FA-06", "Бригады по зонам на текущий момент", "v_flagman_spec", "stacked_bar", "на дату", dimensions=("contractor", "zone"), metrics=(m("brigade_id", "COUNT_DISTINCT", "Бригады"),), filters=(("is_current", True),)),
    c("FA-07", "Подрядчики с красными бригадами", "v_flagman_spec", "table", "на дату", filters=(("is_current", True), ("zone", "Красная")), columns=("contractor", "brigade", "score", "previous_score", "delta_score", "is_new_red", "object_url")),
    c("FA-08", "Нарушения по категориям и виду", "v_violations_spec", "stacked_bar", "за период", dimensions=("fact_date", "category", "kind"), metrics=(m("violation_id", "COUNT_DISTINCT", "События"),), filters=(("is_last_3_months", True),)),
    c("FA-09", "Главные сценарии нарушений — Pareto", "v_violations_spec", "bar", "за период", dimensions=("scenario",), metrics=(m("violation_id", "COUNT_DISTINCT", "События"),)),
    c("FA-10", "Просроченные ДПР", "v_dpr_spec", "stacked_bar", "на дату", dimensions=("overdue_bucket", "current_stage"), metrics=(m("dpr_id", "COUNT_DISTINCT", "ДПР"),), filters=(("is_overdue", True),)),
    c("FA-11", "Просроченные ПКМ", "v_pcm_spec", "stacked_bar", "на дату", dimensions=("overdue_bucket", "status"), metrics=(m("pcm_id", "COUNT_DISTINCT", "ПКМ"),), filters=(("is_overdue", True),)),
    c("FA-12", "Высокорисковые договоры без команды", "v_contracts_spec", "table", "на дату", filters=(("is_active", True), ("risk_level", "Высокий"), ("team_assigned", False)), columns=("contract_number", "contractor", "subsidiary", "function_name", "contract_amount_rub", "risk_level", "eol", "ki", "days_without_team", "object_url")),
    c("FA-13", "ДПР с отклонением", "v_dpr_spec", "bubble", "на дату", dimensions=("dpr_id", "current_stage"), metrics=(m("deviation_days", "MAX", "Дней сверх норматива"), m("presented_amount_rub", "MAX", "Сумма ДПР, ₽"), m("duration_days", "MAX", "Длительность")), filters=(("is_overdue", True),)),
    c("FA-14", "Матрица риска подрядчиков", "v_focus_signals_spec", "heatmap", "на дату", dimensions=("contractor", "signal_rule"), metrics=(m("signal_id", "COUNT_DISTINCT", "Сигналы"),), description="Абсолютные сигналы; сводный взвешенный индекс не рассчитывается без утвержденных весов."),
)


CONTRACT_CHARTS = (
    c("CT-01.1", "Активные договоры", "v_contracts_spec", "kpi", "на дату", metrics=(m("contract_id", "COUNT_DISTINCT", "Договоры"),), filters=(("is_active", True),)),
    c("CT-01.2", "Стоимость портфеля", "v_contracts_spec", "kpi", "на дату", metrics=(m("contract_amount_rub", "SUM", "Стоимость, ₽"),), filters=(("is_active", True),)),
    c("CT-01.3", "Подрядные организации", "v_contracts_spec", "kpi", "на дату", metrics=(m("contractor_id", "COUNT_DISTINCT", "ПО"),), filters=(("is_active", True),)),
    c("CT-01.4", "Среднее освоение", "v_contracts_spec", "kpi", "на дату", metrics=(m("execution_percent", "AVG", "Освоение, %"),), filters=(("is_active", True),)),
    c("CT-01.5", "Не освоено", "v_contracts_spec", "kpi", "на дату", metrics=(m("unspent_amount_rub", "SUM", "Не освоено, ₽"),), filters=(("is_active", True),)),
    c("CT-01.6", "Договоры с отклонением", "v_contracts_spec", "kpi", "за период", metrics=(m("contract_id", "COUNT_DISTINCT", "Договоры"),), filters=(("has_plan_fact_deviation", True),)),
    c("CT-01.7", "Начисленная мотивация", "v_contracts_spec", "kpi", "за период", metrics=(m("motivation_amount_rub", "SUM", "Мотивация, ₽"),)),
    c("CT-01.8", "Выставленные санкции", "v_contracts_spec", "kpi", "за период", metrics=(m("sanctions_billed_rub", "SUM", "Санкции, ₽"),)),
    c("CT-02", "Количество договоров по структуре", "v_contracts_spec", "stacked_bar", "на дату", dimensions=("subsidiary", "function_name"), metrics=(m("contract_id", "COUNT_DISTINCT", "Договоры"),), filters=(("is_active", True),)),
    c("CT-03", "Стоимость договоров по структуре", "v_contracts_spec", "treemap", "на дату", dimensions=("subsidiary", "function_name", "service_group", "service"), metrics=(m("contract_amount_rub", "SUM", "Стоимость, ₽"),), filters=(("is_active", True),)),
    c("CT-04", "Портфель подрядчиков", "v_contracts_spec", "bubble", "на дату", dimensions=("contractor",), metrics=(m("contract_id", "COUNT_DISTINCT", "Договоры"), m("contract_amount_rub", "SUM", "Стоимость, ₽"), m("fact_amount_rub", "SUM", "Освоено, ₽")), filters=(("is_active", True),)),
    c("CT-05", "План–факт освоения", "v_contracts_spec", "grouped_bar", "за период", dimensions=("contract_number",), metrics=(m("plan_amount_rub", "SUM", "План, ₽"), m("fact_amount_rub", "SUM", "Факт, ₽"))),
    c("CT-07", "Остаток и перерасход", "v_contracts_spec", "grouped_bar", "на дату", dimensions=("contract_number",), metrics=(m("contract_amount_rub", "SUM", "Стоимость, ₽"), m("cumulative_fact_amount_rub", "SUM", "Освоено, ₽"), m("unspent_amount_rub", "SUM", "Остаток, ₽"), m("overrun_amount_rub", "SUM", "Перерасход, ₽"))),
    c("CT-08", "ОЭДК по договорам", "v_contracts_spec", "heatmap", "на дату", dimensions=("contractor", "oedk_zone"), metrics=(m("oedk_score", "AVG", "Балл ОЭДК"),)),
    c("CT-09", "Смена зон ОЭДК", "v_contracts_spec", "sankey", "на дату", dimensions=("previous_oedk_zone", "oedk_zone"), metrics=(m("contract_id", "COUNT_DISTINCT", "Договоры"),)),
    c("CT-10", "Мотивация, санкции и урегулирование", "v_contracts_spec", "grouped_bar", "за период", dimensions=("contractor",), metrics=(m("motivation_amount_rub", "SUM", "Мотивация, ₽"), m("sanctions_billed_rub", "SUM", "Выставлено, ₽"), m("sanctions_paid_rub", "SUM", "Оплачено, ₽"), m("proactive_amount_rub", "SUM", "Проактив, ₽"))),
    c("CT-11", "Риск ПБ × деньги", "v_contracts_spec", "heatmap", "на дату", dimensions=("risk_level", "team_status"), metrics=(m("contract_amount_rub", "SUM", "Стоимость, ₽"),), filters=(("is_active", True),)),
    c("CT-12", "Паспорт одного договора", "v_contracts_spec", "table", "на дату", columns=("contract_number", "date_start", "date_end", "subsidiary", "contractor", "function_name", "service", "kt777", "contract_amount_rub", "fact_amount_rub", "execution_percent", "oedk_zone", "eol", "ki", "violation_count", "dpr_count", "pcm_count", "object_url")),
)


FLAGMAN_CHARTS = (
    c("FL-01.1", "Бригад оценено", "v_flagman_spec", "kpi", "на дату", metrics=(m("brigade_id", "COUNT_DISTINCT", "Бригады"),), filters=(("is_current", True),)),
    c("FL-01.2", "Средний балл", "v_flagman_spec", "kpi", "на дату", metrics=(m("score", "AVG", "Средний балл"),), filters=(("is_current", True),)),
    c("FL-01.3", "Красные бригады", "v_flagman_spec", "kpi", "на дату", metrics=(m("brigade_id", "COUNT_DISTINCT", "Бригады"),), filters=(("is_current", True), ("zone", "Красная"))),
    c("FL-01.4", "Новые красные", "v_flagman_spec", "kpi", "на дату", metrics=(m("brigade_id", "COUNT_DISTINCT", "Бригады"),), filters=(("is_current", True), ("is_new_red", True))),
    c("FL-01.5", "Улучшилось", "v_flagman_spec", "kpi", "на дату", metrics=(m("brigade_id", "COUNT_DISTINCT", "Бригады"),), filters=(("is_current", True), ("score_direction", "Улучшилась"))),
    c("FL-01.6", "Ухудшилось", "v_flagman_spec", "kpi", "на дату", metrics=(m("brigade_id", "COUNT_DISTINCT", "Бригады"),), filters=(("is_current", True), ("score_direction", "Ухудшилась"))),
    c("FL-02", "Текущее распределение бригад по зонам", "v_flagman_spec", "stacked_bar", "на дату", dimensions=("contractor", "zone"), metrics=(m("brigade_id", "COUNT_DISTINCT", "Бригады"),), filters=(("is_current", True),)),
    c("FL-03", "Изменение распределения зон", "v_flagman_spec", "stacked_bar", "за период", dimensions=("fact_date", "zone"), metrics=(m("brigade_id", "COUNT_DISTINCT", "Бригады"),)),
    c("FL-04", "Динамика баллов бригад", "v_flagman_spec", "line", "за период", dimensions=("fact_date", "brigade"), metrics=(m("score", "AVG", "Итоговый балл"),)),
    c("FL-05", "Изменение балла и места", "v_flagman_spec", "bar", "на дату", dimensions=("brigade",), metrics=(m("delta_score", "AVG", "Изменение балла"),), filters=(("is_current", True),)),
    c("FL-06", "Матрица «бригада × месяц»", "v_flagman_spec", "heatmap", "за период", dimensions=("brigade", "fact_date"), metrics=(m("score", "AVG", "Балл"),)),
    c("FL-07", "Декомпозиция итогового балла", "v_flagman_spec", "grouped_bar", "на дату", dimensions=("brigade",), metrics=(m("technology", "AVG", "Техническая оценка"), m("hse", "AVG", "ПБ"), m("unexplained_adjustment", "AVG", "Необъясненная корректировка")), filters=(("is_current", True),)),
    c("FL-08", "Техническая оценка", "v_flagman_spec", "grouped_bar", "на дату", dimensions=("brigade",), metrics=(m("technology", "AVG", "Техническая оценка"), m("hse", "AVG", "ПБ")), filters=(("is_current", True),)),
    c("FL-09", "Вклад ПБ в рейтинг", "v_flagman_spec", "bar", "за период", dimensions=("brigade",), metrics=(m("hse", "AVG", "Вклад ПБ"),)),
    c("FL-10", "Нарушения ПБ по способу фиксации", "v_flagman_safety_spec", "stacked_bar", "за период", dimensions=("fact_date", "detection_method"), metrics=(m("violation_id", "COUNT_DISTINCT", "Нарушения"),)),
    c("FL-11", "Частые сценарии нарушений — Pareto", "v_flagman_safety_spec", "bar", "за период", dimensions=("scenario",), metrics=(m("violation_id", "COUNT_DISTINCT", "Нарушения"),)),
    c("FL-12", "Стоп-факторы", "v_flagman_safety_spec", "table", "за период", filters=(("stop_factor", True),), columns=("brigade", "fact_date", "scenario", "severity", "detection_method", "status", "responsible", "object_url")),
    c("FL-13", "Карта проблемных зон", "v_flagman_safety_spec", "heatmap", "за период", dimensions=("field", "scenario"), metrics=(m("violation_id", "COUNT_DISTINCT", "Нарушения"),)),
    c("FL-14", "Подтверждение и свежесть данных", "v_flagman_spec", "table", "на дату", filters=(("is_current", True),), columns=("fact_date", "brigade", "contractor", "is_official", "preliminary", "data_actual_at")),
)


VIOLATION_CHARTS = (
    c("VN-01.1", "Нарушений", "v_violations_spec", "kpi", "за период", metrics=(m("violation_id", "COUNT_DISTINCT", "Нарушения"),)),
    c("VN-01.2", "Открытых", "v_violations_spec", "kpi", "на дату", metrics=(m("violation_id", "COUNT_DISTINCT", "Нарушения"),), filters=(("is_open", True),)),
    c("VN-01.3", "Повторных", "v_violations_spec", "kpi", "за период", metrics=(m("violation_id", "COUNT_DISTINCT", "Нарушения"),), filters=(("is_repeat_90d", True),)),
    c("VN-01.4", "С ДПР", "v_violations_spec", "kpi", "за период", metrics=(m("violation_id", "COUNT_DISTINCT", "Нарушения"),), filters=(("linked_dpr", True),)),
    c("VN-01.5", "С ПКМ", "v_violations_spec", "kpi", "за период", metrics=(m("violation_id", "COUNT_DISTINCT", "Нарушения"),), filters=(("linked_pcm", True),)),
    c("VN-01.6", "Отозванных", "v_violations_spec", "kpi", "за период", metrics=(m("violation_id", "COUNT_DISTINCT", "Нарушения"),), filters=(("status", "Отозвано"),)),
    c("VN-02", "Распределение по типам", "v_violations_spec", "pie", "за период", dimensions=("violation_type",), metrics=(m("violation_id", "COUNT_DISTINCT", "Нарушения"),)),
    c("VN-03", "Распределение по категориям и критичности", "v_violations_spec", "stacked_bar", "за период", dimensions=("category", "severity"), metrics=(m("violation_id", "COUNT_DISTINCT", "Нарушения"),)),
    c("VN-04", "Динамика возникновения", "v_violations_spec", "line", "за период", dimensions=("fact_date", "category"), metrics=(m("violation_id", "COUNT_DISTINCT", "Нарушения"),)),
    c("VN-05", "География нарушений", "v_violations_spec", "heatmap", "за период", dimensions=("field", "category"), metrics=(m("violation_id", "COUNT_DISTINCT", "Нарушения"),)),
    c("VN-06", "ПО × группа услуг", "v_violations_spec", "heatmap", "за период", dimensions=("contractor", "function_name"), metrics=(m("violation_id", "COUNT_DISTINCT", "Нарушения"),)),
    c("VN-07", "Текущая воронка статусов и исходов", "v_violations_spec", "funnel", "на дату", dimensions=("status",), metrics=(m("violation_id", "COUNT_DISTINCT", "Нарушения"),)),
    c("VN-08", "Когортная воронка от нарушения к выходу", "v_violations_spec", "sankey", "за период", dimensions=("category", "resolution", "linked_outcome"), metrics=(m("violation_id", "COUNT_DISTINCT", "Нарушения"),), description="Связи строятся только по физическим идентификаторам карточек."),
    c("VN-09", "Возраст открытых нарушений", "v_violations_spec", "stacked_bar", "на дату", dimensions=("age_bucket", "status"), metrics=(m("violation_id", "COUNT_DISTINCT", "Нарушения"),), filters=(("is_open", True),)),
    c("VN-10", "Повторяемость нарушений", "v_violations_spec", "heatmap", "за период", dimensions=("contractor", "fact_date"), metrics=(m("violation_id", "COUNT_DISTINCT", "Повторные"),), filters=(("is_repeat_90d", True),)),
    c("VN-11", "Договоры-лидеры по нарушениям — Pareto", "v_violations_spec", "bar", "за период", dimensions=("contract_number",), metrics=(m("violation_id", "COUNT_DISTINCT", "Нарушения"),)),
    c("VN-DETAIL", "Детализация договорных нарушений", "v_violations_spec", "table", "за период", columns=("violation_id", "act_number", "fact_date", "subsidiary", "contractor", "function_name", "service", "kt777", "field", "well", "category", "severity", "status", "responsible", "contract_number", "linked_dpr", "linked_pcm", "object_url")),
)


PCM_CHARTS = (
    c("PK-01.1", "Создано", "v_pcm_spec", "kpi", "за период", metrics=(m("pcm_id", "COUNT_DISTINCT", "ПКМ"),)),
    c("PK-01.2", "В работе", "v_pcm_spec", "kpi", "на дату", metrics=(m("pcm_id", "COUNT_DISTINCT", "ПКМ"),), filters=(("status", "В работе"),)),
    c("PK-01.3", "Просрочено", "v_pcm_spec", "kpi", "на дату", metrics=(m("pcm_id", "COUNT_DISTINCT", "ПКМ"),), filters=(("is_overdue", True),)),
    c("PK-01.4", "Завершено в срок", "v_pcm_spec", "kpi", "за период", metrics=(m("pcm_id", "COUNT_DISTINCT", "ПКМ"),), filters=(("completed_on_time", True),)),
    c("PK-01.5", "Без ответственного", "v_pcm_spec", "kpi", "на дату", metrics=(m("pcm_id", "COUNT_DISTINCT", "ПКМ"),), filters=(("without_responsible", True),)),
    c("PK-02", "Из каких нарушений возникли ПКМ", "v_pcm_spec", "stacked_bar", "за период", dimensions=("violation_category", "contract_risk"), metrics=(m("pcm_id", "COUNT_DISTINCT", "ПКМ"),), filters=(("linked_to_violation", True),)),
    c("PK-03", "Текущая воронка ПКМ", "v_pcm_spec", "funnel", "на дату", dimensions=("status",), metrics=(m("pcm_id", "COUNT_DISTINCT", "ПКМ"),)),
    c("PK-04", "Просрочка ПКМ", "v_pcm_spec", "stacked_bar", "на дату", dimensions=("overdue_bucket", "status"), metrics=(m("pcm_id", "COUNT_DISTINCT", "ПКМ"),), filters=(("is_overdue", True),)),
    c("PK-06", "Соблюдение сроков по ДО/ПО", "v_pcm_spec", "stacked_bar", "на дату", dimensions=("contractor", "deadline_state"), metrics=(m("pcm_id", "COUNT_DISTINCT", "ПКМ"),)),
    c("PK-08", "Эффект до/после ПКМ", "v_pcm_spec", "grouped_bar", "за период", dimensions=("pcm_id",), metrics=(m("similar_before", "SUM", "До"), m("similar_after", "SUM", "После")), filters=(("status", "Реализовано"),), description="Ненормированная навигационная оценка: экспозиция работы в источнике отсутствует."),
    c("PK-12", "Нагрузка ответственных", "v_pcm_spec", "stacked_bar", "на дату", dimensions=("responsible", "is_overdue"), metrics=(m("pcm_id", "COUNT_DISTINCT", "ПКМ"),)),
    c("PK-DETAIL", "Детализация ПКМ", "v_pcm_spec", "table", "на дату", columns=("pcm_id", "title", "created_at", "subsidiary", "contractor", "function_name", "service", "field", "status", "actual_control_date", "overdue_days", "responsible", "contract_number", "violation_id", "object_url")),
)


DPR_CHARTS = (
    c("DP-01.1", "Предъявлено", "v_dpr_spec", "kpi", "за период", metrics=(m("dpr_id", "COUNT_DISTINCT", "ДПР"),)),
    c("DP-01.2", "В работе", "v_dpr_spec", "kpi", "на дату", metrics=(m("dpr_id", "COUNT_DISTINCT", "ДПР"),), filters=(("is_open", True),)),
    c("DP-01.3", "Просрочено", "v_dpr_spec", "kpi", "на дату", metrics=(m("dpr_id", "COUNT_DISTINCT", "ДПР"),), filters=(("is_overdue", True),)),
    c("DP-01.4", "Сумма предъявлена", "v_dpr_spec", "kpi", "за период", metrics=(m("presented_amount_rub", "SUM", "Предъявлено, ₽"),)),
    c("DP-01.5", "Оплачено", "v_dpr_spec", "kpi", "за период", metrics=(m("paid_amount_rub", "SUM", "Оплачено, ₽"),)),
    c("DP-01.6", "Заменено на проактив", "v_dpr_spec", "kpi", "за период", metrics=(m("alternative_amount_rub", "SUM", "Проактив, ₽"),)),
    c("DP-01.7", "Отозвано", "v_dpr_spec", "kpi", "за период", metrics=(m("withdrawn_amount_rub", "SUM", "Отозвано, ₽"),)),
    c("DP-01.8", "Эффективность урегулирования", "v_dpr_spec", "kpi", "за период", metrics=(m("successful_resolution_flag", "AVG", "Эффективность"),)),
    c("DP-02", "Текущая воронка этапов урегулирования", "v_dpr_spec", "funnel", "на дату", dimensions=("current_stage",), metrics=(m("dpr_id", "COUNT_DISTINCT", "ДПР"),)),
    c("DP-04", "Основания возникновения ДПР", "v_dpr_spec", "stacked_bar", "за период", dimensions=("category", "kind"), metrics=(m("dpr_id", "COUNT_DISTINCT", "ДПР"),)),
    c("DP-06", "География ДПР", "v_dpr_spec", "heatmap", "за период", dimensions=("field", "category"), metrics=(m("dpr_id", "COUNT_DISTINCT", "ДПР"),)),
    c("DP-07", "ДО → функция → группа услуг → услуга", "v_dpr_spec", "stacked_bar", "за период", dimensions=("subsidiary", "function_name"), metrics=(m("dpr_id", "COUNT_DISTINCT", "ДПР"),)),
    c("DP-08", "Денежные исходы ДПР", "v_dpr_spec", "grouped_bar", "на дату", dimensions=("contractor",), metrics=(m("presented_amount_rub", "SUM", "Предъявлено, ₽"), m("paid_amount_rub", "SUM", "Оплачено, ₽"), m("alternative_amount_rub", "SUM", "Проактив, ₽"), m("withdrawn_amount_rub", "SUM", "Отозвано, ₽"), m("unresolved_amount_rub", "SUM", "В работе, ₽"))),
    c("DP-09", "Штрафные санкции и проактив", "v_dpr_spec", "grouped_bar", "за период", dimensions=("contractor",), metrics=(m("presented_amount_rub", "SUM", "Предъявлено, ₽"), m("paid_amount_rub", "SUM", "Оплачено, ₽"), m("alternative_amount_rub", "SUM", "Проактив, ₽"))),
    c("DP-10", "Соблюдение нормативного срока", "v_dpr_spec", "histogram", "за период", dimensions=("deviation_days", "kind"), metrics=(m("dpr_id", "COUNT_DISTINCT", "ДПР"),)),
    c("DP-11", "Просроченные ДПР по этапам", "v_dpr_spec", "stacked_bar", "на дату", dimensions=("overdue_bucket", "current_stage"), metrics=(m("dpr_id", "COUNT_DISTINCT", "ДПР"),), filters=(("is_overdue", True),)),
    c("DP-12", "Эффективность урегулирования", "v_dpr_spec", "bar", "за период", dimensions=("contractor",), metrics=(m("successful_resolution_flag", "AVG", "Доля успешных"),)),
    c("DP-13", "Конверсия ответа ПО", "v_dpr_spec", "stacked_bar", "на дату", dimensions=("contractor", "response_position"), metrics=(m("dpr_id", "COUNT_DISTINCT", "ДПР"),)),
    c("DP-14", "Риск срока исковой давности", "v_dpr_spec", "table", "на дату", filters=(("limitation_bucket", "≤90"),), columns=("object_number", "incident_date", "limitation_date", "limitation_days_left", "presented_amount_rub", "current_stage", "responsible", "object_url")),
    c("DP-15", "ТОП договоров и ПО по ДПР", "v_dpr_spec", "table", "за период", columns=("contract_number", "contractor", "object_number", "presented_amount_rub", "paid_amount_rub", "alternative_amount_rub", "withdrawn_amount_rub", "overdue_days", "duration_days", "object_url")),
    c("DP-DETAIL", "Детализация ДПР", "v_dpr_spec", "table", "за период", columns=("dpr_id", "object_number", "fact_date", "subsidiary", "contractor", "function_name", "service", "kt777", "field", "well", "category", "status", "current_stage", "limitation_date", "responsible", "contract_number", "object_url")),
)


DASHBOARDS = (
    DashboardSpec("overview", "UID — Фокус внимания", "v_focus_signals_spec", (
        ("opened_at", "Дата начала / дата окончания"),
        ("subsidiary", "ДО"),
        ("function_name", "Функция"),
        ("service", "Услуга КТ-777"),
        ("contractor_id", "ПО (устойчивый ID)"),
    ), FOCUS_CHARTS + (c("DQ-FA", "Контроль качества и свежести", "v_data_quality_spec", "table", "на дату", columns=("contour", "duplicates", "unknown_dictionary_rows", "data_actual_at", "history_status")),)),
    DashboardSpec("contracts", "UID — Договоры", "v_contracts_spec", COMMON_FILTERS, CONTRACT_CHARTS + (c("DQ-CT", "Контроль качества и свежести", "v_data_quality_spec", "table", "на дату", columns=("contour", "duplicates", "unknown_dictionary_rows", "data_actual_at", "history_status")),)),
    DashboardSpec("rating", "UID — Флагман", "v_flagman_spec", COMMON_FILTERS[:7] + (("brigade", "Бригада"),), FLAGMAN_CHARTS + (c("DQ-FL", "Контроль качества и свежести", "v_data_quality_spec", "table", "на дату", columns=("contour", "duplicates", "unknown_dictionary_rows", "data_actual_at", "history_status")),)),
    DashboardSpec("breaches", "UID — Договорные нарушения", "v_violations_spec", COMMON_FILTERS, VIOLATION_CHARTS + (c("DQ-VN", "Контроль качества и свежести", "v_data_quality_spec", "table", "на дату", columns=("contour", "duplicates", "unknown_dictionary_rows", "data_actual_at", "history_status")),)),
    DashboardSpec("pcm", "UID — ПКМ", "v_pcm_spec", COMMON_FILTERS, PCM_CHARTS + (c("DQ-PK", "Контроль качества и свежести", "v_data_quality_spec", "table", "на дату", columns=("contour", "duplicates", "unknown_dictionary_rows", "data_actual_at", "history_status")),)),
    DashboardSpec("preclaims", "UID — ДПР", "v_dpr_spec", COMMON_FILTERS, DPR_CHARTS + (c("DQ-DP", "Контроль качества и свежести", "v_data_quality_spec", "table", "на дату", columns=("contour", "duplicates", "unknown_dictionary_rows", "data_actual_at", "history_status")),)),
)


DEFERRED_VISUALS = {
    "CT-06": "Нет истории план/факт по месяцам с начала договора.",
    "PK-05": "Нет отдельной сущности состава ПКМ.",
    "PK-07": "Нет журнала изменений контрольной даты.",
    "PK-09": "Нет зрелых когорт и подтвержденной экспозиции 90/180 дней.",
    "PK-10": "Не утверждены минимальный размер выборки и доверительный индикатор.",
    "PK-11": "Нет полной цепочки явных связей с повторным нарушением.",
    "DP-03": "Нет журнала статусных переходов ДПР.",
    "DP-05": "Нет полной истории и фактической даты закрытия для остатка.",
}


DATASET_TABLES = tuple(dict.fromkeys(
    chart.dataset for dashboard in DASHBOARDS for chart in dashboard.charts
)) + ("v_data_quality_spec",)
