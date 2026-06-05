# 🎯 PlaceSync - Demo Setup & Quick Start Guide

## ✅ Pre-Setup Checklist

Before running demo data, ensure:

- [ ] Node.js installed (v14+)
- [ ] MongoDB running locally or connection string configured
- [ ] Backend dependencies installed (`npm install` in `/backend`)
- [ ] `.env` file configured with `MONGODB_URI`
- [ ] Environment set to development

---

## 🚀 Step 1: Seed the Database

### Navigate to Backend
```bash
cd backend
```

### Run the Seed Script
```bash
node scripts/seedDatabase.js
```

### Expected Output
```
✅ Connected to MongoDB
✅ Cleared existing data
✅ Created 8 recruiters
✅ Created 5 trainers
✅ Created 10 students
✅ Created 10 job postings

Seed Data Summary:
   ✅ 8 Recruiters from Indian companies
      Emails: rajesh@tcs.com, priya@infosys.com, amit@wipro.com, ...
      Password: password123

   ✅ 5 Trainers from Training Institutes
      Emails: mahesh.trainer@gmail.com, priya.trainer@gmail.com, ...
      Password: password123

   ✅ 10 Student users with diverse skill sets
      Emails: arjun.mehta@student.com, sneha.iyer@student.com, ...
      Password: password123

   ✅ 10 Job postings across India
   ✅ Locations: Gurugram, Delhi, Mumbai, Bangalore, Hyderabad, Pune

Total Demo Accounts Created:
   - Recruiters: 8
   - Trainers: 5
   - Students: 10
   - Total Users: 23 accounts

Database seeding completed successfully!
```

---

## 🏃 Step 2: Start the Application

### Terminal 1 - Backend Server
```bash
cd backend
npm start
# or if using nodemon:
npm run dev
```

### Terminal 2 - Frontend Development Server
```bash
# From root directory
npm run dev
# or
npm start
```

### Terminal 3 - MongoDB (if running locally)
```bash
mongod
# MongoDB connection should output:
# "MongoDB Connected ✅"
```

---

## 👤 Step 3: Login & Explore

### Access the Application
Open browser: `http://localhost:5173` (or your frontend URL)

### First Login - Try as a Student
```
Email: arjun.mehta@student.com
Password: password123
```

**What you'll see:**
- Jobs feed with 10 postings
- Saved jobs section
- Applications tracking
- Connections with recruiters
- Messages interface
- User profile

### Second Login - Try as a Recruiter
```
Email: rajesh@tcs.com
Password: password123
```

**What you'll see:**
- Post new jobs form
- View applicants
- Job management dashboard
- Applicant profiles
- Interview scheduling
- Analytics

### Third Login - Try as a Trainer
```
Email: mahesh.trainer@gmail.com
Password: password123
```

**What you'll see:**
- Create courses
- Manage enrolled students
- Create certificates
- Schedule workshops
- Track student progress

---

## 📋 Complete Demo Account List

### 🎓 Students (10 Accounts)
| # | Name | Email | Password |
|---|------|-------|----------|
| 1 | Arjun Mehta | arjun.mehta@student.com | password123 |
| 2 | Sneha Iyer | sneha.iyer@student.com | password123 |
| 3 | Rahul Chopra | rahul.chopra@student.com | password123 |
| 4 | Pooja Saxena | pooja.saxena@student.com | password123 |
| 5 | Nikhil Joshi | nikhil.joshi@student.com | password123 |
| 6 | Kavya Nair | kavya.nair@student.com | password123 |
| 7 | Aditya Singh | aditya.singh@student.com | password123 |
| 8 | Divya Reddy | divya.reddy@student.com | password123 |
| 9 | Ravi Kumar | ravi.kumar@student.com | password123 |
| 10 | Neha Gupta | neha.gupta@student.com | password123 |

### 💼 Recruiters (8 Accounts)
| # | Name | Email | Company | Password |
|---|------|-------|---------|----------|
| 1 | Rajesh Kumar | rajesh@tcs.com | TCS | password123 |
| 2 | Priya Sharma | priya@infosys.com | Infosys | password123 |
| 3 | Amit Patel | amit@wipro.com | Wipro | password123 |
| 4 | Deepak Singh | deepak@amazon.com | Amazon India | password123 |
| 5 | Neha Gupta | neha@flipkart.com | Flipkart | password123 |
| 6 | Sanjay Verma | sanjay@google.com | Google India | password123 |
| 7 | Anjali Desai | anjali@microsoft.com | Microsoft India | password123 |
| 8 | Vikram Reddy | vikram@accenture.com | Accenture India | password123 |

