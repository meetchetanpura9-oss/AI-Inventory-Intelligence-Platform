from datetime import date
from sqlalchemy.orm import Session
from app.ai.services.dataset_service import service as dataset_service


class AIDatasetRepository:
    def get_dataset_rows(self, db: Session) -> list[dict]:
        build = dataset_service.build_dataset(db)
        return build.rows

    def count_total_rows(self, db: Session, rows: list[dict] = None) -> int:
        if rows is None:
            rows = self.get_dataset_rows(db)
        return len(rows)

    def count_distinct_products(self, db: Session, rows: list[dict] = None) -> int:
        if rows is None:
            rows = self.get_dataset_rows(db)
        return len(set(row["product"] for row in rows if row.get("product")))

    def count_distinct_categories(self, db: Session, rows: list[dict] = None) -> int:
        if rows is None:
            rows = self.get_dataset_rows(db)
        return len(set(row["category"] for row in rows if row.get("category")))

    def count_distinct_warehouses(self, db: Session, rows: list[dict] = None) -> int:
        if rows is None:
            rows = self.get_dataset_rows(db)
        return len(set(row["warehouse"] for row in rows if row.get("warehouse")))

    def count_distinct_cities(self, db: Session, rows: list[dict] = None) -> int:
        if rows is None:
            rows = self.get_dataset_rows(db)
        return len(set(row["city"] for row in rows if row.get("city")))

    def count_distinct_states(self, db: Session, rows: list[dict] = None) -> int:
        if rows is None:
            rows = self.get_dataset_rows(db)
        return len(set(row["state"] for row in rows if row.get("state")))

    def get_date_range(self, db: Session, rows: list[dict] = None) -> tuple[date, date]:
        if rows is None:
            rows = self.get_dataset_rows(db)
        if not rows:
            return date.today(), date.today()
        dates = [row["date"] for row in rows if row.get("date")]
        if not dates:
            return date.today(), date.today()
        return min(dates), max(dates)

    def count_missing_values(self, db: Session, rows: list[dict] = None) -> int:
        if rows is None:
            rows = self.get_dataset_rows(db)
        missing = 0
        for row in rows:
            for val in row.values():
                if val is None or val == "":
                    missing += 1
        return missing

    def calculate_dataset_size_mb(self, db: Session) -> float:
        csv_payload = dataset_service.export_csv(db)
        size_bytes = len(csv_payload.encode("utf-8"))
        size_mb = size_bytes / (1024 * 1024)
        return round(size_mb, 2)


repository = AIDatasetRepository()
