"""
Backend API Tests for Centro Metis Admin Panel
Tests: Authentication, Products CRUD, Services, Blog, Orders, Bookings
"""

import pytest
import requests
import os
import uuid
from datetime import datetime

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')
API = f"{BASE_URL}/api"

# Admin credentials
ADMIN_EMAIL = "admin@centrometis.com"
ADMIN_PASSWORD = "CentroMetis@2024!Admin"


@pytest.fixture(scope="module")
def session():
    """Shared requests session"""
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


@pytest.fixture(scope="module")
def auth_token(session):
    """Get authentication token"""
    response = session.post(f"{API}/auth/login", json={
        "email": ADMIN_EMAIL,
        "password": ADMIN_PASSWORD
    })
    if response.status_code == 200:
        return response.json().get("access_token")
    pytest.skip("Authentication failed - skipping authenticated tests")


@pytest.fixture(scope="module")
def auth_session(session, auth_token):
    """Session with auth header"""
    session.headers.update({"Authorization": f"Bearer {auth_token}"})
    return session


class TestHealthCheck:
    """Health check - run first"""
    
    def test_api_health(self, session):
        response = session.get(f"{API}/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"
        print(f"Health check passed: {data}")

    def test_api_root(self, session):
        response = session.get(f"{API}/")
        assert response.status_code == 200
        data = response.json()
        assert "message" in data
        print(f"API root: {data}")


class TestAuthentication:
    """Admin login/logout tests"""
    
    def test_login_success(self, session):
        response = session.post(f"{API}/auth/login", json={
            "email": ADMIN_EMAIL,
            "password": ADMIN_PASSWORD
        })
        assert response.status_code == 200
        data = response.json()
        assert "access_token" in data
        assert data["token_type"] == "bearer"
        assert len(data["access_token"]) > 0
        print(f"Login successful, token type: {data['token_type']}")

    def test_login_wrong_email(self, session):
        response = session.post(f"{API}/auth/login", json={
            "email": "wrong@email.com",
            "password": ADMIN_PASSWORD
        })
        assert response.status_code == 401
        data = response.json()
        assert "detail" in data
        print(f"Wrong email rejected: {data}")

    def test_login_wrong_password(self, session):
        response = session.post(f"{API}/auth/login", json={
            "email": ADMIN_EMAIL,
            "password": "WrongPassword123!"
        })
        assert response.status_code == 401
        data = response.json()
        assert "detail" in data
        print(f"Wrong password rejected: {data}")

    def test_verify_token(self, auth_session):
        response = auth_session.post(f"{API}/auth/verify")
        assert response.status_code == 200
        data = response.json()
        assert data["valid"] == True
        assert data["email"] == ADMIN_EMAIL
        print(f"Token verified: {data}")

    def test_get_me(self, auth_session):
        response = auth_session.get(f"{API}/auth/me")
        assert response.status_code == 200
        data = response.json()
        assert data["email"] == ADMIN_EMAIL
        assert "name" in data
        print(f"Admin info: {data}")

    def test_auth_required_without_token(self, session):
        # Remove auth header temporarily
        headers = {"Content-Type": "application/json"}
        response = requests.post(f"{API}/auth/verify", headers=headers)
        assert response.status_code in [401, 403]
        print("Auth required without token: PASSED")


class TestProductsCRUD:
    """Products CRUD operations"""
    
    test_product_id = None
    
    def test_get_all_products(self, session):
        response = session.get(f"{API}/products")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        print(f"Got {len(data)} products")

    def test_create_product(self, auth_session):
        product_data = {
            "name": f"TEST_Product_{uuid.uuid4().hex[:8]}",
            "category": "Integratori",
            "price": 29.99,
            "image": "https://example.com/image.jpg",
            "description": "Test product description for automated testing",
            "inStock": True,
            "featured": False
        }
        response = auth_session.post(f"{API}/products", json=product_data)
        assert response.status_code == 200
        data = response.json()
        assert data["name"] == product_data["name"]
        assert data["price"] == product_data["price"]
        assert "id" in data
        TestProductsCRUD.test_product_id = data["id"]
        print(f"Created product: {data['id']}")

    def test_get_product_by_id(self, session):
        if not TestProductsCRUD.test_product_id:
            pytest.skip("No product created")
        response = session.get(f"{API}/products/{TestProductsCRUD.test_product_id}")
        assert response.status_code == 200
        data = response.json()
        assert data["id"] == TestProductsCRUD.test_product_id
        print(f"Got product by ID: {data['name']}")

    def test_update_product(self, auth_session):
        if not TestProductsCRUD.test_product_id:
            pytest.skip("No product created")
        update_data = {"price": 39.99, "featured": True}
        response = auth_session.put(
            f"{API}/products/{TestProductsCRUD.test_product_id}",
            json=update_data
        )
        assert response.status_code == 200
        data = response.json()
        assert data["price"] == 39.99
        assert data["featured"] == True
        print(f"Updated product price to: {data['price']}")

    def test_verify_product_update_persisted(self, session):
        if not TestProductsCRUD.test_product_id:
            pytest.skip("No product created")
        response = session.get(f"{API}/products/{TestProductsCRUD.test_product_id}")
        assert response.status_code == 200
        data = response.json()
        assert data["price"] == 39.99
        assert data["featured"] == True
        print("Product update verified")

    def test_delete_product(self, auth_session):
        if not TestProductsCRUD.test_product_id:
            pytest.skip("No product created")
        response = auth_session.delete(f"{API}/products/{TestProductsCRUD.test_product_id}")
        assert response.status_code == 200
        print("Product deleted")

    def test_verify_product_deleted(self, session):
        if not TestProductsCRUD.test_product_id:
            pytest.skip("No product created")
        response = session.get(f"{API}/products/{TestProductsCRUD.test_product_id}")
        assert response.status_code == 404
        print("Product deletion verified")


class TestServicesCRUD:
    """Services CRUD operations"""
    
    test_service_id = None
    
    def test_get_all_services(self, session):
        response = session.get(f"{API}/services")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        print(f"Got {len(data)} services")

    def test_create_service(self, auth_session):
        service_data = {
            "title": f"TEST_Service_{uuid.uuid4().hex[:8]}",
            "category": "Massaggi",
            "price": 50.00,
            "duration": "60 min",
            "description": "Test service description",
            "image": "https://example.com/service.jpg"
        }
        response = auth_session.post(f"{API}/services", json=service_data)
        assert response.status_code == 200
        data = response.json()
        assert data["title"] == service_data["title"]
        assert "id" in data
        TestServicesCRUD.test_service_id = data["id"]
        print(f"Created service: {data['id']}")

    def test_update_service(self, auth_session):
        if not TestServicesCRUD.test_service_id:
            pytest.skip("No service created")
        update_data = {"price": 65.00}
        response = auth_session.put(
            f"{API}/services/{TestServicesCRUD.test_service_id}",
            json=update_data
        )
        assert response.status_code == 200
        data = response.json()
        assert data["price"] == 65.00
        print(f"Updated service price: {data['price']}")

    def test_delete_service(self, auth_session):
        if not TestServicesCRUD.test_service_id:
            pytest.skip("No service created")
        response = auth_session.delete(f"{API}/services/{TestServicesCRUD.test_service_id}")
        assert response.status_code == 200
        print("Service deleted")


class TestBlogCRUD:
    """Blog CRUD operations"""
    
    test_blog_id = None
    
    def test_get_all_blog_posts(self, session):
        response = session.get(f"{API}/blog")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        print(f"Got {len(data)} blog posts")

    def test_create_blog_post(self, auth_session):
        blog_data = {
            "title": f"TEST_Blog_{uuid.uuid4().hex[:8]}",
            "excerpt": "Test excerpt for blog post",
            "content": "This is the full content of the test blog post.",
            "author": "Test Author",
            "date": datetime.now().strftime("%Y-%m-%d"),
            "image": "https://example.com/blog.jpg",
            "category": "Benessere",
            "published": True
        }
        response = auth_session.post(f"{API}/blog", json=blog_data)
        assert response.status_code == 200
        data = response.json()
        assert data["title"] == blog_data["title"]
        assert "id" in data
        TestBlogCRUD.test_blog_id = data["id"]
        print(f"Created blog post: {data['id']}")

    def test_update_blog_post(self, auth_session):
        if not TestBlogCRUD.test_blog_id:
            pytest.skip("No blog post created")
        update_data = {"published": False}
        response = auth_session.put(
            f"{API}/blog/{TestBlogCRUD.test_blog_id}",
            json=update_data
        )
        assert response.status_code == 200
        data = response.json()
        assert data["published"] == False
        print("Blog post unpublished")

    def test_delete_blog_post(self, auth_session):
        if not TestBlogCRUD.test_blog_id:
            pytest.skip("No blog post created")
        response = auth_session.delete(f"{API}/blog/{TestBlogCRUD.test_blog_id}")
        assert response.status_code == 200
        print("Blog post deleted")


class TestOrders:
    """Orders endpoint tests"""
    
    test_order_id = None
    
    def test_get_orders(self, auth_session):
        response = auth_session.get(f"{API}/orders")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        print(f"Got {len(data)} orders")
        if len(data) > 0:
            TestOrders.test_order_id = data[0]["id"]

    def test_get_order_stats(self, auth_session):
        response = auth_session.get(f"{API}/orders-stats")
        assert response.status_code == 200
        data = response.json()
        assert "totalOrders" in data
        assert "totalRevenue" in data
        assert "pendingOrders" in data
        print(f"Order stats: {data['totalOrders']} orders, €{data['totalRevenue']} revenue")

    def test_create_order(self, session):
        order_data = {
            "items": [{
                "productId": "test-123",
                "name": "Test Product",
                "price": 19.99,
                "quantity": 2,
                "image": "https://example.com/img.jpg"
            }],
            "customer": {
                "firstName": "Test",
                "lastName": "Customer",
                "email": "test@example.com",
                "phone": "+39123456789"
            },
            "shipping": {
                "address": "Via Test 123",
                "city": "Milano",
                "zipCode": "20100",
                "notes": ""
            },
            "total": 39.98
        }
        response = session.post(f"{API}/orders", json=order_data)
        assert response.status_code == 200
        data = response.json()
        assert "orderNumber" in data
        assert data["total"] == 39.98
        TestOrders.test_order_id = data["id"]
        print(f"Created order: {data['orderNumber']}")

    def test_update_order_status(self, auth_session):
        if not TestOrders.test_order_id:
            pytest.skip("No order created")
        response = auth_session.put(
            f"{API}/orders/{TestOrders.test_order_id}",
            json={"status": "confirmed"}
        )
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "confirmed"
        print("Order status updated to confirmed")


class TestBookings:
    """Bookings endpoint tests"""
    
    def test_get_bookings(self, auth_session):
        response = auth_session.get(f"{API}/bookings")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        print(f"Got {len(data)} bookings")

    def test_get_available_slots(self, session):
        # Test getting available slots for a future date
        future_date = "2026-02-15"
        response = session.get(f"{API}/bookings-available/{future_date}")
        assert response.status_code == 200
        data = response.json()
        assert "availableSlots" in data
        assert isinstance(data["availableSlots"], list)
        print(f"Available slots for {future_date}: {len(data['availableSlots'])}")


class TestContactMessages:
    """Contact messages tests"""
    
    def test_create_contact_message(self, session):
        message_data = {
            "name": "Test User",
            "email": "testuser@example.com",
            "phone": "+39123456789",
            "message": "This is a test message"
        }
        response = session.post(f"{API}/contact", json=message_data)
        assert response.status_code == 200
        data = response.json()
        assert data["name"] == message_data["name"]
        assert "id" in data
        print(f"Created contact message: {data['id']}")

    def test_get_contact_messages(self, auth_session):
        response = auth_session.get(f"{API}/contact")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        print(f"Got {len(data)} contact messages")


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
