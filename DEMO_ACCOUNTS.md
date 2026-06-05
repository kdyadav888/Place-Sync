# 🎓 PlaceSync - Demo Accounts Guide

## Overview
This document contains all demo accounts created in the seed database. Use these credentials to test the platform with different user roles.

**Default Password for All Demo Accounts:** `password123`

---

## 👨‍💼 RECRUITERS (8 Accounts)
Indian companies' recruitment teams

| Name | Email | Company | Password |
|------|-------|---------|----------|
| Rajesh Kumar | rajesh@tcs.com | Tata Consultancy Services (TCS) | password123 |
| Priya Sharma | priya@infosys.com | Infosys | password123 |
| Amit Patel | amit@wipro.com | Wipro | password123 |
| Deepak Singh | deepak@amazon.com | Amazon India | password123 |
| Neha Gupta | neha@flipkart.com | Flipkart | password123 |
| Sanjay Verma | sanjay@google.com | Google India | password123 |
| Anjali Desai | anjali@microsoft.com | Microsoft India | password123 |
| Vikram Reddy | vikram@accenture.com | Accenture India | password123 |

### Recruiter Features:
- Post job openings
- View applicants
- Schedule interviews
- Send messages to candidates
- View analytics
- Manage job listings

---

## 👨‍🏫 TRAINERS (5 Accounts)
Professional trainers and educators

| Name | Email | Company | Specialization | Password |
|------|-------|---------|-----------------|----------|
| Dr. Mahesh Kumar | mahesh.trainer@gmail.com | TechHub Academy | Full Stack Development | password123 |
| Priya Sharma | priya.trainer@gmail.com | Data Academy India | Data Science & ML | password123 |
| Rohit Verma | rohit.trainer@gmail.com | Cloud Masters Institute | Cloud Computing & DevOps | password123 |
| Anjali Singh | anjali.trainer@gmail.com | Web Academy Plus | Frontend Development | password123 |
| Vikram Patel | vikram.trainer@gmail.com | Core Java Institute | Java & Microservices | password123 |

### Trainer Features:
- Create and manage courses
- Add workshops and certifications
- Track student progress
- View student enrollments
- Create certificates
- Manage interview sessions

---

## 👨‍🎓 STUDENTS (10 Accounts)
Job seekers with diverse skill sets

| Name | Email | Location | Skills | Password |
|------|-------|----------|--------|----------|
| Arjun Mehta | arjun.mehta@student.com | Delhi, NCR | JavaScript, React, Node.js, MongoDB | password123 |
| Sneha Iyer | sneha.iyer@student.com | Bangalore, Karnataka | Python, Django, React, PostgreSQL | password123 |
| Rahul Chopra | rahul.chopra@student.com | Gurugram, Haryana | Python, ML, Data Analysis, TensorFlow | password123 |
| Pooja Saxena | pooja.saxena@student.com | Mumbai, Maharashtra | Excel, SQL, Data Analysis, BI | password123 |
| Nikhil Joshi | nikhil.joshi@student.com | Pune, Maharashtra | AWS, Azure, Docker, Kubernetes, Linux | password123 |
| Kavya Nair | kavya.nair@student.com | Hyderabad, Telangana | Java, Spring Boot, React, MySQL | password123 |
| Aditya Singh | aditya.singh@student.com | Delhi, NCR | JavaScript, React Native, Firebase, Figma | password123 |
| Divya Reddy | divya.reddy@student.com | Hyderabad, Telangana | Python, C++, ROS, Computer Vision, OpenCV | password123 |
| Ravi Kumar | ravi.kumar@student.com | Bangalore, Karnataka | Node.js, Express.js, PostgreSQL, REST APIs | password123 |
| Neha Gupta | neha.gupta@student.com | Mumbai, Maharashtra | Linux, Docker, Jenkins, Terraform, AWS | password123 |

