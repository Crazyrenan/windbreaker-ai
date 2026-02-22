import pandas as pd
from fastapi import APIRouter
from app.core.config import settings

router = APIRouter()

@router.get("/options")
def get_options():
    try:
        df = pd.read_csv("flight.csv")
        # Bersihkan spasi dan buat lowercase untuk konsistensi dengan training
        df.columns = df.columns.str.strip().str.lower()
        
        # Mapping kolom sesuai dataset Anda
        airline_col = 'airline name'
        origin_col = 'depreture airport'
        dest_col = 'destination airport'
        
        airlines = sorted(df[airline_col].dropna().unique().tolist())
        origins = df[origin_col].dropna().unique().tolist()
        destinations = df[dest_col].dropna().unique().tolist()
        
        # Gabungkan untuk daftar kota unik
        cities = sorted(list(set(origins + destinations)))
        
        return {"airlines": airlines, "cities": cities}
    except Exception as e:
        print(f"Error reading CSV: {e}")
        return {"airlines": [], "cities": []}