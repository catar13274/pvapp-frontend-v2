"""
Database Initialization Script
Creates database tables and populates with demo data
"""
import sys
from datetime import datetime, timedelta, timezone
from decimal import Decimal
from app.database import engine, SessionLocal, Base
from app.models import User, Company, Material, MaterialMovement, Purchase, PurchaseItem
from app.auth import get_password_hash

def init_db():
    """
    Initialize database with tables and demo data
    """
    print("🚀 Initializing PVApp 2.0 Database...")
    
    # Create all tables
    print("📦 Creating database tables...")
    Base.metadata.create_all(bind=engine)
    print("✅ Tables created successfully")
    
    # Create database session
    db = SessionLocal()
    
    try:
        # Check if demo user already exists
        existing_user = db.query(User).filter(User.email == "demo@pvapp.com").first()
        if existing_user:
            print("⚠️  Demo data already exists. Skipping initialization.")
            print(f"   Use email: demo@pvapp.com, password: demo123 to login")
            return
        
        # Create demo user
        print("\n👤 Creating demo user...")
        demo_user = User(
            email="demo@pvapp.com",
            full_name="Demo User",
            password_hash=get_password_hash("demo123"),
            is_active=True,
        )
        db.add(demo_user)
        db.commit()
        db.refresh(demo_user)
        print(f"✅ Demo user created: {demo_user.email}")
        
        # Create demo companies
        print("\n🏢 Creating demo companies...")
        company1 = Company(
            name="Acme Electronics Ltd.",
            address="123 Tech Street, Silicon Valley, CA 94000",
            phone="+1-555-0100",
            email="info@acme-electronics.com",
            tax_id="EIN-12-3456789",
            user_id=demo_user.id,
        )
        db.add(company1)
        
        company2 = Company(
            name="Global Components Inc.",
            address="456 Innovation Drive, Boston, MA 02101",
            phone="+1-555-0200",
            email="contact@globalcomponents.com",
            tax_id="EIN-98-7654321",
            user_id=demo_user.id,
        )
        db.add(company2)
        db.commit()
        db.refresh(company1)
        db.refresh(company2)
        print(f"✅ Created company: {company1.name}")
        print(f"✅ Created company: {company2.name}")
        
        # Create demo materials for Company 1
        print("\n📦 Creating demo materials...")
        materials_data = [
            {
                "name": "Arduino Uno R3",
                "sku": "ARD-UNO-R3",
                "barcode": "8058333490090",
                "description": "Microcontroller board based on ATmega328P",
                "unit": "pcs",
                "current_stock": Decimal("150"),
                "min_stock": Decimal("50"),
                "unit_price": Decimal("25.99"),
                "company_id": company1.id,
            },
            {
                "name": "Raspberry Pi 4 Model B (4GB)",
                "sku": "RPI4-4GB",
                "barcode": "0765756931199",
                "description": "Single-board computer with 4GB RAM",
                "unit": "pcs",
                "current_stock": Decimal("75"),
                "min_stock": Decimal("30"),
                "unit_price": Decimal("55.00"),
                "company_id": company1.id,
            },
            {
                "name": "Resistor Kit (1000pcs)",
                "sku": "RES-KIT-1000",
                "barcode": "4897098680063",
                "description": "Assorted resistor values kit",
                "unit": "kit",
                "current_stock": Decimal("25"),
                "min_stock": Decimal("40"),  # Low stock!
                "unit_price": Decimal("12.50"),
                "company_id": company1.id,
            },
            {
                "name": "USB-C Cable (1m)",
                "sku": "CABLE-USBC-1M",
                "barcode": "5060444580543",
                "description": "USB Type-C charging cable, 1 meter",
                "unit": "pcs",
                "current_stock": Decimal("200"),
                "min_stock": Decimal("100"),
                "unit_price": Decimal("8.99"),
                "company_id": company1.id,
            },
            {
                "name": "LED Strip 5050 (5m)",
                "sku": "LED-5050-5M",
                "barcode": "6970622931294",
                "description": "RGB LED strip, 5 meters, waterproof",
                "unit": "roll",
                "current_stock": Decimal("45"),
                "min_stock": Decimal("20"),
                "unit_price": Decimal("18.75"),
                "company_id": company1.id,
            },
        ]
        
        created_materials = []
        for mat_data in materials_data:
            material = Material(**mat_data)
            db.add(material)
            db.commit()
            db.refresh(material)
            created_materials.append(material)
            print(f"✅ Created material: {material.name} (Stock: {material.current_stock})")
            
            # Create initial stock movement
            movement = MaterialMovement(
                material_id=material.id,
                quantity=material.current_stock,
                reason="initial_stock",
                notes="Initial inventory",
                user_id=demo_user.id,
            )
            db.add(movement)
        
        db.commit()
        
        # Create demo purchases
        print("\n🛒 Creating demo purchases...")
        
        # Purchase 1
        purchase1 = Purchase(
            company_id=company1.id,
            invoice_number="INV-2024-001",
            supplier_name="Tech Distributors LLC",
            supplier_contact="sales@techdist.com | +1-555-0300",
            purchase_date=datetime.now(timezone.utc) - timedelta(days=7),
            status="completed",
            total_amount=Decimal("0"),  # Will be updated
            notes="Regular monthly stock replenishment",
            user_id=demo_user.id,
        )
        db.add(purchase1)
        db.commit()
        db.refresh(purchase1)
        
        # Purchase 1 Items
        purchase1_items = [
            {
                "purchase_id": purchase1.id,
                "material_id": created_materials[0].id,  # Arduino
                "item_name": "Arduino Uno R3",
                "quantity": Decimal("50"),
                "unit_price": Decimal("23.50"),
                "total_price": Decimal("1175.00"),
            },
            {
                "purchase_id": purchase1.id,
                "material_id": created_materials[1].id,  # Raspberry Pi
                "item_name": "Raspberry Pi 4 Model B (4GB)",
                "quantity": Decimal("25"),
                "unit_price": Decimal("52.00"),
                "total_price": Decimal("1300.00"),
            },
        ]
        
        for item_data in purchase1_items:
            item = PurchaseItem(**item_data)
            db.add(item)
            purchase1.total_amount += item.total_price
        
        print(f"✅ Created purchase: {purchase1.invoice_number} (Total: ${purchase1.total_amount})")
        
        # Purchase 2
        purchase2 = Purchase(
            company_id=company1.id,
            invoice_number="INV-2024-002",
            supplier_name="Component Wholesale Co.",
            supplier_contact="orders@compwholesale.com | +1-555-0400",
            purchase_date=datetime.now(timezone.utc) - timedelta(days=2),
            status="pending",
            total_amount=Decimal("0"),  # Will be updated
            notes="Urgent order for new project",
            user_id=demo_user.id,
        )
        db.add(purchase2)
        db.commit()
        db.refresh(purchase2)
        
        # Purchase 2 Items
        purchase2_items = [
            {
                "purchase_id": purchase2.id,
                "material_id": created_materials[3].id,  # USB-C Cable
                "item_name": "USB-C Cable (1m)",
                "quantity": Decimal("100"),
                "unit_price": Decimal("7.99"),
                "total_price": Decimal("799.00"),
            },
            {
                "purchase_id": purchase2.id,
                "material_id": created_materials[4].id,  # LED Strip
                "item_name": "LED Strip 5050 (5m)",
                "quantity": Decimal("30"),
                "unit_price": Decimal("17.50"),
                "total_price": Decimal("525.00"),
            },
            {
                "purchase_id": purchase2.id,
                "material_id": None,  # New material not in inventory yet
                "item_name": "Power Supply 12V 5A",
                "quantity": Decimal("20"),
                "unit_price": Decimal("15.00"),
                "total_price": Decimal("300.00"),
            },
        ]
        
        for item_data in purchase2_items:
            item = PurchaseItem(**item_data)
            db.add(item)
            purchase2.total_amount += item.total_price
        
        print(f"✅ Created purchase: {purchase2.invoice_number} (Total: ${purchase2.total_amount})")
        
        # Commit all changes
        db.commit()
        
        # Print summary
        print("\n" + "="*60)
        print("✨ Database initialization completed successfully!")
        print("="*60)
        print("\n📊 Summary:")
        print(f"   • Users: 1")
        print(f"   • Companies: 2")
        print(f"   • Materials: {len(created_materials)}")
        print(f"   • Purchases: 2")
        print(f"\n🔐 Demo Credentials:")
        print(f"   Email: demo@pvapp.com")
        print(f"   Password: demo123")
        print(f"\n🌐 Start the server:")
        print(f"   cd backend")
        print(f"   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000")
        print(f"\n📚 API Documentation:")
        print(f"   Swagger UI: http://localhost:8000/docs")
        print(f"   ReDoc: http://localhost:8000/redoc")
        print("\n" + "="*60)
        
    except Exception as e:
        print(f"\n❌ Error during initialization: {e}")
        db.rollback()
        sys.exit(1)
    finally:
        db.close()


if __name__ == "__main__":
    init_db()
