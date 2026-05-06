# Team Task Manager

**A simple web app for teams to organize projects, assign work, and track progress in one place.**

In simple language: this is like a shared workspace where a **team lead or admin** can create **projects**, add **team members**, and create **tasks**. Each task can be assigned to someone and marked as *to do*, *in progress*, *done*, or *overdue*. Everyone signs in with their own account, so people only see what they are allowed to see.

**Typical use:** a small team (club, startup, class project) that wants a lightweight alternative to spreadsheets for knowing *who does what* and *how far along things are*.

---

## What you can do

| Area | What happens |
|------|----------------|
| **Account** | Sign up, sign in, and stay logged in securely. |
| **Dashboard** | See totals at a glance (tasks done, overdue, etc.) and your latest activity. |
| **Projects** | Browse projects you belong to; admins can create or delete projects. |
| **Inside a project** | View tasks, filter by status, add members (admins), add tasks (admins), and track who is assigned to what. |
| **Task progress** | Status updates are meant for the **person assigned** to the task, so ownership stays clear. |
| **Look and feel** | Clean, high-contrast UI with an optional light/dark style on most screens. |

---

## Who is who

- **Admin** — Can create and delete projects, create tasks, add or remove project members, and delete tasks.
- **Member** — Can join projects they are added to and update progress on **tasks assigned to them**.

---

## Tech stack

| Layer | Choice |
|-------|--------|
| **Frontend** | React (Vite), Tailwind CSS, React Router |
| **Backend** | Node.js, Express |
| **Database** | PostgreSQL (hosted e.g. on [Neon](https://neon.tech)) |
| **Data layer** | Prisma |
| **Security** | Passwords hashed (bcrypt), sessions via JWT |

Deployment examples people often use: **Vercel** (frontend), **Render** or **Railway** (backend). Any host that runs Node and Postgres works.

---

## Repository layout

```
Team-TaskManager/
├── backend/     → API server (Express + Prisma)
├── frontend/    → Web UI (React + Vite)
└── README.md
```

Run **backend** and **frontend** as two separate processes during development.

---

## Run it locally

You need **Node.js** (LTS recommended) and a **PostgreSQL** database URL.

### 1. Backend

```bash
cd backend
npm install
```

Copy the environment template and fill in real values:

```bash
cp .env.example .env
```

Minimum variables:

- `DATABASE_URL` — your Postgres connection string  
- `JWT_SECRET` — a long random string for signing tokens  
- `PORT` — e.g. `5000`  
- `FRONTEND_URL` — e.g. `http://localhost:5173` (for CORS)

Generate the database client and apply the schema:

```bash
npm run db:generate
npm run db:push
```

Start the API:

```bash
npm run dev
```

The API listens on `http://localhost:5000` by default (or your `PORT`).

### 2. Frontend

Open a **second** terminal:

```bash
cd frontend
npm install
cp .env.example .env
```

Set in `.env`:

```bash
VITE_API_URL=http://localhost:5000/api
```

Start the UI:

```bash
npm run dev
```

Open **http://localhost:5173** in your browser.

---

## Environment variables (quick reference)

**Backend (`backend/.env`)**

| Variable | Purpose |
|----------|---------|
| `DATABASE_URL` | Postgres connection string |
| `JWT_SECRET` | Secret key for JWT |
| `PORT` | API port |
| `FRONTEND_URL` | Allowed browser origin for CORS |

**Frontend (`frontend/.env`)**

| Variable | Purpose |
|----------|---------|
| `VITE_API_URL` | Full API base URL, ending with `/api` |

---

## API overview

Public auth:

- `POST /api/auth/signup` — create account  
- `POST /api/auth/login` — sign in  

Protected (requires `Authorization: Bearer <token>`):

- `GET /api/auth/me` — current user  
- Projects, tasks, dashboard — see routes under `backend/src/routes/` for the full list.


