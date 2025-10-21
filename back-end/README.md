# Salon CRM API

A comprehensive Salon Customer Relationship Management (CRM) API built with Express.js, GraphQL, Prisma, Apollo Server, and Docker.

## Features

### Core Modules
- **Customer Management**: Create, update, search customer profiles and service history
- **Appointment Scheduling**: Book appointments with availability checks and automated reminders
- **Staff Management**: User roles (SuperAdmin, Owner, Staff) with proper access control
- **Payment Management**: Record payments, generate invoices, track transaction history
- **Promotions Management**: Create and send promotional messages via SMS/Email
- **Reporting**: Comprehensive job, financial, and staff performance reports

### Technical Features
- **GraphQL API** with Apollo Server
- **Role-based Access Control** (SuperAdmin, Owner, Staff)
- **API Key Authentication** with JWT tokens
- **Database** with Prisma ORM and PostgreSQL
- **Docker** containerization with docker-compose
- **Input Validation** with Joi
- **Clean Architecture** with separated concerns

## Tech Stack

- **Backend**: Node.js, Express.js
- **API**: GraphQL with Apollo Server
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT tokens + API keys
- **Containerization**: Docker & Docker Compose
- **Validation**: Joi
- **External Services**: Twilio (SMS), Nodemailer (Email)

## Project Structure

```
/
├── src/
│   ├── config/          # Configuration files
│   │   ├── database.js  # Database connection
│   │   └── server.js    # Server configuration
│   ├── services/        # Business logic layer
│   │   ├── authService.js
│   │   ├── userService.js
│   │   ├── customerService.js
│   │   ├── appointmentService.js
│   │   ├── paymentService.js
│   │   ├── promotionService.js
│   │   └── reportService.js
│   ├── models/          # Data access layer
│   │   ├── User.js
│   │   ├── Customer.js
│   │   ├── Appointment.js
│   │   ├── Service.js
│   │   ├── Payment.js
│   │   ├── Promotion.js
│   │   └── index.js
│   ├── middleware/      # Custom middleware
│   │   └── auth.js      # Authentication middleware
│   ├── graphql/         # GraphQL schema and resolvers
│   │   ├── types/       # GraphQL type definitions
│   │   │   ├── User.js
│   │   │   ├── Customer.js
│   │   │   ├── Appointment.js
│   │   │   ├── Service.js
│   │   │   ├── Payment.js
│   │   │   ├── Promotion.js
│   │   │   ├── Report.js
│   │   │   └── index.js
│   │   └── resolvers/   # GraphQL resolvers
│   │       ├── userResolvers.js
│   │       ├── customerResolvers.js
│   │       ├── appointmentResolvers.js
│   │       ├── serviceResolvers.js
│   │       ├── paymentResolvers.js
│   │       ├── promotionResolvers.js
│   │       ├── reportResolvers.js
│   │       └── index.js
│   ├── app.js           # Express app configuration
│   └── index.js         # Application entry point
├── prisma/
│   ├── schema.prisma    # Database schema
│   └── seeds/           # Database seed files
│       └── userRoles.js
├── package.json
├── docker-compose.yml
├── Dockerfile
├── .env.example
└── README.md
```

## Quick Start

### Prerequisites
- Node.js 18+
- Docker & Docker Compose
- PostgreSQL (if running locally)

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd salon-crm-api
```

2. **Environment Setup**
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. **Using Docker (Recommended)**
```bash
# Start all services
docker-compose up -d

# Generate Prisma client
docker-compose exec app npx prisma generate

# Run database migrations
docker-compose exec app npx prisma db push

# Seed the database
docker-compose exec app npm run db:seed
```

4. **Local Development**
```bash
# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma db push

# Seed the database
npm run db:seed