### Student Features:
- Browse and apply for jobs
- Save job listings
- View applications status
- Connect with recruiters
- Message recruiters
- Enroll in courses
- View certificates
- Build profile

---

## 📊 Additional Demo Data

### Job Postings (4+ Total in ManageJobs)
- **Demo Job 1:** Senior Full Stack Developer - MERN Stack | TechVision India | Bangalore
- **Demo Job 2:** React Frontend Engineer | Infosys | Hyderabad
- **Demo Job 3:** Node.js Backend Developer | TCS | Pune
- **Demo Job 4:** Java Developer | HCL Technologies | Gurgaon

### Sample Applications (12 Total in Applicants Page)
Demo applicants shown when viewing Applicants section:

| Applicant | Email | Phone | Location | Status | Experience | 
|-----------|-------|-------|----------|--------|------------|
| Arjun Mehta | arjun.mehta@student.com | +91-9988776655 | Delhi, NCR | Pending | 4 years |
| Sneha Iyer | sneha.iyer@student.com | +91-8877665544 | Bangalore | Reviewed | 4 years |
| Rahul Chopra | rahul.chopra@student.com | +91-7766554433 | Gurugram | Accepted | 3+ years |
| Pooja Saxena | pooja.saxena@student.com | +91-6655443322 | Mumbai | Rejected | 2 years |
| Nikhil Joshi | nikhil.joshi@student.com | +91-5544332211 | Pune | Reviewed | 3+ years |
| Kavya Nair | kavya.nair@student.com | +91-4433221100 | Hyderabad | Pending | 3+ years |
| Aditya Singh | aditya.singh@student.com | +91-9912345678 | Delhi, NCR | Reviewed | 2+ years |
| Divya Reddy | divya.reddy@student.com | +91-9823456789 | Hyderabad | Accepted | 2+ years |
| Ravi Kumar | ravi.kumar@student.com | +91-9734567890 | Bangalore | Pending | 3+ years |
| Neha Gupta | neha.gupta@student.com | +91-8645678901 | Mumbai | Reviewed | 3+ years |
| Rajesh Kumar | rajesh.kumar@gmail.com | +91-9876543210 | Bangalore | Pending | 5+ years |
| Priya Singh | priya.singh@gmail.com | +91-9876543211 | Hyderabad | Accepted | 6 years |

### Sample Data Includes:
- ✅ Job Applications (12 sample applications)
- ✅ Job Postings (4 sample jobs)
- ✅ Connections between students and recruiters
- ✅ Messages and notifications
- ✅ Saved jobs
- ✅ Interview schedules

---

## 🔐 Quick Login Reference

### Test Scenarios:
1. **Full Stack Developer Profile:** 
   - Email: `arjun.mehta@student.com`
   - Password: `password123`
   - Apply for React/Node.js jobs

2. **Data Science Path:**
   - Email: `rahul.chopra@student.com`
   - Password: `password123`
   - Find ML/Data Science opportunities

3. **Recruiter Perspective:**
   - Email: `rajesh@tcs.com`
   - Password: `password123`
   - View applications and manage jobs

4. **Trainer Profile:**
   - Email: `mahesh.trainer@gmail.com`
   - Password: `password123`
   - Create courses and certifications

---

## 🚀 Running Seed Database

To populate the database with demo data:

```bash
# Navigate to backend directory
cd backend

# Run seed script
node scripts/seedDatabase.js
```

---

## 📝 Notes

- All demo accounts have `isEmailVerified: true`
- Indian phone numbers are included for realistic testing
- Locations span across major Indian IT hubs
- Skills align with current industry demand
- Password: `password123` for all accounts (for testing only!)

---

## ⚠️ Important

This demo data is for **development and testing purposes only**. 

**For production:**
- Never use demo credentials
- Change all passwords immediately
- Update email addresses
- Adjust privacy settings
- Review and modify company information

---

**Last Updated:** May 2026
**Total Demo Accounts:** 23 (8 Recruiters + 5 Trainers + 10 Students)
