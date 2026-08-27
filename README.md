# Apex Academy & Coaching Platform 🎓

A full-featured, production-ready web platform for education and coaching institutes to conduct online mock tests, manage courses and chapters, track student progress, accept payments, and manage students and exams via an admin dashboard.

---

## 🌟 Key Features

### For Students
- **Computer-Based Mock Tests (CBT Engine)**: Real-time countdown timer, NTA-style color-coded question palette, section switching, and auto-submit on timeout.
- **Post-Submission Results & In-Depth Solutions**: Instant scorecard, accuracy %, marks breakdown, and **comprehensive step-by-step solutions for incorrect answers**.
- **Courses & Chapters**: Chapter syllabus notes and topic-wise diagnostic tests.
- **Student Dashboard**: Graphical score progression charts, attempt history, and invoice receipts.
- **Payment Gateway**: Seamless checkout for paid test series and courses (supporting Razorpay, Stripe, and instant Sandbox Demo).

### For Admin (`/admin`)
- **User Details**: Student directory with test attempts, average accuracy, total spent, and status toggles (Active / Blocked).
- **Test Count Details & Builder**: Real-time attempt counts, create new mock tests, and build question banks with step-by-step explanations.
- **Payment Details & Ledger**: Transaction history with order ID, invoice #, gateway reference, and revenue analytics.

---

## 🚀 Quick Start

```bash
cd coaching-platform
npm install
npm run db:push
npm run db:seed
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Default Login Accounts:
- **Admin**: `admin@apexcoaching.com` | `admin123`
- **Student**: `student@apexcoaching.com` | `student123`
