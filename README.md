# 🇸🇬 SG60 TripCard - Unified Experience

A comprehensive Singapore tourism application celebrating 60 years of Singapore, featuring dual interaction modes for exploring 60 iconic locations.

## 🎯 Two Unique Experiences

### 🗺️ **Map Explorer** (from Sijie branch)
An AI-powered interactive map experience with advanced features:

**Key Features:**
- **Interactive Map**: Leaflet-based map with custom markers colored by emotion/category
- **AI Chat Assistant**: Natural language interface for travel queries and recommendations
- **Smart Route Planner**: AI-optimized multi-stop routes with real-time travel times (car/bus/bike/walk)
- **Intelligent Recommendations**: Context-aware suggestions based on emotion and category matching
- **Journey Analytics**: Visual dashboard with emotion radar chart and visit statistics
- **Real-time Routing**: OSRM-powered actual road routes instead of straight lines
- **Status Management**: Track visited, planned, and unvisited places
- **Mini Popups**: Quick preview before opening full details
- **Highlight System**: AI automatically highlights relevant POIs during conversations
- **Dual Color Modes**: Switch between emotion-based and category-based map coloring

**Tech Stack:**
- Vanilla JavaScript
- Leaflet.js for mapping
- Leaflet Routing Machine with OSRM
- OpenAI API (GPT-4o-mini) for AI features
- Chart.js for analytics
- Local Storage for persistence

### 🎴 **Card Swiper** (from Lujia branch)
A Tinder-style card swiping experience for discovering places:

**Key Features:**
- **Dual Modes**:
  - **Local Mode** 🏠: Track places you've been to (swipe left: haven't been, swipe right: been there)
  - **Tourist Mode** ✈️: Discover places to explore (swipe left: not interested, swipe right: interested)
- **Beautiful Card Design**: Flat vector design with pastel backgrounds
- **Statistics Dashboard**: Visual charts showing your preferences
- **Toggle Views**: Switch between liked/disliked or been/haven't been
- **Export Functionality**: Save data as JSON/GeoJSON/CSV
- **Smooth Animations**: Native-feeling swipe gestures
- **Session Tracking**: Records your exploration journey

**Tech Stack:**
- Vanilla JavaScript
- Chart.js for visualizations
- Local Storage for data persistence
- Touch-optimized gestures

---

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/Sijie-Yang/AI-Tripcard.git
cd AI-Tripcard
git checkout main
```

### 2. Start Local Server
```bash
python3 -m http.server 8000
```

### 3. Open in Browser
```
http://localhost:8000
```

The home page will present you with two options - choose your preferred experience!

---

## 📁 Project Structure

```
AI-Tripcard/
├── index.html              # Unified home page (choose your experience)
├── map.html                # Map Explorer application
├── cards.html              # Card Swiper application
├── app.js                  # Map Explorer logic
├── styles.css              # Map Explorer styles
├── export.html             # Card Swiper data export
├── import.html             # Card Swiper data import
├── poi_sg_60.json          # Unified POI data (60 locations)
├── SG60.png                # SG60 anniversary logo
├── 60 images/              # 60 POI images for card swiper
├── avatar/                 # Mode selection icons
├── lib/                    # Local storage utilities
└── generated_cards/        # Card templates
```

---

## 🗂️ Data Format

The unified `poi_sg_60.json` uses the following structure:

```json
{
  "id": 1,
  "name": "Marina Bay Sands",
  "category_tag": "urban_iconic",
  "category_color": "#FF6B9D",
  "emotion_tag": "vibrant",
  "emotion_color": "#FFD700",
  "description": "...",
  "lat": 1.2834,
  "lng": 103.8607
}
```

**Key Fields:**
- `category_tag`: One of 6 categories (urban_iconic, arts_culture, heritage, nature, social_vibe, hidden_gems)
- `category_color`: Hex color for category-based coloring
- `emotion_tag`: One of 6 emotions (vibrant, romantic, adventurous, creative, nostalgic, calm)
- `emotion_color`: Hex color for emotion-based coloring

---

## 🎨 Features Comparison

| Feature | Map Explorer | Card Swiper |
|---------|-------------|-------------|
| **Interaction** | Click & explore map | Swipe cards |
| **AI Features** | ✅ Chat, Route Planning, Recommendations | ❌ |
| **Visualization** | Map with markers | Card deck |
| **Data Export** | ❌ | ✅ JSON/GeoJSON/CSV |
| **Route Planning** | ✅ Multi-stop with travel times | ❌ |
| **Statistics** | ✅ Emotion radar & analytics | ✅ Charts & toggle views |
| **Status Tracking** | ✅ Visited/Planned/Unvisited | ✅ Been/Haven't been/Interested |
| **Mobile Optimized** | ✅ Touch-friendly | ✅ Swipe gestures |

---

## 🔧 Configuration

### Map Explorer - OpenAI API Key
To use AI features (chat, route planner, recommendations):
1. Open Map Explorer
2. Click **🛠️ Tools** → **Route Planner**
3. Enter your OpenAI API key
4. Key is stored locally in your browser

### Card Swiper - No Setup Required
The Card Swiper works completely offline with no configuration needed!

---

## 🎯 Use Cases

**Map Explorer** is perfect for:
- Planning multi-stop Singapore tours
- Getting AI-powered travel recommendations
- Visualizing places by emotion or category
- Real-time route optimization
- Interactive exploration with chatbot

**Card Swiper** is perfect for:
- Quick discovery of new places
- Casual browsing of Singapore locations
- Tracking personal travel history
- Sharing preferences with friends
- Offline exploration

---

## 🌐 Browser Compatibility

- ✅ Chrome/Edge (Recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Mobile browsers

---

## 📊 Branch Structure

- **`main`**: Integrated application with both Map Explorer and Card Swiper
- **`sijie`**: Map Explorer development branch
- **`lujia`**: Card Swiper development branch

---

## 🎉 Celebrating SG60

This project celebrates 60 years of Singapore by showcasing 60 iconic locations across the island, from world-famous landmarks to hidden gems. Whether you prefer exploring on a map or swiping through cards, there's a perfect way for everyone to discover Singapore!

---

## 📝 License

MIT License - Feel free to use and modify for your own projects!

---

## 🤝 Contributors

- **Sijie Yang** - Map Explorer & Integration
- **Lujia** - Card Swiper

---

## 🔗 Links

- [GitHub Repository](https://github.com/Sijie-Yang/AI-Tripcard)
- [Report Issues](https://github.com/Sijie-Yang/AI-Tripcard/issues)

---

**Happy Exploring! 🎊**

