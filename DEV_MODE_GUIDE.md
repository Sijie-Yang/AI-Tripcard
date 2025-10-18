# 🛠️ 开发模式指南

## 📱 浏览器开发者工具使用指南

---

## 1️⃣ Chrome / Edge (推荐)

### 方法一：快捷键
```
Windows/Linux: F12 或 Ctrl + Shift + I
Mac: Cmd + Option + I
```

### 方法二：菜单打开
1. 点击右上角 **三个点** (⋮)
2. **更多工具** → **开发者工具**

### 进入设备模拟模式
```
Windows/Linux: Ctrl + Shift + M
Mac: Cmd + Shift + M
```

或点击开发者工具左上角的 **📱 设备图标**

### 推荐设置

#### 1. 选择设备：
- **iPhone 14 Pro**: 393 × 852
- **iPhone 13/12 Pro**: 390 × 844
- **iPhone SE**: 375 × 667
- **iPhone X/11**: 375 × 812

#### 2. 调整选项：
```
✅ Show device frame (显示设备外框)
✅ Show media queries (显示媒体查询)
✅ Show rulers (显示标尺)
```

#### 3. 网络限速测试：
- **Fast 3G** - 测试慢速网络
- **Slow 3G** - 测试极慢网络
- **Offline** - 测试离线模式

---

## 2️⃣ Safari (Mac)

### 启用开发菜单
1. Safari → **偏好设置** (Cmd + ,)
2. **高级** 标签
3. ✅ 勾选 **在菜单栏中显示"开发"菜单**

### 打开开发者工具
```
快捷键: Cmd + Option + I
或菜单: 开发 → 显示Web检查器
```

### 进入响应式设计模式
```
快捷键: Cmd + Option + R
或菜单: 开发 → 进入响应式设计模式
```

### 选择设备
- iPhone 14 Pro
- iPhone 13 Pro
- iPhone SE
- iPad Air
- iPad Pro

---

## 3️⃣ Firefox

### 打开开发者工具
```
Windows/Linux: F12 或 Ctrl + Shift + I
Mac: Cmd + Option + I
```

### 进入响应式设计模式
```
Windows/Linux: Ctrl + Shift + M
Mac: Cmd + Option + M
```

或点击 **📱 响应式设计模式图标**

---

## 🎯 实际操作步骤（Chrome示例）

### Step 1: 打开应用
```bash
# 确保服务器在运行
python3 -m http.server 8000

# 浏览器访问
http://localhost:8000
```

### Step 2: 打开开发者工具
按 **F12** (Windows) 或 **Cmd + Option + I** (Mac)

### Step 3: 进入设备模拟
按 **Ctrl + Shift + M** (Windows) 或 **Cmd + Shift + M** (Mac)

### Step 4: 选择iPhone
1. 点击顶部设备下拉菜单
2. 选择 **iPhone 14 Pro**
3. 或自定义：**Responsive** → 输入 **375 × 812**

### Step 5: 测试功能
- ✅ 点击地图标记
- ✅ 滑动底部筛选栏
- ✅ 打开景点详情
- ✅ 切换地图样式
- ✅ 测试访问状态标记

---

## 🔍 调试技巧

### 1. 查看Console输出
```javascript
// 在Console标签查看
console.log('当前标记数量:', markers.length);
console.log('当前地图样式:', currentMapStyle);
console.log('访问状态:', visitStatus);
```

### 2. 检查网络请求
切换到 **Network** 标签：
- 查看 `poi_sg_60.json` 加载状态
- 查看地图瓦片加载情况
- 检查加载时间

### 3. 查看本地存储
切换到 **Application** 标签 (Chrome)：
- **Local Storage** → `http://localhost:8000`
- 查看 `poi_visit_status` (访问状态)
- 查看 `map_style` (地图样式)

### 4. 性能分析
**Performance** 标签：
1. 点击 **Record** 录制
2. 操作应用（滚动、点击）
3. 停止录制
4. 查看帧率和性能

---

## 📱 真机调试

### iPhone 真机调试

#### 准备工作：
1. **Mac电脑**
2. **Lightning数据线**
3. **iPhone** (iOS 12+)

#### 步骤：

**在iPhone上：**
1. 设置 → Safari → 高级
2. ✅ 开启 **Web检查器**

**在Mac上：**
1. 用数据线连接iPhone
2. iPhone访问 `http://你的电脑IP:8000`
3. Mac Safari → 开发 → [你的iPhone名称] → 选择网页
4. 开始调试！

**获取电脑IP：**
```bash
ifconfig | grep "inet " | grep -v 127.0.0.1
# 或
ipconfig getifaddr en0
```

---

### Android 真机调试

#### 准备工作：
1. **Android手机**
2. **USB数据线**
3. **Chrome浏览器**（手机和电脑都要有）