### 👨‍🏫 Trainers (5 Accounts)
| # | Name | Email | Specialization | Password |
|---|------|-------|-----------------|----------|
| 1 | Dr. Mahesh Kumar | mahesh.trainer@gmail.com | Full Stack Development | password123 |
| 2 | Priya Sharma | priya.trainer@gmail.com | Data Science & ML | password123 |
| 3 | Rohit Verma | rohit.trainer@gmail.com | Cloud Computing | password123 |
| 4 | Anjali Singh | anjali.trainer@gmail.com | Frontend Development | password123 |
| 5 | Vikram Patel | vikram.trainer@gmail.com | Java & Microservices | password123 |

---

## 🎬 Suggested Test Scenarios

### Scenario A: End-to-End Job Application
**Time: 5 minutes**

1. **As Student (arjun.mehta@student.com):**
   - Navigate to Jobs section
   - Browse available positions
   - Apply for "Senior Software Engineer - Full Stack" (by TCS)
   - Add resume and cover letter

2. **As Recruiter (rajesh@tcs.com):**
   - Go to Applicants section
   - Find and view Arjun's application
   - Send message: "Great profile! Let's talk"

3. **As Student:**
   - Check Messages
   - Reply to recruiter
   - View notification

---

### Scenario B: Skill Development & Learning Path
**Time: 7 minutes**

1. **As Student (sneha.iyer@student.com):**
   - Browse courses section
   - Enroll in "Advanced React Development" (by Dr. Mahesh)
   - Check enrolled courses

2. **As Trainer (mahesh.trainer@gmail.com):**
   - View student enrollments
   - Send course materials
   - Create assignment

3. **As Student:**
   - Complete course modules
   - Request certificate

---

### Scenario C: Recruiter Job Posting
**Time: 10 minutes**

1. **As Recruiter (priya@infosys.com):**
   - Go to Post Job
   - Create new job posting:
     - Title: "Senior Python Developer"
     - Description: [Add details]
     - Location: Bangalore
     - Skills: Python, Django, PostgreSQL
   - Publish job

2. **Check Results:**
   - Verify job appears in student feed
   - See applicant count update

---

### Scenario D: Interview Scheduling
**Time: 8 minutes**

1. **As Recruiter (deepak@amazon.com):**
   - Go to Interviews section
   - Create interview slot
   - Select candidate
   - Set date/time

2. **As Student:**
   - Check notifications
   - View interview schedule
   - Accept interview

---

## 🐛 Troubleshooting

### Problem: "Database connection failed"
**Solution:**
```bash
# Make sure MongoDB is running
mongod

# Or check connection string in .env file
echo $MONGODB_URI
```

### Problem: "User not found after seeding"
**Solution:**
```bash
# Re-run the seed script
cd backend
node scripts/seedDatabase.js
```

### Problem: "Can't login with demo account"
**Solution:**
1. Check email spelling (case-sensitive for email checking)
2. Verify password is exactly: `password123`
3. Check if user role is correct
4. Clear browser cache and cookies

### Problem: "Jobs not showing in feed"
**Solution:**
1. Check job expiry date (should be future)
2. Clear search filters
3. Refresh page
4. Check recruiter email in console

### Problem: "Password field not working"
**Solution:**
1. Make sure you're on login page
2. Check browser console for errors
3. Verify eye icon is clicking properly
4. Try different browser

---

## 📊 Demo Data Structure

### Database Collections:
```
Database: place-sync
├── Users (23 documents)
│   ├── 8 Recruiters
│   ├── 5 Trainers
│   └── 10 Students
├── Jobs (10 documents)
├── Applications (1+ documents)
├── Connections (1+ documents)
├── Messages (1+ documents)
├── Notifications (1+ documents)
└── Posts (0+ documents)
```

---

## 📚 Additional Resources

| Document | Purpose |
|----------|---------|
| `DEMO_ACCOUNTS.md` | Detailed account information |
| `TESTING_GUIDE.md` | Feature testing by role |
| `DEMO_QUICK_REFERENCE.txt` | Quick lookup table |
| `backend/scripts/seedDatabase.js` | Seed script source |

---

## ⚠️ Important Notes

1. **Development Only:**
   - This demo data is for testing purposes
   - Do NOT use these credentials in production
   - Change all passwords before deployment

2. **Data Persistence:**
   - Demo data persists in MongoDB until cleared
   - To reset: Run seed script again (will clear old data first)

3. **Indian Context:**
   - All names are Indian
   - Phone numbers are Indian format
   - Locations are major Indian IT hubs
   - Companies are real Indian tech companies

4. **Password Security:**
   - All accounts use simple password for testing
   - Change immediately for production
   - Use strong passwords in real deployment

---

## 🎉 You're All Set!

Your PlaceSync demo environment is ready for testing. 

**Next Steps:**
1. Login with student account and explore job feed
2. Switch to recruiter and post a job
3. Try different features with different roles
4. Check out the testing guide for more scenarios

**Common First Tests:**
- Browse jobs as student
- Apply for a job
- Switch to recruiter and view applications
- Login as trainer and create a course

---

**Questions?** Check the documentation files or review the seed script source code.

**Ready to test?** Start with: `node scripts/seedDatabase.js` 🚀
