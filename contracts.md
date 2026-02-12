# Centro Metis - Backend Implementation Contracts

## Database Models

### 1. Product
```python
{
    "_id": ObjectId,
    "name": str,
    "category": str,  # "integratori"
    "price": float,
    "image": str,
    "description": str,
    "inStock": bool,
    "featured": bool,
    "createdAt": datetime,
    "updatedAt": datetime
}
```

### 2. Service
```python
{
    "_id": ObjectId,
    "title": str,
    "category": str,  # "consulenze", "analisi", "programmi"
    "price": float,
    "duration": str,  # "60 min"
    "description": str,
    "image": str,
    "createdAt": datetime,
    "updatedAt": datetime
}
```

### 3. Order
```python
{
    "_id": ObjectId,
    "orderNumber": str,  # "ORD-20250212-001"
    "items": [
        {
            "productId": str,
            "name": str,
            "price": float,
            "quantity": int,
            "image": str
        }
    ],
    "customer": {
        "firstName": str,
        "lastName": str,
        "email": str,
        "phone": str
    },
    "shipping": {
        "address": str,
        "city": str,
        "zipCode": str,
        "notes": str
    },
    "total": float,
    "status": str,  # "pending", "processing", "shipped", "delivered", "cancelled"
    "createdAt": datetime,
    "updatedAt": datetime
}
```

### 4. Booking
```python
{
    "_id": ObjectId,
    "bookingNumber": str,  # "BKG-20250212-001"
    "serviceId": str,
    "serviceName": str,
    "servicePrice": float,
    "date": str,  # "2025-02-15"
    "time": str,  # "09:00"
    "customer": {
        "name": str,
        "email": str,
        "phone": str
    },
    "notes": str,
    "status": str,  # "pending", "confirmed", "completed", "cancelled"
    "createdAt": datetime,
    "updatedAt": datetime
}
```

### 5. BlogPost
```python
{
    "_id": ObjectId,
    "title": str,
    "excerpt": str,
    "content": str,
    "author": str,
    "date": str,
    "image": str,
    "category": str,
    "published": bool,
    "createdAt": datetime,
    "updatedAt": datetime
}
```

### 6. ContactMessage
```python
{
    "_id": ObjectId,
    "name": str,
    "email": str,
    "phone": str,
    "message": str,
    "status": str,  # "new", "read", "replied"
    "createdAt": datetime
}
```

## API Endpoints

### Products
- `GET /api/products` - Get all products (with optional filters)
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (admin)
- `PUT /api/products/:id` - Update product (admin)
- `DELETE /api/products/:id` - Delete product (admin)

### Services
- `GET /api/services` - Get all services
- `GET /api/services/:id` - Get single service
- `POST /api/services` - Create service (admin)
- `PUT /api/services/:id` - Update service (admin)
- `DELETE /api/services/:id` - Delete service (admin)

### Orders
- `GET /api/orders` - Get all orders (admin)
- `GET /api/orders/:id` - Get single order
- `POST /api/orders` - Create order (checkout)
- `PUT /api/orders/:id` - Update order status (admin)
- `GET /api/orders/stats` - Get order statistics (admin)

### Bookings
- `GET /api/bookings` - Get all bookings (admin)
- `GET /api/bookings/:id` - Get single booking
- `POST /api/bookings` - Create booking
- `PUT /api/bookings/:id` - Update booking status (admin)
- `GET /api/bookings/available` - Get available time slots for date

### Blog
- `GET /api/blog` - Get all blog posts
- `GET /api/blog/:id` - Get single post
- `POST /api/blog` - Create post (admin)
- `PUT /api/blog/:id` - Update post (admin)
- `DELETE /api/blog/:id` - Delete post (admin)

### Contact
- `POST /api/contact` - Submit contact message
- `GET /api/contact` - Get all messages (admin)
- `PUT /api/contact/:id` - Update message status (admin)

## Frontend Integration Changes

### Files to Update:

1. **mockData.js replacements:**
   - Remove all mock data imports from pages
   - Replace with API calls using axios

2. **Pages to update:**
   - `Home.jsx` - Fetch products, services, blog posts
   - `Prodotti.jsx` - Fetch products from API
   - `Servizi.jsx` - Fetch services from API
   - `Blog.jsx` - Fetch blog posts from API
   - `Carrello.jsx` - Keep localStorage for cart
   - `Checkout.jsx` - POST order to API
   - `Prenota.jsx` - POST booking to API, fetch available slots
   - `Contatti.jsx` - POST contact message
   - `Admin.jsx` - Full CRUD operations

3. **New API service file:**
   - Create `/app/frontend/src/services/api.js` with all API calls

## Data Migration

After backend is ready:
1. Seed database with initial products from mockData.js
2. Seed database with services from mockData.js
3. Seed database with blog posts from mockData.js

## Testing Checklist

- [ ] Products CRUD operations
- [ ] Services CRUD operations
- [ ] Order creation and retrieval
- [ ] Booking creation and retrieval
- [ ] Blog CRUD operations
- [ ] Contact form submission
- [ ] Admin dashboard statistics
- [ ] Frontend-backend integration for all pages
