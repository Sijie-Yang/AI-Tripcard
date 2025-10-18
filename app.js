// 全局变量
let map;
let markers = [];
let poiData = [];
let currentFilter = 'all';
let currentFilterType = 'all'; // 'all', 'emotion', 'category'
let visitStatus = {}; // 存储访问状态 {poi_id: 'visited' | 'planned' | 'unvisited'}
let currentTileLayer = null;
let currentMapStyle = 'voyager';
let colorMode = 'emotion'; // 'emotion' or 'category'

// Map style configuration
const mapStyles = {
    voyager: {
        name: 'Voyager',
        url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
        attribution: '© OpenStreetMap © CARTO',
        maxZoom: 19
    },
    positron: {
        name: 'Light',
        url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
        attribution: '© OpenStreetMap © CARTO',
        maxZoom: 19
    },
    dark: {
        name: 'Dark',
        url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
        attribution: '© OpenStreetMap © CARTO',
        maxZoom: 19
    },
    osm: {
        name: 'Standard',
        url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19
    },
    satellite: {
        name: 'Satellite',
        url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        attribution: '© Esri',
        maxZoom: 19
    }
};

// Category translations
const categoryTranslations = {
    'urban_iconic': 'Urban Iconic',
    'creative_scene': 'Arts & Culture',
    'cultural_heritage': 'Heritage',
    'serene_nature': 'Nature',
    'social_vibe': 'Social Vibe',
    'hidden_gems': 'Hidden Gems'
};

// Emotion tag translations
const emotionTranslations = {
    'vibrant': 'Vibrant',
    'romantic': 'Romantic',
    'adventurous': 'Adventure',
    'creative': 'Creative',
    'nostalgic': 'Nostalgic',
    'calm': 'Calm'
};

// Category colors are now stored in each POI's category_color field

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

// Get filtered data based on current filter
function getFilteredData() {
    if (currentFilterType === 'all') {
        return poiData;
    } else if (currentFilterType === 'emotion') {
        return poiData.filter(poi => poi.emotion_tag === currentFilter);
    } else if (currentFilterType === 'category') {
        return poiData.filter(poi => poi.category_tag === currentFilter);
    }
    return poiData;
}

// 设置POI访问状态
function setVisitStatus(poiId, status) {
    visitStatus[poiId] = status;
    saveVisitStatus();
    
    // 更新统计数据
    if (typeof updateStats === 'function') {
        updateStats();
    }
    
    // 重新渲染地图
    const filteredData = getFilteredData();
    displayMarkers(filteredData);
}

// 获取POI访问状态
function getVisitStatus(poiId) {
    return visitStatus[poiId] || 'unvisited';
}

// 初始化地图
function initMap() {
    // 加载保存的地图样式
    const savedStyle = localStorage.getItem('map_style');
    if (savedStyle && mapStyles[savedStyle]) {
        currentMapStyle = savedStyle;
    }

    // 创建地图实例，中心设在新加坡
    map = L.map('map', {
        center: [1.3521, 103.8198],
        zoom: 14,  // 街区级别，能清晰看到景点
        zoomControl: true,
        attributionControl: true
    });

    // 添加初始图层
    setMapStyle(currentMapStyle, false);
}

