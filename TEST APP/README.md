# Work Status Logger

A comprehensive work status logging application that allows employees to log their daily work status (In Office, WFH, Business Trip, or Off) and enables managers to track team availability.

## Features

### For Employees
- **Daily Status Logging**: Log work status for each day
- **Status Options**:
  - In Office
  - Work From Home (WFH)
  - Business Trip
  - Off
- **Status Calendar**: Interactive calendar view showing your work status color-coded by day
- **Status History**: View the last 30 days of status logs in both calendar and table format
- **User Authentication**: Secure login and registration

### For Managers
- **Team Dashboard**: View all employees' status for today
- **Employee Calendar History**: Click-through calendar view of individual employee status history
- **Month Navigation**: Browse multiple months to see employee patterns
- **Easy Tracking**: Quickly see who's available and where

## Tech Stack

### Backend
- **Node.js** with Express.js
- **SQLite** for database
- **JWT** for authentication
- **Bcryptjs** for password encryption
- **CORS** for cross-origin requests

### Frontend
- **React 18** with TypeScript
- **React Router** for navigation
- **Axios** for API calls
- **CSS3** for styling

## Project Structure

```
TEST APP/
├── backend/
│   ├── server.js                 # Main server file
│   ├── database.js              # Database initialization and utilities
│   ├── package.json
│   ├── middleware/
│   │   └── auth.js              # Authentication middleware
│   └── routes/
│       ├── auth.js              # Authentication routes
│       └── status.js            # Work status routes
│
└── frontend/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── App.tsx              # Main app component with routing
    │   ├── App.css              # Global styles
    │   ├── index.tsx            # React entry point
    │   ├── components/
    │   │   ├── StatusCalendar.tsx    # Employee calendar view
    │   │   └── EmployeeCalendar.tsx  # Manager employee history calendar
    │   └── pages/
    │       ├── Login.tsx        # Login page
    │       ├── Register.tsx     # Registration page
    │       ├── Dashboard.tsx    # Employee dashboard with calendar
    │       └── ManagerDashboard.tsx # Manager dashboard
    ├── tsconfig.json
    └── package.json
```

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm (v6 or higher)

### Backend Setup

1. Navigate to backend folder:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Start the server:
```bash
npm start
```

The server will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend folder:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The app will run on `http://localhost:3000`

## Default Test Accounts

After running the app, you can register new accounts or use these defaults (after manual creation):

**Employee Account:**
- Email: employee@example.com
- Password: password123
- Role: Employee

**Manager Account:**
- Email: manager@example.com
- Password: password123
- Role: Manager

> Note: Create accounts through the registration page on first run.

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user info

### Work Status
- `POST /api/status/log` - Log today's work status
- `GET /api/status/today` - Get today's status
- `GET /api/status/my-history` - Get user's status history
- `GET /api/status/team-today` - Get all employees' status for today (manager only)
- `GET /api/status/employee/:employeeId/history` - Get specific employee's history (manager only)

## Usage

### For Employees
1. Register or login to your account
2. On the Dashboard, select your work status for the day
3. Click "Log Status" to record it
4. **View your status on the interactive calendar**:
   - Color-coded days show your status at a glance
   - Green = In Office, Blue = WFH, Yellow = Business Trip, Red = Off, Gray = No status
   - Click on any date to see the status details for that day
   - Use Previous/Next buttons to navigate between months
   - View up to 365 days of history

### For Managers
1. Login with a manager account
2. View all employees' status on the Manager Dashboard for today
3. Click "View History" to see an employee's historical status with a calendar view:
   - Browse employee availability across multiple months
   - Color-coded calendar makes patterns easy to spot
   - Click dates to see specific day information
   - Navigate months to review past patterns

## Database Schema

### Users Table
```sql
- id (INTEGER, PRIMARY KEY)
- name (TEXT)
- email (TEXT, UNIQUE)
- password (TEXT)
- role (TEXT) - 'employee' or 'manager'
- created_at (DATETIME)
```

### Work Status Table
```sql
- id (INTEGER, PRIMARY KEY)
- user_id (INTEGER, FOREIGN KEY)
- status (TEXT) - 'in_office', 'wfh', 'business_trip', 'off'
- date (DATE)
- logged_at (DATETIME)
- UNIQUE(user_id, date)
```

## Security Features

- **Password Hashing**: Passwords are hashed using bcryptjs
- **JWT Authentication**: Secure token-based authentication
- **Role-Based Access Control**: Different permissions for employees and managers
- **CORS Protection**: Configured cross-origin requests

## Future Enhancements

- [ ] Email notifications for status changes
- [ ] Analytics and reporting dashboard
- [ ] Mobile app
- [ ] Automatic status reminders
- [ ] Integration with calendar apps
- [ ] Team comparison views
- [ ] Export to CSV/PDF

## License

This project is open source and available under the MIT License.
