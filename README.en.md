<p align="center">
  <img width="400" src="./src/assets/images/readme-logo.svg" />
</p>

<p align="center">
  <a href="https://github.com/ikxin/kms-tools/releases"><img src="https://img.shields.io/github/v/release/ikxin/kms-tools?style=flat-square" /></a>
  <a href="https://github.com/ikxin/kms-tools/actions/workflows/ci.yml"><img src="https://img.shields.io/github/actions/workflow/status/ikxin/kms-tools/ci.yml?style=flat-square&label=CI" /></a>
  <a href="https://hub.docker.com/r/ikxin/kms-tools"><img src="https://img.shields.io/docker/pulls/ikxin/kms-tools?style=flat-square" /></a>
  <a href="https://github.com/ikxin/kms-tools/stargazers"><img src="https://img.shields.io/github/stars/ikxin/kms-tools?style=flat-square" /></a>
  <a href="https://github.com/ikxin/kms-tools/network/members"><img src="https://img.shields.io/github/forks/ikxin/kms-tools?style=flat-square" /></a>
  <a href="https://github.com/ikxin/kms-tools/blob/main/LICENSE"><img src="https://img.shields.io/github/license/ikxin/kms-tools?style=flat-square" /></a>
</p>

<p align="center">
  <a href="./README.md">简体中文</a> | <a href="./README.en.md">English</a>
</p>

## 📖 Introduction

KMS Tools is an all-in-one KMS toolbox built with the Nuxt 4 full-stack framework. It integrates KMS activation script generation, KMS server detection, and KMS server status monitoring.

> [!NOTE]
> This project relies on Node.js `child_process` module to invoke `vlmcs` binaries for KMS detection. It cannot run on pure static hosting platforms like GitHub Pages, so it provides both a full-stack version and a static version.

## ✨ Features

- 🔑 **KMS Activation Script Generation** - One-click generation of KMS activation scripts for Windows / Windows Server / Office
- 🔍 **KMS Server Check** - Real-time detection of KMS server availability and response time
- 📊 **KMS Server Monitoring** - Continuous monitoring of multiple KMS servers with visual charts
- 🌍 **Internationalization** - Support for Simplified Chinese and English
- 🌗 **Dark Mode** - Light / Dark / System theme modes
- 🐳 **Docker Deployment** - Ready-to-use Docker images for AMD64 and ARM64 architectures

## 🌈 Preview

| KMS Activation Script                 | KMS Server Check                   | KMS Server Monitoring                |
| ------------------------------------- | ---------------------------------- | ------------------------------------ |
| ![](./src/assets/images/activate.png) | ![](./src/assets/images/check.png) | ![](./src/assets/images/monitor.png) |

## 📦 Demo

### Full-Stack Version

https://kms.ikxin.com

### Static Version

The static version uses https://kms.ikxin.com API by default. You can deploy your own full-stack version and set the `NUXT_PUBLIC_API_URL` environment variable.

| Platform   | Demo URL                      |
| ---------- | ----------------------------- |
| Vercel     | https://kms-tools.vercel.app  |
| Cloudflare | https://kmstools.pages.dev    |
| Netlify    | https://kms-tools.netlify.app |

## 🛠️ Tech Stack

