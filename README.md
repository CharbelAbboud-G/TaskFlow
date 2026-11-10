# TaskFlow

TaskFlow is a mini Project and Task Management Platform developed during the COMPU-VISION Full-Stack Web Development Internship.

The project demonstrates a complete full-stack workflow using a Node.js and Express REST API, MySQL database, React Admin CMS, and Next.js public frontend.

## Features

- User registration and login
- JWT-based authentication
- Protected API routes
- Project management
- Task management
- Full CRUD operations
- React Admin CMS
- Protected Admin dashboard
- Public Next.js frontend
- Dynamic project detail pages
- Responsive design
- Form validation
- Loading, success, and error states
- Empty-state handling
- 404 handling
- SEO metadata
- Environment-variable configuration
- Production deployment

## Technology Stack

### Backend

- Node.js
- Express.js
- MySQL 8.0
- mysql2
- bcryptjs
- JSON Web Token (JWT)
- CORS
- dotenv

### Admin CMS

- React.js
- Vite
- React Router
- Fetch API
- CSS

### Public Frontend

- Next.js
- React
- App Router
- Server Components
- Client Components
- Dynamic Routes
- CSS Modules
- Responsive CSS

### Development and Deployment Tools

- Git
- GitHub
- Postman
- npm
- Railway
- Vercel

## Project Structure

```text
TaskFlow/
|
|-- backend/
|   |-- database/
|   |-- postman/
|   |-- scripts/
|   |   `-- initDatabase.js
|   |-- src/
|   |   |-- config/
|   |   |-- controllers/
|   |   |-- middleware/
|   |   |-- routes/
|   |   |-- app.js
|   |   `-- server.js
|   |-- .env.example
|   `-- package.json
|
|-- admin/
|   |-- src/
|   |   |-- components/
|   |   |-- layouts/
|   |   |-- pages/
|   |   `-- services/
|   |-- .env.example
|   |-- vercel.json
|   `-- package.json
|
|-- frontend/
|   |-- src/
|   |   |-- app/
|   |   |-- components/
|   |   `-- lib/
|   |-- .env.example
|   `-- package.json
|
`-- README.md
```

## Local Setup

### 1. Clone the Repository

```bash
git clone https://github.com/CharbelAbboud-G/TaskFlow.git
cd TaskFlow
```

### 2. Configure the Database

Create a MySQL database named:

```text
taskflow_db
```

Use the SQL schema provided inside:

```text
backend/database/
```

The main database tables are:

- users
- projects
- tasks

### 3. Backend Setup

Open a terminal:

```bash
cd backend
npm install
```

Create your local environment file using:

```text
backend/.env.example
```

Configure the required database credentials and JWT secret.

Start the backend:

```bash
npm run dev
```

Backend URL:

```text
http://localhost:5000
```

The production database can also be initialized using:

```bash
npm run init-db
```

### 4. Admin CMS Setup

Open another terminal:

```bash
cd admin
npm install
```

Create:

```text
admin/.env.local
```

using:

```text
admin/.env.example
```

For local development:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

Start the Admin CMS:

```bash
npm run dev
```

Admin URL:

```text
http://localhost:5173
```

### 5. Public Frontend Setup

Open another terminal:

```bash
cd frontend
npm install
```

Create:

```text
frontend/.env.local
```

using:

```text
frontend/.env.example
```

For local development:

```env
API_BASE_URL=http://localhost:5000/api
```

Start the public frontend:

```bash
npm run dev
```

Frontend URL:

```text
http://localhost:3000
```

## API Endpoints

### Authentication

```text
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
```

`GET /api/auth/me` requires a valid JWT.

### Projects

```text
GET    /api/projects
GET    /api/projects/:id
POST   /api/projects
PUT    /api/projects/:id
DELETE /api/projects/:id
```

Project creation, updating, and deletion require authentication.

### Tasks

```text
GET    /api/tasks
GET    /api/tasks/:id
POST   /api/tasks
PUT    /api/tasks/:id
DELETE /api/tasks/:id
```

Task creation, updating, and deletion require authentication.

## Authentication

The Admin CMS authenticates users through the backend API.

After successful login:

1. The backend validates the email and password.
2. A JWT is generated.
3. The Admin CMS stores the token in local storage.
4. Protected Admin routes verify the token using `/api/auth/me`.
5. Protected API requests send the JWT using the `Authorization` header.

Example:

```text
Authorization: Bearer <token>
```

## Public Frontend Routes

```text
/                 Landing page
/dashboard        Public dashboard
/projects         Projects listing
/projects/[id]    Dynamic project details
/tasks            Tasks listing
```

The public frontend retrieves project and task data from the TaskFlow REST API.

## Environment Variables

Real `.env` and `.env.local` files are excluded from Git.

Only safe example files are committed:

```text
backend/.env.example
admin/.env.example
frontend/.env.example
```

