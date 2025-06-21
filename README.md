# 📊 Log Analytics Platform

A modern full-stack log analytics platform that lets you upload, parse, and visualize structured log data in real-time. Built with **Node.js**, **Next.js**, **Redis**, and **Supabase**, and fully containerized with **Docker** for local or cloud deployment.

---

## 🚀 Features

- 📥 **Log Uploading**: Upload structured logs via a clean UI.
- ⚙️ **Background Processing**: Uses Redis queues for efficient background jobs.
- 📊 **Analytics Dashboard**: Real-time log insights via charts and summaries.
- 🔐 **Rate Limiting & CORS**: Built-in security best practices.
- ☁️ **Cloud Ready**: Easily deploy to services like Fly.io, Render, or Vercel.

---

## 🗂 Project Structure

```
log-analytics/
├── backend/            # Node.js + Express server with Redis + Supabase
├── frontend/           # Next.js dashboard UI
├── docker-compose.yml
├── package.json        # Shared scripts/deps (optionally move logic to each service)
├── .github/            # CI/CD (CodeQL, Dependabot, etc.)
└── README.md
```
