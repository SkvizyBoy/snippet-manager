<div align="center">
  <img src="https://img.shields.io/badge/Tauri-v2-24C8DB?style=for-the-badge&logo=tauri&logoColor=white" alt="Tauri v2" />
  <img src="https://img.shields.io/badge/Next.js-16-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js 16" />
  <img src="https://img.shields.io/badge/Rust-1.90%2B-000000?style=for-the-badge&logo=rust&logoColor=white" alt="Rust" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge" alt="MIT License" />
</div>

<h1 align="center">Snippet Manager</h1>

<p align="center">
  <strong>Fast, private, and beautiful snippet management for developers.</strong><br />
  A lightweight cross-platform desktop app for storing, organizing, and searching code snippets without leaving your machine.
</p>

---

## Table of Contents

- [About](#about)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [System Requirements](#system-requirements)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [License](#license)
- [Powered by](#powered-by)

---

## About

Snippet Manager is a modern desktop app designed for developers who want a fast and private place to keep reusable code snippets, notes, and templates.

Instead of depending on cloud services or browser-based note tools, it keeps everything local on your machine with SQLite and a native desktop shell built with Tauri. The result is a tool that feels quick, portable, and frictionless — whether you are copying a quick utility function, storing a full project template, or organizing snippets by language, folder, and tag.

> Privacy-first by default: your code stays local, and your workflow is not tied to a remote account or subscription.

---

## Features

- 💡 Smart snippet storage — create, edit, duplicate, and organize snippets in a clean workspace.
- 🗂️ Folder-based organization — group snippets into categories with custom icons and structure.
- 🏷️ Tagging and filtering — quickly search by title, language, folder, or tag.
- ⚡ Fast local search — find the right snippet in milliseconds with a lightweight desktop experience.
- 🧠 Monaco-powered editor — code editing with syntax highlighting, IntelliSense-like tooling, and multi-language support.
- 🌗 Dark and light themes — modern UI with theme switching and polished desktop feel.
- 🔒 Local-first architecture — all data is stored in SQLite, keeping everything private and offline.
- 🪟 Cross-platform desktop app — runs smoothly on Windows, macOS, and Linux.
- 🧩 Custom window chrome — clean native desktop shell with a tailored title bar and app controls.
- 📦 Portable workflow — no dependency on a cloud backend or external account setup.

---

## Tech Stack

| Technology | Why it is used |
| --- | --- |
| [Tauri v2](https://tauri.app/) | Lightweight native desktop shell using Rust and the system WebView instead of Electron-style overhead. |
| [Next.js 16](https://nextjs.org/) | Modern frontend framework with App Router, strong DX, and scalable UI architecture. |
| [React 19](https://react.dev/) | Fast component-based UI and a modern developer experience. |
| [TypeScript](https://www.typescriptlang.org/) | Type-safe code, better maintainability, and fewer runtime surprises. |
| [Tailwind CSS v4](https://tailwindcss.com/) | Utility-first styling for a fast and consistent interface. |
| [shadcn/ui](https://ui.shadcn.com/) | Clean, accessible, and reusable UI component system. |
| [Monaco Editor](https://microsoft.github.io/monaco-editor/) | Code editing experience based on VS Code’s editor engine with syntax highlighting and editing features. |
| [SQLite](https://www.sqlite.org/) | Local, embedded database with excellent performance and privacy guarantees. |
| [Rust](https://www.rust-lang.org/) | Reliable native backend logic and secure app-level operations. |

---

## Installation

### Prerequisites

Before running the app, install the following:

- [Node.js 20+](https://nodejs.org/)
- [Rust](https://rustup.rs/) and Cargo
- Git

#### Platform-specific dependencies

- Windows: [Visual Studio C++ Build Tools](https://visualstudio.microsoft.com/visual-cpp-build-tools/) and WebView2 runtime.
- macOS: Xcode Command Line Tools.
- Linux: WebKitGTK + GTK development libraries. See the official [Tauri prerequisites guide](https://tauri.app/start/prerequisites/).

### Clone the repository

```bash
git clone https://github.com/SkvizyBoy/snippet-manager.git
cd snippet-manager
```

### Install dependencies

```bash
npm install
```

### Run in development mode

```bash
npm run tauri:dev
```

This starts the Next.js frontend and the Tauri desktop shell together for local development.

### Build the app

```bash
npm run tauri:build
```

This produces platform-specific installers in the Tauri bundle output directory, typically under:

- Windows: `src-tauri/target/release/bundle/nsis/`
- macOS: `src-tauri/target/release/bundle/dmg/`
- Linux: `src-tauri/target/release/bundle/appimage/` or `deb/`

---

## System Requirements

### Minimum

- OS: Windows 10+, macOS 12+, or Linux (glibc 2.31+ / modern Ubuntu/Debian-based systems)
- RAM: 8 GB
- Storage: 1 GB free space
- CPU: 4-core modern processor

### Recommended

- OS: Windows 11, macOS 14+, or current Ubuntu/Linux LTS
- RAM: 16 GB
- Storage: 5 GB free space
- CPU: 6-core or better

---

## Usage

1. Launch the app.
2. Create a new snippet or folder.
3. Add tags, categories, and language metadata.
4. Search instantly by title, content, or tags.
5. Edit code in Monaco and keep everything saved locally.
6. Reuse your snippets across projects without leaving the desktop environment.

### Example workflow

```bash
# Start app locally
npm run tauri:dev
```

```json
{
  "title": "Async fetch helper",
  "language": "typescript",
  "folder": "utilities",
  "tags": ["api", "fetch", "async"],
  "content": "export async function fetchData(url) {\n  const response = await fetch(url);\n  return response.json();\n}"
}
```

---

## Project Structure

```text
snippet-manager/
├── src/
│   ├── app/
│   ├── components/
│   ├── lib/
│   └── ...
├── src-tauri/
│   ├── src/
│   ├── capabilities/
│   ├── icons/
│   ├── Cargo.toml
│   └── tauri.conf.json
├── public/
├── components.json
├── package.json
├── tsconfig.json
├── next.config.ts
├── eslint.config.mjs
├── LICENSE
├── README.md
└── .github/
```

---

## License

This project is licensed under the [MIT License](LICENSE).

---

## Powered by

> This project was built using my own starter template, [tauri-nextjs-starter](https://github.com/SkvizyBoy/tauri-nextjs-starter). It gives a modern, production-ready foundation for rapidly shipping desktop apps with Tauri + Next.js, without sacrificing speed, polish, or developer ergonomics.
>
> If you want to build a similar lightweight, cross-platform desktop app with a clean React frontend and native Rust backend, this starter is a great place to start.

---

<p align="center">
  <strong>Built for developers who want their tools to be fast, local, and focused.</strong>
</p>
