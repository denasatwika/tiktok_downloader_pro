from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from .scraper import extract_via_rapidapi
from pydantic import BaseModel
import requests
import io

app = FastAPI()

# Konfigurasi CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_methods=["*"],
    allow_headers=["*"],
)

class VideoRequest(BaseModel):
    url: str

@app.get("/")
def home():
    return {"message": "TikTok Downloader Proxy API is active!"}

@app.post("/api/download")
async def download_video(request: VideoRequest):
    # Memanggil API RapidAPI (Stable/Rich Response)
    result = extract_via_rapidapi(request.url)
    
    if result["success"]:
        # Kita modifikasi video_url agar melewati Gateway server kita sendiri
        # Ini akan membypass Region Lock untuk video seperti Andry Hakim
        original_url = result["video_url"]
        result["proxy_url"] = f"/api/gate?url={original_url}"
        return result
        
    raise HTTPException(status_code=500, detail=result["error"])

@app.get("/api/gate")
async def gate(url: str = Query(...)):
    """
    Endpoint Proxy Gateway:
    Mengambil video dari TikTok/CDN lewat server dan mengirimkannya langsung ke user.
    """
    try:
        # Headers penyamaran agar tidak diblokir saat proses streaming
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Referer': 'https://www.tiktok.com/'
        }

        # Request ke link video asli dengan stream=True
        req = requests.get(url, headers=headers, stream=True, timeout=30)
        
        if req.status_code != 200:
            raise HTTPException(status_code=req.status_code, detail="Gagal mengambil video dari sumber")

        # Mengirimkan data sebagai file download ke browser user
        return StreamingResponse(
            req.iter_content(chunk_size=1024*1024), # Stream per 1MB agar hemat RAM server
            media_type="video/mp4",
            headers={
                "Content-Disposition": "attachment; filename=tiktok_video_no_watermark.mp4",
                "Cache-Control": "no-cache"
            }
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Cara menjalankan: uvicorn app.main:app --reload