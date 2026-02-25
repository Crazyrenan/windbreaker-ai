import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "WINDBREAKER.AI"
    SECRET_KEY: str = os.getenv("SECRET_KEY", "your-super-secret-key-change-this-in-production")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    DB_PATH: str = "windbreaker_users.db"
    
    # Path Arsitektur
    BASE_DIR: str = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    
    # Lokasi Model & Encoder
    PRICE_MODEL_PATH: str = os.path.join(BASE_DIR, "models", "xgb_price.pkl")
    PRICE_ENCODER_PATH: str = os.path.join(BASE_DIR, "models", "price_encoders.pkl")
    
    # Lokasi Model & Encoder Delay
    DELAY_MODEL_PATH: str = os.path.join(BASE_DIR, "models", "xgb_flight_delay.pkl")
    DELAY_ENCODER_PATH: str = os.path.join(BASE_DIR, "models", "delay_encoders.pkl")

settings = Settings()