// 切换地图样式
function setMapStyle(styleId, savePreference = true) {
    const style = mapStyles[styleId];
    if (!style) return;

    // 移除旧图层
    if (currentTileLayer) {
        map.removeLayer(currentTileLayer);
    }

    // 添加新图层
    currentTileLayer = L.tileLayer(style.url, {
        attribution: style.attribution,
        maxZoom: style.maxZoom,
        subdomains: 'abcd'
    }).addTo(map);

    currentMapStyle = styleId;

    // 保存用户选择
    if (savePreference) {
        localStorage.setItem('map_style', styleId);
    }

    // 更新UI
    updateStyleMenuUI();
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
    let iconSize, iconAnchor, popupAnchor;
    
    if (status === 'visited') {
        // X形 - 使用SVG绘制完整的X
        html = `<svg class="marker-svg" viewBox="0 0 40 40" width="40" height="40">
                    <path d="M 10,10 L 30,30 M 30,10 L 10,30" 
                          stroke="${color}" 
                          stroke-width="7" 
                          stroke-linecap="round"
                          fill="none"
                          style="filter: drop-shadow(0 3px 8px rgba(0,0,0,0.4))"/>
                </svg>`;
        iconSize = [40, 40];
        iconAnchor = [20, 20];
        popupAnchor = [0, -20];
    } else if (status === 'planned') {
        // 加号形 - 使用SVG绘制完整的+
        html = `<svg class="marker-svg" viewBox="0 0 40 40" width="40" height="40">
                    <path d="M 20,8 L 20,32 M 8,20 L 32,20" 
                          stroke="${color}" 
                          stroke-width="7" 
                          stroke-linecap="round"
                          fill="none"
                          style="filter: drop-shadow(0 3px 8px rgba(0,0,0,0.4))"/>
                </svg>`;
        iconSize = [40, 40];
        iconAnchor = [20, 20];
        popupAnchor = [0, -20];
    } else {
        // 圆形 - 小点
        html = `<div class="custom-marker" style="background-color: ${color}"></div>`;
        iconSize = [16, 16];
        iconAnchor = [8, 8];
        popupAnchor = [0, -8];
    }
    
    return L.divIcon({
        className: 'custom-div-icon',
        html: html,
        iconSize: iconSize,
        iconAnchor: iconAnchor,
        popupAnchor: popupAnchor
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
        // Choose color based on current color mode
        const color = colorMode === 'emotion' ? poi.emotion_color : poi.category_color;
        const icon = createCustomIcon(color, status);
        
        const marker = L.marker([poi.lat, poi.lng], { icon: icon });
        
        // 点击marker时直接显示详情面板
        marker.on('click', () => {
            showDetail(poi.id);
        });

        markers.push({ marker, poi });
        marker.addTo(map);
    });

    // 调整地图视野以包含所有markers，但限制最小缩放级别
    if (data.length > 0) {
        const group = new L.featureGroup(data.map(poi => L.marker([poi.lat, poi.lng])));
        map.fitBounds(group.getBounds().pad(0.1), {
            maxZoom: 13  // 限制最大缩放，不会拉得太远
        });
    }
}

// 显示详情页面
function showDetail(poiId) {
    const poi = poiData.find(p => p.id === poiId);
    if (!poi) return;

    document.getElementById('poiName').textContent = poi.name;
    document.getElementById('poiCategory').textContent = categoryTranslations[poi.category_tag] || poi.category_tag;
    
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
// Removed old filterPOIs function - now handled by initCategoryCards

// 更新样式菜单UI
function updateStyleMenuUI() {
    document.querySelectorAll('.style-option').forEach(option => {
        if (option.dataset.style === currentMapStyle) {
            option.classList.add('active');
        } else {
            option.classList.remove('active');
        }
    });
}

// 初始化事件监听
function initEventListeners() {
    // 关闭详情按钮
    document.getElementById('closeDetail').addEventListener('click', closeDetail);

    // 点击详情面板背景关闭
    document.getElementById('poiDetail').addEventListener('click', (e) => {
        if (e.target.id === 'poiDetail') {
            closeDetail();
        }
    });

    // 地图样式切换
    const styleToggleBtn = document.getElementById('styleToggleBtn');
    const styleMenu = document.getElementById('styleMenu');
    
    styleToggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        styleMenu.classList.toggle('active');
    });

    // 点击样式选项
    document.querySelectorAll('.style-option').forEach(option => {
        option.addEventListener('click', () => {
            const styleId = option.dataset.style;
            setMapStyle(styleId);
            styleMenu.classList.remove('active');
        });
    });

    // 点击页面其他地方关闭菜单
    document.addEventListener('click', () => {
        styleMenu.classList.remove('active');
    });

    // 防止点击菜单本身时关闭
    styleMenu.addEventListener('click', (e) => {
        e.stopPropagation();
    });

    // 初始化UI
    updateStyleMenuUI();
}

// Update statistics
function updateStats() {
    if (!poiData || poiData.length === 0) return;
    
    const total = poiData.length;
    let visitedCount = 0;
    let plannedCount = 0;
    
    Object.values(visitStatus).forEach(status => {
        if (status === 'visited') visitedCount++;
        if (status === 'planned') plannedCount++;
    });
    
    const progress = total > 0 ? Math.round((visitedCount / total) * 100) : 0;
    
    const visitedCountEl = document.getElementById('visitedCount');
    const plannedCountEl = document.getElementById('plannedCount');
    const progressPercentEl = document.getElementById('progressPercent');
    const visitedBarEl = document.getElementById('visitedBar');
    const plannedBarEl = document.getElementById('plannedBar');
    
    if (visitedCountEl) visitedCountEl.textContent = visitedCount;
    if (plannedCountEl) plannedCountEl.textContent = plannedCount;
    if (progressPercentEl) progressPercentEl.textContent = progress + '%';
    if (visitedBarEl) visitedBarEl.style.width = (visitedCount / total * 100) + '%';
    if (plannedBarEl) plannedBarEl.style.width = (plannedCount / total * 100) + '%';
}

