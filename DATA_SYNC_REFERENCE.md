# 📋 Data Synchronization Reference Guide

## ⚠️ IMPORTANT: Keep All Demo Data Synchronized

This document ensures that when demo data is updated in **ONE** file, it's reflected everywhere in the codebase.

---

## 🎯 Demo Data Locations & Files

### 1. **Backend Database (Source of Truth)**
- **File:** `backend/scripts/seedDatabase.js`
- **Purpose:** Creates actual database records
- **Contains:** 
  - 8 Recruiters
  - 5 Trainers  
  - 10 Students
  - 10+ Job Postings
  - Applications & Connections
- **When to update:** When adding/modifying demo users or jobs in database

### 2. **Frontend - Applicants Display**
- **File:** `src/pages/Applicants.jsx`
- **Variable:** `demoApplications`
- **Purpose:** Shows when API has no real applicants
- **Contains:** 12 demo applications (10 students + 2 senior devs)
- **Structure:**
  ```javascript
  {
    _id: 'app1',
    applicant: { name, email, phone, location },
    job: { title, company },
    status: 'Pending|Reviewed|Accepted|Rejected',
    coverLetter: '...',
    appliedAt: new Date(...),
    resume: 'filename.pdf',
    experience: '...',
    skills: [...]
  }
  ```

### 3. **Frontend - Job Listings (ManageJobs)**
- **File:** `src/pages/ManageJobs.jsx`
- **Variable:** `demoJobs`
- **Purpose:** Shows when recruiter has no real jobs posted
- **Contains:** 4 demo job postings
- **Structure:**
  ```javascript
  {
    _id: 'demo1',
    title: '...',
    company: '...',
    location: '...',
    jobType: 'Full-time',
    description: '...',
    salary: { min, max, currency },
    isActive: true,
    applicantCount: 0,
    createdAt: new Date()
  }
  ```

### 4. **Documentation Files**
- **DEMO_ACCOUNTS.md** - Account reference table
- **SETUP_GUIDE.md** - Setup instructions with data overview
- **TESTING_GUIDE.md** - Feature testing by role
- **README_DEMO_DATA.md** - Complete data overview

---

## 🔄 Synchronization Map

### When Updating Student Data in `seedDatabase.js`:
**Update these files with matching student names, emails, locations, skills:**
- ✅ `DEMO_ACCOUNTS.md` - Students table
- ✅ `src/pages/Applicants.jsx` - demoApplications array
- ✅ `README_DEMO_DATA.md` - Students section
- ✅ `TESTING_GUIDE.md` - Student account references
- ✅ `DEMO_QUICK_REFERENCE.txt` - Student list

### When Updating Job Data in `seedDatabase.js`:
**Update these files with matching job titles, companies, locations:**
- ✅ `DEMO_ACCOUNTS.md` - Job postings section
- ✅ `src/pages/ManageJobs.jsx` - demoJobs array
- ✅ `README_DEMO_DATA.md` - Jobs section
- ✅ `SETUP_GUIDE.md` - Job listings overview

### When Updating Recruiter Data in `seedDatabase.js`:
**Update these files with matching recruiter names, emails, companies:**
- ✅ `DEMO_ACCOUNTS.md` - Recruiters table
- ✅ `README_DEMO_DATA.md` - Recruiters section
- ✅ `TESTING_GUIDE.md` - Recruiter account references
- ✅ `DEMO_QUICK_REFERENCE.txt` - Recruiter list

### When Updating Trainer Data in `seedDatabase.js`:
**Update these files with matching trainer names, emails, specialization:**
- ✅ `DEMO_ACCOUNTS.md` - Trainers table
- ✅ `README_DEMO_DATA.md` - Trainers section
- ✅ `TESTING_GUIDE.md` - Trainer account references
- ✅ `DEMO_QUICK_REFERENCE.txt` - Trainer list

---

## 📊 Current Demo Data Structure

### Students (10 Total) - Base Data
```
1. Arjun Mehta          | arjun.mehta@student.com          | Delhi, NCR
2. Sneha Iyer           | sneha.iyer@student.com           | Bangalore
3. Rahul Chopra         | rahul.chopra@student.com         | Gurugram
4. Pooja Saxena         | pooja.saxena@student.com         | Mumbai
5. Nikhil Joshi         | nikhil.joshi@student.com         | Pune
6. Kavya Nair           | kavya.nair@student.com           | Hyderabad
7. Aditya Singh         | aditya.singh@student.com         | Delhi, NCR
8. Divya Reddy          | divya.reddy@student.com          | Hyderabad
9. Ravi Kumar           | ravi.kumar@student.com           | Bangalore
10. Neha Gupta          | neha.gupta@student.com           | Mumbai
```

### Recruiters (8 Total)
```
1. Rajesh Kumar         | rajesh@tcs.com                   | TCS
2. Priya Sharma         | priya@infosys.com                | Infosys
3. Amit Patel           | amit@wipro.com                   | Wipro
4. Deepak Singh         | deepak@amazon.com                | Amazon India
5. Neha Gupta           | neha@flipkart.com                | Flipkart
6. Sanjay Verma         | sanjay@google.com                | Google India
7. Anjali Desai         | anjali@microsoft.com             | Microsoft India
8. Vikram Reddy         | vikram@accenture.com             | Accenture India
```

