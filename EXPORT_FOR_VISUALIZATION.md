# 📊 数据导出指南 - 用于地图可视化

## 🎯 目标

将用户的划卡数据导出为适合地图可视化的格式，便于后续分析和展示。

---

## 📥 方法 1: 使用导出工具页面（推荐）⭐

### 访问导出工具
```
http://localhost:8000/export.html
```

### 功能
- ✅ 一键导出所有数据
- ✅ 按用户分组导出
- ✅ 导出热力图数据
- ✅ 导出统计汇总
- ✅ 多种格式（JSON、CSV、GeoJSON）

---

## 📥 方法 2: 在浏览器控制台导出

### 步骤 1: 打开应用并加载数据
```bash
# 启动服务器
python3 -m http.server 8000

# 访问
http://localhost:8000
```

### 步骤 2: 打开浏览器控制台
```
按 F12 > Console
```

### 步骤 3: 执行导出脚本

#### A. 导出基础数据（JSON 格式）
```javascript
// 导出所有用户的完整数据
const data = LocalDB.exportData();
const blob = new Blob([JSON.stringify(data, null, 2)], 
    { type: 'application/json' });
const url = URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = url;
a.download = 'tripcard_all_users.json';
a.click();
console.log(`✅ 已导出 ${data.recordCount} 条记录`);
```

#### B. 导出地图可视化专用格式（推荐）
```javascript
// 聚合每个景点的数据
const records = LocalDB.getAllSwipes();

// 按景点分组统计
const locationStats = {};
records.forEach(record => {
    if (!locationStats[record.image_id]) {
        locationStats[record.image_id] = {
            id: record.image_id,
            totalSwipes: 0,
            likes: 0,
            dislikes: 0,
            users: new Set()
        };
    }
    locationStats[record.image_id].totalSwipes++;
    locationStats[record.image_id].users.add(record.user_id);
    if (record.liked) {
        locationStats[record.image_id].likes++;
    } else {
        locationStats[record.image_id].dislikes++;
    }
});

// 转换为数组并计算百分比
const mapData = Object.values(locationStats).map(stat => ({
    locationId: stat.id,
    totalSwipes: stat.totalSwipes,
    likes: stat.likes,
    dislikes: stat.dislikes,
    likeRate: (stat.likes / stat.totalSwipes * 100).toFixed(2),
    uniqueUsers: stat.users.size
}));

// 导出
const blob = new Blob([JSON.stringify(mapData, null, 2)], 
    { type: 'application/json' });
const url = URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = url;
a.download = 'map_visualization_data.json';
a.click();
console.log('✅ 地图数据已导出');
```

#### C. 导出 CSV 格式（适合 Excel/Tableau）
```javascript
// 创建 CSV 数据
const records = LocalDB.getAllSwipes();
const csv = [
    // 表头
    ['User ID', 'Location ID', 'Liked', 'Timestamp', 'Date', 'Time'].join(','),
    // 数据行
    ...records.map(r => {
        const date = new Date(r.timestamp);
        return [
            r.user_id,
            r.image_id,
            r.liked ? 'Yes' : 'No',
            r.timestamp,
            date.toLocaleDateString(),
            date.toLocaleTimeString()
        ].join(',');
    })
].join('\n');

// 导出
const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
const url = URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = url;
a.download = 'tripcard_data.csv';
a.click();
console.log('✅ CSV 已导出');
```

