"""
Purchases Router
CRUD operations for purchases and purchase items
"""
from typing import List, Optional
from decimal import Decimal
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import User, Company, Purchase, PurchaseItem, Material
from app.schemas import (
    PurchaseCreate,
    PurchaseUpdate,
    PurchaseResponse,
    PurchaseItemCreate,
    PurchaseItemUpdate,
    PurchaseItemResponse,
    MessageResponse,
)
from app.dependencies import get_current_user

router = APIRouter(prefix="/purchases", tags=["Purchases"])


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


def verify_purchase_ownership(purchase_id: int, user_id: int, db: Session) -> Purchase:
    """Helper function to verify purchase ownership"""
    purchase = db.query(Purchase).join(Company).filter(
        Purchase.id == purchase_id,
        Company.user_id == user_id
    ).first()
    
    if not purchase:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Purchase not found or access denied"
        )
    
    return purchase


@router.get("/", response_model=List[PurchaseResponse])
async def get_purchases(
    company_id: Optional[int] = Query(None, description="Filter by company ID"),
    search: Optional[str] = Query(None, description="Search by invoice number or supplier"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get all purchases with optional filtering
    
    - **company_id**: Filter by company ID (optional)
    - **search**: Search by invoice number or supplier name (optional)
    
    Returns list of purchases
    """
    # Base query: only purchases from user's companies
    query = db.query(Purchase).join(Company).filter(Company.user_id == current_user.id)
    
    # Apply company filter if provided
    if company_id:
        # Verify company ownership
        verify_company_ownership(company_id, current_user.id, db)
        query = query.filter(Purchase.company_id == company_id)
    
    # Apply search filter if provided
    if search:
        search_filter = f"%{search}%"
        query = query.filter(
            (Purchase.invoice_number.ilike(search_filter)) |
            (Purchase.supplier_name.ilike(search_filter))
        )
    
    purchases = query.order_by(Purchase.purchase_date.desc()).all()
    return [PurchaseResponse.model_validate(p) for p in purchases]


@router.get("/{purchase_id}", response_model=PurchaseResponse)
async def get_purchase(
    purchase_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get a single purchase by ID
    
    - **purchase_id**: Purchase ID
    
    Returns purchase data
    """
    purchase = verify_purchase_ownership(purchase_id, current_user.id, db)
    return PurchaseResponse.model_validate(purchase)


@router.post("/", response_model=PurchaseResponse, status_code=status.HTTP_201_CREATED)
async def create_purchase(
    purchase_data: PurchaseCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Create a new purchase
    
    - **company_id**: Company ID (required)
    - **invoice_number**: Invoice/Order number (required)
    - **supplier_name**: Supplier name (required)
    - **supplier_contact**: Supplier contact info (optional)
    - **purchase_date**: Purchase date (required)
    - **status**: Status: pending, completed, or cancelled (default: pending)
    - **total_amount**: Total purchase amount (default: 0)
    - **notes**: Additional notes (optional)
    
    Returns created purchase data
    """
    # Verify company ownership
    verify_company_ownership(purchase_data.company_id, current_user.id, db)
    
    # Create new purchase
    new_purchase = Purchase(
        **purchase_data.model_dump(),
        user_id=current_user.id
    )
    
    db.add(new_purchase)
    db.commit()
    db.refresh(new_purchase)
    
    return PurchaseResponse.model_validate(new_purchase)


@router.put("/{purchase_id}", response_model=PurchaseResponse)
async def update_purchase(
    purchase_id: int,
    purchase_data: PurchaseUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Update a purchase
    
    - **purchase_id**: Purchase ID
    - Updates: invoice_number, supplier_name, supplier_contact, purchase_date, 
               status, total_amount, notes (all optional)
    
    Returns updated purchase data
    """
    # Verify purchase ownership
    purchase = verify_purchase_ownership(purchase_id, current_user.id, db)
    
    # Update purchase fields
    update_data = purchase_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(purchase, field, value)
    
    db.commit()
    db.refresh(purchase)
    
    return PurchaseResponse.model_validate(purchase)


@router.delete("/{purchase_id}", response_model=MessageResponse)
async def delete_purchase(
    purchase_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Delete a purchase
    
    - **purchase_id**: Purchase ID
    
    Note: This will also delete all related purchase items
    Returns success message
    """
    # Verify purchase ownership
    purchase = verify_purchase_ownership(purchase_id, current_user.id, db)
    
    # Delete purchase (cascade will handle related records)
    db.delete(purchase)
    db.commit()
    
    return MessageResponse(message="Purchase deleted successfully")


# ============================================================================
# Purchase Items Endpoints
# ============================================================================

@router.get("/{purchase_id}/items", response_model=List[PurchaseItemResponse])
async def get_purchase_items(
    purchase_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get all items for a purchase
    
    - **purchase_id**: Purchase ID
    
    Returns list of purchase items
    """
    # Verify purchase ownership
    purchase = verify_purchase_ownership(purchase_id, current_user.id, db)
    
    # Get items
    items = db.query(PurchaseItem).filter(
        PurchaseItem.purchase_id == purchase_id
    ).order_by(PurchaseItem.created_at.asc()).all()
    
    return [PurchaseItemResponse.model_validate(item) for item in items]


@router.post("/{purchase_id}/items", response_model=PurchaseItemResponse, status_code=status.HTTP_201_CREATED)
async def add_purchase_item(
    purchase_id: int,
    item_data: PurchaseItemCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Add an item to a purchase
    
    - **purchase_id**: Purchase ID
    - **item_name**: Item name (required)
    - **quantity**: Quantity (required, must be > 0)
    - **unit_price**: Unit price (required)
    - **material_id**: Link to material (optional)
    
    Automatically calculates total_price = quantity * unit_price
    Returns created item data
    """
    # Verify purchase ownership
    purchase = verify_purchase_ownership(purchase_id, current_user.id, db)
    
    # Verify material exists and belongs to same company (if provided)
    if item_data.material_id:
        material = db.query(Material).filter(
            Material.id == item_data.material_id,
            Material.company_id == purchase.company_id
        ).first()
        
        if not material:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Material not found or does not belong to the same company"
            )
    
    # Calculate total price
    total_price = item_data.quantity * item_data.unit_price
    
    # Create new item
    new_item = PurchaseItem(
        purchase_id=purchase_id,
        **item_data.model_dump(),
        total_price=total_price
    )
    
    db.add(new_item)
    
    # Update purchase total amount
    purchase.total_amount += total_price
    
    db.commit()
    db.refresh(new_item)
    
    return PurchaseItemResponse.model_validate(new_item)


@router.put("/{purchase_id}/items/{item_id}", response_model=PurchaseItemResponse)
async def update_purchase_item(
    purchase_id: int,
    item_id: int,
    item_data: PurchaseItemUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Update a purchase item
    
    - **purchase_id**: Purchase ID
    - **item_id**: Item ID
    - Updates: item_name, quantity, unit_price, material_id (all optional)
    
    Automatically recalculates total_price and updates purchase total_amount
    Returns updated item data
    """
    # Verify purchase ownership
    purchase = verify_purchase_ownership(purchase_id, current_user.id, db)
    
    # Find item
    item = db.query(PurchaseItem).filter(
        PurchaseItem.id == item_id,
        PurchaseItem.purchase_id == purchase_id
    ).first()
    
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Purchase item not found"
        )
    
    # Store old total for purchase amount adjustment
    old_total = item.total_price
    
    # Update item fields
    update_data = item_data.model_dump(exclude_unset=True)
    
    # Verify material if being updated
    if "material_id" in update_data and update_data["material_id"]:
        material = db.query(Material).filter(
            Material.id == update_data["material_id"],
            Material.company_id == purchase.company_id
        ).first()
        
        if not material:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Material not found or does not belong to the same company"
            )
    
    for field, value in update_data.items():
        setattr(item, field, value)
    
    # Recalculate total price
    item.total_price = item.quantity * item.unit_price
    
    # Update purchase total amount
    purchase.total_amount = purchase.total_amount - old_total + item.total_price
    
    db.commit()
    db.refresh(item)
    
    return PurchaseItemResponse.model_validate(item)


@router.delete("/{purchase_id}/items/{item_id}", response_model=MessageResponse)
async def delete_purchase_item(
    purchase_id: int,
    item_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Delete a purchase item
    
    - **purchase_id**: Purchase ID
    - **item_id**: Item ID
    
    Automatically updates purchase total_amount
    Returns success message
    """
    # Verify purchase ownership
    purchase = verify_purchase_ownership(purchase_id, current_user.id, db)
    
    # Find item
    item = db.query(PurchaseItem).filter(
        PurchaseItem.id == item_id,
        PurchaseItem.purchase_id == purchase_id
    ).first()
    
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Purchase item not found"
        )
    
    # Update purchase total amount
    purchase.total_amount -= item.total_price
    
    # Delete item
    db.delete(item)
    db.commit()
    
    return MessageResponse(message="Purchase item deleted successfully")
