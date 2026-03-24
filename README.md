# Authentication & Authorization API

A comprehensive Node.js REST API with user authentication and authorization using JWT tokens. Built with Express.js, MongoDB (Mongoose), and bcryptjs for password hashing.

## 📋 Features

- ✅ **User Registration** - Create new user accounts with validation
- ✅ **User Login** - Authenticate users with email and password
- ✅ **JWT Authentication** - Secure token-based authentication
- ✅ **Password Hashing** - Bcryptjs with salt rounds for secure password storage
- ✅ **Role-Based Access Control** - User and Admin roles with permission checks
- ✅ **Input Validation** - Express-validator for request validation
- ✅ **Error Handling** - Comprehensive error handling and status codes
- ✅ **MongoDB Integration** - Mongoose ORM for database operations
- ✅ **Environment Variables** - Dotenv for configuration management

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js 5.2.1
- **Database**: MongoDB with Mongoose 9.3.1
- **Authentication**: JWT (jsonwebtoken 9.0.3)
- **Password Hashing**: bcryptjs 3.0.3
- **Validation**: express-validator 7.3.1
- **Development**: nodemon 3.1.14
- **Environment**: dotenv 17.3.1

## 📁 Project Structure

```
.
├── config/
│   └── db.js                 # MongoDB connection configuration
├── controllers/
│   └── authController.js     # Authentication logic and handlers
├── middleware/
│   ├── auth.js               # JWT verification & role checking
│   └── validation.js         # Request validation rules
├── models/
│   └── User.js               # User schema and methods
├── routes/
│   └── auth.js               # API routes
├── server.js                 # Server setup and middleware configuration
├── .env                      # Environment variables
├── package.json              # Dependencies and scripts
└── README.md                 # This file
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Clone or navigate to the project directory**
   ```bash
   cd class-40-Assg_Authentication_Authorization
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   Create or update `.env` file with:
   ```env
   # Database Configuration
   MONGODB_URI=mongodb://localhost:27017/auth-app
   # For MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/auth-app
   
   # JWT Configuration
   JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
   JWT_EXPIRE=7d
   
   # Server Configuration
   PORT=5000
   NODE_ENV=development
   ```

4. **Start the server**
   ```bash
   npm run dev
   ```

   The server will run on `http://localhost:5000`

## 📚 API Endpoints

### Base URL
```
http://localhost:5000/api
```

### 1. User Registration

**Endpoint**: `POST /auth/register`

**Description**: Create a new user account

**Request Headers**:
```
Content-Type: application/json
```

**Request Body**:
```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "SecurePass123",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Success Response** (201):
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "_id": "65a1b2c3d4e5f6g7h8i9j0k1",
      "username": "johndoe",
      "email": "john@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "user",
      "isActive": true,
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Response** (400/500):
```json
{
  "success": false,
  "message": "User with this email or username already exists"
}
```

**Validation Rules**:
- `username`: Required, 3-30 characters, unique
- `email`: Required, valid email format, unique
- `password`: Required, minimum 6 characters, must contain uppercase, lowercase, and number
- `firstName`: Optional
- `lastName`: Optional

---

### 2. User Login

**Endpoint**: `POST /auth/login`

**Description**: Authenticate user and receive JWT token

**Request Headers**:
```
Content-Type: application/json
```

**Request Body**:
```json
{
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

**Success Response** (200):
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "_id": "65a1b2c3d4e5f6g7h8i9j0k1",
      "username": "johndoe",
      "email": "john@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "user",
      "isActive": true,
      "lastLogin": "2024-01-15T11:45:00.000Z",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T11:45:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Responses**:
- 400: Missing email or password
- 401: Invalid credentials
- 403: User account is inactive

```json
{
  "success": false,
  "message": "Invalid credentials"
}
```

**Validation Rules**:
- `email`: Required, valid email format
- `password`: Required

---

### 3. Get Current User Information

**Endpoint**: `GET /auth/me`

**Description**: Retrieve authenticated user's information using JWT token

**Request Headers**:
```
Content-Type: application/json
Authorization: Bearer <your_jwt_token>
```

**Example Header**:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Success Response** (200):
```json
{
  "success": true,
  "data": {
    "_id": "65a1b2c3d4e5f6g7h8i9j0k1",
    "username": "johndoe",
    "email": "john@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "user",
    "isActive": true,
    "lastLogin": "2024-01-15T11:45:00.000Z",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T11:45:00.000Z"
  }
}
```

**Error Responses**:
- 401: No authorization header / Invalid token / Token expired
- 404: User not found
- 500: Server error

```json
{
  "success": false,
  "message": "No authorization header provided"
}
```

---

### 4. Protected Route Example

**Endpoint**: `GET /protected`

**Description**: Example route that requires valid JWT token

**Request Headers**:
```
Authorization: Bearer <your_jwt_token>
```

**Success Response** (200):
```json
{
  "success": true,
  "message": "You have access to this protected route",
  "userId": "65a1b2c3d4e5f6g7h8i9j0k1"
}
```

---

### 5. Admin-Only Route Example

**Endpoint**: `GET /admin`

**Description**: Example route that requires JWT token with 'admin' role

**Request Headers**:
```
Authorization: Bearer <your_jwt_token>
```

**Success Response** (200):
```json
{
  "success": true,
  "message": "You have access to admin resources",
  "userId": "65a1b2c3d4e5f6g7h8i9j0k1"
}
```

**Error Response** (403):
```json
{
  "success": false,
  "message": "Access denied. Required role(s): admin"
}
```

---

### 6. Health Check

**Endpoint**: `GET /health`

**Description**: Check server status

**Success Response** (200):
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2024-01-15T12:00:00.000Z"
}
```

---

## 🔐 Authentication Flow

### Registration Flow
```
Client Request (POST /auth/register)
         ↓
