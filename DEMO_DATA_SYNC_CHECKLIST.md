# 🔄 Demo Data Synchronization Checklist

## Quick Reference: What to Update When

This document provides step-by-step checklists for keeping all demo data synchronized across the codebase.

---

## ✅ WHEN YOU ADD A NEW STUDENT

### Step 1: Update Backend (Source of Truth)
**File:** `backend/scripts/seedDatabase.js`
- [ ] Add new student object in `students` array (around line 200+)
- [ ] Include: name, email, password, role, location, phone, bio, skills, isEmailVerified
- [ ] Use format: `{ name: '...', email: '...@student.com', ... }`

Example:
```javascript
{
  name: 'New Student Name',
  email: 'new.student@student.com',
  password: 'password123',
  role: 'student',
  location: 'City, State',
  phone: '+91-1234567890',
  bio: '...',
  isEmailVerified: true,
  skills: ['...', '...'],
}
```

### Step 2: Update Frontend - Applicants
**File:** `src/pages/Applicants.jsx`
- [ ] Add new application in `demoApplications` array (around line 21+)
- [ ] Match student data exactly (name, email, phone, location)
- [ ] Assign unique `_id` like 'app6', 'app7', etc.
- [ ] Include: applicant data, job, status, coverLetter, skills, experience

Example:
```javascript
{
  _id: 'appX',
  applicant: {
    _id: 'userX',
    name: 'New Student Name',
    email: 'new.student@student.com',
    phone: '+91-1234567890',
    location: 'City, State',
  },
  job: { _id: 'demo1', title: 'Senior Full Stack Developer - MERN Stack' },
  status: 'Pending',
  coverLetter: '...',
  appliedAt: new Date('2026-05-XX'),
  resume: 'new_student_resume.pdf',
  experience: '...',
  skills: ['...', '...'],
}
```

### Step 3: Update Documentation
**Files to update:**
- [ ] `DEMO_ACCOUNTS.md` - Add row to Students table
- [ ] `README_DEMO_DATA.md` - Update students list and total count
- [ ] `TESTING_GUIDE.md` - Add to available test accounts
- [ ] `DEMO_QUICK_REFERENCE.txt` - Add to student list
- [ ] `SETUP_GUIDE.md` - Update total accounts count
- [ ] `DATA_SYNC_REFERENCE.md` - Update Students (10 Total) section

### Step 4: Test
- [ ] Run seed: `cd backend && node scripts/seedDatabase.js`
- [ ] Check Applicants page shows new applicant
- [ ] Verify database has new student record

---

## ✅ WHEN YOU ADD A NEW JOB POSTING

### Step 1: Update Backend (Source of Truth)
**File:** `backend/scripts/seedDatabase.js`
- [ ] Add new job object in `jobs` array (around line 300+)
- [ ] Include: title, description, company, location, salary, jobType, experience, skills, recruiter

### Step 2: Update Frontend - Manage Jobs
**File:** `src/pages/ManageJobs.jsx`
- [ ] Add new job in `demoJobs` array (around line 16+)
- [ ] Match job data exactly (title, company, location, salary)
- [ ] Use format consistent with existing jobs

Example:
```javascript
{
  _id: 'demoX',
  title: 'Job Title',
  company: 'Company Name',
  location: 'City, State, Country',
  jobType: 'Full-time',
  description: '...',
  salary: { min: 800000, max: 1200000, currency: 'INR' },
  isActive: true,
  applicantCount: 0,
  createdAt: new Date(),
}
```

### Step 3: Update Documentation
- [ ] `DEMO_ACCOUNTS.md` - Add to Job Postings table
- [ ] `README_DEMO_DATA.md` - Update jobs list and count
- [ ] `TESTING_GUIDE.md` - Add to job testing scenarios
- [ ] `SETUP_GUIDE.md` - Update job count
- [ ] `DATA_SYNC_REFERENCE.md` - Update Jobs section

### Step 4: Test
- [ ] Run seed: `node scripts/seedDatabase.js`
- [ ] Check Manage Jobs page shows new job
- [ ] Verify database has new job record

---

## ✅ WHEN YOU MODIFY A STUDENT'S EMAIL OR LOCATION

### Step 1: Update Backend
**File:** `backend/scripts/seedDatabase.js`
- [ ] Find student object
- [ ] Update `email` field (keep domain as @student.com)
- [ ] Update `location` field

### Step 2: Update All References
**Files to search and update:**
- [ ] `src/pages/Applicants.jsx` - Find applicant with old email, update entire row
- [ ] `DEMO_ACCOUNTS.md` - Update Students table
- [ ] `TESTING_GUIDE.md` - Update test scenarios if that student is referenced
- [ ] `DEMO_QUICK_REFERENCE.txt` - Update quick lookup
- [ ] `README_DEMO_DATA.md` - Update student info if listed
- [ ] `SETUP_GUIDE.md` - Update if example uses this student
- [ ] `DATA_SYNC_REFERENCE.md` - Update Students base data section

### Step 3: Test
- [ ] Search for old email across all files: `grep -r "old.email@student.com"`
- [ ] Verify no old email references remain
- [ ] Run seed: `node scripts/seedDatabase.js`
- [ ] Check new data in UI

---

## ✅ WHEN YOU CHANGE PASSWORD FOR ALL ACCOUNTS

### Step 1: Update Backend
**File:** `backend/scripts/seedDatabase.js`
- [ ] Find all `password: 'password123'` entries
- [ ] Replace with new password across:
  - `recruiters` array
  - `trainers` array
  - `students` array

