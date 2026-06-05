import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create uploads directories if they don't exist
const resumesDir = path.join(__dirname, '../../uploads/resumes');
const avatarsDir = path.join(__dirname, '../../uploads/avatars');

if (!fs.existsSync(resumesDir)) {
  fs.mkdirSync(resumesDir, { recursive: true });
}

if (!fs.existsSync(avatarsDir)) {
  fs.mkdirSync(avatarsDir, { recursive: true });
}

// Configure storage for resumes
const resumeStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, resumesDir);
  },
  filename: (req, file, cb) => {
    const userId = req.user?._id || 'unknown';
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext);
    cb(null, `${userId}_${uniqueSuffix}${ext}`);
  },
});

// Configure storage for avatars
const avatarStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, avatarsDir);
  },
  filename: (req, file, cb) => {
    const userId = req.user?._id || 'unknown';
    const ext = path.extname(file.originalname);
    cb(null, `${userId}_avatar${ext}`);
  },
});

// File filter for resumes
const resumeFileFilter = (req, file, cb) => {
  const allowedMimes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ];

  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only PDF and Word documents are allowed'), false);
  }
};

// File filter for avatars
const avatarFileFilter = (req, file, cb) => {
  const allowedMimes = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
  ];

  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed (JPG, PNG, GIF, WebP)'), false);
  }
};

// Create multer upload instances
export const uploadResume = multer({
  storage: resumeStorage,
  fileFilter: resumeFileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});

export const uploadAvatar = multer({
  storage: avatarStorage,
  fileFilter: avatarFileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});

// Combined upload for both avatar and resume
export const uploadBoth = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      if (file.fieldname === 'avatar') {
        cb(null, avatarsDir);
      } else if (file.fieldname === 'resume') {
        cb(null, resumesDir);
      }
    },
    filename: (req, file, cb) => {
      const userId = req.user?._id || 'unknown';
      const ext = path.extname(file.originalname);
      
      if (file.fieldname === 'avatar') {
        cb(null, `${userId}_avatar${ext}`);
      } else if (file.fieldname === 'resume') {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, `${userId}_${uniqueSuffix}${ext}`);
      }
    },
  }),
  fileFilter: (req, file, cb) => {
    if (file.fieldname === 'avatar') {
      avatarFileFilter(req, file, cb);
    } else if (file.fieldname === 'resume') {
      resumeFileFilter(req, file, cb);
    } else {
      cb(new Error('Invalid field name'), false);
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
}).fields([
  { name: 'avatar', maxCount: 1 },
  { name: 'resume', maxCount: 1 },
]);

// Middleware to handle upload errors
export const handleUploadError = (err, req, res, next) => {
  // This is an error-handling middleware (4 parameters)
  if (!err) {
    return next();
  }
  
  if (err instanceof multer.MulterError) {
    if (err.code === 'FILE_TOO_LARGE') {
      return res.status(400).json({
        success: false,
        message: 'File size must be less than 5MB',
      });
    }
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File size must be less than 5MB',
      });
    }
    return res.status(400).json({
      success: false,
      message: err.message || 'File upload error',
    });
  } else if (err) {
    return res.status(400).json({
      success: false,
      message: err.message || 'File upload error',
    });
  }
  
  next();
};

export default uploadResume;
