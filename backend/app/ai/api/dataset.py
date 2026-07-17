from fastapi import APIRouter, Depends, Query
from fastapi.responses import Response
from sqlalchemy.orm import Session

from app.ai.ml.dataset import load_training_rows
from app.ai.ml.feature_engineering import selected_features
from app.ai.ml.pipeline import pipeline_state
from app.ai.ml.preprocessing import preprocess_rows
from app.ai.ml.splitter import train_test_split_stats
from app.ai.ml.validation import validate_rows
from app.ai.schemas import (
    AIDatasetResponse,
    DatasetValidationResponse,
    FeatureListResponse,
    PipelineStatusResponse,
    PreprocessResponse,
    TrainTestSplitResponse,
)
from app.ai.services.dataset_service import service
from app.database.dependencies import get_db
from app.permissions.dependencies import require_roles
from app.permissions.roles import UserRole

ai_dataset_router = APIRouter()

can_read_ai_dataset = require_roles(
    UserRole.ADMIN,
    UserRole.STORE_MANAGER,
    UserRole.STAFF,
    UserRole.VIEWER,
)


@ai_dataset_router.get(
    "/dataset",
    response_model=AIDatasetResponse,
    dependencies=[Depends(can_read_ai_dataset)],
)
def get_ai_dataset(
    limit: int = Query(50, ge=1, le=500),
    offset: int = Query(0, ge=0),
    db: Session = Depends(get_db),
):
    return service.get_dataset(db, limit=limit, offset=offset)


from app.schemas.ai_dataset_summary import DatasetSummaryResponse
from app.services.ai_dataset_summary_service import service as summary_service


@ai_dataset_router.get(
    "/dataset/summary",
    response_model=DatasetSummaryResponse,
    dependencies=[Depends(can_read_ai_dataset)],
)
def get_dataset_summary(db: Session = Depends(get_db)):
    return summary_service.get_summary(db)


@ai_dataset_router.get(
    "/dataset/export",
    dependencies=[Depends(can_read_ai_dataset)],
)
def export_ai_dataset(db: Session = Depends(get_db)):
    csv_payload = service.export_csv(db)
    return Response(
        content=csv_payload,
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=ai_training_dataset.csv"},
    )


@ai_dataset_router.post(
    "/preprocess",
    response_model=PreprocessResponse,
    dependencies=[Depends(can_read_ai_dataset)],
)
def preprocess_ai_dataset(db: Session = Depends(get_db)):
    result = preprocess_rows(load_training_rows(db))
    pipeline_state.mark_preprocessed()
    return result


@ai_dataset_router.get(
    "/features",
    response_model=FeatureListResponse,
    dependencies=[Depends(can_read_ai_dataset)],
)
def get_ai_features():
    return selected_features()


@ai_dataset_router.post(
    "/train-test-split",
    response_model=TrainTestSplitResponse,
    dependencies=[Depends(can_read_ai_dataset)],
)
def split_ai_dataset(db: Session = Depends(get_db)):
    return train_test_split_stats(len(load_training_rows(db)), test_ratio=0.2)


@ai_dataset_router.get(
    "/pipeline/status",
    response_model=PipelineStatusResponse,
    dependencies=[Depends(can_read_ai_dataset)],
)
def get_pipeline_status(db: Session = Depends(get_db)):
    return pipeline_state.as_dict(dataset_rows=len(load_training_rows(db)))


@ai_dataset_router.post(
    "/validate",
    response_model=DatasetValidationResponse,
    dependencies=[Depends(can_read_ai_dataset)],
)
def validate_ai_dataset(db: Session = Depends(get_db)):
    return validate_rows(load_training_rows(db))
