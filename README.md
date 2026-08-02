# ⚡ InvoiceAI - Smart Invoice Tracker & Management Platform

InvoiceAI is a modern, full-stack web application designed to help freelancers and small businesses generate invoices, manage clients, track payments, and analyze financial performance with ease. Built with **React**, **Tailwind CSS v4**, **Node.js**, **Express**, and **MongoDB**.

---

## ✨ Features

- 📊 **Interactive Dashboard:** Real-time revenue analytics, recent invoice activity, and financial KPIs.
- 📜 **Invoice Management:** Create, edit, preview, delete, and mark invoices as paid.
- 📄 **PDF Generation & Export:** Download invoices as clean PDF documents.
- ✉️ **Email Notifications:** Send invoices and payment reminders directly to clients via email.
- 👥 **Client Directory:** Manage company profiles, contact info, and track total billing history per client.
- 💳 **Payment & Volume Tracking:** Visual bar charts for monthly payment volume and status breakdowns.
- 📈 **Analytics & Insights:** YTD revenue trends, collection rates, AR tracking, and top client revenue percentages.
- 🌙 **Light & Dark Mode:** Full UI theme switching with persistent user preference.
- 🔐 **Authentication:** JWT-based user register/login with protected routes.

---

## 🛠️ Tech Stack

### **Frontend**
- **Framework:** React.js (Vite)
- **Styling:** Tailwind CSS v4
- **Animations:** Framer Motion
- **Icons:** Lucide React
- **Routing:** React Router v6

### **Backend**
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB (via Mongoose)
- **Authentication:** JSON Web Tokens (JWT) & bcrypt
- **PDF & Mail:** PDFKit & Nodemailer

---

## 📁 Project Structure

```text
InvoiceAI/
├── client/                 # React Frontend (Vite)
│   ├── src/
│   │   ├── components/    # Reusable UI components (StatCard, Modal, Table, etc.)
│   │   ├── context/       # Global AppContext & State Management
│   │   ├── layouts/       # Sidebar & Dashboard Layout wrappers
│   │   ├── pages/         # Dashboard, Invoices, Clients, Payments, Analytics, Login
│   │   ├── routes/        # AppRoutes & Auth Guards
│   │   ├── services/      # Axios/Fetch API service helpers
│   │   └── utils/         # Helper functions (Formatting currency, dates, badges)
│   └── vite.config.js
│
└── server/                 # Express Backend API
    ├── controllers/       # Invoice, Client, Payment, User controllers
    ├── middleware/        # JWT Authentication & error handlers
    ├── models/            # Mongoose Schemas (User, Invoice, Client, Payment)
    ├── routes/            # API Endpoints
    └── server.js          # App entry point
