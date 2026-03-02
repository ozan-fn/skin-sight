# 🔬 SkinSight

A modern, clinical-grade health technology platform for skin analysis. Built with **React 19**, **Express 5**, and **Prisma**, powered by **Rsbuild** for extreme performance.

## ✨ Features

- **⚛️ React 19**: Latest features like Actions and improved transitions.
- **⚡ Rsbuild**: Next-generation build tool based on Rspack, offering extreme performance (Vite compatibility with faster build speeds).
- **🚂 Express 5**: Modern, fast, and unopinionated backend router.
- **🎨 Tailwind CSS 4**: The latest utility-first CSS framework for rapid styling.
- **🧩 Shadcn UI**: Beautiful, accessible, and customizable UI components using Radix UI.
- **🛠️ Fully Typed**: Written in **TypeScript** for better developer experience and type safety.
- **🚀 Vercel Ready**: Preconfigured with `vercel.json` for serverless deployment of both frontend and backend.

## 📂 Project Structure

```text
├── src/
│   ├── components/    # Reusable UI components (Shadcn)
│   ├── lib/           # Utility functions
│   ├── server/        # Express backend entry (main.ts)
│   ├── App.tsx        # Main React component
│   ├── index.tsx      # Client-side entry point
│   └── styles.css     # Global styles with Tailwind 4
├── public/            # Static assets
├── rsbuild.config.ts  # Build configuration
└── vercel.json        # Vercel deployment configuration
```

## 🛠️ Getting Started

### 1. Prerequisites

Ensure you have **Node.js 20+** and **npm/pnpm/yarn** installed.

### 2. Installation

```bash
git clone https://github.com/ozan-fn/skin-sight.git
cd skin-sight
cp .env.example .env
npm install
```

Edit the `.env` file to add your database connection string and other secrets.

### 3. Development

Start the development server (Frontend at port 3000, API at /api/\*):

```bash
npm run dev
```

### 4. Production Build

Build both frontend and backend for production:

```bash
npm run build
```

### 5. Preview Locally

Preview the production build:

```bash
npm run preview
```

## 🚀 Deployment

This project is ready to be deployed on **Vercel** with one click.

1. Push your code to GitHub.
2. Connect your repository to Vercel.
3. Vercel will automatically detect the configuration in `vercel.json`.
4. Your frontend will be served as static files, and your Express backend will run as a Serverless Function.

## 📜 License

This project is licensed under the [MIT License](LICENSE).
