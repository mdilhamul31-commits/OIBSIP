# Slice Haven - Pizza Delivery Web Application

A full-stack pizza delivery web application built for the Oasis Infobyte Web Development & Designing Internship (Level 3 Task 1).

## Features

- **Authentication**: JWT-based login, registration with Email Verification, Forgot/Reset password flows.
- **Pizza Menu & Custom Builder**: Choose from signature pizzas or build a custom 4-step pizza (Base, Sauce, Cheese, Veggies).
- **Cart & Checkout**: Interactive shopping cart, Razorpay Test integration.
- **Admin Portal**: Separate admin login, Dashboard statistics.
- **Inventory Management**: Admin can manage stock levels. Automatic stock decrement upon ordering.
- **Notifications**: Automated node-cron job sends email to admin for low-stock items.

## Technology Stack

- **Frontend**: React 19, Tailwind CSS, React Router DOM, Framer Motion
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Mongoose)
- **Payment**: Razorpay (Test Mode)
- **Email**: Nodemailer

## Prerequisites

- Node.js (v18+)
- MongoDB Atlas cluster (or local instance)
- Gmail account with "App Passwords" enabled (for Nodemailer)
- Razorpay account (Test Mode keys)

## Installation & Setup

1. **Clone and Install**
   ```bash
   npm install
   ```

2. **Environment Variables**
   Create a `.env` file based on `.env.example`:
   ```env
   MONGODB_URI="your-mongodb-uri"
   JWT_SECRET="your-secret"
   RAZORPAY_KEY_ID="rzp_test_xxxx"
   RAZORPAY_KEY_SECRET="razorpay_secret"
   EMAIL_HOST="smtp.gmail.com"
   EMAIL_PORT="587"
   EMAIL_USER="your-email@gmail.com"
   EMAIL_PASSWORD="your-app-password"
   ADMIN_EMAIL="admin@slicehaven.com"
   ADMIN_PASSWORD="secureadminpassword"
   FRONTEND_URL="http://localhost:3000"
   ```

3. **Seed Database (Required for initial Admin and Menu)**
   ```bash
   npm run seed
   ```

4. **Run Application**
   ```bash
   npm run dev
   ```
   The application (both frontend and backend) will run on `http://localhost:3000`.

## API Overview

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/admin/login` - Admin login
- `GET /api/pizzas` - Get menu
- `GET /api/inventory` - Get stock
- `POST /api/payments/create-order` - Create Razorpay order
- `POST /api/orders` - Place order & decrement stock

## Oasis Infobyte Level 3 Requirement Checklist

- [x] Landing/Home Page
- [x] User Registration + Email Verification
- [x] User Login + Forgot Password
- [x] Pizza Catalogue & Custom Pizza Builder
- [x] Cart & Order Summary
- [x] Razorpay Test Payment Integration
- [x] Admin Dashboard (Separate Login)
- [x] Inventory Management & Automatic Stock Decrement
- [x] Low-Stock Email Notification
- [x] Order Status Tracking