### Trainers (5 Total)
```
1. Dr. Mahesh Kumar     | mahesh.trainer@gmail.com         | Full Stack Dev
2. Priya Sharma         | priya.trainer@gmail.com          | Data Science & ML
3. Rohit Verma          | rohit.trainer@gmail.com          | Cloud & DevOps
4. Anjali Singh         | anjali.trainer@gmail.com         | Frontend Dev
5. Vikram Patel         | vikram.trainer@gmail.com         | Java & Microservices
```

### Jobs (4+ in ManageJobs.jsx)
```
1. Senior Full Stack Developer - MERN Stack         | TechVision India | Bangalore
2. React Frontend Engineer                          | Infosys          | Hyderabad
3. Node.js Backend Developer                        | TCS              | Pune
4. Java Developer                                   | HCL              | Gurgaon
```

---

## ✅ Update Checklist

When you modify demo data in `seedDatabase.js`, follow this checklist:

### Step 1: Identify What Changed
- [ ] New/Modified Students?
- [ ] New/Modified Recruiters?
- [ ] New/Modified Trainers?
- [ ] New/Modified Jobs?
- [ ] Changed passwords/emails?

### Step 2: Update All Related Files
- [ ] Update `src/pages/Applicants.jsx` - demoApplications array
- [ ] Update `src/pages/ManageJobs.jsx` - demoJobs array
- [ ] Update `DEMO_ACCOUNTS.md` - Account tables
- [ ] Update `README_DEMO_DATA.md` - Data overview
- [ ] Update `TESTING_GUIDE.md` - Test accounts
- [ ] Update `DEMO_QUICK_REFERENCE.txt` - Quick lookup
- [ ] Update `SETUP_GUIDE.md` - Setup instructions

### Step 3: Verify Consistency
- [ ] All student names match across files
- [ ] All email addresses match
- [ ] All phone numbers are consistent
- [ ] All locations are spelled the same
- [ ] All skills are accurate
- [ ] All job titles match
- [ ] All company names match

### Step 4: Test
- [ ] Run seed database: `node scripts/seedDatabase.js`
- [ ] Check Applicants page shows correct demo data
- [ ] Check ManageJobs page shows correct demo jobs
- [ ] Open DEMO_ACCOUNTS.md and verify all details

---

## 🔧 How to Keep Sync

### Option 1: Top-Down Sync (Recommended)
1. Make changes in `seedDatabase.js` (source of truth)
2. Update all frontend and doc files accordingly
3. Run seed script to verify

### Option 2: Manual Sync
1. Use this file as reference
2. Make changes in one place
3. Go through all related files and update

### Option 3: Batch Updates
1. Collect all changes needed
2. Update `seedDatabase.js` first
3. Create script to sync changes automatically (if needed)

---

## 📝 Files Needing Updates When Core Data Changes

| File | Update When |
|------|------------|
| `backend/scripts/seedDatabase.js` | ✏️ Core demo data changes |
| `src/pages/Applicants.jsx` | Student/Application data changes |
| `src/pages/ManageJobs.jsx` | Job data changes |
| `DEMO_ACCOUNTS.md` | Any account/profile changes |
| `README_DEMO_DATA.md` | Overall data structure changes |
| `TESTING_GUIDE.md` | Account credentials/emails change |
| `SETUP_GUIDE.md` | Data statistics change |
| `DEMO_QUICK_REFERENCE.txt` | Any account info changes |

---

## 🎯 Quick Commands

### Verify Demo Data is Loaded
```bash
# Check if seed database runs without errors
cd backend
node scripts/seedDatabase.js
```

### Test Frontend Demo Display
```bash
# With no API jobs/applicants, frontend should show demo data
# 1. Start frontend
npm start

# 2. Login with recruiter account (no real jobs → shows demoJobs)
# 3. Navigate to Applicants (no real apps → shows demoApplications)
```

### Find All Demo References
```bash
# Search for all demo data definitions
grep -r "demoApplications\|demoJobs\|demo.*=" src/ backend/
grep -r "demoApplications\|demoJobs" *.md
```

---

## 💡 Best Practices

✅ **DO:**
- Update `seedDatabase.js` first (source of truth)
- Check this file before making changes
- Use consistent naming conventions
- Test after making changes
- Update documentation immediately

❌ **DON'T:**
- Update documentation without code
- Use different names for same person
- Change data without updating all files
- Forget to test demo data loading
- Leave partial updates

---

## 📌 Last Updated
- Created: May 2026
- Current Version: 1.0
- Total Demo Accounts: 23 (8 Recruiters + 5 Trainers + 10 Students)
- Total Demo Jobs: 4+
- Total Demo Applications: 12

---

## 🆘 Troubleshooting

### Problem: Demo data doesn't show in UI
**Solution:** Check if localStorage has real data. Clear localStorage and refresh.

### Problem: Names don't match across files
**Solution:** Use this file as reference. Update all mismatched files.

### Problem: Demo applications not appearing
**Solution:** Check `src/pages/Applicants.jsx` has demoApplications array with data.

### Problem: Demo jobs not appearing  
**Solution:** Check `src/pages/ManageJobs.jsx` has demoJobs array and no real API jobs exist.

---

**Remember:** Consistency is key! 🔑 When one file changes, update them all.
