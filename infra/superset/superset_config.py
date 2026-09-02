import os

from cachelib.redis import RedisCache


SECRET_KEY = os.environ["SUPERSET_SECRET_KEY"]
SQLALCHEMY_DATABASE_URI = (
    "postgresql+psycopg2://superset:"
    f"{os.environ['SUPERSET_DB_PASSWORD']}@metadata-db:5432/superset"
)

FEATURE_FLAGS = {
    "DASHBOARD_RBAC": True,
    "EMBEDDED_SUPERSET": True,
    "DASHBOARD_NATIVE_FILTERS": True,
    "DASHBOARD_CROSS_FILTERS": True,
}

GUEST_ROLE_NAME = "Gamma"
GUEST_TOKEN_JWT_SECRET = os.environ["GUEST_TOKEN_JWT_SECRET"]
GUEST_TOKEN_JWT_AUDIENCE = "superset"
GUEST_TOKEN_JWT_EXP_SECONDS = 300

ENABLE_PROXY_FIX = True
WTF_CSRF_ENABLED = True
TALISMAN_ENABLED = False

SESSION_COOKIE_SAMESITE = "None"
SESSION_COOKIE_SECURE = os.getenv("SESSION_COOKIE_SECURE", "false").lower() == "true"

REDIS_HOST = "redis"
REDIS_PORT = 6379
CACHE_CONFIG = {
    "CACHE_TYPE": "RedisCache",
    "CACHE_DEFAULT_TIMEOUT": 300,
    "CACHE_KEY_PREFIX": "superset_",
    "CACHE_REDIS_HOST": REDIS_HOST,
    "CACHE_REDIS_PORT": REDIS_PORT,
    "CACHE_REDIS_DB": 1,
}
DATA_CACHE_CONFIG = CACHE_CONFIG
FILTER_STATE_CACHE_CONFIG = CACHE_CONFIG
EXPLORE_FORM_DATA_CACHE_CONFIG = CACHE_CONFIG

RATELIMIT_STORAGE_URI = f"redis://{REDIS_HOST}:{REDIS_PORT}/2"

# Keep dashboard requests on the current Superset host. This setting is for
# additional domain-sharding hostnames, not for the public origin URL.
SUPERSET_WEBSERVER_DOMAINS = None
