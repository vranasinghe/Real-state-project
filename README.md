# Aura Spaces Real Estate

Aura Spaces is a premium, modern real estate web application built with a **React (Vite + Tailwind CSS)** frontend and a **Supabase (PostgreSQL)** backend for user authentication, role-based controls, row-level security, image storage, and database persistence.

---

## 📁 Project Structure

```text
realstate application/
├── frontend/                   # React + Vite Client Application
│   ├── src/                    # Components, pages, hooks, context & utils
│   ├── index.html              # HTML entry point
│   ├── package.json            # Frontend dependencies & npm scripts
│   ├── vite.config.js          # Vite configuration
│   ├── tailwind.config.js      # Tailwind CSS design system configuration
│   └── .env                    # Local environment variables
│
├── backend/                    # Supabase PostgreSQL Database & Setup
│   ├── supabase_setup.sql      # Schema definitions, seed data, triggers & RLS policies
│   └── README.md               # Database setup and configuration guide
│
└── README.md                   # Project documentation
```

---

## 🚀 How to Run the Project Locally

### 1. Prerequisites
Ensure you have [Node.js](https://nodejs.org/) (v16.0 or higher) installed on your system.

### 2. Frontend Setup
Navigate into the `frontend` directory and install dependencies:
```bash
cd frontend
npm install
```

Start the Vite development server:
```bash
npm run dev
```

### 3. Backend Setup (Supabase)
1. Create a project at [supabase.com](https://supabase.com/).
2. Follow the setup guide in [`backend/README.md`](./backend/README.md).
3. Run [`backend/supabase_setup.sql`](./backend/supabase_setup.sql) in your Supabase SQL Editor.
4. Copy your Supabase URL and Anon Key into `frontend/.env`:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Framer Motion, Lucide React, Headless UI, React Router DOM
- **Backend**: Supabase (PostgreSQL), Row Level Security (RLS), Database Triggers