Validate Input (express-validator)
         ↓
Check Duplicate (email/username)
         ↓
Create User Document
         ↓
Hash Password (bcryptjs pre-save hook)
         ↓
Save to MongoDB
         ↓
Generate JWT Token
         ↓
Return User Data + Token
```

### Login Flow
```
Client Request (POST /auth/login)
         ↓
Validate Email & Password Format
         ↓
Find User by Email
         ↓
Compare Passwords (bcryptjs)
         ↓
Check User Active Status
         ↓
Update Last Login timestamp
         ↓
Generate JWT Token
         ↓
Return User Data + Token
```

### Protected Route Flow
```
Client Request with Token (GET /auth/me)
         ↓
Extract Token from Authorization Header
         ↓
Verify Token Signature & Expiration
         ↓
Decode Token (get user ID)
         ↓
Attach User Info to Request (req.user)
         ↓
Controller Processes Request
         ↓
Return User Information
```

---

## 📝 User Model Schema

```javascript
{
  username: String (required, unique, 3-30 chars),
  email: String (required, unique, valid email format),
  password: String (required, min 6 chars, hashed),
  firstName: String (optional),
  lastName: String (optional),
  isActive: Boolean (default: true),
  role: String (enum: ['user', 'admin'], default: 'user'),
  lastLogin: Date (default: null),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

---

## 🔑 Environment Variables Explanation

| Variable | Description | Default |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/auth-app` |
| `JWT_SECRET` | Secret key for JWT signing | `your_super_secret_jwt_key_change_this_in_production` |
| `JWT_EXPIRE` | JWT token expiration time | `7d` |
| `PORT` | Server port | `5000` |
| `NODE_ENV` | Environment mode | `development` |

---

## ⚙️ Middleware Components

### 1. Authorization Middleware (`auth.js`)
- **verifyToken**: Extracts and validates JWT from Authorization header
- **checkRole**: Verifies user has required role(s)

### 2. Validation Middleware (`validation.js`)
- **validateRegistration**: Validates registration input fields
- **validateLogin**: Validates login credentials
- **handleValidationErrors**: Catches and returns validation errors

### 3. Request Logging Middleware
- Logs all incoming requests with timestamp and method

---

## 🚨 Error Handling

The API returns standard HTTP status codes with descriptive error messages:

| Status | Meaning |
|--------|---------|
| 200 | OK - Request succeeded |
| 201 | Created - Resource created successfully |
| 400 | Bad Request - Invalid input/validation error |
| 401 | Unauthorized - Invalid/missing authentication |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource not found |
| 500 | Internal Server Error - Server error |

---

## 🧪 Testing with Postman

1. **Import Postman Collection**: Use the provided `postman-collection.json` file
2. **Set Environment Variables**: Configure `base_url` and `token` in Postman environment
3. **Test Endpoints**: Run requests in order (Register → Login → Get Me)

### Postman Tips:
- Store JWT token in a variable after login: `pm.environment.set("token", pm.response.json().data.token);`
- Use token in Authorization header: `Authorization: Bearer {{token}}`
- Enable request logging for debugging

---

## 🔒 Security Best Practices Implemented

✅ Password hashing with bcriptjs (10 salt rounds)
✅ JWT tokens with expiration
✅ Environment variables for sensitive data
✅ Input validation and sanitization
✅ Error messages don't leak sensitive information
✅ Password excluded from user responses
✅ Role-based access control
✅ User active status checking

---

## 📦 Scripts

```bash
# Run development server with auto-reload
npm run dev

# Run server (direct node)
node server.js
```

---

## 🐛 Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running
- Check `MONGODB_URI` in `.env` file
- For MongoDB Atlas, use correct connection string with username/password

### JWT Token Errors
- Ensure `JWT_SECRET` is set in `.env`
- Token format must be: `Bearer <token>`
- Tokens expire after duration specified in `JWT_EXPIRE`

### Validation Errors
- Password must contain uppercase, lowercase, and number
- Email must be in valid format (user@domain.com)
- Username must be 3-30 characters

---

## 📄 License

ISC

---

## 👤 Author

Class-40 Authentication & Authorization Assignment

---

## 📞 Support

For issues or questions, check the error messages returned by the API or review the server console logs.
