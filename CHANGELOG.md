# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/),
and this project adheres to [Semantic Versioning](https://semver.org/).

## v2.1.0

[compare changes](https://github.com/ikxin/kms-tools/compare/v2.0.0...v2.1.0)

### 🚀 Enhancements

- 支持通过环境变量自定义监控频率 ([#38](https://github.com/ikxin/kms-tools/pull/38))
- 使用 node.js 实现 vlmcs 客户端 ([106bc6d](https://github.com/ikxin/kms-tools/commit/106bc6d))
- 移除本地 vlmcsd 相关配置 ([db3c576](https://github.com/ikxin/kms-tools/commit/db3c576))
- 集成 motion-v 增强组件间的动画效果 ([bd97f54](https://github.com/ikxin/kms-tools/commit/bd97f54))
- 新增监控页面平均延迟和成功率 ([1b7dd27](https://github.com/ikxin/kms-tools/commit/1b7dd27))
- 添加 KMS 检测结果详情页面 ([8e8bbbf](https://github.com/ikxin/kms-tools/commit/8e8bbbf))
- 新增赞助商模块 ([4eeaec9](https://github.com/ikxin/kms-tools/commit/4eeaec9))
- 新增繁体中文、俄语、法语、韩语等多种语言 ([61d247a](https://github.com/ikxin/kms-tools/commit/61d247a))
- 监控任务调度并添加 Cloudflare 部署设置 ([38857aa](https://github.com/ikxin/kms-tools/commit/38857aa))
- 集成 Arco Design 组件库 ([79a75e4](https://github.com/ikxin/kms-tools/commit/79a75e4))
- 兼容多平台 Storage 数据 ([b0ce704](https://github.com/ikxin/kms-tools/commit/b0ce704))
- 将主机指标合并为单次存储写入 ([be27c90](https://github.com/ikxin/kms-tools/commit/be27c90))
- 为连接和接收数据的 socket 添加超时处理 ([c767490](https://github.com/ikxin/kms-tools/commit/c767490))
- 接入 Nuxt SEO 模块实现站点地图 ([7d6331b](https://github.com/ikxin/kms-tools/commit/7d6331b))
- 引入 unplugin 组件插件并注册 Arco 设计图标 ([a9ef9bc](https://github.com/ikxin/kms-tools/commit/a9ef9bc))

### 🩹 Fixes

- 生产环境环境变量不生效问题 ([#37](https://github.com/ikxin/kms-tools/pull/37))
- 移除构建和启动命令 ([0b85098](https://github.com/ikxin/kms-tools/commit/0b85098))
- 修复激活页面 URL.createObjectURL() 未实现 ([09b0593](https://github.com/ikxin/kms-tools/commit/09b0593))
- 替换 BigInt 字面量以兼容 ES2019 打包目标 ([0f8f9d2](https://github.com/ikxin/kms-tools/commit/0f8f9d2))
- 修复监控数据排序逻辑以按成功率和延迟排序 ([0f83ad7](https://github.com/ikxin/kms-tools/commit/0f83ad7))
- 修复 Arco 深色模式刷新闪烁 ([1e84130](https://github.com/ikxin/kms-tools/commit/1e84130))

### 💅 Refactors

- 重构 RPC 处理并集成 node-vlmcs ([b3539e7](https://github.com/ikxin/kms-tools/commit/b3539e7))

### 🏡 Chore

- 删除历史遗留的代码 ([4b51728](https://github.com/ikxin/kms-tools/commit/4b51728))
- 更新监控间隔和默认监控列表 ([881f8df](https://github.com/ikxin/kms-tools/commit/881f8df))
- Prettier 迁移到 Oxfmt ([6911256](https://github.com/ikxin/kms-tools/commit/6911256))
- 发布 node-vlmcs 到 npmjs ([77d8a1d](https://github.com/ikxin/kms-tools/commit/77d8a1d))
- 修改 Cloudflare KV 绑定名称 ([77f3b54](https://github.com/ikxin/kms-tools/commit/77f3b54))
- 多平台同步使用 Cloudflare KV 存储监控数据 ([c7b8e36](https://github.com/ikxin/kms-tools/commit/c7b8e36))
- 移除 @vueuse/nuxt 模块 ([b3989b0](https://github.com/ikxin/kms-tools/commit/b3989b0))
- 将 Tailwind CSS 从 Nuxt 模块改成 Vite 插件接入 ([4195b01](https://github.com/ikxin/kms-tools/commit/4195b01))
- 更新 CI 和 Docker 工作流中的依赖版本 ([412e926](https://github.com/ikxin/kms-tools/commit/412e926))
- 集成 changelogen 版本管理工具 ([bbeea2c](https://github.com/ikxin/kms-tools/commit/bbeea2c))

### 🎨 Styles

- 调整 Arco Design 边框和内边距默认样式 ([51b3fae](https://github.com/ikxin/kms-tools/commit/51b3fae))

### ❤️ Contributors

- Ikxin <i@ikxin.com>
- 一纸忘忧 ([@ikxin](https://github.com/ikxin))
- Notte ([@ikxin](https://github.com/ikxin))
- Copilot ([@MicrosoftCopilot](https://github.com/MicrosoftCopilot))

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
