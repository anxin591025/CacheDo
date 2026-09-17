# 待办 App Demo

一个现代化、简洁、响应式的个人待办事项 Web App。纯前端应用，无需后端服务器，数据存储在浏览器 localStorage 中，刷新页面数据不丢失。

## 功能特性

### 核心功能 (P0)

- **任务 CRUD** — 添加、编辑、删除、复制任务
- **完成/恢复** — 一键切换任务完成状态，带删除线和视觉降权
- **实时搜索** — 搜索任务标题、备注、标签
- **状态筛选** — 全部 / 未完成 / 已完成，带实时计数
- **优先级** — 无 / 低 / 中 / 高四级，圆点 + 文字双重表达
- **标签系统** — 5 个默认标签 + 自定义标签，侧边栏显示标签计数
- **截止日期** — 智能显示"今天""明天""3天后"等
- **数据持久化** — localStorage 存储，刷新/关闭浏览器数据不丢失，JSON 损坏自动降级
- **响应式设计** — PC 侧边栏布局 / 手机底部导航 + FAB 悬浮按钮
- **深色模式** — 浅色 / 深色 / 跟随系统三选项

### 增强功能 (P1)

- **导入/导出** — JSON 格式备份与恢复，导入时校验数据结构
- **排序** — 创建时间 / 更新时间 / 截止日期 / 优先级 / 任务名称，支持升降序
- **快捷键** — `N` 新建、`/` 搜索、`Esc` 关闭、`Ctrl+Enter` 保存
- **今日统计** — 任务数量、已完成、待完成、完成率进度条
- **空状态** — 无任务 / 无搜索结果 / 无已完成三种场景
- **确认弹窗** — 删除任务和清空数据二次确认
- **拖拽排序** — 按创建时间排序时可拖拽重新排列
- **清空数据** — 输入 `DELETE` 文字确认，防止误操作

## 技术栈

| 技术 | 说明 |
|------|------|
| React 18 | UI 框架 |
| TypeScript | 类型安全 |
| Vite 5 | 构建工具 |
| Tailwind CSS 3 | 样式框架（darkMode: class） |
| Lucide React | 图标库 |

## 快速开始

### 本地开发

```bash
npm install
npx vite
```

浏览器访问 `http://localhost:3000`

### 生产构建

```bash
npm run build      # 输出到 dist/
npx vite preview   # 本地预览构建结果
```

### Docker 部署

```bash
docker build -t todo-app .
docker run -d -p 8080:80 --name todo todo-app
```

浏览器访问 `http://localhost:8080`

## 项目结构

```
todo-app/
├── src/
│   ├── components/
│   │   ├── Sidebar.tsx         # 侧边栏（智能分类 + 标签）
│   │   ├── Header.tsx          # 顶部栏（搜索 + 设置入口）
│   │   ├── TodoList.tsx        # 任务列表（筛选 + 拖拽）
│   │   ├── TodoItem.tsx        # 单个任务项（完成/编辑/删除/更多）
│   │   ├── TodoEditor.tsx      # 任务编辑弹窗（新建/编辑）
│   │   ├── FilterBar.tsx       # 筛选标签 + 排序菜单
│   │   ├── EmptyState.tsx      # 空状态组件
│   │   ├── ConfirmDialog.tsx  # 确认弹窗
│   │   ├── SettingsPanel.tsx  # 设置面板（主题/导入导出/清空）
│   │   ├── BottomNav.tsx       # 移动端底部导航
│   │   └── StatsBar.tsx       # 今日统计进度条
│   ├── hooks/
│   │   ├── useTodos.ts         # 任务管理核心 hook
│   │   └── useLocalStorage.ts  # localStorage 通用 hook
│   ├── types/
│   │   └── todo.ts             # 类型定义
│   ├── utils/
│   │   ├── storage.ts          # 数据存储/导入导出
│   │   ├── date.ts             # 日期格式化
│   │   └── todo.ts             # 筛选/排序/统计
│   ├── App.tsx                 # 主编排组件
│   ├── main.tsx                # 入口
│   └── index.css              # 全局样式
├── Dockerfile                  # 多阶段构建
├── nginx.conf                  # Nginx 配置
├── .dockerignore
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
└── postcss.config.js
```

## 数据存储

所有数据保存在浏览器 localStorage 中：

| Key | 内容 |
|-----|------|
| `todo-app.todos` | 任务数组 |
| `todo-app.settings` | 应用设置（主题等） |
| `todo-app.version` | 数据版本号 |

**数据结构示例：**

```json
{
  "id": "todo-001",
  "title": "完成 Todo App Demo",
  "description": "完成第一版交互设计",
  "completed": false,
  "priority": "high",
  "dueDate": "2026-09-20T00:00:00.000Z",
  "tags": ["工作"],
  "createdAt": "2026-09-17T10:00:00.000Z",
  "updatedAt": "2026-09-17T10:00:00.000Z",
  "order": 1
}
```

**异常处理：**
- localStorage 不存在 → 自动创建空数组
- JSON 数据损坏 → try/catch 降级为空数据，不崩溃
- 数据版本号 → 为后续数据结构迁移预留

## 快捷键

| 快捷键 | 功能 |
|--------|------|
| `N` | 新建任务 |
| `/` | 聚焦搜索框 |
| `Esc` | 关闭弹窗 |
| `Ctrl + Enter` | 保存任务 |
| `Enter` | 在标题框中直接保存 |

## 响应式设计

| 设备 | 布局 |
|------|------|
| PC (≥1024px) | 左侧边栏 240px + 主内容区自适应 |
| 平板 | 侧边栏 200px + 主内容区 |
| 手机 (≤767px) | 顶部栏 + 主内容 + 底部导航（首页/今天/+/搜索/设置） |

## 开发边界

本 Demo 不包含以下功能：

- 用户注册 / 登录
- 云同步 / 后端 API / 数据库
- 多设备同步 / 多用户 / 团队协作
- 在线提醒服务 / 邮件 / 推送

所有数据仅保存在当前浏览器中。
