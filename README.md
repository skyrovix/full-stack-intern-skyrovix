# full-stack-intern-skyrovix

Official Web Application & Management Platform for **Skyrovix Batch 1 – 3-Month Full Stack Development Internship**.

## 🚀 Overview

The **Skyrovix Batch 1 Platform** is a full-featured, production-ready web application designed for students and administrators:
- **Internship Landing Page**: Modern, responsive hero section, 3-month roadmap, curriculum details, transparent pricing, and FAQ.
- **Application & Registration**: Streamlined multi-step student registration with instant field validation.
- **Cashfree Payments Gateway**: Live production payment integration with 256-bit SSL encrypted checkout (UPI QR, GPay, PhonePe, Cards, NetBanking).
- **Strict Payment Security Gate**: Unpaid students are held behind a secure payment screen; dashboard and learning modules unlock strictly upon verified transaction.
- **Student Dashboard**: 3-Stage Internship Workflow (Offer Letter acceptance, Training & Learning modules, and Capstone Project submissions).
- **Admin Dashboard**: Real-time registration monitoring, payment tracking, task review, workflow approvals, certificate issuance, and platform settings.
- **Verifiable Certificates & Offer Letters**: Unique verification codes and shareable credential verification pages.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Lucide Icons, Canvas Confetti.
- **Backend**: Node.js, Express, Cashfree PG SDK v3, JWT, Bcrypt.
- **Database**: SQLite (Local fast embedded persistence) with optional Supabase cloud synchronization.
- **Deployment**: Vite build client bundle + Express API server.

---

## 📦 Installation & Setup

### 1. Clone Repository
```bash
git clone https://github.com/skyrovix/full-stack-intern-skyrovix.git
cd full-stack-intern-skyrovix
```

### 2. Install Dependencies
```bash
# Install root, backend, and frontend packages
npm install
npm --prefix server install
npm --prefix client install
```

### 3. Configure Environment Variables
Copy `.env.example` in `server/`:
```bash
cp server/.env.example server/.env
```
Fill in your credentials:
- `CASHFREE_CLIENT_ID`
- `CASHFREE_CLIENT_SECRET`
- `CASHFREE_ENVIRONMENT` (`production` or `sandbox`)
- `JWT_SECRET`
- `ADMIN_SECRET`

### 4. Run Development Servers
```bash
npm run dev
```
- Client runs on: `http://localhost:5173`
- Backend API runs on: `http://localhost:5000`

### 5. Build for Production
```bash
npm --prefix client run build
```

---

## 🔒 Security Best Practices
- Sensitive keys (`server/.env`) are strictly excluded from version control via `.gitignore`.
- Cashfree signature verification is enforced for webhook endpoints.
- Server-side verification is required for all order confirmations before unlocking intern dashboards.

---

## 📄 License
© 2026 Skyrovix Technologies. All rights reserved.
