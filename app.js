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
        
        // Also store marker by ID for quick lookup (for highlighting)
        window.poiMarkersById = window.poiMarkersById || {};
        window.poiMarkersById[poi.id] = marker;
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
    
    const categoryEl = document.getElementById('poiCategory');
    categoryEl.textContent = categoryTranslations[poi.category_tag] || poi.category_tag;
    categoryEl.style.backgroundColor = poi.category_color;
    
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

    // Generate recommendations for this POI
    generateRecommendations(poi);
    
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
// AI Assistant (Auto-detect Search vs Chat)
let chatHistory = [];
let highlightedPOIs = new Set();

function initAIAssistant() {
    const assistantInput = document.getElementById('assistantInput');
    const sendAssistantBtn = document.getElementById('sendAssistantBtn');
    const chatHistoryBtn = document.getElementById('chatHistoryBtn');
    const toolsBtn = document.getElementById('toolsBtn');
    const resultsPanel = document.getElementById('assistantResultsPanel');
    const searchSection = document.getElementById('searchResultsSection');
    const chatSection = document.getElementById('chatMessagesSection');
    const toolsMenu = document.getElementById('toolsMenu');
    
    // Handle input submission
    async function handleInput() {
        const query = assistantInput.value.trim();
        if (!query) return;
        
        sendAssistantBtn.disabled = true;
        
        // Try to match POI names first
        const searchResults = poiData.filter(poi => 
            poi.name.toLowerCase().includes(query.toLowerCase()) ||
            poi.description.toLowerCase().includes(query.toLowerCase())
        );
        
        // If we have search results, show them
        if (searchResults.length > 0) {
            showSearchResults(searchResults);
        } else {
            // Otherwise, use AI chat
            await handleAIChat(query);
        }
        
        assistantInput.value = '';
        sendAssistantBtn.disabled = false;
    }
    
    // Show search results
    function showSearchResults(results) {
        const resultsHTML = results.slice(0, 5).map(poi => `
            <div class="search-result-item" data-poi-id="${poi.id}">
                <div class="search-result-name">${poi.name}</div>
                <div class="search-result-category">${categoryTranslations[poi.category_tag] || poi.category_tag}</div>
            </div>
        `).join('');
        
        searchSection.innerHTML = resultsHTML;
        searchSection.classList.add('active');
        chatSection.classList.remove('active');
        resultsPanel.classList.add('active');
        
        // Add click handlers
        document.querySelectorAll('.search-result-item').forEach(item => {
            item.addEventListener('click', () => {
                const poiId = item.dataset.poiId;
                const poi = poiData.find(p => p.id === poiId);
                if (poi) {
                    map.setView([poi.lat, poi.lng], 16);
                    showDetail(poiId);
                    resultsPanel.classList.remove('active');
                }
            });
        });
    }
    
    // Handle AI chat
    async function handleAIChat(message) {
        // Add user message
        addChatMessage('user', message);
        
        // Clear old highlights for new conversation
        // AI will decide what to highlight based on the conversation
        clearHighlights();
        
        // Create assistant message bubble for typing effect
        const assistantBubble = createTypingBubble();
        
        try {
            const apiKey = localStorage.getItem('openai_api_key');
            if (!apiKey) {
                await typeMessage(assistantBubble, 'Please set your OpenAI API key in the Route Planner tool first. Click the 🛠️ button → Route Planner to set it up.');
                return;
            }
            
            // Build POI context with visit status
            const poiContext = poiData.map(poi => {
                const status = getVisitStatus(poi.id);
                const statusText = status === 'visited' ? '[VISITED]' : 
                                 status === 'planned' ? '[TO VISIT]' : 
                                 '[NOT VISITED]';
                return `${poi.name} ${statusText} (${poi.category_tag}, ${poi.emotion_tag}): ${poi.description}`;
            }).join('\n');
            
            const systemContext = `You are a helpful Singapore travel assistant. You have access to information about 60 amazing places in Singapore across 6 categories: Urban Iconic, Arts & Culture, Heritage, Nature, Social Vibe, and Hidden Gems.

Here are all 60 places with their current visit status:
${poiContext}

Help users plan their trip, answer questions about Singapore, and provide personalized travel recommendations based on these places. Keep responses concise and friendly.

IMPORTANT INSTRUCTIONS:
1. When you recommend or discuss specific places, use their EXACT names as shown above.

2. At the end of your response, add special instructions for the system:
   - To HIGHLIGHT places on map: [HIGHLIGHT: Place1 | Place2 | ...]
   - To UPDATE visit status: [STATUS: Place1=visited | Place2=planned | Place3=unvisited]
   
   ⚠️ CRITICAL: You can update MULTIPLE places to DIFFERENT statuses in ONE response!

3. Status update rules - listen carefully to user's language:
   - "I visited/went to/have been to X" → X=visited
   - "I want to visit/plan to go to X" → X=planned  
   - "I haven't been to X yet" or "Remove X" → X=unvisited

4. Example conversations showing MIXED status updates:
   
   User: "I visited Marina Bay Sands yesterday and I want to visit Gardens by the Bay next"
   Response: "Wonderful! Marina Bay Sands is amazing. I've marked it as visited and added Gardens by the Bay to your plan. [STATUS: Marina Bay Sands=visited | Gardens by the Bay=planned][HIGHLIGHT: Marina Bay Sands | Gardens by the Bay]"
   
   User: "I've been to Chinatown and Little India. I plan to visit Kampong Glam tomorrow"
   Response: "Great choices! I've updated your status for these heritage sites. [STATUS: Chinatown=visited | Little India=visited | Kampong Glam=planned][HIGHLIGHT: Chinatown | Little India | Kampong Glam]"
   
   User: "I went to Sentosa but I'm not interested in the Zoo anymore"
   Response: "Got it! I've marked Sentosa as visited and removed the Zoo from your plans. [STATUS: Sentosa=visited | Singapore Zoo=unvisited]"

5. ALWAYS update status based on what user tells you. Pay attention to each place mentioned and its specific status.

Only include places that are the main focus of your recommendation or discussion.`;
            
            chatHistory.push({ role: 'user', content: message });
            
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: 'gpt-4o-mini',
                    messages: [
                        { role: 'system', content: systemContext },
                        ...chatHistory.slice(-10) // Keep last 10 messages
                    ],
                    temperature: 0.7,
                    max_tokens: 500
                })
            });
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                console.error('API Error:', errorData);
                throw new Error(`API Error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
            }
            
            const data = await response.json();
            let reply = data.choices[0].message.content;
            
            // Extract highlight instructions from AI response
            const highlightMatch = reply.match(/\[HIGHLIGHT:(.*?)\]/);
            let poiNamesToHighlight = [];
            
            if (highlightMatch) {
                // Parse POI names from highlight instruction
                const highlightText = highlightMatch[1];
                poiNamesToHighlight = highlightText.split('|').map(name => name.trim());
                
                // Remove the highlight instruction from display text
                reply = reply.replace(/\[HIGHLIGHT:.*?\]/, '').trim();
                
                console.log('AI wants to highlight:', poiNamesToHighlight);
            }
            
            // Extract status update instructions from AI response
            const statusMatch = reply.match(/\[STATUS:(.*?)\]/);
            let statusUpdates = [];
            
            if (statusMatch) {
                // Parse status updates: "POI1=visited | POI2=planned | POI3=unvisited"
                const statusText = statusMatch[1];
                const updates = statusText.split('|').map(s => s.trim());
                
                updates.forEach(update => {
                    const [name, status] = update.split('=').map(s => s.trim());
                    if (name && status) {
                        statusUpdates.push({ name, status });
                    }
                });
                
                // Remove the status instruction from display text
                reply = reply.replace(/\[STATUS:.*?\]/, '').trim();
                
                console.log('AI wants to update status:', statusUpdates);
            }
            
            chatHistory.push({ role: 'assistant', content: reply });
            
            // Execute status updates
            if (statusUpdates.length > 0) {
                console.log('=== STATUS UPDATES ===');
                let successCount = 0;
                statusUpdates.forEach(({ name, status }) => {
                    const poi = poiData.find(p => p.name.toLowerCase() === name.toLowerCase());
                    if (poi) {
                        const oldStatus = getVisitStatus(poi.id);
                        setVisitStatus(poi.id, status);
                        console.log(`✓ ${poi.name}: ${oldStatus} → ${status}`);
                        successCount++;
                    } else {
                        console.log(`✗ Could not find POI: ${name}`);
                    }
                });
                console.log(`Updated ${successCount} out of ${statusUpdates.length} places`);
                console.log('======================');
            }
            
            // Type out the message character by character
            try {
                await typeMessage(assistantBubble, reply);
                
                // After typing, highlight the POIs that AI recommended
                if (poiNamesToHighlight.length > 0) {
                    const poiIdsToHighlight = [];
                    poiNamesToHighlight.forEach(name => {
                        const poi = poiData.find(p => p.name.toLowerCase() === name.toLowerCase());
                        if (poi) {
                            poiIdsToHighlight.push(poi.id);
                            console.log(`Found POI to highlight: ${poi.name} (${poi.id})`);
                        } else {
                            console.log(`Could not find POI: ${name}`);
                        }
                    });
                    
                    if (poiIdsToHighlight.length > 0) {
                        console.log('Highlighting POIs:', poiIdsToHighlight);
                        highlightPOIs(poiIdsToHighlight);
                    }
                }
            } catch (typeError) {
                console.error('Type message error:', typeError);
                // If typing fails, just show the text directly
                const interactiveText = makeTextInteractive(reply);
                assistantBubble.innerHTML = interactiveText;
                
                // Still try to highlight POIs from AI's instruction
                if (poiNamesToHighlight.length > 0) {
                    const poiIdsToHighlight = poiNamesToHighlight
                        .map(name => poiData.find(p => p.name.toLowerCase() === name.toLowerCase()))
                        .filter(Boolean)
                        .map(poi => poi.id);
                    
                    if (poiIdsToHighlight.length > 0) {
                        highlightPOIs(poiIdsToHighlight);
                    }
                }
            }
        } catch (error) {
            console.error('Chat error details:', error);
            
            const errorMsg = error.message.includes('API Error') 
                ? `API Error: ${error.message.split('API Error: ')[1] || 'Please check your API key in the Route Planner tool.'}`
                : 'Sorry, I encountered an error. Please check your API key in the Route Planner tool (🛠️ → Route Planner).';
            await typeMessage(assistantBubble, errorMsg).catch(e => {
                assistantBubble.textContent = errorMsg;
            });
        }
    }
    
    function addChatMessage(role, content) {
        searchSection.classList.remove('active');
        chatSection.classList.add('active');
        resultsPanel.classList.add('active');
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message ${role}`;
        
        // Make user messages interactive too
        const interactiveContent = makeTextInteractive(content);
        messageDiv.innerHTML = `<div class="message-bubble">${interactiveContent}</div>`;
        
        // Insert before the chat input box
        const chatInputBox = document.getElementById('chatInputBox');
        chatSection.insertBefore(messageDiv, chatInputBox);
        
        // Add click handlers to POI links in user message
        messageDiv.querySelectorAll('.poi-link').forEach(link => {
            link.addEventListener('click', () => {
                const poiId = link.dataset.poiId;
                const poi = poiData.find(p => p.id === poiId);
                if (poi) {
                    map.setView([poi.lat, poi.lng], 16);
                    showDetail(poiId);
                }
            });
        });
        
        chatSection.scrollTop = chatSection.scrollHeight;
        
        // Update chat history button indicator
        updateChatHistoryButton();
    }
    
    function updateChatHistoryButton() {
        if (chatHistory.length > 0) {
            chatHistoryBtn.classList.add('has-messages');
        } else {
            chatHistoryBtn.classList.remove('has-messages');
        }
    }
    
    function createTypingBubble() {
        searchSection.classList.remove('active');
        chatSection.classList.add('active');
        resultsPanel.classList.add('active');
        
        const messageDiv = document.createElement('div');
        messageDiv.className = 'chat-message assistant';
        const bubbleDiv = document.createElement('div');
        bubbleDiv.className = 'message-bubble';
        bubbleDiv.textContent = '';
        messageDiv.appendChild(bubbleDiv);
        
        // Insert before the chat input box
        const chatInputBox = document.getElementById('chatInputBox');
        chatSection.insertBefore(messageDiv, chatInputBox);
        
        return bubbleDiv;
    }
    
    async function typeMessage(bubble, text) {
        console.log('Starting typeMessage with text:', text.substring(0, 100) + '...');
        bubble.textContent = '';
        const chars = text.split('');
        
        for (let i = 0; i < chars.length; i++) {
            bubble.textContent += chars[i];
            chatSection.scrollTop = chatSection.scrollHeight;
            
            // Add small delay between characters (adjust for speed)
            await new Promise(resolve => setTimeout(resolve, 20));
        }
        
        console.log('Typing complete, making text interactive...');
        
        // After typing is complete, make text interactive and highlight POIs
        const interactiveText = makeTextInteractive(text);
        bubble.innerHTML = interactiveText;
        
        // Add click handlers to POI links
        const poiLinks = bubble.querySelectorAll('.poi-link');
        console.log('Found POI links:', poiLinks.length);
        
        poiLinks.forEach(link => {
            link.addEventListener('click', () => {
                const poiId = link.dataset.poiId;
                const poi = poiData.find(p => p.id === poiId);
                if (poi) {
                    map.setView([poi.lat, poi.lng], 16);
                    showDetail(poiId);
                }
            });
        });
        
        // Extract and highlight POIs mentioned in the response
        console.log('Extracting POIs from text...');
        const mentionedPOIs = extractPOIsFromText(text);
        console.log('Found mentioned POIs:', mentionedPOIs);
        
        if (mentionedPOIs.length > 0) {
            console.log('Highlighting POIs on map...');
            highlightPOIs(mentionedPOIs);
        } else {
            console.log('No POIs found to highlight');
        }
    }
    
    // Send button click (main input)
    sendAssistantBtn.addEventListener('click', handleInput);
    
    // Enter key press (main input)
    assistantInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleInput();
        }
    });
    
    // Chat input box handlers
    const chatInput = document.getElementById('chatInput');
    const sendChatBtn = document.getElementById('sendChatBtn');
    
    sendChatBtn.addEventListener('click', () => {
        const message = chatInput.value.trim();
        if (message) {
            handleAIChat(message);
            chatInput.value = '';
        }
    });
    
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const message = chatInput.value.trim();
            if (message) {
                handleAIChat(message);
                chatInput.value = '';
            }
        }
    });
    
    // Real-time search preview as user types
    assistantInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        
        if (query.length === 0) {
            resultsPanel.classList.remove('active');
            return;
        }
        
        // Show instant search results preview
        const results = poiData.filter(poi => 
            poi.name.toLowerCase().includes(query) ||
            poi.description.toLowerCase().includes(query)
        ).slice(0, 5);
        
        if (results.length > 0) {
            showSearchResults(results);
        }
    });
    
    // Chat history button - reopen chat panel
    chatHistoryBtn.addEventListener('click', () => {
        if (chatHistory.length > 0) {
            // Show chat section with history
            searchSection.classList.remove('active');
            chatSection.classList.add('active');
            resultsPanel.classList.add('active');
            toolsMenu.classList.remove('active');
            
            // Focus on chat input
            setTimeout(() => {
                document.getElementById('chatInput').focus();
            }, 100);
        } else {
            // No chat history, prompt user to start
            assistantInput.placeholder = "💬 Ask me anything about Singapore...";
            assistantInput.focus();
        }
    });
    
    // Toggle tools menu
    toolsBtn.addEventListener('click', () => {
        const isActive = toolsMenu.classList.toggle('active');
        if (isActive) {
            resultsPanel.classList.remove('active');
        }
    });
    
    // Tools menu handlers
    document.querySelectorAll('.tool-item').forEach(item => {
        item.addEventListener('click', () => {
            const tool = item.dataset.tool;
            toolsMenu.classList.remove('active');
            
            if (tool === 'planner') {
                const plannerPanel = document.getElementById('aiPlannerPanel');
                plannerPanel.classList.add('active');
                
                // Refresh POI checklist when opening planner
                // Find the active filter chip
                const activeChip = document.querySelector('.filter-chip.active');
                const activeFilter = activeChip ? activeChip.dataset.filter : 'planned';
                populatePOIChecklist(activeFilter);
                console.log('Refreshed POI checklist with filter:', activeFilter);
            } else if (tool === 'recommend') {
                addChatMessage('assistant', 'Please click on any place on the map to see personalized recommendations based on similar vibes and categories!');
            } else if (tool === 'insights') {
                document.getElementById('progressBarContainer').click();
            }
        });
    });
    
    // Close panels when clicking outside
    document.addEventListener('click', (e) => {
        const assistantBar = document.querySelector('.ai-assistant-bar');
        if (!assistantBar.contains(e.target)) {
            resultsPanel.classList.remove('active');
            toolsMenu.classList.remove('active');
        }
    });
    
    // Initialize button state
    updateChatHistoryButton();
}

