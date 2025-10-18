// 全局变量
let map;
let markers = [];
let poiData = [];
let currentFilter = 'all';
let visitStatus = {}; // 存储访问状态 {poi_id: 'visited' | 'planned' | 'unvisited'}

// 类别翻译
const categoryTranslations = {
    'urban_iconic': '都市地标',
    'creative_scene': '艺术创意',
    'cultural_heritage': '文化遗产',
    'serene_nature': '自然宁静',
    'social_vibe': '社交活力',
    'hidden_gems': '隐藏宝藏'
};

// 情感标签翻译
const emotionTranslations = {
    'vibrant': '活力',
    'romantic': '浪漫',
    'adventurous': '冒险',
    'creative': '创意',
    'nostalgic': '怀旧',
    'calm': '平静'
};

// 加载访问状态
function loadVisitStatus() {
    const saved = localStorage.getItem('poi_visit_status');
    if (saved) {
        visitStatus = JSON.parse(saved);
    }
}

// 保存访问状态
function saveVisitStatus() {
    localStorage.setItem('poi_visit_status', JSON.stringify(visitStatus));
}

// 设置POI访问状态
function setVisitStatus(poiId, status) {
    visitStatus[poiId] = status;
    saveVisitStatus();
    // 重新渲染地图
    const filteredData = currentFilter === 'all' 
        ? poiData 
        : poiData.filter(poi => poi.category === currentFilter);
    displayMarkers(filteredData);
}

// 获取POI访问状态
function getVisitStatus(poiId) {
    return visitStatus[poiId] || 'unvisited';
}

// 初始化地图
function initMap() {
    // 创建地图实例，中心设在新加坡
    map = L.map('map', {
        center: [1.3521, 103.8198],
        zoom: 12,
        zoomControl: true,
        attributionControl: true
    });

    // 添加CartoDB Voyager图层（简洁高级风格）
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '© OpenStreetMap contributors © CARTO',
        maxZoom: 19,
        subdomains: 'abcd'
    }).addTo(map);
}

// 加载POI数据
async function loadPOIData() {
    try {
        const response = await fetch('poi_sg_60.json');
        poiData = await response.json();
        
        // 更新POI计数
        document.getElementById('poiCount').textContent = poiData.length;
        
        // 显示所有markers
        displayMarkers(poiData);
    } catch (error) {
        console.error('加载POI数据失败:', error);
        alert('加载景点数据失败，请刷新页面重试');
    }
}

// 创建自定义图标
function createCustomIcon(color, status) {
    let html = '';
    
    if (status === 'visited') {
        // X形 - 使用SVG绘制完整的X
        html = `<svg class="marker-svg" viewBox="0 0 32 32" width="32" height="32">
                    <path d="M 8,8 L 24,24 M 24,8 L 8,24" 
                          stroke="${color}" 
                          stroke-width="6" 
                          stroke-linecap="round"
                          fill="none"
                          style="filter: drop-shadow(0 3px 6px rgba(0,0,0,0.3))"/>
                </svg>`;
    } else if (status === 'planned') {
        // 加号形 - 使用SVG绘制完整的+
        html = `<svg class="marker-svg" viewBox="0 0 32 32" width="32" height="32">
                    <path d="M 16,6 L 16,26 M 6,16 L 26,16" 
                          stroke="${color}" 
                          stroke-width="6" 
                          stroke-linecap="round"
                          fill="none"
                          style="filter: drop-shadow(0 3px 6px rgba(0,0,0,0.3))"/>
                </svg>`;
    } else {
        // 圆形
        html = `<div class="custom-marker" style="background-color: ${color}"></div>`;
    }
    
    return L.divIcon({
        className: 'custom-div-icon',
        html: html,
        iconSize: [35, 35],
        iconAnchor: [17, 17],
        popupAnchor: [0, -17]
    });
}