// Search functionality
function initSearch() {
    const searchInput = document.getElementById('searchInput');
    const searchResults = document.getElementById('searchResults');
    
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        
        if (query.length === 0) {
            searchResults.classList.remove('active');
            return;
        }
        
        const results = poiData.filter(poi => 
            poi.name.toLowerCase().includes(query) ||
            poi.description.toLowerCase().includes(query)
        ).slice(0, 5);
        
        if (results.length > 0) {
            searchResults.innerHTML = results.map(poi => `
                <div class="search-result-item" data-poi-id="${poi.id}">
                    <div class="search-result-name">${poi.name}</div>
                    <div class="search-result-category">${categoryTranslations[poi.category_tag] || poi.category_tag}</div>
                </div>
            `).join('');
            searchResults.classList.add('active');
            
            // Add click handlers
            document.querySelectorAll('.search-result-item').forEach(item => {
                item.addEventListener('click', () => {
                    const poiId = item.dataset.poiId;
                    const poi = poiData.find(p => p.id === poiId);
                    if (poi) {
                        map.setView([poi.lat, poi.lng], 16);
                        showDetail(poiId);
                        searchInput.value = '';
                        searchResults.classList.remove('active');
                    }
                });
            });
        } else {
            searchResults.innerHTML = '<div class="search-result-item">No results found</div>';
            searchResults.classList.add('active');
        }
    });
    
    // Close search results when clicking outside
    document.addEventListener('click', (e) => {
        if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
            searchResults.classList.remove('active');
        }
    });
}

// Recenter button
function initRecenterButton() {
    document.getElementById('recenterBtn').addEventListener('click', () => {
        map.setView([1.3521, 103.8198], 14, {
            animate: true,
            duration: 1
        });
    });
}

// Hide loading screen
function hideLoadingScreen() {
    setTimeout(() => {
        document.getElementById('loadingScreen').classList.add('hidden');
    }, 1500);
}

// setVisitStatus and getFilteredData are defined earlier in the file

// Color mode slider functionality
function initColorBarToggle() {
    const sliderOptions = document.querySelectorAll('.slider-option');
    const sliderIndicator = document.getElementById('sliderIndicator');
    
    sliderOptions.forEach(option => {
        option.addEventListener('click', () => {
            const mode = option.dataset.mode;
            
            // Update active state
            sliderOptions.forEach(opt => opt.classList.remove('active'));
            option.classList.add('active');
            
            // Move indicator
            if (mode === 'category') {
                sliderIndicator.classList.add('category-mode');
                colorMode = 'category';
            } else {
                sliderIndicator.classList.remove('category-mode');
                colorMode = 'emotion';
            }
            
            // Redraw all markers with new colors
            const filteredData = getFilteredData();
            displayMarkers(filteredData);
        });
    });
    
    // Initialize with emotion mode active
    document.querySelector('[data-mode="emotion"]').classList.add('active');
}

// Emotion card click handlers
function initEmotionCards() {
    const emotionCards = document.querySelectorAll('.emotion-card');
    
    emotionCards.forEach(card => {
        card.addEventListener('click', () => {
            const emotion = card.dataset.emotion;
            
            // Remove active class from all emotion cards
            emotionCards.forEach(c => c.classList.remove('active'));
            // Remove active class from all category cards
            document.querySelectorAll('.category-card').forEach(c => c.classList.remove('active'));
            
            // Add active class to clicked card
            card.classList.add('active');
            
            // Filter by emotion
            currentFilter = emotion;
            currentFilterType = 'emotion';
            const filtered = poiData.filter(poi => poi.emotion_tag === emotion);
            displayMarkers(filtered);
        });
    });
}

// Category card click handlers
function initCategoryCards() {
    const categoryCards = document.querySelectorAll('.category-card');
    
    categoryCards.forEach(card => {
        card.addEventListener('click', () => {
            const category = card.dataset.category;
            
            // Remove active class from all category cards
            categoryCards.forEach(c => c.classList.remove('active'));
            // Remove active class from all emotion cards
            document.querySelectorAll('.emotion-card').forEach(c => c.classList.remove('active'));
            
            // Add active class to clicked card
            card.classList.add('active');
            
            // Filter by category
            if (category === 'all') {
                currentFilter = 'all';
                currentFilterType = 'all';
                displayMarkers(poiData);
            } else {
                currentFilter = category;
                currentFilterType = 'category';
                const filtered = poiData.filter(poi => poi.category_tag === category);
                displayMarkers(filtered);
            }
        });
    });
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    loadVisitStatus();
    initMap();
    loadPOIData().then(() => {
        updateStats();
        hideLoadingScreen();
    });
    initEventListeners();
    initSearch();
    initRecenterButton();
    initColorBarToggle();
    initCategoryCards();
    initEmotionCards();
});

// 将showDetail函数暴露到全局作用域，以便popup可以调用
window.showDetail = showDetail;

