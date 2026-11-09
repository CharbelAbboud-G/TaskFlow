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

### Development Tools

- Git
- GitHub
- Postman
- npm

## Project Structure

```text id="p1h0ol"
TaskFlow/
|
|-- backend/
|   |-- database/
|   |-- postman/
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

```bash id="qy48oe"
git clone https://github.com/CharbelAbboud-G/TaskFlow.git
cd TaskFlow
```

### 2. Configure the Database

Create a MySQL database named:

```text id="h3bcom"
taskflow_db
```

Use the SQL schema provided inside:

```text id="0lxd8a"
backend/database/
```

The main database tables are:

- users
- projects
- tasks

### 3. Backend Setup

Open a terminal:

```bash id="g6wljf"
cd backend
npm install
```

Create your local environment file using:

```text id="aamazy"
backend/.env.example
```

Configure the required database credentials and JWT secret.

Start the backend:

```bash id="zl9mab"
npm run dev
```

Backend URL:

```text id="1vtd83"
http://localhost:5000
```

### 4. Admin CMS Setup

Open another terminal:

```bash id="4wnylw"
cd admin
npm install
```

Create:

```text id="urcvi4"
admin/.env.local
```

using:

```text id="4xqfxi"
admin/.env.example
```

For local development:

```env id="h1lu5z"
VITE_API_BASE_URL=http://localhost:5000/api
```

Start the Admin CMS:

```bash id="hxie66"
npm run dev
```

Admin URL:

```text id="d3bbtd"
http://localhost:5173
```

### 5. Public Frontend Setup

Open another terminal:

```bash id="t4addp"
cd frontend
npm install
```

Create:

```text id="cg28wu"
frontend/.env.local
```

using:

```text id="us45cy"
frontend/.env.example
```

For local development:

```env id="p6v8fa"
API_BASE_URL=http://localhost:5000/api
```

Start the public frontend:

```bash id="w4k4e9"
npm run dev
```

Frontend URL:

```text id="vnr7y0"
http://localhost:3000
```

## API Endpoints

### Authentication

```text id="i7erhy"
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
```

`GET /api/auth/me` requires a valid JWT.

### Projects

```text id="c8454k"
GET    /api/projects
GET    /api/projects/:id
POST   /api/projects
PUT    /api/projects/:id
DELETE /api/projects/:id
```

Project creation, updating, and deletion require authentication.

### Tasks

```text id="uxffk5"
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

```text id="5p7j8x"
Authorization: Bearer <token>
```

## Public Frontend Routes

```text id="vgp37a"
/                 Landing page
/dashboard        Public dashboard
/projects         Projects listing
/projects/[id]    Dynamic project details
/tasks            Tasks listing
```

## Environment Variables

Real `.env` and `.env.local` files are excluded from Git.

Only safe example files are committed:

```text id="1id1tw"
backend/.env.example
admin/.env.example
frontend/.env.example
```

Never commit database passwords, JWT secrets, or other private credentials.

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

```text id="304c9z"
backend/postman/
```

The complete application was also tested end-to-end using the following flow:

```text id="cw0xma"
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

## Production Build

The Next.js production build can be tested with:

```bash id="2x9azw"
cd frontend
npm run build
```

A successful build confirms that the public frontend can be compiled for production.

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

### Week 4 - Integration and Final Delivery

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

## Author

Developed as part of the COMPU-VISION Full-Stack Web Development Internship.