### Step 2: Update Documentation
- [ ] `DEMO_ACCOUNTS.md` - Update "Default Password for All Demo Accounts" at top
- [ ] `SETUP_GUIDE.md` - Update password in quick start section
- [ ] `TESTING_GUIDE.md` - Update all password references
- [ ] `DEMO_QUICK_REFERENCE.txt` - Update default password
- [ ] `DATA_SYNC_REFERENCE.md` - Add note about password change

### Step 3: Clear Old Data
- [ ] Database will be cleared on next seed run
- [ ] Notify team of new password via message/Slack
- [ ] Update any hardcoded test scripts using old password

---

## ✅ WHEN YOU ADD A NEW RECRUITER

### Step 1: Update Backend
**File:** `backend/scripts/seedDatabase.js`
- [ ] Add new recruiter in `recruiters` array (around line 50+)
- [ ] Include: name, email, password, role, location, company, phone, bio, skills

### Step 2: Update Documentation
- [ ] `DEMO_ACCOUNTS.md` - Add row to Recruiters table
- [ ] `README_DEMO_DATA.md` - Update recruiters count
- [ ] `TESTING_GUIDE.md` - Add test account for recruiter role
- [ ] `DEMO_QUICK_REFERENCE.txt` - Add to recruiter list
- [ ] `SETUP_GUIDE.md` - Update accounts count

### Step 3: Test
- [ ] Run seed: `node scripts/seedDatabase.js`
- [ ] Login as new recruiter to verify

---

## ✅ WHEN YOU ADD A NEW TRAINER

### Step 1: Update Backend
**File:** `backend/scripts/seedDatabase.js`
- [ ] Add new trainer in `trainers` array (around line 120+)
- [ ] Include: name, email, password, role, location, phone, bio, company, skills

### Step 2: Update Documentation
- [ ] `DEMO_ACCOUNTS.md` - Add row to Trainers table
- [ ] `README_DEMO_DATA.md` - Update trainers count
- [ ] `TESTING_GUIDE.md` - Add test account for trainer role
- [ ] `DEMO_QUICK_REFERENCE.txt` - Add to trainer list
- [ ] `SETUP_GUIDE.md` - Update accounts count

### Step 3: Test
- [ ] Run seed: `node scripts/seedDatabase.js`
- [ ] Login as new trainer to verify

---

## 🔍 VERIFICATION CHECKLIST

After making any changes, verify:

- [ ] No duplicate emails exist
- [ ] All locations are consistent (spell-check)
- [ ] Phone numbers follow format: +91-XXXXXXXXXX
- [ ] All new entries in demo arrays
- [ ] All documentation updated
- [ ] Seed database runs without errors
- [ ] Frontend shows correct demo data
- [ ] No old data references remain in files

---

## 🚀 Quick Commands

### Search for all demo references
```bash
grep -r "demoApplications\|demoJobs\|demo1\|demo2" src/ backend/
```

### Find specific student
```bash
grep -r "arjun.mehta@student.com" .
```

### Run consistency check
```bash
node sync-demo-data.js
```

### Seed database
```bash
cd backend
node scripts/seedDatabase.js
```

### Search and replace across all files
```bash
# macOS/Linux
find . -type f -name "*.jsx" -o -name "*.md" | xargs sed -i 's/oldtext/newtext/g'

# Windows PowerShell
(Get-ChildItem -Filter "*.jsx" -Recurse) | % { (Get-Content $_) -replace "oldtext", "newtext" | Set-Content $_ }
```

---

## 📋 File Dependencies Map

```
seedDatabase.js (Source of Truth)
    ├─→ src/pages/Applicants.jsx (demoApplications)
    ├─→ src/pages/ManageJobs.jsx (demoJobs)
    └─→ Documentation Files
        ├─→ DEMO_ACCOUNTS.md (account tables)
        ├─→ README_DEMO_DATA.md (overview)
        ├─→ TESTING_GUIDE.md (test scenarios)
        ├─→ SETUP_GUIDE.md (setup instructions)
        ├─→ DEMO_QUICK_REFERENCE.txt (quick lookup)
        └─→ DATA_SYNC_REFERENCE.md (this reference)
```

---

## 🆘 Troubleshooting

### Problem: Demo data not showing in frontend
**Solution:** 
1. Run seed: `node backend/scripts/seedDatabase.js`
2. Check if real API data exists (clears demo data if API returns data)
3. Clear localStorage: `localStorage.clear()` in browser console
4. Refresh page

### Problem: Applicants page shows old applicants
**Solution:**
1. Update `src/pages/Applicants.jsx` demoApplications array
2. Clear localStorage in browser
3. Refresh page

### Problem: Job list shows old jobs
**Solution:**
1. Update `src/pages/ManageJobs.jsx` demoJobs array
2. Clear localStorage: `localStorage.removeItem('localJobs')`
3. Refresh page

### Problem: Email mismatch in documentation
**Solution:**
1. Use this file as source of truth
2. Update seedDatabase.js first
3. Sync all references across other files
4. Run consistency check: `node sync-demo-data.js`

---

## 💡 Best Practices Summary

✅ **ALWAYS:**
- Update `seedDatabase.js` first (source of truth)
- Use this checklist before making changes
- Test with `node sync-demo-data.js` after updates
- Update documentation same day as code

❌ **NEVER:**
- Update frontend demo data without updating backend
- Change data without updating all references
- Use inconsistent naming conventions
- Leave outdated documentation

✨ **REMEMBER:** When one file changes, update them all! Consistency is key for demo data integrity.

---

**Last Updated:** May 2026  
**Version:** 1.0  
**Maintainer:** Development Team
