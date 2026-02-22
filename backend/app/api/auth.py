from datetime import timedelta
from fastapi import APIRouter, HTTPException, Depends, status, Request
from fastapi.security import OAuth2PasswordRequestForm
import sqlite3

from app.db.session import get_db, log_audit
from app.core.security import get_password_hash, verify_password, create_access_token
from app.core.config import settings
from app.schemas.auth import UserRegister, ForgotPassword
from app.api.deps import get_current_user

router = APIRouter()

@router.post("/register", status_code=status.HTTP_201_CREATED)
def register(user: UserRegister, request: Request, db: sqlite3.Connection = Depends(get_db)):
    existing = db.execute("SELECT * FROM users WHERE email = ?", (user.email,)).fetchone()
    if existing:
        raise HTTPException(status_code=400, detail="Email sudah terdaftar")
    
    hashed_password = get_password_hash(user.password)
    db.execute("INSERT INTO users (name, email, password) VALUES (?, ?, ?)", 
               (user.name, user.email, hashed_password))
    db.commit()
    log_audit(db, user.email, "REGISTER_SUCCESS", request.client.host)
    return {"message": "Registrasi berhasil"}

@router.post("/login")
def login(request: Request, form_data: OAuth2PasswordRequestForm = Depends(), db: sqlite3.Connection = Depends(get_db)):
    ip = request.client.host
    user = db.execute("SELECT * FROM users WHERE email = ?", (form_data.username,)).fetchone()
    
    if not user or not verify_password(form_data.password, user["password"]):
        log_audit(db, form_data.username, "LOGIN_FAILED", ip)
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email atau password salah",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    log_audit(db, user["email"], "LOGIN_SUCCESS", ip)
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user["email"]}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer", "user_name": user["name"]}

@router.post("/forgot-password")
def forgot_password(req: ForgotPassword, request: Request, db: sqlite3.Connection = Depends(get_db)):
    db_user = db.execute("SELECT * FROM users WHERE email = ?", (req.email,)).fetchone()
    if not db_user:
        log_audit(db, req.email, "PASSWORD_RESET_FAILED_USER_NOT_FOUND", request.client.host)
        raise HTTPException(status_code=404, detail="Email tidak ditemukan")
    
    hashed_password = get_password_hash(req.new_password)
    db.execute("UPDATE users SET password = ? WHERE email = ?", (hashed_password, req.email))
    db.commit()
    log_audit(db, req.email, "PASSWORD_RESET_SUCCESS", request.client.host)
    return {"message": "Password berhasil diperbarui"}

@router.get("/me")
def read_users_me(current_user: sqlite3.Row = Depends(get_current_user)):
    return {"email": current_user["email"], "name": current_user["name"]}