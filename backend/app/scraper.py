import os
import requests
from dotenv import load_dotenv

load_dotenv()

RAPID_API_KEY = os.getenv("RAPID_API_KEY", "").strip()
RAPID_API_HOST = os.getenv("RAPID_API_HOST", "").strip()

def extract_via_rapidapi(tiktok_url):
    print(f"DEBUG: Key yang digunakan adalah: {RAPID_API_KEY[:5]}***")

    url = f"https://{RAPID_API_HOST}/rich_response/index"

    headers = {
        "x-rapidapi-key": RAPID_API_KEY,
        "x-rapidapi-host": RAPID_API_HOST
    }

    querystring = {"url": tiktok_url.strip()}

    try:
        response = requests.get(url, headers=headers, params=querystring, timeout=20)
        
        
        if response.status_code == 200:
            res_json = response.json()
            
            data = res_json.get("data", {})
            
            # Mengambil link video tanpa watermark (biasanya di field 'play' atau 'hdplay')
            video_list = res_json.get("video", [])
            video_url = None
            if isinstance(video_list, list) and len(video_list) > 0:
                # Jika ada lebih dari satu link, link terakhir seringkali adalah CDN atau backup
                video_url = video_list[-1]

            cover_list = res_json.get("cover", [])
            thumbnail = cover_list[0] if isinstance(cover_list, list) and len(cover_list) > 0 else ""

            author_list = res_json.get("author", [])
            author_name = author_list[0] if isinstance(author_list, list) and len(author_list) > 0 else "Tiktok User"
            
            if not video_url:
                return {"success": False, "error": "Link video tidak ditemukan dalam respon API"}

            return {
                "success": True,
                "title": data.get("title", "TikTok Video"),
                "video_url": video_url,
                "thumbnail": thumbnail,
                "author": f"@{author_name}",
                "duration": "HD Quality"
            }
        else:
            return {"success": False, "error": f"API Error {response.status_code}"}
            
    except Exception as e:
        return {"success": False, "error": str(e)}