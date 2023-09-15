const nodemailer = require('nodemailer');

const wastelessMail='wasteless.egy@gmail.com';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'wasteless.egy@gmail.com',
      pass: 'ytgktmueviluwnqo',
    },
  });
  
  const sendRegistrationPendingEmail = async (email,user) => {
    const mailOptions = {
      from: wastelessMail,
      to: email,
      subject: 'Registration Pending - Wasteless App',
      text: `Dear ${user},\n\nThank you for registering with Wasteless App. Your registration is currently pending review. We are verifying the information you provided to ensure its validity and correctness.\n\nOnce your registration is approved, we will notify you via email with further instructions.\n\nThank you for your patience.\n\nBest regards,\nThe Wasteless App Team`,
    };
  
    try {
      const info = await transporter.sendMail(mailOptions);
      console.log('Email sent: ', info.messageId);
    } catch (error) {
      console.error('Error sending registration pending email:', error);
    }
  };

  const sendApprovalEmail = async (email,user) => {
    try {
      // Compose the email message
      const mailOptions = {
        from: wastelessMail,
        to: email,
        subject: 'Registration Approved - Wasteless App',
        text:`Dear ${user},\n\nCongratulations! Your registration with Wasteless App has been approved. You can now log in to your account and start using our services.\n\nThank you for joining Wasteless App!\n\nBest regards,\nThe Wasteless App Team`,
      };
  
      // Send the email
      const info = await transporter.sendMail(mailOptions);
      console.log('Email sent: ', info.messageId);
    } catch (error) {
      console.log('Error sending email: ', error);
    }
  };
  
  const sendRejectionEmail = async (email,user) => {
    try {
      // Compose the email message
      const mailOptions = {
        from: wastelessMail,
        to: email,
        subject: 'Registration Rejected - Wasteless App',
        text: `Dear ${user},\n\nWe regret to inform you that your registration with Wasteless App has been rejected. Unfortunately, we were unable to verify the information provided or it did not meet our criteria.\n\nThank you for your interest in Wasteless App.\n\nBest regards,\nThe Wasteless App Team`,
      };
  
      // Send the email
      const info = await transporter.sendMail(mailOptions);
      console.log('Email sent: ', info.messageId);
    } catch (error) {
      console.log('Error sending email: ', error);
    }
  };


  const sendPasswordResetEmail = async (email, resetToken,user) => {
    const resetUrl = `http://localhost:3000/resetPassword?token=${resetToken}`;
  
    try {
      // Compose the email message
      const mailOptions = {
        from: wastelessMail,
        to: email,
        subject: 'Password Reset -  Wasteless App',
        text: `Dear ${user},\n\nWe have received a request to reset your password. Please click on the following link to reset your password:\n\n${resetUrl}\n\nIf you didn't request this, please ignore this email and your password will remain unchanged.\n\nBest regards,\nThe Wasteless App Team`,
      };
  
      // Send the email
      const info = await transporter.sendMail(mailOptions);
      console.log('Password reset email sent: ', info.messageId);
    } catch (error) {
      console.log('Error sending password reset email: ', error);
    }
  };

  module.exports = {
    sendRegistrationPendingEmail,
    sendApprovalEmail,
    sendRejectionEmail,
    sendPasswordResetEmail
  };