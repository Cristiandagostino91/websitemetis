from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import JWTError, jwt
from passlib.context import CryptContext
from datetime import datetime, timedelta
from pydantic import BaseModel
import os

# JWT Configuration
SECRET_KEY = os.environ.get("JWT_SECRET", "centrometis-super-secret-key-2024-admin-panel")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 480  # 8 hours

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# HTTP Bearer security
security = HTTPBearer()

# Admin credentials - secure defaults
ADMIN_EMAIL = os.environ.get("ADMIN_EMAIL", "admin@centrometis.com")
ADMIN_PASSWORD_HASH = pwd_context.hash(os.environ.get("ADMIN_PASSWORD", "CentroMetis@2024!Admin"))


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    email: str | None = None


class AdminLogin(BaseModel):
    email: str
    password: str


class AdminUser(BaseModel):
    email: str
    name: str = "Amministratore"


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def create_access_token(data: dict, expires_delta: timedelta | None = None) -> str:
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def authenticate_admin(email: str, password: str) -> AdminUser | None:
    if email == ADMIN_EMAIL and verify_password(password, ADMIN_PASSWORD_HASH):
        return AdminUser(email=email)
    return None


async def get_current_admin(credentials: HTTPAuthorizationCredentials = Depends(security)) -> AdminUser:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Token non valido o scaduto",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        token = credentials.credentials
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
        token_data = TokenData(email=email)
    except JWTError:
        raise credentials_exception
    
    if token_data.email != ADMIN_EMAIL:
        raise credentials_exception
    
    return AdminUser(email=token_data.email)
