# 📊 Demo Data Architecture & Flow

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│           PlaceSync Demo Data Architecture v1.0                 │
└─────────────────────────────────────────────────────────────────┘

                    ┌──────────────────────┐
                    │  BACKEND DATABASE    │
                    │  SOURCE OF TRUTH     │
                    │                      │
                    │ seedDatabase.js      │
                    │  - Recruiters (8)    │
                    │  - Trainers (5)      │
                    │  - Students (10)     │
                    │  - Jobs (10+)        │
                    │  - Applications      │
                    │  - Connections       │
                    └──────────┬───────────┘
                               │
                  ┌────────────┼────────────┐
                  │            │            │
         ┌────────▼─────┐ ┌───▼────────┐ ┌▼──────────────┐
         │ FRONTEND UI  │ │ API Routes │ │ TEST SCRIPTS  │
         │ DEMO DISPLAY │ │ /api/...   │ │ Testing Tools │
         └──────────────┘ └────────────┘ └───────────────┘
              │                                  │
    ┌─────────┴─────────┐                       │
    │                   │                       │
  ┌─▼──────────────┐ ┌─▼─────────────┐        │
  │ Applicants.jsx │ │ ManageJobs.jsx│        │
  │ demoApps (12)  │ │ demoJobs (4+) │        │
  └────────────────┘ └───────────────┘        │
                                               │
         ┌─────────────────────────────────────┘
         │
  ┌──────▼──────────────┐
  │  DOCUMENTATION      │
  │  REFERENCE FILES    │
  │                     │
  │ - DEMO_ACCOUNTS.md  │
  │ - README_DEMO_DATA  │
  │ - TESTING_GUIDE.md  │
  │ - SETUP_GUIDE.md    │
  │ - QUICK_REFERENCE   │
  └─────────────────────┘
```

---

## Data Synchronization Flow

```
┌──────────────────────────────────────────────────────────────────┐
│ Step 1: Add/Modify Demo Data                                     │
│ Action: Update seedDatabase.js                                   │
└──────────────────────────────────────────────────────────────────┘
                               ▼
┌──────────────────────────────────────────────────────────────────┐
│ Step 2: Identify What Changed                                    │
│ Check: Students? Jobs? Recruiters? Trainers?                    │
└──────────────────────────────────────────────────────────────────┘
                               ▼
┌──────────────────────────────────────────────────────────────────┐
│ Step 3: Update All Dependent Files                               │
│ For STUDENTS:                                                    │
│  ├─ src/pages/Applicants.jsx (demoApplications)                 │
│  ├─ DEMO_ACCOUNTS.md (Students table)                           │
│  ├─ README_DEMO_DATA.md (Students list)                         │
│  ├─ TESTING_GUIDE.md (Student accounts)                         │
│  └─ DEMO_QUICK_REFERENCE.txt (Student list)                     │
│                                                                  │
│ For JOBS:                                                        │
│  ├─ src/pages/ManageJobs.jsx (demoJobs)                         │
│  ├─ DEMO_ACCOUNTS.md (Jobs table)                               │
│  ├─ README_DEMO_DATA.md (Jobs list)                             │
│  └─ TESTING_GUIDE.md (Job scenarios)                            │
│                                                                  │
│ For RECRUITERS/TRAINERS:                                         │
│  ├─ DEMO_ACCOUNTS.md (Recruiters/Trainers table)                │
│  ├─ TESTING_GUIDE.md (Account references)                       │
│  └─ DEMO_QUICK_REFERENCE.txt (Account list)                     │
└──────────────────────────────────────────────────────────────────┘
                               ▼
┌──────────────────────────────────────────────────────────────────┐
│ Step 4: Verify Consistency                                       │
│ Run: node sync-demo-data.js                                      │
│ Check: All emails unique, no duplicate accounts, all fields OK   │
└──────────────────────────────────────────────────────────────────┘
                               ▼
