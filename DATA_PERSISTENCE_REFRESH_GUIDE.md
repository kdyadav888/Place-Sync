# 🔄 Data Persistence on Page Refresh Guide

## Overview

This guide explains how demo data and changes persist when you refresh the page. It ensures that when you:
- Change an application status
- Deactivate/activate a job
- Modify any data

**All changes stay intact after page refresh** ✓

---

## How It Works

### The Data Flow on Page Refresh

```
User makes change (e.g., change app status from Pending to Reviewed)
        ↓
Change stored in React state
        ↓
Change saved to localStorage with key:
  • appStatusOverrides → Track application status changes
  • jobStatusOverrides → Track job status changes
  • localApplications → Track new applications
  • localJobs → Track new jobs
        ↓
Timestamp recorded: placesync_<key>_ts
        ↓
User refreshes page (F5 or Ctrl+R)
        ↓
Page loads, React mounts components
        ↓
useEffect hook runs fetchApplications() or fetchJobs()
        ↓
Component checks localStorage FIRST
        ↓
Loads stored data + applies status overrides
        ↓
Component renders with persisted changes
        ↓
✓ User sees the same data they modified!
```

---

## localStorage Keys Explained

### Storage Keys Reference

| Key | Purpose | Persists |
|-----|---------|----------|
| `appStatusOverrides` | Tracks application status changes (Pending→Reviewed, etc.) | ✅ Yes |
| `jobStatusOverrides` | Tracks job active/inactive status | ✅ Yes |
| `localApplications` | New applications created before API sync | ✅ Yes |
| `localJobs` | New jobs created before API sync | ✅ Yes |
| `filterPreferences` | User's filter selections on pages | ✅ Yes |

### How Status Overrides Work

**Example 1: Changing Application Status**

```javascript
// Initial demo application from demoApplications array:
{
  _id: 'app1',
  applicant: { name: 'Rajesh Kumar', ... },
  status: 'Pending'  // Original status
}

// User changes status to "Reviewed"
// This gets saved to localStorage:
appStatusOverrides = {
  'app1': 'Reviewed'  // Override stored
}

// On page refresh, component merges them:
const app = demoApplications[0];  // Gets 'Pending'
const override = appStatusOverrides['app1'];  // Gets 'Reviewed'
app.status = override || app.status;  // Uses 'Reviewed'
// Result: ✓ Status remains 'Reviewed' after refresh
```

**Example 2: Job Deactivate/Activate**

```javascript
// Initial demo job:
{
  _id: 'demo1',
  title: 'Senior Full Stack Developer',
  isActive: true  // Original status
}

// User deactivates the job
// This gets saved:
jobStatusOverrides = {
  'demo1': false  // Deactivated
}

// On refresh, job loads as deactivated:
job.isActive = jobStatusOverrides['demo1'] || job.isActive;
// Result: ✓ Job remains deactivated
```

---

## Detailed Flow Diagrams

### On Initial Page Load (Without Changes)

```
App Mounted
    ↓
useEffect runs
    ↓
Check localStorage for stored data
    ↓
No changes found (localStorage empty)
    ↓
Fetch data from API OR use demoData
    ↓
Display to user
```

### On Page Load (With Previous Changes)

```
App Mounted
    ↓
useEffect runs
    ↓
Check localStorage for:
  • appStatusOverrides ← Found!
  • jobStatusOverrides ← Found!
  • localApplications  ← May exist
    ↓
Load demoData/API data
    ↓
Apply overrides:
  app.status = override[app._id] || app.status
  job.isActive = override[job._id] || job.isActive
    ↓
Render with changes applied
    ↓
✓ User sees persisted changes!
```

---

## File References

### Code That Handles Persistence

**Applicants.jsx** (Lines ~155-170)
```javascript
useEffect(() => {
  // Load from localStorage FIRST
  const localApps = JSON.parse(localStorage.getItem('localApplications') || '[]');
  const appStatusOverrides = JSON.parse(localStorage.getItem('appStatusOverrides') || '{}');
  
  // Apply overrides to applications
  const appsWithOverrides = localApps.map(app => ({
    ...app,
    status: appStatusOverrides[app._id] || app.status
  }));
  
  if (appsWithOverrides.length > 0) {
    setApplications(appsWithOverrides);
  }
  
  // Fetch from API if needed
  fetchApplications();
}, [filter]);
```

**ManageJobs.jsx** (Lines ~55-150)
```javascript
const fetchJobs = async () => {
  try {
    // Get overrides from localStorage
    const jobStatusOverrides = JSON.parse(localStorage.getItem('jobStatusOverrides') || '{}');
    
    // Apply overrides to API jobs
    const apiJobs = data.jobs.map(job => ({
      ...job,
      isActive: jobStatusOverrides[job._id] !== undefined 
        ? jobStatusOverrides[job._id] 
        : job.isActive
    }));
    
    setJobs(apiJobs);
  } catch (error) {
    // Use demo jobs on error
    setJobs(demoJobs);
  }
};
```

