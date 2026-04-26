# ResQLink | Crisis Coordination Platform

ResQLink is a strategic, AI-powered crisis coordination platform designed to connect NGO coordinators, volunteers, and administrators during disasters. It provides real-time mission tracking, field mapping, and resource synchronization with zero-latency precision.

## 🚀 Key Features

- **Strategic Mission Tracking**: Manage rescue operations, flood relief, and medical emergencies.
- **Field Operations Map**: Live tactical overview of all active missions with urgency markers.
- **Volunteer Synchronization**: AI-driven matching of volunteer skills to community needs.
- **Intelligence Reports**: Compile automated response protocols and operational success metrics.
- **Responsive Dashboard**: Role-based interfaces for Admins, Coordinators, and Field Volunteers.
- **Identity Protocol**: Secure JWT-based authentication system for all field operatives.

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS, Framer Motion, Recharts, Shadcn UI
- **Backend**: Node.js, Express.js, MongoDB, Mongoose
- **Security**: JWT Authentication, Bcrypt Password Hashing
- **Reports**: jsPDF for automated protocol generation

## 📂 Project Structure

```text
resqlink/
├── src/                # Next.js Frontend Application
│   ├── app/            # App Router (Pages & Layouts)
│   ├── components/     # UI Components (Sidebar, AI Assistant, etc.)
│   ├── lib/            # Utilities (Store, API, PDF generation)
│   └── hooks/          # Custom React Hooks
├── backend/            # Node.js API Server
│   ├── src/
│   │   ├── controllers/# Route Handlers
│   │   ├── models/     # MongoDB Schemas
│   │   └── routes/     # API Endpoints
│   └── seed.js         # Database Seeder
└── README.md           # Documentation
```

## ⚙️ Setup Instructions

### Prerequisites
- Node.js (v18+)
- MongoDB (Running locally on `localhost:27017`)

### 1. Backend Setup
```bash
cd backend
npm install
# Copy .env.example to .env and configure if needed
node seed.js    # Seed the database with demo accounts
npm start       # Starts server on http://localhost:5000
```

### 2. Frontend Setup
```bash
cd src
npm install
npm run dev     # Starts development server on http://localhost:3000
```

## 🔑 Demo Access

| Role | Email | Password |
| :--- | :--- | :--- |
| **Admin** | `admin@ResQLink.com` | `admin123` |
| **Coordinator** | `coordinator@ResQLink.com` | `coord123` |
| **Volunteer** | `volunteer@ResQLink.com` | `vol123` |

## 📸 Screenshots Section

*(Add screenshots of Deployment Screen, Map, and Dashboard here)*

## 🔮 Future Scope
- **Live GPS Tracking**: Real-time location sync for field volunteers.
- **Offline First**: Support for mission logging in areas with zero connectivity.
- **AI Prediction**: Predictive analysis for disaster escalation risks.
- **Multi-NGO Federation**: Collaborative coordination across different organizations.

---
© 2024 ResQLink Strategic Intelligence. All Rights Reserved.