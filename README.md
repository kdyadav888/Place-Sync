<<<<<<< HEAD
# PlaceSync

A comprehensive training institute and recruitment platform connecting students, trainers, and recruiters for seamless job placement and skill development.

## 🎯 Overview

PlaceSync is an innovative web application designed to bridge the gap between educational institutions, students, trainers, and recruiters. The platform streamlines the entire journey from student skill development to job placement through real-time collaboration, job postings, interview scheduling, and comprehensive analytics.

## ✨ Key Features

- **👨‍🎓 Student Portal**
  - Browse and apply for jobs
  - Enroll in training courses
  - Track application status in real-time
  - Connect with recruiters and trainers
  - View interview schedules
  - Download certificates

- **💼 Recruiter Dashboard**
  - Post job openings
  - Review and manage applications
  - Schedule and conduct interviews
  - View detailed analytics and metrics
  - Search and filter candidates

- **👨‍🏫 Trainer Management**
  - Create and manage courses
  - Assign students to training programs
  - Track student progress
  - Issue certificates
  - Direct communication with students

- **📧 Real-time Messaging**
  - Direct chat between users
  - Notification system
  - Message history

- **🔔 Notifications**
  - Job match alerts
  - Application status updates
  - Interview reminders
  - Course enrollment notifications

- **📊 Analytics Dashboard**
  - Comprehensive metrics for recruiters
  - Student placement statistics
  - Course enrollment analytics

- **🔐 Security**
  - JWT-based authentication
  - Role-based access control
  - Password hashing
  - Secure file uploads

## 🚀 Tech Stack

### Frontend
- **Framework**: React with Vite
- **Styling**: CSS3
- **State Management**: Context API
- **Routing**: React Router

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB
- **Authentication**: JWT
- **File Upload**: Multer

### Infrastructure
- File uploads for avatars and resumes
- RESTful API architecture

## 📂 Project Structure

```
place-sync/
├── backend/
│   ├── src/
│   │   ├── server.js           # Main entry point
│   │   ├── config/             # Configuration files
│   │   ├── controllers/        # Business logic
│   │   ├── models/             # Database schemas
│   │   ├── routes/             # API endpoints
│   │   ├── middleware/         # Custom middleware
│   │   └── utils/              # Helper functions
│   ├── scripts/                # Database scripts
│   └── uploads/                # User uploads
│
├── src/
│   ├── components/             # Reusable React components
│   ├── pages/                  # Page components
│   ├── context/                # Context providers
│   ├── services/               # API services
│   ├── routes/                 # Route definitions
│   └── styles/                 # CSS stylesheets
│
├── public/                     # Static assets
└── README.md                   # This file
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- MongoDB (local or cloud)

### Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file with the following variables:
# MONGODB_URI=your_mongodb_connection_string
# JWT_SECRET=your_jwt_secret
# PORT=5000

# Seed demo data (if available)
npm run seed

# Start the backend server
npm start
```

The backend will run on `http://localhost:5000`

### Frontend Setup

```bash
# From the root directory
npm install

# Start the development server
npm run dev
```

The application will be available at `http://localhost:5173`

## 👥 Demo Accounts

### Students
```
arjun.mehta@student.com
sneha.iyer@student.com
rahul.chopra@student.com
pooja.saxena@student.com
nikhil.joshi@student.com
kavya.nair@student.com
aditya.singh@student.com
divya.reddy@student.com
ravi.kumar@student.com
neha.gupta@student.com
```

### Recruiters
```
rajesh@tcs.com
priya@infosys.com
amit@wipro.com
deepak@amazon.com
neha@flipkart.com
sanjay@google.com
anjali@microsoft.com
vikram@accenture.com
```

### Trainers
```
mahesh.trainer@gmail.com
priya.trainer@gmail.com
vikram.trainer@gmail.com
ravi.trainer@gmail.com
shalvi.trainer@gmail.com
```

### Admin
```
admin@placesync.com
```

**Default Password**: `password123`

## 🔑 Core Modules

### Authentication
- User registration and login
- JWT token management
- Password hashing with bcrypt
- Role-based access control

### Job Management
- Create job postings
- Search and filter jobs
- Apply for jobs
- Track applications

### Course Management
- Create training courses
- Enroll students
- Track progress
- Issue certificates

### Messaging
- Direct messaging between users
- Message notifications
- Conversation history

### Analytics
- Placement statistics
- Application metrics
- Course analytics

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Jobs
- `GET /api/jobs` - Get all jobs
- `POST /api/jobs` - Create job (recruiter only)
- `GET /api/jobs/:id` - Get job details
- `POST /api/applications` - Apply for job
- `GET /api/applications` - View applications

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update profile
- `GET /api/users/search` - Search users

### Messages
- `POST /api/messages` - Send message
- `GET /api/messages/:userId` - Get conversation
- `GET /api/messages` - Get all conversations

### Courses
- `GET /api/courses` - Get all courses
- `POST /api/courses` - Create course (trainer only)
- `POST /api/courses/:id/enroll` - Enroll in course
- `GET /api/courses/:id/progress` - Get course progress

## 🔒 Security Features

- **Authentication**: JWT tokens with expiration
- **Authorization**: Role-based access control
- **Password Security**: bcrypt hashing
- **Input Validation**: Request validation middleware
- **CORS**: Cross-origin resource sharing protection
- **File Upload**: Restriction to allowed file types and sizes

## 🚀 Deployment

### Build for Production

```bash
# Frontend build
npm run build

# Backend configuration
# Set NODE_ENV=production
# Update database connection string
# Set secure JWT secret
```

## 🤝 Contributing

1. Create a feature branch (`git checkout -b feature/YourFeature`)
2. Commit changes (`git commit -m 'Add YourFeature'`)
3. Push to branch (`git push origin feature/YourFeature`)
4. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 📞 Support

For issues, questions, or suggestions, please contact the development team.

---

**PlaceSync** - Connecting Education with Opportunities

Last Updated: June 2, 2026
=======
# place-sync
>>>>>>> 326fe39d9d797ddf147c6c37a62d5a33b3bf9e6e
