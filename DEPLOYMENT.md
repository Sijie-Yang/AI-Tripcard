# 🚀 部署指南 / Deployment Guide

## 📦 项目已同步到 GitHub

**仓库地址**: https://github.com/Sijie-Yang/AI-Tripcard/tree/lujia

---

## 🎯 快速开始

### 方法 1: 克隆仓库
```bash
# 克隆仓库
git clone https://github.com/Sijie-Yang/AI-Tripcard.git

# 进入项目目录
cd AI-Tripcard

# 切换到 lujia 分支
git checkout lujia

# 启动本地服务器
python3 -m http.server 8000

# 在浏览器打开
open http://localhost:8000/index.html
```

### 方法 2: 直接下载
```bash
# 下载 ZIP
wget https://github.com/Sijie-Yang/AI-Tripcard/archive/refs/heads/lujia.zip

# 解压
unzip lujia.zip

# 进入目录
cd AI-Tripcard-lujia

# 启动服务器
python3 -m http.server 8000
```

---

## 🌐 在线部署选项

### 1. GitHub Pages
```bash
# 在 GitHub 仓库设置中:
# Settings → Pages → Source → lujia branch → Save
```
访问: `https://sijie-yang.github.io/AI-Tripcard/index.html`

### 2. Netlify
```bash
# 拖拽整个文件夹到 Netlify
# 或连接 GitHub 仓库
```

### 3. Vercel
```bash
# 连接 GitHub 仓库
# 选择 lujia 分支
# 自动部署
```

### 4. Cloudflare Pages
```bash
# 连接 GitHub 仓库
# 选择 lujia 分支
# 构建命令: (留空)
# 输出目录: /
```

---

## 📋 部署检查清单

### 部署前
- [ ] 确保所有图片文件在 `60 images/` 文件夹中
- [ ] 确保图标文件在 `avatar/` 文件夹中
- [ ] 确保 JSON 数据文件完整（3个文件）
- [ ] 测试 `index.html` 在本地可以正常运行

### 部署后
- [ ] 测试主页加载
- [ ] 测试两种模式（Local/Tourist）
- [ ] 测试卡片滑动
- [ ] 测试图片加载
- [ ] 测试 Summary 页面
- [ ] 测试切换视图功能
- [ ] 测试数据导出功能
- [ ] 测试移动端响应式

---

## 🔧 常见问题

### Q1: 图片无法加载
```bash
# 检查文件夹名称（注意空格）
ls -la "60 images/"

# 确保图片文件存在
ls "60 images/" | wc -l  # 应该显示 60
```

### Q2: 端口 8000 被占用
```bash
# 杀死占用端口的进程
lsof -ti:8000 | xargs kill -9

# 或使用其他端口
python3 -m http.server 8888
```

### Q3: Git 推送失败
```bash
# 检查远程仓库
git remote -v

# 重新设置远程仓库
git remote set-url origin https://github.com/Sijie-Yang/AI-Tripcard.git

# 强制推送（谨慎使用）
git push origin lujia --force
```

### Q4: 跨域问题 (CORS)
```bash
# 使用 Python HTTP 服务器（推荐）
python3 -m http.server 8000

# 或使用 Node.js http-server
npm install -g http-server
http-server -p 8000 --cors
```

---

## 📱 移动端测试

### 本地网络测试
```bash
# 1. 启动服务器
python3 -m http.server 8000

# 2. 查找本机 IP
ifconfig | grep "inet " | grep -v 127.0.0.1

# 3. 在手机浏览器访问
# http://[你的IP]:8000/index.html
# 例如: http://192.168.1.100:8000/index.html
```

### 使用 ngrok（公网访问）
```bash
# 安装 ngrok
brew install ngrok

# 启动本地服务器
python3 -m http.server 8000

# 创建公网隧道
ngrok http 8000

# 使用提供的 URL 访问
```

---

## 🔄 更新代码

### 从本地推送更新
```bash
# 1. 提交更改
git add .
git commit -m "Update description"

# 2. 推送到 GitHub
git push origin lujia
```

### 从 GitHub 拉取更新
```bash
# 1. 拉取最新代码
git pull origin lujia

# 2. 重启服务器
python3 -m http.server 8000
```

---

## 📊 项目文件清单

### 必需文件
```
✅ index.html           # 主应用（独立运行）
✅ 60 images/           # 60张景点图片（必需）
✅ avatar/              # 模式选择图标（必需）
✅ poi_sg_01_20.json   # POI数据 1-20
✅ poi_sg_21_40.json   # POI数据 21-40
✅ poi_sg_41_60.json   # POI数据 41-60
```

### 可选文件
```
📄 export.html         # 数据导出页面
📄 import.html         # 数据导入页面
📁 lib/                # 本地存储库
📄 README.md           # 项目说明
📄 *.md                # 其他文档
```

### 不需要的文件
```
❌ node_modules/       # 不需要（纯前端）
❌ .env                # 不需要（无后端）
❌ server.py           # 已移除
❌ requirements.txt    # 已移除
```

---

## 🎨 自定义部署

### 更改项目名称
1. 修改 `index.html` 中的 `<title>`
2. 修改 README.md 中的项目名称
3. 更新 localStorage key（可选）

### 更换数据集
1. 替换 `60 images/` 文件夹中的图片
2. 更新 3 个 JSON 文件中的数据
3. 确保 `id` 和图片文件名匹配

### 修改主题颜色
在 `index.html` 的 CSS 中修改:
```css
/* 主色调 */
--primary-color: #667eea;
--secondary-color: #764ba2;

/* 按钮颜色 */
--like-color: #66BB6A;
--dislike-color: #EF5350;
```

---

## 🔐 安全注意事项

### 生产环境
- ✅ 所有数据存储在用户浏览器本地
- ✅ 无需后端服务器
- ✅ 无需数据库
- ✅ 无需 API 密钥
- ✅ 完全静态，可以部署在任何静态托管服务

### 数据隐私
- 用户数据仅存储在本地浏览器
- 清除浏览器数据会丢失记录
- 可通过导出功能备份数据

---

## 📈 性能优化建议

### 图片优化
```bash
# 压缩 PNG 图片
optipng -o7 "60 images/"*.png

# 或使用 ImageMagick
mogrify -resize 400x300 -quality 85 "60 images/"*.png
```

### CDN 加速
```html
<!-- 使用 CDN 加载 Chart.js -->
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
```

---

## 📞 支持

- **GitHub Issues**: https://github.com/Sijie-Yang/AI-Tripcard/issues
- **Branch**: lujia
- **Documentation**: 查看项目中的 `.md` 文件

---

## ✅ 部署成功标志

```
✅ 可以访问主页
✅ 可以选择模式
✅ 图片正常加载
✅ 可以滑动卡片
✅ 可以查看统计
✅ 可以切换视图
✅ 可以导出数据
✅ 移动端正常显示
```

---

**祝部署顺利！🎉**

如有问题，请查看 [README.md](./README.md) 或提交 GitHub Issue。

