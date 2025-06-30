# Node.js Checkin Management API

Gympass-style application for managing gyms, check-ins, and users.

## Table of Contents

- [Features](#features)
- [Business Rules](#business-rules)
- [Non-Functional Requirements](#non-functional-requirements)
- [Architecture and Technologies](#architecture-and-technologies)
- [Database Structure](#database-structure)
- [Environment Variables](#environment-variables)
- [How to Run](#how-to-run)
- [Main Endpoints](#main-endpoints)
- [Authentication and Authorization](#authentication-and-authorization)
- [Testing](#testing)

---

## Features

- User registration
- User authentication
- Retrieve logged-in user's profile
- Retrieve the number of check-ins performed
- Retrieve user's check-in history
- Search for nearby gyms (up to 10km)
- Search gyms by name
- Perform check-in at a gym
- Validate a user's check-in
- Register a new gym

## Business Rules

- Do not allow registration with duplicate email
- Do not allow two check-ins on the same day
- Check-in is only allowed if the user is within 100m of the gym
- Check-in can only be validated up to 20 minutes after creation
- Only administrators can validate check-ins
- Only administrators can register gyms

## Non-Functional Requirements

- User password must be encrypted
- Data must be persisted in PostgreSQL
- All data listings must be paginated (20 items per page)
- User must be identified via JWT (JSON Web Token)

---

## Architecture and Technologies

- **Node.js** + **TypeScript**
- **Fastify** (HTTP framework)
- **Prisma ORM** (database access)
- **PostgreSQL** (relational database)
- **Vitest** (automated testing)
- **Zod** (data validation)
- **JWT** (authentication)
- **Docker** (local infrastructure)

Modular structure with controllers, services, repositories, middlewares, and utils.

---

## Database Structure

- **User**: id, name, email, password_hash, role (ADMIN/MEMBER), created_at
- **Gym**: id, title, description, phone, latitude, longitude
- **CheckIn**: id, user_id, gym_id, created_at, validated_at

See [`prisma/schema.prisma`](prisma/schema.prisma) for details.

---

## Environment Variables

Create a `.env` file in the root with:

```env
DATABASE_URL=postgresql://docker:docker@localhost:5432/apigymcheckins
JWT_SECRET=your_secret_key
PORT=3333
NODE_ENV=dev
```

---

## How to Run

### With Docker (recommended for the database):

```sh
docker-compose up -d
```

### Install dependencies:

```sh
npm install
```

### Run Prisma migrations:

```sh
npx prisma migrate deploy
# or for local development
npx prisma migrate dev
```

### Start the API in development mode:

```sh
npm run start:dev
```

Access: [http://localhost:3333](http://localhost:3333)

---

## Useful Scripts

- `npm run start:dev` — start in development mode
- `npm run build` — production build
- `npm run start:prod` — start production build
- `npm run test` — run unit tests
- `npm run test:e2e` — run end-to-end tests
- `npm run test:coverage` — test coverage
- `npm run lint` — code lint

---

## Main Endpoints

### Users

- `POST /users` — Register
- `POST /sessions` — Login (returns JWT)
- `PATCH /token/refresh` — Refresh token
- `GET /me` — User profile (authenticated)

### Gyms

- `POST /gyms` — Register gym (ADMIN)
- `GET /gyms/search?query=name&page=1` — Search by name
- `GET /gyms/nearby?latitude=...&longitude=...` — Nearby gyms

### Check-ins

- `POST /gyms/:gymId/check-ins` — Perform check-in
- `GET /check-ins/history?page=1` — Check-in history
- `GET /check-ins/metrics` — User metrics
- `PATCH /check-ins/:checkInId/validate` — Validate check-in (ADMIN)

#### Usage Examples

See payload and response examples in the test files under `src/http/controllers/*/*.spec.ts`.

---

## Authentication and Authorization

- **JWT**: required to access protected routes (send in header `Authorization: Bearer <token>`)
- **Refresh Token**: automatic renewal via cookie
- **Roles**: ADMIN can validate check-ins and register gyms; MEMBER can perform check-ins and query gyms

---

## Testing

- Unit and end-to-end tests with [Vitest](https://vitest.dev/)
- Test coverage: `npm run test:coverage`
- E2E tests use an isolated database (see `prisma/vitest-environment-prisma` folder)
