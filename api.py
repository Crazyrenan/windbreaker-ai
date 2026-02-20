from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from auth import router as auth_router
from pydantic import BaseModel
import joblib
from auth import get_current_user
import os
import pandas as pd
import numpy as np
from pydantic import BaseModel
from fastapi import HTTPException

price_model = joblib.load("models/xgb_price.pkl")
price_encoders = joblib.load("models/price_encoders.pkl")

class PricePredictionRequest(BaseModel):
    airline: str
    origin: str
    destination: str
    duration_mins: int

app = FastAPI(title="Flight Delay Predictor API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)

# 2. LOAD MODELS
MODEL_PATH = os.path.join('models', 'xgb_flight_delay.pkl')
ENCODER_PATH = os.path.join('models', 'encoders.pkl')

print("Loading model artifacts...")
model = joblib.load(MODEL_PATH)
encoders = joblib.load(ENCODER_PATH)

# 3. SCHEMA
class FlightInput(BaseModel):
    airline: str      
    origin: str       
    destination: str  
    date: str         
    time: str         

# 4. ENDPOINTS
@app.post("/predict")
async def predict_delay(req: FlightInput, current_user: dict = Depends(get_current_user)):
    try:
        # A. Preprocessing Date/Time
        dt = pd.to_datetime(input.date)
        dep_time = pd.to_datetime(input.time, format='%H:%M')
        
        month = dt.month
        day_of_week = dt.dayofweek + 1
        dep_hour = dep_time.hour
        
        # B. Cyclical Features
        month_sin = np.sin(2 * np.pi * month / 12)
        month_cos = np.cos(2 * np.pi * month / 12)
        day_sin = np.sin(2 * np.pi * day_of_week / 7)
        day_cos = np.cos(2 * np.pi * day_of_week / 7)

        # C. Encode Categories
        airline_enc = encoders['Marketing_Airline_Network'].transform([input.airline])[0]
        origin_enc = encoders['OriginCityName'].transform([input.origin])[0]
        dest_enc = encoders['DestCityName'].transform([input.destination])[0]

        # D. Predict
        features = [dep_hour, month_sin, month_cos, day_sin, day_cos, 
                    airline_enc, origin_enc, dest_enc]
        
        input_df = pd.DataFrame([features], columns=[
            'DepHour', 'Month_Sin', 'Month_Cos', 'Day_Sin', 'Day_Cos', 
            'Marketing_Airline_Network', 'OriginCityName', 'DestCityName'
        ])

        prob = model.predict_proba(input_df)[0][1]

        return {
            "prediction": "DELAYED" if prob > 0.5 else "ON TIME",
            "probability": float(round(prob, 4)),
            "risk_score": int(prob * 100)
        }

    except Exception as e:
        raise HTTPException(
        status_code=400, 
        detail=f"Input tidak dikenal: {str(e)}. Pastikan menggunakan kode maskapai (misal: AA) dan nama kota yang sesuai dataset."
    )

@app.post("/api/predict-price")
async def predict_price(req: PricePredictionRequest, current_user: dict = Depends(get_current_user)):
    try:
        data = {
            'airline': str(req.airline),
            'destination': str(req.destination),
            'duration_mins': float(req.duration_mins)
        }
        df = pd.DataFrame([data])

        for col in ['airline', 'destination']:
            le = encoders.get(col) 
            if le:
                df[col] = df[col].apply(lambda x: le.transform([x])[0] if x in le.classes_ else 0)
                df[col] = pd.to_numeric(df[col])
            else:
                df[col] = 0

        df = df[['airline', 'destination', 'duration_mins']]

        prediction = model.predict(df)
        
        return {
            "status": "success",
            "estimated_price": float(prediction[0])
        }
        
    except Exception as e:
        print(f"Prediction Error: {e}") 
        raise HTTPException(status_code=500, detail=f"Model Error: {str(e)}")
    
@app.get("/options")
def get_options():
    try:
        return {
            "airlines": encoders['Marketing_Airline_Network'].classes_.tolist(),
            "cities": encoders['OriginCityName'].classes_.tolist() 
            # Kita asumsikan kota asal dan tujuan list-nya sama. 
            # Jika beda, bisa tambahkan "dest_cities": encoders['DestCityName'].classes_.tolist()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@app.get("/")
def health():
    return {"status": "online"}