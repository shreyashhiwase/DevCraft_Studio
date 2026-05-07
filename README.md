# ⚡ DevCraft Studio — Project Service Platform

A complete production-ready personal project service platform built with **Node.js, Express, MongoDB, and EJS**. Clients submit project requests, you manage and deliver them — all in one place.

---

## 🚀 Features

| Feature | Details |
|---|---|
| **Authentication** | Register/Login/Logout with bcrypt, role-based (User/Admin) |
| **Inquiry System** | Submit project requests with budget, timeline, attachments |
| **Project Management** | Convert inquiries → projects, milestones, progress tracking |
| **Payment (Razorpay)** | Create orders, verify payments, full payment history |
| **Real-time Chat** | Socket.IO-powered chat per project |
| **File Upload** | Admin uploads deliverables, users download via Multer |
| **Email Notifications** | Nodemailer for inquiry accepted/project started/completed |
| **Review System** | Star ratings + detailed feedback after project completion |
| **Admin Dashboard** | Revenue analytics, user management, full project oversight |
| **Responsive UI** | Dark professional theme, mobile-friendly |

---

## 📁 Folder Structure

```
project-service-platform/
├── app.js                  # Main entry point
├── socket.js               # Socket.IO setup
├── config/
│   └── db.js               # MongoDB connection
├── controllers/
│   ├── authController.js
│   ├── inquiryController.js
│   ├── projectController.js
│   ├── paymentController.js
│   ├── chatController.js
│   └── reviewController.js
├── middleware/
│   ├── auth.js             # Route protection
│   └── upload.js           # Multer file handling
├── models/
│   ├── User.js
│   ├── Inquiry.js
│   ├── Project.js
│   ├── Payment.js
│   ├── Message.js
│   └── Review.js
├── routes/
│   ├── auth.js
│   ├── projects.js
│   ├── inquiries.js
│   ├── payments.js
│   ├── chat.js
│   └── reviews.js
├── views/
│   ├── landing.ejs
│   ├── error.ejs
│   ├── partials/
│   │   ├── navbar.ejs
│   │   └── flash.ejs
│   ├── auth/
│   │   ├── login.ejs
│   │   └── register.ejs
│   ├── user/
│   │   ├── dashboard.ejs
│   │   ├── inquiry-form.ejs
│   │   ├── inquiries.ejs
│   │   ├── project.ejs
│   │   └── payments.ejs
│   ├── admin/
│   │   ├── dashboard.ejs
│   │   ├── inquiries.ejs
│   │   ├── projects.ejs
│   │   ├── project-detail.ejs
│   │   ├── users.ejs
│   │   ├── payments.ejs
│   │   └── reviews.ejs
│   └── chat/
│       └── index.ejs
├── public/
│   ├── css/style.css
│   └── uploads/            # Auto-created
├── utils/
│   └── email.js
├── .env.example
└── package.json
```

---

## ⚙️ Setup Instructions

### 1. Prerequisites
- **Node.js** v18+ — [nodejs.org](https://nodejs.org)
- **MongoDB** v6+ — [mongodb.com](https://www.mongodb.com) (local or Atlas)

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment
```bash
cp .env.example .env
```
Edit `.env` with your values:

| Variable | Description |
|---|---|
| `MONGO_URI` | MongoDB connection string |
| `SESSION_SECRET` | Any long random string |
| `ADMIN_EMAIL` | Admin login email |
| `ADMIN_PASSWORD` | Admin login password |
| `EMAIL_USER` | Gmail address for Nodemailer |
| `EMAIL_PASS` | Gmail App Password (not regular password) |
| `RAZORPAY_KEY_ID` | Razorpay Key ID from dashboard |
| `RAZORPAY_KEY_SECRET` | Razorpay Key Secret from dashboard |
| `APP_URL` | e.g. `http://localhost:3000` |

### 4. Gmail App Password Setup
1. Enable 2FA on your Google account
2. Go to **Google Account → Security → App Passwords**
3. Generate a new app password for "Mail"
4. Use that 16-char password as `EMAIL_PASS`

### 5. Razorpay Setup
1. Create account at [razorpay.com](https://razorpay.com)
2. Go to **Settings → API Keys**
3. Generate Test Mode keys
4. Add to `.env`

### 6. Run the App
```bash
# Development (auto-restart)
npm run dev

# Production
npm start
```

---

## 🔑 Default Routes

| Route | Access | Description |
|---|---|---|
| `/` | Public | Landing page |
| `/auth/register` | Guest | Create account |
| `/auth/login` | Guest | Login |
| `/dashboard` | User | User dashboard |
| `/inquiries/new` | User | Submit inquiry |
| `/projects/:id` | User | Project detail + payment |
| `/chat/:projectId` | User/Admin | Real-time chat |
| `/admin/dashboard` | Admin | Admin control center |
| `/admin/inquiries` | Admin | Manage inquiries |
| `/admin/projects` | Admin | Manage projects |
| `/admin/users` | Admin | Manage clients |
| `/admin/payments` | Admin | Revenue overview |
| `/admin/reviews` | Admin | All reviews |

---

## 🔄 Typical Workflow

1. **Client registers** → submits project inquiry with title, description, budget
2. **Admin reviews inquiry** → accepts or rejects (email sent to client)
3. **Admin converts to project** → sets price, deadline, creates project
4. **Admin works on project** → updates progress, adds milestones, uploads files
5. **Client pays** → via Razorpay payment modal on project page
6. **Admin marks complete** → email sent to client
7. **Client downloads files** → leaves review and star rating

---

## 🛡️ Security Features
- bcryptjs password hashing (12 rounds)
- express-session with MongoDB store
- Role-based route protection middleware
- express-validator input validation
- Method override for RESTful forms
- CSRF protection via session
- File type and size validation

---

## 📦 Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js 18+ |
| Framework | Express.js 4 |
| Database | MongoDB + Mongoose |
| Templates | EJS |
| Auth | express-session + bcryptjs |
| Realtime | Socket.IO |
| Payments | Razorpay |
| Email | Nodemailer |
| File Upload | Multer |
| Validation | express-validator |

---