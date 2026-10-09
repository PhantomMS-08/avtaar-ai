import os
import sys
import json
import asyncio
import base64
import urllib.request
import urllib.error
from aiohttp import web

PORT = 8080
HOST = '0.0.0.0'
DID_API_KEY = 'Z29vZ2xlLW9hdXRoMnwxMDI2NTU5NTkxNTYxMzAwNjMxNzlAYWtfNkhMWWdaWWkzamg4aEdiNmswaFpn:6mdumsSndSAZsYM5jlsDA'
B64_AUTH = base64.b64encode(DID_API_KEY.encode()).decode()

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PUBLIC_DIR = os.path.join(BASE_DIR, 'public')
VIDEOS_DIR = os.path.join(BASE_DIR, 'videos')
VIDEOS_PUBLIC_DIR = os.path.join(PUBLIC_DIR, 'videos')

os.makedirs(VIDEOS_DIR, exist_ok=True)
os.makedirs(VIDEOS_PUBLIC_DIR, exist_ok=True)

# Helper for D-ID requests
def did_request(url, method='GET', payload=None):
    headers = {
        'Authorization': f'Basic {B64_AUTH}',
        'Accept': 'application/json'
    }
    data = None
    if payload is not None:
        headers['Content-Type'] = 'application/json'
        data = json.dumps(payload).encode('utf-8')
    
    req = urllib.request.Request(url, data=data, headers=headers, method=method)
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            content = resp.read().decode('utf-8')
            return resp.status, json.loads(content) if content else {}
    except urllib.error.HTTPError as e:
        err_body = e.read().decode('utf-8')
        try:
            return e.code, json.loads(err_body)
        except Exception:
            return e.code, {'error': err_body}
    except Exception as e:
        return 500, {'error': str(e)}

