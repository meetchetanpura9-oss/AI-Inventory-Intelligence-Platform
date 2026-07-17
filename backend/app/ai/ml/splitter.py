def train_test_split_stats(total_rows: int, test_ratio: float = 0.2, validation_ratio: float = 0.0) -> dict:
    test_ratio = min(max(test_ratio, 0.0), 0.9)
    validation_ratio = min(max(validation_ratio, 0.0), 0.9)
    if test_ratio + validation_ratio >= 1:
        validation_ratio = max(0.0, 0.9 - test_ratio)

    test_size = int(round(total_rows * test_ratio))
    validation_size = int(round(total_rows * validation_ratio))
    train_size = max(0, total_rows - test_size - validation_size)

    return {
        "total_rows": total_rows,
        "train_size": train_size,
        "test_size": test_size,
        "validation_size": validation_size,
        "train_ratio": round(train_size / total_rows, 2) if total_rows else 0,
        "test_ratio": round(test_size / total_rows, 2) if total_rows else 0,
        "validation_ratio": round(validation_size / total_rows, 2) if total_rows else 0,
    }
