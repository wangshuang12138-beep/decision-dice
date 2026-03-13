# 🎲 决策骰子 · Decision Dice

一个帮你做决定的工具，支持 AI 辅助分析和决策复盘。

![Vue](https://img.shields.io/badge/Vue-3.4-%234FC08D?logo=vue.js)
![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-Deployed-%23222222?logo=github)

## ✨ 功能特性

- 🎯 **快速决策** - 输入选项，随机帮你选择
- 🤖 **AI 辅助** - Kimi AI 分析每个选项的利弊
- 📝 **决策复盘** - 事后评价决策结果，积累决策经验
- 📊 **数据统计** - 查看决策历史和满意度统计
- 💾 **本地存储** - 数据保存在浏览器，隐私安全

## 🚀 在线体验

**访问地址：** https://wangshuang12138-beep.github.io/decision-dice/

## 🛠️ 技术栈

- Vue 3 + Vite
- Pinia 状态管理
- Kimi API (可选)
- GitHub Pages 部署

## 📁 项目结构

```
decision-dice/
├── frontend/
│   ├── src/
│   │   ├── stores/      # 状态管理
│   │   ├── views/       # 页面组件
│   │   ├── App.vue      # 主应用
│   │   └── main.js      # 入口
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
└── .github/workflows/   # 自动部署
```

## 🏃 本地开发

```bash
cd frontend
npm install
npm run dev
```

## 🔑 配置 AI 功能（可选）

1. 获取 Kimi API Key：https://platform.moonshot.cn/
2. 在应用设置中填入 API Key
3. 勾选「让 AI 分析利弊」即可获得智能建议

## 📝 使用指南

### 做决策
1. 输入你在纠结的问题（可选）
2. 填写 2-8 个选项
3. 点击「帮我做决定」
4. 获得随机结果和 AI 分析

### 决策复盘
1. 在「历史」标签查看过往决策
2. 点击「待复盘」的决策
3. 选择 👍 / 👎 / 🤷 评价结果

### 查看统计
- 总决策数
- AI 辅助次数
- 决策满意度
- 最近活动趋势

## 🚀 部署

推送代码到 GitHub 自动触发部署：

```bash
git push origin main
```

GitHub Actions 会自动构建并部署到 GitHub Pages。

---

> 🎲 让随机帮你做决定，但记住：最终的选择权永远在你手中。
