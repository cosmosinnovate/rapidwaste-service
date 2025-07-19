# RapidWaste Backend Quick Start

## Features
- NestJS TypeScript backend with MongoDB
- JWT authentication system
- Booking management with real-time updates
- Driver dashboard and tracking
- WebSocket support for live notifications
- **Swagger API Documentation with interactive testing**

## Development Setup

### Prerequisites
- Node.js 18+ 
- MongoDB (local or Atlas)
- npm or yarn

### Installation
```bash
npm install
```

### Environment Variables
Create a `.env` file:
```
MONGODB_URI=mongodb://localhost:27017/rapidwaste
JWT_SECRET=your-super-secret-jwt-key-here
NODE_ENV=development
PORT=3001
```

### Running the Application
```bash
# Development with hot reload
npm run start:dev

# Production build
npm run build
npm run start:prod
```

The backend will be available at:
- **API**: http://localhost:3001/api
- **Swagger Documentation**: http://localhost:3001/api/docs

## API Documentation

### Swagger Interactive Docs
Access the complete API documentation at **http://localhost:3001/api/docs**

Features:
- Interactive API testing interface
- Detailed endpoint documentation with examples
- Request/response schemas
- Authentication testing (JWT Bearer tokens)
- Organized by tags: Authentication, Bookings, Drivers, Users

### API Endpoints Summary

#### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

#### Bookings
- `POST /api/bookings` - Create new booking
- `GET /api/bookings` - Get all bookings (with filters)
- `GET /api/bookings/stats` - Get booking statistics
- `GET /api/bookings/:id` - Get booking by ID
- `PATCH /api/bookings/:id/status` - Update booking status
- `PATCH /api/bookings/:id/assign-driver` - Assign driver

#### Drivers
- `GET /api/drivers/:driverId/dashboard` - Driver dashboard
- `GET /api/drivers/:driverId/bookings` - Driver's bookings
- `GET /api/drivers/available` - Available drivers
- `PATCH /api/drivers/:driverId/status` - Update driver status
- `PATCH /api/drivers/:driverId/location` - Update location
- `POST /api/drivers` - Create driver

#### Users
- `GET /api/users/drivers` - Get all drivers
- `GET /api/users/:id` - Get user by ID

## Database Seeding
```bash
npm run seed
```

## Testing API Endpoints

### Using Swagger UI (Recommended)
1. Visit http://localhost:3001/api/docs
2. Click "Try it out" on any endpoint
3. Fill in the parameters
4. Click "Execute" to test

### Using curl
```bash
# Create a booking
curl -X POST http://localhost:3001/api/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "phone": "(555) 123-4567",
    "address": "123 Main St",
    "city": "Anytown",
    "zipCode": "12345",
    "serviceType": "emergency",
    "bagCount": "1-5"
  }'

# Get all bookings
curl http://localhost:3001/api/bookings
```

## Architecture

### Technology Stack
- **Framework**: NestJS with TypeScript
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT with Passport
- **Validation**: class-validator and class-transformer
- **Documentation**: Swagger/OpenAPI 3.0
- **Real-time**: WebSocket Gateway

### Project Structure
```
src/
├── auth/           # Authentication module
├── bookings/       # Booking management
├── drivers/        # Driver operations
├── users/          # User management
├── common/         # Shared DTOs and utilities
├── database/       # Schemas and database config
├── gateways/       # WebSocket gateways
└── main.ts         # Application bootstrap
```

### Key Features
- **Type Safety**: Full TypeScript implementation
- **Input Validation**: Automatic request validation with decorators
- **Error Handling**: Centralized error responses
- **API Documentation**: Auto-generated Swagger docs
- **Real-time Updates**: WebSocket support for live notifications
- **Security**: JWT authentication, password hashing, CORS

## Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running locally or check Atlas connection string
- Verify firewall settings for external connections

### Port Already in Use
```bash
# Find and kill process using port 3001
lsof -ti:3001 | xargs kill
```

### Clear npm cache
```bash
npm cache clean --force
```

## Production Deployment
- Set NODE_ENV=production
- Use MongoDB Atlas for production database
- Configure proper JWT secrets
- Set up SSL/HTTPS
- Configure reverse proxy (nginx)
- Set up monitoring and logging

---
Built with ❤️ using NestJS and TypeScript 