# ResQLink Backend API

A robust backend for the ResQLink disaster management system, built with Node.js, Express, and MongoDB.

## Features

- **JWT Authentication**: Secure register/login system.
- **Role-based Access**: Admin, Coordinator, and Volunteer roles.
- **Case Management**: Disaster tracking and volunteer assignment.
- **Offline First**: Designed to run entirely on `localhost`.

## Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- [MongoDB Community Server](https://www.mongodb.com/try/download/community) (Running locally)

## Getting Started

1. **Install Dependencies**
   ```bash
   cd backend
   npm install
   ```

2. **Environment Setup**
   Create a `.env` file from the example:
   ```bash
   cp .env.example .env
   ```
   *Note: Ensure `MONGO_URI` points to your local MongoDB instance.*

3. **Run the Server**
   ```bash
   # Development mode (with nodemon)
   npm run dev

   # Production mode
   npm start
   ```

## API Documentation

- **Auth**: `/api/auth` (register, login, me)
- **Users**: `/api/users` (profile management)
- **Cases**: `/api/cases` (disaster reports)
- **Volunteers**: `/api/volunteers` (field operative management)
- **Reports**: `/api/reports` (analytics and stats)
- **Settings**: `/api/settings` (user preferences)

## Offline Usage

This project is configured to run entirely without an internet connection. Ensure your local MongoDB service is active before starting the server.

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | /api/auth/register | — | Email/password register |
| POST | /api/auth/login | — | Email/password login |
| GET | /api/auth/me | JWT | Get current user |
| POST | /api/auth/logout | JWT | Logout |
| GET | /api/users/profile | JWT | Get profile |
| PUT | /api/users/profile | JWT | Update profile |
| GET | /api/users | JWT+Admin | All users |
| GET | /api/cases | JWT | List cases |
| POST | /api/cases | JWT+Coord | Create case |
| GET | /api/cases/stats/summary | JWT | Case stats |
| GET | /api/cases/:id | JWT | Case detail |
| PUT | /api/cases/:id | JWT+Coord | Update case |
| DELETE | /api/cases/:id | JWT+Coord | Delete case |
| PATCH | /api/cases/:id/assign | JWT+Coord | Assign volunteer |
| PATCH | /api/cases/:id/send-report | JWT+Coord | Send report |
| GET | /api/volunteers | JWT | List volunteers |
| POST | /api/volunteers | JWT+Coord | Add volunteer |
| PATCH | /api/volunteers/:id/availability | JWT | Toggle status |
| GET | /api/reports/summary | JWT | Report summary |
| GET | /api/reports/export | JWT | Export CSV |
| POST | /api/reports/generate | JWT | Generate report |
| GET | /api/notifications | JWT | Get notifications |
| PATCH | /api/notifications/read-all | JWT | Mark all read |
| GET | /api/settings | JWT | Get settings |
| PUT | /api/settings | JWT | Update settings |

## Response Format

```json
{ "success": true, "message": "Action successful", "data": {} }
{ "success": false, "message": "Error message" }
```

## Demo Credentials (seed data)

After seeding, use these to log in:
- Admin: admin@ResQLink.com
- Coordinator: coordinator@ResQLink.com  
- Volunteer: volunteer@ResQLink.com
