from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import auth, delay, price
from app.db.session import init_db
from app.core.config import settings

app = FastAPI(
    title=settings.PROJECT_NAME,
    version="2.0.0",
    description="Flight Intelligence API with Modular Architecture"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

init_db()

app.include_router(auth.router, prefix="/api", tags=["Authentication"])
app.include_router(delay.router, prefix="/api", tags=["Flight Delay"])
app.include_router(price.router, prefix="/api", tags=["Price Oracle"])

# 5. Root & Health Check
@app.get("/")
def health_check():
    return {
        "status": "online", 
        "system": settings.PROJECT_NAME,
        "version": "2.0.0"
    }