┌──────────────────────────────────────────────────────────────────┐
│ Step 5: Test in Application                                      │
│ 1. Run: node backend/scripts/seedDatabase.js                     │
│ 2. Start frontend: npm start                                     │
│ 3. Check Applicants page: Shows updated demo applicants         │
│ 4. Check ManageJobs: Shows updated demo jobs                    │
│ 5. Verify database: New records created                         │
└──────────────────────────────────────────────────────────────────┘
```

---

## File Synchronization Map

```
STUDENTS DATA CHANGES:
  seedDatabase.js (source)
        │
        ├──→ Applicants.jsx (demoApplications array)
        ├──→ DEMO_ACCOUNTS.md (Students table row)
        ├──→ README_DEMO_DATA.md (Students overview)
        ├──→ TESTING_GUIDE.md (Student test accounts)
        └──→ DEMO_QUICK_REFERENCE.txt (Student list)

JOB DATA CHANGES:
  seedDatabase.js (source)
        │
        ├──→ ManageJobs.jsx (demoJobs array)
        ├──→ DEMO_ACCOUNTS.md (Jobs table)
        ├──→ README_DEMO_DATA.md (Jobs overview)
        └──→ TESTING_GUIDE.md (Job scenarios)

RECRUITER DATA CHANGES:
  seedDatabase.js (source)
        │
        ├──→ DEMO_ACCOUNTS.md (Recruiters table)
        ├──→ TESTING_GUIDE.md (Recruiter accounts)
        └──→ DEMO_QUICK_REFERENCE.txt (Recruiter list)

TRAINER DATA CHANGES:
  seedDatabase.js (source)
        │
        ├──→ DEMO_ACCOUNTS.md (Trainers table)
        ├──→ TESTING_GUIDE.md (Trainer accounts)
        └──→ DEMO_QUICK_REFERENCE.txt (Trainer list)
```

---

## Current Demo Data Statistics

```
┌─────────────────────────────────────────┐
│     DEMO DATA CURRENT STATUS            │
├─────────────────────────────────────────┤
│                                         │
│  👥 ACCOUNTS TOTAL:          23         │
│     ├─ Students:             10         │
│     ├─ Recruiters:            8         │
│     └─ Trainers:              5         │
│                                         │
│  💼 JOB POSTINGS:           4+          │
│     ├─ Full-time:            4          │
│     ├─ Locations:            6          │
│     └─ Salary Range:     ₹3-18 Lakh     │
│                                         │
│  📋 APPLICATIONS:           12          │
│     ├─ Pending:              4          │
│     ├─ Reviewed:             4          │
│     ├─ Accepted:             3          │
│     └─ Rejected:             1          │
│                                         │
│  🔐 DEFAULT PASSWORD:   password123     │
│  🌐 LOCATIONS:           6 Indian cities│
│  🏢 COMPANIES:           15+ major firms│
│                                         │
└─────────────────────────────────────────┘
```

---

## Data Dependencies

```
APPLICATION UI
    │
    ├─── Applicants.jsx
    │    └─ Uses: demoApplications array
    │    └─ Needs: Student data from seedDatabase.js
    │    └─ Shows: When API returns 0 applications
    │
    ├─── ManageJobs.jsx  
    │    └─ Uses: demoJobs array
    │    └─ Needs: Job data from seedDatabase.js
    │    └─ Shows: When recruiter has 0 jobs
    │
    └─── Other Pages
         └─ May reference demo accounts for testing
```

---

## Consistency Rules

```
✅ MUST MATCH EXACTLY:
   ├─ Student Name (across all files)
   ├─ Student Email (format: name@student.com)
   ├─ Student Phone (+91-XXXXXXXXXX)
   ├─ Student Location (City, State)
   ├─ Job Title (consistent spelling)
   ├─ Company Name (consistent spelling)
   ├─ All passwords (should be identical)
   └─ All date formats (ISO 8601)

