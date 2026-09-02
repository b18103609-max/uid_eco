BEGIN;

-- Superset only aggregates these specification-aligned marts. Business rules
-- and grain are fixed here instead of being reconstructed in chart settings.

CREATE OR REPLACE VIEW v_contractor_dim_spec AS
SELECT * FROM (VALUES
  ('PO-001'::text, 'Альфа-Строй'::text),
  ('PO-002', 'БетаГрупп'),
  ('PO-003', 'Гамма-ТЭК'),
  ('PO-004', 'Дельта Инж'),
  ('PO-005', 'Сигма Плюс'),
  ('PO-006', 'Омега-Сервис')
) AS contractor_dictionary(contractor_id, contractor);

CREATE OR REPLACE VIEW v_contracts_spec AS
SELECT
  c.id AS object_id,
  c.id AS contract_id,
  c.number AS object_number,
  c.number AS contract_number,
  c.report_date AS fact_date,
  c.report_date AS snapshot_date,
  'на дату'::text AS period_mode,
  c.subsidiary,
  c.structural_unit,
  c.service AS function_name,
  'Не определено'::text AS service_group,
  c.service,
  c.kt777,
  coalesce((SELECT d.contractor_id FROM v_contractor_dim_spec d WHERE d.contractor = c.contractor), 'PO-UNKNOWN') AS contractor_id,
  c.contractor,
  c.portfolio,
  c.start_date AS date_start,
  c.end_date AS date_end,
  'Действует'::text AS status,
  (c.start_date <= c.report_date AND c.report_date <= c.end_date) AS is_active,
  c.amount_mln * 1000000::numeric AS contract_amount_rub,
  c.finance_plan_mln * 1000000::numeric AS plan_amount_rub,
  c.finance_fact_mln * 1000000::numeric AS fact_amount_rub,
  c.cumulative_fact_mln * 1000000::numeric AS cumulative_fact_amount_rub,
  CASE WHEN c.finance_plan_mln = 0 THEN NULL
       ELSE round(c.finance_fact_mln::numeric / c.finance_plan_mln * 100, 1) END AS execution_percent,
  greatest(c.amount_mln - c.cumulative_fact_mln, 0) * 1000000::numeric AS unspent_amount_rub,
  greatest(c.cumulative_fact_mln - c.amount_mln, 0) * 1000000::numeric AS overrun_amount_rub,
  (c.finance_plan_mln = 0) AS has_zero_plan,
  (c.finance_plan_mln <> 0 AND c.finance_fact_mln IS DISTINCT FROM c.finance_plan_mln) AS has_plan_fact_deviation,
  (c.finance_fact_mln - c.finance_plan_mln) * 1000000::numeric AS plan_fact_delta_rub,
  c.risk AS risk_level,
  c.critical,
  c.team_assigned,
  CASE WHEN c.team_assigned THEN 'ЕОЛ и КИ назначены' ELSE 'Команда не укомплектована' END AS team_status,
  (c.eol IS NULL OR btrim(c.eol) = '') AS missing_eol,
  (c.curator IS NULL OR btrim(c.curator) = '') AS missing_ki,
  CASE WHEN c.team_assigned THEN 0 ELSE greatest(c.report_date - c.start_date, 0) END AS days_without_team,
  nullif(c.eol, '') AS eol,
  nullif(c.curator, '') AS ki,
  c.oedk_score,
  c.oedk_zone,
  c.previous_oedk_zone,
  (c.oedk_zone IS DISTINCT FROM c.previous_oedk_zone) AS oedk_zone_changed,
  c.motivation_mln * 1000000::numeric AS motivation_amount_rub,
  c.sanctions_billed_mln * 1000000::numeric AS sanctions_billed_rub,
  c.sanctions_paid_mln * 1000000::numeric AS sanctions_paid_rub,
  c.proactive_mln * 1000000::numeric AS proactive_amount_rub,
  (SELECT count(DISTINCT b.id) FROM contract_breaches b WHERE b.contract_id = c.id) AS violation_count,
  (SELECT count(DISTINCT m.id) FROM measures m WHERE m.contract_id = c.id) AS pcm_count,
  (SELECT count(DISTINCT p.id) FROM preclaim_cases p WHERE p.contract_id = c.id) AS dpr_count,
  c.end_date AS deadline,
  coalesce(nullif(c.eol, ''), nullif(c.curator, ''), 'Не назначен') AS responsible,
  '/uid_eco/?object=contract&id=' || c.id AS object_url,
  c.report_date AS data_actual_at