#### D. 导出 GeoJSON 格式（适合地图工具）
```javascript
// 需要先加载景点坐标数据
fetch('poi_sg_60.json')
    .then(r => r.json())
    .then(pois => {
        const records = LocalDB.getAllSwipes();
        
        // 创建坐标映射
        const coordMap = {};
        pois.forEach(poi => {
            if (poi.coordinates) {
                coordMap[poi.id] = poi.coordinates;
            }
        });
        
        // 聚合数据
        const locationStats = {};
        records.forEach(record => {
            if (!locationStats[record.image_id]) {
                locationStats[record.image_id] = {
                    id: record.image_id,
                    likes: 0,
                    dislikes: 0,
                    total: 0
                };
            }
            locationStats[record.image_id].total++;
            if (record.liked) {
                locationStats[record.image_id].likes++;
            } else {
                locationStats[record.image_id].dislikes++;
            }
        });
        
        // 创建 GeoJSON
        const geojson = {
            type: "FeatureCollection",
            features: Object.entries(locationStats).map(([id, stats]) => {
                const coords = coordMap[id];
                if (!coords) return null;
                
                return {
                    type: "Feature",
                    geometry: {
                        type: "Point",
                        coordinates: [coords.lng, coords.lat]
                    },
                    properties: {
                        id: id,
                        name: pois.find(p => p.id === id)?.name || id,
                        totalSwipes: stats.total,
                        likes: stats.likes,
                        dislikes: stats.dislikes,
                        likeRate: (stats.likes / stats.total * 100).toFixed(2),
                        popularity: stats.total // 用于热力图
                    }
                };
            }).filter(f => f !== null)
        };
        
        // 导出
        const blob = new Blob([JSON.stringify(geojson, null, 2)], 
            { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'tripcard_geojson.json';
        a.click();
        console.log('✅ GeoJSON 已导出');
    });
```

---

## 📊 导出的数据格式说明

### 1. 基础数据格式（JSON）
```json
{
  "version": "1.0.0",
  "exportedAt": 1698765432100,
  "recordCount": 180,
  "records": [
    {
      "user_id": "user_abc123",
      "image_id": "poi_001",
      "liked": true,
      "timestamp": 1698765432100
    }
  ]
}
```

### 2. 地图可视化格式（JSON）
```json
[
  {
    "locationId": "poi_001",
    "totalSwipes": 15,
    "likes": 12,
    "dislikes": 3,
    "likeRate": "80.00",
    "uniqueUsers": 15
  }
]
```

### 3. GeoJSON 格式
```json
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [103.8651, 1.2838]
      },
      "properties": {
        "id": "poi_001",
        "name": "Marina Bay Sands",
        "totalSwipes": 15,
        "likes": 12,
        "dislikes": 3,
        "likeRate": "80.00",
        "popularity": 15
      }
    }
  ]
}
```

### 4. CSV 格式
```csv
User ID,Location ID,Liked,Timestamp,Date,Time
user_abc123,poi_001,Yes,1698765432100,2023-10-31,10:30:32
user_abc123,poi_002,No,1698765433200,2023-10-31,10:30:33
```

---

## 🗺️ 可视化工具建议

### 1. Mapbox GL JS
**适合**: 交互式 Web 地图
```javascript
// 使用 GeoJSON 数据
map.addSource('tripcard-data', {
    type: 'geojson',
    data: geojsonData
});

// 添加热力图层
map.addLayer({
    id: 'tripcard-heatmap',
    type: 'heatmap',
    source: 'tripcard-data',
    paint: {
        'heatmap-weight': ['get', 'popularity'],
        'heatmap-intensity': 1,
        'heatmap-radius': 20
    }
});
```

### 2. Leaflet
**适合**: 简单的 Web 地图
```javascript
// 添加标记
geojsonData.features.forEach(feature => {
    const coords = feature.geometry.coordinates;
    const props = feature.properties;
    
    L.circleMarker([coords[1], coords[0]], {
        radius: props.likeRate / 5, // 根据喜欢率调整大小
        fillColor: props.likeRate > 70 ? '#48BB78' : '#FC8181',
        fillOpacity: 0.7
    }).bindPopup(`
        <b>${props.name}</b><br>
        喜欢率: ${props.likeRate}%<br>
        总滑动: ${props.totalSwipes}
    `).addTo(map);
});
```

### 3. D3.js
**适合**: 自定义可视化
```javascript
// 创建气泡图
const bubbles = svg.selectAll('circle')
    .data(mapData)
    .enter()
    .append('circle')
    .attr('r', d => d.totalSwipes * 2)
    .attr('fill', d => d.likeRate > 70 ? '#48BB78' : '#FC8181');
```

### 4. Tableau / Power BI
**适合**: 商业智能分析
- 导入 CSV 文件
- 如果有坐标，可以直接创建地图
- 创建仪表板和报告

### 5. Google Maps / Google Earth
**适合**: 简单展示
- 导入 GeoJSON 或 KML 格式
- 使用 My Maps 创建自定义地图

---

## 🔥 热力图数据准备

