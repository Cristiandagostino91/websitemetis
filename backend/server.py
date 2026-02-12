from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from datetime import datetime
from models import (
    Product, ProductCreate, ProductUpdate,
    Service, ServiceCreate, ServiceUpdate,
    Order, OrderCreate, OrderStatusUpdate,
    Booking, BookingCreate, BookingStatusUpdate,
    BlogPost, BlogPostCreate, BlogPostUpdate,
    ContactMessage, ContactMessageCreate, ContactMessageStatusUpdate
)

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# Utility function to generate order/booking numbers
def generate_order_number():
    date_str = datetime.now().strftime("%Y%m%d")
    return f"ORD-{date_str}-{str(datetime.now().timestamp())[-6:]}"


def generate_booking_number():
    date_str = datetime.now().strftime("%Y%m%d")
    return f"BKG-{date_str}-{str(datetime.now().timestamp())[-6:]}"


# ============= PRODUCTS ENDPOINTS =============
@api_router.get("/products")
async def get_products(featured: bool = None, limit: int = 100, skip: int = 0):
    query = {}
    if featured is not None:
        query["featured"] = featured
    
    projection = {'_id': 0}  # Exclude MongoDB _id, keep all other fields
    products = await db.products.find(query, projection).skip(skip).limit(min(limit, 100)).to_list(100)
    return [Product(**product) for product in products]


@api_router.get("/products/{product_id}")
async def get_product(product_id: str):
    product = await db.products.find_one({"id": product_id})
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return Product(**product)


@api_router.post("/products", response_model=Product)
async def create_product(product: ProductCreate):
    product_dict = product.dict()
    product_obj = Product(**product_dict)
    await db.products.insert_one(product_obj.dict())
    return product_obj


