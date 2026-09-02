# UID ECO BI infrastructure

This directory contains the reproducible Apache Superset stack for the UID
analytics section. The implementation follows only
`Спецификация_дашборда_УИД_ЛК.md` and replaces the former React/Chart.js
dashboards and their browser-side calculation rules.

## Architecture

- `analytics/seed.sql` — demonstration source tables generated from typed fixtures.
- `analytics/views.sql` — the business calculation layer. Each view preserves a
  specification grain: contract, brigade-month, violation event, PCM card or
  DPR requirement.
- `dashboard_spec.py` — declarative chart catalog, native filters and the list of
  visuals deferred until their required source history exists.
- `bootstrap_superset.py` — idempotently creates datasets, charts, cross-filtered
  dashboards and embedding configuration; removes obsolete managed charts and
  the former standalone safety dashboard.
- `guest-token/` — allow-listed guest token broker for embedded dashboards.

Superset aggregates prepared columns and does not recreate distinct counting,
snapshot, overdue, service allocation or linkage rules in the browser.

## Published sections

1. Focus attention (`overview`)
2. Contracts (`contracts`)
3. Flagman (`rating`)
4. Contract violations (`breaches`)
5. PCM (`pcm`)
6. DPR (`preclaims`)

Every visual title contains its specification ID and the mode `за период` or
`на дату`. Each dashboard has native date/DO/function/service/contractor filters,
cross-filtering, a linked detail table and a data-quality/freshness table.

## Intentionally deferred visuals

The following charts are not fabricated from current-state rows:

- CT-06 — no monthly plan/fact history from contract start;
- PK-05 — no separate PCM action entity;
- PK-07 — no control-date change journal;
- PK-09/PK-10 — no mature cohorts, exposure or approved sample threshold;
- PK-11 — no complete explicit violation → PCM → repeat chain;
- DP-03 — no DPR status-event journal;
- DP-05 — no complete opening/closing history and actual close date.

Their reasons are machine-checked in `dashboard_spec.py`. They can be enabled
only after the corresponding marts from section 12 of the specification exist.

## Local start

1. Copy `.env.example` to `.env` and replace every generated value.
2. Run `docker compose build`.
3. Run `docker compose up -d`.
4. Check `docker compose ps` and `curl http://127.0.0.1:8088/health`.
5. Load `analytics/seed.sql`, then `analytics/views.sql` into `analytics-db`.
6. Run `python3 bootstrap_superset.py` from this directory.
7. Run `python3 configure_guest_role.py` in the Superset application context.

The Superset port is bound to `127.0.0.1`; expose it only through the configured
HTTPS reverse proxy.

## Verification

From the repository root:

```bash
yarn test
yarn bi:test
yarn build
```

With the stack running, additionally execute:

```bash
python3 validate_superset.py
python3 validate_embedding.py
```
