import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../src/models/User.js';
import Job from '../src/models/Job.js';
import Application from '../src/models/Application.js';
import Connection from '../src/models/Connection.js';
import Message from '../src/models/Message.js';
import Notification from '../src/models/Notification.js';

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/placesync');
    console.log(' MongoDB Connected');
  } catch (error) {
    console.error(' MongoDB Connection Error:', error);
    process.exit(1);
  }
};

const seedDatabase = async () => {
  try {
    // ensure we use same DB name the server uses
    process.env.MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/place-sync';
    await connectDB();

    // Clear existing data
    await User.deleteMany({});
    await Job.deleteMany({});
    await Application.deleteMany({});
    await Connection.deleteMany({});
    await Message.deleteMany({});
    await Notification.deleteMany({});
    console.log('  Cleared existing data');

    // Create recruiter users (Indian companies)
    const recruiters = await User.create([
      {
        name: 'Rajesh Kumar',
        email: 'rajesh@tcs.com',
        password: 'password123',
        role: 'recruiter',
        location: 'Gurugram, Haryana',
        company: 'Tata Consultancy Services (TCS)',
        phone: '+91-9876543210',
        bio: 'HR Manager at TCS, hiring for multiple positions',
        isEmailVerified: true,
        skills: ['Recruitment', 'HR Management', 'Talent Acquisition'],
      },
      {
        name: 'Priya Sharma',
        email: 'priya@infosys.com',
        password: 'password123',
        role: 'recruiter',
        location: 'Bangalore, Karnataka',
        company: 'Infosys',
        phone: '+91-9123456789',
        bio: 'Recruiting Software Engineers at Infosys',
        isEmailVerified: true,
        skills: ['Tech Recruitment', 'Talent Management'],
      },
      {
        name: 'Amit Patel',
        email: 'amit@wipro.com',
        password: 'password123',
        role: 'recruiter',
        location: 'Pune, Maharashtra',
        company: 'Wipro',
        phone: '+91-8765432109',
        bio: 'Wipro Recruitment Lead - Looking for talented developers',
        isEmailVerified: true,
        skills: ['Developer Recruitment', 'HR'],
      },
      {
        name: 'Deepak Singh',
        email: 'deepak@amazon.com',
        password: 'password123',
        role: 'recruiter',
        location: 'Bangalore, Karnataka',
        company: 'Amazon India',
        phone: '+91-7654321098',
        bio: 'Amazon - Hiring for AWS and Cloud positions',
        isEmailVerified: true,
        skills: ['Cloud Recruitment', 'Technical Hiring'],
      },
      {
        name: 'Neha Gupta',
        email: 'neha@flipkart.com',
        password: 'password123',
        role: 'recruiter',
        location: 'Bangalore, Karnataka',
        company: 'Flipkart',
        phone: '+91-6543210987',
        bio: 'Flipkart Tech Recruitment - Full Stack opportunities',
        isEmailVerified: true,
        skills: ['Tech Hiring', 'Product Management'],
      },
      {
        name: 'Sanjay Verma',
        email: 'sanjay@google.com',
        password: 'password123',
        role: 'recruiter',
        location: 'Hyderabad, Telangana',
        company: 'Google India',
        phone: '+91-5432109876',
        bio: 'Google - Recruiting Software Engineers and Data Scientists',
        isEmailVerified: true,
        skills: ['Software Recruitment', 'Data Science Hiring'],
      },
      {
        name: 'Anjali Desai',
        email: 'anjali@microsoft.com',
        password: 'password123',
        role: 'recruiter',
        location: 'Delhi, NCR',
        company: 'Microsoft India',
        phone: '+91-4321098765',
        bio: 'Microsoft - Tech, Sales and Operations hiring',
        isEmailVerified: true,
        skills: ['Technology Recruitment', 'Enterprise Hiring'],
      },
      {
        name: 'Vikram Reddy',
        email: 'vikram@accenture.com',
        password: 'password123',
        role: 'recruiter',
        location: 'Mumbai, Maharashtra',
        company: 'Accenture India',
        phone: '+91-3210987654',
        bio: 'Accenture - Digital, Cloud, and Consulting roles',
        isEmailVerified: true,
        skills: ['Consulting Recruitment', 'Digital Hiring'],
      },
    ]);

    console.log(' Created 8 recruiters');

    // Create trainer users (Indian names)
    const trainers = await User.create([
      {
        name: 'Dr. Mahesh Kumar',
        email: 'mahesh.trainer@gmail.com',
        password: 'password123',
        role: 'trainer',
        location: 'Delhi, NCR',
        phone: '+91-9999000011',
        bio: 'Expert trainer in full-stack development with 15+ years experience. Mentored 500+ successful students',
        isEmailVerified: true,
        company: 'TechHub Academy',
        skills: ['React', 'Node.js', 'MongoDB', 'JavaScript', 'Web Development', 'Mentoring'],
      },
      {
        name: 'Priya Sharma',
        email: 'priya.trainer@gmail.com',
        password: 'password123',
        role: 'trainer',
        location: 'Bangalore, Karnataka',
        phone: '+91-8888111122',
        bio: 'Data Science Expert, Ex-Google, specializing in ML and Python. 10+ years experience',
        isEmailVerified: true,
        company: 'Data Academy India',
        skills: ['Python', 'Machine Learning', 'Data Analysis', 'TensorFlow', 'Statistics', 'SQL'],
      },
      {
        name: 'Rohit Verma',
        email: 'rohit.trainer@gmail.com',
        password: 'password123',
        role: 'trainer',
        location: 'Mumbai, Maharashtra',
        phone: '+91-7777222233',
        bio: 'Cloud Computing Specialist, AWS Certified Solutions Architect. 12+ years in cloud tech',
        isEmailVerified: true,
        company: 'Cloud Masters Institute',
        skills: ['AWS', 'Azure', 'Docker', 'Kubernetes', 'DevOps', 'CI/CD'],
      },
      {
        name: 'Anjali Singh',
        email: 'anjali.trainer@gmail.com',
        password: 'password123',
        role: 'trainer',
        location: 'Pune, Maharashtra',
        phone: '+91-6666333344',
        bio: 'Frontend Expert specializing in React and modern JavaScript frameworks. 8+ years experience',
        isEmailVerified: true,
        company: 'Web Academy Plus',
        skills: ['React', 'JavaScript', 'CSS', 'TypeScript', 'Redux', 'Next.js'],
      },
      {
        name: 'Vikram Patel',
        email: 'vikram.trainer@gmail.com',
        password: 'password123',
        role: 'trainer',
        location: 'Hyderabad, Telangana',
        phone: '+91-5555444455',
        bio: 'Java Expert, Ex-Amazon, specialized in microservices and system design. 14+ years experience',
        isEmailVerified: true,
        company: 'Core Java Institute',
        skills: ['Java', 'Spring Boot', 'Microservices', 'System Design', 'Database Design'],
      },
    ]);

    console.log(' Created 5 trainers');

    // Create student users (Indian names)
    const students = await User.create([
      {
        name: 'Arjun Mehta',
        email: 'arjun.mehta@student.com',
        password: 'password123',
        role: 'student',
        location: 'Delhi, NCR',
        phone: '+91-9988776655',
        bio: 'B.Tech Computer Science student, passionate about coding',
        isEmailVerified: true,
        skills: ['JavaScript', 'React', 'Node.js', 'MongoDB'],
      },
      {
        name: 'Sneha Iyer',
        email: 'sneha.iyer@student.com',
        password: 'password123',
        role: 'student',
        location: 'Bangalore, Karnataka',
        phone: '+91-8877665544',
        bio: 'Final year Computer Science student, loves web development',
        isEmailVerified: true,
        skills: ['Python', 'Django', 'React', 'PostgreSQL'],
      },
      {
        name: 'Rahul Chopra',
        email: 'rahul.chopra@student.com',
        password: 'password123',
        role: 'student',
        location: 'Gurugram, Haryana',
        phone: '+91-7766554433',
        bio: 'Third year B.Tech, interested in Data Science',
        isEmailVerified: true,
        skills: ['Python', 'Machine Learning', 'Data Analysis', 'TensorFlow'],
      },
      {
        name: 'Pooja Saxena',
        email: 'pooja.saxena@student.com',
        password: 'password123',
        role: 'student',
        location: 'Mumbai, Maharashtra',
        phone: '+91-6655443322',
        bio: 'Commerce graduate, looking for business analyst roles',
        isEmailVerified: true,
        skills: ['Excel', 'SQL', 'Data Analysis', 'Business Intelligence'],
      },
      {
        name: 'Nikhil Joshi',
        email: 'nikhil.joshi@student.com',
        password: 'password123',
        role: 'student',
        location: 'Pune, Maharashtra',
        phone: '+91-5544332211',
        bio: 'BCA graduate, passionate about cloud computing',
        isEmailVerified: true,
        skills: ['AWS', 'Azure', 'Docker', 'Kubernetes', 'Linux'],
      },
      {
        name: 'Kavya Nair',
        email: 'kavya.nair@student.com',
        password: 'password123',
        role: 'student',
        location: 'Hyderabad, Telangana',
        phone: '+91-4433221100',
        bio: 'Software engineering student, interested in full-stack development',
        isEmailVerified: true,
        skills: ['Java', 'Spring Boot', 'React', 'MySQL'],
      },
      {
        name: 'Aditya Singh',
        email: 'aditya.singh@student.com',
        password: 'password123',
        role: 'student',
        location: 'Delhi, NCR',
        phone: '+91-9912345678',
        bio: 'Second year B.Tech, interested in web development and mobile apps',
        isEmailVerified: true,
        skills: ['JavaScript', 'React Native', 'Firebase', 'Figma'],
      },
      {
        name: 'Divya Reddy',
        email: 'divya.reddy@student.com',
        password: 'password123',
        role: 'student',
        location: 'Hyderabad, Telangana',
        phone: '+91-9823456789',
        bio: 'Computer Science student with interest in AI and robotics',
        isEmailVerified: true,
        skills: ['Python', 'C++', 'ROS', 'Computer Vision', 'OpenCV'],
      },
      {
        name: 'Ravi Kumar',
        email: 'ravi.kumar@student.com',
        password: 'password123',
        role: 'student',
        location: 'Bangalore, Karnataka',
        phone: '+91-9734567890',
        bio: 'BCA student, passionate about backend development and APIs',
        isEmailVerified: true,
        skills: ['Node.js', 'Express.js', 'PostgreSQL', 'REST APIs'],
      },
      {
        name: 'Neha Gupta',
        email: 'neha.gupta@student.com',
        password: 'password123',
        role: 'student',
        location: 'Mumbai, Maharashtra',
        phone: '+91-8645678901',
        bio: 'IT graduate, looking for DevOps and cloud infrastructure roles',
        isEmailVerified: true,
        skills: ['Linux', 'Docker', 'Jenkins', 'Terraform', 'AWS'],
      },
    ]);

    console.log(' Created 6 students');

    // Create job postings
    const jobs = await Job.create([
      {
        title: 'Senior Software Engineer - Full Stack',
        description: 'Looking for an experienced full-stack developer to join our growing team. You will work on our main platform built with React and Node.js.',
        company: 'Tata Consultancy Services (TCS)',
        location: 'Gurugram, Haryana',
        salary: { min: 800000, max: 1200000, currency: 'INR' },
        jobType: 'Full-time',
        experience: 'Senior',
        skills: ['React', 'Node.js', 'MongoDB', 'TypeScript', 'Docker'],
        requirements: ['5+ years experience', 'BS in Computer Science or related field', 'Experience with microservices'],
        benefits: ['Health Insurance', 'Stock Options', 'Remote Work', 'Learning Budget'],
        recruiter: recruiters[0]._id,
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
      {
        title: 'Junior Developer - Python',
        description: 'Join our development team and work on backend services using Python and Django. Great opportunity for freshers and early-career developers.',
        company: 'Infosys',
        location: 'Bangalore, Karnataka',
        salary: { min: 300000, max: 500000, currency: 'INR' },
        jobType: 'Full-time',
        experience: 'Entry Level',
        skills: ['Python', 'Django', 'SQL', 'Git'],
        requirements: ['0-2 years experience', 'Knowledge of Python', 'Problem-solving skills'],
        benefits: ['Training Programs', 'Health Insurance', 'Flexible Hours', 'Career Growth'],
        recruiter: recruiters[1]._id,
        deadline: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
      },
      {
        title: 'Data Scientist',
        description: 'We are looking for a talented data scientist to work on AI/ML projects. Analyze large datasets and build predictive models.',
        company: 'Wipro',
        location: 'Pune, Maharashtra',
        salary: { min: 700000, max: 1000000, currency: 'INR' },
        jobType: 'Full-time',
        experience: 'Mid Level',
        skills: ['Python', 'Machine Learning', 'TensorFlow', 'SQL', 'Statistics'],
        requirements: ['3-5 years experience', 'Masters in CS or Statistics', 'Experience with ML frameworks'],
        benefits: ['Competitive Salary', 'Health Insurance', 'Research Opportunities', 'International Projects'],
        recruiter: recruiters[2]._id,
        deadline: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000),
      },
      {
        title: 'AWS Cloud Architect',
        description: 'Design and implement cloud solutions using AWS. We need an experienced cloud architect to lead our infrastructure team.',
        company: 'Amazon India',
        location: 'Bangalore, Karnataka',
        salary: { min: 1200000, max: 1800000, currency: 'INR' },
        jobType: 'Full-time',
        experience: 'Senior',
        skills: ['AWS', 'Docker', 'Kubernetes', 'Terraform', 'CI/CD'],
        requirements: ['6+ years AWS experience', 'AWS Solutions Architect certification', 'Leadership experience'],
        benefits: ['Premium Health Insurance', 'Stock Options', 'Gym Membership', 'Work from Home'],
        recruiter: recruiters[3]._id,
        deadline: new Date(Date.now() + 40 * 24 * 60 * 60 * 1000),
      },
      {
        title: 'Frontend Engineer - React',
        description: 'Build beautiful and responsive user interfaces using React. Collaborate with our design and backend teams at Flipkart.',
        company: 'Flipkart',
        location: 'Bangalore, Karnataka',
        salary: { min: 600000, max: 900000, currency: 'INR' },
        jobType: 'Full-time',
        experience: 'Mid Level',
        skills: ['React', 'JavaScript', 'CSS', 'Redux', 'Testing'],
        requirements: ['2-4 years React experience', 'Strong CSS knowledge', 'Experience with state management'],
        benefits: ['Performance Bonus', 'Health Insurance', 'Free Lunch', 'Learning Resources'],
        recruiter: recruiters[4]._id,
        deadline: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000),
      },
      {
        title: 'Software Engineer - Java',
        description: 'Join Google India and work on large-scale distributed systems using Java. Be part of a team making technology accessible to billions.',
        company: 'Google India',
        location: 'Hyderabad, Telangana',
        salary: { min: 900000, max: 1400000, currency: 'INR' },
        jobType: 'Full-time',
        experience: 'Mid Level',
        skills: ['Java', 'Distributed Systems', 'SQL', 'Algorithms'],
        requirements: ['2-4 years Java experience', 'Strong algorithms knowledge', 'Problem-solving aptitude'],
        benefits: ['Unlimited Snacks', 'Medical Insurance', 'Commute Benefit', 'Professional Development'],
        recruiter: recruiters[5]._id,
        deadline: new Date(Date.now() + 32 * 24 * 60 * 60 * 1000),
      },
      {
        title: 'Business Analyst',
        description: 'Analyze business requirements and translate them to technical specifications at Microsoft India. Great for career growth.',
        company: 'Microsoft India',
        location: 'Delhi, NCR',
        salary: { min: 500000, max: 750000, currency: 'INR' },
        jobType: 'Full-time',
        experience: 'Entry Level',
        skills: ['SQL', 'Excel', 'Business Analysis', 'Communication'],
        requirements: ['0-2 years experience', 'Strong analytical skills', 'Good communication'],
        benefits: ['Health Insurance', 'Learning Programs', 'Mentorship', 'Work-life Balance'],
        recruiter: recruiters[6]._id,
        deadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
      },
      {
        title: 'Consultant - Digital Transformation',
        description: 'Help enterprises transform their business using technology. Work on end-to-end consulting projects at Accenture.',
        company: 'Accenture India',
        location: 'Mumbai, Maharashtra',
        salary: { min: 700000, max: 1100000, currency: 'INR' },
        jobType: 'Full-time',
        experience: 'Mid Level',
        skills: ['Business Analysis', 'Project Management', 'Cloud Technology', 'Communication'],
        requirements: ['2-4 years consulting experience', 'Client-facing skills', 'Industry knowledge'],
        benefits: ['Performance Bonus', 'International Travel', 'Health Insurance', 'Career Progression'],
        recruiter: recruiters[7]._id,
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
      {
        title: 'Internship - Web Development',
        description: 'Join our summer internship program and work on real projects. Perfect for students wanting to gain practical experience.',
        company: 'Tata Consultancy Services (TCS)',
        location: 'Gurugram, Haryana',
        salary: { min: 15000, max: 25000, currency: 'INR' },
        jobType: 'Internship',
        experience: 'Entry Level',
        skills: ['HTML', 'CSS', 'JavaScript', 'React basics'],
        requirements: ['Currently enrolled in B.Tech', 'Basic web development knowledge', 'Strong learning attitude'],
        benefits: ['Certificate', 'Letter of Recommendation', 'Mentorship', 'Potential Full-time Offer'],
        recruiter: recruiters[0]._id,
        deadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
      },
      {
        title: 'Product Manager - B2B SaaS',
        description: 'Lead product strategy for our B2B SaaS platform. Oversee roadmap, user research, and cross-functional collaboration.',
        company: 'Infosys',
        location: 'Bangalore, Karnataka',
        salary: { min: 1000000, max: 1500000, currency: 'INR' },
        jobType: 'Full-time',
        experience: 'Senior',
        skills: ['Product Management', 'Analytics', 'Agile', 'Communication'],
        requirements: ['5+ years PM experience', 'SaaS background', 'Data-driven mindset'],
        benefits: ['Executive Health Insurance', 'Stock Options', 'Flexible Hours', 'Quarterly Bonuses'],
        recruiter: recruiters[1]._id,
        deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
      },
    ]);

    console.log(' Created 10 job postings');

    // Create sample saved jobs for students
    await User.updateOne({ email: 'arjun.mehta@student.com' }, { $set: { savedJobs: [jobs[0]._id, jobs[4]._id] } });

    // Create sample application: Arjun applies to job 0
    const arjun = await User.findOne({ email: 'arjun.mehta@student.com' });
    if (arjun) {
      const existing = await Application.findOne({ job: jobs[0]._id, applicant: arjun._id });
      if (!existing) {
        const app = await Application.create({ job: jobs[0]._id, applicant: arjun._id, resume: 'demo_resume.pdf', coverLetter: 'Excited to apply', skills: ['React', 'Node.js'] });
        jobs[0].applications.push(app._id);
        jobs[0].applicantCount = (jobs[0].applicantCount || 0) + 1;
        await jobs[0].save();
        // Notification for recruiter
        await Notification.create({ user: jobs[0].recruiter, type: 'Application', title: 'New application', message: `${arjun.name} applied for ${jobs[0].title}`, relatedApplication: app._id, relatedJob: jobs[0]._id, relatedUser: arjun._id });
      }
    }

    // Create sample connection and messages between Arjun and a recruiter
    const rajesh = await User.findOne({ email: 'rajesh@tcs.com' });
    if (arjun && rajesh) {
      try {
        await Connection.create({ sender: arjun._id, receiver: rajesh._id, status: 'Accepted', message: 'Hi Rajesh, would love to connect' });
      } catch (e) {
        // ignore duplicate connection
      }
      try {
        await Message.create({ sender: rajesh._id, receiver: arjun._id, content: 'Thanks for connecting, Arjun. We saw your application.' });
      } catch (e) {}
      await Notification.create({ user: arjun._id, type: 'Connection', title: 'Connection accepted', message: `${rajesh.name} accepted your connection request`, relatedUser: rajesh._id });
    }

    console.log('\n Seed Data Summary:');
    console.log('   ✅ 8 Recruiters from Indian companies');
    console.log('      Emails: rajesh@tcs.com, priya@infosys.com, amit@wipro.com, deepak@amazon.com,');
    console.log('              neha@flipkart.com, sanjay@google.com, anjali@microsoft.com, vikram@accenture.com');
    console.log('      Password: password123');
    console.log('');
    console.log('   ✅ 5 Trainers from Training Institutes');
    console.log('      Emails: mahesh.trainer@gmail.com, priya.trainer@gmail.com, rohit.trainer@gmail.com,');
    console.log('              anjali.trainer@gmail.com, vikram.trainer@gmail.com');
    console.log('      Password: password123');
    console.log('');
    console.log('   ✅ 10 Student users with diverse skill sets');
    console.log('      Emails: arjun.mehta@student.com, sneha.iyer@student.com, rahul.chopra@student.com,');
    console.log('              pooja.saxena@student.com, nikhil.joshi@student.com, kavya.nair@student.com,');
    console.log('              aditya.singh@student.com, divya.reddy@student.com, ravi.kumar@student.com,');
    console.log('              neha.gupta@student.com');
    console.log('      Password: password123');
    console.log('');
    console.log('   ✅ 10 Job postings across India');
    console.log('   ✅ Locations: Gurugram, Delhi, Mumbai, Bangalore, Hyderabad, Pune');
    console.log('');
    console.log('Total Demo Accounts Created:');
    console.log('   - Recruiters: 8');
    console.log('   - Trainers: 5');
    console.log('   - Students: 10');
    console.log('   - Total Users: 23 accounts');
    console.log('\n Database seeding completed successfully!');

    mongoose.connection.close();
  } catch (error) {
    console.error(' Seeding Error:', error);
    mongoose.connection.close();
    process.exit(1);
  }
};

seedDatabase();