FROM contracts c;

CREATE OR REPLACE VIEW v_flagman_spec AS
WITH official AS (
  SELECT r.*,
    lag(r.score) OVER (PARTITION BY r.brigade ORDER BY r.report_date) AS previous_score,
    lag(r.zone) OVER (PARTITION BY r.brigade ORDER BY r.report_date) AS previous_zone,
    row_number() OVER (PARTITION BY r.brigade ORDER BY r.report_date DESC) AS current_rank
  FROM rating_records r
  WHERE r.service IN ('Бурение', 'ТКРС') AND NOT r.preliminary
)
SELECT
  brigade || ':' || to_char(report_date, 'YYYY-MM') AS object_id,
  brigade AS brigade_id,
  brigade AS object_number,
  report_date AS fact_date,
  report_date AS snapshot_date,
  CASE WHEN current_rank = 1 THEN 'на дату' ELSE 'за период' END AS period_mode,
  subsidiary,
  structural_unit,
  service AS function_name,
  service,
  'Не определено'::text AS service_group,
  'Не определено'::text AS kt777,
  coalesce((SELECT d.contractor_id FROM v_contractor_dim_spec d WHERE d.contractor = official.contractor), 'PO-UNKNOWN') AS contractor_id,
  contractor,
  field,
  brigade,
  score,
  zone,
  previous_score,
  previous_zone,
  score - previous_score AS delta_score,
  CASE WHEN previous_score IS NULL THEN 'Новая бригада'
       WHEN score > previous_score THEN 'Улучшилась'
       WHEN score < previous_score THEN 'Ухудшилась'
       ELSE 'Без изменений' END AS score_direction,
  (zone = 'Красная' AND previous_zone IS DISTINCT FROM 'Красная' AND previous_zone IS NOT NULL) AS is_new_red,
  stop_factor,
  false AS preliminary,
  true AS is_official,
  (current_rank = 1) AS is_current,
  technology,
  hse,
  score - technology - hse AS unexplained_adjustment,
  '/uid_eco/?object=brigade&id=' || brigade AS object_url,
  report_date AS data_actual_at
FROM official;

CREATE OR REPLACE VIEW v_flagman_safety_spec AS
SELECT
  s.id AS object_id,
  s.id AS violation_id,
  s.id AS object_number,
  s.incident_date AS fact_date,
  (SELECT max(report_date) FROM safety_records) AS snapshot_date,
  'за период'::text AS period_mode,
  s.subsidiary,
  s.structural_unit,
  s.service AS function_name,
  s.service,
  'Не определено'::text AS service_group,
  'Не определено'::text AS kt777,
  coalesce((SELECT d.contractor_id FROM v_contractor_dim_spec d WHERE d.contractor = s.contractor), 'PO-UNKNOWN') AS contractor_id,
  s.contractor,
  s.field,
  s.brigade,
  s.source AS detection_method,
  s.violation AS scenario,
  s.severity,
  s.status,
  s.stop_factor,
  s.contract_breach,
  s.linked_measure,
  s.self_assessment,
  s.threshold,
  s.self_assessment - s.threshold AS assessment_delta,
  s.responsible,
  s.comment,
  '/uid_eco/?object=flagman-violation&id=' || s.id AS object_url,
  s.report_date AS data_actual_at
FROM safety_records s
WHERE s.service IN ('Бурение', 'ТКРС');

