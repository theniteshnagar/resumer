# Resumer

Resumer is a MERN resume builder with profession-specific layouts for engineers, teachers, doctors, developers, and other professionals.

## Project structure

- `client/` — React 19 + Vite frontend
- `server/` — Express + Mongoose API with JWT authentication

## Run locally

### 1. Start MongoDB

Use a local MongoDB instance or a MongoDB Atlas connection string.

### 2. Start the API

```powershell
cd server
copy .env.example .env
# Set MONGODB_URI and JWT_SECRET in .env
npm install
npm run dev
```

The API runs at `http://localhost:5000`. Check `GET /api/health` to verify it is running.

### 3. Start the client

```powershell
cd client
copy .env.example .env
npm install
npm run dev
```

Open the Vite URL shown in the terminal. The client uses `VITE_API_URL` for the API base URL.

## Features

- JWT register/login flow with bcrypt password hashing
- Authenticated resume CRUD with ownership checks
- Mongoose validation for resume sections and profession categories
- Dynamic layouts for Engineer, Teacher, Doctor, Developer, and Other
- Builder sections for personal information, summary, experience, education, projects, and skills
- Print/PDF preview
- Account-only resume creation and editing

## Production notes

Set `NODE_ENV=production`, use a long random `JWT_SECRET`, restrict `CLIENT_URL` to the deployed frontend origin, and use a managed MongoDB deployment with backups and monitoring.
