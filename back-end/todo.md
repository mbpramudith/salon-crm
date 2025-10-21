# Salon CRM API - MVP Implementation

## Project Structure
Following the specified directory structure with Express.js, GraphQL, Prisma, Apollo Server, and Docker.

## Core Files to Create:

### 1. Configuration & Setup
- `package.json` - Dependencies and scripts
- `docker-compose.yml` - Docker configuration
- `.env.example` - Environment variables template
- `README.md` - Project documentation
- `src/index.js` - Application entry point
- `src/app.js` - Express app configuration
- `src/config/database.js` - Database connection
- `src/config/server.js` - Server configuration

### 2. Database Schema (Prisma)
- `prisma/schema.prisma` - Complete database schema
- `prisma/seeds/userRoles.js` - Seed data for user roles

### 3. Models (Data Access Layer)
- `src/models/index.js` - Models export
- `src/models/User.js` - User model
- `src/models/Customer.js` - Customer model
- `src/models/Appointment.js` - Appointment model
- `src/models/Service.js` - Service model
- `src/models/Payment.js` - Payment model
- `src/models/Promotion.js` - Promotion model

### 4. Services (Business Logic)
- `src/services/authService.js` - Authentication logic
- `src/services/userService.js` - User management
- `src/services/customerService.js` - Customer management
- `src/services/appointmentService.js` - Appointment scheduling
- `src/services/paymentService.js` - Payment processing
- `src/services/promotionService.js` - Promotion management
- `src/services/reportService.js` - Report generation

### 5. GraphQL Schema
- `src/graphql/types/index.js` - Combined type definitions
- `src/graphql/types/User.js` - User types
- `src/graphql/types/Customer.js` - Customer types
- `src/graphql/types/Appointment.js` - Appointment types
- `src/graphql/types/Service.js` - Service types
- `src/graphql/types/Payment.js` - Payment types
- `src/graphql/types/Promotion.js` - Promotion types
- `src/graphql/types/Report.js` - Report types

### 6. GraphQL Resolvers
- `src/graphql/resolvers/index.js` - Combined resolvers
- `src/graphql/resolvers/userResolvers.js` - User operations
- `src/graphql/resolvers/customerResolvers.js` - Customer operations
- `src/graphql/resolvers/appointmentResolvers.js` - Appointment operations
- `src/graphql/resolvers/paymentResolvers.js` - Payment operations
- `src/graphql/resolvers/promotionResolvers.js` - Promotion operations
- `src/graphql/resolvers/reportResolvers.js` - Report operations

### 7. Middleware
- `src/middleware/auth.js` - Authentication middleware

## Key Features Implementation:
1. **User Management**: SuperAdmin, Owner, Staff roles with proper permissions
2. **Customer Management**: CRUD operations with validation
3. **Appointment Scheduling**: Booking with availability checks and reminders
4. **Staff Management**: Assignment and tracking
5. **Payment Management**: Invoice generation and payment recording
6. **Promotions**: Create and send promotional messages
7. **Reporting**: Job and financial reports
8. **API Key Authentication**: Secure API access

## Database Schema Design:
- Users (SuperAdmin, Owner, Staff)
- Salons (for multi-salon support)
- Customers
- Services
- Appointments
- Payments
- Promotions
- Staff assignments and tracking

Total files: ~35 files following clean architecture principles