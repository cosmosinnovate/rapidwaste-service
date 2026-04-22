# 🚛 notary_now - Emergency Waste Pickup Service

A full-stack web application for emergency waste pickup services with real-time booking, driver management, and payment processing.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd project-template-service

# Install dependencies
npm install
cd backend && npm install

# Set up environment variables
cp backend/.env.example backend/.env
# Edit backend/.env with your configuration:
# - MongoDB connection string (default: mongodb://localhost:27017/notary_now)
# - JWT secrets (generate secure random strings)
# - Stripe keys (get from Stripe dashboard for payments)

# Start MongoDB (if running locally)
mongod

# Seed the database with sample data
cd backend && npm run seed

# Start the development servers
## 🔑 Test Login Credentials

### Admin Dashboard
- **Email:** admin@notary_now.com
- **Password:** admin123

## 🌟 Features

### Customer Features
- ✅ **Emergency Booking** - Same-day waste pickup
- ✅ **Real-time Pricing** - Dynamic cost calculation
- ✅ **Payment Processing** - Secure Stripe integration
- ✅ **Booking Tracking** - Status updates and notifications

### Admin Features
- ✅ **Dashboard Overview** - Booking statistics and metrics
- ✅ **Driver Management** - Assign and monitor drivers
- ✅ **Booking Management** - Update status and track progress
- ✅ **Payment Management** - Process refunds and view payments
- ✅ **Customer Portal** - Manage customer accounts

### Driver Features
- ✅ **Real-time Dashboard** - Live booking updates
- ✅ **Route Optimization** - Efficient pickup scheduling
- ✅ **Status Updates** - Mark pickups as completed
- ✅ **Earnings Tracking** - Daily and weekly statistics

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern UI framework
- **Vite** - Fast development and building
- **Tailwind CSS** - Utility-first styling
- **Stripe Elements** - Secure payment processing

### Backend
- **NestJS** - Scalable Node.js framework
- **MongoDB** - Document database
- **Mongoose** - MongoDB object modeling
- **JWT** - Authentication and authorization
- **WebSockets** - Real-time communication

### Payment
- **Stripe** - Payment processing and security
- **PCI Compliance** - Industry-standard security

## 📱 Application Structure

```
project-template-service/
├── src/                    # Frontend React app
│   ├── components/        # React components
│   ├── contexts/          # React contexts
│   └── services/          # API services
├── backend/               # NestJS backend
│   ├── src/
│   │   ├── auth/         # Authentication
│   │   ├── bookings/     # Booking management
│   │   ├── drivers/      # Driver management
│   │   ├── payments/     # Payment processing
│   │   └── users/        # User management
│   └── database/         # MongoDB schemas
└── start-dev.sh          # Development startup script
```

## 🔧 Environment Variables

### Backend (.env)
```env
NODE_ENV=development
PORT=3001
MONGODB_URI=mongodb://localhost:27017/notary_now
JWT_SECRET=your-secret-key
STRIPE_SECRET_KEY=sk_test_your_stripe_key
FRONTEND_URL=http://localhost:5173
```

### Frontend (.env)
```env
VITE_API_BASE_URL=http://localhost:3001/api
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_key
```

## 🚀 Development

```bash
# Start both frontend and backend
./start-dev.sh

# Or start individually
npm run dev              # Frontend (Vite)
cd backend && npm run start:dev  # Backend (NestJS)
```

## 📊 API Documentation

Once the backend is running, visit:
- **Swagger UI:** http://localhost:3001/api
- **Frontend:** http://localhost:5173

## 🧪 Testing

```bash
# Backend tests
cd backend && npm run test

# Frontend tests
npm run test
```

## 🚀 Deployment

### Production Build
```bash
# Frontend
npm run build

# Backend
cd backend && npm run build
```

### Environment Setup
- Set production environment variables
- Configure MongoDB Atlas
- Set up Stripe production keys
- Configure domain and SSL

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📞 Support

For issues and questions:
- Create an issue in the repository
- Contact the development team
- Check the API documentation

## 📄 License

This project is licensed under the MIT License.
