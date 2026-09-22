# College Admission Management System

A production-ready admissions platform built as a starter monorepo.

## Stack

- Frontend: Next.js + TypeScript + Tailwind
- Backend: NestJS + TypeScript
- Infrastructure: Docker Compose for Postgres + Redis

## Structure

```text
backend/     NestJS API
frontend/    Next.js application
infra/       Docker + infrastructure starter
```

## Quick start

### 1) Start infrastructure

```bash
docker compose up -d
```

### 2) Start backend

```bash
cd backend
npm install
npm run start:dev
```

### 3) Start frontend

```bash
cd frontend
npm install
npm run dev
```

## Public URLs

- Frontend: http://localhost:3000
- Backend: http://localhost:4000
- Postgres: localhost:5432
- Redis: localhost:6379

## Included modules

- Authentication
- Student applications
- Document verification
- Fee payment simulation
- Seat allotment engine
- Admin dashboard views