Never commit database passwords, JWT secrets, or other private credentials.

### Backend Production Variables

The deployed backend uses environment variables such as:

```text
DB_HOST
DB_PORT
DB_USER
DB_PASSWORD
DB_NAME
JWT_SECRET
```

Railway database variables are referenced securely from the MySQL service rather than hardcoded in the source code.

### Admin Production Variable

```text
VITE_API_BASE_URL
```

Production value:

```text
https://taskflow-production-f804e933.up.railway.app/api
```

### Frontend Production Variable

```text
API_BASE_URL
```

Production value:

```text
https://taskflow-production-f804e933.up.railway.app/api
```

## Security

TaskFlow includes:

- Password hashing with bcrypt
- JWT authentication
- Protected backend routes
- Protected Admin routes
- Environment-variable configuration
- `.gitignore` protection for secret environment files
- Bearer-token authorization
- Form validation
- Error handling
- 404 handling
- Empty-state handling

For production use, development credentials and secrets should be replaced with strong production values.

## Testing

The backend REST API was tested using Postman.

The Postman collection is available inside:

```text
backend/postman/
```

The complete application was also tested end-to-end using the following flow:

```text
React Admin CMS
      |
      v
Express REST API
      |
      v
MySQL Database
      |
      v
Next.js Public Frontend
```

Creating, updating, and deleting data through the Admin CMS is reflected through the API and public frontend.

## Live Deployment

TaskFlow is deployed and accessible online.

### Public Frontend

Hosted on Vercel:

```text
https://taskflow-frontend-two-nu.vercel.app
```

Main public routes:

```text
/
 /dashboard
 /projects
 /projects/[id]
 /tasks
```

### Admin CMS

Hosted on Vercel:

```text
https://taskflow-admin-alpha.vercel.app
```

Admin login route:

```text
https://taskflow-admin-alpha.vercel.app/login
```

### Backend API

Hosted on Railway:

```text
https://taskflow-production-f804e933.up.railway.app
```

API health check:

```text
https://taskflow-production-f804e933.up.railway.app/api/health
```

### Production Database

The production MySQL database is hosted on Railway.

The Node.js backend connects to the Railway MySQL service using environment variables and Railway private networking.

The database tables are initialized during deployment using:

```text
npm run init-db
```

### Deployment Architecture

```text
React Admin CMS
Vercel
      |
      v
Node.js / Express API
Railway
      |
      v
MySQL Database
Railway
      |
      v
Next.js Public Frontend
Vercel
```

### Live End-to-End Verification

The deployed application was tested end-to-end.

A project named:

```text
Live Deployment Test
```

was created through the live Admin CMS.

The project was successfully stored in the Railway MySQL database and appeared on the live Next.js public frontend.

Its dynamic project-detail page was also successfully accessed through:

```text
/projects/1
```

This confirms that the deployed Admin CMS, REST API, database, and public frontend are fully integrated.

## Production Build

### Admin CMS

The React Admin production build can be tested with:

```bash
cd admin
npm run build
```

### Public Frontend

The Next.js production build can be tested with:

```bash
cd frontend
npm run build
```

Successful builds confirm that both frontend applications can be compiled for production.

## Internship Development Progress

### Week 1 - Backend and REST API

- MySQL database schema
- Express server setup
- Projects CRUD
- Tasks CRUD
- JWT authentication
- Protected API routes
- Postman testing

### Week 2 - React Admin CMS

- React fundamentals
- React Router
- Admin layout and sidebar
- Protected routes
- Login and JWT handling
- Projects CRUD
- Tasks CRUD
- Form validation
- Loading and error states
- User feedback
- UI polish

### Week 3 - Next.js Public Frontend

- Next.js fundamentals
- File-based routing
- Server and Client Components
- Responsive landing page
- API data fetching
- Projects listing page
- Tasks listing page
- Dynamic project routes
- Reusable components
- SEO metadata
- Accessibility improvements
- Responsive design
- Production build testing

### Week 4 - Integration, Deployment and Final Delivery

- End-to-end integration testing
- Delete synchronization testing
- Edge-case testing
- 404 handling
- Empty Projects state
- Empty Tasks state
- Environment-variable configuration
- Hardcoded API URL removal
- Security review
- Final project documentation
- Railway MySQL deployment
- Railway Node.js API deployment
- Vercel React Admin deployment
- Vercel Next.js frontend deployment
- Production database initialization
- Live API health-check verification
- Live authentication verification
- Full live end-to-end deployment testing

## Deployment Status

The TaskFlow application is fully deployed and operational.

```text
Database:        Railway MySQL
Backend API:     Railway
Admin CMS:       Vercel
Public Frontend: Vercel
Repository:      GitHub
```

## Author

Developed as part of the COMPU-VISION Full-Stack Web Development Internship.