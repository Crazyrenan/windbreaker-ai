from fastapi import APIRouter, HTTPException, Depends
from app.schemas.flight import FlightInput
from app.api.deps import get_current_user
from app.core.config import settings
import joblib
import pandas as pd
import numpy as np
import os

router = APIRouter()

# Global variables
delay_model = None
delay_encoders = {}

# Load saat startup
try:
    if os.path.exists(settings.DELAY_MODEL_PATH) and os.path.exists(settings.DELAY_ENCODER_PATH):
        delay_model = joblib.load(settings.DELAY_MODEL_PATH)
        delay_encoders = joblib.load(settings.DELAY_ENCODER_PATH)
    else:
        print("WARNING: Delay model/encoders not found at path.")
except Exception as e:
    print(f"Critical Error Loading Delay Model: {e}")

@router.get("/delay-options")
def get_delay_options():
    if not delay_encoders:
        return {"airlines": [], "cities": []}
    try:
        airlines = delay_encoders.get('Marketing_Airline_Network').classes_.tolist()
        origins = delay_encoders.get('OriginCityName').classes_.tolist()
        destinations = delay_encoders.get('DestCityName').classes_.tolist()
        cities = sorted(list(set(origins + destinations)))
        return {"airlines": airlines, "cities": cities}
    except Exception as e:
        return {"airlines": [], "cities": [], "error": str(e)}

@router.post("/predict-delay")
async def predict_delay(req: FlightInput, current_user: dict = Depends(get_current_user)):
    if not delay_model or not delay_encoders:
        raise HTTPException(status_code=500, detail="Delay Service Unavailable (Model not loaded)")

    try:
        dt = pd.to_datetime(req.date)
        dep_time = pd.to_datetime(req.time, format='%H:%M')
        
        month = dt.month
        day_of_week = dt.dayofweek + 1
        dep_hour = dep_time.hour
        
        month_sin = np.sin(2 * np.pi * month / 12)
        month_cos = np.cos(2 * np.pi * month / 12)
        day_sin = np.sin(2 * np.pi * day_of_week / 7)
        day_cos = np.cos(2 * np.pi * day_of_week / 7)

        def safe_transform(encoder_key, value):
            le = delay_encoders.get(encoder_key)
            if le and value in le.classes_:
                return le.transform([value])[0]
            return 0 

        airline_enc = safe_transform('Marketing_Airline_Network', req.airline)
        origin_enc = safe_transform('OriginCityName', req.origin)
        dest_enc = safe_transform('DestCityName', req.destination)

        # 3. Susun DataFrame
        features = ['DepHour', 'Month_Sin', 'Month_Cos', 'Day_Sin', 'Day_Cos', 
                    'Marketing_Airline_Network', 'OriginCityName', 'DestCityName']
        
        input_data = [dep_hour, month_sin, month_cos, day_sin, day_cos, 
                      airline_enc, origin_enc, dest_enc]
        
        input_df = pd.DataFrame([input_data], columns=features)

        # 4. Prediksi Probabilitas
        prob = delay_model.predict_proba(input_df)[0][1]

        return {
            "prediction": "DELAYED" if prob > 0.5 else "ON TIME",
            "probability": float(round(prob, 4)),
            "risk_score": int(prob * 100)
        }

    except Exception as e:
        print(f"Delay Inference Error: {e}")
        raise HTTPException(status_code=500, detail=f"Inference Error: {str(e)}")