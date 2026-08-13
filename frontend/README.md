# Frontend

Vite + React + TypeScript client for X-clone. Talks to the Express API over REST and Socket.IO.

---

## Stack

- React 19 + TypeScript
- Vite
- React Router 8
- Tailwind CSS 4
- Socket.IO client
- Lucide icons

---

## Getting started

```bash
cd frontend
npm install
```

Create a `.env` with:

```env
VITE_BACKEND=http://localhost:3000
```

Use the same origin/port as the running backend.

```bash
npm run dev
```

Other scripts:

| Script | Description |
|--------|-------------|
| `npm run dev` | Vite dev server |
| `npm run build` | Typecheck + production build to `dist/` |
| `npm run preview` | Preview the production build |
| `npm run lint` | ESLint |

---

## Environment variables

| Variable | Description |
|----------|-------------|
| `VITE_BACKEND` | Public backend base URL (no trailing slash). Used for `fetch`, OAuth redirects, and Socket.IO |

Vite inlines `VITE_*` at **build** time. After changing Netlify env vars, trigger a new deploy/build.

---

## Application routes

Defined in `src/main.tsx` under the `App` layout. Unauthenticated users see `Login` (auth gate in `App.tsx`).

| Path | Component | Description |
|------|-----------|-------------|
| `/` | `Content` | Home feed (For You / Following), composer |
| `/post/:postId` | `PostDetail` | Single post + comments |
| `/profile/:userId` | `Profile` | Profile, posts, follow lists |
| `/follow` | `Follow` | Discover / follow people |
| `/chat` | `Chat` | Direct messages |
| `/login` | `Login` | Explicit login route (also shown when logged out) |

Unknown routes and thrown route errors use `ErrorPage` (`errorElement` on the root route).

`Index` wraps most pages: main column + optional right sidebar (sidebar hidden on `/chat`). Active chat tabs are lifted into `Index` so they survive navigation away from Chat.

---

## Auth on the client

`src/AuthContext.tsx` owns session state.

| Piece | Storage | Role |
|-------|---------|------|
| Access token | React state / ref (memory) | `Authorization: Bearer` on API calls |
| Refresh token | `localStorage` key `refreshToken` | Survive reload; sent on `POST /refresh` |
| User | React state | UI gate + profile chrome |

### Flows

**Guest**

1. `POST {VITE_BACKEND}/auth/guest`
2. `loginWithSession(accessToken, user, refreshToken)` writes refresh to `localStorage`

**GitHub**

1. Full-page navigate to `{VITE_BACKEND}/auth/github`
2. Backend finishes OAuth and redirects to `/?rt=<refreshToken>`
3. Bootstrap reads `rt`, stores it, strips it from the URL, then refreshes access + loads `/users/me`

**Bootstrap / silent renew**

- On mount: `POST /refresh` with `{ refreshToken }` from `localStorage` (cookies still sent with `credentials: "include"` when present)
- `authFetch` retries once via `/refresh` after `401`

**Logout**

- `POST /logout` with stored refresh token
- Clears `localStorage` + in-memory access token + user

This dual cookie + `localStorage` approach is what makes guest (and OAuth) sessions survive refresh on Safari despite cross-site cookie limits between Netlify and Railway. See the [root README](../README.md) for context.

---

## Realtime chat

`src/sockets.ts` creates a Socket.IO client pointed at `VITE_BACKEND` (`autoConnect: false`, `withCredentials: true`).

`Chat.tsx`:

1. Loads or creates a thread with `GET /chats/:targetUserId`
2. Connects and `emit('join_chat', chatId)`
3. Sends via REST, then `emit('send_message', message)`
4. Listens for `receive_message` to update the open conversation

---

## Notable UI pieces

| File | Role |
|------|------|
| `Login.tsx` | Guest + GitHub entry |
| `Navbar.tsx` | Fixed nav; icon rail on small screens |
| `Content.tsx` | Feed tabs, inline compose, likes, replies |
| `PostComposerModal.tsx` | Modal composer from nav |
| `ReplyModal.tsx` | Comment composer |
| `Profile.tsx` | Banner, follow, posts / following / followers |
| `Follow.tsx` | Suggestions |
| `Chat.tsx` | DM list + conversation (stacked on mobile) |
| `RightSidebar.tsx` | Who to follow (wide screens) |
| `ErrorPage.tsx` | Simple not-found / error surface |
| `XLogo.tsx` | Brand mark |

---

## Project layout

```
frontend/
├── netlify.toml
├── index.html
├── package.json
└── src/
    ├── main.tsx
    ├── App.tsx
    ├── AuthContext.tsx
    ├── sockets.ts
    ├── index.css
    └── components/
```

---

## Deployment (Netlify)

`netlify.toml` (repo-aware when the site root is the monorepo):

- `base = "frontend/"`
- `command = npm run build`
- `publish = dist`
- SPA fallback: `/*` → `/index.html` (status 200)

Set `VITE_BACKEND` in the Netlify UI to the public Railway API URL, then deploy.

No API reverse-proxy is required for auth when refresh tokens are stored in `localStorage`.
