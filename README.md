# R8IFY - Ratings & Reviews Platform

R8IFY is a modern web application for rating and reviewing stores and users. It features a robust admin dashboard, user management, store management, and a responsive, mobile-friendly UI. Built with React (Vite), Node.js/Express, Prisma ORM, and PostgreSQL (NeonDB).

---

## Project Structure

```
RoxilarTask/
├── client/                # Frontend (React + Vite)
│   ├── public/            # Static assets
│   ├── src/               # Source code
│   │   ├── components/    # Reusable components (admin, dashboards, modals, etc.)
│   │   ├── Pages/         # Main pages (Home, Auth, Profile, Dashboard, etc.)
│   │   ├── utils/         # Utility functions (validation, API helpers)
│   │   └── assets/        # Images, SVGs
│   ├── index.html         # Main HTML file
│   ├── package.json       # Frontend dependencies
│   └── vite.config.js     # Vite configuration
│
├── server/                # Backend (Node.js + Express)
│   ├── src/               # Source code
│   │   ├── controllers/   # Route controllers (auth, user, store, etc.)
│   │   ├── middlewares/   # Express middlewares (auth, error handling)
│   │   ├── routes/        # API route definitions
│   │   ├── services/      # Business logic/services
│   │   ├── utils/         # Utility functions
│   │   └── config/        # DB config
│   ├── prisma/            # Prisma ORM (schema, migrations)
│   ├── package.json       # Backend dependencies
│   └── .env               # Environment variables
│
├── README.md              # Project documentation
└── ...                    # Other files
```

---

## Features

- User registration, login, and authentication
- Admin dashboard for managing users and stores
- Store rating and review system
- Responsive design for desktop and mobile
- Horizontal scroll for lists on mobile
- Modern modals for CRUD operations
- Validation for registration and user creation
- Prisma ORM with PostgreSQL (NeonDB)

---

## Getting Started

### Prerequisites
- Node.js (v16+)
- npm
- PostgreSQL (NeonDB recommended)

### Setup
1. Clone the repository:
   ```bash
   git clone https://github.com/arpatil-dev/R8IFY.git
   cd RoxilarTask
   ```
2. Install dependencies:
   ```bash
   cd client && npm install
   cd ../server && npm install
   ```
3. Configure environment variables:
   - Edit `server/.env` with your database credentials (see sample below)
   ```env
   DATABASE_URL="postgresql://neondb_owner:<password>@<neon-host>/<db-name>?sslmode=require"
   JWT_SECRET="your_jwt_secret_here"
   PORT=5000
   ```
4. Run the backend:
   ```bash
   cd server
   npm start
   ```
5. Run the frontend:
   ```bash
   cd client
   npm run dev --host
   ```
6. Access the app at [http://localhost:5173](http://localhost:5173)
6. Access the hosted app at [https://r8ify.vercel.app/](https://r8ify.vercel.app/)


---

## Admin Credentials

- **Email:** roxi@gmail.com
- **Password:** Admin@123

## Sample User Credentials

- **Email:** aryanrpatil2023@gmail.com
- **Password:** HareKrishna@2004

---

## API Endpoints

- `/api/auth/register` - Register new user
- `/api/auth/login` - Login
- `/api/users` - User management
- `/api/stores` - Store management
- `/api/stores/recent` - Recent stores
- `/api/users/recent` - Recent users
- `/api/ratings/recent` - Recent ratings

and more...

---

## Tech Stack

- **Frontend:** React, Vite, Tailwind CSS
- **Backend:** Node.js, Express, Prisma ORM
- **Database:** PostgreSQL (NeonDB)
- **Auth:** JWT

---


## Contact
[Portfolio](https://arpatil.dev)

For support or questions, contact [Aryan Patil](mailto:aryanrpatil2023@gmail.com)
