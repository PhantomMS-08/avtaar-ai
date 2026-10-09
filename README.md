# DigiAvtaar AI — Digital Literacy AI Avatar

An AI avatar web application featuring **Anita**, an Indian teenager AI presenter who teaches digital literacy, cyber safety, and smart online habits with **full upper-body visibility and expressive hand gestures**.

---

## 🌐 Live Access Links

The web application is running locally on your machine:
* **Local Web Link**: [http://localhost:8080](http://localhost:8080)
* **LAN / Wi-Fi Link**: [http://172.16.113.60:8080](http://172.16.113.60:8080) *(accessible from phone or other devices on your Wi-Fi)*

---

## 🎬 Generated Videos

Both videos are rendered in **1080p HD** using D-ID's Neural Presenter engine:

| Language | Script / Topic | Voice Model | Video File |
| :--- | :--- | :--- | :--- |
| **English** | Digital literacy as a superpower, password hygiene, OTP safety, verifying forwards | `en-IN-AnanyaNeural` (Indian English Youth) | [`public/videos/digital_literacy_en.mp4`](file:///c:/Users/Manu%20sharma/Desktop/avtaar/public/videos/digital_literacy_en.mp4) |
| **Hinglish** | Colloquial youth mix of Hindi & English on OTP protection & cyber hygiene | `hi-IN-SwaraNeural` (Natural Indian Hindi/Hinglish) | [`public/videos/digital_literacy_hinglish.mp4`](file:///c:/Users/Manu%20sharma/Desktop/avtaar/public/videos/digital_literacy_hinglish.mp4) |

### ✋ Upper-Body & Hand Gestures
Anita is framed from the waist up in a modern classroom setting. During key phrases (such as *"superpower"* and *"protect your passwords & OTPs"*), she naturally opens both hands outward and emphasizes her points with realistic kinematic motion.

---

## 💻 Features on the Website

1. **Dual Language Switcher**: Instantly toggle between English and Hinglish with a floating animated pill.
2. **HD Custom Video Player**:
   - Play/Pause overlay & keyboard controls
   - Scrubbable timeline with hover handle
   - Playback speed control (0.75x, 1.0x, 1.25x, 1.5x)
   - Cinema / Theatre mode & Fullscreen mode
   - Live speech waveform visualizer synced to video state
   - Direct MP4 download buttons
3. **Synchronized Teleprompter**: Highlights spoken sentences in real-time as the video plays.
4. **Interactive Cyber Literacy Quiz**: A 3-question challenge for students with immediate explanations.
5. **Live AI Avatar Video Studio**:
   - Write any custom cyber safety script (up to 250 characters)
   - Select presenter styles and language voices
   - Generate new AI videos on-demand using your connected D-ID API credentials
   - Real-time progress bar and automatic video preview
6. **Live Credit Monitor**: Automatically tracks remaining D-ID credits.

---

## 🚀 Running the Server Manually

To start or restart the server in PowerShell:
```powershell
python server.py
```
Open [http://localhost:8080](http://localhost:8080) in your web browser.
