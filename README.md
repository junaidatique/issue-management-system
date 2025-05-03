# Issue Management System

A RESTful API for managing issues with revision tracking capabilities.

## Table of Contents
- [Project Setup](#project-setup)
- [Database Setup](#database-setup)
- [Configuration Files](#configuration-files)
- [Authentication](#authentication)
- [Running Migrations](#running-migrations)
- [API Documentation](#api-documentation)
  - [Issues](#issues)
    - [Create Issue](#create-issue)
    - [Get Issue](#get-issue)
    - [List Issues](#list-issues)
    - [Update Issue](#update-issue)
    - [Get Issue Revisions](#get-issue-revisions)

## Project Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd <project-directory>
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```env
MYSQLDB_ROOT_PASSWORD=your_password
MYSQLDB_DATABASE=issue_db
MYSQLDB_USER=root
MYSQLDB_LOCAL_PORT=3306
MYSQLDB_DOCKER_PORT=3306
NODE_LOCAL_PORT=8080
NODE_DOCKER_PORT=8080
```

4. Start the application using Docker:
```bash
docker-compose up -d
```

## Database Setup

The project uses MySQL 8.0 running in a Docker container. The database configuration is managed through environment variables and Docker Compose.

### Database Configuration
- Host: mysqldb (Docker service name)
- Port: 3306
- Database: issue_db
- Username: root
- Password: (set in .env file)

### Configuration Files

#### Environment Variables (.env)
The application uses environment variables for configuration. Create a `.env` file in the root directory:

```env
# Database Configuration
MYSQLDB_ROOT_PASSWORD=your_password
MYSQLDB_DATABASE=issue_db
MYSQLDB_USER=root
MYSQLDB_LOCAL_PORT=3306
MYSQLDB_DOCKER_PORT=3306

# Application Configuration
NODE_LOCAL_PORT=8080
NODE_DOCKER_PORT=8080
NODE_ENV=development
```

#### Sequelize Configuration (config/config.json)
The database connection is configured in `config/config.json`. This file contains environment-specific database configurations:

```json
{
  "development": {
    "username": "root",
    "password": "abc123456",
    "database": "issue_db",
    "host": "mysqldb",
    "port": 3306,
    "dialect": "mysql"
  },
  "test": {
    "username": "root",
    "password": "root",
    "database": "test",
    "host": "mysqldb",
    "port": 3306,
    "dialect": "mysql"
  },
  "production": {
    "username": "root",
    "password": "root",
    "database": "prod",
    "host": "mysqldb",
    "port": 3306,
    "dialect": "mysql"
  }
}
```

#### Configuration Options
- `username`: Database username
- `password`: Database password
- `database`: Database name
- `host`: Database host (use 'mysqldb' for Docker)
- `port`: Database port
- `dialect`: Database type (mysql)

#### Environment-Specific Configurations
- `development`: Used during local development
- `test`: Used when running tests
- `production`: Used in production environment

The environment is determined by the `NODE_ENV` environment variable.

### Running Migrations

1. Make sure the containers are running:
```bash
docker-compose up -d
```

2. Run migrations:
```bash
docker-compose exec app npx sequelize-cli db:migrate
```

3. To rollback migrations:
```bash
docker-compose exec app npx sequelize-cli db:migrate:undo:all
```

## API Documentation

### Issues

#### Create Issue
Creates a new issue with an initial revision.

**Endpoint:** `POST /issues`

**Request Body:**
```json
{
    "title": "Bug in issue-service",
    "description": "It does not generate revisions"
}
```

**Response (201 Created):**
```json
{
    "issue": {
        "id": 1,
        "title": "Bug in issue-service",
        "description": "It does not generate revisions",
        "created_by": "system",
        "updated_by": "system",
        "created_at": "2024-03-29T15:40:42.000Z",
        "updated_at": "2024-03-29T15:40:42.000Z"
    }
}
```

#### Get Issue
Retrieves a specific issue by ID.

**Endpoint:** `GET /issues/:id`

**Response (200 OK):**
```json
{
    "issue": {
        "id": 1,
        "title": "Bug in issue-service",
        "description": "It does not generate revisions",
        "created_by": "system",
        "updated_by": "system",
        "created_at": "2024-03-29T15:40:42.000Z",
        "updated_at": "2024-03-29T15:40:42.000Z"
    }
}
```

#### List Issues
Retrieves a paginated list of issues.

**Endpoint:** `GET /issues`

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10, max: 100)

**Response (200 OK):**
```json
{
    "issues": [
        {
            "id": 1,
            "title": "Bug in issue-service",
            "description": "It does not generate revisions",
            "created_by": "system",
            "updated_by": "system",
            "created_at": "2024-03-29T15:40:42.000Z",
            "updated_at": "2024-03-29T15:40:42.000Z"
        }
    ],
    "pagination": {
        "currentPage": 1,
        "totalPages": 5,
        "totalItems": 42,
        "itemsPerPage": 10,
        "hasNextPage": true,
        "hasPreviousPage": false
    }
}
```

#### Update Issue
Updates an existing issue and creates a new revision.

**Endpoint:** `PATCH /issues/:id`

**Request Body:**
```json
{
    "title": "Updated Title",
    "description": "Updated description"
}
```

**Response (200 OK):**
```json
{
    "issue": {
        "id": 1,
        "title": "Updated Title",
        "description": "Updated description",
        "created_by": "system",
        "updated_by": "system",
        "created_at": "2024-03-29T15:40:42.000Z",
        "updated_at": "2024-03-29T15:45:00.000Z"
    }
}
```

#### Get Issue Revisions
Retrieves all revisions for a specific issue.

**Endpoint:** `GET /issues/:id/revisions`

**Response (200 OK):**
```json
{
    "revisions": [
        {
            "id": 2,
            "issue_id": 1,
            "title": "Updated Title",
            "description": "Updated description",
            "changes": {
                "title": "Updated Title",
                "description": "Updated description"
            },
            "created_by": "system",
            "created_at": "2024-03-29T15:45:00.000Z"
        },
        {
            "id": 1,
            "issue_id": 1,
            "title": "Bug in issue-service",
            "description": "It does not generate revisions",
            "changes": {
                "title": "Bug in issue-service",
                "description": "It does not generate revisions"
            },
            "created_by": "system",
            "created_at": "2024-03-29T15:40:42.000Z"
        }
    ]
}
```

### Error Responses

All endpoints may return the following error responses:

**400 Bad Request:**
```json
{
    "message": "Check your request parameters",
    "errors": [
        {
            "message": "Title is required and must be a non-empty string"
        }
    ]
}
```

**404 Not Found:**
```json
{
    "message": "Resource was not found"
}
```

**500 Internal Server Error:**
```json
{
    "message": "Failed to create issue"
}
```

## Database Schema

### Issues Table
```sql
CREATE TABLE issues (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    created_by VARCHAR(255) NOT NULL DEFAULT 'system',
    updated_by VARCHAR(255) NOT NULL DEFAULT 'system',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

### Issue Revisions Table
```sql
CREATE TABLE issue_revisions (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    issue_id INT UNSIGNED NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    changes JSON NOT NULL,
    created_by VARCHAR(255) NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (issue_id) REFERENCES issues(id) ON UPDATE CASCADE ON DELETE CASCADE
);
```

## Development

### Running Tests
```bash
docker-compose exec app npm test
```

### Linting
```bash
docker-compose exec app npm run lint
```

### Hot Reloading
The application supports hot reloading in development mode. Changes to the source code will automatically restart the server.

## Production Deployment

For production deployment:
1. Update the environment variables in `.env`
2. Set `NODE_ENV=production`
3. Build and run the Docker containers:
```bash
docker-compose -f docker-compose.prod.yml up -d
```

## Authentication

The API uses JWT (JSON Web Tokens) for authentication and requires a client ID for all requests.

### JWT Authentication
1. All requests (except discovery and health endpoints) require a valid JWT token
2. The token must be included in the Authorization header:
   ```
   Authorization: Bearer <your-jwt-token>
   ```
3. The JWT token should contain the user's email in its payload
4. The token is verified using the JWT_SECRET environment variable

### Client ID
1. All requests (except discovery and health endpoints) require an X-Client-ID header
2. The header must be included in every request:
   ```
   X-Client-ID: <your-client-id>
   ```

### Example Authenticated Request
```bash
curl -X GET http://localhost:8080/issues \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "X-Client-ID: client-123"
```

### Error Responses

**401 Unauthorized:**
```json
{
    "message": "No token provided"
}
```
or
```json
{
    "message": "Invalid token"
}
```

**400 Bad Request:**
```json
{
    "message": "Check your request parameters",
    "errors": [
        {
            "message": "X-Client-ID header is required"
        }
    ]
}
```