// POI Highlighting Functions
function highlightPOIs(poiIds) {
    console.log('highlightPOIs called with IDs:', poiIds);
    const clearBtn = document.getElementById('clearHighlightBtn');
    const markerMap = window.poiMarkersById || {};
    
    console.log('Available markers:', Object.keys(markerMap).length);
    
    let successCount = 0;
    poiIds.forEach(id => {
        highlightedPOIs.add(id);
        const marker = markerMap[id];
        console.log(`Marker for ${id}:`, marker ? 'found' : 'NOT FOUND');
        
        if (marker && marker._icon) {
            marker._icon.classList.add('highlighted');
            successCount++;
            console.log(`Added highlight class to marker ${id}`);
        } else if (marker) {
            console.log(`Marker ${id} has no _icon yet`);
        }
    });
    
    console.log(`Successfully highlighted ${successCount} out of ${poiIds.length} POIs`);
    
    if (highlightedPOIs.size > 0) {
        clearBtn.classList.add('active');
        console.log('Clear button activated');
        
        // Fit map to show all highlighted POIs
        if (poiIds.length > 0) {
            const bounds = L.latLngBounds(
                poiIds.map(id => {
                    const poi = poiData.find(p => p.id === id);
                    return poi ? [poi.lat, poi.lng] : null;
                }).filter(Boolean)
            );
            console.log('Fitting map to bounds:', bounds);
            map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
        }
    }
}

