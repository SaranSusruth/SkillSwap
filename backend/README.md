# SkillSwap - Backend API

A comprehensive skill-sharing platform backend built with **Node.js, Express, and MongoDB**. This platform allows users to share their skills, connect with mentors, book sessions, and leave reviews.

## 📋 Features

✅ **User Authentication** - Secure registration & login with JWT  
✅ **Skill Management** - Create, update, delete, and search skills  
✅ **Session Booking** - Book learning sessions with mentors  
✅ **Reviews & Ratings** - Rate mentors and skills after sessions  
✅ **User Profiles** - Complete user profiles with bio and ratings  
✅ **Search & Filter** - Find users and skills by category and level  
✅ **Error Handling** - Comprehensive error handling & validation  

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **Environment**: dotenv

## 📁 Project Structure

```
backend/
├── models/                    # Mongoose schemas
│   ├── User.js              # User model
│   ├── Skill.js             # Skill model
│   ├── Session.js           # Session/Booking model
│   └── Review.js            # Review & Rating model
│
├── controllers/              # Business logic
│   ├── authController.js    # Auth operations
│   ├── userController.js    # User operations
│   ├── skillController.js   # Skill operations
│   └── sessionController.js # Session operations
│
├── routes/                   # API endpoints
│   ├── auth.js
│   ├── users.js
│   ├── skills.js
│   └── sessions.js
│
├── middleware/               # Custom middleware
│   ├── auth.js              # JWT authentication
│   ├── validation.js        # Input validation
│   └── errorHandler.js      # Error handling
│
├── config/
│   └── database.js          # MongoDB connection
│
├── .env                      # Environment variables
├── .gitignore
├── server.js               # Main server file
└── package.json
```

## 🚀 Installation & Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Setup
Create a `.env` file with:
```
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/skillswap
JWT_SECRET=your_jwt_secret_key_change_in_production
CORS_ORIGIN=http://localhost:3000
```

### 3. Start the Server
```bash
# Production
npm start

# Development (with auto-reload)
npm run dev
```

Server runs on `http://localhost:5000`

## 📚 API Endpoints

### 🔐 Authentication (`/api/auth`)

#### Register User
```
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "confirmPassword": "password123"
}

Response: { token, user }
```

#### Login User
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}

Response: { token, user }
```

#### Get Current User
```
GET /api/auth/me
Authorization: Bearer <token>

Response: { user }
```

---

### 👥 Users (`/api/users`)

#### Get All Users
```
GET /api/users?skill=programming&role=mentor

Response: { count, users[] }
```

#### Get User by ID
```
GET /api/users/:id

Response: { user }
```

#### Update Profile
```
PUT /api/users/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "John Updated",
  "bio": "Expert in web development",
  "phone": "+1234567890",
  "profileImage": "url"
}

Response: { message, user }
```

#### Search Users
```
GET /api/users/search?query=john

Response: { count, users[] }
```

#### Delete Account
```
DELETE /api/users/account
Authorization: Bearer <token>

Response: { message }
```

---

### 🎓 Skills (`/api/skills`)

#### Create Skill
```
POST /api/skills
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Web Development",
  "description": "Full stack web development",
  "category": "programming",
  "level": "advanced",
  "tags": ["javascript", "react", "nodejs"]
}

Response: { message, skill }
```

#### Get All Skills
```
GET /api/skills?category=programming&level=beginner&search=javascript

Response: { count, skills[] }
```

#### Get Skill by ID
```
GET /api/skills/:id

Response: { skill }
```

#### Get Skills by User
```
GET /api/skills/user/:userId

Response: { count, skills[] }
```

#### Update Skill
```
PUT /api/skills/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Advanced Web Development",
  "level": "advanced"
}

Response: { message, skill }
```

#### Delete Skill
```
DELETE /api/skills/:id
Authorization: Bearer <token>

Response: { message }
```

---

### 📅 Sessions (`/api/sessions`)

#### Create Session (Booking)
```
POST /api/sessions
Authorization: Bearer <token>
Content-Type: application/json

{
  "mentorId": "mentor_id",
  "skillId": "skill_id",
  "title": "JavaScript Basics",
  "description": "Learn JavaScript fundamentals",
  "sessionDate": "2024-04-15T10:00:00Z",
  "duration": 60,
  "mode": "online",
  "location": null
}