// 显示markers
function displayMarkers(data) {
    // 清除现有markers
    markers.forEach(item => {
        map.removeLayer(item.marker);
    });
    markers = [];

    data.forEach(poi => {
        const status = getVisitStatus(poi.id);
        const icon = createCustomIcon(poi.emotion_color, status);
        
        const marker = L.marker([poi.lat, poi.lng], { icon: icon });
        
        // 创建popup内容
        const popupContent = `
            <div class="popup-title">${poi.name}</div>
            <div class="popup-category">${categoryTranslations[poi.category] || poi.category}</div>
            <div class="popup-description">${poi.description}</div>
            <div class="popup-more" onclick="showDetail('${poi.id}')">查看详情 →</div>
        `;
        
        marker.bindPopup(popupContent, {
            maxWidth: 250,
            className: 'custom-popup'
        });

        // 点击marker时显示详情
        marker.on('click', () => {
            setTimeout(() => {
                // popup打开后短暂延迟，确保用户能看到popup
            }, 100);
        });

        markers.push({ marker, poi });
        marker.addTo(map);
    });

    // 调整地图视野以包含所有markers
    if (data.length > 0) {
        const group = new L.featureGroup(data.map(poi => L.marker([poi.lat, poi.lng])));
        map.fitBounds(group.getBounds().pad(0.1));
    }
}

// 显示详情页面
function showDetail(poiId) {
    const poi = poiData.find(p => p.id === poiId);
    if (!poi) return;

    document.getElementById('poiName').textContent = poi.name;
    document.getElementById('poiCategory').textContent = categoryTranslations[poi.category] || poi.category;
    
    const emotionEl = document.getElementById('poiEmotion');
    emotionEl.textContent = emotionTranslations[poi.emotion_tag] || poi.emotion_tag;
    emotionEl.style.backgroundColor = poi.emotion_color;
    
    document.getElementById('poiDescription').textContent = poi.description;

    // 更新访问状态按钮
    const currentStatus = getVisitStatus(poi.id);
    updateStatusButtons(currentStatus);
    
    // 设置状态按钮事件
    document.querySelectorAll('.status-btn').forEach(btn => {
        btn.onclick = () => {
            const status = btn.dataset.status;
            setVisitStatus(poi.id, status);
            updateStatusButtons(status);
        };
    });

    // 设置导航按钮
    const navigateBtn = document.getElementById('navigateBtn');
    navigateBtn.onclick = () => {
        // 在新标签页打开Google Maps导航
        const url = `https://www.google.com/maps/dir/?api=1&destination=${poi.lat},${poi.lng}&destination_place_id=${encodeURIComponent(poi.name)}`;
        window.open(url, '_blank');
    };

    // 显示详情面板
    document.getElementById('poiDetail').classList.add('active');
}

// 更新状态按钮样式
function updateStatusButtons(status) {
    document.querySelectorAll('.status-btn').forEach(btn => {
        if (btn.dataset.status === status) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
}

// 关闭详情页面
function closeDetail() {
    document.getElementById('poiDetail').classList.remove('active');
}

// 筛选POI
function filterPOIs(category) {
    currentFilter = category;
    
    // 更新按钮状态
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.category === category) {
            btn.classList.add('active');
        }
    });

    // 筛选数据
    let filteredData = poiData;
    if (category !== 'all') {
        filteredData = poiData.filter(poi => poi.category === category);
    }

    // 更新显示
    displayMarkers(filteredData);
}

// 初始化事件监听
function initEventListeners() {
    // 筛选按钮
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            filterPOIs(btn.dataset.category);
        });
    });

    // 关闭详情按钮
    document.getElementById('closeDetail').addEventListener('click', closeDetail);

    // 点击详情面板背景关闭
    document.getElementById('poiDetail').addEventListener('click', (e) => {
        if (e.target.id === 'poiDetail') {
            closeDetail();
        }
    });
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    loadVisitStatus();
    initMap();
    loadPOIData();
    initEventListeners();
});

// 将showDetail函数暴露到全局作用域，以便popup可以调用
window.showDetail = showDetail;

