# Boilerplate Service

A modern NestJS backend service with authentication, user management, document handling, and file storage capabilities.

## 🚀 Features

- **Authentication**: Clerk integration with webhook support
- **User Management**: Complete user profiles with person profiles
- **Document Management**: Upload, organize, and manage documents
- **File Storage**: Secure file handling with metadata
- **Database**: PostgreSQL with TypeORM
- **API Documentation**: Swagger/OpenAPI integration
- **Migrations**: Database schema management
- **Validation**: Request validation with class-validator
- **Security**: JWT tokens, webhook verification

## 📋 Prerequisites

- Node.js 18+ 
- PostgreSQL 12+
- npm or yarn

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd boilerplate-service
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp env.example .env
   ```
   
   **Quick Setup Checklist:**
   - ✅ Create Supabase project (see [Database Setup](#supabase-database-setup))
   - ✅ Create Clerk application (see [Authentication Setup](#clerk-authentication-setup))
   - ✅ Copy keys to `.env` file
   - ✅ Run database migrations
   
   Update the `.env` file with your configuration:
   ```env
   # Supabase Database Configuration
   # Option 1: Direct Connection (requires IPv6)
   # DB_HOST=db.your-project-ref.supabase.co
   # DB_PORT=5432
   # DB_USERNAME=postgres
   
   # Option 2: Session Pooler (IPv4 compatible - RECOMMENDED)
   DB_HOST=aws-0-us-east-1.pooler.supabase.com
   DB_PORT=6543
   DB_USERNAME=postgres.your-project-ref
   DB_PASSWORD=your-supabase-password
   DB_DATABASE=postgres
   DB_SSL_MODE=require
   
   # Clerk Configuration
   CLERK_SECRET_KEY=sk_test_your_secret_key_here
   CLERK_WEBHOOK_SECRET=whsec_your_webhook_secret_here
   
   # Application Configuration
   NODE_ENV=development
   PORT=8000
   API_PREFIX=api/v1
   ```

4. **Database Setup**
   ```bash
   # Run initial migrations (only needed once)
   npm run migration:run
   ```

5. **Start the application**
   ```bash
   # Development
   npm run start:dev
   
   # Production
   npm run build
   npm run start:prod
   ```

## 📚 API Documentation

Once the application is running, visit:
- **Swagger UI**: http://localhost:8000/api/docs
- **Health Check**: http://localhost:8000/api/v1

## 🏗️ Project Structure

```
src/
├── common/                 # Shared utilities
│   ├── entities/          # Base entity
│   ├── guards/            # Authentication guards
│   ├── decorators/        # Custom decorators
│   └── interceptors/      # Response interceptors
├── config/                # Configuration files
├── modules/               # Feature modules
│   ├── users/            # User management
│   │   ├── entities/      # User & PersonProfile entities
│   │   ├── services/      # Business logic
│   │   ├── controllers/   # API endpoints
│   │   └── dto/          # Data transfer objects
│   └── documents/         # Document management
│       ├── entities/      # Document & File entities
│       ├── services/      # Business logic
│       ├── controllers/   # API endpoints
│       └── dto/          # Data transfer objects
└── migrations/           # Database migrations
```

## 🔐 Authentication & Database Setup

### Clerk Authentication Setup

1. **Create Clerk Application**
   - Go to [Clerk Dashboard](https://dashboard.clerk.com)
   - Click "Add application" or "Create application"
   - Choose a name for your application (e.g., "Boilerplate App")
   - Select your preferred sign-in methods (Email, Google, etc.)

2. **Get Clerk API Keys**
   - In your Clerk dashboard, go to **API Keys** section
   - Copy the **Secret Key** (starts with `sk_test_` or `sk_live_`)
   - Copy the **Publishable Key** (starts with `pk_test_` or `pk_live_`)
   - Add these to your `.env` file:
     ```env
     CLERK_SECRET_KEY=sk_test_your_secret_key_here
     ```

3. **Configure Clerk Webhooks**
   - In Clerk dashboard, go to **Webhooks** section
   - Click "Add Endpoint"
   - Set the endpoint URL: `https://your-domain.com/api/v1/webhooks/clerk`
   - Select these events:
     - `user.created`
     - `user.updated` 
     - `user.deleted`
   - Copy the **Webhook Secret** and add to `.env`:
     ```env
     CLERK_WEBHOOK_SECRET=whsec_your_webhook_secret_here
     ```

