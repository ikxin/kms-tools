# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/),
and this project adheres to [Semantic Versioning](https://semver.org/).

## [2.0.0] - 2026-03-17

### 🚀 Major Changes

- **框架升级**: 迁移至 Nuxt 4 全栈框架，替代原有的 Vue 3 + Vite 前端架构
- **架构重构**: 全面采用 Nuxt 4 的目录结构规范（`app/`、`server/`、`shared/`）
- **服务端渲染**: 支持 SSR 模式，提升首屏加载速度和 SEO 表现

### ✨ New Features

- 新增 KMS 服务器检测页面，支持自定义 Host、Port、Protocol 配置
- 新增 KMS 服务器实时监控面板，提供可视化图表展示延迟和成功率
- 新增暗色模式支持（亮色 / 暗色 / 跟随系统）
- 新增国际化支持（简体中文 / English）
- 新增 ECharts 图表可视化监控数据
- 新增内置 VLMCSD 服务（可选启用）
- 新增定时任务自动监控 KMS 服务器状态

### 🛠️ Improvements

- UI 组件库升级为 Arco Design Vue
- 样式框架迁移至 Tailwind CSS
- Docker 镜像支持 AMD64 和 ARM64 双架构
- CI/CD 流程全面升级，使用 GitHub Actions 自动化构建和发布
- Docker 镜像同步发布到 Docker Hub 和 GitHub Container Registry

### 📦 Dependencies

- Nuxt 4.4
- Vue 3.5
- ECharts 6.0
- Tailwind CSS
- Arco Design Vue
- VueUse 14.2
- Nuxt I18n 10.2

## [1.x] - Previous Releases

See [GitHub Releases](https://github.com/ikxin/kms-tools/releases) for details on previous versions.