Response: { message, session }
```

#### Get All Sessions
```
GET /api/sessions

Response: { count, sessions[] }
```

#### Get Session by ID
```
GET /api/sessions/:id

Response: { session }
```

#### Get User Sessions
```
GET /api/sessions/user?type=mentor
Authorization: Bearer <token>

Response: { count, sessions[] }
```
**type options**: `mentor`, `student`, `all`

#### Update Session Status
```
PUT /api/sessions/:id/status
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "confirmed"
}

Response: { message, session }
```
**status options**: `pending`, `confirmed`, `completed`, `cancelled`

#### Review Session
```
POST /api/sessions/:id/review
Authorization: Bearer <token>
Content-Type: application/json

{
  "rating": 5,
  "comment": "Great session! Learned a lot and the instructor was very helpful."
}

Response: { message, review }
```

#### Get User Reviews
```
GET /api/sessions/reviews/:userId

Response: { count, reviews[] }
```

---

## 🔒 Authentication

All protected routes require JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

Token is obtained from login or register endpoints and is valid for **30 days**.

## 📊 Data Models

### User Model
- `name`, `email`, `password`, `phone`, `bio`, `profileImage`
- `skills[]`, `rating`, `totalReviews`, `totalSessions`
- `role` (student, mentor, both), `isActive`
- Timestamps

### Skill Model
- `name`, `description`, `category`, `level`
- `userId` (creator), `rating`, `totalReviews`
- `tags[]`, `isActive`
- Timestamps

### Session Model
- `mentorId`, `studentId`, `skillId`
- `title`, `description`, `sessionDate`, `duration`
- `status`, `mode` (online/offline), `location`
- `reviewed`, `notes`
- Timestamps

### Review Model
- `sessionId`, `skillId`
- `reviewerId`, `revieweeId`
- `rating` (1-5), `comment`
- `helpful` (count)
- Timestamps

## ✅ Input Validation

All endpoints validate input data:
- Email format validation
- Password minimum 6 characters
- Required fields checking
- Enum validation for categories, levels, statuses
- Comment minimum 10 characters for reviews

## ❌ Error Handling

API returns consistent error responses:
```json
{
  "error": "Error message"
}
```

HTTP Status Codes:
- `200` OK
- `201` Created
- `400` Bad Request
- `401` Unauthorized
- `403` Forbidden
- `404` Not Found
- `500` Internal Server Error

## 🎯 Key Endpoints Summary

| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| POST | /api/auth/register | ❌ | User registration |
| POST | /api/auth/login | ❌ | User login |
| GET | /api/users | ❌ | Get all users |
| PUT | /api/users/profile | ✅ | Update profile |
| POST | /api/skills | ✅ | Create skill |
| GET | /api/skills | ❌ | Get all skills |
| POST | /api/sessions | ✅ | Book session |
| GET | /api/sessions/:id | ❌ | Get session |
| POST | /api/sessions/:id/review | ✅ | Review session |

## 🔧 Development Tips

1. **Testing API**: Use Postman, Thunder Client, or VS Code REST Client
2. **Database**: Ensure MongoDB is running locally or use MongoDB Atlas
3. **JWT Secret**: Change `JWT_SECRET` in production
4. **CORS**: Update `CORS_ORIGIN` for your frontend domain
5. **Logs**: Check console for detailed error messages

## 📝 Notes for Mini Project

This backend includes:
- ✅ Professional code structure
- ✅ Complete CRUD operations
- ✅ Authentication & authorization
- ✅ Input validation
- ✅ Error handling
- ✅ Well-commented code
- ✅ Scalable architecture
- ✅ Security best practices

Perfect for a **mini project** that demonstrates:
- Database design & relationships
- RESTful API development
- Authentication & middleware
- Error handling
- Code organization

## 🚀 Next Steps

1. Install dependencies: `npm install`
2. Set up MongoDB locally or Atlas
3. Create `.env` file
4. Start server: `npm run dev`
5. Test endpoints with Postman
6. Build frontend to consume API

---

**Happy coding! 🎉**