### 生成热力图专用数据
```javascript
// 在控制台执行
fetch('poi_sg_60.json')
    .then(r => r.json())
    .then(pois => {
        const records = LocalDB.getAllSwipes();
        
        // 为每个景点创建热力图数据点
        const heatmapData = [];
        
        pois.forEach(poi => {
            if (!poi.coordinates) return;
            
            const swipes = records.filter(r => r.image_id === poi.id);
            const likes = swipes.filter(r => r.liked).length;
            
            heatmapData.push({
                lat: poi.coordinates.lat,
                lng: poi.coordinates.lng,
                weight: likes, // 喜欢数作为权重
                name: poi.name,
                totalSwipes: swipes.length,
                likes: likes
            });
        });
        
        // 导出
        const blob = new Blob([JSON.stringify(heatmapData, null, 2)], 
            { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'heatmap_data.json';
        a.click();
        console.log('✅ 热力图数据已导出');
    });
```

---

## 📈 统计分析数据

### 导出汇总统计
```javascript
const records = LocalDB.getAllSwipes();
const users = [...new Set(records.map(r => r.user_id))];

const summary = {
    overview: {
        totalUsers: users.length,
        totalSwipes: records.length,
        totalLikes: records.filter(r => r.liked).length,
        totalDislikes: records.filter(r => !r.liked).length,
        averageSwipesPerUser: (records.length / users.length).toFixed(2)
    },
    byUser: users.map(userId => ({
        userId,
        ...LocalDB.getStats(userId)
    })),
    byLocation: (() => {
        const locationStats = {};
        records.forEach(r => {
            if (!locationStats[r.image_id]) {
                locationStats[r.image_id] = { likes: 0, dislikes: 0 };
            }
            if (r.liked) {
                locationStats[r.image_id].likes++;
            } else {
                locationStats[r.image_id].dislikes++;
            }
        });
        return Object.entries(locationStats)
            .map(([id, stats]) => ({
                locationId: id,
                likes: stats.likes,
                dislikes: stats.dislikes,
                total: stats.likes + stats.dislikes,
                likeRate: ((stats.likes / (stats.likes + stats.dislikes)) * 100).toFixed(2)
            }))
            .sort((a, b) => b.likeRate - a.likeRate);
    })(),
    topLocations: (() => {
        const locationStats = {};
        records.forEach(r => {
            if (!locationStats[r.image_id]) {
                locationStats[r.image_id] = 0;
            }
            if (r.liked) locationStats[r.image_id]++;
        });
        return Object.entries(locationStats)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10)
            .map(([id, likes]) => ({ locationId: id, likes }));
    })()
};

// 导出
const blob = new Blob([JSON.stringify(summary, null, 2)], 
    { type: 'application/json' });
const url = URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = url;
a.download = 'statistics_summary.json';
a.click();
console.log('✅ 统计汇总已导出');
```

---

## 🛠️ 创建导出工具页面

我将为您创建一个专门的导出工具页面 `export.html`，包含：
- ✅ 一键导出各种格式
- ✅ 可视化预览
- ✅ 数据验证
- ✅ 下载管理

---

## 📝 数据处理流程建议

### 阶段 1: 数据收集
```
用户使用应用 → 数据存储在 LocalStorage
```

### 阶段 2: 数据导出
```
使用本指南的方法 → 导出 JSON/CSV/GeoJSON
```

### 阶段 3: 数据处理（Python 示例）
```python
import json
import pandas as pd

# 读取导出的 JSON
with open('tripcard_all_users.json', 'r') as f:
    data = json.load(f)

# 转换为 DataFrame
df = pd.DataFrame(data['records'])

# 分析
print(df.groupby('image_id')['liked'].agg(['count', 'sum', 'mean']))

# 导出为其他格式
df.to_csv('processed_data.csv', index=False)
```

### 阶段 4: 地图可视化
```
使用 Mapbox/Leaflet 等工具创建交互式地图
```

---

## 🎯 快速开始

### 最简单的方式
```javascript
// 1. 访问应用
http://localhost:8000

// 2. 按 F12 打开控制台

// 3. 执行一键导出
LocalDB.exportToFile();

// 完成！文件已下载
```

---

## 📞 需要帮助？

- 查看 `lib/README.md` 了解完整 API
- 访问 `export.html` 使用可视化导出工具
- 查看示例代码获取灵感

---

**提示**: 建议定期导出数据备份，避免浏览器清理导致数据丢失！

