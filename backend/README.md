# PVApp 2.0 - Backend API

Complete FastAPI backend for PVApp inventory and purchase management system.

## 🚀 Features

- **Authentication & Authorization**
  - JWT-based authentication
  - User registration and login
  - Profile management
  - Password hashing with bcrypt
  - Token expiration (30 days default)

- **Companies Management**
  - CRUD operations for companies
  - Company-specific data isolation
  - Search functionality

- **Materials/Inventory Management**
  - Full CRUD operations
  - Stock tracking and adjustments
  - Stock movement history
  - Low stock alerts
  - Barcode and SKU support
  - Multi-unit support (pcs, kg, m, etc.)

- **Purchase Management**
  - Purchase orders with items
  - Supplier tracking
  - Invoice management
  - Status tracking (pending, completed, cancelled)
  - Automatic total calculations

## 📋 Requirements

- Python 3.8+
- pip (Python package manager)

## 🛠️ Installation

### 1. Create Virtual Environment (Recommended)

```bash
cd backend
python -m venv venv

# Activate virtual environment
# On Linux/Mac:
source venv/bin/activate
# On Windows:
venv\Scripts\activate
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Configure Environment Variables

```bash
# Copy example environment file
cp .env.example .env

# Edit .env with your configuration
nano .env  # or use your preferred editor
```

**Important:** Change the `SECRET_KEY` in production:
```bash
# Generate a secure secret key
python -c "import secrets; print(secrets.token_hex(32))"
```

### 4. Initialize Database

```bash
# Run database initialization script
python init_db.py
```

This will:
- Create all database tables
- Create a demo user (email: `demo@pvapp.com`, password: `demo123`)
- Create 2 demo companies
- Create 5 demo materials with stock
- Create 2 demo purchases with items

## 🏃 Running the Server

### Development Mode

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Or simply:

```bash
python -m app.main
```

### Production Mode

```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4
```

The API will be available at:
- **API Base URL:** http://localhost:8000
- **Swagger UI:** http://localhost:8000/docs
- **ReDoc:** http://localhost:8000/redoc

## 📚 API Documentation

### Interactive Documentation

Once the server is running, visit:
- **Swagger UI (Interactive):** http://localhost:8000/docs
- **ReDoc (Alternative):** http://localhost:8000/redoc

### Authentication Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Register new user |
| POST | `/auth/login` | Login with email/password |
| GET | `/auth/me` | Get current user profile |
| PUT | `/auth/me` | Update user profile |
| POST | `/auth/change-password` | Change password |
| POST | `/auth/logout` | Logout (optional) |

### Companies Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/companies/` | List all companies |
| GET | `/companies/{id}` | Get single company |
| POST | `/companies/` | Create company |
| PUT | `/companies/{id}` | Update company |
| DELETE | `/companies/{id}` | Delete company |

**Query Parameters:**
- `search`: Search by company name

### Materials Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/materials/` | List materials |
| GET | `/materials/{id}` | Get single material |
| POST | `/materials/` | Create material |
| PUT | `/materials/{id}` | Update material |
| DELETE | `/materials/{id}` | Delete material |
| POST | `/materials/{id}/stock/adjust` | Adjust stock |
| GET | `/materials/{id}/movements` | Get stock history |
| GET | `/materials/company/{company_id}/low-stock` | Get low stock items |

**Query Parameters:**
- `company_id`: Filter by company
- `search`: Search by name, SKU, or barcode

### Purchases Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/purchases/` | List purchases |
| GET | `/purchases/{id}` | Get single purchase |
| POST | `/purchases/` | Create purchase |
| PUT | `/purchases/{id}` | Update purchase |
| DELETE | `/purchases/{id}` | Delete purchase |
| GET | `/purchases/{id}/items` | Get purchase items |
| POST | `/purchases/{id}/items` | Add purchase item |
| PUT | `/purchases/{id}/items/{item_id}` | Update item |
| DELETE | `/purchases/{id}/items/{item_id}` | Delete item |

**Query Parameters:**
- `company_id`: Filter by company
- `search`: Search by invoice number or supplier

## 🔒 Authentication

### Getting a Token

```bash
# Register a new user
curl -X POST http://localhost:8000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "full_name": "John Doe",
    "password": "securepassword123"
  }'

# Or login with existing user
curl -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "demo@pvapp.com",
    "password": "demo123"
  }'
```

Response:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "user": {
    "id": 1,
    "email": "demo@pvapp.com",
    "full_name": "Demo User",
    "is_active": true,
    "created_at": "2024-01-01T00:00:00",
    "updated_at": "2024-01-01T00:00:00"
  }
}
```

### Using the Token

Include the token in the Authorization header:

```bash
curl -X GET http://localhost:8000/companies/ \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## 🗄️ Database Schema

### User
- `id`, `email`, `full_name`, `password_hash`, `is_active`, `created_at`, `updated_at`

### Company
- `id`, `name`, `address`, `phone`, `email`, `tax_id`, `user_id`, `created_at`, `updated_at`

