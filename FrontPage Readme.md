
# GatorNest – Hostel Management System

GatorNest is a web application designed to streamline maintenance request management in residential facilities like university housing. It provides distinct interfaces for students and staff to submit, track, and manage maintenance requests efficiently.

## Features
- Helpful features like find roommates, find room, raise maintenance complaints and payments in the most user-friendly manner.
- Staff dashboard for managing and updating maintenance requests, easy addition and deletion of rooms and a simple way to manage students and dorms.
- Real-time status updates and notes.
- Admin-controlled user access and request filtering
- Responsive UI with smooth component transitions
- Unit and Cypress tests for frontend reliability

## Tech Stack

### Frontend
- React.js
- CSS
- Jest & React Testing Library (Unit Testing)
- Cypress (End-to-End Testing)

### Backend
- GoLang
- PostgreSQL (Database Management)
- Node.js (Expected server to be hosted separately)

### Prerequisites
- Node.js
- npm
- VSCode

## Project Structure

```
GatorNest/
├── backend/                          ← Golang backend folder
│   ├── go.mod, go.sum               ← Go module definitions
│   ├── cmd/                         ← Main application entry point
│   │   └── main.go
│   ├── config/                      ← Database configuration
│   │   ├── database.go
│   │   └── test_database.go
│   ├── internal/
│   │   ├── delivery/                ← HTTP handlers
│   │   ├── entity/                  ← Data models (admin, room, student, etc.)
│   │   ├── middleware/             ← Auth middleware (e.g., JWT)
│   │   ├── repository/             ← DB operations for each entity
│   │   └── usecase/                ← Business logic and services
├── src/                             ← React frontend components and pages
├── public/                          ← Static assets and base HTML
├── cypress/                         ← Cypress E2E test scripts
├── __tests__/                       ← Unit test files for frontend
├── .babelrc, babel.config.js        ← Babel configuration
├── package.json                     ← Project metadata and scripts
```

## Project Setup

### Backend Setup

The backend of GatorNest is written in Go and uses PostgreSQL as its database.

#### Local Setup

**Backend (Go + Gin + PostgreSQL)**

Ensure your environment variables and PostgreSQL connection string are correctly configured.

**Step 1: Clone & Enter Repo**
```bash
git clone https://github.com/yaswanthattaluri/GatorNest.git
cd gatornest/backend
```

**Step 2: Configure Environment Variables**

Edit the database variables in `backend/config/database.go` file:

```go
dsn := "host=localhost user=<your-username> password=<your-password> dbname=<your-database-name> port=<your-port> sslmode=disable"
```

**Step 3: Install Dependencies & Migrate**
```bash
go mod tidy
go run cmd/main.go   # auto-migrates your schemas into the database
```

**Step 4: Run Server**
Access at: `http://localhost:8080`

**Step 5: Run Backend Unit Tests**
```bash
go test ./internal/delivery -v
```

### Frontend Setup

The frontend of GatorNest uses React.

**Step 1: Clone the repo**
```bash
git clone https://github.com/yaswanthattaluri/GatorNest.git
cd GatorNest
```

**Step 2: Install dependencies**
```bash
npm install
```

This project uses Babel for transpiling JavaScript and JSX.

If needed, Babel config files are located at `.babelrc` and `babel.config.js`.

**Run the App**
```bash
npm run dev
# or
yarn dev
```

**Run Tests**

**Unit Tests**
```bash
npm run test
```

**Cypress Tests**
```bash
npm run dev    # In one terminal
npx cypress open   # In another terminal
npx cypress verify  # To verify install
npx cypress install # (if verify fails)
```

Access at: `http://localhost:5173`

## Cloud Usage

### Backend on Render
- Linked GitHub repo via 'New Web Service' → Deploy from GitHub
- Render auto-detects `go run cmd/main.go`
- Set environment variables in Render dashboard (`DB_URL`, `JWT_SECRET`, etc.)
- Auto-deploys on each push to main branch  
**Live URL:** https://gatornest-backend.onrender.com

### Frontend on Netlify
- Run `npm run build` to generate build directory
- Connect GitHub repo to Netlify
- Set Build Command: `npm run build`, Publish Directory: `dist`
- Auto-deploys on main branch pushes  
**Live URL:** https://gatornest.netlify.app

### Using the Live Apps
- Frontend UI: https://gatornest.netlify.app
- API Base URL: https://gatornest-backend.onrender.com/api/...

## How to Use the Application

### Locally
1. Register a student at `POST /api/student/register`
2. Login to receive a token
3. Use token for protected routes (Authorization: Bearer `<token>`)
4. Submit maintenance requests via `POST /api/maintenance-requests`
5. Make payments via `POST /api/payments`

### On the Cloud
Same steps as local, just point client to:
- Backend: https://gatornest-backend.onrender.com
- Frontend: [GatorNest Frontend](https://gatornest.netlify.app)
