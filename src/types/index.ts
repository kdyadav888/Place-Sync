export interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'recruiter' | 'admin';
  avatar?: string;
  bio?: string;
  phone?: string;
  location?: string;
  company?: string;
  skills?: string[];
  experience?: Experience[];
  education?: Education[];
  savedJobs?: string[];
  connections?: string[];
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Experience {
  title: string;
  company: string;
  duration: string;
  description: string;
}

export interface Education {
  school: string;
  degree: string;
  field: string;
  year: string;
}

export interface Job {
  id: string;
  title: string;
  description: string;
  company: string;
  location: string;
  salary?: Salary;
  jobType: 'Full-time' | 'Part-time' | 'Contract' | 'Internship';
  experience: 'Entry Level' | 'Mid Level' | 'Senior' | 'Executive';
  skills?: string[];
  requirements?: string[];
  benefits?: string[];
  recruiter: string;
  applications?: string[];
  applicantCount?: number;
  isActive?: boolean;
  views?: number;
  savedBy?: string[];
  deadline?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Salary {
  min: number;
  max: number;
  currency?: string;
}

export interface Application {
  id: string;
  job: string | Job;
  applicant: string | User;
  status: 'Pending' | 'Reviewed' | 'Accepted' | 'Rejected' | 'Withdrawn';
  resume: string;
  coverLetter?: string;
  experience?: string;
  skills?: string[];
  rating?: number;
  feedback?: string;
  appliedAt?: string;
  reviewedAt?: string;
  updatedAt?: string;
}

export interface Connection {
  id: string;
  sender: string | User;
  receiver: string | User;
  status: 'Pending' | 'Accepted' | 'Rejected' | 'Blocked';
  message?: string;
  createdAt?: string;
  acceptedAt?: string;
  updatedAt?: string;
}

export interface Message {
  id: string;
  sender: string | User;
  receiver: string | User;
  content: string;
  attachments?: string[];
  isRead?: boolean;
  readAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Notification {
  id: string;
  user: string;
  type: 'Connection' | 'Application' | 'Message' | 'Job' | 'Profile';
  title: string;
  message?: string;
  relatedUser?: string;
  relatedJob?: string;
  relatedApplication?: string;
  isRead?: boolean;
  readAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Post {
  id: string;
  author: string | User;
  content: string;
  image?: string;
  likes?: string[];
  comments?: Comment[];
  shares?: number;
  visibility: 'Public' | 'Private' | 'Connections';
  createdAt?: string;
  updatedAt?: string;
}

export interface Comment {
  user: string | User;
  text: string;
  createdAt?: string;
}

export interface AuthResponse {
  success: boolean;
  token: string;
  user: User;
  message?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  page: number;
  pages: number;
  total: number;
  count: number;
}