### Material
- `id`, `company_id`, `name`, `sku`, `barcode`, `description`, `unit`, `current_stock`, `min_stock`, `unit_price`, `created_at`, `updated_at`

### MaterialMovement
- `id`, `material_id`, `quantity`, `reason`, `notes`, `user_id`, `created_at`

### Purchase
- `id`, `company_id`, `invoice_number`, `supplier_name`, `supplier_contact`, `purchase_date`, `status`, `total_amount`, `notes`, `user_id`, `created_at`, `updated_at`

### PurchaseItem
- `id`, `purchase_id`, `material_id`, `item_name`, `quantity`, `unit_price`, `total_price`, `created_at`

## 🧪 Testing

### Using Demo Credentials

```bash
# Login
curl -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "demo@pvapp.com", "password": "demo123"}'

# Save the token from response
export TOKEN="your_token_here"

# Test authenticated endpoint
curl -X GET http://localhost:8000/companies/ \
  -H "Authorization: Bearer $TOKEN"
```

### Testing with Swagger UI

1. Open http://localhost:8000/docs
2. Click "Authorize" button (🔒 icon)
3. Login via `/auth/login` endpoint
4. Copy the `access_token` from response
5. Paste token in authorization popup (without "Bearer" prefix)
6. Try any protected endpoint

## 🔧 Configuration

### Environment Variables

```env
# Database
DATABASE_URL=sqlite:///./pvapp.db  # For SQLite
# DATABASE_URL=postgresql://user:pass@localhost/dbname  # For PostgreSQL

# JWT
SECRET_KEY=your-secret-key-here  # CHANGE IN PRODUCTION!
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_DAYS=30

# Server
HOST=0.0.0.0
PORT=8000
DEBUG=True

# CORS (optional)
CORS_ORIGINS=http://example.com,https://example.com
```

### Switching to PostgreSQL

1. Install PostgreSQL driver:
```bash
pip install psycopg2-binary
```

2. Update `DATABASE_URL` in `.env`:
```env
DATABASE_URL=postgresql://username:password@localhost:5432/pvapp
```

3. Run migrations:
```bash
python init_db.py
```

## 📦 Project Structure

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py              # FastAPI app setup
│   ├── database.py          # SQLAlchemy configuration
│   ├── models.py            # Database models
│   ├── schemas.py           # Pydantic schemas
│   ├── auth.py              # JWT utilities
│   ├── dependencies.py      # FastAPI dependencies
│   └── routers/
│       ├── __init__.py
│       ├── auth.py          # Authentication routes
│       ├── companies.py     # Companies routes
│       ├── materials.py     # Materials routes
│       └── purchases.py     # Purchases routes
├── init_db.py               # Database initialization
├── requirements.txt         # Python dependencies
├── .env.example            # Environment template
├── .gitignore              # Git ignore rules
└── README.md               # This file
```

## 🚀 Deployment

### Using Gunicorn

```bash
pip install gunicorn
gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```

### Using Docker

Create `Dockerfile`:

```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

Build and run:

```bash
docker build -t pvapp-backend .
docker run -p 8000:8000 pvapp-backend
```

## 🔐 Security Best Practices

1. **Change SECRET_KEY in production**
   ```bash
   python -c "import secrets; print(secrets.token_hex(32))"
   ```

2. **Use HTTPS in production**
   - Configure SSL/TLS certificate
   - Use reverse proxy (Nginx, Caddy)

3. **Set proper CORS origins**
   - Limit to your frontend domain
   - Remove localhost origins in production

4. **Use environment variables**
   - Never commit `.env` file
   - Use secrets management in production

5. **Enable rate limiting**
   - Use slowapi or similar
   - Protect against brute force attacks

6. **Regular updates**
   - Keep dependencies up to date
   - Monitor security advisories

## 🐛 Troubleshooting

### Import Errors

```bash
# Make sure you're in the backend directory
cd backend

# Ensure virtual environment is activated
source venv/bin/activate  # Linux/Mac
venv\Scripts\activate     # Windows

# Reinstall dependencies
pip install -r requirements.txt
```

### Database Locked

```bash
# SQLite database is locked (multiple processes)
# Stop all running instances and restart
pkill -f uvicorn
python -m app.main
```

### Port Already in Use

```bash
# Find process using port 8000
lsof -i :8000  # Linux/Mac
netstat -ano | findstr :8000  # Windows

# Kill the process or use different port
uvicorn app.main:app --reload --port 8001
```

## 📞 Support

For issues or questions:
1. Check API documentation: http://localhost:8000/docs
2. Review error messages in console
3. Check database integrity
4. Verify environment variables

## 📄 License

This project is part of PVApp 2.0 inventory management system.

## 🙏 Credits

Built with:
- [FastAPI](https://fastapi.tiangolo.com/) - Modern web framework
- [SQLAlchemy](https://www.sqlalchemy.org/) - SQL toolkit and ORM
- [Pydantic](https://pydantic-docs.helpmanual.io/) - Data validation
- [python-jose](https://github.com/mpdavis/python-jose) - JWT implementation
- [passlib](https://passlib.readthedocs.io/) - Password hashing
