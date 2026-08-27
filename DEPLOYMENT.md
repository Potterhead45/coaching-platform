# Live Deployment & Setup Guide for Coaching Centre Platform

This platform is production-ready and built on **Next.js 14+ (App Router)**, **Prisma ORM**, and **Tailwind CSS**.

---

## 🚀 1. Instant Local Run & Verification

The project is pre-configured with SQLite and rich seed data for immediate zero-config testing:

```bash
# Navigate to project directory
cd C:\Users\farde\.gemini\antigravity\scratch\coaching-platform

# Install dependencies (already completed)
npm install

# Push database schema & seed sample courses, mock tests, and questions
npm run db:push
npm run db:seed

# Start Next.js development server
npm run dev
```

Visit: `http://localhost:3000`

---

## 🔑 2. Default Test Accounts

| Role | Email | Password | Access Area |
|---|---|---|---|
| **Admin** | `admin@apexcoaching.com` | `admin123` | `/admin` (User details, Test counts, Payments) |
| **Student** | `student@apexcoaching.com` | `student123` | `/dashboard`, `/tests`, `/courses` |
| **Student 2**| `priya.verma@apexcoaching.com` | `student123`| Student progress & tests |

*Tip: You can also click the **1-Click Demo Login** buttons on the `/login` page.*

---

## 🌐 3. Deploying Live to Production

### Option A: Deploy to Vercel + Supabase / Neon (Recommended for Serverless)

1. **Database Setup**:
   - Create a free PostgreSQL database on [Supabase](https://supabase.com) or [Neon](https://neon.tech).
   - In `prisma/schema.prisma`, update the datasource provider to `postgresql`:
     ```prisma
     datasource db {
       provider = "postgresql"
       url      = env("DATABASE_URL")
     }
     ```
2. **Push Schema to PostgreSQL**:
   ```bash
   npx prisma db push
   node prisma/seed.js
   ```
3. **Deploy to Vercel**:
   - Push your code to a GitHub/GitLab repository.
   - Import the project into [Vercel](https://vercel.com).
   - Add Environment Variables in Vercel Project Settings:
     - `DATABASE_URL`: `postgresql://...`
     - `JWT_SECRET`: `your-strong-production-secret`
     - `NEXT_PUBLIC_APP_URL`: `https://your-domain.com`
     - `NEXT_PUBLIC_INSTITUTE_NAME`: `Your Coaching Center Name`
     - `NEXT_PUBLIC_CURRENCY_SYMBOL`: `₹`
     - `RAZORPAY_KEY_ID`: `your_key` (optional, Sandbox active if empty)
     - `RAZORPAY_KEY_SECRET`: `your_secret` (optional)
   - Click **Deploy**!

---

### Option B: Deploy to Railway / Render (Full Node.js Server)

1. Connect your GitHub repository on [Railway](https://railway.app) or [Render](https://render.com).
2. Set Build Command: `npm run build`
3. Set Start Command: `npm start`
4. Add the environment variables from `.env.example`.
5. Railway / Render will automatically provision a PostgreSQL database or persist SQLite storage and assign you a live HTTPS domain.

---

### Option C: Deploy with Docker on VPS (DigitalOcean / AWS / Linode)

Create a `Dockerfile`:
```dockerfile
FROM node:20-alpine AS runner
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npx prisma generate
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```
Run with Docker:
```bash
docker build -t coaching-platform .
docker run -p 3000:3000 -d coaching-platform
```

---

## 💳 4. Payment Gateway Configuration

The platform comes with a built-in **Instant Sandbox Checkout Simulator** out of the box, so you can immediately test student payments, course enrollment, and invoice generation without needing live merchant approval first.

When you're ready to accept live real-money payments:
1. **Razorpay**: Add your `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` in `.env`.
2. **Stripe**: Add `STRIPE_SECRET_KEY` and `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` in `.env`.

---

## 📋 5. Summary of Built Features

1. **Student CBT Exam Engine**:
   - Live countdown timer with auto-submission on timeout.
   - Question palette with status tracking (*Answered, Unanswered, Marked for Review, Visited*).
   - Marking scheme (+4 for correct, -1 for negative).
2. **Detailed Results & Error Explanations**:
   - Instant scorecard with accuracy and section analysis.
   - Full question review highlighting student answer vs correct answer.
   - **Step-by-step mathematical & conceptual explanations for incorrect answers**.
3. **Courses & Chapter System**:
   - Course overview, chapter notes, and chapter-wise mock tests.
4. **Student Analytics Dashboard**:
   - Graphical progress charts, test attempt history, and invoice records.
5. **Admin Control Center (`/admin`)**:
   - **User Details**: Student list, contact info, total tests taken, average score, block/unblock controls.
   - **Test Count Details & Builder**: Mock test creator, question bank with step explanations, attempt metrics.
   - **Payment Details & Ledger**: Transaction ledger with invoice #, order ID, gateway, status, and revenue analytics.