CREATE OR REPLACE VIEW v_violations_spec AS
WITH enriched AS (
  SELECT b.*, c.portfolio,
    lag(b.incident_date) OVER (PARTITION BY b.contractor, b.category ORDER BY b.incident_date, b.id) AS previous_incident_date,
    EXISTS (SELECT 1 FROM preclaim_cases p WHERE p.contract_id = b.contract_id AND p.act_number = b.act_number) AS linked_dpr,
    EXISTS (SELECT 1 FROM measure_breach_links l WHERE l.breach_id = b.id) AS linked_pcm,
    (SELECT max(report_date) FROM contract_breaches) AS max_report_date
  FROM contract_breaches b
  LEFT JOIN contracts c ON c.id = b.contract_id
)
SELECT
  id AS object_id,
  id AS violation_id,
  id AS object_number,
  incident_date AS fact_date,
  max_report_date AS snapshot_date,
  'за период'::text AS period_mode,
  subsidiary,
  structural_unit,
  service AS function_name,
  'Не определено'::text AS service_group,
  service,
  kt777,
  coalesce((SELECT d.contractor_id FROM v_contractor_dim_spec d WHERE d.contractor = enriched.contractor), 'PO-UNKNOWN') AS contractor_id,
  contractor,
  portfolio,
  contract_id,
  contract_number,
  field,
  well,
  act_number,
  category,
  violation_type,
  violation_type AS scenario,
  kind,
  CASE WHEN category = 'ПБ' THEN 'Критичность не определена' ELSE 'Не классифицировано' END AS severity,
  CASE WHEN resolution = 'В работе' THEN 'Открыто'
       WHEN resolution = 'Не предъявлять' THEN 'Отозвано'
       ELSE 'Закрыто с решением' END AS status,
  resolution,
  (resolution = 'В работе') AS is_open,
  (category = 'ПБ') AS is_safety,
  (incident_date >= max_report_date - INTERVAL '3 months') AS is_last_3_months,
  (previous_incident_date IS NOT NULL AND incident_date - previous_incident_date <= 90) AS is_repeat_90d,
  linked_dpr,
  linked_pcm,
  CASE WHEN linked_dpr AND linked_pcm THEN 'ДПР и ПКМ'
       WHEN linked_dpr THEN 'ДПР'
       WHEN linked_pcm THEN 'ПКМ'
       WHEN resolution = 'Не предъявлять' THEN 'Отозвано'
       ELSE 'Без связанной карточки' END AS linked_outcome,
  CASE WHEN resolution = 'В работе' THEN max_report_date - incident_date ELSE NULL END AS open_age_days,
  CASE WHEN resolution <> 'В работе' THEN 'Закрыто'
       WHEN max_report_date - incident_date <= 7 THEN '1–7'
       WHEN max_report_date - incident_date <= 30 THEN '8–30'
       WHEN max_report_date - incident_date <= 60 THEN '31–60'
       WHEN max_report_date - incident_date <= 90 THEN '61–90'
       ELSE '>90' END AS age_bucket,
  eol AS responsible,
  comment,
  '/uid_eco/?object=violation&id=' || id AS object_url,
  report_date AS data_actual_at
FROM enriched;

CREATE OR REPLACE VIEW v_pcm_spec AS
WITH base AS (
  SELECT m.*, c.portfolio, c.risk AS contract_risk, c.kt777,
    EXISTS (SELECT 1 FROM measure_breach_links l WHERE l.measure_id = m.id) AS linked_to_violation,
    (SELECT max(report_date) FROM measures) AS max_report_date
  FROM measures m LEFT JOIN contracts c ON c.id = m.contract_id
)
SELECT
  id AS object_id,
  id AS pcm_id,
  id AS object_number,
  report_date AS fact_date,
  max_report_date AS snapshot_date,
  'за период'::text AS period_mode,
  subsidiary,
  function_name,
  'Не определено'::text AS service_group,
  service,
  coalesce(kt777, 'Не определено') AS kt777,
  coalesce((SELECT d.contractor_id FROM v_contractor_dim_spec d WHERE d.contractor = base.contractor), 'PO-UNKNOWN') AS contractor_id,
  contractor,
  portfolio,
  field,
  contract_id,
  contract_number,
  violation_id,
  violation_category,
  violation_category AS source_scenario,
  title,
  status_code AS status,
  report_date AS created_at,
  planned_end_date AS original_control_date,
  planned_end_date AS actual_control_date,
  completed_at,
  (completed_at IS NOT NULL AND completed_at <= planned_end_date) AS completed_on_time,
  (status_code NOT IN ('Реализовано', 'Отменено') AND planned_end_date < max_report_date) AS is_overdue,
  CASE WHEN status_code NOT IN ('Реализовано', 'Отменено') AND planned_end_date < max_report_date
       THEN max_report_date - planned_end_date ELSE 0 END AS overdue_days,
  CASE WHEN status_code IN ('Реализовано', 'Отменено') THEN 'Закрыто'
       WHEN planned_end_date >= max_report_date THEN 'Не просрочено'
       WHEN max_report_date - planned_end_date <= 7 THEN '1–7'
       WHEN max_report_date - planned_end_date <= 30 THEN '8–30'
       WHEN max_report_date - planned_end_date <= 60 THEN '31–60'
       WHEN max_report_date - planned_end_date <= 90 THEN '61–90'
       ELSE '>90' END AS overdue_bucket,
  CASE WHEN planned_end_date IS NULL THEN 'Без срока'
       WHEN status_code IN ('Реализовано', 'Отменено') AND completed_at <= planned_end_date THEN 'В срок'
       WHEN status_code IN ('Реализовано', 'Отменено') THEN 'Ранее просрочено'
       WHEN planned_end_date < max_report_date THEN 'Просрочено сейчас'
       ELSE 'В сроке' END AS deadline_state,
  false AS has_deadline_transfer,
  0::integer AS transfer_count,
  linked_to_violation,
  (responsible_person IS NULL OR btrim(responsible_person) = '') AS without_responsible,
  responsible_person AS responsible,
  similar_before,
  similar_after,
  CASE WHEN completed_at IS NOT NULL THEN similar_after - similar_before ELSE NULL END AS repeat_delta,
  (completed_at IS NOT NULL AND similar_after = 0) AS no_repeat_observed,
  false AS mature_90d_cohort,
  '/uid_eco/?object=pkm&id=' || id AS object_url,
  report_date AS data_actual_at,
  contract_risk
