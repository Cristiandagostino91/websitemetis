#!/usr/bin/env python3

import requests
import json
import sys
from datetime import datetime

# Backend URL from environment (production URL)
BASE_URL = "https://smart-shop-pro.preview.emergentagent.com/api"

class TestResult:
    def __init__(self):
        self.tests = []
        self.passed = 0
        self.failed = 0
    
    def add_test(self, name, success, message="", data=None):
        self.tests.append({
            'name': name,
            'success': success,
            'message': message,
            'data': data
        })
        if success:
            self.passed += 1
        else:
            self.failed += 1
    
    def print_summary(self):
        print(f"\n{'='*80}")
        print(f"CENTRO METIS BACKEND API TEST RESULTS")
        print(f"{'='*80}")
        print(f"Total Tests: {len(self.tests)}")
        print(f"Passed: {self.passed}")
        print(f"Failed: {self.failed}")
        print(f"{'='*80}")
        
        for test in self.tests:
            status = "✅ PASS" if test['success'] else "❌ FAIL"
            print(f"{status}: {test['name']}")
            if test['message']:
                print(f"    Message: {test['message']}")
            if not test['success'] and test['data']:
                print(f"    Response: {test['data']}")
        print()

def test_health_check(result):
    """Test health check endpoint"""
    try:
        response = requests.get(f"{BASE_URL}/health", timeout=10)
        if response.status_code == 200:
            data = response.json()
            if data.get('status') == 'healthy' and data.get('database') == 'connected':
                result.add_test("Health Check", True, "Backend and database are healthy")
            else:
                result.add_test("Health Check", False, f"Unexpected health status: {data}")
        else:
            result.add_test("Health Check", False, f"Status code: {response.status_code}")
    except Exception as e:
        result.add_test("Health Check", False, f"Connection error: {str(e)}")

def test_products_api(result):
    """Test Products API endpoints"""
    
    # Test GET /api/products
    try:
        response = requests.get(f"{BASE_URL}/products", timeout=10)
        if response.status_code == 200:
            products = response.json()
            result.add_test("GET /api/products", True, f"Retrieved {len(products)} products")
            
            # Test featured products filter
            response_featured = requests.get(f"{BASE_URL}/products?featured=true", timeout=10)
            if response_featured.status_code == 200:
                featured_products = response_featured.json()
                result.add_test("GET /api/products?featured=true", True, f"Retrieved {len(featured_products)} featured products")
            else:
                result.add_test("GET /api/products?featured=true", False, f"Status code: {response_featured.status_code}")
        else:
            result.add_test("GET /api/products", False, f"Status code: {response.status_code}", response.text)
    except Exception as e:
        result.add_test("GET /api/products", False, f"Error: {str(e)}")

def test_services_api(result):
    """Test Services API endpoints"""
    
    try:
        response = requests.get(f"{BASE_URL}/services", timeout=10)
        if response.status_code == 200:
            services = response.json()
            result.add_test("GET /api/services", True, f"Retrieved {len(services)} services")
        else:
            result.add_test("GET /api/services", False, f"Status code: {response.status_code}", response.text)
    except Exception as e:
        result.add_test("GET /api/services", False, f"Error: {str(e)}")

def test_orders_api(result):
    """Test Orders API endpoints"""
    
    # Test GET /api/orders-stats
    try:
        response = requests.get(f"{BASE_URL}/orders-stats", timeout=10)
        if response.status_code == 200:
            stats = response.json()
            expected_keys = ['totalOrders', 'pendingOrders', 'totalRevenue', 'recentOrders']
            if all(key in stats for key in expected_keys):
                result.add_test("GET /api/orders-stats", True, f"Stats: {stats['totalOrders']} orders, €{stats['totalRevenue']} revenue")
            else:
                result.add_test("GET /api/orders-stats", False, f"Missing keys in response: {stats}")
        else:
            result.add_test("GET /api/orders-stats", False, f"Status code: {response.status_code}", response.text)
    except Exception as e:
        result.add_test("GET /api/orders-stats", False, f"Error: {str(e)}")
    
    # Test POST /api/orders - Create test order
    test_order = {
        "items": [
            {
                "productId": "test-product-1", 
                "name": "Omega 3 Fish Oil", 
                "price": 29.90, 
                "quantity": 2, 
                "image": "omega3.jpg"
            }
        ],
        "customer": {
            "firstName": "Mario", 
            "lastName": "Rossi", 
            "email": "mario.rossi@email.com", 
            "phone": "393123456789"
        },
        "shipping": {
            "address": "Via Roma 123", 
            "city": "Milano", 
            "zipCode": "20100", 
            "notes": "Citofono: Rossi"
        },
        "total": 59.80
    }
    
    try:
        response = requests.post(f"{BASE_URL}/orders", json=test_order, timeout=10)
        if response.status_code == 200:
            order = response.json()
            order_id = order.get('id')
            result.add_test("POST /api/orders", True, f"Order created: {order.get('orderNumber')}")
            
            # Test GET /api/orders - verify order was created
            response_get = requests.get(f"{BASE_URL}/orders", timeout=10)
            if response_get.status_code == 200:
                orders = response_get.json()
                created_order = next((o for o in orders if o.get('id') == order_id), None)
                if created_order:
                    result.add_test("GET /api/orders (verify creation)", True, f"Order {order_id} found in orders list")
                else:
                    result.add_test("GET /api/orders (verify creation)", False, "Created order not found in orders list")
            else:
                result.add_test("GET /api/orders (verify creation)", False, f"Status code: {response_get.status_code}")
                
        else:
            result.add_test("POST /api/orders", False, f"Status code: {response.status_code}", response.text)
    except Exception as e:
        result.add_test("POST /api/orders", False, f"Error: {str(e)}")