@api_router.put("/products/{product_id}", response_model=Product)
async def update_product(product_id: str, product_update: ProductUpdate):
    update_data = {k: v for k, v in product_update.dict().items() if v is not None}
    update_data["updatedAt"] = datetime.utcnow()
    
    result = await db.products.update_one(
        {"id": product_id},
        {"$set": update_data}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Product not found")
    
    updated_product = await db.products.find_one({"id": product_id})
    return Product(**updated_product)


@api_router.delete("/products/{product_id}")
async def delete_product(product_id: str):
    result = await db.products.delete_one({"id": product_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Product not found")
    return {"message": "Product deleted successfully"}


# ============= SERVICES ENDPOINTS =============
@api_router.get("/services")
async def get_services(limit: int = 100):
    projection = {'_id': 0}
    services = await db.services.find({}, projection).limit(min(limit, 100)).to_list(100)
    return [Service(**service) for service in services]


@api_router.get("/services/{service_id}")
async def get_service(service_id: str):
    service = await db.services.find_one({"id": service_id})
    if not service:
        raise HTTPException(status_code=404, detail="Service not found")
    return Service(**service)


@api_router.post("/services", response_model=Service)
async def create_service(service: ServiceCreate):
    service_dict = service.dict()
    service_obj = Service(**service_dict)
    await db.services.insert_one(service_obj.dict())
    return service_obj


@api_router.put("/services/{service_id}", response_model=Service)
async def update_service(service_id: str, service_update: ServiceUpdate):
    update_data = {k: v for k, v in service_update.dict().items() if v is not None}
    update_data["updatedAt"] = datetime.utcnow()
    
    result = await db.services.update_one(
        {"id": service_id},
        {"$set": update_data}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Service not found")
    
    updated_service = await db.services.find_one({"id": service_id})
    return Service(**updated_service)


@api_router.delete("/services/{service_id}")
async def delete_service(service_id: str):
    result = await db.services.delete_one({"id": service_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Service not found")
    return {"message": "Service deleted successfully"}


# ============= ORDERS ENDPOINTS =============
@api_router.get("/orders")
async def get_orders(status: str = None):
    query = {}
    if status:
        query["status"] = status
    orders = await db.orders.find(query).sort("createdAt", -1).to_list(1000)
    return [Order(**order) for order in orders]


@api_router.get("/orders/{order_id}")
async def get_order(order_id: str):
    order = await db.orders.find_one({"id": order_id})
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return Order(**order)


@api_router.post("/orders", response_model=Order)
async def create_order(order: OrderCreate):
    order_dict = order.dict()
    order_dict["orderNumber"] = generate_order_number()
    order_obj = Order(**order_dict)
    await db.orders.insert_one(order_obj.dict())
    return order_obj


@api_router.put("/orders/{order_id}", response_model=Order)
async def update_order_status(order_id: str, status_update: OrderStatusUpdate):
    update_data = {
        "status": status_update.status,
        "updatedAt": datetime.utcnow()
    }
    
    result = await db.orders.update_one(
        {"id": order_id},
        {"$set": update_data}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Order not found")
    
    updated_order = await db.orders.find_one({"id": order_id})
    return Order(**updated_order)


@api_router.get("/orders-stats")
async def get_order_stats():
    total_orders = await db.orders.count_documents({})
    pending_orders = await db.orders.count_documents({"status": "pending"})
    
    # Calculate total revenue
    pipeline = [
        {"$group": {"_id": None, "total": {"$sum": "$total"}}}
    ]
    result = await db.orders.aggregate(pipeline).to_list(1)
    total_revenue = result[0]["total"] if result else 0
    
    # Recent orders
    recent_orders = await db.orders.find().sort("createdAt", -1).limit(5).to_list(5)
    
    return {
        "totalOrders": total_orders,
        "pendingOrders": pending_orders,
        "totalRevenue": total_revenue,
        "recentOrders": [Order(**order) for order in recent_orders]
    }


# ============= BOOKINGS ENDPOINTS =============
@api_router.get("/bookings")
async def get_bookings(status: str = None, date: str = None):
    query = {}
    if status:
        query["status"] = status
    if date:
        query["date"] = date
    bookings = await db.bookings.find(query).sort("date", 1).to_list(1000)
    return [Booking(**booking) for booking in bookings]


@api_router.get("/bookings/{booking_id}")
async def get_booking(booking_id: str):
    booking = await db.bookings.find_one({"id": booking_id})
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    return Booking(**booking)


@api_router.post("/bookings", response_model=Booking)
async def create_booking(booking: BookingCreate):
    # Get service details
    service = await db.services.find_one({"id": booking.serviceId})
    if not service:
        raise HTTPException(status_code=404, detail="Service not found")
    
    # Check if time slot is available
    existing = await db.bookings.find_one({
        "date": booking.date,
        "time": booking.time,
        "status": {"$in": ["pending", "confirmed"]}
    })
    
    if existing:
        raise HTTPException(status_code=400, detail="Time slot not available")
    
    booking_dict = booking.dict()
    booking_dict["bookingNumber"] = generate_booking_number()
    booking_dict["serviceName"] = service["title"]
    booking_dict["servicePrice"] = service["price"]
    
    booking_obj = Booking(**booking_dict)
    await db.bookings.insert_one(booking_obj.dict())
    return booking_obj


@api_router.put("/bookings/{booking_id}", response_model=Booking)
async def update_booking_status(booking_id: str, status_update: BookingStatusUpdate):
    update_data = {
        "status": status_update.status,
        "updatedAt": datetime.utcnow()
    }
    
    result = await db.bookings.update_one(
        {"id": booking_id},
        {"$set": update_data}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Booking not found")
    
    updated_booking = await db.bookings.find_one({"id": booking_id})
    return Booking(**updated_booking)


@api_router.get("/bookings-available/{date}")
async def get_available_slots(date: str):
    all_slots = [
        "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
        "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30"
    ]
    
    booked = await db.bookings.find({
        "date": date,
        "status": {"$in": ["pending", "confirmed"]}
    }).to_list(1000)
    
    booked_times = [b["time"] for b in booked]
    available = [slot for slot in all_slots if slot not in booked_times]
    
    return {"availableSlots": available}


# ============= BLOG ENDPOINTS =============
@api_router.get("/blog")
async def get_blog_posts(published: bool = None):
    query = {}
    if published is not None:
        query["published"] = published
    posts = await db.blog_posts.find(query).sort("createdAt", -1).to_list(1000)
    return [BlogPost(**post) for post in posts]


@api_router.get("/blog/{post_id}")
async def get_blog_post(post_id: str):
    post = await db.blog_posts.find_one({"id": post_id})
    if not post:
        raise HTTPException(status_code=404, detail="Blog post not found")
    return BlogPost(**post)


@api_router.post("/blog", response_model=BlogPost)
async def create_blog_post(post: BlogPostCreate):
    post_dict = post.dict()
    post_obj = BlogPost(**post_dict)
    await db.blog_posts.insert_one(post_obj.dict())
    return post_obj


@api_router.put("/blog/{post_id}", response_model=BlogPost)
async def update_blog_post(post_id: str, post_update: BlogPostUpdate):
    update_data = {k: v for k, v in post_update.dict().items() if v is not None}
    update_data["updatedAt"] = datetime.utcnow()
    
    result = await db.blog_posts.update_one(
        {"id": post_id},
        {"$set": update_data}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Blog post not found")
    
    updated_post = await db.blog_posts.find_one({"id": post_id})
    return BlogPost(**updated_post)


@api_router.delete("/blog/{post_id}")
async def delete_blog_post(post_id: str):
    result = await db.blog_posts.delete_one({"id": post_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Blog post not found")
    return {"message": "Blog post deleted successfully"}


# ============= CONTACT ENDPOINTS =============
@api_router.post("/contact", response_model=ContactMessage)
async def create_contact_message(message: ContactMessageCreate):
    message_dict = message.dict()
    message_obj = ContactMessage(**message_dict)
    await db.contact_messages.insert_one(message_obj.dict())
    return message_obj


@api_router.get("/contact")
async def get_contact_messages(status: str = None):
    query = {}
    if status:
        query["status"] = status
    messages = await db.contact_messages.find(query).sort("createdAt", -1).to_list(1000)
    return [ContactMessage(**msg) for msg in messages]


@api_router.put("/contact/{message_id}", response_model=ContactMessage)
async def update_contact_message_status(message_id: str, status_update: ContactMessageStatusUpdate):
    result = await db.contact_messages.update_one(
        {"id": message_id},
        {"$set": {"status": status_update.status}}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Message not found")
    
    updated_message = await db.contact_messages.find_one({"id": message_id})
    return ContactMessage(**updated_message)


# Health check
@api_router.get("/")
async def root():
    return {"message": "Centro Metis API is running"}


@api_router.get("/health")
async def health_check():
    return {"status": "healthy", "database": "connected"}


# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
