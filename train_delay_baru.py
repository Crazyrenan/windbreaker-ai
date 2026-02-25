import pandas as pd
import numpy as np
import joblib
import xgboost as xgb
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import classification_report, roc_auc_score
import os

# --- KONFIGURASI PATH ---
# Menggunakan path absolut sesuai environment Anda
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_PATH = r"C:\Users\Vinny\Project\Python\flight-delay-predictor\data\raw\Flight_Delay.parquet"
MODEL_DIR = os.path.join(BASE_DIR, 'backend', 'models')

# Output Files
MODEL_PATH = os.path.join(MODEL_DIR, 'xgb_flight_delay.pkl')
ENCODER_PATH = os.path.join(MODEL_DIR, 'delay_encoders.pkl') # Ganti nama agar beda dari price

def train_delay_logic():
    print("--- [PHASE 1] Loading Dataset ---")
    
    # 0. Safety Check Folder
    if not os.path.exists(MODEL_DIR):
        os.makedirs(MODEL_DIR)
        print(f"Created directory: {MODEL_DIR}")

    # 1. Load Data (Hanya kolom yang diperlukan untuk hemat memori)
    cols = [
        'Month', 'FlightDate', 'CRSDepTime', 
        'Marketing_Airline_Network', 'OriginCityName', 'DestCityName', 
        'ArrDelayMinutes' 
    ]
    
    try:
        df = pd.read_parquet(DATA_PATH, columns=cols, engine='pyarrow')
    except Exception as e:
        print(f"CRITICAL ERROR: Gagal membaca Parquet. {str(e)}")
        return

    # 2. Cleaning: Hapus data cancelled (yang ArrDelayMinutes-nya kosong)
    initial_len = len(df)
    df = df.dropna(subset=['ArrDelayMinutes'])
    print(f"Data Cleaned: {initial_len} -> {len(df)} rows (Dropped cancelled flights)")

    # 3. Sampling (Opsional: Aktifkan jika memory penuh, Nonaktifkan untuk akurasi maksimal)
    if len(df) > 1_000_000:
        print(f"Dataset too large ({len(df)}). Sampling 500k for training...")
        df = df.sample(n=500_000, random_state=42)

    print("--- [PHASE 2] Feature Engineering ---")
    
    # Target: Delay > 15 menit
    df['is_delayed'] = (df['ArrDelayMinutes'] > 15).astype(int)
    
    # Extract Hour dari CRSDepTime (misal 1430 -> 14)
    df['DepHour'] = (df['CRSDepTime'] // 100).astype(int)
    
    # Date Processing
    df['FlightDate'] = pd.to_datetime(df['FlightDate'])
    df['DayOfWeek'] = df['FlightDate'].dt.dayofweek + 1 

    # Cyclical Features (PENTING: Rumus ini harus sama persis dengan backend/app/api/delay.py)
    df['Month_Sin'] = np.sin(2 * np.pi * df['Month'] / 12)
    df['Month_Cos'] = np.cos(2 * np.pi * df['Month'] / 12)
    df['Day_Sin'] = np.sin(2 * np.pi * df['DayOfWeek'] / 7)
    df['Day_Cos'] = np.cos(2 * np.pi * df['DayOfWeek'] / 7)

    # 4. Encoding
    print("Encoding Categories...")
    categorical_cols = ['Marketing_Airline_Network', 'OriginCityName', 'DestCityName']
    encoders = {}
    
    for col in categorical_cols:
        le = LabelEncoder()
        # Paksa ke string dan strip spasi agar bersih
        df[col] = le.fit_transform(df[col].astype(str).str.strip())
        encoders[col] = le

    # 5. Preparing Vectors
    # Urutan fitur ini WAJIB sama dengan yang ada di delay.py
    features = ['DepHour', 'Month_Sin', 'Month_Cos', 'Day_Sin', 'Day_Cos', 
                'Marketing_Airline_Network', 'OriginCityName', 'DestCityName']
    
    X = df[features]
    y = df['is_delayed']

    # Handling Class Imbalance
    neg, pos = np.bincount(y)
    scale_pos_weight = neg / pos
    print(f"Class Balance: {neg} On-Time vs {pos} Delayed (Ratio: {scale_pos_weight:.2f})")

    # 6. Training XGBoost
    print("--- [PHASE 3] Training Model ---")
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    model = xgb.XGBClassifier(
        n_estimators=300,       # Sedikit dinaikkan untuk akurasi
        learning_rate=0.05,     # Learning rate lebih kecil untuk generalisasi lebih baik
        max_depth=8, 
        scale_pos_weight=scale_pos_weight,
        eval_metric='logloss',
        use_label_encoder=False,
        n_jobs=-1
    )
    
    model.fit(X_train, y_train)

    # 7. Evaluation
    print("--- [PHASE 4] Evaluation ---")
    y_pred = model.predict(X_test)
    y_prob = model.predict_proba(X_test)[:, 1]
    
    print(classification_report(y_test, y_pred))
    print(f"ROC-AUC Score: {roc_auc_score(y_test, y_prob):.4f}")

    # 8. Saving
    print("--- [PHASE 5] Saving Artifacts ---")
    joblib.dump(model, MODEL_PATH)
    joblib.dump(encoders, ENCODER_PATH)
    print(f"Model saved to: {MODEL_PATH}")
    print(f"Encoders saved to: {ENCODER_PATH}")
    print("READY FOR BACKEND!")

if __name__ == "__main__":
    train_delay_logic()