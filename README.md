# 🇸🇬 SG TripCard - Your Personal Singapore Discovery Companion

> Celebrating 60 years of Singapore with an AI-powered interactive map for discovering 60 iconic locations

**🎯 [截图1：首页loading动画，SG60 logo下降效果]**

---

## ✨ Core Features

### 📍 **60 Curated Singapore Locations**
From Marina Bay Sands to hidden hawker centers - explore the best of Singapore across 6 categories and 6 emotional themes.

### 🏷️ **3 Smart Status Markers**
- ✅ **Visited** - Places you've already explored
- ⭐ **To Visit** - Your wishlist destinations
- ○ **No Visit** - Not on your radar yet

**🎯 [截图2：地图全景，显示不同颜色的标记点和底部两个色条]**

---

## 🚀 5 Powerful Features

### 1️⃣ **Interactive Card Swiping**
Swipe through 60 beautifully designed cards in two modes:
- **🏠 Local Mode**: Track places you've visited
- **✈️ Tourist Mode**: Discover places you'd like to visit

Swipe right ➡️ for interested/visited, left ⬅️ for not interested/unvisited

**🎯 [截图3：卡片划动界面，显示透明卡片+地图背景+高亮标记]**

### 2️⃣ **Dual Classification System**
Toggle between two intelligent filtering modes:
- **🎨 Emotion Tags**: Vibrant, Romantic, Adventurous, Creative, Nostalgic, Calm
- **🗂️ Category Tags**: Urban Iconic, Arts & Culture, Heritage, Nature, Social Vibe, Hidden Gems

**🎯 [截图4：顶部emotion/category切换器特写]**

### 3️⃣ **AI-Powered Chat Assistant**
Smart LLM chatbot that helps you:
- 🗺️ **Plan Routes**: Multi-stop itineraries with real-time travel times (car/bus/bike/walk)
- 💬 **Get Recommendations**: Context-aware suggestions based on your preferences
- 📍 **Update Markers**: Modify visit status directly through conversation
- 📊 **Trip Summary**: Analyze your journey with visual statistics

**🎯 [截图5：AI聊天界面，显示路线规划+地图上的路线+旅行时间]**

### 4️⃣ **Review Mode**
Quickly browse all 60 locations:
- Navigate with arrow keys or swipe gestures
- View each location with map highlight
- No status changes - pure exploration

**🎯 [截图6：Review模式，显示卡片+灰色背景点+单个高亮点]**

### 5️⃣ **Card Collection Gallery**
Visual grid of all 60 locations:
- Complete images without cropping
- Click any card to jump to map location
- Perfect for overview and quick access

**🎯 [截图7：View All Cards网格视图，显示60张完整图片]**

---

## 🛠️ Tech Stack

- **Frontend**: Vanilla JavaScript (no frameworks)
- **Mapping**: Leaflet.js + Leaflet Routing Machine
- **AI**: OpenAI GPT-4o-mini
- **Routing**: OSRM for real-time road routes
- **Charts**: Chart.js for analytics
- **Storage**: Browser LocalStorage

**🎯 [截图8：右侧5个控制按钮（地图样式、重置中心、Reset、Review、View All）]**

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

**🎯 [截图9：模式选择界面，显示Local和Tourist两个选项]**

**🎯 [截图10：底部进度条+统计信息（Visited/To Visit/No Visit数量）]**

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

**🎯 [截图11：完成所有卡片后的祝贺界面+Collection按钮]**