FROM base;

CREATE OR REPLACE VIEW v_dpr_spec AS
WITH base AS (
  SELECT p.*, c.portfolio, (SELECT max(report_date) FROM preclaim_cases) AS max_report_date
  FROM preclaim_cases p
  LEFT JOIN contracts c ON c.id = p.contract_id
)
SELECT
  id AS object_id,
  id AS dpr_id,
  requirement_number AS object_number,
  received_date AS fact_date,
  max_report_date AS snapshot_date,
  'за период'::text AS period_mode,
  subsidiary,
  structural_unit,
  service AS function_name,
  service_sector AS service_group,
  service,
  kt777,
  coalesce((SELECT d.contractor_id FROM v_contractor_dim_spec d WHERE d.contractor = base.contractor), 'PO-UNKNOWN') AS contractor_id,
  contractor,
  portfolio,
  contract_id,
  contract_number,
  field,
  well,
  act_number,
  incident_date,
  category,
  violation_type,
  kind,
  stage_label AS current_stage,
  stage,
  closure_status AS status,
  decision,
  response_position,
  (closure_status = 'в работе') AS is_open,
  (closure_status = 'в работе' AND deviation > 0) AS is_overdue,
  greatest(deviation, 0) AS overdue_days,
  CASE WHEN closure_status <> 'в работе' OR deviation <= 0 THEN 'Не просрочено'
       WHEN deviation <= 7 THEN '1–7'
       WHEN deviation <= 30 THEN '8–30'
       WHEN deviation <= 60 THEN '31–60'
       WHEN deviation <= 90 THEN '61–90'
       ELSE '>90' END AS overdue_bucket,
  amount * 1000000::numeric AS presented_amount_rub,
  recognized * 1000000::numeric AS paid_amount_rub,
  alternative_amount * 1000000::numeric AS alternative_amount_rub,
  rejected * 1000000::numeric AS withdrawn_amount_rub,
  greatest(amount - recognized - alternative_amount - rejected, 0) * 1000000::numeric AS unresolved_amount_rub,
  claim_amount * 1000000::numeric AS claim_amount_rub,
  court_amount * 1000000::numeric AS court_amount_rub,
  (closure_status = 'оплачено') AS is_paid,
  (closure_status = 'заменена на альтернатив') AS is_alternative,
  (closure_status = 'отозвано') AS is_withdrawn,
  (closure_status IN ('оплачено', 'заменена на альтернатив')) AS successful_resolution,
  CASE WHEN closure_status IN ('оплачено', 'заменена на альтернатив') THEN 1 ELSE 0 END AS successful_resolution_flag,
  days AS duration_days,
  deviation AS deviation_days,
  limitation_date,
  limitation_date - max_report_date AS limitation_days_left,
  CASE WHEN limitation_date - max_report_date <= 90 THEN '≤90'
       WHEN limitation_date - max_report_date <= 180 THEN '91–180'
       ELSE '>180' END AS limitation_bucket,
  eol,
  curator AS responsible,
  comment,
  '/uid_eco/?object=dpr&id=' || id AS object_url,
  report_date AS data_actual_at
