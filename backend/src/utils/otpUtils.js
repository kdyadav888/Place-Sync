import { Resend } from 'resend';

// Generate a 6-digit OTP
export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Calculate OTP expiry time (15 minutes from now)
export const getOTPExpiry = () => {
  const now = new Date();
  return new Date(now.getTime() + 15 * 60 * 1000);
};

// Send OTP via email using Resend
export const sendOTPEmail = async (email, otp, type = 'registration') => {
  try {
    // Check if Resend API key is configured
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey || apiKey === 'your_resend_api_key') {
      console.warn('[OTP] Resend API key not configured. OTP:', otp);
      return { success: true, message: 'OTP generated (email sending disabled)' };
    }

    console.log('[OTP] Initializing Resend with API key:', apiKey.substring(0, 10) + '...');
    const resend = new Resend(apiKey);

    const senderEmail = process.env.SENDER_EMAIL || 'onboarding@resend.dev';
    console.log('[OTP] Sending from:', senderEmail, 'To:', email);

    const emailSubject = type === 'password_reset' 
      ? 'PlaceSync - Password Reset OTP'
      : 'PlaceSync - Email Verification OTP';

    const emailTitle = type === 'password_reset'
      ? 'Password Reset'
      : 'Email Verification';

    const emailMessage = type === 'password_reset'
      ? 'Your OTP for password reset is:'
      : 'Your OTP for email verification is:';

    const result = await resend.emails.send({
      from: senderEmail,
      to: email,
      subject: emailSubject,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #1a9b8a 0%, #0d7e5e 100%); padding: 20px; border-radius: 8px 8px 0 0;">
            <h2 style="color: white; margin: 0;">PlaceSync</h2>
          </div>
          <div style="background: #f9f9f9; padding: 40px; border-radius: 0 0 8px 8px;">
            <h2 style="color: #333; margin-bottom: 10px;">${emailTitle}</h2>
            <p style="color: #666; font-size: 16px; margin-bottom: ${type === 'password_reset' ? '20px' : '20px'};">${type === 'password_reset' ? 'We received a request to reset your password.' : 'Welcome to PlaceSync!'}</p>
            <p style="color: #666; font-size: 16px; margin-bottom: 30px;">${emailMessage}</p>
            <div style="background: #1a9b8a; padding: 20px; border-radius: 8px; text-align: center; margin-bottom: 30px;">
              <h3 style="color: white; font-size: 32px; letter-spacing: 8px; margin: 0; font-family: 'Courier New', monospace;">${otp}</h3>
            </div>
            <p style="color: #666; font-size: 14px; margin-bottom: 10px;">This OTP will expire in 15 minutes.</p>
            <p style="color: #999; font-size: 14px; margin-bottom: 30px;">If you didn't request this, please ignore this email.</p>
            <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
            <p style="color: #999; font-size: 12px; text-align: center; margin: 0;">PlaceSync - Professional Networking Platform</p>
          </div>
        </div>
      `,
    });

    if (result.error) {
      console.error('[OTP] Resend API error:', result.error);
      console.error('[OTP] Full error details:', JSON.stringify(result.error, null, 2));
      console.warn('[OTP]   Resend trial mode limitation detected. Development mode - OTP returned in response.');
      // In trial mode, allow registration to proceed - OTP will be shown in response
      return { 
        success: true, 
        message: 'OTP generated (email sending disabled in trial mode)', 
        trialMode: true,
        warning: result.error.message 
      };
    }

    console.log(`[OTP]  Email sent successfully to ${email}. Message ID: ${result.data?.id}`);
    return { success: true, message: 'OTP sent successfully', id: result.data?.id };
  } catch (error) {
    console.error('[OTP]  Error sending email:', error.message);
    console.error('[OTP] Full error:', error);
    throw error;
  }
};

// Verify OTP
export const verifyOTP = (storedOTP, providedOTP, otpExpiry) => {
  if (!storedOTP || !providedOTP) {
    return { valid: false, message: 'OTP is missing' };
  }

  if (new Date() > otpExpiry) {
    return { valid: false, message: 'OTP has expired' };
  }

  if (storedOTP !== providedOTP) {
    return { valid: false, message: 'Invalid OTP' };
  }

  return { valid: true, message: 'OTP verified successfully' };
};

