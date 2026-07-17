from sqlalchemy.orm import Session
from app.repositories.ai_dataset_repository import repository as ai_dataset_repository


class AIDatasetSummaryService:
    def get_summary(self, db: Session):
        rows = ai_dataset_repository.get_dataset_rows(db)
        
        total_rows = ai_dataset_repository.count_total_rows(db, rows)
        total_products = ai_dataset_repository.count_distinct_products(db, rows)
        total_categories = ai_dataset_repository.count_distinct_categories(db, rows)
        total_cities = ai_dataset_repository.count_distinct_cities(db, rows)
        total_states = ai_dataset_repository.count_distinct_states(db, rows)
        total_warehouses = ai_dataset_repository.count_distinct_warehouses(db, rows)
        missing_values = ai_dataset_repository.count_missing_values(db, rows)
        dataset_size_mb = ai_dataset_repository.calculate_dataset_size_mb(db)
        start_date, end_date = ai_dataset_repository.get_date_range(db, rows)

        return {
            "total_rows": total_rows,
            "total_products": total_products,
            "total_categories": total_categories,
            "total_cities": total_cities,
            "total_states": total_states,
            "total_warehouses": total_warehouses,
            "missing_values": missing_values,
            "dataset_size_mb": dataset_size_mb,
            "start_date": start_date,
            "end_date": end_date,
        }


service = AIDatasetSummaryService()