@web.middleware
async def cors_middleware(request, handler):
    if request.method == 'OPTIONS':
        resp = web.Response(status=200)
    else:
        try:
            resp = await handler(request)
        except Exception as e:
            resp = web.json_response({'error': str(e)}, status=500)
            
    resp.headers['Access-Control-Allow-Origin'] = '*'
    resp.headers['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS'
    resp.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
    return resp

async def api_credits(request):
    loop = asyncio.get_event_loop()
    status, data = await loop.run_in_executor(None, did_request, 'https://api.d-id.com/credits')
    return web.json_response(data, status=status)

async def api_videos(request):
    videos = [
        {
            'id': 'en',
            'title': 'English Edition (Indian Accent)',
            'language': 'English',
            'locale': 'en-IN',
            'voice': 'Ananya (Microsoft Neural IN)',
            'avatar': 'Anita (Student Presenter)',
            'topic': 'Digital Literacy & Cyber Safety',
            'video_url': 'videos/digital_literacy_en.mp4',
            'duration': '17s',
            'resolution': '1080x1080 (HD)',
            'script_text': "Hey everyone! In today's digital world, digital literacy is our real superpower. Always protect your passwords, never share your OTPs, and verify information before forwarding it. Stay smart, stay secure, and let's make the internet safer together!",
            'key_points': [
                'Digital literacy is a modern superpower',
                'Password & credential hygiene',
                'Zero-trust OTP rule',
                'Fact-checking forwards & news verification'
            ]
        },
        {
            'id': 'hinglish',
            'title': 'Hinglish Edition (Colloquial Youth)',
            'language': 'Hinglish',
            'locale': 'hi-IN / en-IN',
            'voice': 'Swara (Microsoft Neural IN)',
            'avatar': 'Anita (Student Presenter)',
            'topic': 'Digital Literacy & Cyber Safety',
            'video_url': 'videos/digital_literacy_hinglish.mp4',
            'duration': '19s',
            'resolution': '1080x1080 (HD)',
            'script_text': "Hey guys! आज के digital era में, digital literacy हम सबकी superpower है! अपने passwords और OTP कभी किसी से share मत कीजिए, और बिना verify किए कोई भी news forward मत करो। Stay smart, safe रहो, और cyber safe बनो!",
            'roman_script': "Hey guys! Aaj ke digital era mein, digital literacy hum sabki superpower hai! Apne passwords aur OTP kabhi kisi se share mat kijiye, aur bina verify kiye koi bhi news forward mat karo. Stay smart, safe raho, aur cyber safe bano!",
            'key_points': [
                'Digital literacy ek real superpower hai',
                'Passwords aur OTP protection',
                'Bina verification ke news forward na karein',
                'Smart & Cyber safe lifestyle'
            ]
        }
    ]
    return web.json_response({'videos': videos})

async def api_generate(request):
    try:
        body = await request.json()
    except Exception:
        return web.json_response({'error': 'Invalid JSON body'}, status=400)
    
    script_text = body.get('script', '').strip()
    if not script_text:
        return web.json_response({'error': 'Script text is required'}, status=400)
    
    language = body.get('language', 'en')
    presenter_id = body.get('presenter_id', 'v2_public_anita_pink_shirt_classroom@w0TKk10XrO')
    
    if language == 'hinglish' or language == 'hi':
        voice_id = body.get('voice_id', 'hi-IN-SwaraNeural')
    else:
        voice_id = body.get('voice_id', 'en-IN-AnanyaNeural')
    
    payload = {
        'presenter_id': presenter_id,
        'script': {
            'type': 'text',
            'provider': {
                'type': 'microsoft',
                'voice_id': voice_id
            },
            'input': script_text
        }
    }
    
    loop = asyncio.get_event_loop()
    status, data = await loop.run_in_executor(None, did_request, 'https://api.d-id.com/clips', 'POST', payload)
    return web.json_response(data, status=status)

async def api_clip_status(request):
    clip_id = request.match_info.get('clip_id')
    if not clip_id:
        return web.json_response({'error': 'clip_id required'}, status=400)
    
    loop = asyncio.get_event_loop()
    status, data = await loop.run_in_executor(None, did_request, f'https://api.d-id.com/clips/{clip_id}')
    
    if status == 200 and data.get('status') == 'done' and 'result_url' in data:
        result_url = data['result_url']
        local_filename = f'custom_{clip_id}.mp4'
        local_path1 = os.path.join(VIDEOS_DIR, local_filename)
        local_path2 = os.path.join(VIDEOS_PUBLIC_DIR, local_filename)
        
        if not os.path.exists(local_path1):
            def download_video():
                try:
                    with urllib.request.urlopen(result_url) as resp:
                        content = resp.read()
                        with open(local_path1, 'wb') as f1:
                            f1.write(content)
                        with open(local_path2, 'wb') as f2:
                            f2.write(content)
                    return True
                except Exception as e:
                    print('Download error:', e)
                    return False
            
            downloaded = await loop.run_in_executor(None, download_video)
            if downloaded:
                data['local_video_url'] = f'videos/{local_filename}'
        else:
            data['local_video_url'] = f'videos/{local_filename}'
            
    return web.json_response(data, status=status)

async def serve_index(request):
    index_path = os.path.join(BASE_DIR, 'index.html')
    if not os.path.exists(index_path):
        index_path = os.path.join(PUBLIC_DIR, 'index.html')
    return web.FileResponse(index_path)

def init_app():
    app = web.Application(middlewares=[cors_middleware])
    
    # API Routes
    app.router.add_get('/api/credits', api_credits)
    app.router.add_get('/api/videos', api_videos)
    app.router.add_post('/api/generate', api_generate)
    app.router.add_get('/api/clip-status/{clip_id}', api_clip_status)
    
    # Static Assets & Index
    app.router.add_get('/', serve_index)
    app.router.add_static('/', BASE_DIR, show_index=False, follow_symlinks=True)
    
    return app

if __name__ == '__main__':
    app = init_app()
    print(f'Starting AI Avatar Video Server on http://{HOST}:{PORT}')
    print(f'Accessible locally at: http://localhost:{PORT}')
    web.run_app(app, host=HOST, port=PORT)
