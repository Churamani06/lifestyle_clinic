# Lifestyle Clinic Backend API

Backend API for the Lifestyle Clinic - Government of Chhattisgarh Health Initiative project.

## Features

- **User Authentication**: Registration, login, and JWT-based authentication
- **Admin Panel**: Administrative login and management capabilities
- **Health Assessment Forms**: Submit and manage health assessment forms
- **Role-based Access Control**: Different permission levels for admins
- **Data Security**: Password hashing, input validation, and rate limiting
- **MySQL Integration**: Full database integration with connection pooling

## Database Schema

The API works with the following main tables:
- `users` - User registration and profile data
- `health_assessment_forms` - Health assessment submissions
- `admins` - Administrative users with role-based permissions

## Technology Stack

- **Node.js** with Express.js framework
- **MySQL** database with mysql2 driver
- **JWT** for authentication
- **bcryptjs** for password hashing
- **express-validator** for input validation
- **helmet** for security headers
- **cors** for cross-origin resource sharing
- **express-rate-limit** for API rate limiting

## Installation

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
   - Copy `.env.example` to `.env`
   - Update database credentials and other settings

3. Ensure your MySQL database is running and accessible

4. Start the development server:
```bash
npm run dev
```

Or start the production server:
```bash
npm start
```

## Environment Variables

Create a `.env` file with the following variables:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=lifestyle_clinic

# JWT Configuration
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=24h

# Server Configuration
PORT=5000
NODE_ENV=development

# CORS Configuration
FRONTEND_URL=http://localhost:5173
```

## API Endpoints

### Authentication Routes (`/api/auth`)
- `POST /register` - User registration
- `POST /login` - User login
- `GET /me` - Get current user data
- `POST /logout` - User logout

### Admin Authentication Routes (`/api/admin-auth`)
- `POST /login` - Admin login
- `GET /me` - Get current admin data
- `POST /create-admin` - Create new admin (Super admin only)
- `GET /admins` - Get all admins (Super admin only)
- `PUT /admin/:id/role` - Update admin role (Super admin only)
- `PUT /admin/:id/deactivate` - Deactivate admin (Super admin only)

### Health Forms Routes (`/api/health-forms`)
- `POST /submit` - Submit health assessment form
- `GET /my-forms` - Get user's forms
- `GET /:formId` - Get specific form
- `GET /statistics/user` - Get user's form statistics

### Admin Panel Routes (`/api/admin`)
- `GET /dashboard/statistics` - Get dashboard statistics
- `GET /users` - Get all users with pagination
- `GET /users/:userId` - Get specific user details
- `PUT /users/:userId/deactivate` - Deactivate user
- `GET /health-forms` - Get all health forms with filters
- `GET /health-forms/:formId` - Get specific health form
- `PUT /health-forms/:formId/status` - Update form status
- `DELETE /health-forms/:formId` - Delete health form (Super admin only)
- `GET /reports/monthly-data` - Get monthly submission data

## Admin Roles

- **super_admin**: Full access to all features including user management
- **data_entry**: Can view and update forms, manage form statuses
- **viewer**: Read-only access to view forms and statistics

## Security Features

- JWT-based authentication
- Password hashing with bcryptjs
- Input validation and sanitization
- Rate limiting for API endpoints
- CORS configuration
- Security headers with Helmet
- SQL injection prevention with parameterized queries

## Development

For development with auto-restart on file changes:
```bash
npm run dev
```

## API Response Format

All API responses follow this format:

```json
{
  "success": true|false,
  "message": "Response message",
  "data": {
    // Response data
  }
}
```

For paginated responses:
```json
{
  "success": true,
  "data": {
    "items": [...],
    "total": 100,
    "page": 1,
    "limit": 10,
    "totalPages": 10
  }
}
```

## Error Handling

The API includes comprehensive error handling:
- Validation errors with field-specific messages
- Database constraint violations
- Authentication and authorization errors
- Rate limiting responses
- Generic server errors

## Contributing

This project is part of the Government of Chhattisgarh Health Initiative. Follow the established coding standards and ensure all changes are properly tested.
