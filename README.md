<p align="center">
  <img src="https://i.pinimg.com/1200x/ac/01/c2/ac01c256589eb1a052a73bd481bf32d9.jpg" alt="WINDBREAKER Header" width="100%"/>
</p>

<h1 align="center">✈️ WINDBREAKER.AI</h1>
<p align="center"><b>Enterprise-Grade Predictive Aviation Intelligence Platform</b></p>

<p align="center">
Machine Learning • Real-Time API • Production-Ready Architecture • Modern SaaS Interface
</p>

---

# 🧠 Executive Overview

**WINDBREAKER.AI** is a full-stack predictive analytics platform engineered to forecast flight delays using high-performance machine learning models and a scalable web architecture.

This project demonstrates the integration of:

- Production-grade AI modeling
- Asynchronous API architecture
- Secure authentication flow
- Modern SaaS frontend engineering
- Real-time inference pipelines

Designed as a portfolio-level intelligent system, WINDBREAKER.AI reflects real-world engineering practices in AI product development.

---

# 🚀 Core Capabilities

## 🔮 Predictive Delay Modeling
- XGBoost-based classification engine
- Optimized for structured aviation datasets
- Real-time probability output
- Consistent preprocessing between training & inference

## ⚡ High-Performance Backend
- FastAPI (ASGI-based)
- Asynchronous request handling
- Structured modular architecture
- Model loading via Joblib
- Scalable deployment-ready design

## 🖥 Modern SaaS Interface
- React + TypeScript (Vite)
- TailwindCSS utility-first styling
- GSAP-powered motion system
- Clean authentication UX flow
- Dashboard-driven prediction UI

## 🔐 Secure Access Control
- Token-based authentication
- OAuth2 form handling
- Protected routes with role-based logic

---

# 🏗 System Architecture
Frontend (React + TS)
↓
REST API (FastAPI)
↓
ML Inference Layer (XGBoost)
↓
Encoded Feature Pipeline


The system ensures:

- Deterministic preprocessing
- Consistent label encoding
- Efficient model loading
- Minimal inference latency

---

# 🛠 Technology Stack

## 🔹 AI & Backend
- Python 3.10+
- FastAPI
- XGBoost (XGBClassifier)
- Scikit-Learn
- Pandas
- Joblib
- Uvicorn

## 🔹 Frontend
- React 19
- TypeScript
- Vite
- Tailwind CSS
- GSAP (ScrollTrigger)
- Axios

---

# 📊 Machine Learning Methodology

### 1️⃣ Feature Engineering
Primary predictive features:

- `DepTime`
- `DepDelay`
- `CRSArrTime`
- `Origin`
- `Dest`

### 2️⃣ Encoding Strategy
Categorical variables (`Origin`, `Dest`) are transformed using persistent LabelEncoder artifacts to ensure consistency during inference.

### 3️⃣ Model Optimization
- XGBoost hyperparameter tuning
- Classification targeting arrival delay (`ARR_DELAY`)
- Optimized for accuracy & inference speed

---

# 📦 Installation & Setup

## 🐍 Backend Setup

```bash
pip install pandas scikit-learn xgboost fastapi uvicorn joblib
python api.py
