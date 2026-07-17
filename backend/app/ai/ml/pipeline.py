from __future__ import annotations

from datetime import datetime

from app.ai.ml.feature_engineering import selected_features


class PipelineState:
    def __init__(self) -> None:
        self.last_run_at: datetime | None = None
        self.status = "READY"
        self.steps = [
            {"name": "Dataset", "status": "READY"},
            {"name": "Cleaning", "status": "PENDING"},
            {"name": "Encoding", "status": "PENDING"},
            {"name": "Scaling", "status": "PENDING"},
            {"name": "Feature Engineering", "status": "READY"},
            {"name": "Train/Test Split", "status": "PENDING"},
        ]

    def mark_preprocessed(self) -> None:
        self.last_run_at = datetime.utcnow()
        self.status = "PREPROCESSED"
        self.steps = [
            {"name": "Dataset", "status": "READY"},
            {"name": "Cleaning", "status": "DONE"},
            {"name": "Encoding", "status": "DONE"},
            {"name": "Scaling", "status": "DONE"},
            {"name": "Feature Engineering", "status": "DONE"},
            {"name": "Train/Test Split", "status": "READY"},
        ]

    def as_dict(self, dataset_rows: int) -> dict:
        return {
            "status": self.status,
            "steps": self.steps,
            "last_run_at": self.last_run_at,
            "dataset_rows": dataset_rows,
            "selected_features": selected_features()["feature_count"],
        }


pipeline_state = PipelineState()
