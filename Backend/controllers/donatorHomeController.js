const Donator = require('../models/Donator');
const Donation = require('../models/Donation');
const Request = require('../models/Request');
const ChatInstance = require('../models/ChatInstance');
const ChatMessage = require('../models/ChatMessage');
const Notification = require('../models/Notification');
const validator = require('../util/DonationValidation');

const getDonations = async (request, response) => {
  const userId = request.userId;
  try {
    const donations = await Donation.find({ donatorId: userId });
    if (!donations) {
      response.send('No Current Donations');
      return;
    }
    // Iterate through all donations
    for (let i = 0; i < donations.length; i++) {
      const donation = donations[i];
      const donationDate = new Date(donation.donationDate);
      const currentDate = new Date();

      // Check if the difference between the donation date and current date is more than 48 hours
      if (currentDate - donationDate > 48 * 60 * 60 * 1000) {
        // Update the donation status to "Removed"
        donation.donationStatus = "Removed";
        await donation.save();
      }
    }

    response.json({ donations });
  } catch (error) {
    console.log(error);
    response.status(500).send('Error finding Donations in the database');
  }
};

const createDonation = async (request, response) => {
  const userId = request.userId;
  const donation = request.body;

  // Validate the donation object against the schema
  const isValid = validator(donation);
  if (!isValid) {
    response.status(400).json({ errors: validator.errors });
    return;
  }

  const donator = await Donator.findOne({ _id: userId });
  if (!donator) {
    response.status(404).send('Donator not found');
    return;
  }
  donation.donatorName = donator.username;

  // Set the donatorId to the current user's id
  donation.donatorId = userId;

  // DonationId
  const count = await Donation.countDocuments();
  donation.donationId = count + 1;

  donation.donationStatus = "Available";

  // Insert the new donation into the database
  try {
    await Donation.create(donation);
    console.log('Donation added to the database');
    response.status(201).send('Donation successfully added');
  } catch (error) {
    console.log(error);
    response.status(500).send('Error inserting the donation into the database');
  }
};

const removeDonation = async (request, response) => {
  const donationId = parseInt(request.params.donationId);

  try {
    await Donation.updateOne({ donationId: donationId }, { donationStatus: "Removed" });

    response.send('Donation successfully Removed');
  } catch (error) {
    console.log(error);
    response.status(500).send('Error updating donation status to "Removed"');
  }
};

const deliverDonation = async (request, response) => {
  const userId = request.userId;
  const donationId = parseInt(request.params.donationId);

  try {
    // Update the donation status to "Delivered"
    await Donation.updateOne({ donationId: donationId }, { donationStatus: "Delivered" });

    const request = await Request.findOne({ donationId });
    if (!request) {
      response.status(404).send('Request not found');
      return;
    }

    const notificationCount = await Notification.countDocuments();
    notificationId = notificationCount + 1;

    const requestNotification = new Notification({
      notificationId: notificationId,
      body: `Donator ${request.donatorName} has delivered your request ${request.donationName}`,
      recipientId: request.ngoId,
      senderId: userId
    });

    await requestNotification.save();

    console.log('Notification added to the database');

    // Find the associated chat instance and delete it
    const chatInstance = await ChatInstance.findOne({ donationId: donationId });
    if (chatInstance) {
      await chatInstance.deleteOne();

      // Delete all messages associated with the chat instance
      await ChatMessage.deleteMany({ chatInstanceId: chatInstance.chatInstanceId });
    }

    // Update the donation request status to "Delivered"
    await Request.updateOne({ donationId: donationId }, { donationStatus: "Delivered" });

    response.send('Donation successfully delivered');
  } catch (error) {
    console.log(error);
    response.status(500).send('Error updating donation status to "Delivered"');
  }
};

const getDonationHistory = async (request, response) => {
  const userId = request.userId;

  try {
    const donations = await Donation.find({ donatorId: userId, donationStatus: { $in: ['Removed', 'Delivered'] } });
    if (!donations) {
      response.send('No donations found');
      return;
    }

    const currentDate = new Date();
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    // Filter donations older than a month and with status "Removed" or "Delivered"
    const donationsToDelete = donations.filter(
      (donation) => donation.donationDate < oneMonthAgo
    );

    // Delete the filtered donations
    await Promise.all(
      donationsToDelete.map(async (donation) => {
        await Donation.findByIdAndDelete(donation._id);
      })
    );

    response.json({ donations });
  } catch (error) {
    console.log(error);
    response.status(500).send('Error finding or deleting donations in the database');
  }
};

const sendChatMessage = async (request, response) => {
  const chatInstanceId = parseInt(request.params.chatInstanceId);
  const userId = request.userId;
  const messageContent = request.body.message;

  try {
    // Find the chat instance
    const chatInstance = await ChatInstance.findOne({ chatInstanceId });
    if (!chatInstance) {
      response.status(404).send('Chat instance not found');
      return;
    }

    // Create a new chat message
    const chatMessage = new ChatMessage({
      chatInstanceId: chatInstanceId,
      recipientId: chatInstance.ngoId,
      senderId: userId,
      message: messageContent
    });

    // Save the chat message to the database
    await chatMessage.save();

    response.json({ chatMessage });
  } catch (error) {
    console.log(error);
    response.status(500).send('Error sending chat message');
  }
};

const getChatMessages = async (request, response) => {
  const chatInstanceId = parseInt(request.params.chatInstanceId);

  try {
    // Find the chat instance
    const chatInstance = await ChatInstance.findOne({ chatInstanceId });

    if (!chatInstance) {
      response.status(404).send('Chat instance not found');
      return;
    }

    // Find all chat messages for the chat instance
    const chatMessages = await ChatMessage.find({ chatInstanceId });

    response.json({ chatMessages });
  } catch (error) {
    console.log(error);
    response.status(500).send('Error retrieving chat messages');
  }
};

async function getChatInstances(request, response) {
  const userId = request.userId;

  try {
    const chatInstances = await ChatInstance.find({ donatorId: userId });

    response.json({ chatInstances });
  } catch (error) {
    console.log(error);
    response.status(500).send('Error retrieving chat instances');
  }
}

const getNotifications = async (request, response) => {
  const userId = request.userId;
  try {
    const notifications = await Notification.find({ recipientId: userId }).exec();
    if (!notifications) {
      response.send('No Notifications Found');
      return;
    }

    response.json({ notifications });
  } catch (error) {
    console.log(error);
    response.status(500).send('Error finding notifications in database');
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
  getDonations,
  createDonation,
  removeDonation,
  deliverDonation,
  getDonationHistory,
  sendChatMessage,
  getChatMessages,
  getNotifications,
  updateNotificationStatus,
  getChatInstances
};