function clearHighlights() {
    const clearBtn = document.getElementById('clearHighlightBtn');
    const markerMap = window.poiMarkersById || {};
    
    highlightedPOIs.forEach(id => {
        const marker = markerMap[id];
        if (marker && marker._icon) {
            marker._icon.classList.remove('highlighted');
        }
    });
    
    highlightedPOIs.clear();
    clearBtn.classList.remove('active');
    console.log('Cleared all highlights');
}

function extractPOIsFromText(text) {
    const foundPOIs = new Set();
    const textLower = text.toLowerCase();
    
    // Search for POI names in the text
    poiData.forEach(poi => {
        const poiNameLower = poi.name.toLowerCase();
        
        // Exact match (case-insensitive)
        const exactRegex = new RegExp(`\\b${poi.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
        if (exactRegex.test(text)) {
            foundPOIs.add(poi.id);
            return;
        }
        
        // Try matching significant words (for multi-word names)
        const words = poiNameLower.split(/\s+/).filter(w => w.length > 3); // Filter out short words like "the", "and"
        if (words.length > 0 && words.every(word => textLower.includes(word))) {
            foundPOIs.add(poi.id);
            return;
        }
        
        // Also check if the text contains the POI name as a substring (for partial matches)
        if (poiNameLower.length > 5 && textLower.includes(poiNameLower)) {
            foundPOIs.add(poi.id);
        }
    });
    
    console.log('Extracted POIs from text:', Array.from(foundPOIs));
    return Array.from(foundPOIs);
}

function makeTextInteractive(text) {
    let interactiveText = text;
    const replacements = [];
    
    // Find all POI mentions and prepare replacements
    poiData.forEach(poi => {
        // Try exact match with word boundaries
        const regex = new RegExp(`\\b(${poi.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})\\b`, 'gi');
        const matches = [...text.matchAll(regex)];
        
        matches.forEach(match => {
            // Check if this position hasn't been replaced already
            const overlap = replacements.some(r => 
                (match.index >= r.index && match.index < r.index + r.original.length) ||
                (match.index + match[0].length > r.index && match.index + match[0].length <= r.index + r.original.length)
            );
            
            if (!overlap) {
                replacements.push({
                    original: match[0],
                    replacement: `<span class="poi-link" data-poi-id="${poi.id}">${match[0]}</span>`,
                    index: match.index,
                    length: match[0].length,
                    poiId: poi.id
                });
            }
        });
    });
    
    // Sort by index (descending) to avoid messing up indices during replacement
    replacements.sort((a, b) => b.index - a.index);
    
    // Apply replacements
    replacements.forEach(r => {
        interactiveText = interactiveText.substring(0, r.index) + 
                         r.replacement + 
                         interactiveText.substring(r.index + r.original.length);
    });
    
    console.log('Made text interactive with POI links:', replacements.length);
    return interactiveText;
}

// Recenter button
function initRecenterButton() {
    document.getElementById('recenterBtn').addEventListener('click', () => {
        // Use a smaller zoom level to show the whole Singapore
        map.setView([1.3521, 103.8198], 10, {
            animate: true,
            duration: 1
        });
    });
}

// Clear Highlight button
function initClearHighlightButton() {
    document.getElementById('clearHighlightBtn').addEventListener('click', clearHighlights);
}

// Clear Route button
function initClearRouteButton() {
    document.getElementById('clearRouteBtn').addEventListener('click', clearRoute);
}

function clearRoute() {
    const clearBtn = document.getElementById('clearRouteBtn');
    
    // Clear routing control
    if (routingControl) {
        map.removeControl(routingControl);
        routingControl = null;
    }
    
    // Clear route polyline
    if (routePolyline) {
        map.removeLayer(routePolyline);
        routePolyline = null;
    }
    
    // Clear all route markers
    routeMarkers.forEach(marker => {
        map.removeLayer(marker);
    });
    routeMarkers = [];
    
    // Hide clear button
    if (clearBtn) {
        clearBtn.classList.remove('active');
    }
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
    console.log('🚀 Page loaded, initializing...');
    loadVisitStatus();
    initMap();
    loadPOIData().then(() => {
        updateStats();
        hideLoadingScreen();
    });
    initEventListeners();
    initAIAssistant();
    initRecenterButton();
    initClearHighlightButton();
    initClearRouteButton();
    initColorBarToggle();
    initCategoryCards();
    initEmotionCards();
    initAIPlanner();
    console.log('📊 Calling initJourneyAnalytics...');
    initJourneyAnalytics();
    console.log('✅ All initialization complete');
});

// 将showDetail函数暴露到全局作用域，以便popup可以调用
window.showDetail = showDetail;

// ==================== AI Trip Planner ====================

let currentRoute = null;
let routePolyline = null;
let routeMarkers = []; // Store route number markers
let routingControl = null; // Store routing control instance

// Initialize AI Trip Planner
function initAIPlanner() {
    const plannerPanel = document.getElementById('aiPlannerPanel');
    const closePlanner = document.getElementById('closePlanner');
    const saveKeyBtn = document.getElementById('saveKeyBtn');
    const apiKeyInput = document.getElementById('apiKeyInput');
    const generateRouteBtn = document.getElementById('generateRouteBtn');
    const showRouteOnMapBtn = document.getElementById('showRouteOnMap');
    const planNewRouteBtn = document.getElementById('planNewRoute');
    const filterChips = document.querySelectorAll('.filter-chip');
    
    if (!plannerPanel) {
        console.error('AI Planner panel not found');
        return;
    }
    
    // Check if API key exists
    const savedApiKey = localStorage.getItem('openai_api_key');
    if (savedApiKey && apiKeyInput) {
        apiKeyInput.value = savedApiKey;
        const apiKeySection = document.getElementById('apiKeySection');
        const poiSection = document.getElementById('poiSelectionSection');
        if (apiKeySection) apiKeySection.style.display = 'none';
        if (poiSection) poiSection.style.display = 'block';
        
        // Set "To Visit" chip as active by default
        filterChips.forEach(chip => {
            if (chip.dataset.filter === 'planned') {
                chip.classList.add('active');
            } else {
                chip.classList.remove('active');
            }
        });
        
        // Populate with planned POIs
        populatePOIChecklist('planned');
    }
    
    // Note: plannerBtn is now opened via tools menu, not a standalone button
    
    // Close planner
    if (closePlanner) {
        closePlanner.addEventListener('click', () => {
            plannerPanel.classList.remove('active');
        });
    }
    
    plannerPanel.addEventListener('click', (e) => {
        if (e.target === plannerPanel) {
            plannerPanel.classList.remove('active');
        }
    });
    
    // Save API key
    saveKeyBtn.addEventListener('click', () => {
        const apiKey = apiKeyInput.value.trim();
        if (apiKey) {
            localStorage.setItem('openai_api_key', apiKey);
            document.getElementById('apiKeySection').style.display = 'none';
            document.getElementById('poiSelectionSection').style.display = 'block';
            
            // Set "To Visit" chip as active
            filterChips.forEach(chip => {
                if (chip.dataset.filter === 'planned') {
                    chip.classList.add('active');
                } else {
                    chip.classList.remove('active');
                }
            });
            
            populatePOIChecklist('planned');
        } else {
            alert('Please enter a valid API key');
        }
    });
    
    // Filter chips
    filterChips.forEach(chip => {
        chip.addEventListener('click', () => {
            filterChips.forEach(c => c.classList.remove('active'));
            chip.classList.add('active');
            const filter = chip.dataset.filter;
            populatePOIChecklist(filter);
        });
    });
    
    // Generate route
    generateRouteBtn.addEventListener('click', async () => {
        const selectedPOIs = getSelectedPOIs();
        if (selectedPOIs.length < 2) {
            alert('Please select at least 2 places to plan a route');
            return;
        }
        
        // Reset travel times when starting new route generation
        resetTravelTimes();
        
        generateRouteBtn.disabled = true;
        generateRouteBtn.innerHTML = '<span class="btn-icon">⏳</span><span class="btn-text">Generating...</span>';
        
        try {
            const route = await generateOptimalRoute(selectedPOIs);
            currentRoute = route;
            displayRouteResult(route);
            document.getElementById('poiSelectionSection').style.display = 'none';
            document.getElementById('routeResult').style.display = 'block';
            
            // Calculate travel times immediately after displaying the route
            setTravelTimesCalculating();
            await calculateTravelTimes(route);
        } catch (error) {
            alert('Failed to generate route: ' + error.message);
        } finally {
            generateRouteBtn.disabled = false;
            generateRouteBtn.innerHTML = '<span class="btn-icon">✨</span><span class="btn-text">Generate Optimal Route</span>';
        }
    });
    
    // Show route on map
    showRouteOnMapBtn.addEventListener('click', () => {
        if (currentRoute) {
            drawRouteOnMap(currentRoute);
            plannerPanel.classList.remove('active');
        }
    });
    
    // Plan new route
    planNewRouteBtn.addEventListener('click', () => {
        document.getElementById('routeResult').style.display = 'none';
        document.getElementById('poiSelectionSection').style.display = 'block';
        
        // Clear selected POIs for new route
        selectedPOIIds.clear();
        
        // Reset travel times
        resetTravelTimes();
        
        // Clear routing control
        if (routingControl) {
            map.removeControl(routingControl);
            routingControl = null;
        }
        
        // Clear route polyline
        if (routePolyline) {
            map.removeLayer(routePolyline);
            routePolyline = null;
        }
        
        // Clear all route markers
        routeMarkers.forEach(marker => {
            map.removeLayer(marker);
        });
        routeMarkers = [];
        
        // Hide clear route button
        const clearBtn = document.getElementById('clearRouteBtn');
        if (clearBtn) {
            clearBtn.classList.remove('active');
        }
    });
}

// Populate POI checklist
// Store selected POI IDs across filter changes
let selectedPOIIds = new Set();

function populatePOIChecklist(filter) {
    const checklist = document.getElementById('poiChecklist');
    if (!checklist) {
        console.error('POI checklist element not found');
        return;
    }
    
    // Save currently selected POIs before re-rendering
    const currentCheckboxes = checklist.querySelectorAll('input[type="checkbox"]:checked');
    currentCheckboxes.forEach(cb => selectedPOIIds.add(cb.value));
    
    let pois = poiData;
    let emptyMessage = '';
    
    if (filter === 'planned') {
        pois = poiData.filter(poi => visitStatus[poi.id] === 'planned');
        emptyMessage = 'No places marked "To Visit" yet. Use AI chat or click places on the map to add them to your plan!';
        console.log(`Filtering for 'planned' POIs: found ${pois.length} out of ${poiData.length}`);
    } else if (filter === 'unvisited') {
        pois = poiData.filter(poi => !visitStatus[poi.id] || visitStatus[poi.id] === 'unvisited');
        emptyMessage = 'All places have been visited or planned!';
        console.log(`Filtering for 'unvisited' POIs: found ${pois.length} out of ${poiData.length}`);
    } else if (filter === 'visited') {
        pois = poiData.filter(poi => visitStatus[poi.id] === 'visited');
        emptyMessage = 'No places visited yet. Mark places as visited in AI chat or detail panel!';
        console.log(`Filtering for 'visited' POIs: found ${pois.length} out of ${poiData.length}`);
    } else {
        console.log(`Showing all POIs: ${poiData.length}`);
    }
    
    if (pois.length === 0) {
        checklist.innerHTML = `<div style="padding: 20px; text-align: center; color: #999;">${emptyMessage}</div>`;
        return;
    }
    
    // Helper function to get status badge
    function getStatusBadge(poiId) {
        const status = visitStatus[poiId];
        if (status === 'visited') {
            return '<span class="poi-status-badge visited">✓ Visited</span>';
        } else if (status === 'planned') {
            return '<span class="poi-status-badge planned">⭐ To Visit</span>';
        } else {
            return '<span class="poi-status-badge unvisited">○ Not Yet</span>';
        }
    }
    
    checklist.innerHTML = pois.map(poi => `
        <div class="poi-check-item">
            <input type="checkbox" id="poi-${poi.id}" value="${poi.id}" ${selectedPOIIds.has(poi.id.toString()) ? 'checked' : ''}>
            <label for="poi-${poi.id}" class="poi-check-label">${poi.name}</label>
            ${getStatusBadge(poi.id)}
            <span class="poi-check-category" style="background-color: ${poi.category_color}; color: white;">${categoryTranslations[poi.category_tag]}</span>
        </div>
    `).join('');
    
    // Add event listeners to track selection changes
    checklist.querySelectorAll('input[type="checkbox"]').forEach(cb => {
        cb.addEventListener('change', (e) => {
            if (e.target.checked) {
                selectedPOIIds.add(e.target.value);
            } else {
                selectedPOIIds.delete(e.target.value);
            }
        });
    });
}

// Get selected POIs
function getSelectedPOIs() {
    const checkboxes = document.querySelectorAll('.poi-checklist input[type="checkbox"]:checked');
    return Array.from(checkboxes).map(cb => {
        const poiId = cb.value;
        return poiData.find(p => p.id === poiId);
    });
}

// Generate optimal route using OpenAI
async function generateOptimalRoute(pois) {
    const apiKey = localStorage.getItem('openai_api_key');
    
    const prompt = `You are a Singapore travel expert. Given these tourist attractions, create an optimal visiting route considering:
- Geographic proximity (minimize travel distance)
- Best time to visit each place
- Logical flow (e.g., morning/afternoon/evening activities)

Attractions:
${pois.map((poi, i) => `${i + 1}. ${poi.name} (${poi.category_tag}, ${poi.emotion_tag})\n   Location: ${poi.lat}, ${poi.lng}\n   Description: ${poi.description}`).join('\n')}

Return ONLY a JSON array with the optimal order (use the same names), each with a brief reason. Format:
[
  {"name": "Attraction Name", "reason": "Best to start here because...", "time_suggestion": "Morning/Afternoon/Evening"}
]`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
                {
                    role: 'system',
                    content: 'You are a helpful Singapore travel planning assistant. Always respond with valid JSON only.'
                },
                {
                    role: 'user',
                    content: prompt
                }
            ],
            temperature: 0.7,
            max_tokens: 1500
        })
    });

    if (!response.ok) {
        throw new Error('Failed to get AI response');
    }

    const data = await response.json();
    const content = data.choices[0].message.content.trim();
    
    // Extract JSON from markdown code blocks if present
    let jsonContent = content;
    if (content.includes('```json')) {
        jsonContent = content.match(/```json\n([\s\S]*?)\n```/)[1];
    } else if (content.includes('```')) {
        jsonContent = content.match(/```\n([\s\S]*?)\n```/)[1];
    }
    
    const routeOrder = JSON.parse(jsonContent);
    
    // Match route order with actual POI objects
    const orderedPOIs = routeOrder.map(item => {
        const poi = pois.find(p => p.name === item.name);
        return {
            ...poi,
            reason: item.reason,
            time_suggestion: item.time_suggestion
        };
    });
    
    return orderedPOIs;
}

// Display route result
function displayRouteResult(route) {
    const routeInfo = document.getElementById('routeInfo');
    routeInfo.innerHTML = route.map((poi, index) => `
        <div class="route-stop">
            <div class="route-number">${index + 1}</div>
            <div class="route-stop-info">
                <div class="route-stop-name">${poi.name}</div>
                <div class="route-stop-details">
                    ${poi.time_suggestion ? `⏰ ${poi.time_suggestion}<br>` : ''}
                    💡 ${poi.reason}
                </div>
            </div>
        </div>
    `).join('');
}

// Reset travel time displays
function resetTravelTimes() {
    document.getElementById('carTime').textContent = '--';
    document.getElementById('busTime').textContent = '--';
    document.getElementById('bikeTime').textContent = '--';
    document.getElementById('walkTime').textContent = '--';
}

// Set travel times to calculating state
function setTravelTimesCalculating() {
    document.getElementById('carTime').textContent = '⏳';
    document.getElementById('busTime').textContent = '⏳';
    document.getElementById('bikeTime').textContent = '⏳';
    document.getElementById('walkTime').textContent = '⏳';
}

// Draw route on map with real roads
function drawRouteOnMap(route) {
    // Clear existing route and markers
    if (routingControl) {
        map.removeControl(routingControl);
        routingControl = null;
    }
    
    if (routePolyline) {
        map.removeLayer(routePolyline);
        routePolyline = null;
    }
    
    // Clear all old route markers
    routeMarkers.forEach(marker => {
        map.removeLayer(marker);
    });
    routeMarkers = [];
    
    // Create waypoints for routing
    const waypoints = route.map(poi => L.latLng(poi.lat, poi.lng));
    
    // Create routing control with OSRM (car routing)
    routingControl = L.Routing.control({
        waypoints: waypoints,
        router: L.Routing.osrmv1({
            serviceUrl: 'https://router.project-osrm.org/route/v1',
            profile: 'driving' // Use driving profile for car
        }),
        lineOptions: {
            styles: [{ 
                color: '#667eea', 
                opacity: 0.8, 
                weight: 4 
            }]
        },
        addWaypoints: false,
        draggableWaypoints: false,
        fitSelectedRoutes: true,
        showAlternatives: false,
        createMarker: function(i, waypoint, n) {
            // Create numbered markers
            const numberIcon = L.divIcon({
                className: 'route-marker',
                html: `<div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 600; font-size: 16px; box-shadow: 0 2px 8px rgba(0,0,0,0.3);">${i + 1}</div>`,
                iconSize: [32, 32],
                iconAnchor: [16, 16]
            });
            
            const marker = L.marker(waypoint.latLng, { 
                icon: numberIcon,
                draggable: false
            });
            routeMarkers.push(marker);
            return marker;
        }
    }).addTo(map);
    
    // Hide the default routing instructions panel
    const routingContainer = document.querySelector('.leaflet-routing-container');
    if (routingContainer) {
        routingContainer.style.display = 'none';
    }
    
    // Show clear route button
    const clearBtn = document.getElementById('clearRouteBtn');
    if (clearBtn) {
        clearBtn.classList.add('active');
    }
}

// Calculate travel times for different transportation modes
async function calculateTravelTimes(route) {
    const waypoints = route.map(poi => `${poi.lng},${poi.lat}`).join(';');
    
    try {
        // Get car route (driving) - this gives us the actual road distance
        const carResponse = await fetch(`https://router.project-osrm.org/route/v1/driving/${waypoints}?overview=false`);
        const carData = await carResponse.json();
        
        if (carData.routes && carData.routes[0]) {
            const distanceKm = carData.routes[0].distance / 1000; // Convert meters to km
            const carDurationMin = carData.routes[0].duration / 60; // Convert seconds to minutes
            
            // Car: Use actual OSRM duration
            const carMinutes = Math.round(carDurationMin);
            document.getElementById('carTime').textContent = formatTime(carMinutes);
            
            // Bus: Average speed ~25 km/h in Singapore (slower than car due to stops)
            // Also add 5 minutes per stop (estimate 1 stop per 2km)
            const busStops = Math.floor(distanceKm / 2);
            const busTravelTime = (distanceKm / 25) * 60; // Time at 25 km/h
            const busWaitTime = busStops * 5; // 5 min per stop
            const busMinutes = Math.round(busTravelTime + busWaitTime);
            document.getElementById('busTime').textContent = formatTime(busMinutes);
            
            // Bike: Average cycling speed ~15 km/h in Singapore
            const bikeMinutes = Math.round((distanceKm / 15) * 60);
            document.getElementById('bikeTime').textContent = formatTime(bikeMinutes);
            
            // Walk: Average walking speed ~5 km/h
            const walkMinutes = Math.round((distanceKm / 5) * 60);
            document.getElementById('walkTime').textContent = formatTime(walkMinutes);
            
            console.log(`Route distance: ${distanceKm.toFixed(2)}km`);
            console.log(`Travel times - Car: ${carMinutes}min, Bus: ${busMinutes}min, Bike: ${bikeMinutes}min, Walk: ${walkMinutes}min`);
        }
    } catch (error) {
        console.error('Error fetching travel times:', error);
        document.getElementById('carTime').textContent = 'N/A';
        document.getElementById('busTime').textContent = 'N/A';
        document.getElementById('bikeTime').textContent = 'N/A';
        document.getElementById('walkTime').textContent = 'N/A';
    }
}

// Format time in minutes to hours and minutes
function formatTime(minutes) {
    if (minutes < 60) {
        return `${minutes}min`;
    }
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`;
}

// ==================== Emotion Radar Chart ====================

let emotionChart = null;

// Initialize Journey Analytics Panel
function initJourneyAnalytics() {
    const progressBar = document.getElementById('progressBarContainer');
    const analyticsPanel = document.getElementById('journeyAnalyticsPanel');
    const expandIndicator = document.getElementById('expandIndicator');
    
    console.log('initJourneyAnalytics - Elements found:', {
        progressBar: !!progressBar,
        analyticsPanel: !!analyticsPanel,
        expandIndicator: !!expandIndicator
    });
    
    if (!progressBar || !analyticsPanel) {
        console.error('Journey Analytics: Required elements not found!');
        return;
    }
    
    let isExpanded = false;
    
    // Toggle panel on click
    progressBar.addEventListener('click', (e) => {
        console.log('🖱️ Progress bar clicked!', e.target);
        isExpanded = !isExpanded;
        console.log('Expanding:', isExpanded);
        
        if (isExpanded) {
            console.log('Opening analytics panel...');
            updateJourneyAnalytics();
            analyticsPanel.classList.add('active');
            progressBar.classList.add('expanded');
            console.log('Panel classes:', analyticsPanel.className);
        } else {
            console.log('Closing analytics panel...');
            analyticsPanel.classList.remove('active');
            progressBar.classList.remove('expanded');
        }
    });
    
    console.log('✅ Journey Analytics event listener attached');
}

// Update Journey Analytics Panel
function updateJourneyAnalytics() {
    console.log('📊 updateJourneyAnalytics called');
    const visitedPOIs = poiData.filter(poi => visitStatus[poi.id] === 'visited');
    const plannedPOIs = poiData.filter(poi => visitStatus[poi.id] === 'planned');
    console.log('Stats:', { visited: visitedPOIs.length, planned: plannedPOIs.length });
    const totalPOIs = poiData.length;
    
    // 1. Update Summary Cards
    const completionRate = totalPOIs > 0 ? Math.round((visitedPOIs.length / totalPOIs) * 100) : 0;
    document.getElementById('completionRate').textContent = `${completionRate}%`;
    document.getElementById('totalPlaces').textContent = totalPOIs;
    
    // Calculate favorite emotion and top category
    const emotionCounts = {};
    const categoryCounts = {};
    
    visitedPOIs.forEach(poi => {
        emotionCounts[poi.emotion_tag] = (emotionCounts[poi.emotion_tag] || 0) + 1;
        categoryCounts[poi.category_tag] = (categoryCounts[poi.category_tag] || 0) + 1;
    });
    
    const topEmotion = Object.keys(emotionCounts).sort((a, b) => emotionCounts[b] - emotionCounts[a])[0];
    const topCategory = Object.keys(categoryCounts).sort((a, b) => categoryCounts[b] - categoryCounts[a])[0];
    
    document.getElementById('favoriteEmotion').textContent = topEmotion ? emotionTranslations[topEmotion] : '-';
    document.getElementById('topCategory').textContent = topCategory ? categoryTranslations[topCategory] : '-';
    
    // 2. Update Emotion Radar Chart
    if (visitedPOIs.length === 0) {
        document.querySelector('.radar-chart-container').innerHTML = '<p style="text-align: center; color: #999; padding: 80px 20px;">Visit some places first to see your emotion distribution! 🗺️</p>';
        document.getElementById('radarStats').innerHTML = '';
    } else {
        const emotionColors = {
            'vibrant': '#F6C667',
            'romantic': '#E57373',
            'adventurous': '#6CB5F5',
            'creative': '#C26EF1',
            'nostalgic': '#A8875C',
            'calm': '#4FB0AE'
        };
        
        const emotions = Object.keys(emotionColors);
        const data = emotions.map(emotion => emotionCounts[emotion] || 0);
        const colors = emotions.map(emotion => emotionColors[emotion]);
        
        // Create or update chart
        const ctx = document.getElementById('emotionRadarChart');
        
        if (emotionChart) {
            emotionChart.destroy();
        }
        
        emotionChart = new Chart(ctx, {
            type: 'radar',
            data: {
                labels: emotions.map(e => emotionTranslations[e]),
                datasets: [{
                    label: 'Visited Places',
                    data: data,
                    backgroundColor: 'rgba(102, 126, 234, 0.2)',
                    borderColor: '#667eea',
                    borderWidth: 2,
                    pointBackgroundColor: colors,
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointRadius: 6,
                    pointHoverRadius: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                scales: {
                    r: {
                        beginAtZero: true,
                        ticks: {
                            stepSize: 1
                        },
                        pointLabels: {
                            font: {
                                size: 12,
                                weight: '600'
                            }
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
        
        // Update emotion stats
        const statsHTML = emotions.map(emotion => {
            const count = emotionCounts[emotion] || 0;
            if (count === 0) return '';
            return `
                <div class="radar-stat-item">
                    <div class="radar-stat-color" style="background: ${emotionColors[emotion]}"></div>
                    <div class="radar-stat-label">${emotionTranslations[emotion]}</div>
                    <div class="radar-stat-value">${count}</div>
                </div>
            `;
        }).join('');
        
        document.getElementById('radarStats').innerHTML = statsHTML;
    }
    
    // 3. Update Category Breakdown
    const categoryData = Object.keys(categoryTranslations).map(category => {
        const visitedCount = visitedPOIs.filter(poi => poi.category_tag === category).length;
        const totalCount = poiData.filter(poi => poi.category_tag === category).length;
        const percentage = totalCount > 0 ? (visitedCount / totalCount) * 100 : 0;
        const categoryColor = poiData.find(poi => poi.category_tag === category)?.category_color || '#999';
        
        return { category, visitedCount, totalCount, percentage, categoryColor };
    }).filter(item => item.totalCount > 0);
    
    const categoryHTML = categoryData.map(item => `
        <div class="category-bar-item">
            <div class="category-bar-header">
                <div class="category-bar-name">${categoryTranslations[item.category]}</div>
                <div class="category-bar-count">${item.visitedCount}/${item.totalCount}</div>
            </div>
            <div class="category-bar-fill">
                <div class="category-bar-progress" style="width: ${item.percentage}%; background: ${item.categoryColor};"></div>
            </div>
        </div>
    `).join('');
    
    document.getElementById('categoryBreakdown').innerHTML = categoryHTML || '<p style="text-align: center; color: #999;">No data available</p>';
    
    // 4. Generate Travel Insights
    const insights = [];
    
    if (visitedPOIs.length > 0) {
        insights.push({
            icon: '🎉',
            text: `You've explored ${visitedPOIs.length} amazing places in Singapore!`
        });
        
        if (topEmotion) {
            insights.push({
                icon: '💫',
                text: `Your journey leans towards ${emotionTranslations[topEmotion].toLowerCase()} experiences!`
            });
        }
        
        if (topCategory) {
            insights.push({
                icon: '🏆',
                text: `You're particularly drawn to ${categoryTranslations[topCategory].toLowerCase()} attractions.`
            });
        }
    }
    
    if (plannedPOIs.length > 0) {
        insights.push({
            icon: '📅',
            text: `You have ${plannedPOIs.length} places on your to-visit list. Keep exploring!`
        });
    }
    
    if (visitedPOIs.length === 0 && plannedPOIs.length === 0) {
        insights.push({
            icon: '🗺️',
            text: 'Start your Singapore adventure! Mark places as "To Visit" to plan your journey.'
        });
    }
    
    if (completionRate >= 50) {
        insights.push({
            icon: '🌟',
            text: `Wow! You've completed over ${completionRate}% of the journey. You're a Singapore expert!`
        });
    }
    
    const insightsHTML = insights.map(insight => `
        <div class="insight-item">
            <div class="insight-icon">${insight.icon}</div>
            <div class="insight-text">${insight.text}</div>
        </div>
    `).join('');
    
    document.getElementById('insightsList').innerHTML = insightsHTML;
}

