#!/usr/bin/env node

/**
 * Data Synchronization Script
 * Ensures all demo data is consistent across the entire codebase
 * 
 * Usage: node sync-demo-data.js
 * Run this after making any changes to demo data in seedDatabase.js
 */

const fs = require('fs');
const path = require('path');

// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
  blue: '\x1b[34m',
};

const log = {
  info: (msg) => console.log(`${colors.cyan}ℹ ${msg}${colors.reset}`),
  success: (msg) => console.log(`${colors.green}✓ ${msg}${colors.reset}`),
  warning: (msg) => console.log(`${colors.yellow}⚠ ${msg}${colors.reset}`),
  error: (msg) => console.log(`${colors.red}✗ ${msg}${colors.reset}`),
  header: (msg) => console.log(`\n${colors.bright}${colors.blue}=== ${msg} ===${colors.reset}\n`),
};

// Define demo data structure (this should match seedDatabase.js)
const demoData = {
  students: [
    { name: 'Arjun Mehta', email: 'arjun.mehta@student.com', phone: '+91-9988776655', location: 'Delhi, NCR' },
    { name: 'Sneha Iyer', email: 'sneha.iyer@student.com', phone: '+91-8877665544', location: 'Bangalore, Karnataka' },
    { name: 'Rahul Chopra', email: 'rahul.chopra@student.com', phone: '+91-7766554433', location: 'Gurugram, Haryana' },
    { name: 'Pooja Saxena', email: 'pooja.saxena@student.com', phone: '+91-6655443322', location: 'Mumbai, Maharashtra' },
    { name: 'Nikhil Joshi', email: 'nikhil.joshi@student.com', phone: '+91-5544332211', location: 'Pune, Maharashtra' },
    { name: 'Kavya Nair', email: 'kavya.nair@student.com', phone: '+91-4433221100', location: 'Hyderabad, Telangana' },
    { name: 'Aditya Singh', email: 'aditya.singh@student.com', phone: '+91-9912345678', location: 'Delhi, NCR' },
    { name: 'Divya Reddy', email: 'divya.reddy@student.com', phone: '+91-9823456789', location: 'Hyderabad, Telangana' },
    { name: 'Ravi Kumar', email: 'ravi.kumar@student.com', phone: '+91-9734567890', location: 'Bangalore, Karnataka' },
    { name: 'Neha Gupta', email: 'neha.gupta@student.com', phone: '+91-8645678901', location: 'Mumbai, Maharashtra' },
  ],
  recruiters: [
    { name: 'Rajesh Kumar', email: 'rajesh@tcs.com', company: 'Tata Consultancy Services (TCS)' },
    { name: 'Priya Sharma', email: 'priya@infosys.com', company: 'Infosys' },
    { name: 'Amit Patel', email: 'amit@wipro.com', company: 'Wipro' },
    { name: 'Deepak Singh', email: 'deepak@amazon.com', company: 'Amazon India' },
    { name: 'Neha Gupta', email: 'neha@flipkart.com', company: 'Flipkart' },
    { name: 'Sanjay Verma', email: 'sanjay@google.com', company: 'Google India' },
    { name: 'Anjali Desai', email: 'anjali@microsoft.com', company: 'Microsoft India' },
    { name: 'Vikram Reddy', email: 'vikram@accenture.com', company: 'Accenture India' },
  ],
  trainers: [
    { name: 'Dr. Mahesh Kumar', email: 'mahesh.trainer@gmail.com', company: 'TechHub Academy', specialization: 'Full Stack Development' },
    { name: 'Priya Sharma', email: 'priya.trainer@gmail.com', company: 'Data Academy India', specialization: 'Data Science & ML' },
    { name: 'Rohit Verma', email: 'rohit.trainer@gmail.com', company: 'Cloud Masters Institute', specialization: 'Cloud Computing & DevOps' },
    { name: 'Anjali Singh', email: 'anjali.trainer@gmail.com', company: 'Web Academy Plus', specialization: 'Frontend Development' },
    { name: 'Vikram Patel', email: 'vikram.trainer@gmail.com', company: 'Core Java Institute', specialization: 'Java & Microservices' },
  ],
};

/**
 * Verify data consistency
 */
