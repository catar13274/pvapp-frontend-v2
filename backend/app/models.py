"""
Database Models
SQLAlchemy ORM models for all database tables
"""
from datetime import datetime
from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Numeric, Text
from sqlalchemy.orm import relationship
from app.database import Base


class User(Base):
    """User model for authentication"""
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    full_name = Column(String(255), nullable=False)
    password_hash = Column(String(255), nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    # Relationships
    companies = relationship("Company", back_populates="user", cascade="all, delete-orphan")
    material_movements = relationship("MaterialMovement", back_populates="user")
    purchases = relationship("Purchase", back_populates="user")


class Company(Base):
    """Company model"""
    __tablename__ = "companies"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False, index=True)
    address = Column(Text, nullable=True)
    phone = Column(String(50), nullable=True)
    email = Column(String(255), nullable=True)
    tax_id = Column(String(100), nullable=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    # Relationships
    user = relationship("User", back_populates="companies")
    materials = relationship("Material", back_populates="company", cascade="all, delete-orphan")
    purchases = relationship("Purchase", back_populates="company", cascade="all, delete-orphan")


class Material(Base):
    """Material/Product model with inventory tracking"""
    __tablename__ = "materials"

    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("companies.id", ondelete="CASCADE"), nullable=False, index=True)
    name = Column(String(255), nullable=False, index=True)
    sku = Column(String(100), nullable=False, index=True)
    barcode = Column(String(100), nullable=True, index=True)
    description = Column(Text, nullable=True)
    unit = Column(String(50), nullable=False, default="pcs")  # pcs, kg, m, l, etc.
    current_stock = Column(Numeric(10, 2), nullable=False, default=0)
    min_stock = Column(Numeric(10, 2), nullable=False, default=0)  # For low stock alerts
    unit_price = Column(Numeric(10, 2), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    # Relationships
    company = relationship("Company", back_populates="materials")
    movements = relationship("MaterialMovement", back_populates="material", cascade="all, delete-orphan")
    purchase_items = relationship("PurchaseItem", back_populates="material")


class MaterialMovement(Base):
    """Stock movement history for materials"""
    __tablename__ = "material_movements"

    id = Column(Integer, primary_key=True, index=True)
    material_id = Column(Integer, ForeignKey("materials.id", ondelete="CASCADE"), nullable=False, index=True)
    quantity = Column(Numeric(10, 2), nullable=False)  # Positive for additions, negative for subtractions
    reason = Column(String(100), nullable=False)  # purchase, sale, adjustment, damage, etc.
    notes = Column(Text, nullable=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True, index=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    # Relationships
    material = relationship("Material", back_populates="movements")
    user = relationship("User", back_populates="material_movements")


class Purchase(Base):
    """Purchase/Order model"""
    __tablename__ = "purchases"

    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("companies.id", ondelete="CASCADE"), nullable=False, index=True)
    invoice_number = Column(String(100), nullable=False, index=True)
    supplier_name = Column(String(255), nullable=False, index=True)
    supplier_contact = Column(String(255), nullable=True)
    purchase_date = Column(DateTime, nullable=False, default=datetime.utcnow)
    status = Column(String(50), nullable=False, default="pending")  # pending, completed, cancelled
    total_amount = Column(Numeric(10, 2), nullable=False, default=0)
    notes = Column(Text, nullable=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True, index=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    # Relationships
    company = relationship("Company", back_populates="purchases")
    user = relationship("User", back_populates="purchases")
    items = relationship("PurchaseItem", back_populates="purchase", cascade="all, delete-orphan")


class PurchaseItem(Base):
    """Individual items in a purchase"""
    __tablename__ = "purchase_items"

    id = Column(Integer, primary_key=True, index=True)
    purchase_id = Column(Integer, ForeignKey("purchases.id", ondelete="CASCADE"), nullable=False, index=True)
    material_id = Column(Integer, ForeignKey("materials.id", ondelete="SET NULL"), nullable=True, index=True)
    item_name = Column(String(255), nullable=False)
    quantity = Column(Numeric(10, 2), nullable=False)
    unit_price = Column(Numeric(10, 2), nullable=False)
    total_price = Column(Numeric(10, 2), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    # Relationships
    purchase = relationship("Purchase", back_populates="items")
    material = relationship("Material", back_populates="purchase_items")
