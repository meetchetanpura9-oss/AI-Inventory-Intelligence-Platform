import os
import json

EVALUATION_FILE = os.path.join(
    os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
    "saved_models",
    "evaluation_results.json"
)

class EvaluationService:
    def __init__(self):
        self.metrics = {
            "demand": {
                "trained": False,
                "mae": 0.0,
                "rmse": 0.0,
                "r2": 0.0,
                "accuracy_percentage": "0.0%"
            },
            "sales": {
                "trained": False,
                "mae": 0.0,
                "rmse": 0.0,
                "r2": 0.0,
                "accuracy_percentage": "0.0%"
            },
            "stockout": {
                "trained": False,
                "accuracy": 0.0,
                "precision": 0.0,
                "recall": 0.0,
                "f1": 0.0,
                "confusion_matrix": [[0, 0], [0, 0]]
            },
            "reorder": {
                "trained": False,
                "mae": 0.0,
                "rmse": 0.0,
                "r2": 0.0,
                "accuracy_percentage": "0.0%"
            }
        }
        self.load_metrics()

    def load_metrics(self):
        if os.path.exists(EVALUATION_FILE):
            try:
                with open(EVALUATION_FILE, "r") as f:
                    self.metrics = json.load(f)
            except Exception:
                pass

    def save_metrics(self):
        os.makedirs(os.path.dirname(EVALUATION_FILE), exist_ok=True)
        try:
            with open(EVALUATION_FILE, "w") as f:
                json.dump(self.metrics, f, indent=4)
        except Exception:
            pass

    def update_metrics(self, model_name: str, new_metrics: dict):
        if model_name in self.metrics:
            self.metrics[model_name].update(new_metrics)
            self.metrics[model_name]["trained"] = True
            self.save_metrics()

    def get_all_metrics(self) -> dict:
        self.load_metrics()
        return self.metrics

evaluation_service = EvaluationService()
