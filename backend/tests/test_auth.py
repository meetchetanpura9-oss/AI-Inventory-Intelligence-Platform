import unittest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.main import app
from app.database.base import Base
from app.database.dependencies import get_db

# Create an in-memory SQLite database for testing
SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


# Override database session dependency
def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()


class TestAuthModule(unittest.TestCase):

    def setUp(self):
        # Create all tables in the testing database
        Base.metadata.create_all(bind=engine)
        app.dependency_overrides[get_db] = override_get_db
        self.client = TestClient(app)

    def tearDown(self):
        # Drop all tables in the testing database
        Base.metadata.drop_all(bind=engine)
        app.dependency_overrides.clear()

    def test_complete_auth_flow(self):
        # 1. Test register user (Store Manager role)
        register_payload = {
            "full_name": "Alice Smith",
            "email": "alice@example.com",
            "phone": "+12345678901",
            "password": "securepassword123"
        }
        response = self.client.post("/auth/register", json=register_payload)
        self.assertEqual(response.status_code, 201)
        data = response.json()
        self.assertEqual(data["message"], "Registration successful")
        self.assertNotIn("password", data)
        self.assertNotIn("password_hash", data)

        # 2. Test duplicate email
        duplicate_email_payload = {
            "full_name": "Bob Smith",
            "email": "alice@example.com",
            "phone": "+19876543210",
            "password": "differentpassword"
        }
        response = self.client.post("/auth/register", json=duplicate_email_payload)
        self.assertEqual(response.status_code, 409)
        self.assertEqual(response.json()["message"], "Email already exists.")

        # 3. Test duplicate phone
        duplicate_phone_payload = {
            "full_name": "Charlie Smith",
            "email": "charlie@example.com",
            "phone": "+12345678901",
            "password": "differentpassword"
        }
        response = self.client.post("/auth/register", json=duplicate_phone_payload)
        self.assertEqual(response.status_code, 409)
        self.assertEqual(response.json()["message"], "Phone number already exists.")

        # 4. Test validation: invalid email format
        invalid_email_payload = {
            "full_name": "Bob Smith",
            "email": "invalidemail",
            "phone": "+19876543210",
            "password": "differentpassword"
        }
        response = self.client.post("/auth/register", json=invalid_email_payload)
        self.assertEqual(response.status_code, 422)

        # 5. Test validation: invalid phone format
        invalid_phone_payload = {
            "full_name": "Bob Smith",
            "email": "bob@example.com",
            "phone": "invalidphone",
            "password": "differentpassword"
        }
        response = self.client.post("/auth/register", json=invalid_phone_payload)
        self.assertEqual(response.status_code, 422)

        # 6. Test validation: short password
        short_password_payload = {
            "full_name": "Bob Smith",
            "email": "bob@example.com",
            "phone": "+19876543210",
            "password": "short"
        }
        response = self.client.post("/auth/register", json=short_password_payload)
        self.assertEqual(response.status_code, 422)

        # 7. Test validation: public registration must not accept role assignment
        invalid_role_payload = {
            "full_name": "Bob Smith",
            "email": "bob@example.com",
            "phone": "+19876543210",
            "password": "differentpassword",
            "role": "ADMIN"
        }
        response = self.client.post("/auth/register", json=invalid_role_payload)
        self.assertEqual(response.status_code, 422)

        # 8. Test login successful
        login_payload = {
            "email": "alice@example.com",
            "password": "securepassword123"
        }
        response = self.client.post("/auth/login", json=login_payload)
        self.assertEqual(response.status_code, 200)
        token_data = response.json()
        self.assertIn("access_token", token_data)
        self.assertIn("refresh_token", token_data)
        self.assertEqual(token_data["token_type"], "bearer")
        access_token = token_data["access_token"]
        refresh_token = token_data["refresh_token"]

        # Swagger/browser compatibility: login sets an access token cookie.
        response = self.client.get("/auth/profile")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["name"], "Alice Smith")

        # 9. Test OAuth2 form login for Swagger compatibility
        response = self.client.post(
            "/auth/token",
            data={"username": "alice@example.com", "password": "securepassword123"},
        )
        self.assertEqual(response.status_code, 200)
        form_token_data = response.json()
        self.assertIn("access_token", form_token_data)
        self.assertIn("refresh_token", form_token_data)

        # 10. Test login invalid password
        login_invalid_password = {
            "email": "alice@example.com",
            "password": "wrongpassword"
        }
        response = self.client.post("/auth/login", json=login_invalid_password)
        self.assertEqual(response.status_code, 401)
        self.assertEqual(response.json()["message"], "Incorrect username or password.")

        # 11. Test login invalid email
        login_invalid_email = {
            "email": "nonexistent@example.com",
            "password": "securepassword123"
        }
        response = self.client.post("/auth/login", json=login_invalid_email)
        self.assertEqual(response.status_code, 401)

        # 11. Test get /auth/profile with valid access token
        headers = {"Authorization": f"Bearer {access_token}"}
        response = self.client.get("/auth/profile", headers=headers)
        self.assertEqual(response.status_code, 200)
        me_data = response.json()
        self.assertEqual(me_data["name"], "Alice Smith")
        self.assertEqual(me_data["role"], "VIEWER")

        # 14. Test get /auth/profile with refresh token (should fail since it requires access token)
        refresh_headers = {"Authorization": f"Bearer {refresh_token}"}
        response = self.client.get("/auth/profile", headers=refresh_headers)
        self.assertEqual(response.status_code, 401)

        # 15. Test /auth/refresh with valid refresh token
        refresh_payload = {
            "refresh_token": refresh_token
        }
        response = self.client.post("/auth/refresh", json=refresh_payload)
        self.assertEqual(response.status_code, 200)
        new_token_data = response.json()
        self.assertIn("access_token", new_token_data)
        self.assertIn("refresh_token", new_token_data)
        new_access_token = new_token_data["access_token"]

        # Verify new access token works
        new_headers = {"Authorization": f"Bearer {new_access_token}"}
        response = self.client.get("/auth/profile", headers=new_headers)
        self.assertEqual(response.status_code, 200)

        # 16. Test /auth/change-password
        change_password_payload = {
            "old_password": "securepassword123",
            "new_password": "newsecurepassword456"
        }
        response = self.client.post("/auth/change-password", json=change_password_payload, headers=new_headers)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["message"], "Password changed successfully.")

        # Test login with old password fails
        response = self.client.post("/auth/login", json=login_payload)
        self.assertEqual(response.status_code, 401)

        # Test login with new password succeeds
        new_login_payload = {
            "email": "alice@example.com",
            "password": "newsecurepassword456"
        }
        response = self.client.post("/auth/login", json=new_login_payload)
        self.assertEqual(response.status_code, 200)


if __name__ == "__main__":
    unittest.main()
