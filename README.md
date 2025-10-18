# 🎴 Tripcard - Singapore Tourism Interactive Card App

An interactive web-based card swiping application for exploring Singapore's 60 iconic locations. Perfect for both locals and tourists!

---

## 🌟 Features

### 🎯 Dual Mode System
- **Local Mode** 🏠: Track places you've been to
  - Left swipe ← : Haven't been there
  - Right swipe → : Been there
  
- **Tourist Mode** ✈️: Discover places you want to explore
  - Left swipe ← : Not interested
  - Right swipe → : Interested

### 🎨 Modern UI Design
- Beautiful flat vector design
- Rounded cards with pastel backgrounds
- Smooth animations and transitions
- Fully responsive (mobile & desktop)
- Custom icons for mode selection

### 📊 Interactive Summary Page
- Visual statistics with charts (Chart.js)
- **Toggle View Feature** 🔄
  - Switch between liked/disliked results
  - View been/haven't been places
  - Dynamic button and title updates
- Image gallery (3 per row)
- Export data functionality

### 💾 Local Storage System
- All swipe data saved in browser
- Session tracking
- Export to JSON/GeoJSON/CSV
- No server required for basic usage

---

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/Sijie-Yang/AI-Tripcard.git
cd AI-Tripcard
git checkout lujia
```

### 2. Start Local Server
```bash
python3 -m http.server 8000
```

### 3. Open in Browser
```
http://localhost:8000/index.html
```

---

## 📁 Project Structure

```
Tripcard/
├── index.html              # Main application (standalone)
├── export.html             # Data export page
├── import.html             # Data import page
├── 60 images/              # 60 Singapore POI images
│   ├── poi_001.png
│   ├── poi_002.png
│   └── ...
├── avatar/                 # Mode selection icons
│   ├── local_icon.png
│   └── tourist_icon.png
├── poi_sg_01_20.json      # POI data (1-20)
├── poi_sg_21_40.json      # POI data (21-40)
├── poi_sg_41_60.json      # POI data (41-60)
├── lib/
│   ├── localdb.js         # Local storage helper functions
│   └── demo.html          # Storage demo page
└── *.md                   # Documentation files
```

---

## 🎮 How to Use

### Step 1: Choose Your Mode
<img src="docs/mode-selection.png" width="600" alt="Mode Selection">

Click on **Local** or **Tourist** icon to start.

### Step 2: Swipe Through Cards
<img src="docs/card-swiping.png" width="600" alt="Card Swiping">

- **Drag** or **Click arrows** to swipe
- **Hover** to see swipe hints
- Progress bar shows your position

### Step 3: View Results
<img src="docs/summary.png" width="600" alt="Summary Page">

- See your statistics
- **Toggle** between liked/disliked places
- Click **Explore the Map** for future features
- **Start Over** to try again

---

## 🔄 Toggle View Feature (NEW!)

### Summary Page Toggle Button

After completing all 60 cards, the summary page now includes a **toggle button** that lets you switch between viewing:

#### Local Mode
- **Default**: 📍 Places You've Been (right swipes)
- **Toggle**: ❌ Places You Haven't Been (left swipes)

#### Tourist Mode
- **Default**: ✨ Places You're Interested In (right swipes)
- **Toggle**: 💔 Places You're Not Interested In (left swipes)

### How It Works
```
┌─────────────────────────────────────────┐
│ 📍 Places You've Been  [Toggle Button]  │
│  [Image Grid - Been There]              │
└─────────────────────────────────────────┘
                    ↓ Click
