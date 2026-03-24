# Testing Guide - Authentication & Authorization API

## 📋 Complete Testing Instructions

This guide walks you through testing all API endpoints using Postman.

---

## 🚀 Setup

### Prerequisites
- Postman installed (download from [https://www.postman.com/downloads/](https://www.postman.com/downloads/))
- Server running on `http://localhost:5000`
- MongoDB running locally or connection configured

### Postman Setup
1. Open Postman
2. Click **Import** → **Upload Files**
3. Select `Postman-Collection.json`
4. Create a new Environment (optional, for saving variables)
   - Name: `Local Development`
   - Add variables:
     - `base_url`: `http://localhost:5000`
     - `token`: (empty, will auto-populate)

---

## 📌 Test Scenarios

### 1️⃣ HEALTH CHECK

**Goal**: Verify server is running

**Request**:
```
GET {{base_url}}/health
```

**Expected Response** (200 OK):
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2024-01-15T12:00:00.000Z"
}
```

**Pass Criteria**: ✅ Status 200, success is true

---

### 2️⃣ USER REGISTRATION - SUCCESS CASE

**Goal**: Create a new user account

**Request**:
```
POST {{base_url}}/api/auth/register
Content-Type: application/json

{
  "username": "testuser123",
  "email": "testuser@example.com",
  "password": "SecurePass123",
  "firstName": "Test",
  "lastName": "User"
}
```

**Expected Response** (201 Created):
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "_id": "...",
      "username": "testuser123",
      "email": "testuser@example.com",
      "firstName": "Test",
      "lastName": "User",
      "role": "user",
      "isActive": true,
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    },
    "token": "eyJhbGc..."
  }
}
```

**Pass Criteria**: ✅ Status 201, user created, token provided

**Postman Script** (Set in Tests tab):
```javascript
if (pm.response.code === 201 && pm.response.json().data.token) {
    pm.environment.set("token", pm.response.json().data.token);
    pm.environment.set("userId", pm.response.json().data.user._id);
    console.log("✅ Token saved to environment");
}
```

---

### 3️⃣ USER REGISTRATION - VALIDATION ERROR

**Goal**: Test validation rules

#### Test Case 3a: Weak Password
```
POST {{base_url}}/api/auth/register
{
  "username": "testuser123",
  "email": "test2@example.com",
  "password": "weak",
  "firstName": "Test",
  "lastName": "User"
}
```

**Expected Response** (400 Bad Request):
```json
{
  "success": false,
  "message": "Validation error",
  "errors": [
    {
      "type": "field",
      "value": "weak",
      "msg": "Need uppercase, lowercase, number",
      "path": "password",
      "location": "body"
    }
  ]
}
```

**Pass Criteria**: ✅ Status 400, validation error returned

#### Test Case 3b: Invalid Email
```
POST {{base_url}}/api/auth/register
{
  "username": "testuser123",
  "email": "invalid-email",
  "password": "SecurePass123",
  "firstName": "Test",
  "lastName": "User"
}
```

**Expected Response** (400 Bad Request):
```json
{
  "success": false,
  "message": "Validation error",
  "errors": [
    {
      "type": "field",
      "msg": "Valid email required",
      "path": "email",
      "location": "body"
    }
  ]
}
```

#### Test Case 3c: Short Username
```
POST {{base_url}}/api/auth/register
{
  "username": "ab",
  "email": "test3@example.com",
  "password": "SecurePass123",
  "firstName": "Test",
  "lastName": "User"
}
```

**Expected Response** (400 Bad Request) - Username < 3 chars

---

### 4️⃣ USER REGISTRATION - DUPLICATE USER

**Goal**: Test duplicate prevention

```
POST {{base_url}}/api/auth/register
{
  "username": "testuser123",
  "email": "testuser@example.com",
  "password": "SecurePass123",
  "firstName": "Test",
  "lastName": "User"
}
```

(Using same email/username as Test 2️⃣)

**Expected Response** (400 Bad Request):
```json
{
  "success": false,
  "message": "User with this email or username already exists"
}
```

**Pass Criteria**: ✅ Status 400, duplicate prevented

---

### 5️⃣ USER LOGIN - SUCCESS CASE

**Goal**: Authenticate user and receive token

```
POST {{base_url}}/api/auth/login
Content-Type: application/json

{
  "email": "testuser@example.com",
  "password": "SecurePass123"
}
```

**Expected Response** (200 OK):
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "_id": "...",
      "username": "testuser123",
      "email": "testuser@example.com",
      "firstName": "Test",
      "lastName": "User",
      "role": "user",
      "isActive": true,
      "lastLogin": "2024-01-15T11:45:00.000Z",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T11:45:00.000Z"
    },
    "token": "eyJhbGc..."
  }
}
```

**Pass Criteria**: ✅ Status 200, token provided, lastLogin updated

**Postman Script** (Tests):
```javascript
if (pm.response.code === 200) {
    pm.environment.set("token", pm.response.json().data.token);
    console.log("✅ Login token saved");
}
```

---

### 6️⃣ USER LOGIN - WRONG PASSWORD

**Goal**: Verify incorrect password handling

```
POST {{base_url}}/api/auth/login
{
  "email": "testuser@example.com",
  "password": "WrongPass123"
}
```

**Expected Response** (401 Unauthorized):
```json
{
  "success": false,
  "message": "Invalid credentials"
}
```

**Pass Criteria**: ✅ Status 401, no sensitive info leaked

---

### 7️⃣ USER LOGIN - MISSING FIELDS

**Goal**: Test field validation

```
POST {{base_url}}/api/auth/login
{
  "email": "testuser@example.com"
}
```

**Expected Response** (400 Bad Request):
```json
{
  "success": false,
  "message": "Please provide email and password"
}
```

**Pass Criteria**: ✅ Status 400, clear error message

---

### 8️⃣ GET USER INFO - AUTHENTICATED

**Goal**: Retrieve user info using valid token

```
GET {{base_url}}/api/auth/me
Authorization: Bearer {{token}}
Content-Type: application/json
```

**Expected Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "username": "testuser123",
    "email": "testuser@example.com",
    "firstName": "Test",
    "lastName": "User",
    "role": "user",
    "isActive": true,
    "lastLogin": "2024-01-15T11:45:00.000Z",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T11:45:00.000Z"
  }
}
```

