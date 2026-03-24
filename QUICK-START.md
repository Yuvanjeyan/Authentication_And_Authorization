# 🚀 Quick Start Guide

Get the Authentication & Authorization API up and running in 5 minutes!

---

## ⚡ 5-Minute Setup

### Step 1: Install Dependencies (1 min)
```bash
npm install
```

### Step 2: Configure Environment (1 min)
Create `.env` file in root directory:
```env
MONGODB_URI=mongodb://localhost:27017/auth-app
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d
PORT=5000
NODE_ENV=development
```

**Note**: For MongoDB Atlas, replace the URI:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/auth-app
```

### Step 3: Start MongoDB (1 min)
```bash
# On Windows (if installed)
mongod

# Or use MongoDB Atlas (cloud) - no local setup needed
```

### Step 4: Start Server (1 min)
```bash
npm run dev
```

**Expected Output**:
```
Server is running on port 5000
Environment: development
MongoDB URI: mongodb://localhost:27017/auth-app
```

### Step 5: Test API (1 min)
Open Postman and import `Postman-Collection.json`:
```
File → Import → Upload → Postman-Collection.json
```

**Test Health Check**:
```
GET http://localhost:5000/health
```

✅ **You're ready!**

---

## 📱 First API Calls

### 1. Register a User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "johndoe",
    "email": "john@example.com",
    "password": "SecurePass123",
    "firstName": "John",
    "lastName": "Doe"
  }'
```

**Response**:
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": { ... },
    "token": "eyJhbGc..."
  }
}
```

### 2. Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePass123"
  }'
```

### 3. Get User Info (Requires Token)
```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer <your_token_here>"
```

---

## 🐛 Common Issues & Solutions

### MongoDB Connection Error
```
Error connecting to MongoDB: MongoServerError
```

**Solution**:
```bash
# Start MongoDB
mongod

# Or use MongoDB Atlas with connection string
```

### Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::5000
```

**Solution**:
```bash
# Use a different port
PORT=3000 npm run dev

# Or kill the process on port 5000
lsof -i :5000
kill -9 <PID>
```

### Invalid Password Error
```
Validation error: "Need uppercase, lowercase, number"
```

**Solution**: Password must contain:
- ✅ Uppercase letter (A-Z)
- ✅ Lowercase letter (a-z)
- ✅ Number (0-9)

**Valid**: `SecurePass123`
**Invalid**: `password123`, `PASSWORD123`, `securepass`

---

## 📁 Project Structure

```
.
├── 📄 README.md          ← Full documentation
├── 📄 TESTING-GUIDE.md   ← How to test all endpoints
├── 📄 REQUIREMENTS-CHECKLIST.md ← What's implemented
├── 📄 .env               ← Environment variables
├── 📄 .env.example       ← Template for .env
├── 📄 package.json       ← Dependencies
├── 📄 Postman-Collection.json ← Import to Postman
│
├── 📁 server.js          ← Express app setup
├── 📁 config/
│   └── db.js            ← MongoDB connection
├── 📁 models/
│   └── User.js          ← User schema
├── 📁 controllers/
│   └── authController.js ← Business logic
├── 📁 routes/
│   └── auth.js          ← API endpoints
└── 📁 middleware/
    ├── auth.js          ← JWT verification
    └── validation.js    ← Input validation
```

---

## 🔑 API Endpoints Reference

| Method | Endpoint | Protected | Purpose |
|--------|----------|-----------|---------|
| POST | `/api/auth/register` | ❌ No | Create account |
| POST | `/api/auth/login` | ❌ No | Get JWT token |
| GET | `/api/auth/me` | ✅ Yes | Get user info |
| GET | `/api/protected` | ✅ Yes | Protected route example |
| GET | `/api/admin` | ✅ Yes | Admin-only route |
| GET | `/health` | ❌ No | Server status |

---

## 🚀 Next Steps

### For Development
1. ✅ Run `npm run dev` to start with auto-reload
2. ✅ Edit files and server restarts automatically
3. ✅ Check console for logs and errors
4. ✅ Use Postman to test endpoints

### For Learning
1. Read [README.md](README.md) for detailed documentation
2. Review [TESTING-GUIDE.md](TESTING-GUIDE.md) for test scenarios
3. Check code comments for implementation details
4. Modify endpoints in `routes/auth.js`

### For Deployment
1. Update `JWT_SECRET` to a strong random value
2. Switch to MongoDB Atlas
3. Set `NODE_ENV=production`
4. Use environment-specific secrets management
5. Deploy to hosting service (Heroku, AWS, Azure, etc.)

---

## 📚 Documentation Files

- **[README.md](README.md)** - Complete API documentation
- **[TESTING-GUIDE.md](TESTING-GUIDE.md)** - Test all endpoints
- **[REQUIREMENTS-CHECKLIST.md](REQUIREMENTS-CHECKLIST.md)** - Feature checklist
- **[Postman-Collection.json](Postman-Collection.json)** - API collection
- **.env.example** - Environment variables template

---

## ⚙️ Available Commands

```bash
# Start development server (auto-reload)
npm run dev

# Start production server
node server.js

# Install dependencies
npm install

# Update dependencies
npm update
```

---

## 🔒 Security Reminders

⚠️ **Before Production**:
- [ ] Change `JWT_SECRET` to random 32-character string
- [ ] Use strong database password
- [ ] Enable HTTPS
- [ ] Set up rate limiting
- [ ] Use environment secrets management
- [ ] Never commit `.env` file to Git

---

## 💡 Tips & Tricks

### Store Token in Postman Environment
1. Login to get a token
2. In **Tests** tab, add:
```javascript
pm.environment.set("token", pm.response.json().data.token);
```
3. Use `{{token}}` in Authorization header

### Test with cURL
```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"user1","email":"user@test.com","password":"Pass123"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@test.com","password":"Pass123"}'

# Get User Info
curl http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### View MongoDB Data
```bash
# Using MongoDB CLI
mongo

# Select database
use auth-app

# View users
db.users.find()

# View user count
db.users.countDocuments()
```

---

## 🆘 Need Help?

1. **Check logs** in terminal for error messages
2. **Read errors** carefully - they usually explain what's wrong
3. **Review [README.md](README.md)** for API details
4. **Check [TESTING-GUIDE.md](TESTING-GUIDE.md)** for examples
5. **Verify setup** in [.env](.env) file

---

## ✅ Setup Verification Checklist

- [ ] Node.js installed (`node --version`)
- [ ] MongoDB running (`mongod` or Atlas)
- [ ] Dependencies installed (`npm install`)
- [ ] `.env` file created and configured
- [ ] Server starts without errors (`npm run dev`)
- [ ] Health check returns 200 (`/health`)
- [ ] Can register user successfully
- [ ] Can login and get token
- [ ] Can access protected route with token
- [ ] Postman collection imported

**All checked?** 🎉 **You're all set!**

---

**Happy coding! 🚀**

Need more info? Check the full [README.md](README.md)
