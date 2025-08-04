# Lifestyle Clinic Backend Setup Instructions

## Prerequisites
- Node.js installed
- MySQL server running
- Database tables already created in MySQL Workbench (as per your schema)

## Setup Steps

1. **Install Dependencies**
   ```bash
   cd backend
   npm install
   ```

2. **Configure Environment Variables**
   - Copy `.env.example` to `.env`
   - Update the database credentials in `.env`:
   ```env
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_mysql_password
   DB_NAME=lifestyle_clinic
   JWT_SECRET=your_very_long_secret_key_here
   ```

3. **Start the Server**
   ```bash
   # Development mode (auto-restart on changes)
   npm run dev
   
   # Production mode
   npm start
   ```

4. **Default Admin Account**
   - Username: `admin`
   - Password: `admin123`
   - The system will create this automatically if no admin exists

## API Endpoints

### User Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Admin Authentication  
- `POST /api/admin-auth/login` - Admin login
- `GET /api/admin-auth/me` - Get current admin

### Health Forms
- `POST /api/health-forms/submit` - Submit health form
- `GET /api/health-forms/my-forms` - Get user's forms

### Admin Panel
- `GET /api/admin/dashboard/statistics` - Dashboard stats
- `GET /api/admin/users` - Get all users
- `GET /api/admin/health-forms` - Get all health forms

## Database Connection
The backend connects directly to your existing MySQL database tables:
- `users`
- `health_assessment_forms` 
- `admins`

No models needed - direct SQL queries are used since you already have the database structure set up in MySQL Workbench.

## Testing the API
Use tools like Postman or Thunder Client to test the endpoints, or connect your React frontend.