**Pass Criteria**: ✅ Status 200, user data returned, no password field

---

### 9️⃣ GET USER INFO - MISSING TOKEN

**Goal**: Test authentication requirement

```
GET {{base_url}}/api/auth/me
Content-Type: application/json
```

(No Authorization header)

**Expected Response** (401 Unauthorized):
```json
{
  "success": false,
  "message": "No authorization header provided"
}
```

**Pass Criteria**: ✅ Status 401, route is protected

---

### 🔟 GET USER INFO - INVALID TOKEN

**Goal**: Test invalid token handling

```
GET {{base_url}}/api/auth/me
Authorization: Bearer invalid_token_xyz
Content-Type: application/json
```

**Expected Response** (401 Unauthorized):
```json
{
  "success": false,
  "message": "Invalid token"
}
```

**Pass Criteria**: ✅ Status 401, invalid token rejected

---

### 1️⃣1️⃣ PROTECTED ROUTE - USER ACCESS

**Goal**: Test role-based access control

```
GET {{base_url}}/api/protected
Authorization: Bearer {{token}}
Content-Type: application/json
```

**Expected Response** (200 OK):
```json
{
  "success": true,
  "message": "You have access to this protected route",
  "userId": "..."
}
```

**Pass Criteria**: ✅ Status 200, access granted

---

### 1️⃣2️⃣ ADMIN ROUTE - USER ACCESS DENIED

