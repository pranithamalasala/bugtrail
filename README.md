# BugTrail 🐛

A lightweight MERN stack issue tracker that helps users report bugs, monitor progress, and manage issue resolution through a clean dashboard.

## Features

- User registration and login
- Password hashing and JWT authentication
- Protected issue management APIs
- Create and view issues
- Set issue priority: Low, Medium, or High
- Track issue status: Open, In Progress, or Resolved
- Update and delete issues
- Dashboard with issue statistics
- Search issues by title or description
- Filter issues by status
- Responsive dark-themed interface

## Technologies Used

**Frontend:** React, Vite, Axios, CSS  
**Backend:** Node.js, Express.js  
**Database:** MongoDB, Mongoose  
**Authentication:** JSON Web Tokens (JWT), bcrypt  
**Development Tool:** Kiro  
**Version Control:** Git and GitHub

## Prerequisites

- Node.js and npm
- MongoDB Atlas account or a local MongoDB instance
- Git

## Setup and Installation

### 1. Clone the repository

```bash
git clone https://github.com/pranithamalasala/bugtrail.git
cd bugtrail
```

### 2. Configure the backend

```bash
cd server
npm install
```

Create a `.env` file inside `server/src/`:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_long_random_secret
```

Replace the placeholders with your own MongoDB connection string and a strong, private JWT secret. Never commit your `.env` file.

### 3. Start the backend

From the `server` directory:

```bash
npm run dev
```

The API will be available at `http://localhost:5000`. You can verify it is running by visiting `http://localhost:5000/api/health`, which returns `{ "status": "ok" }`.

### 4. Configure and start the frontend

Open a second terminal from the project root:

```bash
cd client
npm install
npm run dev
```

Open the local URL displayed by Vite, usually `http://localhost:5173`. Vite proxies all `/api` requests to the backend automatically, so no additional CORS configuration is needed.

## How to Use

1. Register a new account or sign in.
2. Open the dashboard to view your issues and statistics.
3. Create an issue with a title, description, and priority.
4. Change its status as work progresses.
5. Search, filter, or delete issues as needed.

## AI Development Experience

I used **Kiro** as an AI-assisted development tool during the implementation of BugTrail. I used it to accelerate development while reviewing the generated code, running the application, and testing API and UI behavior.

### Specific AI-Assisted Tasks

1. **Backend API development:** Assisted in creating Express routes and controllers for registration, login, and issue management.
2. **Database integration:** Assisted in defining Mongoose models and connecting the application to MongoDB.
3. **Authentication:** Assisted in implementing password hashing, JWT authentication, and protected routes.
4. **Frontend development:** Assisted in building React components for authentication, the dashboard, issue creation, status updates, and deletion.
5. **Debugging and verification:** Used the development workflow to identify and resolve integration issues and verify application behavior, including issue creation and status updates.

### What I Learned

This project helped me understand how the React frontend communicates with Express APIs, how MongoDB stores application data, and how JWT authentication protects backend routes. I also learned to validate AI-generated code by running the application, testing API requests, and fixing integration issues.

## Future Improvements

- Issue assignment to team members
- Pagination for larger issue lists
- Automated backend tests
- Deployment with production environment configuration

## Author

**Pranitha Malasala**

[GitHub Repository](https://github.com/pranithamalasala/bugtrail)
