# RapidWaste Backend API

NestJS backend for the RapidWaste emergency waste pickup service.

## 🚀 Features

- **Booking Management** - Create, track, and manage waste pickup appointments
- **Driver Dashboard** - Real-time driver interface with booking updates
- **Authentication** - JWT-based auth for customers and drivers
- **Real-time Updates** - WebSocket support for live notifications
- **MongoDB Integration** - Robust data persistence with Mongoose
- **API Documentation** - RESTful endpoints with validation

## 📋 Prerequisites

- Node.js 18+ 
- MongoDB (local or Atlas)
- npm or yarn

## 🛠️ Installation

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your MongoDB connection string

# Start MongoDB (if running locally)
mongod

# Seed the database with sample data
npm run seed

# Start development server
npm run start:dev
```

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### Bookings
- `POST /api/bookings` - Create new booking
- `GET /api/bookings` - Get all bookings (with filters)
- `GET /api/bookings/:id` - Get booking by ID
- `PATCH /api/bookings/:id/status` - Update booking status
- `GET /api/bookings/stats` - Get booking statistics

### Drivers
- `GET /api/drivers/:driverId/dashboard` - Driver dashboard data
- `GET /api/drivers/:driverId/bookings` - Driver's bookings
- `PATCH /api/drivers/:driverId/status` - Update driver status
- `PATCH /api/drivers/:driverId/location` - Update driver location

### Users
- `GET /api/users/drivers` - Get all drivers
- `GET /api/users/:id` - Get user by ID

## 💾 Database Models

### User Schema
- Personal info (name, email, phone)
- Role (customer/driver/admin)
- Authentication data

### Booking Schema
- Customer and service details
- Pricing and status tracking
- Driver assignment
- Location and timing

### Driver Schema
- Driver-specific data
- Vehicle information
- Performance metrics
- Current status and location

## 🔧 Environment Variables

```env
NODE_ENV=development
PORT=3001
MONGODB_URI=mongodb://localhost:27017/rapidwaste
JWT_SECRET=your-secret-key
FRONTEND_URL=http://localhost:5173
```

## 📊 Sample Data

The seed script creates:
- 1 sample driver (driver@rapidwaste.com / password123)
- 4 sample bookings with different service types
- Test customers for booking relationships

## 🚀 Deployment

```bash
# Build for production
npm run build

# Start production server
npm run start:prod
```

## 🧪 Testing

```bash
# Run tests
npm run test

# Run e2e tests
npm run test:e2e

# Run tests with coverage
npm run test:cov
```

## 📡 WebSocket Events

### Client Events
- `join-driver-room` - Join driver-specific room
- `join-admin-room` - Join admin room for all updates

### Server Events
- `new-booking` - New booking created
- `booking-status-update` - Booking status changed
- `driver-status-update` - Driver status changed

## 🏗️ Architecture

- **NestJS Framework** - Modular, scalable architecture
- **MongoDB** - Document database for flexible data storage
- **JWT Authentication** - Secure token-based auth
- **WebSocket Gateway** - Real-time communication
- **Class Validators** - Request validation and transformation
- **Mongoose ODM** - MongoDB object modeling

## 🔒 Security

- Password hashing with bcrypt
- JWT token authentication
- Input validation and sanitization
- CORS configuration for frontend
- Environment-based configuration

## 📈 Performance

- Database indexing on frequently queried fields
- Efficient aggregation pipelines for statistics
- Connection pooling for MongoDB
- Async/await for non-blocking operations

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Make changes with tests
4. Submit pull request

## 📞 Support

For issues and support, contact the development team or create an issue in the repository. 