import unittest

from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.database.base import Base
from app.database.dependencies import get_db
from app.main import app
from app.auth.models import User

SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


class TestRBAC(unittest.TestCase):
    def setUp(self):
        app.dependency_overrides[get_db] = override_get_db
        Base.metadata.create_all(bind=engine)
        self.client = TestClient(app)

    def tearDown(self):
        Base.metadata.drop_all(bind=engine)
        app.dependency_overrides.clear()

    def register_and_login(self, email: str, phone: str, role: str) -> str:
        self.client.post(
            "/auth/register",
            json={
                "full_name": f"{role} User",
                "email": email,
                "phone": phone,
                "password": "Password123",
            },
        )
        db = TestingSessionLocal()
        try:
            user = db.query(User).filter(User.email == email).first()
            if user:
                user.role = role
                db.commit()
        finally:
            db.close()

        response = self.client.post(
            "/auth/login",
            json={"email": email, "password": "Password123"},
        )
        return response.json()["access_token"]

    def test_permission_matrix_core_flows(self):
        admin_token = self.register_and_login("admin@example.com", "+11111111111", "ADMIN")
        store_token = self.register_and_login("store@example.com", "+12222222222", "STORE_MANAGER")
        staff_token = self.register_and_login("staff@example.com", "+13333333333", "STAFF")
        viewer_token = self.register_and_login("viewer@example.com", "+14444444444", "VIEWER")

        response = self.client.get(
            "/users",
            headers={"Authorization": f"Bearer {admin_token}"},
        )
        self.assertEqual(response.status_code, 200)

        response = self.client.get(
            "/users",
            headers={"Authorization": f"Bearer {store_token}"},
        )
        self.assertEqual(response.status_code, 403)

        response = self.client.delete(
            "/products/1",
            headers={"Authorization": f"Bearer {store_token}"},
        )
        self.assertEqual(response.status_code, 403)
        self.assertEqual(response.json(), {"detail": "Not enough permissions"})

        response = self.client.delete(
            "/products/1",
            headers={"Authorization": f"Bearer {staff_token}"},
        )
        self.assertEqual(response.status_code, 403)

        response = self.client.get(
            "/products",
            headers={"Authorization": f"Bearer {staff_token}"},
        )
        self.assertEqual(response.status_code, 200)

        response = self.client.get(
            "/products",
            headers={"Authorization": f"Bearer {viewer_token}"},
        )
        self.assertEqual(response.status_code, 200)

        response = self.client.get(
            "/analytics/dashboard",
            headers={"Authorization": f"Bearer {staff_token}"},
        )
        self.assertEqual(response.status_code, 200)


if __name__ == "__main__":
    unittest.main()
