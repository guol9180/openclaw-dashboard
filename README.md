# 🦀 OpenClaw AI Room

**游戏化的 AI Agent 监控界面** - 将 OpenClaw 可视化为一个在房间中工作的 AI 角色

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue.svg)
![React](https://img.shields.io/badge/React-18.2-blue.svg)
![Three.js](https://img.shields.io/badge/Three.js-0.162-green.svg)

---

## 🎯 项目简介

OpenClaw AI Room 是一个创新的 AI Agent 监控系统，采用游戏化的设计理念：

- **AI 角色**：OpenClaw 被可视化为一个在 3D 房间中工作的角色
- **设备系统**：5 个功能设备代表不同的 AI 能力（搜索、记忆、技能等）
- **实时监控**：真实数据驱动的状态显示和任务追踪
- **沉浸体验**：像观察游戏 NPC 一样观察 AI 的行为

---

## ✨ 核心功能

### 🤖 AI 角色系统

- **5 种状态**：Idle → Thinking → Searching → Using Tool → Generating
- **移动动画**：角色在房间中移动到不同设备
- **实时行为**：根据真实 AI 事件驱动角色行为

### 🖥️ 设备系统

| 设备 | 功能 | 描述 |
|------|------|------|
| 📚 Memory Shelf | 记忆存储 | Vector DB & Memories |
| 🔍 Search Terminal | 网页搜索 | Web Search & Browser Tool |
| 💻 Code Console | 代码工具 | Python / CLI & Scripts |
| 🌐 Network Console | 网络通信 | MCP Servers & API Calls |
| ⚙️ Skill Workbench | 技能引擎 | Skills Engine & Automation |

### 📋 任务系统（Quest Log）

- 任务追踪：显示当前任务和步骤
- 进度显示：实时更新任务完成状态
- 步骤详情：5 个默认步骤（理解请求 → 搜索信息 → 处理结果 → 生成响应 → 返回答案）

### 📜 事件日志（Event Log）

- 实时事件流：显示 AI 的所有操作
- 11 种事件类型：request, thinking, search, skill, mcp, etc.
- 自动滚动：最新事件自动显示

### 📊 系统监控（System Status）

- **CPU**：实时使用率
- **Memory**：已用/总量
- **Tokens**：累计使用量
- **Latency**：平均延迟

---

## 🛠️ 技术栈

### 后端

- **Node.js** + **TypeScript**
- **Fastify** - 高性能 Web 框架
- **Socket.io** - WebSocket 实时通信
- **systeminformation** - 系统监控

### 前端

- **React 18** + **TypeScript**
- **Vite** - 构建工具
- **React Three Fiber** - 3D 渲染
- **@react-three/drei** - 3D 工具库
- **Zustand** - 状态管理
- **TailwindCSS** - 样式

---

## 📦 安装

### 前置要求

- Node.js >= 18
- OpenClaw 已安装并运行

### 克隆项目

```bash
git clone https://github.com/guol9180/openclaw-dashboard.git
cd openclaw-dashboard
```

### 安装依赖

```bash
# 后端依赖
cd backend
npm install

# 前端依赖
cd ../frontend
npm install
```

---

## 🚀 使用方法

### 1. 启动后端

```bash
cd backend
npm run dev
```

后端将在 `http://localhost:3001` 运行

### 2. 启动前端

```bash
cd frontend
npm run dev
```

前端将在 `http://localhost:3000` 运行

### 3. 访问界面

打开浏览器访问：`http://localhost:3000`

---

## 🎮 功能演示

### AI 角色状态

- **🟢 Idle**：空闲状态，等待任务
- **🟡 Thinking**：思考中，处理请求
- **🔵 Searching**：搜索中，查询信息
- **🟣 Using Tool**：使用工具，执行技能
- **🟣 Generating**：生成响应

### 设备交互

当 AI 执行不同任务时，角色会移动到对应设备：

- **Web Search** → 走到 Search Terminal
- **Skill Execution** → 走到 Skill Workbench
- **Memory Access** → 走到 Memory Shelf
- **API Call** → 走到 Network Console
- **Code Execution** → 走到 Code Console

---

## 📁 项目结构

```
openclaw-dashboard/
├── backend/                # 后端服务
│   ├── collectors/        # 数据收集器
│   │   ├── log-collector.ts
│   │   ├── status-collector.ts
│   │   └── metrics-collector.ts
│   ├── state/             # 状态管理
│   │   ├── ai-state.ts
│   │   └── task-manager.ts
│   ├── types/             # 类型定义
│   ├── websocket/         # WebSocket 处理
│   └── server.ts          # 服务器入口
│
├── frontend/               # 前端应用
│   ├── src/
│   │   ├── components/    # React 组件
│   │   │   ├── character/ # AI 角色
│   │   │   ├── devices/   # 设备组件
│   │   │   ├── room/      # 房间环境
│   │   │   └── ui/        # UI 面板
│   │   ├── scenes/        # 3D 场景
│   │   ├── stores/        # Zustand store
│   │   ├── hooks/         # React hooks
│   │   └── types/         # 类型定义
│   └── vite.config.ts
│
├── ARCHITECTURE.md         # 架构设计
└── PROGRESS.md             # 开发进度
```

---

## 🔧 配置

### 环境变量

创建 `.env` 文件（可选）：

```bash
# OpenClaw 路径
OPENCLAW_PATH=/root/.openclaw

# 服务器端口
PORT=3001
HOST=0.0.0.0
```

### Vite 配置

前端代理配置（`frontend/vite.config.ts`）：

```typescript
server: {
  port: 3000,
  proxy: {
    '/api': 'http://localhost:3001',
    '/socket.io': {
      target: 'http://localhost:3001',
      ws: true
    }
  }
}
```

---

## 📊 数据流

```
OpenClaw Runtime
      │
      ├─ 日志输出
      ├─ openclaw status
      └─ 文件系统
           │
           ▼
    Event Collector
           │
           ▼
    State Manager
           │
           ▼
    WebSocket Server
           │
           ▼
    Frontend (React + Three.js)
           │
           ├─ AI Character
           ├─ Devices
           └─ UI Panels
```

---

## 🎨 设计理念

### 游戏化监控

传统 Dashboard 只是静态图表，AI Room 将监控变成游戏体验：

- **角色**：AI 不是抽象概念，而是一个可见的角色
- **设备**：AI 能力对应物理设备，更直观
- **任务**：像游戏任务一样追踪进度
- **沉浸**：观察 AI 工作就像观察 NPC

### 真实数据驱动

- ❌ **无模拟数据**
- ✅ **所有数据来自真实 OpenClaw 运行时**
- ✅ **实时事件流**
- ✅ **真实系统指标**

---

## 🤝 贡献

欢迎贡献！请查看 [CONTRIBUTING.md](CONTRIBUTING.md)

---

## 📄 许可证

MIT License - 详见 [LICENSE](LICENSE)

---

## 🙏 致谢

- [OpenClaw](https://github.com/openclaw/openclaw) - AI Agent 框架
- [React Three Fiber](https://github.com/pmndrs/react-three-fiber) - React 3D 库
- [Zustand](https://github.com/pmndrs/zustand) - 轻量级状态管理

---

## 📮 联系

- **GitHub**: https://github.com/guol9180/openclaw-dashboard
- **Issues**: https://github.com/guol9180/openclaw-dashboard/issues

---

**🎮 Enjoy monitoring your AI Agent in a gamified way!**
