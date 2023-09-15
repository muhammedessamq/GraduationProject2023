const Donator = require('../models/Donator');
const NGO = require('../models/NGO');
const Admin = require('../models/Admin');
const Notification = require('../models/Notification');

const {sendApprovalEmail} = require('../util/MailHandler');
const {sendRejectionEmail} = require('../util/MailHandler');

const getAllDonators = async (request, response) => {
  try {
    // Get all Donators from the database
    const allDonators = await Donator.find().exec();

    // Send the Donators back to the client
    response.json({ donators: allDonators });
  } catch (error) {
    console.log(error);
    response.status(500).send('Error retrieving data from the database');
  }
};

const getAllNGOs = async (request, response) => {
  try {
    // Get all NGOs from the database
    const allNGOs = await NGO.find().exec();

    // Send NGOs back to the client
    response.json({ NGOs: allNGOs });
  } catch (error) {
    console.log(error);
    response.status(500).send('Error retrieving data from the database');
  }
};

const getPendingDonators = async (request, response) => {
  try {
    // Get all Donators with status equal to "Pending" from the database
    const pendingDonators = await Donator.find({ status: 'Pending' }).exec();

    // Send the pending Donators back to the client
    response.json({ donators: pendingDonators });
  } catch (error) {
    console.log(error);
    response.status(500).send('Error retrieving data from the database');
  }
};

const getPendingNGOs = async (request, response) => {
  try {
    // Get all NGOs with status equal to "Pending" from the database
    const pendingNGOs = await NGO.find({ status: 'Pending' }).exec();

    // Send the pending NGOs back to the client
    response.json({ NGOs: pendingNGOs });
  } catch (error) {
    console.log(error);
    response.status(500).send('Error retrieving data from the database');
  }
};

const approveDonator = async (request, response) => {
  try {
    const id = parseInt(request.params.id);
    const donator = await Donator.findOneAndUpdate(
      { donatorId: id },
      { $set: { status: 'Approved' } },
      { new: true }
    ).exec();

    if (!donator) {
      response.status(404).send('Donator not found');
      return;
    }
    await sendApprovalEmail(donator.email,donator.username);
    response.send('Donator Approved');
  } catch (error) {
    console.log(error);
    response.status(500).send('Error retrieving data from the database');
  }
};

const rejectDonator = async (request, response) => {
  try {
    const id = parseInt(request.params.id);
    const donator = await Donator.findOneAndUpdate(
      { donatorId: id },
      { $set: { status: 'Rejected' } },
      { new: true }
    ).exec();

    if (!donator) {
      response.status(404).send('Donator not found');
      return;
    }
    await sendRejectionEmail(donator.email,donator.username);
    response.send('Donator Rejected');
  } catch (error) {
    console.log(error);
    response.status(500).send('Error retrieving data from the database');
  }
};

const approveNGO = async (request, response) => {
  try {
    const id = parseInt(request.params.id);
    const ngo = await NGO.findOneAndUpdate(
      { ngoId: id },
      { $set: { status: 'Approved' } },
      { new: true }
    ).exec();

    if (!ngo) {
      response.status(404).send('NGO not found');
      return;
    }
    await sendApprovalEmail(ngo.email,ngo.username);
    response.send('NGO Approved');
  } catch (error) {
    console.log(error);
    response.status(500).send('Error retrieving data from the database');
  }
};

const rejectNGO = async (request, response) => {
  try {
    const id = parseInt(request.params.id);
    const ngo = await NGO.findOneAndUpdate(
      { ngoId: id },
      { $set: { status: 'Rejected' } },
      { new: true }
    ).exec();

    if (!ngo) {
      response.status(404).send('NGO not found');
      return;
    }
    await sendRejectionEmail(ngo.email,ngo.username);
    response.send('NGO Rejected');
  } catch (error) {
    console.log(error);
    response.status(500).send('Error retrieving data from the database');
  }
};

const getNotifications = async (request, response) => {
  const admin = await Admin.findOne();
  const recipientId = admin._id;
  try {
    const notifications = await Notification.find({ recipientId: recipientId }).exec();
    if (!notifications) {
      response.send('No Notifications Found');
      return;
    }

    response.json({ notifications });
  } catch (error) {
    console.log(error);
    response.status(500).send('Error finding notifications in the database');
  }
};

const updateNotificationStatus = async (request, response) => {
  const notificationId = parseInt(request.params.notificationId);
  try {
    // Find the notification by ID
    const notification = await Notification.findOne({ notificationId: notificationId }).exec();
    if (!notification) {
      response.status(404).send('Notification not found');
      return;
    }

    // Update the status to "read"
    notification.status = 'read';
    await notification.save();

    response.send('Notification status updated to "read"');
  } catch (error) {
    console.log(error);
    response.status(500).send('Error updating notification status');
  }
}

module.exports = {
  getAllDonators,
  getAllNGOs,
  getPendingDonators,
  getPendingNGOs,
  approveDonator,
  approveNGO,
  rejectDonator,
  rejectNGO,
  getNotifications,
  updateNotificationStatus
};
