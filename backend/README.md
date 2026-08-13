# Backend

Express API and Socket.IO server for X-clone. Handles authentication, REST resources, and realtime chat rooms. Uses Prisma with PostgreSQL.

---

## Stack

- Node.js + Express 5
- Passport.js (`passport-github2`)
- `jsonwebtoken` (access + refresh)
- Prisma 7 + PostgreSQL
- Socket.IO
- `cookie-parser`, `cors`

---

## Getting started

```bash
cd backend
npm install
```

`postinstall` runs `prisma generate`.

Create a `.env` file (see [Environment variables](#environment-variables)), then:

```bash
npx prisma migrate deploy
npm start
# equivalent: npx prisma migrate deploy && node app.js
```

For iterative schema work locally:

```bash
npx prisma migrate dev
node app.js
```

Optional demo data (destructive wipe + fake users):

```bash
node seeds.js
```

---

## Environment variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | yes | PostgreSQL connection string |
| `PORT` | yes (prod) | HTTP + Socket.IO listen port |
| `FRONTEND_URL` | yes | Allowed CORS origin; OAuth success/error redirects |
| `BACKEND_URL` | yes | Public API origin; GitHub callback = `{BACKEND_URL}/auth/github/callback` |
| `GITHUB_CLIENT_ID` | yes | GitHub OAuth App client ID |
| `GITHUB_CLIENT_SECRET` | yes | GitHub OAuth App client secret |
| `ACCESS_TOKEN_SECRET` | yes | Signs short-lived access JWTs (~15m) |
| `REFRESH_TOKEN_SECRET` | yes | Signs refresh JWTs (~2d) |

Also enable `trust proxy` in production behind Railway (already set in `app.js`) so Secure cookies see HTTPS correctly when a reverse proxy terminates TLS.

---

## Auth flow

### Public routes (no Bearer token)

Mounted before `verifyJWT`:

- `/auth/*`
- `/refresh`
- `/logout`

### Protected routes

All `/users`, `/posts`, `/chats`, `/comments` require:

```http
Authorization: Bearer <accessToken>
```

### GitHub OAuth

1. Client navigates to `GET /auth/github`
2. GitHub redirects to `GET /auth/github/callback`
3. User is upserted (GitHub profile id used as user id)
4. Access + refresh JWTs are created; refresh is stored on the user row
5. httpOnly cookie `jwt` is set (`Secure`, `SameSite=None`)
6. Browser redirects to `{FRONTEND_URL}/?rt=<refreshToken>` so Safari-friendly clients can persist refresh in `localStorage`

### Guest sign-in

`POST /auth/guest` creates a unique guest user and returns:

```json
{
  "accessToken": "...",
  "refreshToken": "...",
  "user": { "id": 1, "username": "guestUser_ab12cd34", "fullName": "Guest", "email": "...", "picture": null }
}
```

Cookie is still set when the browser accepts it.

### Refresh

`GET` or `POST /refresh`

Accepts refresh token from:

1. Cookie `jwt`, or
2. JSON body `{ "refreshToken": "..." }`

Response:

```json
{ "accessToken": "..." }
```

### Logout

`GET` or `POST /logout`

Clears the DB refresh token and the `jwt` cookie. Body `{ "refreshToken": "..." }` is supported when cookies are unavailable.

Dual GET/POST exists so cookie-based and body-based clients can share one controller during the Safari ITP workaround.

---

## HTTP API map

Base URL = your `BACKEND_URL` (local or Railway).

### Auth

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/auth/github` | public | Start GitHub OAuth |
| GET | `/auth/github/callback` | public | OAuth callback |
| POST | `/auth/guest` | public | Create guest session |
| GET, POST | `/refresh` | public | Issue new access token |
| GET, POST | `/logout` | public | Invalidate refresh session |

### Users

| Method | Path | Description |
|--------|------|-------------|
| GET | `/users/me` | Current user |
| GET | `/users/all` | Users for chat search |
| GET | `/users/suggestions` | Follow suggestions |
| GET | `/users/:userId` | Public profile |
| GET | `/users/:userId/following` | Following list |
| GET | `/users/:userId/followers` | Followers list |
| GET | `/users/:targetUserId/follow` | Toggle follow |

### Posts

| Method | Path | Description |
|--------|------|-------------|
| GET | `/posts/` | Feed (For You style) |
| GET | `/posts/following` | Following feed |
| GET | `/posts/me` | Current user’s posts |
| GET | `/posts/liked` | Liked posts |
| GET | `/posts/:userId` | Posts by user |
| POST | `/posts/` | Create post (`text` form body) |
| PUT | `/posts/:postId` | Edit post |
| DELETE | `/posts/:postId` | Delete post |
| GET | `/posts/:postId/like` | Toggle like |

### Comments

| Method | Path | Description |
|--------|------|-------------|
| GET | `/comments/:postId` | Comments on a post |
| GET | `/comments/users/:userId` | Comments by user |
| POST | `/comments/:postId` | Create comment |
| PUT | `/comments/:commentId` | Edit comment |
| DELETE | `/comments/:commentId` | Delete comment |

### Chats

| Method | Path | Description |
|--------|------|-------------|
| GET | `/chats/:targetUserId` | Find or create DM thread + messages |
| POST | `/chats/:chatId/messages` | Send message (HTTP); client also emits Socket.IO |
| PUT | `/chats/messages/:messageId` | Edit message |

---

## Socket.IO

The HTTP server and Socket.IO share the same process (`app.js`).

CORS mirrors `FRONTEND_URL` with credentials enabled.

| Event | Direction | Payload | Behavior |
|-------|-----------|---------|----------|
| `join_chat` | client → server | `chatId` | Join room `chat_<id>` |
| `leave_chat` | client → server | `chatId` | Leave room |
| `send_message` | client → server | message object incl. `chatId` | Broadcast `receive_message` to room (excluding sender) |
| `receive_message` | server → client | message object | Append in open chat UI |
| `disconnect` | — | — | Connection closed |

Typical client flow: open chat via REST → `join_chat` → POST message → `emit('send_message', data)` → peers receive `receive_message`.

---

## Data model (Prisma)

- **User** — identity, optional `refreshToken`, profile fields, social graph
- **Post** — text body, author, timestamps
- **Comment** — belongs to post + user
- **Like** — unique `(userId, postId)`
- **Chat** — many-to-many users
- **Message** — belongs to chat + user

Schema: `prisma/schema.prisma`  
Migrations: `prisma/migrations/`  
Generated client: `generated/prisma/`

---

## Project layout

```
backend/
├── app.js                 # Express + Socket.IO entry
├── seeds.js               # Optional faker seed
├── prisma/
├── lib/prisma.js
├── routes/
├── controllers/
│   ├── passportController.js
│   ├── authController.js
│   ├── refreshTokenController.js
│   ├── logoutController.js
│   └── ...
└── package.json
```

---

## Deployment (Railway)

1. Connect the repo; set root / start command to the `backend` package (`npm start`).
2. Attach Postgres and set `DATABASE_URL`.
3. Set all auth-related env vars.
4. Confirm GitHub OAuth callback URL matches `{BACKEND_URL}/auth/github/callback`.
