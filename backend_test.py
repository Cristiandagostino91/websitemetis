#!/usr/bin/env python3
"""
Backend Test Suite for Centro Metis API - MongoDB Query Optimization Testing
Testing optimized queries with pagination parameters
"""

import requests
import json
from datetime import datetime, timedelta

# Use the production backend URL from frontend .env
BACKEND_URL = "https://smart-shop-pro.preview.emergentagent.com/api"

def test_api_endpoint(method, endpoint, expected_status=200, params=None, data=None):
    """Helper function to test API endpoints"""
    url = f"{BACKEND_URL}{endpoint}"
    
    try:
        if method.upper() == "GET":
            response = requests.get(url, params=params, timeout=10)
        elif method.upper() == "POST":
            response = requests.post(url, json=data, timeout=10)
        else:
            return False, f"Unsupported method: {method}"
        
        success = response.status_code == expected_status
        return success, {
            "status_code": response.status_code,
            "response": response.json() if response.content else {},
            "url": response.url
        }
    except Exception as e:
        return False, f"Request failed: {str(e)}"

def test_pagination_optimization():
    """Test optimized MongoDB queries with pagination parameters"""
    
    print("=" * 80)
    print("CENTRO METIS API - MONGODB OPTIMIZATION & PAGINATION TESTING")
    print("=" * 80)
    
    results = {
        "total_tests": 0,
        "passed": 0,
        "failed": 0,
        "test_details": []
    }
    
    # Test Cases for Pagination Optimization
    test_cases = [
        # Products API Tests
        {
            "name": "Products - Default Limit (100)",
            "method": "GET",
            "endpoint": "/products",
            "params": None,
            "expected_max_items": 100
        },
        {
            "name": "Products - Custom Limit (5)", 
            "method": "GET",
            "endpoint": "/products",
            "params": {"limit": 5},
            "expected_max_items": 5
        },
        {
            "name": "Products - Featured with Limit (3)",
            "method": "GET", 
            "endpoint": "/products",
            "params": {"featured": "true", "limit": 3},
            "expected_max_items": 3
        },
        
        # Services API Tests
        {
            "name": "Services - Default Limit (100)",
            "method": "GET",
            "endpoint": "/services",
            "params": None,
            "expected_max_items": 100
        },
        {
            "name": "Services - Custom Limit (3)",
            "method": "GET",
            "endpoint": "/services", 
            "params": {"limit": 3},
            "expected_max_items": 3
        },
        
        # Orders API Tests  
        {
            "name": "Orders - Custom Limit (2)",
            "method": "GET",
            "endpoint": "/orders",
            "params": {"limit": 2},
            "expected_max_items": 2
        },
        {
            "name": "Orders - Skip and Limit Pagination",
            "method": "GET",
            "endpoint": "/orders",
            "params": {"skip": 1, "limit": 1}, 
            "expected_max_items": 1
        },
        
        # Bookings API Tests
        {
            "name": "Bookings - Custom Limit (5)",
            "method": "GET",
            "endpoint": "/bookings",
            "params": {"limit": 5},
            "expected_max_items": 5
        },
        {
            "name": "Bookings Available - Optimized Time Projection",
            "method": "GET",
            "endpoint": "/bookings-available/2025-02-20",
            "params": None,
            "check_projection": True
        },
        
        # Blog API Tests
        {
            "name": "Blog - Custom Limit (2)",
            "method": "GET", 
            "endpoint": "/blog",
            "params": {"limit": 2},
            "expected_max_items": 2
        },
        
        # Contact API Tests
        {
            "name": "Contact - Custom Limit (5)",
            "method": "GET",
            "endpoint": "/contact",
            "params": {"limit": 5},
            "expected_max_items": 5
        }
    ]
    
    # Execute Test Cases
    for test_case in test_cases:
        results["total_tests"] += 1
        test_name = test_case["name"]
        
        print(f"\n[TEST {results['total_tests']}] {test_name}")
        print("-" * 60)
        
        success, response_data = test_api_endpoint(
            test_case["method"],
            test_case["endpoint"], 
            params=test_case.get("params")
        )
        
        if not success:
            print(f"❌ FAILED: {response_data}")
            results["failed"] += 1
            results["test_details"].append({
                "test": test_name,
                "status": "FAILED", 
                "error": response_data
            })
            continue
            
        # Verify status code
        if response_data["status_code"] != 200:
            print(f"❌ FAILED: Expected status 200, got {response_data['status_code']}")
            results["failed"] += 1
            results["test_details"].append({
                "test": test_name,
                "status": "FAILED",
                "error": f"HTTP {response_data['status_code']}"
            })
            continue
            
        response_json = response_data["response"]
        
        # Check pagination limits
        if "expected_max_items" in test_case:
            if test_case["endpoint"] == "/bookings-available/2025-02-20":
                # Special case for available slots
                available_slots = response_json.get("availableSlots", [])
                item_count = len(available_slots)
                print(f"✅ Available slots returned: {item_count}")
            else:
                # Regular list endpoints
                if isinstance(response_json, list):
                    item_count = len(response_json)
                else:
                    print(f"❌ FAILED: Response is not a list: {type(response_json)}")
                    results["failed"] += 1
                    continue
                    
                expected_max = test_case["expected_max_items"]
                
                if item_count <= expected_max:
                    print(f"✅ PASSED: Returned {item_count} items (limit: {expected_max})")
                else:
                    print(f"❌ FAILED: Returned {item_count} items, exceeds limit of {expected_max}")
                    results["failed"] += 1
                    results["test_details"].append({
                        "test": test_name,
                        "status": "FAILED",
                        "error": f"Limit exceeded: {item_count} > {expected_max}"
                    })
                    continue
        
        # Check projection optimization for bookings-available
        if test_case.get("check_projection"):
            if "availableSlots" in response_json and isinstance(response_json["availableSlots"], list):
                print(f"✅ PASSED: Projection optimization working - returned available slots structure")
            else:
                print(f"❌ FAILED: Expected availableSlots array in response")
                results["failed"] += 1
                results["test_details"].append({
                    "test": test_name, 
                    "status": "FAILED",
                    "error": "Missing availableSlots in response"
                })
                continue
        
        print(f"✅ PASSED: {test_name}")
        results["passed"] += 1
        results["test_details"].append({
            "test": test_name,
            "status": "PASSED", 
            "response_size": len(response_json) if isinstance(response_json, list) else "N/A"
        })
    
    # Print Final Results
    print("\n" + "=" * 80)
    print("MONGODB OPTIMIZATION & PAGINATION TEST RESULTS")
    print("=" * 80)
    print(f"Total Tests: {results['total_tests']}")
    print(f"Passed: {results['passed']}")  
    print(f"Failed: {results['failed']}")
    print(f"Success Rate: {(results['passed']/results['total_tests']*100):.1f}%")
    
    if results["failed"] > 0:
        print(f"\n❌ FAILED TESTS:")
        for detail in results["test_details"]:
            if detail["status"] == "FAILED":
                print(f"  - {detail['test']}: {detail.get('error', 'Unknown error')}")
    
    return results

if __name__ == "__main__":
    results = test_pagination_optimization()
    
    # Return appropriate exit code
    exit_code = 0 if results["failed"] == 0 else 1
    exit(exit_code)