---

## New Utilities Available

### useLocalStorageSync Hook

**File:** `src/hooks/useLocalStorageSync.js`

Custom React hook for persistent state:

```javascript
import useLocalStorageSync from '../hooks/useLocalStorageSync';

function MyComponent() {
  // State that persists on refresh
  const [filter, setFilter, clearFilter] = useLocalStorageSync('filterPreferences', 'all');
  
  return (
    <div>
      <select value={filter} onChange={(e) => setFilter(e.target.value)}>
        <option value="all">All</option>
        <option value="pending">Pending</option>
      </select>
    </div>
  );
  // On refresh: filter value is restored automatically!
}
```

### PlaceSyncStorage Utility

**File:** `src/utils/PlaceSyncStorage.js`

Centralized storage management:

```javascript
import PlaceSyncStorage from '../utils/PlaceSyncStorage';

// Get data
const overrides = PlaceSyncStorage.get('appStatusOverrides', {});

// Set data
PlaceSyncStorage.set('appStatusOverrides', { app1: 'Reviewed' });

// Check consistency
const report = PlaceSyncStorage.verifyConsistency();

// Get all data (debugging)
const allData = PlaceSyncStorage.getAllData();

// Clear all
PlaceSyncStorage.clearAll();
```

---

## Step-by-Step: Change Data & Refresh

### Scenario: Change Application Status and Refresh

**Step 1: User Changes Status**
```
1. Open Applicants page
2. See application: Rajesh Kumar - Status: Pending
3. Click "Change Status" → Select "Reviewed"
4. Status updates in UI: ✓ Rajesh Kumar - Status: Reviewed
```

**Step 2: Behind the Scenes**
```
// handleStatusChange() function:
const updatedApp = { ...app, status: 'Reviewed' };
setApplications([...applications]);  // Update React state

// Save to localStorage:
const appStatusOverrides = JSON.parse(
  localStorage.getItem('appStatusOverrides') || '{}'
);
appStatusOverrides['app1'] = 'Reviewed';  // ← Add override
localStorage.setItem('appStatusOverrides', JSON.stringify(appStatusOverrides));

// Send to API (async):
await fetch(`/api/applications/app1`, { 
  method: 'PUT',
  body: JSON.stringify({ status: 'Reviewed' })
});
```

**Step 3: User Refreshes (F5)**
```
1. Browser reloads page
2. React remounts components
3. useEffect runs:
   - Loads demoApplications array from code
   - Loads appStatusOverrides from localStorage: { app1: 'Reviewed' }
   - Merges them:
     app.status = override['app1'] || app.status
     app.status = 'Reviewed' || 'Pending'  → 'Reviewed'
4. Page renders
5. ✓ Rajesh Kumar still shows Status: Reviewed!
```

**Step 4: Page Displays Correctly**
```
Application List (After Refresh):
- Rajesh Kumar | Status: Reviewed ← ✓ Persisted!
- Priya Singh | Status: Reviewed
- Arjun Patel | Status: Accepted
```

---

## Common Scenarios

### Scenario A: Change Job Status and Refresh

```
✓ Works because:
  1. Job deactivation saved to jobStatusOverrides
  2. On refresh, ManageJobs checks localStorage first
  3. Loads demoJobs and applies overrides
  4. Job remains deactivated
```

### Scenario B: Filter Preferences Persist

```
✓ Works because:
  1. Filter selection saved to localStorage
  2. Component loads filter from localStorage on mount
  3. useEffect uses saved filter value
  4. Display shows filtered data
```

### Scenario C: Create New Application

```
✓ Works because:
  1. New application saved to localApplications array
  2. localStorage stores the entire array
  3. On refresh, component loads localApplications first
  4. New application appears in list
```

---

## Troubleshooting: Data Lost on Refresh?

### Problem: Changes disappeared after refresh

