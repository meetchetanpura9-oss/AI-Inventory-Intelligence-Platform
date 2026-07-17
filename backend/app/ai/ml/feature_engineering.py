SELECTED_FEATURES = [
    "stock",
    "minimum_stock",
    "maximum_stock",
    "stock_percentage",
    "today_sales",
    "yesterday_sales",
    "last_7_days_sales",
    "last_30_days_sales",
    "average_daily_sales",
    "sales_growth",
    "revenue",
    "purchase_count",
    "search_count",
    "failed_searches",
    "demand_score",
    "temperature",
    "humidity",
    "rain",
    "festival",
    "holiday",
    "weekend",
    "day",
    "week",
    "month",
    "quarter",
    "year",
    "city",
    "state",
    "warehouse",
    "zone",
    "category",
    "weather_type",
    "demand_level",
]

TARGET_COLUMN = "reorder"

REMOVED_FEATURES = [
    "created_at",
    "updated_at",
    "uuid",
    "description",
    "barcode",
    "product",
    "sku",
]


def selected_features() -> dict:
    return {
        "selected_features": SELECTED_FEATURES,
        "target": TARGET_COLUMN,
        "removed_features": REMOVED_FEATURES,
        "feature_count": len(SELECTED_FEATURES),
    }


def add_target(rows: list[dict]) -> list[dict]:
    enriched = []
    for row in rows:
        item = dict(row)
        item[TARGET_COLUMN] = bool(
            item.get("stock", 0) <= item.get("minimum_stock", 0)
            or (
                item.get("failed_searches", 0) > 0
                and item.get("demand_score", 0) >= 60
            )
        )
        enriched.append(item)
    return enriched