# Start development server
npm run dev
```

### Access the API

- **GraphQL Playground**: http://localhost:4000/graphql
- **Health Check**: http://localhost:4000/health

## Authentication

The API uses a dual authentication system:

1. **API Key**: Required for all requests via `x-api-key` header
2. **JWT Token**: Optional, for user-specific operations via `Authorization: Bearer <token>` header

### Default Users (after seeding)

- **Super Admin**: `superadmin@saloncrm.com` / `admin123`
- **Owner**: `owner@beautyparadise.com` / `owner123`
- **Staff**: `staff@beautyparadise.com` / `staff123`

## API Usage

### Authentication Example

```graphql
mutation Login {
  login(email: "owner@beautyparadise.com", password: "owner123") {
    user {
      id
      name
      email
      role
    }
    token
  }
}
```

### Customer Management

```graphql
# Create Customer
mutation CreateCustomer {
  createCustomer(input: {
    name: "John Doe"
    phone: "+1234567890"
    email: "john@example.com"
    address: "123 Main St"
  }) {
    id
    name
    phone
    email
  }
}

# Search Customers
query GetCustomers {
  customers(search: "John") {
    id
    name
    phone
    email
  }
}
```

### Appointment Scheduling

```graphql
# Create Appointment
mutation CreateAppointment {
  createAppointment(input: {
    customerId: "customer-id"
    staffId: "staff-id"
    serviceId: "service-id"
    date: "2024-01-15"
    startTime: "2024-01-15T10:00:00Z"
    endTime: "2024-01-15T11:00:00Z"
  }) {
    id
    date
    startTime
    endTime
    status
  }
}

# Check Availability
query CheckAvailability {
  checkAvailability(
    staffId: "staff-id"
    startTime: "2024-01-15T10:00:00Z"
    endTime: "2024-01-15T11:00:00Z"
  ) {
    available
  }
}
```

### Payment Management

```graphql
# Record Payment
mutation CreatePayment {
  createPayment(input: {
    appointmentId: "appointment-id"
    customerId: "customer-id"
    amount: 50.00
    method: CASH
  }) {
    id
    amount
    method
    status
  }
}
```

### Reports

```graphql
# Financial Report
query FinancialReport {
  financialReport(
    startDate: "2024-01-01"
    endDate: "2024-01-31"
  ) {
    summary {
      totalEarnings
      totalTransactions
    }
    paymentMethods {
      cash
      card
    }
  }
}

# Dashboard Stats
query DashboardStats {
  dashboardStats {
    today {
      appointments
      earnings
    }
    monthly {
      earnings
    }
    totals {
      customers
      staff
    }
  }
}
```

## User Roles & Permissions

### SuperAdmin
- Manage all salons and users
- Full system access
- Cross-salon operations

### Owner
- Manage their salon and staff
- Access to all salon operations
- View all reports and analytics
- Manage promotions and services

### Staff
- Manage customers and appointments
- Record payments
- View their own performance reports
- Limited access to salon operations

## Database Schema

The system uses the following main entities:

- **Users**: SuperAdmin, Owner, Staff with role-based access
- **Salons**: Multi-salon support
- **Customers**: Customer profiles and contact information
- **Services**: Salon services with pricing and duration
- **Appointments**: Booking system with status tracking
- **Payments**: Transaction records and payment methods
- **Promotions**: Marketing campaigns and messaging
- **StaffReports**: Performance tracking and analytics

## External Integrations

### SMS (Twilio)
- Appointment reminders
- Promotional messages
- Configuration via environment variables

### Email (SMTP)
- Appointment confirmations
- Promotional campaigns
- Configurable SMTP settings

## Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run start        # Start production server
npm run lint         # Run ESLint
npm run db:generate  # Generate Prisma client
npm run db:push      # Push schema to database
npm run db:migrate   # Run migrations
npm run db:seed      # Seed database
npm run docker:up    # Start Docker services
npm run docker:down  # Stop Docker services
```

### Environment Variables

```env
# Database
DATABASE_URL="postgresql://salon_user:salon_password@localhost:5432/salon_crm_db"

# Server
PORT=4000
NODE_ENV=development

# Authentication
JWT_SECRET=your-super-secret-jwt-key
API_KEY=your-api-key

# External Services
TWILIO_ACCOUNT_SID=your-twilio-account-sid
TWILIO_AUTH_TOKEN=your-twilio-auth-token
TWILIO_PHONE_NUMBER=your-twilio-phone-number

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-email-password
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Support

For support and questions, please create an issue in the repository or contact the development team.