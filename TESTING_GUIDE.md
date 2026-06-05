# 🧪 PlaceSync - User Role Testing Guide

## Testing Different Features by User Role

### 🔓 Login Credentials
**Default Password:** `password123`

---

## 👨‍🎓 STUDENT TESTING

### Quick Student Access
**Email:** `arjun.mehta@student.com`
**Password:** `password123`

### Available Features to Test:

#### 1. **Job Discovery**
- Go to `/jobs` 
- Browse 10 available job postings
- View detailed job descriptions
- Check salary ranges and requirements

#### 2. **Apply for Jobs**
- Click "Apply" on any job
- Upload resume (simulated)
- Add cover letter
- Track application status

#### 3. **Saved Jobs**
- Click heart icon to save jobs
- Navigate to `/saved-jobs`
- View all saved positions
- Remove saved jobs

#### 4. **Applications**
- Go to `/applications`
- See all submitted applications
- Track status (Applied, Shortlisted, Rejected, Accepted)
- View application timeline

#### 5. **Connections**
- Navigate to `/connections`
- Connect with recruiters
- View connection requests
- Accept/Reject connections

#### 6. **Messages**
- Go to `/messages`
- Send messages to recruiters
- View conversation history
- Real-time chat simulation

#### 7. **Notifications**
- Click notification bell
- See job recommendations
- Application updates
- Connection requests

#### 8. **Profile**
- Edit profile at `/edit-profile`
- Add skills (React, Node.js, MongoDB, etc.)
- Update bio and location
- Upload profile picture

#### 9. **Courses & Learning**
- Browse available courses from trainers
- Enroll in courses
- Track certificates earned

#### 10. **Student Dashboard**
- View stats and insights
- See recommended jobs
- Check saved jobs count
- View connection requests

---

## 👨‍💼 RECRUITER TESTING

### Quick Recruiter Access
**Email:** `rajesh@tcs.com`
**Password:** `password123`

### Available Features to Test:

#### 1. **Post a Job**
- Go to `/post-job`
- Fill in job details:
  - Title, Description, Location
  - Salary range (min/max)
  - Required skills
  - Job type (Full-time/Internship/Contract)
  - Experience level
- Publish job posting

#### 2. **Manage Jobs**
- Navigate to `/manage-jobs`
- View all posted jobs
- Edit job details
- Archive/Delete jobs
- See applicant count

#### 3. **View Applicants**
- Go to `/applicants`
- See list of all applicants
- Filter by job
- View detailed profiles
- Download resumes

#### 4. **Search Students**
- Navigate to `/search-students`
- Filter by skills
- Filter by location
- Filter by experience level
- View and invite candidates

#### 5. **Schedule Interviews**
- Go to `/interviews`
- Create interview slots
- Select candidates
- Set date and time
- Send interview invites
- View scheduled interviews

#### 6. **Messages**
- Navigate to `/recruiter-messages`
- Send messages to candidates
- Respond to inquiries
- View message history
- Schedule follow-ups

#### 7. **Notifications**
- Go to `/recruiter-notifications`
- View application notifications
- See connection requests
- Check interview reminders
- View profile view notifications

#### 8. **Analytics**
- Access `/recruiter-analytics`
- View job posting analytics
- See application metrics
- Check profile views
- Track engagement

#### 9. **Settings**
- Go to `/recruiter-settings`
- Update company profile
- Change preferences
- Manage notifications
- Update payment info

#### 10. **Recruiter Dashboard**
- View at `/recruiter-dashboard`
- See key metrics
- View recent applications
- Check job posting status
- Monitor candidate engagement

---

## 👨‍🏫 TRAINER TESTING

### Quick Trainer Access
**Email:** `mahesh.trainer@gmail.com`
**Password:** `password123`

### Available Features to Test:

#### 1. **Create Courses**
- Navigate to trainer dashboard
- Click "Add Course"
- Fill course details:
  - Title (e.g., "Advanced React Development")
  - Description
  - Duration (hours/weeks)
  - Level (Beginner/Intermediate/Advanced)
  - Topics covered
  - Price (free/paid)

#### 2. **Manage Courses**
- View all created courses
- Edit course content
- Add course modules
- Update course details
- Archive courses
- View enrollment count

#### 3. **View Students**
- Go to `/trainer-students`
- See all enrolled students
- View progress
- Check completion status
- Track assignments

#### 4. **Create Workshops**
- Navigate to `/trainer-workshops`
- Schedule live sessions
- Set date and time
- Define capacity
- Send invites to interested students

#### 5. **Issue Certificates**
- Go to `/trainer-certificates`
- Create certificate templates
- Issue certificates to completed students
- Download certificates
- View certificate analytics

