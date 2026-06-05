import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { generateOTP, getOTPExpiry, sendOTPEmail, verifyOTP } from '../utils/otpUtils.js';

const generateToken = (id) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET environment variable is not set. This is required for token generation.');
  }
  return jwt.sign({ id }, secret, {
    expiresIn: '30d',
  });
};

// Step 1: Send OTP to email during registration
export const registerSendOTP = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    // Check if user already exists and is verified
    let user = await User.findOne({ email });
    if (user && user.isEmailVerified) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Generate OTP
    const otp = generateOTP();
    const otpExpiry = getOTPExpiry();

    // If user exists but not verified, update; otherwise create new unverified user
    if (user) {
      user.name = name;
      user.password = password;
      user.role = role || 'student';
      user.otpCode = otp;
      user.otpExpiry = otpExpiry;
      user.isEmailVerified = false;
      await user.save();
    } else {
      user = new User({
        name,
        email,
        password,
        role: role || 'student',
        otpCode: otp,
        otpExpiry,
        isEmailVerified: false,
      });
      await user.save();
    }

    console.log(`[Auth] OTP generated for ${email}: ${otp}`);

    // Send OTP to email
    let emailSendResult = null;
    try {
      console.log(`[Auth] Attempting to send OTP to ${email}...`);
      emailSendResult = await sendOTPEmail(email, otp);
      if (emailSendResult.success) {
        console.log(`[Auth]  OTP email sent successfully to ${email}`);
      } else {
        console.warn(`[Auth]   Email sending skipped: ${emailSendResult.message}`);
      }
    } catch (emailError) {
      console.error('[Auth]  Email sending error:', emailError.message);
      console.error('[Auth] Full error:', emailError);
      // Don't return error here - OTP is still generated for development/testing
    }

    res.status(200).json({
      success: true,
      message: 'OTP sent to your email. Please verify to complete registration.',
      email: email,
      otpForTesting: process.env.NODE_ENV === 'development' ? otp : undefined,
      emailStatus: emailSendResult?.trialMode ? 'trial_mode_otp_in_response' : 'sent',
      resendConfig: process.env.NODE_ENV === 'development' ? {
        senderEmail: process.env.SENDER_EMAIL,
        resendApiKeyConfigured: !!process.env.RESEND_API_KEY,
        apiKeyPreview: process.env.RESEND_API_KEY?.substring(0, 15) + '...',
      } : undefined,
    });
  } catch (error) {
    console.error('[Auth]  Registration error:', error.message);
    console.error('[Auth] Full error:', error);
    res.status(500).json({ message: 'Registration failed: ' + error.message });
  }
};

// Step 2: Verify OTP and complete registration
export const verifyOTPAndRegister = async (req, res) => {
  try {
    const { email, otp } = req.body;
    
    if (!email || !otp) {
      return res.status(400).json({ message: 'Please provide email and OTP' });
    }

    const user = await User.findOne({ email }).select('+otpCode +otpExpiry');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found. Please register first.' });
    }

    // Verify OTP
    const otpVerification = verifyOTP(user.otpCode, otp, user.otpExpiry);
    
    if (!otpVerification.valid) {
      return res.status(400).json({ message: otpVerification.message });
    }

    // Mark email as verified and clear OTP
    user.isEmailVerified = true;
    user.otpCode = undefined;
    user.otpExpiry = undefined;
    await user.save();

    // Generate token
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: 'Email verified successfully. Registration complete!',
      token,
      user: user.toJSON(),
    });
  } catch (error) {
    console.error('OTP verification error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Resend OTP
export const resendOTP = async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ message: 'Please provide email' });
    }

    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({ message: 'Email already verified' });
    }

    // Generate new OTP
    const otp = generateOTP();
    const otpExpiry = getOTPExpiry();

    user.otpCode = otp;
    user.otpExpiry = otpExpiry;
    await user.save();

    // Send OTP to email
    try {
      await sendOTPEmail(email, otp);
    } catch (emailError) {
      console.error('Email sending error:', emailError);
      return res.status(500).json({ 
        message: 'Failed to send OTP email',
        error: emailError.message 
      });
    }

    res.status(200).json({
      success: true,
      message: 'New OTP sent to your email',
    });
  } catch (error) {
    console.error('Resend OTP error:', error);
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }
    
    let user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (!user.isEmailVerified) {
      return res.status(403).json({ message: 'Please verify your email first' });
    }
    
    const isPasswordMatch = await user.comparePassword(password);
    
    if (!isPasswordMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    const token = generateToken(user._id);
    
    res.status(200).json({
      success: true,
      token,
      user: user.toJSON(),
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: error.message });
  }
};

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { name, bio, phone, location, company, skills } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        name: name || req.user.name,
        bio: bio || req.user.bio,
        phone: phone || req.user.phone,
        location: location || req.user.location,
        company: company || req.user.company,
        skills: skills || req.user.skills,
        updatedAt: new Date(),
      },
      { new: true }
    );
    
    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const logout = (req, res) => {
  res.status(200).json({ success: true, message: 'Logged out successfully' });
};

