"""
FastAPI Main Application
CoApp 2.0 - Backend API for inventory and purchase management
"""
import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from app.database import engine, Base
from app.routers import auth, companies, materials, purchases

# Load environment variables
load_dotenv()


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Lifespan context manager for startup/shutdown events
    """
    # Startup
    Base.metadata.create_all(bind=engine)
    print("✅ Database tables created/verified")
    print(f"✅ Server starting on http://{os.getenv('HOST', '0.0.0.0')}:{os.getenv('PORT', 8001)}")
    yield
    # Shutdown (if needed)


# Create FastAPI application
app = FastAPI(
    title="CoApp 2.0 API",
    version="2.0.0",
    description="Backend API for CoApp inventory and purchase management system",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)

# CORS Configuration
# Allow requests from frontend development servers
allowed_origins = [
    "http://localhost:3000",  # Vite default
    "http://localhost:3001",  # Alternative port
    "http://localhost:5173",  # Vite alternative
    "http://127.0.0.1:3000",
    "http://127.0.0.1:3001",
    "http://127.0.0.1:5173",
]

# Add additional origins from environment variable if provided
extra_origins = os.getenv("CORS_ORIGINS", "")
if extra_origins:
    allowed_origins.extend(extra_origins.split(","))

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Root endpoint
@app.get("/", tags=["Root"])
async def root():
    """
    Root endpoint - API health check
    """
    return {
        "message": "CoApp 2.0 API",
        "version": "2.0.0",
        "status": "operational",
        "docs": "/docs",
        "redoc": "/redoc",
    }


# Health check endpoint
@app.get("/health", tags=["Root"])
async def health_check():
    """
    Health check endpoint for monitoring
    """
    return {
        "status": "healthy",
        "api": "CoApp 2.0",
        "version": "2.0.0",
    }


# Include routers
app.include_router(auth.router)
app.include_router(companies.router)
app.include_router(materials.router)
app.include_router(purchases.router)


# Error handlers
@app.exception_handler(404)
async def not_found_handler(request, exc):
    """
    Custom 404 error handler
    """
    return {
        "detail": "The requested resource was not found",
        "path": str(request.url),
    }


@app.exception_handler(500)
async def internal_error_handler(request, exc):
    """
    Custom 500 error handler
    """
    return {
        "detail": "Internal server error",
        "message": "An unexpected error occurred. Please try again later.",
    }


if __name__ == "__main__":
    import uvicorn
    
    # Get configuration from environment
    host = os.getenv("HOST", "0.0.0.0")
    port = int(os.getenv("PORT", 8001))
    debug = os.getenv("DEBUG", "True").lower() == "true"
    
    # Run server
    uvicorn.run(
        "app.main:app",
        host=host,
        port=port,
        reload=debug,
        log_level="info" if debug else "warning",
    )