#### 步骤：

**在手机上：**
1. 设置 → 关于手机 → 连续点击"版本号"7次（开启开发者模式）
2. 设置 → 开发者选项 → ✅ USB调试
3. 用Chrome访问网站

**在电脑Chrome上：**
1. 访问 `chrome://inspect`
2. 确保 **Discover USB devices** 已勾选
3. 手机授权USB调试
4. 在页面上点击 **inspect**
5. 开始调试！

---

## 🎨 查看不同分辨率效果

### 常见设备尺寸

| 设备 | 分辨率 | 比例 |
|------|--------|------|
| iPhone 14 Pro Max | 430 × 932 | 3x |
| iPhone 14 Pro | 393 × 852 | 3x |
| iPhone 14 | 390 × 844 | 3x |
| iPhone SE (2022) | 375 × 667 | 2x |
| iPhone 13 mini | 375 × 812 | 3x |
| iPad Pro 12.9" | 1024 × 1366 | 2x |
| iPad Air | 820 × 1180 | 2x |
| Samsung Galaxy S21 | 360 × 800 | 3x |
| Pixel 5 | 393 × 851 | 2.75x |

---

## 🐛 常见问题排查

### 问题1: 看不到手机框架
**原因**: 浏览器窗口太小
**解决**: 
```css
/* 框架显示需要窗口宽度 ≥ 768px */
- 拖大浏览器窗口
- 或将窗口最大化
```

### 问题2: 触摸事件不工作
**解决**:
```
1. 在设备模拟器中启用触摸模拟
2. Chrome DevTools → 三点菜单 → Settings
3. Devices → 添加自定义设备
4. 选择 Touch 作为输入类型
```

### 问题3: 样式显示异常
**解决**:
```
1. 硬刷新: Ctrl + Shift + R (Win) 或 Cmd + Shift + R (Mac)
2. 清除缓存: DevTools → Network → Disable cache
3. 检查 Console 是否有CSS加载错误
```

### 问题4: 地图不显示
**检查**:
```
1. Network标签 - 查看地图瓦片是否加载
2. Console - 查看Leaflet错误信息
3. 确认网络连接正常
4. 检查API配额是否超限
```

---

## 💡 高级技巧

### 1. 模拟不同网络条件
**Chrome DevTools → Network标签:**
- No throttling (不限速)
- Fast 3G
- Slow 3G
- Offline

测试应用在慢速网络下的表现。

### 2. 模拟地理位置
**Chrome DevTools → More tools → Sensors:**
- 设置自定义纬度/经度
- 测试基于位置的功能

### 3. 截图和录制
**Chrome DevTools:**
```
Cmd/Ctrl + Shift + P → 输入 "screenshot"
- Screenshot: 当前视口
- Full size screenshot: 整页
- Node screenshot: 特定元素
```

### 4. 查看和编辑LocalStorage
**Application标签 → Storage → Local Storage:**
```javascript
// 清除访问状态
localStorage.removeItem('poi_visit_status');

// 清除地图样式偏好
localStorage.removeItem('map_style');

// 清除所有
localStorage.clear();
```

---

## 🎯 推荐开发流程

### 日常开发：
```
1. 启动服务器: python3 -m http.server 8000
2. 打开Chrome: http://localhost:8000
3. F12打开DevTools
4. Ctrl+Shift+M进入设备模式
5. 选择iPhone 14 Pro
6. 开始测试和调试
```

### 发布前测试：
```
1. ✅ Chrome iPhone模拟
2. ✅ Safari响应式模式
3. ✅ 真机测试 (iPhone)
4. ✅ 真机测试 (Android)
5. ✅ 不同网络条件
6. ✅ 横屏和竖屏
```

---

## 📚 更多资源

### Chrome DevTools文档
https://developer.chrome.com/docs/devtools/

### Safari Web Inspector指南
https://developer.apple.com/safari/tools/

### Firefox开发者工具
https://firefox-source-docs.mozilla.org/devtools-user/

---

## 🔑 快捷键速查

| 功能 | Windows/Linux | Mac |
|------|--------------|-----|
| 打开DevTools | F12 或 Ctrl+Shift+I | Cmd+Option+I |
| 设备模拟 | Ctrl+Shift+M | Cmd+Shift+M |
| 刷新 | F5 或 Ctrl+R | Cmd+R |
| 硬刷新 | Ctrl+Shift+R | Cmd+Shift+R |
| Console | Ctrl+Shift+J | Cmd+Option+J |
| 查看元素 | Ctrl+Shift+C | Cmd+Option+C |
| 命令面板 | Ctrl+Shift+P | Cmd+Shift+P |

---

**最后更新**: 2025年10月18日

**提示**: 开发时建议使用Chrome DevTools，功能最全面且更新及时！

