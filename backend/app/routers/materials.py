"""
Materials Router
CRUD operations for materials with stock management
"""
from typing import List, Optional
from decimal import Decimal
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import User, Company, Material, MaterialMovement
from app.schemas import (
    MaterialCreate,
    MaterialUpdate,
    MaterialResponse,
    StockAdjustmentRequest,
    MaterialMovementResponse,
    MessageResponse,
)
from app.dependencies import get_current_user

router = APIRouter(prefix="/materials", tags=["Materials"])


def verify_company_ownership(company_id: int, user_id: int, db: Session) -> Company:
    """Helper function to verify company ownership"""
    company = db.query(Company).filter(
        Company.id == company_id,
        Company.user_id == user_id
    ).first()
    
    if not company:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Company not found or access denied"
        )
    
    return company


@router.get("/", response_model=List[MaterialResponse])
async def get_materials(
    company_id: Optional[int] = Query(None, description="Filter by company ID"),
    search: Optional[str] = Query(None, description="Search by name, SKU, or barcode"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get all materials with optional filtering
    
    - **company_id**: Filter by company ID (optional)
    - **search**: Search by material name, SKU, or barcode (optional)
    
    Returns list of materials
    """
    # Base query: only materials from user's companies
    query = db.query(Material).join(Company).filter(Company.user_id == current_user.id)
    
    # Apply company filter if provided
    if company_id:
        # Verify company ownership
        verify_company_ownership(company_id, current_user.id, db)
        query = query.filter(Material.company_id == company_id)
    
    # Apply search filter if provided
    if search:
        search_filter = f"%{search}%"
        query = query.filter(
            (Material.name.ilike(search_filter)) |
            (Material.sku.ilike(search_filter)) |
            (Material.barcode.ilike(search_filter))
        )
    
    materials = query.order_by(Material.created_at.desc()).all()
    return [MaterialResponse.model_validate(m) for m in materials]


@router.get("/company/{company_id}/low-stock", response_model=List[MaterialResponse])
async def get_low_stock_materials(
    company_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get materials with low stock for a company
    
    - **company_id**: Company ID
    
    Returns materials where current_stock <= min_stock
    """
    # Verify company ownership
    verify_company_ownership(company_id, current_user.id, db)
    
    # Query for low stock materials
    materials = db.query(Material).filter(
        Material.company_id == company_id,
        Material.current_stock <= Material.min_stock
    ).order_by(Material.current_stock.asc()).all()
    
    return [MaterialResponse.model_validate(m) for m in materials]


@router.get("/{material_id}", response_model=MaterialResponse)
async def get_material(
    material_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get a single material by ID
    
    - **material_id**: Material ID
    
    Returns material data
    """
    material = db.query(Material).join(Company).filter(
        Material.id == material_id,
        Company.user_id == current_user.id
    ).first()
    
    if not material:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Material not found"
        )
    
    return MaterialResponse.model_validate(material)


@router.post("/", response_model=MaterialResponse, status_code=status.HTTP_201_CREATED)
async def create_material(
    material_data: MaterialCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Create a new material
    
    - **company_id**: Company ID (required)
    - **name**: Material name (required)
    - **sku**: Stock Keeping Unit (required, must be unique per company)
    - **barcode**: Barcode (optional)
    - **description**: Description (optional)
    - **unit**: Unit of measurement (default: "pcs")
    - **current_stock**: Initial stock (default: 0)
    - **min_stock**: Minimum stock for alerts (default: 0)
    - **unit_price**: Unit price (optional)
    
    Returns created material data
    """
    # Verify company ownership
    verify_company_ownership(material_data.company_id, current_user.id, db)
    
    # Check if SKU already exists for this company
    existing_material = db.query(Material).filter(
        Material.company_id == material_data.company_id,
        Material.sku == material_data.sku
    ).first()
    
    if existing_material:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="SKU already exists for this company"
        )
    
    # Create new material
    new_material = Material(**material_data.model_dump())
    db.add(new_material)
    db.commit()
    db.refresh(new_material)
    
    # Create initial stock movement if stock > 0
    if new_material.current_stock > 0:
        movement = MaterialMovement(
            material_id=new_material.id,
            quantity=new_material.current_stock,
            reason="initial_stock",
            notes="Initial stock entry",
            user_id=current_user.id
        )
        db.add(movement)
        db.commit()
    
    return MaterialResponse.model_validate(new_material)


@router.put("/{material_id}", response_model=MaterialResponse)
async def update_material(
    material_id: int,
    material_data: MaterialUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Update a material
    
    - **material_id**: Material ID
    - Updates: name, sku, barcode, description, unit, min_stock, unit_price (all optional)
    
    Note: Use /materials/{id}/stock/adjust to modify current_stock
    Returns updated material data
    """
    # Find material
    material = db.query(Material).join(Company).filter(
        Material.id == material_id,
        Company.user_id == current_user.id
    ).first()
    
    if not material:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Material not found"
        )
    
    # Check if SKU is being changed and if it's already taken
    if material_data.sku and material_data.sku != material.sku:
        existing_material = db.query(Material).filter(
            Material.company_id == material.company_id,
            Material.sku == material_data.sku
        ).first()
        
        if existing_material:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="SKU already exists for this company"
            )
    
    # Update material fields
    update_data = material_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(material, field, value)
    
    db.commit()
    db.refresh(material)
    
    return MaterialResponse.model_validate(material)


@router.post("/{material_id}/stock/adjust", response_model=MaterialResponse)
async def adjust_stock(
    material_id: int,
    adjustment: StockAdjustmentRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Adjust material stock
    
    - **material_id**: Material ID
    - **quantity**: Quantity to adjust (positive for additions, negative for subtractions)
    - **reason**: Reason for adjustment (e.g., "purchase", "sale", "damage", "adjustment")
    - **notes**: Additional notes (optional)
    
    Returns updated material data with new stock level
    """
    # Find material
    material = db.query(Material).join(Company).filter(
        Material.id == material_id,
        Company.user_id == current_user.id
    ).first()
    
    if not material:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Material not found"
        )
    
    # Calculate new stock
    new_stock = material.current_stock + adjustment.quantity
    
    # Prevent negative stock
    if new_stock < 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Insufficient stock. Current: {material.current_stock}, Requested: {abs(adjustment.quantity)}"
        )
    
    # Update stock
    material.current_stock = new_stock
    
    # Create movement record
    movement = MaterialMovement(
        material_id=material.id,
        quantity=adjustment.quantity,
        reason=adjustment.reason,
        notes=adjustment.notes,
        user_id=current_user.id
    )
    
    db.add(movement)
    db.commit()
    db.refresh(material)
    
    return MaterialResponse.model_validate(material)


@router.get("/{material_id}/movements", response_model=List[MaterialMovementResponse])
async def get_material_movements(
    material_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get stock movement history for a material
    
    - **material_id**: Material ID
    
    Returns list of stock movements ordered by date (newest first)
    """
    # Verify material ownership
    material = db.query(Material).join(Company).filter(
        Material.id == material_id,
        Company.user_id == current_user.id
    ).first()
    
    if not material:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Material not found"
        )
    
    # Get movements
    movements = db.query(MaterialMovement).filter(
        MaterialMovement.material_id == material_id
    ).order_by(MaterialMovement.created_at.desc()).all()
    
    return [MaterialMovementResponse.model_validate(m) for m in movements]


@router.delete("/{material_id}", response_model=MessageResponse)
async def delete_material(
    material_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Delete a material
    
    - **material_id**: Material ID
    
    Note: This will also delete all related stock movements
    Returns success message
    """
    # Find material
    material = db.query(Material).join(Company).filter(
        Material.id == material_id,
        Company.user_id == current_user.id
    ).first()
    
    if not material:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Material not found"
        )
    
    # Delete material (cascade will handle related records)
    db.delete(material)
    db.commit()
    
    return MessageResponse(message="Material deleted successfully")