// Forgot Password - Step 1: Send OTP to email
export const forgotPasswordSendOTP = async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ message: 'Please provide email' });
    }

    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found. Please register first.' });
    }

    // Generate OTP
    const otp = generateOTP();
    const otpExpiry = getOTPExpiry();

    // Store OTP and expiry for password reset verification
    user.resetOTP = otp;
    user.resetOTPExpiry = otpExpiry;
    await user.save();

    console.log(`[Auth] Forgot password OTP generated for ${email}: ${otp}`);

    // Send OTP to email
    let emailSendResult = null;
    try {
      console.log(`[Auth] Attempting to send reset OTP to ${email}...`);
      emailSendResult = await sendOTPEmail(email, otp, 'password_reset');
      if (emailSendResult.success) {
        console.log(`[Auth]  Reset OTP email sent successfully to ${email}`);
      } else {
        console.warn(`[Auth]   Email sending skipped: ${emailSendResult.message}`);
      }
    } catch (emailError) {
      console.error('[Auth]  Email sending error:', emailError.message);
    }

    res.status(200).json({
      success: true,
      message: 'OTP sent to your email. Please check your inbox.',
      email: email,
      otpForTesting: process.env.NODE_ENV === 'development' ? otp : undefined,
      emailStatus: emailSendResult?.trialMode ? 'trial_mode_otp_in_response' : 'sent',
    });
  } catch (error) {
    console.error('[Auth]  Forgot password error:', error.message);
    res.status(500).json({ message: 'Error processing request: ' + error.message });
  }
};

// Forgot Password - Step 2: Verify OTP and Reset Password
export const verifyOTPAndResetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    
    console.log(`[Auth] Password reset request received for: ${email}`);
    console.log(`[Auth] Received fields - email: ${!!email}, otp: ${!!otp}, newPassword: ${!!newPassword}`);
    
    if (!email || !otp || !newPassword) {
      console.warn(`[Auth] Missing fields - email: ${email}, otp: ${otp}, newPassword: ${newPassword}`);
      return res.status(400).json({ message: 'Please provide email, OTP, and new password' });
    }

    const user = await User.findOne({ email }).select('+resetOTP +resetOTPExpiry');
    
    if (!user) {
      console.warn(`[Auth] User not found for password reset: ${email}`);
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify OTP
    if (!user.resetOTP || user.resetOTP !== otp) {
      console.warn(`[Auth] Invalid OTP for ${email}. Stored: ${user.resetOTP}, Provided: ${otp}`);
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    if (new Date() > user.resetOTPExpiry) {
      console.warn(`[Auth] OTP expired for ${email}. Expiry: ${user.resetOTPExpiry}`);
      return res.status(400).json({ message: 'OTP has expired. Please request a new one.' });
    }

    // Update password
    user.password = newPassword;
    user.resetOTP = undefined;
    user.resetOTPExpiry = undefined;
    await user.save();

    console.log(`[Auth]  Password reset successfully for ${email}`);

    res.status(200).json({
      success: true,
      message: 'Password reset successfully. Please login with your new password.',
    });
  } catch (error) {
    console.error('[Auth]  Password reset error:', error);
    res.status(500).json({ message: 'Error resetting password: ' + error.message });
  }
};


