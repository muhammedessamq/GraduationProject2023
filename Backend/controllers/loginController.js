const Admin = require('../models/Admin');
const Donator = require('../models/Donator');
const NGO = require('../models/NGO');
const config = require('../util/config');
const { generateToken } = require('../util/config');
const crypto = require('crypto');
const {sendPasswordResetEmail} = require('../util/MailHandler');


const loginUser = async (request, response) => {
  const { email, username, password } = request.body;
  let user;

  try {
    // Check Donator collection for matching user
    user = await Donator.findOne({ $or: [{ email }, { username }], password });
    if (user && user.status === 'Approved') {
      // Generate a token and save it in the session
      const token = generateToken(user._id, request.session);

      response.json({ token, userType: user.userType });
      return;
    } else if (user && user.status === 'Pending') {
      response.send('Your Registration is Pending');
      return;
    }

    // Check NGO collection for matching user
    user = await NGO.findOne({ $or: [{ email }, { username }], password });
    if (user && user.status === 'Approved') {
      // Generate a token and save it in the session
      const token = generateToken(user._id, request.session);

      response.json({ token, userType: user.userType });
      return;
    } else if (user && user.status === 'Pending') {
      response.send('Your Registration is Pending');
      return;
    }

    // Check Admin collection for matching user
    user = await Admin.findOne({ $or: [{ email }, { username }], password });
    if (user) {
      // Generate a token and save it in the session
      const token = generateToken(user._id, request.session);
    
      response.json({ token , userType: 'Admin'});
      return;
    }

    // User not found in any collection
    response.status(404).send('Incorrect Username/Password');
  } catch (error) {
    console.log(error);
    response.status(500).send('Error finding user in database');
  }
};


const sendActivationMail = async (req, res) => {
  const { email } = req.body;

  try {
    const token = crypto.randomBytes(20).toString('hex');

    const donator = await Donator.findOne({ email });
    if (donator) {
      donator.resetPasswordToken = token;
      donator.resetPasswordExpires = Date.now() + 3600000; // Token expires in 1 hour
      await donator.save();
      // Send a password reset email
      await sendPasswordResetEmail(donator.email, token,donator.username);
      res.status(200).send('Password reset token has been sent to your email');
      return;
    }

    const ngo = await NGO.findOne({ email });
    if (ngo) {
      ngo.resetPasswordToken = token;
      ngo.resetPasswordExpires = Date.now() + 3600000; // Token expires in 1 hour
      await ngo.save();
      // Step 2: Send a password reset email
      await sendPasswordResetEmail(ngo.email, token,ngo.username);
      res.status(200).send('Password reset token has been sent to your email');
      return;
    }

    res.status(404).send('User not found');
  } catch (error) {
    console.log(error);
    res.status(500).send('Error generating reset token');
  }
};


const resetPassword = async (req, res) => {
  const { newPassword } = req.body;
  const token = req.query.token;

  try {
    let user = await Donator.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });
    if (user) {
      user.password = newPassword;
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save();
      res.status(200).send('Password reset successfully');
      return;
    }

    user = await NGO.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });
    if (user) {
      user.password = newPassword;
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save();
      res.status(200).send('Password reset successfully');
      return;
    }

    res.status(400).send('Invalid or expired token');
  } catch (error) {
    console.log(error);
    res.status(500).send('Error resetting password');
  }
};


module.exports = {
  loginUser,
  sendActivationMail,
  resetPassword,
};
