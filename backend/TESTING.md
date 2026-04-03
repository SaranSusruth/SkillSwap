# SkillSwap API - Testing Guide

## 🧪 Quick Start Testing

### Prerequisites
- MongoDB running locally or MongoDB Atlas connected
- Postman or Thunder Client installed (or use VS Code REST Client)
- Node.js and npm installed

---

## 📝 Test Requests (Copy-Paste Ready)

### 1️⃣ USER REGISTRATION

**Request:**
```
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "confirmPassword": "password123"
}
```

**Expected Response:**
```json
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

---

### 2️⃣ USER LOGIN

**Request:**
```
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

**Expected Response:**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

💾 **Save the token for protected requests**

---

### 3️⃣ GET CURRENT USER

**Request:**
```
GET http://localhost:5000/api/auth/me
Authorization: Bearer <your_token_here>
```

**Expected Response:**
```json
{
  "user": {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "bio": "",
    "rating": 0,
    "skills": [],
    "totalReviews": 0
  }
}
```

---

### 4️⃣ UPDATE USER PROFILE

**Request:**
```
PUT http://localhost:5000/api/users/profile
Authorization: Bearer <your_token_here>
Content-Type: application/json

{
  "name": "John Updated",
  "bio": "Expert in web development and JavaScript",
  "phone": "+1-555-0123"
}
```

---

### 5️⃣ CREATE A SKILL

**Request:**
```
POST http://localhost:5000/api/skills
Authorization: Bearer <your_token_here>
Content-Type: application/json

{
  "name": "Web Development",
  "description": "Full stack web development including frontend and backend",
  "category": "programming",
  "level": "advanced",
  "tags": ["javascript", "react", "nodejs"]
}
```

**Expected Response:**
```json
{
  "message": "Skill created successfully",
  "skill": {
    "_id": "skill_id",
    "name": "Web Development",
    "userId": "user_id",
    "category": "programming",
    "level": "advanced",
    "rating": 0
  }
}
```

💾 **Save the skill_id for booking sessions**

---

### 6️⃣ GET ALL SKILLS

**Request:**
```
GET http://localhost:5000/api/skills?category=programming&level=beginner
```

---

### 7️⃣ SEARCH USERS

**Request:**
```
GET http://localhost:5000/api/users/search?query=john
```

---

### 8️⃣ BOOK A SESSION

First, create another user (register as different user):

**Step 1:** Register as Mentor
```
POST http://localhost:5000/api/auth/register

{
  "name": "Jane Mentor",
  "email": "jane@example.com",
  "password": "password123",
  "confirmPassword": "password123"
}
```

Save Jane's user_id

**Step 2:** Create Skill as Jane
```
POST http://localhost:5000/api/skills
Authorization: Bearer <jane_token>

{
  "name": "React Fundamentals",
  "description": "Learn React from basics to advanced",
  "category": "programming",
  "level": "beginner"
}
```

Save the skill_id

**Step 3:** Book Session as John (Student)
```
POST http://localhost:5000/api/sessions
Authorization: Bearer <john_token>
Content-Type: application/json

{
  "mentorId": "jane_user_id",
  "skillId": "jane_skill_id",
  "title": "React Basics Tutorial",
  "description": "I want to learn React basics",
  "sessionDate": "2024-04-20T15:00:00Z",
  "duration": 60,
  "mode": "online"
}
```

💾 **Save the session_id**

---

### 9️⃣ CONFIRM SESSION (As Mentor)

**Request:**
```
PUT http://localhost:5000/api/sessions/<session_id>/status
Authorization: Bearer <jane_token>
Content-Type: application/json

{
  "status": "confirmed"
}
```

---

### 🔟 COMPLETE SESSION & LEAVE REVIEW

**Step 1:** Update session to completed (mentor)
```
PUT http://localhost:5000/api/sessions/<session_id>/status
Authorization: Bearer <jane_token>

{
  "status": "completed"
}
```

**Step 2:** Leave a review (student)
```
POST http://localhost:5000/api/sessions/<session_id>/review
Authorization: Bearer <john_token>
Content-Type: application/json

{
  "rating": 5,
  "comment": "Jane is an excellent teacher! Very clear explanations and patient. Highly recommend!"
}
```

**Expected Response:**
```json
{
  "message": "Review submitted successfully",
  "review": {
    "_id": "review_id",
    "rating": 5,
    "comment": "Jane is an excellent teacher!",
    "revieweeId": "jane_id"
  }
}
```

---

### 1️⃣1️⃣ CHECK USER REVIEWS

**Request:**
```
GET http://localhost:5000/api/sessions/reviews/<jane_user_id>
```

---

## 🎯 Testing Checklist

- [ ] Register user
- [ ] Login user
- [ ] Get current user
- [ ] Update profile
- [ ] Create skill
- [ ] Get all skills
- [ ] Search users
- [ ] Register mentor
- [ ] Create mentor skill
- [ ] Book session
- [ ] Confirm session
- [ ] Complete session
- [ ] Leave review
- [ ] Check reviews

---

## 📊 Sample Data for Testing

### User 1 (Student)
- Email: student@example.com
- Password: password123
- Name: Alex Student

### User 2 (Mentor)
- Email: mentor@example.com
- Password: password123
- Name: Sarah Mentor

### Skills to Create
1. JavaScript Basics (Programming, Beginner)
2. React Advanced (Programming, Advanced)
3. UI Design (Design, Intermediate)
4. Spanish Language (Languages, Beginner)

---

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| MongoDB Connection Failed | Check MongoDB is running, verify MONGODB_URI in .env |
| Invalid Token Error | Ensure token is copied correctly, token may have expired |
| Skill Not Found | Verify skill_id exists, check in GET /api/skills |
| User Not Found | Verify user_id from registration response |
| CORS Error | Check CORS_ORIGIN in .env matches your frontend URL |

---

## 📱 Using Postman Collections

You can import these curl commands into Postman:

**Create Environment Variables:**
- `base_url`: http://localhost:5000
- `john_token`: [value from John's login response]
- `jane_token`: [value from Jane's login response]
- `jane_id`: [value from Jane's registration response]
- `skill_id`: [value from skill creation]
- `session_id`: [value from session booking]

**Then use in requests:**
```
{{base_url}}/api/auth/me
Authorization: Bearer {{john_token}}
```

---

## ✅ Success Indicators

✅ All status codes are correct (200, 201, 400, 401, 404)
✅ Error messages are clear and helpful
✅ Token remains valid across multiple requests
✅ User ratings update after reviews
✅ Sessions flow correctly: pending → confirmed → completed
✅ Reviews calculate average user rating

---

Happy Testing! 🎉
