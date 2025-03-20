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
  <a href="./README_ZH.md">简体中文</a>
</p>

## 📖 Introduction

An all-in-one KMS toolbox that integrates features such as KMS activation script generation, KMS server detection, and KMS server status monitoring.

## 📦 Project Demo

### Full-Stack Version

Thanks to [Zebaur](https://zeabur.com/referral?referralCode=ikxin&utm_source=ikxin&utm_campaign=oss) for providing services for project deployment.

- [kms.ikxin.com](https://kms.ikxin.com)

### Frontend Version

By default, it calls the API interface of [kms.ikxin.com](https://kms.ikxin.com), but you can also deploy your own backend service.

- Cloudflare: [kmstools.pages.dev](https://kmstools.pages.dev)
- Vercel: [kmstools.vercel.app](https://kmstools.vercel.app)
- Netlify: [kms-tools.netlify.app](https://kms-tools.netlify.app)

## 🌈 Feature Preview

| KMS Activation Script Generation      | KMS Server Detection               | KMS Server Status Monitoring         |
| ------------------------------------- | ---------------------------------- | ------------------------------------ |
| ![](./src/assets/images/activate.png) | ![](./src/assets/images/check.png) | ![](./src/assets/images/monitor.png) |

## ✨ Tech Stack

- [Nuxt](https://github.com/nuxt/nuxt) - Full-stack web application framework based on Vue.js
- [Vue.js](https://github.com/vuejs/core) - Progressive JavaScript framework
- [Nitro](https://github.com/nitrojs/nitro) - High-performance web server framework based on unjs/h3
- [Vite](https://github.com/vitejs/vite) - Fast development server and modern build tool
- [VueUse](https://github.com/vueuse/vueuse) - Collection of utility functions based on the Composition API
- [Tailwind CSS](https://github.com/tailwindlabs/tailwindcss) - Utility-first CSS framework
- [Arco Design Vue](https://github.com/arco-design/arco-design-vue) - Enterprise-level product design system by ByteDance
- [Nuxt I18n](https://github.com/nuxt-modules/i18n) - Internationalization support plugin for Nuxt

## 📦 Deployment

### Full-Stack Version

#### Zeabur Deployment

[![Deployed on Zeabur](https://zeabur.com/deployed-on-zeabur-dark.svg)](https://zeabur.com/templates/TXR0D9)

#### Docker Deployment

```bash
docker run -d --name kms-tools -p 3000:3000 ikxin/kms-tools
```

#### Manual Deployment

1. Clone the project repository to your local machine and install dependencies

```bash
git clone https://github.com/ikxin/kms-tools.git
cd kms-tools && pnpm install
```

2. Build the project

```bash
pnpm run build
```

3. Start the server (listening on port `3000` by default)

```bash
node .output/server/index.mjs
```

### Frontend Version

#### Cloudflare Deployment

1. Fork this project to your own repository

2. Create a project on Cloudflare Pages and select the forked repository

3. Set the build command

```bash
pnpm run generate
```

4. Configure environment variables

| Name                  | Value                   |
| --------------------- | ----------------------- |
| `NODE_VERSION`        | `22`                    |
| `NUXT_PUBLIC_API_URL` | `https://kms.ikxin.com` |

5. Deploy the project

#### Vercel Deployment

1. Fork this project to your own repository

2. Create a project on Vercel and select the forked repository

3. Set the build command

```bash
pnpm run generate
```

4. Configure environment variables

| Name                  | Value                   |
| --------------------- | ----------------------- |
| `NUXT_PUBLIC_API_URL` | `https://kms.ikxin.com` |

5. Deploy the project

#### Netlify Deployment

1. Fork this project to your own repository

2. Create a project on Netlify and select the forked repository

3. Set the build command

```bash
pnpm run generate
```

4. Configure environment variables

| Name                  | Value                   |
| --------------------- | ----------------------- |
| `NUXT_PUBLIC_API_URL` | `https://kms.ikxin.com` |

5. Deploy the project

#### Manual Deployment

1. Clone the project repository to your local machine and install dependencies

```bash
git clone https://github.com/ikxin/kms-tools.git
cd kms-tools && pnpm install
```

2. Build the project

```bash
pnpm run generate
```

3. After building, upload the files from the `.output/public` directory to your server

## ⭐ Stars

<img class="w-full" src="https://starchart.cc/ikxin/kms-tools.svg" />

## 🧑‍💻 Author

Code with ❤️ by [一纸忘忧](https://blog.ikxin.com '一纸忘忧')

## 📜 License

[MIT License](./LICENSE 'MIT License') © 2022 ~ Present
