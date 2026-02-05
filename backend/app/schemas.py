"""
Pydantic Schemas
Request and response models for API validation
"""
from datetime import datetime
from typing import Optional, List
from decimal import Decimal
from pydantic import BaseModel, EmailStr, Field, field_validator


# ============================================================================
# User Schemas
# ============================================================================

class UserBase(BaseModel):
    email: EmailStr
    full_name: str


class UserCreate(UserBase):
    password: str = Field(..., min_length=6)


class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    full_name: Optional[str] = None


class UserResponse(UserBase):
    id: int
    is_active: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class LoginResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse


class ChangePasswordRequest(BaseModel):
    current_password: str
    new_password: str = Field(..., min_length=6)


# ============================================================================
# Company Schemas
# ============================================================================

class CompanyBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    address: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[EmailStr] = None
    tax_id: Optional[str] = None


class CompanyCreate(CompanyBase):
    pass


class CompanyUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    address: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[EmailStr] = None
    tax_id: Optional[str] = None


class CompanyResponse(CompanyBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# ============================================================================
# Material Schemas
# ============================================================================

class MaterialBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    sku: str = Field(..., min_length=1, max_length=100)
    barcode: Optional[str] = Field(None, max_length=100)
    description: Optional[str] = None
    unit: str = Field(default="pcs", max_length=50)
    min_stock: Decimal = Field(default=0, ge=0)
    unit_price: Optional[Decimal] = Field(None, ge=0)


class MaterialCreate(MaterialBase):
    company_id: int
    current_stock: Decimal = Field(default=0, ge=0)


class MaterialUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    sku: Optional[str] = Field(None, min_length=1, max_length=100)
    barcode: Optional[str] = Field(None, max_length=100)
    description: Optional[str] = None
    unit: Optional[str] = Field(None, max_length=50)
    min_stock: Optional[Decimal] = Field(None, ge=0)
    unit_price: Optional[Decimal] = Field(None, ge=0)


class MaterialResponse(MaterialBase):
    id: int
    company_id: int
    current_stock: Decimal
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class StockAdjustmentRequest(BaseModel):
    quantity: Decimal = Field(..., description="Positive for additions, negative for subtractions")
    reason: str = Field(..., min_length=1, max_length=100)
    notes: Optional[str] = None


# ============================================================================
# Material Movement Schemas
# ============================================================================

class MaterialMovementResponse(BaseModel):
    id: int
    material_id: int
    quantity: Decimal
    reason: str
    notes: Optional[str]
    user_id: Optional[int]
    created_at: datetime

    class Config:
        from_attributes = True


# ============================================================================
# Purchase Schemas
# ============================================================================

class PurchaseBase(BaseModel):
    invoice_number: str = Field(..., min_length=1, max_length=100)
    supplier_name: str = Field(..., min_length=1, max_length=255)
    supplier_contact: Optional[str] = Field(None, max_length=255)
    purchase_date: datetime
    status: str = Field(default="pending", pattern="^(pending|completed|cancelled)$")
    notes: Optional[str] = None


class PurchaseCreate(PurchaseBase):
    company_id: int
    total_amount: Decimal = Field(default=0, ge=0)


class PurchaseUpdate(BaseModel):
    invoice_number: Optional[str] = Field(None, min_length=1, max_length=100)
    supplier_name: Optional[str] = Field(None, min_length=1, max_length=255)
    supplier_contact: Optional[str] = Field(None, max_length=255)
    purchase_date: Optional[datetime] = None
    status: Optional[str] = Field(None, pattern="^(pending|completed|cancelled)$")
    total_amount: Optional[Decimal] = Field(None, ge=0)
    notes: Optional[str] = None


class PurchaseResponse(PurchaseBase):
    id: int
    company_id: int
    total_amount: Decimal
    user_id: Optional[int]
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# ============================================================================
# Purchase Item Schemas
# ============================================================================

class PurchaseItemBase(BaseModel):
    item_name: str = Field(..., min_length=1, max_length=255)
    quantity: Decimal = Field(..., gt=0)
    unit_price: Decimal = Field(..., ge=0)


class PurchaseItemCreate(PurchaseItemBase):
    material_id: Optional[int] = None

    @field_validator("quantity", "unit_price")
    def validate_decimals(cls, v):
        if v < 0:
            raise ValueError("Value must be non-negative")
        return v


class PurchaseItemUpdate(BaseModel):
    item_name: Optional[str] = Field(None, min_length=1, max_length=255)
    quantity: Optional[Decimal] = Field(None, gt=0)
    unit_price: Optional[Decimal] = Field(None, ge=0)
    material_id: Optional[int] = None


class PurchaseItemResponse(PurchaseItemBase):
    id: int
    purchase_id: int
    material_id: Optional[int]
    total_price: Decimal
    created_at: datetime

    class Config:
        from_attributes = True


# ============================================================================
# Generic Response Schemas
# ============================================================================

class MessageResponse(BaseModel):
    message: str


class ErrorResponse(BaseModel):
    detail: str
