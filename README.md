# Life Reboot Protocol (人生重启协议)

![Life Reboot Protocol](https://img.shields.io/badge/Status-Completed-green)
![React](https://img.shields.io/badge/React-18-blue)
![Vite](https://img.shields.io/badge/Vite-6-purple)
![Tailwind](https://img.shields.io/badge/Tailwind-3-cyan)

一个基于 Dan Koe 著名文章 [《How to fix your entire life in 1 day》](https://letters.thedankoe.com/p/how-to-fix-your-entire-life-in-1) 打造的交互式 Web 应用。它将文章中的心理学与哲学框架转化为一个极简、沉浸且游戏化的个人管理工具。

## 🌟 核心特性

- **完全本地化 (Local-First)**：无后端服务器，所有数据安全地保存在你本地浏览器的 IndexedDB 中，绝对保护隐私。
- **沉浸式向导 (Immersive Wizard)**：极简粗野主义 (Brutalist) 风格的输入体验，输入时自动隐藏无关元素，帮助你深度挖掘内心。
- **日间打断 (Daytime Interrupts)**：自动生成 `.ics` 日历文件，在白天的特定时间通过日历提醒你进行反思，打破自动驾驶模式。
- **游戏化控制台 (Gamified Dashboard)**：将你的“反愿景”和“愿景”作为驱动力，把日常任务转化为游戏中的“打怪升级”。
- **多语言支持 (i18n)**：支持中英文无缝切换，并自动保存语言偏好。
- **数据备份**：支持将你的协议数据导出为 JSON 文件，或从 JSON 文件导入以实现跨设备迁移。
- **域名访问限制 (Allowed Hosts)**：支持通过环境变量配置允许访问的域名，增强部署安全性。

## 🚀 快速开始 (本地开发)

### 环境要求
- Node.js 18+
- npm 或 pnpm

### 安装与运行

```bash
# 1. 克隆项目
git clone git@github.com:l33klin/life-reboot-app2.git
cd life-reboot-app2

# 2. 安装依赖
npm install

# 3. 配置环境变量 (可选)
cp .env.example .env
# 编辑 .env 文件，设置 VITE_ALLOWED_HOSTS 以限制允许访问的域名，例如：
# VITE_ALLOWED_HOSTS=localhost,127.0.0.1,yourdomain.com

# 4. 启动开发服务器
npm run dev
```
打开浏览器访问 `http://localhost:5173` 即可体验。

## 🐳 Docker 部署 (推荐)

项目内置了 `Dockerfile` 和自定义的 `nginx.conf`，可以非常方便地通过 Docker 进行部署。

### 构建镜像

```bash
docker build -t life-reboot-app .
```

### 运行容器

```bash
docker run -d -p 8080:80 --name life-reboot life-reboot-app
```
运行后，打开浏览器访问 `http://localhost:8080` 即可使用。

### 使用 Docker Compose (可选)

如果你更喜欢使用 `docker-compose`，可以创建一个 `docker-compose.yml` 文件：

```yaml
version: '3'
services:
  life-reboot:
    build: .
    ports:
      - "8080:80"
    restart: always
```
然后运行：
```bash
docker-compose up -d
```

## 🛠 技术栈

- **前端框架**: React 18 + Vite
- **样式**: Tailwind CSS (极简粗野主义风格)
- **状态管理**: Zustand + LocalForage (IndexedDB 存储)
- **多语言**: react-i18next
- **路由**: React Router v6
- **日历生成**: ics
- **测试**: Vitest + React Testing Library

## 🔒 隐私声明

本项目是一个纯前端应用。你输入的所有“反愿景”、“愿景”以及日常反思内容，**仅保存在你当前使用的浏览器本地存储中**。没有任何数据会被发送到任何外部服务器。如果你需要在不同设备间同步数据，请使用“设置”页面中的“导出/导入数据”功能。

## 📄 协议

MIT License