FROM base;

CREATE OR REPLACE VIEW v_focus_signals_spec AS
SELECT 'PB:' || object_id AS signal_id, 'P1'::text AS priority,
  'Критичное нарушение ПБ/стоп-фактор'::text AS signal_rule,
  object_id, object_number, 'Нарушение ПБ'::text AS object_type,
  contractor_id, contractor, subsidiary, function_name, service,
  fact_date AS opened_at, snapshot_date - fact_date AS age_days,
  responsible, object_url, snapshot_date, data_actual_at
FROM v_flagman_safety_spec
WHERE status <> 'Устранено' AND (severity = 'Критическое' OR stop_factor)
UNION ALL
SELECT 'RED:' || object_id, 'P1', 'Новая красная зона', object_id, object_number,
  'Бригада', contractor_id, contractor, subsidiary, function_name, service,
  fact_date, 0, 'Не назначен', object_url, snapshot_date, data_actual_at
FROM v_flagman_spec WHERE is_current AND is_new_red
UNION ALL
SELECT 'TEAM:' || object_id, 'P1', 'Высокорисковый договор без команды', object_id, object_number,
  'Договор', contractor_id, contractor, subsidiary, function_name, service,
  date_start, days_without_team, responsible, object_url, snapshot_date, data_actual_at
FROM v_contracts_spec
WHERE is_active AND risk_level = 'Высокий' AND (missing_eol OR missing_ki)
UNION ALL
SELECT 'PCM:' || object_id,
  CASE WHEN overdue_days > 30 OR violation_category = 'ПБ' THEN 'P1' ELSE 'P2' END,
  'Просроченный ПКМ', object_id, object_number, 'ПКМ', contractor_id, contractor,
  subsidiary, function_name, service, created_at, overdue_days,
  coalesce(responsible, 'Не назначен'), object_url, snapshot_date, data_actual_at
FROM v_pcm_spec WHERE is_overdue
UNION ALL
SELECT 'DPR:' || object_id,
  CASE WHEN overdue_days > 30 OR category ILIKE '%ПБ%' THEN 'P1' ELSE 'P2' END,
  'Просроченная ДПР', object_id, object_number, 'ДПР', contractor_id, contractor,
  subsidiary, function_name, service, fact_date, overdue_days,
  coalesce(responsible, 'Не назначен'), object_url, snapshot_date, data_actual_at
FROM v_dpr_spec WHERE is_overdue;

CREATE OR REPLACE VIEW v_data_quality_spec AS
SELECT 'Договоры'::text AS contour, count(*) - count(DISTINCT object_id) AS duplicates,
  count(*) FILTER (WHERE subsidiary IS NULL OR contractor_id = 'PO-UNKNOWN' OR function_name IS NULL OR kt777 IS NULL OR service_group = 'Не определено') AS unknown_dictionary_rows,
  max(data_actual_at) AS data_actual_at, 'Срез договора'::text AS history_status
FROM v_contracts_spec
UNION ALL
SELECT 'Флагман', count(*) - count(DISTINCT object_id),
  count(*) FILTER (WHERE subsidiary IS NULL OR contractor_id = 'PO-UNKNOWN' OR function_name IS NULL OR service_group = 'Не определено'),
  max(data_actual_at), 'Официальные месячные срезы' FROM v_flagman_spec
UNION ALL
SELECT 'Нарушения', count(*) - count(DISTINCT object_id),
  count(*) FILTER (WHERE subsidiary IS NULL OR contractor_id = 'PO-UNKNOWN' OR category IS NULL OR service_group = 'Не определено'),
  max(data_actual_at), 'Журнал статусов отсутствует' FROM v_violations_spec
UNION ALL
SELECT 'ПКМ', count(*) - count(DISTINCT object_id),
  count(*) FILTER (WHERE subsidiary IS NULL OR contractor_id = 'PO-UNKNOWN' OR status IS NULL OR service_group = 'Не определено'),
  max(data_actual_at), 'Журнал переносов и состав ПКМ отсутствуют' FROM v_pcm_spec
UNION ALL
SELECT 'ДПР', count(*) - count(DISTINCT object_id),
  count(*) FILTER (WHERE subsidiary IS NULL OR contractor_id = 'PO-UNKNOWN' OR status IS NULL),
  max(data_actual_at), 'Журнал переходов отсутствует' FROM v_dpr_spec;

COMMIT;
