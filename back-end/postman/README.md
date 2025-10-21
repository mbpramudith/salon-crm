# Salon CRM API - Postman Testing Suite

This directory contains comprehensive Postman collections and environments for testing the Salon CRM GraphQL API.

## Files Included

### 1. Environment Configuration
- **`Salon-CRM-Environment.postman_environment.json`** - Environment variables for API testing

### 2. API Collection
- **`Salon-CRM-API.postman_collection.json`** - Complete API test collection with all endpoints

## Quick Setup

### 1. Import into Postman

1. **Open Postman**
2. **Import Environment**:
   - Click "Import" → Select `Salon-CRM-Environment.postman_environment.json`
   - Set as active environment
3. **Import Collection**:
   - Click "Import" → Select `Salon-CRM-API.postman_collection.json`

### 2. Configure Environment Variables

Update the following variables in your environment:

```json
{
  "baseUrl": "http://localhost:4000",
  "apiKey": "your-api-key-change-in-production"
}
```

### 3. Authentication Flow

**Step 1: Login**
1. Run any login request from "Authentication" folder
2. Token will be automatically saved to environment
3. Subsequent requests will use the saved token

**Step 2: Test API Endpoints**
- All requests include automatic token management
- IDs are automatically captured and reused

## Collection Structure

### 🔍 Health Check
- **Health Check** - REST endpoint health check
- **GraphQL Health** - GraphQL endpoint health check

### 🔐 Authentication
- **Login - Owner** - Login as salon owner (auto-saves token)
- **Login - Staff** - Login as staff member (auto-saves token)  
- **Login - Super Admin** - Login as super admin (auto-saves token)
- **Get Current User** - Fetch current user profile
- **Change Password** - Update user password

### 👥 Customer Management
- **Get All Customers** - List all customers (auto-saves customer ID)
- **Search Customers** - Search customers by name/phone/email
- **Get Customer by ID** - Fetch specific customer details
- **Create Customer** - Add new customer (auto-saves new ID)
- **Update Customer** - Modify customer information
- **Get Customer Service History** - View customer's appointment history

### 🛠️ Service Management
- **Get All Services** - List all salon services (auto-saves service ID)
- **Get Service by ID** - Fetch specific service details
- **Create Service** - Add new service offering
- **Get Popular Services** - Most booked services

### 📅 Appointment Management
- **Get All Appointments** - List appointments (auto-saves appointment & staff IDs)
- **Get Appointments with Filters** - Filter by status, date, staff
- **Check Staff Availability** - Verify staff availability for booking
- **Create Appointment** - Book new appointment (auto-saves new ID)
- **Update Appointment** - Modify appointment details
- **Complete Appointment** - Mark appointment as completed
- **Cancel Appointment** - Cancel existing appointment

### 💳 Payment Management
- **Get All Payments** - List all payments (auto-saves payment ID)
- **Create Payment** - Record new payment (auto-saves new ID)
- **Generate Invoice** - Create invoice for appointment
- **Get Total Earnings** - Calculate earnings for date range
- **Get Staff Earnings** - Calculate individual staff earnings

### 👨‍💼 User Management
- **Get All Users** - List all system users
- **Get Users by Role** - Filter users by role (STAFF, OWNER, etc.)
- **Create User** - Add new staff member or owner

### 📢 Promotions Management
- **Get All Promotions** - List promotions (auto-saves promotion ID)
- **Create Promotion** - Create marketing campaign (auto-saves new ID)
- **Activate Promotion** - Activate draft promotion
- **Send Promotion** - Send promotion to customers
- **Get Promotion Stats** - View promotion analytics

### 📊 Reports & Analytics
- **Dashboard Stats** - Key performance indicators
- **Job Report** - Appointment completion analytics
- **Financial Report** - Revenue and payment analytics
- **Staff Report** - Staff performance metrics

## Authentication

### Default Test Accounts

The collection includes login requests for these pre-seeded accounts:

```
Super Admin: superadmin@saloncrm.com / admin123
Owner:       owner@beautyparadise.com / owner123  
Staff:       staff@beautyparadise.com / staff123
```

### Token Management

- **Automatic**: Tokens are automatically extracted and saved on login
- **Headers**: All requests automatically include required headers:
  - `x-api-key`: API key for basic authentication
  - `Authorization`: Bearer token for user authentication

## Variable Auto-Management

The collection automatically captures and reuses important IDs:

| Variable | Captured From | Used In |
|----------|---------------|---------|
| `authToken` | Login requests | All authenticated requests |
| `userId` | Login response | User-specific operations |
| `salonId` | Login response | Salon-scoped operations |
| `customerId` | Customer creation/listing | Customer operations |
| `appointmentId` | Appointment creation/listing | Appointment operations |
| `serviceId` | Service listing | Appointment creation |
| `staffId` | Appointment listing | Staff operations |
| `paymentId` | Payment creation/listing | Payment operations |
| `promotionId` | Promotion creation/listing | Promotion operations |

## Testing Workflows

### 1. Complete Customer Journey

```
1. Login as Owner/Staff
2. Create Customer
3. Get All Services (captures service ID)
4. Check Staff Availability  
5. Create Appointment
6. Complete Appointment
7. Create Payment
8. View Customer Service History
```

### 2. Staff Management Workflow

```
1. Login as Owner/Super Admin
2. Get All Users
3. Create User (new staff)
4. Get Staff Report
5. View Dashboard Stats
```

### 3. Promotion Campaign Workflow

```
1. Login as Owner
2. Create Promotion
3. Activate Promotion
4. Send Promotion
5. Get Promotion Stats
```

## Error Handling

The collection includes proper error handling:

- **Authentication Errors**: Clear messages for invalid credentials
- **Validation Errors**: GraphQL validation error details
- **Permission Errors**: Role-based access control messages
- **Not Found Errors**: Missing resource error handling

## Advanced Features

### Pre-request Scripts
- Automatic header injection (API key, auth token)
- Environment variable validation
- Dynamic variable generation

### Test Scripts
- Automatic ID extraction and storage
- Response validation
- Status code verification
- Data persistence for chained requests

## Troubleshooting

### Common Issues

1. **"API key is required"**
   - Ensure `apiKey` is set in environment
   - Verify API is running on correct port

2. **"Authentication required"**
   - Run login request first
   - Check if token is saved in environment

3. **"Access denied"**
   - Verify user role permissions
   - Use appropriate login for the operation

4. **GraphQL Errors**
   - Check request syntax
   - Verify required variables are provided
   - Ensure valid enum values

### Debug Tips

1. **Check Environment Variables**
   - View current environment in Postman
   - Verify all required variables are set

2. **Monitor Console**
   - Open Postman Console for detailed logs
   - Check pre-request and test script output

3. **Validate Responses**
   - Check response status codes
   - Review GraphQL error messages
   - Verify data structure matches expectations

## API Documentation

For detailed API documentation, refer to:
- **Backend README**: `../README.md`
- **GraphQL Schema**: Available at `http://localhost:4000/graphql` (when server is running)
- **Prisma Schema**: `../prisma/schema.prisma`

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review the backend API documentation
3. Verify your environment setup
4. Test with the health check endpoints first

---

**Happy Testing! 🚀**