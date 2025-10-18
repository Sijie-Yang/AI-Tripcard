# 🇸🇬 SG TripCard - Your Personal Singapore Discovery Companion

> Celebrating 60 years of Singapore with an AI-powered interactive map for discovering 60 iconic locations

<img src="screenshots/SG%20TripCard%20for%20SG%2060.png" alt="SG TripCard Homepage" width="50%"/>

---

## ✨ Core Features

### 📍 **60 Curated Singapore Locations**
From Marina Bay Sands to hidden hawker centers - explore the best of Singapore across 6 categories and 6 emotional themes.

### 🏷️ **3 Smart Status Markers**
- ✅ **Visited** - Places you've already explored
- ⭐ **To Visit** - Your wishlist destinations
- ○ **No Visit** - Not on your radar yet

<img src="screenshots/Place%20Overview%20-%20Emotion.png" alt="Map Overview with Markers" width="50%"/>

<img src="screenshots/Place%20Visit%20Status%20Markers.png" alt="Visit Status Markers" width="50%"/>

*Track your journey with intuitive status markers*

---

## 🚀 5 Powerful Features

### 1️⃣ **Interactive Card Swiping**
Swipe through 60 beautifully designed cards in two modes:
- **🏠 Local Mode**: Track places you've visited
- **✈️ Tourist Mode**: Discover places you'd like to visit

Swipe right ➡️ for interested/visited, left ⬅️ for not interested/unvisited

<img src="screenshots/Tourist%20Mode%20-%20Card%20-%20Marina%20Bay%20Sands.png" alt="Card Swiping Interface" width="50%"/>

**More Card Examples:**

<table>
<tr>
<td width="33%"><img src="screenshots/Tourist%20Mode%20-%20Card%20-%20Gardens%20by%20the%20Bay.png" alt="Gardens by the Bay"/></td>
<td width="33%"><img src="screenshots/Tourist%20Mode%20-%20Card%20-%20Changi%20Airport.png" alt="Changi Airport"/></td>
<td width="33%"><img src="screenshots/Review%20card-Chinatown.png" alt="Chinatown"/></td>
</tr>
</table>

### 2️⃣ **Dual Classification System**
Toggle between two intelligent filtering modes:
- **🎨 Emotion Tags**: Vibrant, Romantic, Adventurous, Creative, Nostalgic, Calm
- **🗂️ Category Tags**: Urban Iconic, Arts & Culture, Heritage, Nature, Social Vibe, Hidden Gems

<img src="screenshots/Place%20Emotion.png" alt="Emotion and Category Classification" width="50%"/>

<img src="screenshots/Place%20Category%20-%20Nature.png" alt="Category Filter - Nature" width="50%"/>

*Filter locations by category to find exactly what you're looking for*

### 3️⃣ **AI-Powered Chat Assistant**
Smart LLM chatbot that helps you:
- 🗺️ **Plan Routes**: Multi-stop itineraries with real-time travel times (car/bus/bike/walk)
- 💬 **Get Recommendations**: Context-aware suggestions based on your preferences
- 📍 **Update Markers**: Modify visit status directly through conversation
- 📊 **Trip Summary**: Analyze your journey with visual statistics

<img src="screenshots/AI%20Route%20Planner-Route.png" alt="AI Route Planning" width="50%"/>

**Additional AI Features:**

<img src="screenshots/POI%20Chat%20Recommendation.png" alt="AI Chat Recommendations" width="50%"/>

*AI provides personalized recommendations based on your preferences*

<img src="screenshots/AI%20Route%20Planner-Travel%20Time-List.png" alt="Travel Time Analysis" width="50%"/>

*Detailed travel times for different transportation modes*

### 4️⃣ **Review Mode**
Quickly browse all 60 locations:
- Navigate with arrow keys or swipe gestures
- View each location with map highlight
- No status changes - pure exploration

<img src="screenshots/Review%20Card-Merlion%20Park.png" alt="Review Mode" width="50%"/>

### 5️⃣ **Card Collection Gallery**
Visual grid of all 60 locations:
- Complete images without cropping
- Click any card to jump to map location
- Perfect for overview and quick access

<img src="screenshots/Card%20collection.png" alt="Card Collection Gallery" width="50%"/>

---

## 🛠️ Tech Stack

- **Frontend**: Vanilla JavaScript (no frameworks)
- **Mapping**: Leaflet.js + Leaflet Routing Machine
- **AI**: OpenAI GPT-4o-mini
- **Routing**: OSRM for real-time road routes
- **Charts**: Chart.js for analytics
- **Storage**: Browser LocalStorage

<img src="screenshots/Change%20Map%20Style-Darkmode.png" alt="Control Buttons and Map Styles" width="50%"/>

---

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/Sijie-Yang/AI-Tripcard.git
cd AI-Tripcard

# Start local server
python3 -m http.server 8000

# Open in browser
open http://localhost:8000
```

**Setup OpenAI API** (optional, for AI features):
1. Click 🛠️ Tools → Route Planner
2. Enter your OpenAI API key
3. Start chatting and planning routes!

---

## 🎮 How to Use

1. **First Visit**: Interactive intro explains swipe gestures and status markers
2. **Choose Mode**: Select Local (resident) or Tourist (explorer) mode
3. **Swipe Cards**: Go through 60 locations, swiping based on your interest
4. **Explore Map**: Pan, zoom, and click markers for details
5. **Use AI**: Chat for recommendations, plan routes, get insights
6. **Review & Reset**: Use control buttons to review or start over

<img src="screenshots/Local%20-%20Tourist%20-%20Mode%20-%20Choice.png" alt="Mode Selection - Local vs Tourist" width="50%"/>

<img src="screenshots/My%20Journey%20Summary.png" alt="Journey Progress and Statistics" width="50%"/>

---

## 📊 Data Highlights

- **60** carefully selected Singapore locations
- **6** category classifications
- **6** emotional themes
- **3** status markers
- **Real-time** route calculations
- **Offline-first** design

---

## 🌟 What Makes It Special

✨ **Dual Interaction**: Swipe cards OR explore map - your choice  
🤖 **AI Integration**: Natural language route planning and recommendations  
🎨 **Visual Design**: Emotion-based coloring for intuitive discovery  
📱 **Mobile Optimized**: Smooth touch gestures and responsive layout  
💾 **No Backend**: Everything runs in your browser  
🚀 **Fast & Lightweight**: Pure vanilla JavaScript, no heavy frameworks

---

## 🏆 Perfect For

- 🎒 **Tourists** planning their Singapore itinerary
- 🏠 **Locals** discovering hidden gems in their own city
- 📸 **Travel Enthusiasts** collecting visited locations
- 🗺️ **Route Planners** optimizing multi-stop journeys
- 🎓 **Students** learning about Singapore's diverse attractions

---

## 📝 License

MIT License - Feel free to explore, modify, and share!

---

## 🙏 Acknowledgments

Celebrating **SG60** - 60 years of Singapore 🇸🇬

Built with ❤️ for hackathon

---

**🎊 Start Your Singapore Adventure Today!**

<img src="screenshots/Swipe%20Card%20Guidance.png" alt="Swipe Card Guidance" width="50%"/>
