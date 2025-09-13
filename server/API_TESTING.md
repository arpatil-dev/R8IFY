# API Testing Guide - Authentication Endpoints

## Base URL
```
http://localhost:5000/api/auth
```

## 1. Register User Endpoint

### Endpoint
```
POST /api/auth/register
```

### Headers
```json
{
  "Content-Type": "application/json"
}
```

### Sample Request Body
```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "password": "securePassword123",
  "address": "123 Main Street, City, Country",
  "role": "USER"
}
```

### Sample Response (Success - 201)
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john.doe@example.com",
      "address": "123 Main Street, City, Country",
      "role": "USER",
      "createdAt": "2025-09-12T10:30:00.000Z",
      "updatedAt": "2025-09-12T10:30:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJqb2huLmRvZUBleGFtcGxlLmNvbSIsInJvbGUiOiJVU0VSIiwiaWF0IjoxNjk0NTIwNjAwLCJleHAiOjE2OTQ2MDcwMDB9.example_token_signature"
  },
  "error": null
}
```

### Sample Response (Error - 409)
```json
{
  "success": false,
  "message": "User already exists with this email",
  "data": null,
  "error": "Conflict"
}
```

### Sample Response (Error - 400)
```json
{
  "success": false,
  "message": "Email, password, and name are required",
  "data": null,
  "error": "Validation Error"
}
```

## 2. Login User Endpoint

### Endpoint
```
POST /api/auth/login
```

### Headers
```json
{
  "Content-Type": "application/json"
}
```

### Sample Request Body
```json
{
  "email": "john.doe@example.com",
  "password": "securePassword123"
}
```

### Sample Response (Success - 200)
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john.doe@example.com",
      "address": "123 Main Street, City, Country",
      "role": "USER",
      "createdAt": "2025-09-12T10:30:00.000Z",
      "updatedAt": "2025-09-12T10:30:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJqb2huLmRvZUBleGFtcGxlLmNvbSIsInJvbGUiOiJVU0VSIiwiaWF0IjoxNjk0NTIwNjAwLCJleHAiOjE2OTQ2MDcwMDB9.example_token_signature"
  },
  "error": null
}
```

### Sample Response (Error - 401)
```json
{
  "success": false,
  "message": "Invalid email or password",
  "data": null,
  "error": "Authentication Error"
}
```

### Sample Response (Error - 400)
```json
{
  "success": false,
  "message": "Email and password are required",
  "data": null,
  "error": "Validation Error"
}
```

## 3. Logout User Endpoint

### Endpoint
```
POST /api/auth/logout
```

### Headers
```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer your_jwt_token_here"
}
```

### Sample Response (Success - 200)
```json
{
  "success": true,
  "message": "Logout successful",
  "data": null,
  "error": null
}
```

## 4. Testing Protected Routes (Example)

### Using JWT Token for Protected Routes
```json
{
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJqb2huLmRvZUBleGFtcGxlLmNvbSIsInJvbGUiOiJVU0VSIiwiaWF0IjoxNjk0NTIwNjAwLCJleHAiOjE2OTQ2MDcwMDB9.example_token_signature"
}
```

## Sample Test Data Sets

### Test User 1 (Regular User)
```json
{
  "name": "Alice Johnson",
  "email": "alice.johnson@example.com",
  "password": "password123",
  "address": "456 Oak Avenue, Springfield, USA",
  "role": "USER"
}
```

### Test User 2 (Admin User)
```json
{
  "name": "Bob Admin",
  "email": "bob.admin@example.com",
  "password": "adminPass456",
  "address": "789 Admin Street, HQ City, USA",
  "role": "ADMIN"
}
```

### Test User 3 (Minimal Data)
```json
{
  "name": "Charlie Smith",
  "email": "charlie.smith@example.com",
  "password": "charlie123"
}
```

### Test User 4 (Manager Role)
```json
{
  "name": "Diana Manager",
  "email": "diana.manager@example.com",
  "password": "managerPass789",
  "address": "321 Management Blvd, Corp City, USA",
  "role": "MANAGER"
}
```

## Error Test Cases

### 1. Invalid Email Format
```json
{
  "name": "Test User",
  "email": "invalid-email",
  "password": "password123"
}
```

### 2. Missing Required Fields
```json
{
  "email": "test@example.com"
}
```

### 3. Wrong Password (for login)
```json
{
  "email": "john.doe@example.com",
  "password": "wrongPassword"
}
```

### 4. Non-existent User (for login)
```json
{
  "email": "nonexistent@example.com",
  "password": "password123"
}
```

## cURL Commands for Testing

### Register User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john.doe@example.com",
    "password": "securePassword123",
    "address": "123 Main Street, City, Country"
  }'
```

### Login User
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@example.com",
    "password": "securePassword123"
  }'
```

### Logout User
```bash
curl -X POST http://localhost:5000/api/auth/logout \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

## Postman Collection

You can import this JSON into Postman for easier testing:

```json
{
  "info": {
    "name": "R8IFY Auth API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Register User",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"name\": \"John Doe\",\n  \"email\": \"john.doe@example.com\",\n  \"password\": \"securePassword123\",\n  \"address\": \"123 Main Street, City, Country\"\n}"
        },
        "url": {
          "raw": "http://localhost:5000/api/auth/register",
          "protocol": "http",
          "host": ["localhost"],
          "port": "5000",
          "path": ["api", "auth", "register"]
        }
      }
    },
    {
      "name": "Login User",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"email\": \"john.doe@example.com\",\n  \"password\": \"securePassword123\"\n}"
        },
        "url": {
          "raw": "http://localhost:5000/api/auth/login",
          "protocol": "http",
          "host": ["localhost"],
          "port": "5000",
          "path": ["api", "auth", "login"]
        }
      }
    },
    {
      "name": "Logout User",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          },
          {
            "key": "Authorization",
            "value": "Bearer {{jwt_token}}"
          }
        ],
        "url": {
          "raw": "http://localhost:5000/api/auth/logout",
          "protocol": "http",
          "host": ["localhost"],
          "port": "5000",
          "path": ["api", "auth", "logout"]
        }
      }
    }
  ]
}
```

## Notes
- Save the JWT token from login/register responses to use in protected routes
- Tokens expire based on your JWT_EXPIRES_IN environment variable (default: 1 day)
- All endpoints return consistent response format with success, message, data, and error fields
- Password is automatically hashed using bcrypt before storage