import os
from dotenv import load_dotenv
from pydantic_settings import BaseSettings

load_dotenv()

class Settings(BaseSettings):
    PROJECT_NAME: str = "WINDBREAKER.AI"
    SECRET_KEY: str = os.getenv("SECRET_KEY")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    DB_PATH: str = os.getenv("DB_PATH", "windbreaker_users.db")
    
    # Resolusi path model agar tidak error saat dipindah folder
    BASE_DIR: str = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    DELAY_MODEL_PATH: str = os.path.join(BASE_DIR, "models", "xgb_flight_delay.pkl")
    DELAY_ENCODER_PATH: str = os.path.join(BASE_DIR, "models", "encoders.pkl")
    PRICE_MODEL_PATH: str = os.path.join(BASE_DIR, "models", "xgb_price.pkl")
    PRICE_ENCODER_PATH: str = os.path.join(BASE_DIR, "models", "price_encoders.pkl")

settings = Settings()