┌─────────────────────────────────────────┐
│ ❌ Places You Haven't Been [Toggle]     │
│  [Image Grid - Haven't Been]            │
└─────────────────────────────────────────┘
```

**Features:**
- ✅ Unlimited toggles
- ✅ Dynamic title and button text
- ✅ Smooth transitions
- ✅ Mobile responsive
- ✅ No data loss when switching

---

## 📊 Data Management

### Export Data
```javascript
// Press 'E' on summary page to export
// Or use export.html for advanced options

Formats available:
- JSON: Full data export
- GeoJSON: Map visualization ready
- CSV: Spreadsheet compatible
- Heatmap: Coordinate data
- Stats: Summary statistics
```

### Import Data
```javascript
// Use import.html to load previous sessions
// Supports JSON format
```

### Local Storage Structure
```javascript
{
  "tripcard_sessions_v1": [
    {
      "sessionId": "session_xxx",
      "mode": "local",
      "timestamp": "2024-10-18T12:00:00.000Z",
      "results": [
        {
          "cardId": "poi_001",
          "cardName": "Marina Bay Sands",
          "isInterested": true,
          "mode": "local",
          "timestamp": "2024-10-18T12:01:00.000Z"
        }
      ]
    }
  ]
}
```

---

## 🎨 Customization

### Update POI Data
Edit the JSON files:
- `poi_sg_01_20.json`
- `poi_sg_21_40.json`
- `poi_sg_41_60.json`

Format:
```json
{
  "id": "poi_001",
  "name": "Marina Bay Sands",
  "prompt": "Description for image generation..."
}
```

### Update Images
Place images in `60 images/` folder:
- Format: `poi_XXX.png`
- Recommended size: 400x300px or 3:4 ratio
- Supports PNG/JPG

### Update Icons
Replace icons in `avatar/` folder:
- `local_icon.png`: Local mode icon
- `tourist_icon.png`: Tourist mode icon
- Recommended size: 200x200px

---

## 🛠️ Technology Stack

- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **Charts**: Chart.js
- **Storage**: Browser LocalStorage
- **Icons**: Custom PNG icons
- **Animations**: CSS transitions and transforms

---

## 📱 Browser Compatibility

| Browser | Version | Support |
|---------|---------|---------|
| Chrome | 90+ | ✅ Full |
| Safari | 14+ | ✅ Full |
| Firefox | 88+ | ✅ Full |
| Edge | 90+ | ✅ Full |
| Mobile Safari | iOS 14+ | ✅ Full |
| Chrome Mobile | Android 10+ | ✅ Full |

---

## 🐛 Known Issues

- ⚠️ Port 8000 conflict: Kill existing Python server if "Address already in use"
  ```bash
  lsof -ti:8000 | xargs kill -9
  ```

---

## 📝 Recent Updates

### Latest (October 18, 2024)
- ✅ Added toggle view feature on summary page
- ✅ Fixed summary page title bug (been/haven't been)
- ✅ Improved swipe hint positioning
- ✅ Enhanced mobile responsiveness
- ✅ Added comprehensive documentation

### Previous Updates
- ✅ Removed all backend dependencies (Supabase, Mem0, Flask)
- ✅ Pure localStorage implementation
- ✅ Added data export/import functionality
- ✅ UI redesign with modern flat vector style
- ✅ Mode selection with custom icons
- ✅ Summary page with image gallery

---

## 🗺️ Future Features (Planned)

- [ ] Map visualization integration
- [ ] Share results on social media
- [ ] Multi-language support
- [ ] Dark mode
- [ ] Offline PWA support
- [ ] Custom POI collections
- [ ] Friend comparison feature

---

## 📄 License

MIT License - Feel free to use and modify!

---

## 👥 Contributors

- **Sijie Yang** - Project Lead
- **Lujia** - Development Branch

---

## 📞 Contact

- GitHub: [@Sijie-Yang](https://github.com/Sijie-Yang)
- Repository: [AI-Tripcard](https://github.com/Sijie-Yang/AI-Tripcard)
- Branch: [lujia](https://github.com/Sijie-Yang/AI-Tripcard/tree/lujia)

---

## 🙏 Acknowledgments

- Singapore Tourism Board for inspiration
- Chart.js for visualization library
- All contributors and testers

---

**Enjoy exploring Singapore! 🇸🇬✨**

---

## Quick Links

- 📖 [EXPORT_FOR_VISUALIZATION.md](./EXPORT_FOR_VISUALIZATION.md) - Data export guide
- 📦 [CHANGES.md](./CHANGES.md) - Full changelog
- 💾 [LOCALDB_SUMMARY.md](./LOCALDB_SUMMARY.md) - Storage system docs
- 🔧 [lib/README.md](./lib/README.md) - LocalDB library docs
