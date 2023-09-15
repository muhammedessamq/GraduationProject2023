const Donation = require('../models/Donation');
const Request = require('../models/Request');
const NGO = require('../models/NGO');
const Notification = require('../models/Notification');
const ChatInstance = require('../models/ChatInstance');
const ChatMessage = require('../models/ChatMessage');

async function getDonations(request, response) {
  try {
    const donations = await Donation.find({ donationStatus: 'Available' });
    if (!donations) {
      response.send('No Current Donations');
      return;
    }
    response.json({ donations });
  } catch (error) {
    console.log(error);
    response.status(500).send('Error finding Donations in the database');
  }
}

async function createRequest(request, response) {
  const userId = request.userId;
  const donationId = parseInt(request.params.id);

  try {
    const donation = await Donation.findOne({ donationId });
    if (!donation) {
      response.status(404).send('Donation not found');
      return;
    }

    donation.donationStatus = 'Requested';
    await donation.save();

    const count = await Request.countDocuments();
    const requestId = count + 1;

    const newRequest = new Request({
      donatorId: donation.donatorId,
      donatorName: donation.donatorName,
      donationId: donation.donationId,
      donationName: donation.name,
      deliveryStatus: donation.deliveryStatus,
      description: donation.description,
      donationItems: donation.items,
      donationStatus: donation.donationStatus,
      requestId: requestId,
      ngoId: userId
    });

    await newRequest.save();

    response.status(201).send('Request created successfully');

    const ngo = await NGO.findOne({ _id: userId });

    const notificationCount = await Notification.countDocuments();
      notificationId= notificationCount + 1;
      
    const requestNotification = new Notification({
      notificationId: notificationId,
      body: `NGO ${ngo.username} has requested your donation ${donation.name}`,
      recipientId: donation.donatorId,
      senderId: userId
    });

    await requestNotification.save();

    console.log('Notification added to the database');

    const chatCount = await ChatInstance.countDocuments();
    const chatInstanceId = chatCount + 1;

    const chatInstance = new ChatInstance({
      chatInstanceId: chatInstanceId,
      donatorId: donation.donatorId,
      ngoId: userId,
      donationId: donation.donationId,
      donationName: donation.name,
      ngoName:ngo.username,
      donatorName:donation.donatorName
    });

    await chatInstance.save();

    console.log('ChatInstance added to the database');
  } catch (error) {
    console.log(error);
    response.status(500).send('Error creating request');
  }
}

async function sendChatMessage(request, response) {
  const chatInstanceId = parseInt(request.params.chatInstanceId);
  const userId = request.userId;
  const messageContent = request.body.message;

  try {
    const chatInstance = await ChatInstance.findOne({ chatInstanceId });
    if (!chatInstance) {
      response.status(404).send('Chat instance not found');
      return;
    }

    const chatMessage = new ChatMessage({
      chatInstanceId: chatInstanceId,
      recipientId: chatInstance.donatorId,
      senderId: userId,
      message: messageContent
    });

    await chatMessage.save();

    response.json({ chatMessage });
  } catch (error) {
    console.log(error);
    response.status(500).send('Error sending chat message');
  }
}

async function getChatInstances(request, response) {
  const userId = request.userId;

  try {
    const chatInstances = await ChatInstance.find({ ngoId: userId });

    response.json({ chatInstances });
  } catch (error) {
    console.log(error);
    response.status(500).send('Error retrieving chat instances');
  }
}

async function getChatMessages(request, response) {
  const chatInstanceId = parseInt(request.params.chatInstanceId);

  try {
    const chatInstance = await ChatInstance.findOne({ chatInstanceId });

    if (!chatInstance) {
      response.status(404).send('Chat instance not found');
      return;
    }

    const chatMessages = await ChatMessage.find({ chatInstanceId });

    response.json({ chatMessages });
  } catch (error) {
    console.log(error);
    response.status(500).send('Error retrieving chat messages');
  }
}

async function getMyRequests(request, response) {
  const userId = request.userId;

  try {
    const requests = await Request.find({ ngoId: userId });
    if (!requests) {
      response.send('No Current Donations');
      return;
    }
    response.json({ requests });
  } catch (error) {
    console.log(error);
    response.status(500).send('Error finding Donations in the database');
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
  createRequest,
  sendChatMessage,
  getChatMessages,
  getMyRequests,
  getNotifications,
  updateNotificationStatus,
  getChatInstances
};