// ==================== Smart Recommendations ====================

// Generate recommendations for a POI
function generateRecommendations(currentPOI) {
    const recommendationsGrid = document.getElementById('recommendationsGrid');
    
    // Get POIs with same emotion or category, excluding current and visited
    const recommendations = poiData
        .filter(poi => {
            // Exclude current POI and already visited ones
            if (poi.id === currentPOI.id || visitStatus[poi.id] === 'visited') {
                return false;
            }
            
            // Include if same emotion or same category
            return poi.emotion_tag === currentPOI.emotion_tag || 
                   poi.category_tag === currentPOI.category_tag;
        })
        .map(poi => {
            // Calculate match score
            let matchScore = 0;
            let matchReason = '';
            
            if (poi.emotion_tag === currentPOI.emotion_tag && poi.category_tag === currentPOI.category_tag) {
                matchScore = 2;
                matchReason = '🎯 Perfect Match';
            } else if (poi.emotion_tag === currentPOI.emotion_tag) {
                matchScore = 1.5;
                matchReason = `🎨 Same Vibe (${emotionTranslations[poi.emotion_tag]})`;
            } else {
                matchScore = 1;
                matchReason = `🏷️ Similar Type (${categoryTranslations[poi.category_tag]})`;
            }
            
            return { ...poi, matchScore, matchReason };
        })
        .sort((a, b) => b.matchScore - a.matchScore)
        .slice(0, 6); // Top 6 recommendations
    
    if (recommendations.length === 0) {
        recommendationsGrid.innerHTML = '<p style="text-align: center; color: #999; grid-column: 1/-1;">No recommendations available</p>';
        return;
    }
    
    recommendationsGrid.innerHTML = recommendations.map(poi => `
        <div class="recommendation-card" onclick="showDetail('${poi.id}')">
            <div class="recommendation-name">${poi.name}</div>
            <div class="recommendation-category" style="background-color: ${poi.category_color}; color: white; padding: 3px 8px; border-radius: 8px; display: inline-block; font-size: 10px;">${categoryTranslations[poi.category_tag]}</div>
            <div class="recommendation-match">${poi.matchReason}</div>
        </div>
    `).join('');
    
    // Note: We don't automatically highlight recommendations anymore
    // Highlights should only change when:
    // 1. User clicks "Clear Highlights" button
    // 2. New AI conversation generates new highlights
}