⚠️ KEEP CONSISTENT:
   ├─ Email domain suffixes (@student.com, @tcs.com, etc.)
   ├─ Phone number format
   ├─ Location format (City, State)
   ├─ Status values (Pending, Reviewed, Accepted, Rejected)
   └─ Application status across all references
```

---

## File Update Sequence

```
RECOMMENDED UPDATE ORDER:

1️⃣  Update seedDatabase.js
    (Make core data changes first)
    
2️⃣  Update src/pages/Applicants.jsx  
    (Update frontend demo display)
    
3️⃣  Update src/pages/ManageJobs.jsx
    (Update job demo display)
    
4️⃣  Update DEMO_ACCOUNTS.md
    (Update main reference documentation)
    
5️⃣  Update README_DEMO_DATA.md
    (Update overview documentation)
    
6️⃣  Update TESTING_GUIDE.md
    (Update testing references)
    
7️⃣  Update DEMO_QUICK_REFERENCE.txt
    (Update quick lookup)
    
8️⃣  Run sync-demo-data.js
    (Verify consistency)
    
9️⃣  Test in application
    (Run seed script and verify UI shows correct data)
```

---

## Common Scenarios

### Scenario 1: Add New Student

```
Action: Add Arjun Mehta to student list

1. Edit: backend/scripts/seedDatabase.js
   Add: { name: 'Arjun Mehta', email: 'arjun.mehta@student.com', ... }

2. Edit: src/pages/Applicants.jsx
   Add: { _id: 'app1', applicant: { name: 'Arjun Mehta', ... }, ... }

3. Edit: DEMO_ACCOUNTS.md
   Add: Row to Students table

4. Edit: README_DEMO_DATA.md
   Update: Student count from 9 to 10

5. Edit: TESTING_GUIDE.md
   Add: Reference to new student account

6. Run: node sync-demo-data.js
   Verify: No errors, all data consistent

7. Test: npm start → Navigate to Applicants → See new applicant
```

### Scenario 2: Change Job Details

```
Action: Update job title and salary

1. Edit: backend/scripts/seedDatabase.js
   Update: Job title and salary range

2. Edit: src/pages/ManageJobs.jsx
   Update: demoJobs array with new details

3. Edit: DEMO_ACCOUNTS.md
   Update: Job Postings table

4. Run: node sync-demo-data.js
   Verify: Data consistency

5. Test: npm start → Check ManageJobs page
```

### Scenario 3: Update Password

```
Action: Change password from 'password123' to 'newpass456'

1. Edit: backend/scripts/seedDatabase.js
   Replace: All instances of 'password123' with 'newpass456'

2. Edit: DEMO_ACCOUNTS.md
   Update: "Default Password for All Demo Accounts" line

3. Edit: TESTING_GUIDE.md
   Update: All password references

4. Edit: DEMO_QUICK_REFERENCE.txt
   Update: Default password section

5. Edit: SETUP_GUIDE.md
   Update: Password in examples

6. Run: node sync-demo-data.js
   Verify: All systems ready

7. Notify: Team of new password
```

---

## Quality Checklist

Before considering demo data synchronized:

```
□ Source file (seedDatabase.js) is updated
□ Frontend files (Applicants.jsx, ManageJobs.jsx) are updated
□ All documentation files are updated
□ No duplicate emails or accounts
□ All phone numbers follow format
□ All locations spelled consistently
□ No stale references remain
□ sync-demo-data.js runs without errors
□ Application displays demo data correctly
□ Database seed runs successfully
□ Team is notified of changes
```

---

## Emergency: Reset All Demo Data

```bash
# Clear all local overrides
rm -f ~/.place-sync-local-data.json

# Clear browser localStorage
# In browser console: localStorage.clear()

# Reseed database
cd backend
node scripts/seedDatabase.js

# Restart application
npm start
```

---

**Last Updated:** May 2026  
**Version:** 1.0  
**Status:** Active & Maintained
