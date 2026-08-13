# X-clone

A full-stack clone of X (formerly Twitter) focused on core social features: authentication, feed, likes, comments, follows, profiles, and realtime direct messages.

This repository is a **monorepo**. The frontend and backend live in separate folders and are developed, configured, and deployed independently.

```
X-clone/
├── frontend/     # Vite + React + TypeScript (Netlify)
├── backend/      # Express + Prisma + Socket.IO (Railway)
└── README.md     # You are here
```

For package-specific setup, see:

- [frontend/README.md](./frontend/README.md)
- [backend/README.md](./backend/README.md)

---

## Features

- GitHub OAuth sign-in (Passport)
- Guest sign-in for quick demos
- JWT access tokens (short-lived) + refresh tokens (longer-lived)
- Session persistence across browsers, including Safari (see Auth notes below)
- Home feed (For You / Following)
- Create, edit, and delete posts
- Likes and comments
- Follow / unfollow and profile pages
- Direct messages with Socket.IO realtime updates
- Responsive layout for desktop and mobile

---

## Tech stack

| Layer | Stack |
|-------|--------|
| Frontend | React 19, TypeScript, Vite, React Router, Tailwind CSS, Socket.IO client |
| Backend | Node.js, Express, Passport (GitHub strategy), JSON Web Tokens, Socket.IO |
| Database | PostgreSQL via Prisma ORM |
| Deploy | Frontend on Netlify, backend on Railway |

---

## Architecture overview

```
Browser (Netlify)
    |  REST (Bearer access token)
    |  Socket.IO
    v
Express API (Railway)  <-->  PostgreSQL
    ^
    |  GitHub OAuth redirect
 GitHub
```

- Protected API routes require `Authorization: Bearer <accessToken>`.
- Refresh tokens are stored in the database and also kept client-side (see Auth) so sessions survive page reload when cross-site cookies are blocked.
- Chat uses HTTP to load history and Socket.IO rooms for live message delivery.

---

## Auth design (and Safari ITP)

Production splits the app across two origins (Netlify frontend + Railway backend). That is **cross-site** from the browser’s point of view.

- Access tokens live in memory and are sent as Bearer headers.
- Refresh tokens are issued as httpOnly cookies (`SameSite=None; Secure`) **and** returned to the client for storage in `localStorage`.
- On bootstrap / 401 retry, the client `POST`s `/refresh` with the stored refresh token (cookie is still accepted when the browser allows it).

**Why both cookie and `localStorage`?**  
Chrome often accepts cross-site cookies after `trust proxy` and correct cookie flags. Safari’s Intelligent Tracking Prevention (ITP) frequently blocks those third-party cookies, which drops the session on refresh. Returning the refresh token in the response body (guest JSON, GitHub `?rt=` handoff) and persisting it in `localStorage` keeps guests and OAuth users logged in on Safari and mobile without requiring a shared custom domain.

A custom domain (`app.example.com` + `api.example.com`) remains the cleaner long-term cookie model. This project documents the practical compromise used for free-tier split hosting.

---

## Local development

There is no Docker Compose setup. Run each package in its own terminal.

### Prerequisites

- Node.js (LTS recommended)
- PostgreSQL database (local or hosted)
- GitHub OAuth App (Homepage = frontend URL, callback = `{BACKEND_URL}/auth/github/callback`)

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env   # if present; otherwise create .env from backend/README.md
npx prisma migrate deploy
npm start
```

Default local API URL should match whatever you set in the frontend (`VITE_BACKEND`), commonly `http://localhost:3000` or `http://localhost:5200`.

### 2. Frontend

```bash
cd frontend
npm install
# set VITE_BACKEND to your running API URL
npm run dev
```

Open the Vite URL (usually `http://localhost:5173`).

Detailed environment variables and scripts: see each package README.

---

## Production deployment

| Service | Host | Notes |
|---------|------|--------|
| `frontend/` | Netlify | Build from `frontend/`; SPA fallback in `netlify.toml` |
| `backend/` | Railway | `npm start` runs migrations then `node app.js`; bind `0.0.0.0` |

Align these across dashboards:

- Backend `FRONTEND_URL` = Netlify site URL (CORS + OAuth redirects)
- Backend `BACKEND_URL` = Railway public URL (GitHub callback base)
- Frontend `VITE_BACKEND` = Railway public URL (rebuild after changing)

---

## Project status

Built as a learning / portfolio project: core product flows work end-to-end, including guest session persistence on Safari after production deploy.
