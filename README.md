# 🇸🇬 新加坡旅游地图 Web App

一个适配iPhone的交互式新加坡旅游地图应用，展示60个精选景点。

## ✨ 功能特点

- 📍 **60个精选景点** - 涵盖都市地标、文化遗产、自然景观等
- 🗺️ **交互式地图** - 基于Leaflet.js和OpenStreetMap
- 🎨 **分类筛选** - 按类别快速筛选景点
- 💫 **情感标签** - 每个景点都有独特的情感色彩
- 📱 **移动端优化** - 完美适配iPhone，支持刘海屏
- 🧭 **一键导航** - 直接跳转到Google Maps导航
- 🎯 **聚合显示** - 自动聚合密集区域的标记点

## 📂 文件结构

```
AI-Tripcard/
├── index.html          # 主页面
├── styles.css          # 样式文件
├── app.js             # JavaScript逻辑
├── poi_sg_60.json     # 景点数据
└── README.md          # 说明文档
```

## 🚀 使用方法

### 方法一：本地运行（推荐）

1. 确保所有文件在同一目录下
2. 使用本地服务器运行（避免CORS问题）：

```bash
# Python 3
python -m http.server 8000

# 或者使用 Python 2
python -m SimpleHTTPServer 8000

# 或者使用 Node.js
npx http-server -p 8000
```

3. 在浏览器中打开 `http://localhost:8000`

### 方法二：直接在iPhone上使用

1. 将项目上传到GitHub Pages或任何web服务器
2. 在iPhone Safari中打开网址
3. 点击分享按钮 → "添加到主屏幕"
4. 现在可以像原生App一样使用！

## 🎯 景点分类

- **都市地标** (Urban Iconic) - 10个景点
  - 滨海湾金沙、鱼尾狮公园、新加坡摩天轮等
  
- **艺术创意** (Creative Scene) - 10个景点
  - 国家美术馆、艺术登陆、LASALLE艺术学院等
  
- **文化遗产** (Cultural Heritage) - 10个景点
  - 牛车水、小印度、甘榜格南、各大寺庙等
  
- **自然宁静** (Serene Nature) - 10个景点
  - 植物园、麦里芝水库、武吉知马自然保护区等
  
- **社交活力** (Social Vibe) - 10个景点
  - 克拉码头、荷兰村、乌节路、圣淘沙等
  
- **隐藏宝藏** (Hidden Gems) - 10个景点
  - 拉柴岛海滩、铁路走廊、最后的甘榜等

## 💡 主要功能

### 1. 地图浏览
- 缩放、平移地图查看所有景点
- 点击标记查看景点简介
- 彩色标记代表不同情感标签

### 2. 分类筛选
- 底部滑动菜单快速切换分类
- 实时更新地图显示

### 3. 详情页面
- 查看完整景点描述
- 一键启动Google Maps导航
- 优雅的底部滑出式面板

### 4. 移动端优化
- 响应式设计，完美适配各种屏幕
- iPhone刘海屏安全区域适配
- 流畅的触摸交互体验

## 🎨 设计特色

- **现代渐变色** - 紫色系渐变主题
- **圆角设计** - 符合现代审美
- **流畅动画** - 精心设计的过渡效果
- **情感色彩** - 每个景点独特的颜色标识

## 🛠️ 技术栈

- HTML5
- CSS3 (Flexbox, Grid, 渐变)
- Vanilla JavaScript (ES6+)
- Leaflet.js 1.9.4
- Leaflet.markercluster
- OpenStreetMap

## 📱 兼容性

- ✅ iOS Safari 12+
- ✅ Chrome Mobile
- ✅ Firefox Mobile
- ✅ 支持所有现代浏览器

## 🔧 自定义

### 修改地图样式

在 `app.js` 中可以更换地图瓦片源：

```javascript
// 例如使用CartoDB地图样式
L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '© OpenStreetMap contributors © CARTO'
}).addTo(map);
```

### 添加新景点

编辑 `poi_sg_60.json`，按照现有格式添加新的POI对象。

## 📄 许可

本项目仅供学习和个人使用。

## 🙏 致谢

- 地图数据来自 OpenStreetMap
- 图标和交互设计参考了现代移动应用最佳实践

