from fastapi.testclient import TestClient
from ...main import app
import jwt
import os

client = TestClient(app)


def login_token():
    payload = {'username': 'ysaini'}
    secret = os.environ['JWT_KEY']
    encoded = jwt.encode(payload, secret, algorithm='HS256')
    return encoded


def test_get_orders():
    """Testing the get orders route."""
    response = client.post(
        '/api/orders',
        cookies={
            'jwt_token': login_token()
        }
    )
    assert response.status_code == 200
    assert response.json() == 'Creating Service'
