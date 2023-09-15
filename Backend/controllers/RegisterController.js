const validator = require('../util/RegisterationValidation');
const {sendRegistrationPendingEmail} = require('../util/MailHandler');
const upload = require('../util//multerConfig');


const Donator = require('../models/Donator');
const NGO = require('../models/NGO');
const Admin = require('../models/Admin');
const Notification = require('../models/Notification');

let donatorId;
let ngoId;
const registerUser = async (request, response) => {
  const valid = validator(request.body);

  if (!valid) {
    response.status(403).send('Forbidden Request');
    return;
  }

  const user = request.body;

  try {
    if (user.userType === 'Donator') {
      const existingUsername = await Donator.findOne({ username: user.username });
      const existingUsernameNGO = await NGO.findOne({ username: user.username });
      const existingEmail = await Donator.findOne({ email: user.email });
      const existingEmailNGO = await NGO.findOne({ email: user.email });

      if (existingUsername || existingUsernameNGO) {
        response.status(409).send('Username already exists');
        return;
      }

      if (existingEmail || existingEmailNGO ) {
        response.status(409).send('Email already exists');
        return;
      }

      const count = await Donator.countDocuments();
      user.donatorId = count + 1;
      donatorId =user.donatorId;
      user.status = 'Pending';

      const donator = await Donator.create(user);

      console.log('Donator added to database');
      response.status(201).send('Donator Successfully Registered');

      const notificationCount = await Notification.countDocuments();
      const notificationId = notificationCount + 1;

      const admin = await Admin.findOne();
      
      const donatorNotification = new Notification({
        notificationId: notificationId,
        body: `New donator ${donator.username} registered`,
        recipientId: admin._id,
        senderId: donator._id,
      });

      await donatorNotification.save();

      console.log('Notification added to database');

      // Send registration pending email to the user
      await sendRegistrationPendingEmail(user.email,donator.username);
      
    } else {
      const existingUsername = await NGO.findOne({ username: user.username });
      const existingUsernameDON = await Donator.findOne({ username: user.username });
      const existingEmail = await NGO.findOne({ email: user.email });
      const existingEmailNGO = await NGO.findOne({ email: user.email });

      if (existingUsername || existingUsernameDON) {
        response.status(409).send('Username already exists');
        return;
      }
      if (existingEmail || existingEmailNGO) {
        response.status(409).send('Email already exists');
        return;
      }

      const count = await NGO.countDocuments();
      user.ngoId = count + 1;
      ngoId= user.ngoId;
      user.status = 'Pending';

      const ngo = await NGO.create(user);

      console.log('NGO added to database');
      response.status(201).send('NGO Successfully Registered');

      const notificationCount = await Notification.countDocuments();
      const notificationId = notificationCount + 1;

      const admin = await Admin.findOne();
      const ngoNotification = new Notification({
        notificationId: notificationId,
        body: `New NGO ${ngo.username} registered`,
        recipientId: admin._id,
        senderId: ngo._id,
      });

      await ngoNotification.save();

      console.log('Notification added to database');

      // Send registration pending email to the user
      await sendRegistrationPendingEmail(user.email,ngo.username);
    }
  } catch (error) {
    console.log(error);
    response.status(500).send('Error registering user');
  }
};

const uploadImage = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      console.error(err);
      return res.status(400).json({ error: err.message });
    }
    try {
      // Save the image path or URL to the database
      const imagePath = req.file.path;

      // Check if the donator exists
      const donator = await Donator.findOneAndUpdate(
        { donatorId: donatorId },
        { taxIdImage: imagePath },
        { new: true }
      );

      // If the donator is not found, update the NGO document
      if (!donator) {
        const ngo = await NGO.findOneAndUpdate(
          { ngoId: ngoId },
          { taxIdImage: imagePath },
          { new: true }
        );

        if (!ngo) {
          return res.status(404).json({ error: 'Donator or NGO not found' });
        }
      }

      res.json({ message: 'Image uploaded successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred while updating the user document' });
    }
  });
};



module.exports = {
  registerUser,
  uploadImage
};
