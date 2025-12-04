# 🚦 Auth0 + React Router v7 + Bun Example

A modern, fun, and production-ready template for building full-stack React applications using [Auth0](https://auth0.com/), [React Router](https://reactrouter.com/), and [Bun](https://bun.sh/) for super-fast development and secure authentication.

Built for speed, simplicity, secure authentication, and developer happiness! 🦄✨

## ✨ Features

- 🚀 Server-side rendering
- ⚡️ Hot Module Replacement (HMR)
- 📦 Asset bundling and optimization
- 🔄 Data loading and mutations
- 🔒 TypeScript by default
- 🎉 TailwindCSS for styling
- 📖 [React Router docs](https://reactrouter.com/)

## 🏁 Getting Started

### 📦 Installation

Install the dependencies with Bun:

```bash
bun install
```

### 🛠️ Development

Start the development server with HMR:

```bash
bun run dev
```

Your application will be available at `http://localhost:5173`.

## 🏗️ Building for Production

Create a production build:

```bash
bun run build
```

## 🚀 Deployment

### 🐳 Docker Deployment

To build and run using Docker:

```bash
docker build -t my-app .

# Run the container
docker run -p 3000:3000 my-app
```

The containerized application can be deployed to any platform that supports Docker, including:

- AWS ECS
- Google Cloud Run
- Azure Container Apps
- Digital Ocean App Platform
- Fly.io
- Railway

### 🛠️ DIY Deployment

If you're familiar with deploying Node/Bun applications, the built-in app server is production-ready.

Make sure to deploy the output of `bun run build`

```

├── package.json
├── bun.lockb
├── build/
│   ├── client/    # Static assets
│   └── server/    # Server-side code
```

## 🎨 Styling

This template comes with [Tailwind CSS](https://tailwindcss.com/) already configured for a simple default starting experience. You can use whatever CSS framework you prefer.

---

---

Built with ❤️, Bun 🥟, and React Router 🚦.
