import unittest
from datetime import UTC, datetime, timedelta

from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.auth.dependencies import get_current_active_user
from app.auth.models import User
from app.customer_search.models import CustomerSearch
from app.database.base import Base
from app.database.dependencies import get_db
from app.main import app
from app.models.inventory import Inventory
from app.models.product import Product
from app.models.purchase import Purchase
from app.models.sale import Sale


SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()


def override_current_user():
    return User(
        id=1,
        full_name="AI Tester",
        email="ai@example.com",
        phone="+10000000000",
        password_hash="test",
        role="ADMIN",
        is_active=True,
    )


class TestAIDataset(unittest.TestCase):
    def setUp(self):
        Base.metadata.create_all(bind=engine)
        app.dependency_overrides[get_db] = override_get_db
        app.dependency_overrides[get_current_active_user] = override_current_user
        self.client = TestClient(app)
        self._seed_data()

    def tearDown(self):
        Base.metadata.drop_all(bind=engine)
        app.dependency_overrides.clear()

    def _seed_data(self):
        db = TestingSessionLocal()
        try:
            product = Product(
                id=1,
                sku="MILK-1",
                product_name="Fresh Milk",
                category="Dairy",
                selling_price=65,
                cost_price=45,
            )
            db.add(product)
            db.flush()

            db.add(Inventory(product_id=product.id, quantity=120, minimum_stock=20, maximum_stock=200))

            today = datetime.now(UTC).replace(tzinfo=None)
            db.add_all([
                Sale(product_id=product.id, quantity=10, selling_price=65, customer_name="Alice", created_at=today - timedelta(days=1)),
                Sale(product_id=product.id, quantity=20, selling_price=65, customer_name="Bob", created_at=today),
                Purchase(product_id=product.id, quantity=60, cost_price=45, supplier_name="Daily Dairy", created_at=today - timedelta(days=2)),
                CustomerSearch(
                    searched_keyword="Fresh Milk",
                    searched_product="Fresh Milk",
                    city="Pune",
                    state="Maharashtra",
                    found=False,
                    festival="Diwali",
                    temperature=31,
                    created_at=today,
                ),
            ])
            db.commit()
        finally:
            db.close()

    def test_dataset_loads_with_required_columns_and_pagination(self):
        response = self.client.get("/ai/dataset?limit=1&offset=0")

        self.assertEqual(response.status_code, 200)
        payload = response.json()
        self.assertEqual(payload["limit"], 1)
        self.assertEqual(payload["offset"], 0)
        self.assertGreaterEqual(payload["total"], 1)
        self.assertEqual(len(payload["items"]), 1)
        self.assertEqual(payload["summary"]["missing_columns"], [])

        row = payload["items"][0]
        for column in payload["summary"]["columns"]:
            self.assertIn(column, row)

    def test_dataset_csv_export(self):
        response = self.client.get("/ai/dataset/export")

        self.assertEqual(response.status_code, 200)
        self.assertIn("text/csv", response.headers["content-type"])
        self.assertIn("date,product,category", response.text.splitlines()[0])
        self.assertIn("Fresh Milk", response.text)


    def test_dataset_summary(self):
        response = self.client.get("/ai/dataset/summary")

        self.assertEqual(response.status_code, 200)
        payload = response.json()
        self.assertIn("total_rows", payload)
        self.assertIn("total_products", payload)
        self.assertIn("total_categories", payload)
        self.assertIn("total_cities", payload)
        self.assertIn("total_states", payload)
        self.assertIn("total_warehouses", payload)
        self.assertIn("missing_values", payload)
        self.assertIn("dataset_size_mb", payload)
        self.assertIn("start_date", payload)
        self.assertIn("end_date", payload)

        self.assertGreaterEqual(payload["total_rows"], 1)
        self.assertGreaterEqual(payload["total_products"], 1)
        self.assertGreaterEqual(payload["total_categories"], 1)
        self.assertGreaterEqual(payload["total_warehouses"], 1)

    def test_ai_pipeline_endpoints(self):
        validation = self.client.post("/ai/validate")
        self.assertEqual(validation.status_code, 200)
        self.assertIn("duplicate_rows", validation.json())
        self.assertIn("missing_values", validation.json())

        features = self.client.get("/ai/features")
        self.assertEqual(features.status_code, 200)
        self.assertIn("selected_features", features.json())
        self.assertGreater(features.json()["feature_count"], 0)

        preprocess = self.client.post("/ai/preprocess")
        self.assertEqual(preprocess.status_code, 200)
        self.assertEqual(preprocess.json()["status"], "PREPROCESSED")

        split = self.client.post("/ai/train-test-split")
        self.assertEqual(split.status_code, 200)
        self.assertEqual(split.json()["total_rows"], split.json()["train_size"] + split.json()["test_size"] + split.json()["validation_size"])

        status = self.client.get("/ai/pipeline/status")
        self.assertEqual(status.status_code, 200)
        self.assertIn("steps", status.json())

    def test_ai_forecasting_and_predictions(self):
        # 1. Train all models
        train_res = self.client.post("/ai/train")
        self.assertEqual(train_res.status_code, 200)
        self.assertEqual(train_res.json()["status"], "success")

        # 2. Get models metrics
        models_res = self.client.get("/ai/models")
        self.assertEqual(models_res.status_code, 200)
        self.assertTrue(models_res.json()["demand"]["trained"])

        # 3. Predict demand
        dem_input = {
            "product": "Milk",
            "current_stock": 80.0,
            "search_count": 250.0,
            "failed_searches": 12.0,
            "sales": 120.0,
            "festival": False,
            "temperature": 36.0,
            "demand_score": 75.0
        }
        dem_res = self.client.post("/ai/predict/demand", json=dem_input)
        self.assertEqual(dem_res.status_code, 200)
        self.assertIn("predicted_demand", dem_res.json())

        # 4. Predict sales
        sal_input = {
            "today_sales": 120.0,
            "yesterday_sales": 110.0,
            "stock": 80.0,
            "category": "Dairy",
            "festival": False,
            "weather": 65.0,
            "search_count": 250.0
        }
        sal_res = self.client.post("/ai/predict/sales", json=sal_input)
        self.assertEqual(sal_res.status_code, 200)
        self.assertIn("predicted_sales", sal_res.json())

        # 5. Predict stockout
        stk_input = {
            "current_stock": 20.0,
            "average_daily_sales": 15.0,
            "demand_score": 85.0,
            "warehouse": "Warehouse A",
            "festival": False,
            "weather": 70.0
        }
        stk_res = self.client.post("/ai/predict/stockout", json=stk_input)
        self.assertEqual(stk_res.status_code, 200)
        self.assertIn("stockout_risk", stk_res.json())

        # 6. Predict reorder
        reo_input = {
            "average_sales": 15.0,
            "demand": 85.0,
            "festival": False,
            "weather": 70.0,
            "warehouse": "Warehouse A",
            "lead_time": 3.0,
            "supplier_delay": 1.0,
            "current_stock": 20.0
        }
        reo_res = self.client.post("/ai/predict/reorder", json=reo_input)
        self.assertEqual(reo_res.status_code, 200)
        self.assertIn("recommended_quantity", reo_res.json())


if __name__ == "__main__":
    unittest.main()
