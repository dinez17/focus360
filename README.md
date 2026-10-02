# Focus 360 Integral Security Solutions — Website & Admin CMS

A full-stack MERN business website with a custom Admin CMS built for **Focus 360 Integral Security Solutions** — a security systems (CCTV, biometric, alarms) and RO water purification company operating from Dindigul and Coimbatore, serving Madurai, Karur, and Tirupur.

**Live Domain:** www.focus360degree.com

---

## 📋 Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Environment Variables](#environment-variables)
- [Local Setup — Backend](#local-setup--backend)
- [Local Setup — Frontend](#local-setup--frontend)
- [Admin Panel Access](#admin-panel-access)
- [User Roles](#user-roles)
- [Key Features](#key-features)
- [Deployment Notes](#deployment-notes)
- [Support & Maintenance](#support--maintenance)

---

## Overview

This project consists of two parts sharing one backend API:

1. **Public Website** — Home, About, Services, Products, Projects, Gallery, Testimonials, Contact, Privacy Policy
2. **Admin CMS** (`/admin`) — Full content management for products, services, projects, gallery, testimonials, homepage settings, contact/branch info, customer database, and lead tracking — with role-based access for Super Admin, Editor, and Telecaller accounts.

---

## Tech Stack

**Frontend**
- React.js + Vite
- Tailwind CSS
- React Router DOM
- Axios
- React Hook Form
- Framer Motion (animations)
- React Icons
- React Hot Toast
- React Helmet Async (SEO)
- React Parallax Tilt (hero 3D effect)

**Backend**
- Node.js + Express.js
- MongoDB Atlas + Mongoose
- JWT Authentication + bcryptjs
- Multer + Cloudinary (image uploads)
- Nodemailer (Gmail — lead notification emails)
- Helmet, CORS, Compression, Morgan, express-validator

**Database & Storage**
- MongoDB Atlas (cloud database)
- Cloudinary (image hosting/CDN)

**Suggested Deployment**
- Frontend → Vercel
- Backend → Render
- Domain → www.focus360degree.com (existing registrar)

---

## Project Structure

```
focus360-website/
├── backend/
│   ├── config/          # DB & Cloudinary connection setup
│   ├── controllers/     # Business logic per module
│   ├── models/           # Mongoose schemas
│   ├── routes/           # API route definitions
│   ├── middleware/       # Auth, error handling, file upload
│   ├── utils/             # Helpers (slugify, email, tokens, seed script)
│   ├── server.js
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/   # common/, layout/, sections/
│   │   ├── layouts/       # PublicLayout, AdminLayout
│   │   ├── pages/          # public/, admin/
│   │   ├── hooks/          # useFetch, useAuth
│   │   ├── context/        # AuthContext
│   │   ├── services/       # API call wrappers per module
│   │   ├── routes/          # ProtectedRoute
│   │   └── assets/          # Logo, images
│   └── package.json
│
└── README.md
```

---

## Prerequisites

Before running this project, make sure you have:

- **Node.js** v18+ and npm installed
- A **MongoDB Atlas** account (free tier is sufficient)
- A **Cloudinary** account (free tier is sufficient)
- A **Gmail account** with an App Password generated (for contact form email notifications)

---

## Environment Variables

Neither `.env` file is included in this handover for security — you must create both using the templates below.

### `backend/.env`

```env
NODE_ENV=production
PORT=5000

MONGODB_URI=your_mongodb_atlas_connection_string

JWT_SECRET=your_random_secret_string
JWT_EXPIRE=7d

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

EMAIL_USER=your_gmail_address
EMAIL_APP_PASSWORD=your_gmail_app_password
NOTIFY_EMAIL=where_lead_notifications_should_go

CLIENT_URL=https://www.focus360degree.com
```

### `frontend/.env`

```env
VITE_API_BASE_URL=https://your-backend-url.onrender.com/api/v1
```

> ⚠️ **Never commit `.env` files to GitHub.** Both are already excluded via `.gitignore`. See the [Deployment Notes](#deployment-notes) section for where each of these values comes from.

---

## Local Setup — Backend

```bash
cd backend
npm install
```

Create `backend/.env` using the template above, then:

```bash
# Create the first Super Admin login (only needs to be run once)
npm run seed:admin

# Start the development server
npm run dev
```

Backend runs on `http://localhost:5000` by default. Confirm it's working:
```bash
curl http://localhost:5000/api/v1/health
```

---

## Local Setup — Frontend

```bash
cd frontend
npm install
```

Create `frontend/.env` using the template above, then:

```bash
npm run dev
```

Frontend runs on `http://localhost:5173` by default.

---

## Admin Panel Access

- **URL:** `/admin/login` (e.g., `https://www.focus360degree.com/admin/login`)
- **First login:** Use the credentials printed in your terminal after running `npm run seed:admin`
- **⚠️ Change the seeded password immediately** after first login via Admin Panel → Change Password

---

## User Roles

| Role | Access |
|---|---|
| **Super Admin** | Full access — all modules, staff account management, cannot be deleted |
| **Editor** | Full content management (Products, Services, Projects, Gallery, Testimonials, Settings) — cannot manage staff accounts |
| **Telecaller** | Access limited to **Leads** and **Customer Database** only — cannot edit website content or delete customer records |

Super Admin creates Editor/Telecaller accounts via **Admin Panel → Manage Staff**.

---

## Key Features

- ✅ Fully responsive public website with animated hero section
- ✅ Complete admin CMS — no code changes needed to update content
- ✅ Product catalog with categories, filtering, and search
- ✅ Project & Gallery showcase with image management
- ✅ Testimonials management
- ✅ Homepage banner, company info, contact info, and social links — all editable
- ✅ Multi-branch address management with service area tags
- ✅ Contact form → saves as a Lead + sends email notification
- ✅ Customer Database module (tracks CCTV and/or RO Water Purifier installations, warranty, AMC, and payment status — auto-calculated)
- ✅ Role-based staff accounts (Super Admin / Editor / Telecaller)
- ✅ JWT authentication with secure password hashing

---

## Deployment Notes

Since deployment is being handled by your team, here is where each environment variable comes from:

| Variable | Source |
|---|---|
| `MONGODB_URI` | MongoDB Atlas → Database → Connect → Drivers |
| `CLOUDINARY_*` | Cloudinary Dashboard → home page (Cloud Name, API Key, API Secret) |
| `EMAIL_APP_PASSWORD` | Google Account → Security → 2-Step Verification → App Passwords |
| `JWT_SECRET` | Generate via: `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"` |
| `VITE_API_BASE_URL` | Your deployed backend's URL + `/api/v1` (set this *after* backend is deployed) |

**Suggested deployment order:**
1. Deploy backend to Render first (get its live URL)
2. Set `frontend/.env`'s `VITE_API_BASE_URL` to that Render URL
3. Deploy frontend to Vercel
4. Point www.focus360degree.com's DNS to Vercel (frontend) — Render backend stays on its own subdomain
5. Run the admin seed script once against the **production** database (via Render's shell or a one-time local run pointed at the production `MONGODB_URI`)

---

## Support & Maintenance

For questions about this codebase, feature requests, or bug reports, please contact the development team through the agreed support channel.

**Please do not share `.env` files, database credentials, or API keys outside your organization.**

---

*Built with the MERN stack. Last updated: August 2026.*