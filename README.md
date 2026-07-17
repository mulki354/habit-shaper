# Habit Shaper 🎯

A full-stack habit tracking application built with React, NestJS, and MySQL — fully containerized with Docker.

Built as a coding assessment project to demonstrate full-stack development skills including REST API design, JWT authentication, and Docker-based deployment.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React + Vite |
| Backend | Node.js + NestJS + TypeScript |
| Database | MySQL 8 |
| ORM | TypeORM / Prisma |
| Auth | JWT |
| Containerization | Docker + Docker Compose |

---

## Features

- User authentication (register & login) with JWT
- Create, read, update, and delete habits
- Track daily habit completion
- View habit history and progress
- Clean REST API with proper error handling

---

## Project Structure

```
habit-shaper/
├── backend/          # NestJS API server
├── frontend/         # React + Vite client
├── docs/             # PRD and technical documentation
├── compose.yml       # Docker Compose configuration
└── .env.example      # Environment variable template
```

---

## Getting Started

### Prerequisites

- Docker & Docker Compose installed
- Node.js 18+ (for local development without Docker)

### Run with Docker (Recommended)

1. Clone the repository
```bash
git clone https://github.com/mulki354/habit-shaper.git
cd habit-shaper
```

2. Copy and configure environment variables
```bash
cp .env.example .env
# Edit .env with your values
```

3. Start all services
```bash
docker compose up --build
```

4. Access the app
- Frontend: http://localhost:3000
- Backend API: http://localhost:4000

### Environment Variables

```env
MYSQL_ROOT_PASSWORD=
MYSQL_DATABASE=
MYSQL_USER=
MYSQL_PASSWORD=
DATABASE_URL=
JWT_SECRET=
PORT=4000
FRONTEND_URL=http://localhost:3000
VITE_API_URL=http://localhost:4000
```

---

## API Endpoints

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | /auth/register | Register new user | No |
| POST | /auth/login | Login and get JWT token | No |
| GET | /habits | Get all user habits | Yes |
| POST | /habits | Create new habit | Yes |
| PATCH | /habits/:id | Update habit | Yes |
| DELETE | /habits/:id | Delete habit | Yes |
| POST | /habits/:id/track | Mark habit as done today | Yes |
| GET | /habits/:id/history | Get habit completion history | Yes |

---

## Development Notes

This project was developed using an AI-assisted workflow (Claude Code) with structured planning via PRD-first approach — demonstrating modern AI-enabled engineering practices where the developer understands, verifies, and directs AI-generated code rather than blindly accepting it.

---

## Author

**Mulki Zulkarnaen Nurfalah**
- Portfolio: [portfolio-mulki.vercel.app](https://portfolio-mulki.vercel.app)
- LinkedIn: [linkedin.com/in/mulki-zn](https://linkedin.com/in/mulki-zn)
- Email: mulki.zulkarnaen96@gmail.com
