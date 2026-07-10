# KNOT Platform - Complete Setup Guide

This guide provides a comprehensive overview of the technologies used in the KNOT application and step-by-step instructions on how to set it up, connect it to the database, and run it locally in your IDE.

---

## 🛠️ Technology Stack

### Backend Stack
- **Runtime:** Node.js
- **Framework:** Express.js
- **Language:** TypeScript
- **ORM:** Prisma
- **Database:** PostgreSQL
- **Authentication:** JWT (JSON Web Tokens) & bcrypt (Password Hashing)
- **Validation:** Zod

### Frontend Stack
- **Framework:** React 19
- **Build Tool:** Vite
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **Routing:** React Router DOM
- **Data Fetching:** Axios

---

## 🚀 Prerequisites

1. **Node.js:** v18 or higher
2. **PostgreSQL:** Installed locally OR via Docker
3. **IDE:** Visual Studio Code (Recommended)

---

## 🗄️ Database Setup (PostgreSQL)

You need a running PostgreSQL database named `knot`.

### Option A: Using Docker (Easiest)
1. Open your terminal in the `backend` folder.
2. Run the following command to start a PostgreSQL container:
   `docker-compose up -d`

### Option B: Using Local PostgreSQL Installation
1. Open pgAdmin or your psql CLI.
2. Create a new database named `knot`.
3. Ensure your local PostgreSQL user has a known password.

---

## ⚙️ Backend Setup & Running in IDE

1. **Navigate to the Backend:**
   `cd backend`

2. **Install Dependencies:**
   `npm install`

3. **Configure Environment Variables:**
   Rename `.env.example` to `.env` and configure the DATABASE_URL.

4. **Initialize Prisma & Database Schema:**
   `npx prisma migrate dev`
   `npx prisma generate`

5. **Run the Backend Server:**
   `npm run build` then `npm start` (or use `npm run dev &` to run in background).

---

## 🎨 Frontend Setup & Running in IDE

1. **Navigate to the Frontend:**
   `cd frontend`

2. **Install Dependencies:**
   `npm install`

3. **Run the Frontend Server:**
   `npm run dev &` (Run in background or separate terminal).

---

## 🌐 Navigating the Application

Access the different modules via these URLs in your browser:
- **Marketing / Landing Page:** `http://localhost:5173/`
- **Admin Console:** `http://localhost:5173/admin`
- **Student Registration:** `http://localhost:5173/student/register`
- **Organizer Event Creation:** `http://localhost:5173/organizer/events/new`
