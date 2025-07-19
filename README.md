<p align="center">
  <img width="400" src="./src/assets/images/readme-logo.svg" />
</p>

<p align="center">
  <a href="https://github.com/ikxin/kms-tools/releases"><img src="https://badgen.net/github/release/ikxin/kms-tools" /></a>
  <a href="https://github.com/ikxin/kms-tools/stargazers"><img src="https://badgen.net/github/stars/ikxin/kms-tools" /></a>
  <a href="https://github.com/ikxin/kms-tools/network/members"><img src="https://badgen.net/github/forks/ikxin/kms-tools" /></a>
  <a href="https://github.com/ikxin/kms-tools/commits"><img src="https://badgen.net/github/commits/ikxin/kms-tools" /></a>
  <a href="https://github.com/ikxin/kms-tools/issues"><img src="https://badgen.net/github/issues/ikxin/kms-tools" /></a>
  <a href="https://github.com/ikxin/kms-tools/watchers"><img src="https://badgen.net/github/watchers/ikxin/kms-tools" /></a>
  <a href="https://github.com/ikxin/kms-tools/blob/master/LICENSE"><img src="https://badgen.net/github/license/ikxin/kms-tools" /></a>
</p>

<p align="center" class="hidden">
  <a href="./README.md">English</a>
</p>

## 📖 介绍

一站式 KMS 工具箱，集成了 KMS 激活脚本生成、KMS 服务器检测、KMS 服务器状态监控等功能。

项目依赖于 Node.js 的 `child_process` 模块来调用 `vlmcs` 二进制文件执行 KMS 检测服务，无法在 Github Pages 等静态网站托管平台上运行，因此区分了 `full` 全栈版本和 `static` 静态版本。

## 📦 演示

静态版本默认调用 https://kms.ikxin.com 的 API 接口，也可以自行部署全栈版本，然后通过环境变量 `NUXT_PUBLIC_API_URL` 设置。

### 全栈版本

https://kms.ikxin.com

### 静态版本

| 平台       | 演示链接                      |
| ---------- | ----------------------------- |
| Vercel     | https://kms-tools.vercel.app  |
| Cloudflare | https://kmstools.pages.dev    |
| Netlify    | https://kms-tools.netlify.app |

## 🌈 界面预览

| KMS 激活脚本生成                      | KMS 服务器检测                     | KMS 服务器状态监控                   |
| ------------------------------------- | ---------------------------------- | ------------------------------------ |
| ![](./src/assets/images/activate.png) | ![](./src/assets/images/check.png) | ![](./src/assets/images/monitor.png) |

## ✨ 技术栈

- [Nuxt](https://github.com/nuxt/nuxt) - 基于 Vue.js 的全栈 Web 应用框架
- [Vue.js](https://github.com/vuejs/core) - 渐进式 JavaScript 框架
- [Nitro](https://github.com/nitrojs/nitro) - 基于 unjs/h3 的高性能 Web 服务端框架
- [Vite](https://github.com/vitejs/vite) - 极速开发服务器和现代构建工具
- [VueUse](https://github.com/vueuse/vueuse) - 基于 Composition API 的实用函数集合
- [Tailwind CSS](https://github.com/tailwindlabs/tailwindcss) - 实用性优先的 CSS 框架
- [Arco Design Vue](https://github.com/arco-design/arco-design-vue) - 字节跳动开发的企业级产品设计系统
- [Nuxt I18n](https://github.com/nuxt-modules/i18n) - 适用于 Nuxt 的国际化支持插件

## 📦 部署

### 环境变量

| 名称                  | 示例值                      | 描述                                     |
| --------------------- | --------------------------- | ---------------------------------------- |
| `NUXT_PUBLIC_API_URL` | `https://kms.ikxin.com`     | 前端版本 API 接口地址                    |
| `MONITOR_LIST`        | `kms.org.cn,win.freekms.cn` | 自定义监控 KMS 服务器列表，使用 `,` 分隔 |
| `ENABLE_VLMCSD`       | `false`                     | 是否启用 VLMCSD 服务器检测               |

### 全栈版本

#### Zeabur（推荐）

[![Deployed on Zeabur](https://zeabur.com/deployed-on-zeabur-dark.svg)](https://zeabur.com/templates/TXR0D9)

#### Docker

```bash
docker run -d --name kms-tools -p 3000:3000 ikxin/kms-tools
```

#### 手动部署

1. 克隆项目仓库到本地，执行命令安装依赖

```bash
git clone https://github.com/ikxin/kms-tools.git
cd kms-tools && pnpm install
```

2. 执行命令构建项目

```bash
pnpm run build
```

3. 执行命令启动服务，项目默认监听 `3000` 端口

```bash
node .output/server/index.mjs
```

### 静态版本

几乎所有 SaaS 平台都支持静态网站托管服务，以下是通用的的 SaaS 平台的部署方式：

> [!WARNING]
> 注意：如果你使用的是 Cloudflare Pages，部署时需要将 `NODE_VERSION` 设置为 `22`，否则构建时会出现报错。

1. Fork 本项目仓库到自己的 Github 账户
2. 在 SaaS 平台创建项目，选择刚才 Fork 的仓库
3. 设置项目的构建命令为 `pnpm run generate`
4. 设置环境变量 `NUXT_PUBLIC_API_URL=https://kms.ikxin.com`
5. 点击部署项目即可

> [!NOTE]
> 如果在其他 SaaS 平台部署时遇到问题，欢迎提交 Issue 来获得支持。

## ⭐ 星星

<img class="w-full" src="https://starchart.cc/ikxin/kms-tools.svg" />

## 💖 赞助商

本项目 CDN 加速及安全防护由 Tencent EdgeOne 赞助。

[![](https://edgeone.ai/media/34fe3a45-492d-4ea4-ae5d-ea1087ca7b4b.png)](https://edgeone.ai/zh?from=github)

## 🧑‍💻 作者

Code with ❤️ by [一纸忘忧](https://blog.ikxin.com '一纸忘忧')

## 📜 开源协议

[MIT License](./LICENSE 'MIT License') Copyright (c) 2022 ~ Present
