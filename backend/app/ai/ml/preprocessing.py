from __future__ import annotations

from datetime import date

from app.ai.ml.feature_engineering import SELECTED_FEATURES, add_target
from app.ai.ml.validation import validate_rows


CATEGORICAL_COLUMNS = [
    "category",
    "city",
    "state",
    "warehouse",
    "zone",
    "weather_type",
    "demand_level",
]

BOOLEAN_COLUMNS = [
    "rain",
    "festival",
    "holiday",
    "weekend",
    "diwali",
    "holi",
    "christmas",
    "navratri",
    "eid",
    "raksha_bandhan",
    "independence_day",
    "reorder",
]

SCALABLE_COLUMNS = [
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
]


def preprocess_rows(rows: list[dict]) -> dict:
    validation_before = validate_rows(rows)
    cleaned, duplicates_removed = _clean_rows(rows)
    encoded = _encode_rows(add_target(cleaned))
    scaled = _scale_rows(encoded)

    return {
        "status": "PREPROCESSED",
        "rows_processed": len(scaled),
        "columns_processed": len(scaled[0]) if scaled else 0,
        "missing_values_before": validation_before["missing_values"],
        "missing_values_after": _count_missing(scaled),
        "duplicates_removed": duplicates_removed,
        "encoded_columns": CATEGORICAL_COLUMNS + BOOLEAN_COLUMNS,
        "scaled_columns": SCALABLE_COLUMNS,
        "sample": scaled[:5],
    }


def _clean_rows(rows: list[dict]) -> tuple[list[dict], int]:
    cleaned: list[dict] = []
    seen = set()
    duplicates_removed = 0

    for row in rows:
        key = (row.get("date"), row.get("sku"), row.get("warehouse"))
        if key in seen:
            duplicates_removed += 1
            continue
        seen.add(key)

        item = dict(row)
        for column, value in list(item.items()):
            if value is None:
                item[column] = _default_value(column)
            elif isinstance(value, str):
                item[column] = _normalize_name(value)
            elif isinstance(value, (int, float)) and value < 0:
                item[column] = 0

        if not isinstance(item.get("date"), date):
            continue
        cleaned.append(item)

    return cleaned, duplicates_removed


def _encode_rows(rows: list[dict]) -> list[dict]:
    encoders: dict[str, dict[str, int]] = {}
    for column in CATEGORICAL_COLUMNS:
        values = sorted({str(row.get(column, "Unknown")) for row in rows})
        encoders[column] = {value: index for index, value in enumerate(values)}

    encoded = []
    for row in rows:
        item = dict(row)
        for column in CATEGORICAL_COLUMNS:
            item[f"{column}_encoded"] = encoders[column].get(str(item.get(column, "Unknown")), 0)
        for column in BOOLEAN_COLUMNS:
            item[column] = 1 if item.get(column) else 0
        encoded.append({key: item[key] for key in item if key in SELECTED_FEATURES or key.endswith("_encoded") or key == "reorder"})
    return encoded


def _scale_rows(rows: list[dict]) -> list[dict]:
    if not rows:
        return rows

    ranges = {}
    for column in SCALABLE_COLUMNS:
        values = [float(row.get(column, 0) or 0) for row in rows]
        ranges[column] = (min(values), max(values))

    scaled = []
    for row in rows:
        item = dict(row)
        for column, (min_value, max_value) in ranges.items():
            value = float(item.get(column, 0) or 0)
            item[column] = 0.0 if max_value == min_value else round((value - min_value) / (max_value - min_value), 4)
        scaled.append(item)
    return scaled


def _default_value(column: str):
    if column in CATEGORICAL_COLUMNS:
        return "Unknown"
    if column == "days_since_last_purchase":
        return 0
    return 0


def _normalize_name(value: str) -> str:
    value = " ".join(value.strip().split())
    return value.title() if value else "Unknown"


def _count_missing(rows: list[dict]) -> int:
    return sum(
        1
        for row in rows
        for value in row.values()
        if value is None or value == ""
    )