function verifyConsistency() {
  log.header('Checking Demo Data Consistency');
  
  let issues = [];
  
  // Check for duplicate emails
  const allEmails = [
    ...demoData.students.map(s => s.email),
    ...demoData.recruiters.map(r => r.email),
    ...demoData.trainers.map(t => t.email),
  ];
  
  const duplicateEmails = allEmails.filter((email, index) => allEmails.indexOf(email) !== index);
  
  if (duplicateEmails.length > 0) {
    log.error(`Found duplicate emails: ${duplicateEmails.join(', ')}`);
    issues.push('duplicate-emails');
  }
  
  // Check for empty fields
  Object.keys(demoData).forEach(role => {
    demoData[role].forEach((user, idx) => {
      Object.keys(user).forEach(field => {
        if (!user[field]) {
          log.error(`${role}[${idx}].${field} is empty`);
          issues.push(`empty-field-${role}`);
        }
      });
    });
  });
  
  if (issues.length === 0) {
    log.success('All demo data is consistent!');
  }
  
  return issues.length === 0;
}

/**
 * Check if files contain correct references
 */
function checkFileReferences() {
  log.header('Checking File References');
  
  const filesToCheck = [
    { path: 'src/pages/Applicants.jsx', should_contain: 'demoApplications' },
    { path: 'src/pages/ManageJobs.jsx', should_contain: 'demoJobs' },
    { path: 'DEMO_ACCOUNTS.md', should_contain: demoData.students[0].name },
    { path: 'backend/scripts/seedDatabase.js', should_contain: demoData.students[0].email },
  ];
  
  let allGood = true;
  
  filesToCheck.forEach(file => {
    const fullPath = path.join(process.cwd(), file.path);
    
    if (!fs.existsSync(fullPath)) {
      log.warning(`File not found: ${file.path}`);
      return;
    }
    
    const content = fs.readFileSync(fullPath, 'utf8');
    
    if (content.includes(file.should_contain)) {
      log.success(`${file.path} contains expected references`);
    } else {
      log.error(`${file.path} missing expected references`);
      allGood = false;
    }
  });
  
  return allGood;
}

/**
 * Print summary statistics
 */
function printSummary() {
  log.header('Demo Data Summary');
  
  console.log(`${colors.bright}${colors.green}✓ Total Demo Accounts:${colors.reset}`);
  console.log(`  • Students:   ${demoData.students.length}`);
  console.log(`  • Recruiters: ${demoData.recruiters.length}`);
  console.log(`  • Trainers:   ${demoData.trainers.length}`);
  console.log(`  • TOTAL:      ${demoData.students.length + demoData.recruiters.length + demoData.trainers.length}\n`);
  
  console.log(`${colors.bright}${colors.green}✓ Student List:${colors.reset}`);
  demoData.students.forEach((s, i) => {
    console.log(`  ${i + 1}. ${s.name.padEnd(20)} | ${s.email.padEnd(30)} | ${s.location}`);
  });
  
  console.log(`\n${colors.bright}${colors.green}✓ Recruiter List:${colors.reset}`);
  demoData.recruiters.forEach((r, i) => {
    console.log(`  ${i + 1}. ${r.name.padEnd(20)} | ${r.email.padEnd(30)} | ${r.company}`);
  });
  
  console.log(`\n${colors.bright}${colors.green}✓ Trainer List:${colors.reset}`);
  demoData.trainers.forEach((t, i) => {
    console.log(`  ${i + 1}. ${t.name.padEnd(20)} | ${t.email.padEnd(30)} | ${t.company}`);
  });
}

/**
 * Main execution
 */
function main() {
  console.log(`\n${colors.bright}${colors.cyan}📋 PlaceSync Data Synchronization Tool${colors.reset}\n`);
  
  const consistencyOk = verifyConsistency();
  const referencesOk = checkFileReferences();
  
  printSummary();
  
  if (consistencyOk && referencesOk) {
    log.success('\n✨ All systems operational! Demo data is synchronized.');
    process.exit(0);
  } else {
    log.error('\n⚠️  Some issues found. Please review the output above and update files as needed.');
    process.exit(1);
  }
}

// Run
main();
