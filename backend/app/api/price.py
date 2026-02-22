import joblib
import pandas as pd
import numpy as np
from fastapi import APIRouter, Depends, HTTPException
from app.schemas.price import PricePredictionRequest
from app.core.config import settings

router = APIRouter()

# Load model & encoders saat startup
try:
    model = joblib.load(settings.PRICE_MODEL_PATH)
    encoders = joblib.load(settings.PRICE_ENCODER_PATH)
except Exception as e:
    print(f"Critical Error: Model file not found. {e}")

@router.get("/price-options")
def get_price_options():
    try:
        airlines = encoders['airline'].classes_.tolist()
        origins = encoders['origin'].classes_.tolist()
        destinations = encoders['destination'].classes_.tolist()
        cities = sorted(list(set(origins + destinations)))
        return {"airlines": airlines, "cities": cities}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/predict-price")
async def predict_price(request: PricePredictionRequest):
    try:
        input_data = pd.DataFrame([{
            "airline": request.airline,
            "origin": request.origin,
            "destination": request.destination,
            "duration_mins": request.duration_mins
        }])

        # Transformasi menggunakan encoders yang sudah di-load
        for col in ['airline', 'origin', 'destination']:
            le = encoders[col]
            # Jika user memilih data yang tidak ada di CSV, kita beri index 0 agar tidak crash
            if input_data[col].iloc[0] in le.classes_:
                input_data[col] = le.transform(input_data[col].astype(str))
            else:
                input_data[col] = 0

        prediction = model.predict(input_data)
        return {"estimated_price": float(abs(prediction[0]))}

    except Exception as e:
        # Ini akan membantu Anda melihat di console jika ada kolom yang salah
        print(f"DEBUG: Error details -> {str(e)}")
        raise HTTPException(status_code=500, detail="Data mapping mismatch with flight.csv")