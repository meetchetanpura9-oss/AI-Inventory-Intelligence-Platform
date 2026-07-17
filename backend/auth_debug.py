from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

# register test user
register_payload = {
    "full_name": "Test User",
    "email": "test-user@example.com",
    "phone": "+12345678902",
    "password": "Password123",
    "role": "ADMIN"
}
resp = client.post("/auth/register", json=register_payload)
print('register', resp.status_code, resp.json())

# form login
resp = client.post("/auth/token", data={"username":"test-user@example.com","password":"Password123"})
print('token', resp.status_code, resp.json())
if resp.status_code == 200:
    token = resp.json()['access_token']
    headers = {"Authorization": f"Bearer {token}"}
    resp2 = client.get("/auth/me", headers=headers)
    print('me', resp2.status_code, resp2.json())
else:
    print('token failed')
