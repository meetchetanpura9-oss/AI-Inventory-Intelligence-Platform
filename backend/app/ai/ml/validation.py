from datetime import date


NUMERIC_COLUMNS = [
    "stock",
    "minimum_stock",
    "maximum_stock",
    "sales",
    "purchase",
    "search_count",
    "failed_searches",
    "temperature",
    "humidity",
    "demand_score",
]


def validate_rows(rows: list[dict]) -> dict:
    seen = set()
    duplicate_rows = 0
    missing_values = 0
    negative_values = 0
    invalid_dates = 0
    issues: list[str] = []

    for index, row in enumerate(rows):
        key = (row.get("date"), row.get("sku"), row.get("warehouse"))
        if key in seen:
            duplicate_rows += 1
        seen.add(key)

        missing_values += sum(1 for value in row.values() if value is None or value == "")

        for column in NUMERIC_COLUMNS:
            value = row.get(column)
            if isinstance(value, (int, float)) and value < 0:
                negative_values += 1
                issues.append(f"Row {index + 1}: {column} is negative")

        row_date = row.get("date")
        if not isinstance(row_date, date):
            invalid_dates += 1
            issues.append(f"Row {index + 1}: date is invalid")
        elif row_date.year < 2000 or row_date.year > 2100:
            invalid_dates += 1
            issues.append(f"Row {index + 1}: date is outside supported range")

    if duplicate_rows:
        issues.append(f"{duplicate_rows} duplicate rows detected")
    if missing_values:
        issues.append(f"{missing_values} missing values detected")

    status = "VALID" if not issues else "NEEDS_CLEANING"
    return {
        "status": status,
        "total_rows": len(rows),
        "total_columns": len(rows[0]) if rows else 0,
        "missing_values": missing_values,
        "duplicate_rows": duplicate_rows,
        "negative_values": negative_values,
        "invalid_dates": invalid_dates,
        "issues": issues[:25],
    }