### Supabase Database Setup

1. **Create Supabase Project**
   - Go to [Supabase Dashboard](https://supabase.com/dashboard)
   - Click "New Project"
   - Choose your organization
   - Enter project name (e.g., "boilerplate-db")
   - Set a strong database password
   - Choose a region close to your users
   - Click "Create new project"

2. **Get Supabase Connection Details**
   - In your Supabase project dashboard, go to **Settings** → **Database**
   - Scroll down to **Connection string** section
   - Copy the connection details:
     - **Host**: `your-project-ref.supabase.co`
     - **Database name**: `postgres`
     - **Port**: `5432`
     - **User**: `postgres`
     - **Password**: (the password you set during project creation)

3. **Configure Environment Variables**
   ```env
   # Supabase Database Configuration
   DB_HOST=your-project-ref.supabase.co
   DB_PORT=5432
   DB_USERNAME=postgres
   DB_PASSWORD=your-supabase-password
   DB_DATABASE=postgres
   DB_SSL_MODE=require
   ```

4. **Enable Row Level Security (RLS)**
   - In Supabase dashboard, go to **Authentication** → **Policies**
   - Enable RLS for your tables if needed
   - Configure policies based on your security requirements

### Webhook Events

The service handles these Clerk webhook events:
- `user.created`: Creates new user and person profile
- `user.updated`: Updates existing user data  
- `user.deleted`: Deactivates user account

## 📊 Database Schema

### Users Table
- `id`: UUID primary key
- `email`: Unique email address
- `firstName`, `lastName`: User names
- `clerkId`: Clerk user ID
- `profileImageUrl`: Profile image
- `isActive`: Account status

### Person Profiles Table
- `id`: UUID primary key
- `firstName`, `lastName`: Profile names
- `profileRole`: CUSTOMER, REALTOR, VENDOR, ADMIN, SUPPORT
- `phone`, `address`, `city`, `state`, `zipCode`, `country`: Contact info
- `bio`: User biography
- `company`, `jobTitle`: Professional info
- `website`, `linkedinUrl`, `twitterUrl`: Social links

### Documents Table
- `id`: UUID primary key
- `title`, `description`: Document info
- `fileName`, `filePath`, `fileSize`, `mimeType`: File details
- `documentType`: PDF, WORD, EXCEL, POWERPOINT, TEXT, IMAGE, OTHER
- `status`: DRAFT, PUBLISHED, ARCHIVED, DELETED
- `tags`, `category`: Organization
- `downloadCount`, `viewCount`: Analytics
- `authorId`: Foreign key to users

### Files Table
- `id`: UUID primary key
- `fileName`, `originalName`: File names
- `filePath`, `fileSize`, `mimeType`: File details
- `fileHash`: File integrity
- `status`: UPLOADING, UPLOADED, PROCESSING, READY, ERROR, DELETED
- `downloadCount`, `viewCount`: Analytics
- `documentId`: Foreign key to documents

## 🚀 Available Scripts

- `npm run start:dev`: Start development server
- `npm run build`: Build for production
- `npm run start:prod`: Start production server
- `npm run migration:generate`: Generate new migration
- `npm run migration:run`: Run pending migrations
- `npm run migration:revert`: Revert last migration
- `npm run lint`: Run ESLint
- `npm run test`: Run tests

## 🗄️ Database Migration Management

**⚠️ Important**: Automatic migrations are **DISABLED** by default for safety. You must run migrations manually when making entity changes.

### When to Run Migrations

Run migrations when you:
- ✅ Add new entities
- ✅ Modify existing entity properties
- ✅ Add/remove columns
- ✅ Change column types
- ✅ Add/remove indexes
- ✅ Modify relationships

### Migration Workflow

1. **Make entity changes** in your code
2. **Generate migration**:
   ```bash
   npm run migration:generate
   ```
3. **Review the generated migration** file in `src/migrations/`
4. **Run the migration**:
   ```bash
   npm run migration:run
   ```

### Migration Commands

| Command | Description |
|---------|-------------|
| `npm run migration:generate` | Generate new migration from entity changes |
| `npm run migration:run` | Execute pending migrations |
| `npm run migration:revert` | Revert the last executed migration |

### Best Practices

- 🔍 **Always review** generated migrations before running
- 🧪 **Test migrations** on development database first
- 💾 **Backup production** database before running migrations
- 📝 **Document breaking changes** in migration comments
- 🚫 **Never modify** existing migration files (create new ones instead)

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| **Database Configuration** |
| `DB_HOST` | Database host (Supabase) | Yes | `your-project.supabase.co` |
| `DB_PORT` | Database port | Yes | `5432` |
| `DB_USERNAME` | Database username | Yes | `postgres` |
| `DB_PASSWORD` | Database password | Yes | `your-supabase-password` |
| `DB_DATABASE` | Database name | Yes | `postgres` |
| `DB_SSL_MODE` | SSL mode for Supabase | Yes | `require` |
| **Clerk Configuration** |
| `CLERK_SECRET_KEY` | Clerk secret key | Yes | `sk_test_...` |
| `CLERK_WEBHOOK_SECRET` | Clerk webhook secret | Yes | `whsec_...` |
| **Application Configuration** |
| `PORT` | Application port | No | `8000` |
| `NODE_ENV` | Environment | No | `development` |
| `API_PREFIX` | API prefix | No | `api/v1` |

### Where to Find Your Keys

#### Clerk Keys
1. **Secret Key**: Clerk Dashboard → API Keys → Secret Key
2. **Webhook Secret**: Clerk Dashboard → Webhooks → Your Endpoint → Signing Secret

#### Supabase Keys  
1. **Database Host**: Supabase Dashboard → Settings → Database → Connection string
2. **Database Password**: The password you set when creating the Supabase project
3. **Project Reference**: Found in your Supabase project URL (`https://supabase.com/dashboard/project/your-project-ref`)

## 📝 API Endpoints

### Authentication
- `POST /api/v1/webhooks/clerk` - Clerk webhook handler

### Users
- `GET /api/v1/users` - Get all users
- `GET /api/v1/users/me` - Get current user
- `GET /api/v1/users/:id` - Get user by ID
- `POST /api/v1/users` - Create user
- `PATCH /api/v1/users/:id` - Update user
- `DELETE /api/v1/users/:id` - Delete user

### Documents
- `GET /api/v1/documents` - Get all documents
- `GET /api/v1/documents/search` - Search documents
- `GET /api/v1/documents/my-documents` - Get user documents
- `GET /api/v1/documents/:id` - Get document by ID
- `POST /api/v1/documents` - Create document
- `PATCH /api/v1/documents/:id` - Update document
- `DELETE /api/v1/documents/:id` - Delete document
- `POST /api/v1/documents/:id/download` - Increment download count

### Files
- `GET /api/v1/files` - Get all files
- `GET /api/v1/files/:id` - Get file by ID
- `POST /api/v1/files` - Create file
- `PATCH /api/v1/files/:id` - Update file
- `DELETE /api/v1/files/:id` - Delete file
- `POST /api/v1/files/:id/download` - Increment download count

## 🧪 Testing

```bash
# Run unit tests
npm run test

# Run e2e tests
npm run test:e2e

# Run tests with coverage
npm run test:cov
```

## 🚀 Deployment

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Set production environment variables**
   ```bash
   NODE_ENV=production
   DB_HOST=your-production-db-host
   # ... other production config
   ```

3. **Run migrations**
   ```bash
   npm run migration:run
   ```

4. **Start the application**
   ```bash
   npm run start:prod
   ```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License.
