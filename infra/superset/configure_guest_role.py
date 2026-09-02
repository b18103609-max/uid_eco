"""Grant the embedded guest role access only to UID analytics datasets."""

from superset import db
from superset.extensions import appbuilder
from superset.connectors.sqla.models import SqlaTable


TABLES = {
    "v_contracts_spec",
    "v_flagman_spec",
    "v_flagman_safety_spec",
    "v_violations_spec",
    "v_pcm_spec",
    "v_dpr_spec",
    "v_focus_signals_spec",
    "v_data_quality_spec",
}

role = appbuilder.sm.find_role("Gamma")
assert role is not None, "Superset role Gamma was not found"

datasets = db.session.query(SqlaTable).filter(SqlaTable.table_name.in_(TABLES)).all()
assert len(datasets) == len(TABLES), "One or more UID datasets are missing"

for dataset in datasets:
    permission = appbuilder.sm.find_permission_view_menu("datasource_access", dataset.perm)
    assert permission is not None, f"Datasource permission is missing: {dataset.perm}"
    appbuilder.sm.add_permission_role(role, permission)

# Superset 6 applies a second database-level visibility filter to Chart API.
# Scope that permission to the dedicated UID analytics database only.
database = datasets[0].database
database_access = appbuilder.sm.find_permission_view_menu("database_access", database.perm)
assert database_access is not None, f"Database permission is missing: {database.perm}"
appbuilder.sm.add_permission_role(role, database_access)

db.session.commit()
print(f"Gamma can access {len(datasets)} UID datasets")
