"""
Companies Router
CRUD operations for companies
"""
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import User, Company
from app.schemas import CompanyCreate, CompanyUpdate, CompanyResponse, MessageResponse
from app.dependencies import get_current_user

router = APIRouter(prefix="/companies", tags=["Companies"])


@router.get("/", response_model=List[CompanyResponse])
async def get_companies(
    search: Optional[str] = Query(None, description="Search by company name"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get all companies for the current user
    
    - **search**: Optional search query to filter by company name
    
    Returns list of companies owned by the current user
    """
    query = db.query(Company).filter(Company.user_id == current_user.id)
    
    # Apply search filter if provided
    if search:
        query = query.filter(Company.name.ilike(f"%{search}%"))
    
    companies = query.order_by(Company.created_at.desc()).all()
    return [CompanyResponse.model_validate(c) for c in companies]


@router.get("/{company_id}", response_model=CompanyResponse)
async def get_company(
    company_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get a single company by ID
    
    - **company_id**: Company ID
    
    Returns company data
    """
    company = db.query(Company).filter(
        Company.id == company_id,
        Company.user_id == current_user.id
    ).first()
    
    if not company:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Company not found"
        )
    
    return CompanyResponse.model_validate(company)


@router.post("/", response_model=CompanyResponse, status_code=status.HTTP_201_CREATED)
async def create_company(
    company_data: CompanyCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Create a new company
    
    - **name**: Company name (required)
    - **address**: Company address (optional)
    - **phone**: Phone number (optional)
    - **email**: Email address (optional)
    - **tax_id**: Tax ID (optional)
    
    Returns created company data
    """
    # Create new company
    new_company = Company(
        **company_data.model_dump(),
        user_id=current_user.id
    )
    
    db.add(new_company)
    db.commit()
    db.refresh(new_company)
    
    return CompanyResponse.model_validate(new_company)


@router.put("/{company_id}", response_model=CompanyResponse)
async def update_company(
    company_id: int,
    company_data: CompanyUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Update a company
    
    - **company_id**: Company ID
    - **name**: Company name (optional)
    - **address**: Company address (optional)
    - **phone**: Phone number (optional)
    - **email**: Email address (optional)
    - **tax_id**: Tax ID (optional)
    
    Returns updated company data
    """
    # Find company
    company = db.query(Company).filter(
        Company.id == company_id,
        Company.user_id == current_user.id
    ).first()
    
    if not company:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Company not found"
        )
    
    # Update company fields
    update_data = company_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(company, field, value)
    
    db.commit()
    db.refresh(company)
    
    return CompanyResponse.model_validate(company)


@router.delete("/{company_id}", response_model=MessageResponse)
async def delete_company(
    company_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Delete a company
    
    - **company_id**: Company ID
    
    Note: This will also delete all related materials, purchases, etc.
    Returns success message
    """
    # Find company
    company = db.query(Company).filter(
        Company.id == company_id,
        Company.user_id == current_user.id
    ).first()
    
    if not company:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Company not found"
        )
    
    # Delete company (cascade will handle related records)
    db.delete(company)
    db.commit()
    
    return MessageResponse(message="Company deleted successfully")