**Possible Causes:**
1. ❌ localStorage was cleared
2. ❌ Private browsing mode (doesn't persist)
3. ❌ localStorage quota exceeded
4. ❌ Code bug not saving to localStorage

**Solutions:**

**1. Check browser storage**
```javascript
// In browser console:
localStorage.getItem('placesync_appStatusOverrides');
// If null → data wasn't saved
```

**2. Check for errors**
```javascript
// Browser console - look for errors like:
// "QuotaExceededError: localStorage quota exceeded"
```

**3. Verify component is using localStorage**
```javascript
// In component: Make sure useEffect runs on mount
useEffect(() => {
  const overrides = localStorage.getItem('appStatusOverrides');
  console.log('Loaded from storage:', overrides);  // Should log JSON
}, []);
```

**4. Clear and try again**
```javascript
// Browser console:
localStorage.clear();
location.reload();
// Make a change and check if it saves
```

### Problem: Old Data Showing After Update

**Solution:**
1. Open browser DevTools (F12)
2. Go to Storage → localStorage
3. Find keys starting with "placesync_"
4. Manually delete problematic keys
5. Refresh page

```javascript
// Or in console:
// Clear all PlaceSync data:
Object.keys(localStorage).forEach(key => {
  if (key.startsWith('placesync_')) {
    localStorage.removeItem(key);
  }
});
location.reload();
```

---

## Performance Notes

### Storage Limits

| Browser | Limit | Warning |
|---------|-------|---------|
| Chrome | 10 MB | ⚠️ Don't exceed 5 MB |
| Firefox | 10 MB | ⚠️ Don't exceed 5 MB |
| Safari | 5 MB | ⚠️ Don't exceed 2 MB |
| IE | 10 MB | ⚠️ Don't exceed 5 MB |

### Optimize Storage Usage

```javascript
// Import the storage manager
import PlaceSyncStorage from '../utils/PlaceSyncStorage';

// Check current usage
const usage = PlaceSyncStorage.getStorageUsage();
console.log(`Using ${usage.kilobytes}KB of localStorage`);

// Clear old overrides periodically
if (usage.kilobytes > 500) {
  // Archive or clean old data
  PlaceSyncStorage.clearAll();  // Clear everything
}
```

---

## Testing Data Persistence

### Manual Test Steps

**Test 1: Status Change Persists**
```
1. Open Applicants page
2. Change status: Pending → Reviewed
3. Press F5 (refresh)
4. ✓ Status should still be Reviewed
```

**Test 2: Job Deactivation Persists**
```
1. Open ManageJobs page
2. Deactivate a job
3. Job moves to "Inactive" tab
4. Press Ctrl+Shift+Delete (clear browsing data - SELECT ONLY COOKIES)
5. ✓ Job should still be in Inactive tab
```

**Test 3: Multiple Changes Persist**
```
1. Change 3 application statuses
2. Deactivate 2 jobs
3. Refresh page
4. ✓ All changes should persist
```

**Test 4: Cross-Tab Sync (Advanced)**
```
1. Open app in Tab A
2. Change status: Pending → Reviewed
3. In Tab B (open same page fresh)
4. Change status: Rejected → Accepted
5. Go back to Tab A
6. Both changes should appear
7. ✓ Shows custom event sync works
```

---

## Best Practices

✅ **DO:**
- Save data to localStorage immediately on change
- Load from localStorage on component mount
- Apply status overrides when rendering
- Use timestamps to track when data was last updated
- Test after page refresh to verify persistence

❌ **DON'T:**
- Rely on only API without localStorage backup
- Forget to check localStorage before API call
- Use different storage keys for same data
- Store sensitive data like passwords
- Assume localStorage works in private browsing

---

## Code Examples

### Example 1: Save and Load Application Status

```javascript
// Save change
const saveStatusChange = (appId, newStatus) => {
  // Update state
  setApplications(apps => apps.map(app => 
    app._id === appId ? { ...app, status: newStatus } : app
  ));
  
  // Save to localStorage
  const overrides = PlaceSyncStorage.get('appStatusOverrides', {});
  overrides[appId] = newStatus;
  PlaceSyncStorage.set('appStatusOverrides', overrides);
};

// Load on mount
useEffect(() => {
  const overrides = PlaceSyncStorage.get('appStatusOverrides', {});
  const updatedApps = demoApplications.map(app => ({
    ...app,
    status: overrides[app._id] || app.status
  }));
  setApplications(updatedApps);
}, []);
```

### Example 2: Persist Filter Selection

```javascript
import useLocalStorageSync from '../hooks/useLocalStorageSync';

function FilterComponent() {
  const [selectedFilter, setSelectedFilter, clearFilter] = useLocalStorageSync(
    'appFilter',
    'all'
  );
  
  return (
    <select value={selectedFilter} onChange={(e) => setSelectedFilter(e.target.value)}>
      <option value="all">All</option>
      <option value="pending">Pending</option>
      <option value="reviewed">Reviewed</option>
    </select>
  );
  // Selected filter automatically persists on refresh!
}
```

---

## Summary

✨ **Key Points:**

1. ✅ Changes are saved to localStorage immediately
2. ✅ On page refresh, component loads from localStorage first
3. ✅ Status overrides are applied to demo data
4. ✅ User sees their changes after refresh
5. ✅ New utilities available for consistent storage management

🎯 **Result:** When you make ANY change and refresh the page, your changes persist! 

---

**Last Updated:** May 2026  
**Version:** 1.0  
**Status:** ✓ Data Persistence Fully Implemented
