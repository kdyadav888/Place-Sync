import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/database.js';
import authRoutes from './routes/authRoutes.js';
import jobRoutes from './routes/jobRoutes.js';
import applicationRoutes from './routes/applicationRoutes.js';
import userRoutes from './routes/userRoutes.js';
import connectionRoutes from './routes/connectionRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import postRoutes from './routes/postRoutes.js';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Middleware
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      'http://localhost:5173',
      'http://localhost:5180',
      'http://localhost:5181',
      'http://localhost:5182',
      'http://localhost:5183',
      'http://localhost:5184',
      'http://localhost:5185',
      'http://localhost:5186',
      'http://localhost:5187',
      'http://localhost:5188',
      'http://localhost:5189',
      'http://localhost:5190',
      'http://127.0.0.1:5173',
      'http://127.0.0.1:5180',
      'http://127.0.0.1:5181',
      'http://127.0.0.1:5182',
      'http://127.0.0.1:5183',
      'http://127.0.0.1:5184',
      'http://127.0.0.1:5185',
      'http://127.0.0.1:5186',
      'http://127.0.0.1:5187',
      'http://127.0.0.1:5188',
      'http://127.0.0.1:5189',
      'http://127.0.0.1:5190',
    ];
    // Only add CORS_ORIGIN if it's defined
    if (process.env.CORS_ORIGIN && process.env.CORS_ORIGIN !== '') {
      allowedOrigins.push(process.env.CORS_ORIGIN);
    }
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn(`CORS rejected origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploads directory for resume downloads
const uploadsPath = path.join(__dirname, '..', 'uploads');
app.use('/uploads', express.static(uploadsPath));

// Connect to MongoDB
connectDB();

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/users', userRoutes);
app.use('/api/connections', connectionRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/posts', postRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running', timestamp: new Date() });
});

// Debug endpoint - test if Resend is working
app.get('/api/debug/test-email', async (req, res) => {
  try {
    console.log('[DEBUG] Test email endpoint called');
    const { Resend } = await import('resend');
    const resend = new Resend(process.env.RESEND_API_KEY);
    
    const result = await resend.emails.send({
      from: process.env.SENDER_EMAIL || 'onboarding@resend.dev',
      to: 'delivered@resend.dev',
      subject: 'Test from PlaceSync Backend',
      html: '<p>Test email from PlaceSync backend</p>',
    });
    
    res.json({ 
      success: true, 
      message: 'Test email sent',
      result: result,
      config: {
        apiKey: process.env.RESEND_API_KEY?.substring(0, 15) + '...',
        senderEmail: process.env.SENDER_EMAIL,
      }
    });
  } catch (error) {
    console.error('[DEBUG] Test email error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Test email failed',
      error: error.message 
    });
  }
});

// 404 Error handling
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({ 
    message: err.message || 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

// Start server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`PlaceSync Backend Server running on port ${PORT}`);
});

export default server;