#### 6. **Interview Management**
- Navigate to `/trainer-interviews`
- Schedule mock interviews
- Create interview slots
- View scheduled sessions
- Provide feedback

#### 7. **Messages**
- Send messages to enrolled students
- Respond to course queries
- Provide learning resources
- Share additional materials

#### 8. **Trainer Dashboard**
- View course analytics
- See enrollment trends
- Check student progress
- Monitor course ratings
- View revenue (if applicable)

#### 9. **Content Management**
- Upload course materials
- Create assignments
- Set deadlines
- Upload video lectures
- Add resources and links

#### 10. **Profile**
- Edit trainer profile at `/trainer-profile`
- Add certifications
- List courses taught
- Add experience
- Upload profile image

---

## 🔄 Testing User Switches

### Testing Multiple Roles

1. **Test as Student → Recruiter → Trainer**
   - Student: Apply for jobs
   - Switch to Recruiter: View applications
   - Switch to Trainer: Create course
   - Back to Student: Enroll in course

2. **Testing Messaging Flow**
   - Student applies to job
   - Recruiter receives notification
   - Recruiter sends message
   - Student receives and replies
   - Trainer provides feedback on progress

3. **Complete Job-to-Learning Flow**
   - Student applies for job
   - Recruiter interviews student
   - Student gets hired
   - Trainer provides upskilling course
   - Student gets certificate

---

## 📊 Test Data Reference

### Available Students by Specialty:

| Specialty | Email | Skills |
|-----------|-------|--------|
| **Full Stack** | arjun.mehta@student.com | React, Node.js, MongoDB |
| **Python Dev** | sneha.iyer@student.com | Django, PostgreSQL |
| **Data Science** | rahul.chopra@student.com | ML, TensorFlow |
| **Cloud/DevOps** | nikhil.joshi@student.com | AWS, Docker, K8s |
| **Frontend** | aditya.singh@student.com | React Native, Figma |
| **AI/ML** | divya.reddy@student.com | Computer Vision, ROS |
| **Backend** | ravi.kumar@student.com | Node.js, Express |
| **DevOps** | neha.gupta@student.com | Docker, Jenkins, Terraform |

### Available Recruiters by Company:

| Company | Email | Hiring Focus |
|---------|-------|--------------|
| **TCS** | rajesh@tcs.com | Full Stack, Multiple roles |
| **Infosys** | priya@infosys.com | Backend, Product |
| **Wipro** | amit@wipro.com | Data Science |
| **Amazon** | deepak@amazon.com | Cloud/AWS |
| **Flipkart** | neha@flipkart.com | Frontend |
| **Google** | sanjay@google.com | Software Engineer |
| **Microsoft** | anjali@microsoft.com | Business Analyst |
| **Accenture** | vikram@accenture.com | Consulting/Digital |

### Available Trainers by Specialty:

| Specialty | Email | Institute |
|-----------|-------|-----------|
| **Full Stack** | mahesh.trainer@gmail.com | TechHub Academy |
| **Data Science** | priya.trainer@gmail.com | Data Academy India |
| **Cloud/DevOps** | rohit.trainer@gmail.com | Cloud Masters Institute |
| **Frontend** | anjali.trainer@gmail.com | Web Academy Plus |
| **Java/Backend** | vikram.trainer@gmail.com | Core Java Institute |

---

## 🎯 Suggested Testing Scenarios

### Scenario 1: Job Application Flow
1. Login as Student: `arjun.mehta@student.com`
2. Browse jobs at `/jobs`
3. Apply to "Senior Software Engineer - Full Stack"
4. Switch to Recruiter: `rajesh@tcs.com`
5. View application at `/applicants`
6. Send message to candidate

### Scenario 2: Skill Development Path
1. Login as Student: `sneha.iyer@student.com`
2. Enroll in course from Trainer: `mahesh.trainer@gmail.com`
3. Complete modules
4. Get certificate
5. Apply for job with new skills

### Scenario 3: Complete Hiring Cycle
1. Recruiter posts job
2. Multiple students apply
3. Recruiter schedules interviews
4. Students attend (simulated)
5. Offer extended
6. Student enrolls in upskilling course

---

## 🔍 Debugging Tips

### If you can't see data:
1. Run seed script: `node scripts/seedDatabase.js`
2. Check MongoDB connection
3. Clear browser cache
4. Verify user role in profile

### If messages aren't showing:
1. Refresh page
2. Check notification settings
3. Verify connection status
4. Check message permissions

### If jobs aren't appearing:
1. Check job deadline (future dates)
2. Verify job is published
3. Check location filters
4. Clear search filters

---

**Remember:** All demo accounts have password `password123` - Change in production!
