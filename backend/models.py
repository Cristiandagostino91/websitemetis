from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
import uuid


class Product(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    category: str
    price: float
    image: str
    description: str
    inStock: bool = True
    featured: bool = False
    createdAt: datetime = Field(default_factory=datetime.utcnow)
    updatedAt: datetime = Field(default_factory=datetime.utcnow)


class ProductCreate(BaseModel):
    name: str
    category: str
    price: float
    image: str
    description: str
    inStock: bool = True
    featured: bool = False


class ProductUpdate(BaseModel):
    name: Optional[str] = None
    category: Optional[str] = None
    price: Optional[float] = None
    image: Optional[str] = None
    description: Optional[str] = None
    inStock: Optional[bool] = None
    featured: Optional[bool] = None


class Service(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    category: str
    price: float
    duration: str
    description: str
    image: str
    createdAt: datetime = Field(default_factory=datetime.utcnow)
    updatedAt: datetime = Field(default_factory=datetime.utcnow)


class ServiceCreate(BaseModel):
    title: str
    category: str
    price: float
    duration: str
    description: str
    image: str


class ServiceUpdate(BaseModel):
    title: Optional[str] = None
    category: Optional[str] = None
    price: Optional[float] = None
    duration: Optional[str] = None
    description: Optional[str] = None
    image: Optional[str] = None


class OrderItem(BaseModel):
    productId: str
    name: str
    price: float
    quantity: int
    image: str


class CustomerInfo(BaseModel):
    firstName: str
    lastName: str
    email: str
    phone: str


class ShippingInfo(BaseModel):
    address: str
    city: str
    zipCode: str
    notes: Optional[str] = ""


class Order(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    orderNumber: str
    items: List[OrderItem]
    customer: CustomerInfo
    shipping: ShippingInfo
    total: float
    status: str = "pending"
    createdAt: datetime = Field(default_factory=datetime.utcnow)
    updatedAt: datetime = Field(default_factory=datetime.utcnow)


class OrderCreate(BaseModel):
    items: List[OrderItem]
    customer: CustomerInfo
    shipping: ShippingInfo
    total: float


class OrderStatusUpdate(BaseModel):
    status: str


class BookingCustomer(BaseModel):
    name: str
    email: str
    phone: str


class Booking(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    bookingNumber: str
    serviceId: str
    serviceName: str
    servicePrice: float
    date: str
    time: str
    customer: BookingCustomer
    notes: Optional[str] = ""
    status: str = "pending"
    createdAt: datetime = Field(default_factory=datetime.utcnow)
    updatedAt: datetime = Field(default_factory=datetime.utcnow)


class BookingCreate(BaseModel):
    serviceId: str
    date: str
    time: str
    customer: BookingCustomer
    notes: Optional[str] = ""


class BookingStatusUpdate(BaseModel):
    status: str


class BlogPost(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    excerpt: str
    content: str
    author: str
    date: str
    image: str
    category: str
    published: bool = True
    createdAt: datetime = Field(default_factory=datetime.utcnow)
    updatedAt: datetime = Field(default_factory=datetime.utcnow)


class BlogPostCreate(BaseModel):
    title: str
    excerpt: str
    content: str
    author: str
    date: str
    image: str
    category: str
    published: bool = True


class BlogPostUpdate(BaseModel):
    title: Optional[str] = None
    excerpt: Optional[str] = None
    content: Optional[str] = None
    author: Optional[str] = None
    date: Optional[str] = None
    image: Optional[str] = None
    category: Optional[str] = None
    published: Optional[bool] = None


class ContactMessage(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: str
    phone: str
    message: str
    status: str = "new"
    createdAt: datetime = Field(default_factory=datetime.utcnow)


class ContactMessageCreate(BaseModel):
    name: str
    email: str
    phone: str
    message: str


class ContactMessageStatusUpdate(BaseModel):
    status: str