**Goal**: Test role restriction (user can't access admin route)

```
GET {{base_url}}/api/admin
Authorization: Bearer {{token}}
Content-Type: application/json
```

(Using token from non-admin user)

**Expected Response** (403 Forbidden):
```json
{
  "success": false,
  "message": "Access denied. Required role(s): admin"
}
```

**Pass Criteria**: ✅ Status 403, role-based access enforced

---

### 1️⃣3️⃣ ERROR HANDLING - NOT FOUND

**Goal**: Test 404 handling

```
GET {{base_url}}/api/nonexistent
```

**Expected Response** (404 Not Found):
```json
{
  "success": false,
  "message": "Route not found",
  "path": "/api/nonexistent"
}
```

**Pass Criteria**: ✅ Status 404, helpful error message

---

## 🧪 Test Execution Checklist

- [ ] 1️⃣ Health Check - Pass
- [ ] 2️⃣ Register User (Success) - Pass
- [ ] 3️⃣ Register User (Validation) - Pass
- [ ] 3a️⃣ Weak Password - Pass
- [ ] 3b️⃣ Invalid Email - Pass
- [ ] 3c️⃣ Short Username - Pass
- [ ] 4️⃣ Duplicate User - Pass
- [ ] 5️⃣ Login (Success) - Pass
- [ ] 6️⃣ Login (Wrong Password) - Pass
- [ ] 7️⃣ Login (Missing Fields) - Pass
- [ ] 8️⃣ Get User Info (Authenticated) - Pass
- [ ] 9️⃣ Get User Info (Missing Token) - Pass
- [ ] 🔟 Get User Info (Invalid Token) - Pass
- [ ] 1️⃣1️⃣ Protected Route - Pass
- [ ] 1️⃣2️⃣ Admin Route - Pass
- [ ] 1️⃣3️⃣ Not Found - Pass

**All Passed**: ✅ Yes / ❌ No

---

## 📝 Test Report Template

```
TEST EXECUTION REPORT
=====================

Date: [DATE]
Tester: [NAME]
Environment: Development
Server URL: http://localhost:5000
MongoDB: [LOCAL/ATLAS]

RESULTS SUMMARY:
- Total Tests: 16
- Passed: [X]
- Failed: [Y]
- Pass Rate: [X/16]%

DETAILED RESULTS:
[List any failures with details]

NOTES:
[Any observations or issues]

SIGN-OFF:
Tester: ________________  Date: __________
```

---

## 🐛 Debugging Tips

### Issue: "Cannot connect to MongoDB"
- Verify MongoDB is running locally
- Check `MONGODB_URI` in `.env`
- Test connection: `mongo` in terminal

### Issue: "Invalid token" on every request
- Ensure `JWT_SECRET` matches between server and .env
- Token may have expired (default 7 days)
- Check Authorization header format: `Bearer <token>`

### Issue: "CORS error"
- If using from browser, may need CORS middleware
- Check that Content-Type header is set to `application/json`

### Issue: "Validation always fails"
- Password must have: uppercase, lowercase, number
- Email must be valid format (user@domain.com)
- Username must be 3-30 characters

---

## 🎯 Performance Testing

### Load Testing  
```bash
# Using Apache Bench (2000 requests, 100 concurrent)
ab -n 2000 -c 100 http://localhost:5000/health
```

### Expected Results:
- Response time: < 100ms per request
- No dropped connections
- Error rate: < 1%

---

## ✅ Final Checklist

- [ ] All endpoints responding correctly
- [ ] Error handling working as expected
- [ ] Validation rules enforced
- [ ] JWT tokens generated and verified
- [ ] Role-based access control working
- [ ] Database operations successful
- [ ] No security vulnerabilities found
- [ ] Documentation matches implementation
- [ ] Postman collection imports successfully
- [ ] Ready for production deployment

---

**Testing Status**: [Ready / In Progress / Complete]

**Last Updated**: March 24, 2026
