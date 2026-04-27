from fastapi import FastAPI, Depends, HTTPException, status, UploadFile, File
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import os
import shutil
from datetime import timedelta
import json
import pandas as pd

import models
import database
import auth

# Initialize DB
models.Base.metadata.create_all(bind=database.engine)

app = FastAPI(title="InsightAI API")

# Configure CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"], # Vite default port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

os.makedirs("uploads", exist_ok=True)

@app.post("/auth/register")
def register(user_data: dict, db: Session = Depends(database.get_db)):
    email = user_data.get("email")
    password = user_data.get("password")
    
    if not email or not password:
        raise HTTPException(status_code=400, detail="Email and password required")
        
    db_user = db.query(models.User).filter(models.User.email == email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
        
    hashed_password = auth.get_password_hash(password)
    new_user = models.User(email=email, hashed_password=hashed_password)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return {"message": "User registered successfully", "user_id": new_user.id}

@app.post("/auth/login")
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(database.get_db)):
    user = db.query(models.User).filter(models.User.email == form_data.username).first()
    if not user or not auth.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=auth.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth.create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/users/me")
def read_users_me(current_user: models.User = Depends(auth.get_current_user)):
    return {"id": current_user.id, "email": current_user.email}

# Upload endpoint
@app.post("/upload-dataset")
async def upload_dataset(file: UploadFile = File(...), current_user: models.User = Depends(auth.get_current_user), db: Session = Depends(database.get_db)):
    file_location = f"uploads/{current_user.id}_{file.filename}"
    with open(file_location, "wb+") as file_object:
        shutil.copyfileobj(file.file, file_object)
        
    from skills import analyze_schema
    schema_info = analyze_schema(file_location)
    
    new_dataset = models.Dataset(
        name=file.filename, 
        file_path=file_location, 
        user_id=current_user.id,
        schema_info=json.dumps(schema_info) if isinstance(schema_info, dict) else "{}"
    )
    db.add(new_dataset)
    db.commit()
    db.refresh(new_dataset)
    
    return {"message": "File uploaded successfully", "dataset_id": new_dataset.id, "schema": schema_info}

# Query endpoint representing the MCP Orchestrator
@app.post("/query")
async def query_dataset(payload: dict, current_user: models.User = Depends(auth.get_current_user), db: Session = Depends(database.get_db)):
    dataset_id = payload.get("dataset_id")
    user_query = payload.get("query")
    
    if not dataset_id or not user_query:
        raise HTTPException(status_code=400, detail="dataset_id and query required")
        
    dataset = db.query(models.Dataset).filter(models.Dataset.id == dataset_id, models.Dataset.user_id == current_user.id).first()
    if not dataset:
        raise HTTPException(status_code=404, detail="Dataset not found")
        
    schema_dict = json.loads(dataset.schema_info) if dataset.schema_info else {}
    
    # 1. NL -> SQL Skill
    from skills import generate_sql, execute_query, generate_visualization_config, generate_insights, generate_prediction
    sql_query = generate_sql(user_query, schema_dict)
    
    if not sql_query:
        return {"error": "Could not generate SQL for the given query."}
        
    # 2. Query Execution Skill
    data_result = execute_query(dataset.file_path, sql_query)
    
    # 3. Visualization Skill
    chart_config = generate_visualization_config(user_query, data_result)
    
    # 4. Insight Generator Skill
    insights = generate_insights(user_query, data_result)
    
    # 5. Prediction Skill (Optional based on data)
    prediction = generate_prediction(data_result, chart_config)
    
    return {
        "query": user_query,
        "sql": sql_query,
        "data": data_result,
        "chart_config": chart_config,
        "insights": insights,
        "prediction": prediction
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