| Technology                                                        | Description                                            |
| ----------------------------------------------------------------- | ------------------------------------------------------ |
| [Nuxt](https://github.com/nuxt/nuxt)                              | Full-stack web application framework based on Vue.js   |
| [Vue.js](https://github.com/vuejs/core)                           | Progressive JavaScript framework                       |
| [Nitro](https://github.com/nitrojs/nitro)                         | High-performance web server framework based on unjs/h3 |
| [Vite](https://github.com/vitejs/vite)                            | Fast dev server and modern build tool                  |
| [TypeScript](https://github.com/microsoft/TypeScript)             | JavaScript superset with type system                   |
| [Tailwind CSS](https://github.com/tailwindlabs/tailwindcss)       | Utility-first CSS framework                            |
| [Arco Design Vue](https://github.com/arco-design/arco-design-vue) | Enterprise-level design system by ByteDance            |
| [ECharts](https://github.com/apache/echarts)                      | Feature-rich interactive charting library              |
| [VueUse](https://github.com/vueuse/vueuse)                        | Collection of essential Composition API utilities      |
| [Nuxt I18n](https://github.com/nuxt-modules/i18n)                 | Internationalization plugin for Nuxt                   |

## 📦 Deployment

### Environment Variables

| Name                       | Example                     | Description                                                            |
| -------------------------- | --------------------------- | ---------------------------------------------------------------------- |
| `NUXT_PUBLIC_API_URL`      | `https://kms.ikxin.com`     | API URL for the static version                                         |
| `NUXT_MONITOR_LIST`        | `kms.org.cn,win.freekms.cn` | Custom KMS server monitoring list, separated by `,`                    |
| `NUXT_MONITOR_INTERVAL`    | `10`                        | Monitoring interval in seconds, default is 10                          |
| `NUXT_ENABLE_VLMCSD`       | `false`                     | Whether to enable the built-in VLMCSD service                          |
| `PORT`                     | `3000`                      | Server listening port (also accepts `NITRO_PORT`)                      |

> [!NOTE]
> The production server (`node .output/server/index.mjs`) does **not** automatically load `.env` files. Environment variables must be set in the system environment or your deployment platform before starting the server. The `.env` file is only used during development and the build phase.

### Full-Stack Version

#### Docker (Recommended)

Using Docker Compose:

```yaml
services:
  kms-tools:
    image: ikxin/kms-tools:latest
    container_name: kms-tools
    ports:
      - 3000:3000
      - 1688:1688
    volumes:
      - kms-data:/app/.data
    environment:
      - NUXT_MONITOR_LIST=kms.org.cn,win.freekms.cn
    restart: unless-stopped

volumes:
  kms-data:
```

Or using Docker CLI:

```bash
docker run -d \
  --name kms-tools \
  -p 3000:3000 \
  -p 1688:1688 \
  -v kms-data:/app/.data \
  ikxin/kms-tools:latest
```

The image is also available from GitHub Container Registry:

```bash
docker pull ghcr.io/ikxin/kms-tools:latest
```

#### Zeabur

[![Deployed on Zeabur](https://zeabur.com/deployed-on-zeabur-dark.svg)](https://zeabur.com/templates/TXR0D9)

#### Manual Deployment

1. Clone the repository and install dependencies

```bash
git clone https://github.com/ikxin/kms-tools.git
cd kms-tools && pnpm install
```

2. Build the project

```bash
pnpm run build
```

3. Start the service (default port: `3000`), configurable via the `PORT` environment variable

```bash
node .output/server/index.mjs
```

To set a custom port and monitor list, pass environment variables at startup:

```bash
PORT=3512 NUXT_MONITOR_LIST=kms.example.com node .output/server/index.mjs
```

### Static Version

Most SaaS platforms support static website hosting. Here's the general approach:

> [!WARNING]
> If using Cloudflare Pages, set `NODE_VERSION` to `22` to avoid build errors.

1. Fork this repository to your GitHub account
2. Create a project on the SaaS platform and select the forked repository
3. Set the build command to `pnpm run generate`
4. Set the environment variable `NUXT_PUBLIC_API_URL=https://kms.ikxin.com`
5. Deploy the project

> [!NOTE]
> If you encounter issues deploying on other SaaS platforms, please submit an [Issue](https://github.com/ikxin/kms-tools/issues).

## 🔧 Local Development

```bash
# Clone the project
git clone https://github.com/ikxin/kms-tools.git
cd kms-tools

# Install dependencies
pnpm install

# Start development server
pnpm run dev

# Build for production
pnpm run build

# Generate static version
pnpm run generate
```

## 🤝 Contributing

Contributions of all kinds are welcome! Please read the [Contributing Guide](./CONTRIBUTING.md) first.

1. Fork this repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## ⭐ Star History

<img class="w-full" src="https://starchart.cc/ikxin/kms-tools.svg" />

## 💖 Sponsors

CDN acceleration and security protection for this project are sponsored by Tencent EdgeOne.

[![](https://edgeone.ai/media/34fe3a45-492d-4ea4-ae5d-ea1087ca7b4b.png)](https://edgeone.ai?from=github)

## 📄 License

This project is licensed under the [MIT License](./LICENSE).

## 🧑‍💻 Author

Code with ❤️ by [一纸忘忧](https://blog.ikxin.com '一纸忘忧')
