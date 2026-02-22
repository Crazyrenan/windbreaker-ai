from fastapi import APIRouter, HTTPException, Depends
from app.schemas.price import PricePredictionRequest
from app.api.deps import get_current_user
from app.core.config import settings
import joblib
import pandas as pd

router = APIRouter()

price_model = joblib.load(settings.PRICE_MODEL_PATH)
price_encoders = joblib.load(settings.PRICE_ENCODER_PATH)

@router.post("/predict-price")
async def predict_price(req: PricePredictionRequest, current_user: dict = Depends(get_current_user)):
    try:
        data = {
            'airline': str(req.airline),
            'destination': str(req.destination),
            'duration_mins': float(req.duration_mins)
        }
        df = pd.DataFrame([data])

        for col in ['airline', 'destination']:
            le = price_encoders.get(col) 
            if le:
                df[col] = df[col].apply(lambda x: le.transform([x])[0] if x in le.classes_ else 0)
            else:
                df[col] = 0

        prediction = price_model.predict(df)
        
        return {
            "status": "success",
            "estimated_price": float(prediction[0])
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Price Prediction Error: {str(e)}")