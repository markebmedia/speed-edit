from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import shutil
import uuid
import os

app = FastAPI()

# Enable CORS so frontend can talk to this backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Replace with your frontend domain in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static folder so FastAPI can serve enhanced images
app.mount("/static", StaticFiles(directory="static"), name="static")

UPLOAD_FOLDER = "uploads"
ENHANCED_FOLDER = "static/enhanced"

# Ensure folders exist
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(ENHANCED_FOLDER, exist_ok=True)

@app.get("/")
def read_root():
    return {"message": "SwinIR API is running."}

@app.post("/enhance")
async def enhance_image(file: UploadFile = File(...)):
    # Save file with a unique name
    ext = os.path.splitext(file.filename)[1]
    filename = f"{uuid.uuid4().hex}{ext}"
    filepath = os.path.join(UPLOAD_FOLDER, filename)

    with open(filepath, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Copy to enhanced folder (placeholder for real enhancement)
    enhanced_path = os.path.join(ENHANCED_FOLDER, f"enhanced_{filename}")
    shutil.copy(filepath, enhanced_path)

    return {
        "enhanced_url": f"/static/enhanced/enhanced_{filename}"
    }


