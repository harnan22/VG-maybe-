# Boilerplate Service Setup Guide

This guide will help you set up the boilerplate service from scratch.

## 🚀 Quick Start

### 1. Prerequisites
- Node.js 18+ installed
- PostgreSQL 12+ running
- Git installed

### 2. Installation Steps

```bash
# 1. Clone or copy the boilerplate
git clone <repository-url> my-service
cd my-service

# 2. Install dependencies
npm install

# 3. Copy environment file
cp env.example .env

# 4. Configure your environment
# Edit .env with your database and Clerk credentials

# 5. Run database migrations
npm run migration:run

# 6. Start development server
npm run start:dev
```

## 🔧 Configuration

### Database Setup

1. **Create PostgreSQL Database**
   ```sql
   CREATE DATABASE boilerplate_db;
   CREATE USER boilerplate_user WITH PASSWORD 'your_password';
   GRANT ALL PRIVILEGES ON DATABASE boilerplate_db TO boilerplate_user;
   ```

2. **Update .env file**
   ```env
   DB_HOST=localhost
   DB_PORT=5432
   DB_USERNAME=boilerplate_user
   DB_PASSWORD=your_password
   DB_DATABASE=boilerplate_db
   ```

### Clerk Authentication Setup

1. **Create Clerk Application**
   - Go to [Clerk Dashboard](https://dashboard.clerk.com)
   - Create a new application
   - Copy the secret key

2. **Configure Webhook**
   - Go to Webhooks section in Clerk Dashboard
   - Add endpoint: `https://your-domain.com/api/v1/webhooks/clerk`
   - Select events: `user.created`, `user.updated`, `user.deleted`
   - Copy the webhook secret

3. **Update .env file**
   ```env
   CLERK_SECRET_KEY=sk_test_your_secret_key
   CLERK_WEBHOOK_SECRET=whsec_your_webhook_secret
   ```

## 🗄️ Database Migrations

### Available Migrations
- `1700000000001-CreateUsersTable`: Creates users table
- `1700000000002-CreatePersonProfilesTable`: Creates person profiles table
- `1700000000003-CreateDocumentsTable`: Creates documents table
- `1700000000004-CreateFilesTable`: Creates files table

### Migration Commands
```bash
# Generate new migration
npm run migration:generate -- -n YourMigrationName

# Run pending migrations
npm run migration:run

# Revert last migration
npm run migration:revert
```

## 🔐 Authentication Flow

### 1. User Signup
1. User signs up through Clerk
2. Clerk sends `user.created` webhook
3. Service creates user and person profile
4. User can now access protected endpoints

### 2. User Login
1. User signs in through Clerk
2. Clerk provides JWT token
3. Service validates token for protected routes
4. User accesses application features

### 3. Webhook Events
- **user.created**: Creates new user with person profile
- **user.updated**: Updates user information
- **user.deleted**: Deactivates user account

## 📊 API Endpoints

### Health Check
```
GET /api/v1
```

### Authentication
```
POST /api/v1/webhooks/clerk
```

### Users
```
GET    /api/v1/users
GET    /api/v1/users/me
GET    /api/v1/users/:id
POST   /api/v1/users
PATCH  /api/v1/users/:id
DELETE /api/v1/users/:id
```

### Documents
```
GET    /api/v1/documents
GET    /api/v1/documents/search?q=query
GET    /api/v1/documents/my-documents
GET    /api/v1/documents/:id
POST   /api/v1/documents
PATCH  /api/v1/documents/:id
DELETE /api/v1/documents/:id
POST   /api/v1/documents/:id/download
```

### Files
```
GET    /api/v1/files
GET    /api/v1/files/:id
POST   /api/v1/files
PATCH  /api/v1/files/:id
DELETE /api/v1/files/:id
POST   /api/v1/files/:id/download
```

## 🧪 Testing

### Manual Testing
1. **Health Check**
   ```bash
   curl http://localhost:8000/api/v1
   ```

2. **Webhook Testing**
   ```bash
   curl -X POST http://localhost:8000/api/v1/webhooks/clerk \
     -H "Content-Type: application/json" \
     -H "svix-id: test-id" \
     -H "svix-timestamp: 1234567890" \
     -H "svix-signature: test-signature" \
     -d '{"type": "user.created", "data": {"id": "test-user-id"}}'
   ```

### Automated Testing
```bash
# Run unit tests
npm run test

# Run e2e tests
npm run test:e2e

# Run with coverage
npm run test:cov
```

## 🚀 Deployment

### Development
```bash
npm run start:dev
```

### Production
```bash
# Build application
npm run build

# Start production server
npm run start:prod
```

### Docker (Optional)
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist ./dist
EXPOSE 8000
CMD ["npm", "run", "start:prod"]
```

## 🔍 Monitoring

### Health Check
- Endpoint: `GET /api/v1`
- Response: `{"status": "ok", "message": "Boilerplate Service is running", "timestamp": "..."}`

### Logs
- Development: Console output
- Production: Configure logging service

### Metrics
- Response times
- Error rates
- Database connections

## 🛠️ Development

### Code Structure
- **Entities**: Database models
- **Services**: Business logic
- **Controllers**: API endpoints
- **DTOs**: Data transfer objects
- **Guards**: Authentication/authorization
- **Interceptors**: Response transformation

### Best Practices
- Use TypeScript for type safety
- Validate all inputs with DTOs
- Handle errors gracefully
- Use proper HTTP status codes
- Document APIs with Swagger
- Write tests for critical functionality

## 🆘 Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Check database credentials
   - Ensure PostgreSQL is running
   - Verify database exists

2. **Clerk Authentication Error**
   - Verify secret key is correct
   - Check webhook configuration
   - Ensure webhook secret matches

3. **Migration Errors**
   - Check database permissions
   - Ensure database is empty for initial setup
   - Verify migration files are correct

4. **Port Already in Use**
   - Change PORT in .env file
   - Kill existing process on port 8000

### Debug Mode
```bash
# Enable debug logging
NODE_ENV=development npm run start:dev

# Check logs
tail -f logs/app.log
```

## 📚 Additional Resources

- [NestJS Documentation](https://docs.nestjs.com/)
- [TypeORM Documentation](https://typeorm.io/)
- [Clerk Documentation](https://clerk.com/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
