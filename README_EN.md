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
  <a href="./README.md">简体中文</a>
</p>

# 📖 Introduction

An all-in-one KMS toolbox integrating features such as KMS activation script generation, KMS server detection, and KMS server status monitoring.

This project was originally born in April 2020 and was first launched on the [Hostloc Forum](https://hostloc.com/thread-669158-1-1.html). It was initially just a small tool for generating KMS activation scripts. When I was in college, I was responsible for maintaining the computer equipment in the teaching buildings and computer rooms at school, and I often needed to reinstall various versions of operating systems. This small tool improved the efficiency of activating operating systems. So in June 2022, I took out this small tool, refactored it with many new technologies, and released it again on the [Hostloc Forum](https://hostloc.com/thread-1026408-1-1.html), which received a lot of attention and support from many big shots.

Later on, I would occasionally update some features, but it was never very complete until I received two special issues "[#25](https://github.com/ikxin/kms-tools/issues/25), [#26](https://github.com/ikxin/kms-tools/issues/26)", one of which was initiated in a non-Chinese language, I did not expect a small project to get the attention of overseas friends. As my first open-source "virgin work", I decided to continue to develop and maintain it.

The original version was a pure front-end tool. In order to implement functions such as KMS detection and KMS monitoring, I used Bun + Elysia to write a backend service, dividing the entire project into a pure front-end version and a full-stack version. The front-end version can call the API interface of [kms.ikxin.com](https://kms.ikxin.com), while the full-stack version can independently deploy all functions, even including Vlmcsd as a KMS activation server.

## 📦 Online Usage

### Full-Stack Version

- Official website: [kms.ikxin.com](https://kms.ikxin.com)

### Pure Front-End Version

- Cloudflare: [kmstools.pages.dev](https://kmstools.pages.dev)
- Vercel: [kmstools.vercel.app](https://kmstools.vercel.app)

## 🌈 Feature Preview

| KMS Activation Script Generation      | KMS Server Detection               | KMS Server Status Monitoring         |
| ------------------------------------- | ---------------------------------- | ------------------------------------ |
| ![](./src/assets/images/activate.png) | ![](./src/assets/images/check.png) | ![](./src/assets/images/monitor.png) |

## 👀 Historical Versions

| v1.2.0                              | v1.0.0                              | v0.1.5                              |
| ----------------------------------- | ----------------------------------- | ----------------------------------- |
| ![](./src/assets/images/v1.2.0.png) | ![](./src/assets/images/v1.0.0.png) | ![](./src/assets/images/v0.1.5.png) |

## ✨ Technology Stack

### Backend

- <img src="./src/assets/icons/logos/bun.svg" /> [Bun](https://github.com/oven-sh/bun) - An all-in-one toolkit for JavaScript and TypeScript applications
- <img src="./src/assets/icons/logos/drizzle.svg" /> [Drizzle ORM](https://github.com/drizzle-team/drizzle-orm) - The next-generation headless TypeScript ORM framework
- <img src="./src/assets/icons/logos/elysia.svg" /> [Elysia](https://github.com/elysiajs/elysia) - An ergonomic web framework for building backend servers with Bun

### Frontend

- <img src="./src/assets/icons/logos/vue.svg" /> [Vue.js](https://github.com/vuejs/core) - A JavaScript framework for building user interfaces
- <img src="./src/assets/icons/logos/vite.svg" /> [Vite](https://github.com/vitejs/vite) - The next-generation front-end build tool
- <img src="./src/assets/icons/logos/arco.svg" /> [Arco Design Vue](https://github.com/arco-design/arco-design-vue) - ByteDance's enterprise-level product design system developed by
- <img src="./src/assets/icons/logos/vue-router.svg" /> [Vue Router](https://github.com/vuejs/vue-router) - A routing component developed by the Vue.js core team
- <img src="./src/assets/icons/logos/pinia.svg" /> [Pinia](https://github.com/vuejs/pinia) - A state management library with type safety, scalability, and modular design
- <img src="./src/assets/icons/logos/unocss.svg" /> [UnoCSS](https://github.com/unocss/unocss) - An instant on-demand atomic CSS engine
- <img src="./src/assets/icons/logos/vueuse.svg" /> [VueUse](https://github.com/vueuse/vueuse) - A collection of utility functions based on the Composition API
- <img src="./src/assets/icons/logos/vue-i18n.svg" /> [Vue I18n](https://github.com/intlify/vue-i18n-next) - I18n international language support
- <img src="./src/assets/icons/logos/unjs.svg" /> [unplugin-auto-import](https://github.com/antfu/unplugin-auto-import) - A plugin for automatically importing Composition API on demand
- <img src="./src/assets/icons/logos/unjs.svg" /> [unplugin-vue-components](https://github.com/antfu/unplugin-vue-components) - A plugin for automatically importing Vue components on demand
- <img src="./src/assets/icons/logos/unjs.svg" /> [unplugin-vue-router](https://github.com/posva/unplugin-vue-router) - A Vue Router auto-import based on file-based route system
- <img src="./src/assets/icons/logos/markdown.svg" /> [unplugin-vue-markdown](https://github.com/unplugin/unplugin-vue-markdown) - Markdown document support

## 📦 Local Build

Whether it is a full-stack version or a pure front-end version, it is necessary to rely on Bun for building. Use the following scripts to install the Bun environment locally.

Linux & macOS:

```bash
curl -fsSL https://bun.sh/install | bash
```

Windows:

```bash
powershell -c "irm bun.sh/install.ps1 | iex"
```

Next, clone the project to the local and execute the command to install dependencies

```bash
git clone https://github.com/ikxin/kms-tools.git
cd kms-tools && bun install
```

### Full-Stack Version

1. Create a MySQL database and use the following SQL to create the table structure

```sql
CREATE TABLE `logs` (
  `id` int AUTO_INCREMENT NOT NULL,
  `host` text NOT NULL,
  `delay` int NOT NULL DEFAULT 0,
  `content` text,
  `status` boolean NOT NULL DEFAULT false,
  `created_at` timestamp NOT NULL,
  CONSTRAINT `logs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `server` (
  `id` int AUTO_INCREMENT NOT NULL,
  `host` text NOT NULL,
  `port` int NOT NULL DEFAULT 1688,
  `total` int NOT NULL DEFAULT 0,
  `success` int NOT NULL DEFAULT 0,
  `fail` int NOT NULL DEFAULT 0,
  `delay` float NOT NULL DEFAULT 0,
  `rate` float NOT NULL DEFAULT 0,
  `updated_at` timestamp,
  `created_at` timestamp,
  CONSTRAINT `server_id` PRIMARY KEY(`id`)
);
```

2. Rename the `.env.example` file to `.env` and modify the configuration items in it

```ini
ENABLE_VLMCSD = false # Whether to enable the Vlmcsd service
PORT = 3000 # Service port
DATABASE_URL = 'mysql://root:password@localhost:3306/database' # Database connection address
```

3. Run the following command to start the service

```bash
bun run service
```

### Pure Front-End Version

1. Use the following command to build the project

```bash
bun run build
```

2. Run the following command to start the service

```bash
npx serve dist
```

## ⭐ Stars

<img class="w-full" src="https://starchart.cc/ikxin/kms-tools.svg" />

## 🧑‍💻 Author

Code with ❤️ by [ikxin](https://blog.ikxin.com 'ikxin')

## 📜 Open Source License

[MIT License](./LICENSE 'MIT License') Copyright (c) 2022 ~ Present