def test_bookings_api(result):
    """Test Bookings API endpoints"""
    
    test_date = "2025-02-20"
    
    # Test GET /api/bookings-available/{date}
    try:
        response = requests.get(f"{BASE_URL}/bookings-available/{test_date}", timeout=10)
        if response.status_code == 200:
            availability = response.json()
            available_slots = availability.get('availableSlots', [])
            result.add_test(f"GET /api/bookings-available/{test_date}", True, f"{len(available_slots)} available slots")
            
            # Store initial available slots for later verification
            initial_slots = available_slots.copy()
            
        else:
            result.add_test(f"GET /api/bookings-available/{test_date}", False, f"Status code: {response.status_code}", response.text)
            return
    except Exception as e:
        result.add_test(f"GET /api/bookings-available/{test_date}", False, f"Error: {str(e)}")
        return
    
    # Test POST /api/bookings - Create test booking
    if initial_slots:
        test_booking = {
            "serviceId": "test-service-1",
            "date": test_date,
            "time": initial_slots[0],  # Use first available slot
            "customer": {
                "name": "Giulia Verdi", 
                "email": "giulia.verdi@email.com", 
                "phone": "393987654321"
            },
            "notes": "Prima consulenza"
        }
        
        try:
            response = requests.post(f"{BASE_URL}/bookings", json=test_booking, timeout=10)
            if response.status_code == 200:
                booking = response.json()
                result.add_test("POST /api/bookings", True, f"Booking created: {booking.get('bookingNumber')}")
                
                # Test availability again to verify slot is taken
                response_check = requests.get(f"{BASE_URL}/bookings-available/{test_date}", timeout=10)
                if response_check.status_code == 200:
                    new_availability = response_check.json()
                    new_slots = new_availability.get('availableSlots', [])
                    if len(new_slots) == len(initial_slots) - 1 and test_booking['time'] not in new_slots:
                        result.add_test(f"GET /api/bookings-available/{test_date} (verify booking)", True, f"Slot {test_booking['time']} correctly marked as booked")
                    else:
                        result.add_test(f"GET /api/bookings-available/{test_date} (verify booking)", False, "Available slots not properly updated")
                else:
                    result.add_test(f"GET /api/bookings-available/{test_date} (verify booking)", False, f"Status code: {response_check.status_code}")
                    
            elif response.status_code == 404:
                result.add_test("POST /api/bookings", False, "Service not found - need to seed database with services", response.text)
            else:
                result.add_test("POST /api/bookings", False, f"Status code: {response.status_code}", response.text)
        except Exception as e:
            result.add_test("POST /api/bookings", False, f"Error: {str(e)}")
    else:
        result.add_test("POST /api/bookings", False, "No available slots to test booking creation")

def test_blog_api(result):
    """Test Blog API endpoints"""
    
    try:
        response = requests.get(f"{BASE_URL}/blog", timeout=10)
        if response.status_code == 200:
            posts = response.json()
            result.add_test("GET /api/blog", True, f"Retrieved {len(posts)} blog posts")
        else:
            result.add_test("GET /api/blog", False, f"Status code: {response.status_code}", response.text)
    except Exception as e:
        result.add_test("GET /api/blog", False, f"Error: {str(e)}")

def test_contact_api(result):
    """Test Contact API endpoints"""
    
    # Test POST /api/contact
    test_contact = {
        "name": "Alessandro Bianchi",
        "email": "alessandro.bianchi@email.com",
        "phone": "393456789012",
        "message": "Vorrei maggiori informazioni sui vostri servizi nutrizionali. Sono interessato a una consulenza personalizzata."
    }
    
    try:
        response = requests.post(f"{BASE_URL}/contact", json=test_contact, timeout=10)
        if response.status_code == 200:
            message = response.json()
            result.add_test("POST /api/contact", True, f"Contact message created: {message.get('id')}")
        else:
            result.add_test("POST /api/contact", False, f"Status code: {response.status_code}", response.text)
    except Exception as e:
        result.add_test("POST /api/contact", False, f"Error: {str(e)}")

def main():
    print("Starting Centro Metis Backend API Tests...")
    print(f"Testing against: {BASE_URL}")
    
    result = TestResult()
    
    # Run all tests
    test_health_check(result)
    test_products_api(result)
    test_services_api(result)
    test_orders_api(result)
    test_bookings_api(result)
    test_blog_api(result)
    test_contact_api(result)
    
    # Print results
    result.print_summary()
    
    # Return exit code based on results
    return 0 if result.failed == 0 else 1

if __name__ == "__main__":
    sys.exit(main())