# TypeScript Lambda Backend with Middy

A serverless backend built with TypeScript, AWS Lambda, and Middy middleware featuring admin authentication and item management.

## Features

- TypeScript for type safety
- Middy middleware for common Lambda patterns
- JWT-based admin authentication
- MongoDB integration with Mongoose
- Serverless Framework for deployment
- Jest for testing
- CORS enabled
- Error handling
- JSON body parsing

## Getting Started

### Prerequisites

- Node.js 18+
- AWS CLI configured
- Serverless Framework CLI
- MongoDB database

### Installation

```bash
npm install
```

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Admin Authentication
ADMIN_USERNAME=your_admin_username
ADMIN_PASSWORD=your_admin_password
JWT_SECRET=your_jwt_secret_key

# Database
MONGODB_URI=your_mongodb_connection_string

# Environment
NODE_ENV=development
```

### Development

```bash
# Build TypeScript
npm run build

# Watch mode for development
npm run dev

# Run locally with serverless offline
npm run start:local

```

## API Endpoints

### Public Endpoints
- `GET /health` - Health check endpoint

### Authentication
- `POST /api/auth/login` - Admin login (returns JWT token)

### Protected Endpoints (Require JWT Token)
- `GET /api/items` - Get all items
- `POST /api/items` - Create new item
- `PUT /api/items/{id}` - Update existing item
- `DELETE /api/items/{id}` - Remove item

## Authentication Usage

### Login Request
```bash
POST /api/auth/login
Content-Type: application/json

{
  "username": "your_admin_username",
  "password": "your_admin_password"
}
```

### Login Response
```json
{
  "message": "Authentication successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Using Protected Endpoints
Include the JWT token in the Authorization header:

```bash
GET /api/items
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Project Structure

```
src/
├── api/                    # API endpoints
│   ├── authLoginAdmin/     # Admin authentication
│   ├── health/            # Health check
│   ├── items/             # Get all items
│   ├── newItem/           # Create new item
│   ├── updateItem/        # Update existing item
│   ├── removeItem/        # Delete item
│   └── routes.ts          # API routing configuration
├── middleware/            # Custom middleware
│   ├── authAdminPanel.ts  # JWT authentication middleware
│   ├── mongo.ts           # MongoDB connection
│   └── response.ts        # Response formatting
└── types/                 # TypeScript type definitions
    └── healthTypes.ts     # Health endpoint types
```

## Middleware

### Authentication Middleware
The `authAdminPanel` middleware validates JWT tokens for protected routes:

```typescript
import { authAdminPanel } from '../../middleware/authAdminPanel';

export const protectedHandler = middy()
    .handler(async (event: APIGatewayProxyEvent) => {
        if (!authAdminPanel(event)) {
            return createErrorResponse('Unauthorized', 'Invalid authentication', 401);
        }
        // Your protected logic here
    });

```

## Security Features

- JWT token-based authentication
- Password redaction in logs
- Environment variable validation
- Proper error handling without information leakage
- CORS configuration
- Token expiration (1 hour)


## Deployment Notes

- Ensure all environment variables are set in your deployment environment
- JWT_SECRET should be a strong, randomly generated key
- MongoDB connection string should be properly configured
- Consider using AWS Secrets Manager for production secrets