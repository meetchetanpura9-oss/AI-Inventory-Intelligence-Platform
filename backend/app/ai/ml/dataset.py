from sqlalchemy.orm import Session

from app.ai.services.dataset_service import service


def load_training_rows(db: Session) -> list[dict]:
    return service.build_dataset(db).rows
