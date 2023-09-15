const Donator = require('../models/Donator');

const getDonator = async (request, response) => {
  const userId = request.userId;
  try {
    // Fetch Donator data from database using userId
    const donator = await Donator.findOne({ _id: userId });
    if (!donator) {
      response.status(404).send('Donator not found');
      return;
    }
    // Send Donator data back to the client
    response.json({ donator });
  } catch (error) {
    console.log(error);
    response.status(500).send('Error finding Donator in the database');
  }
};

const changePassword = async (request, response) => {
  const userId = request.userId;
  const { currentPassword, newPassword } = request.body;
  try {
    // Fetch Donator data from database using userId
    const donator = await Donator.findOne({ _id: userId });
    if (!donator) {
      response.status(404).send('Donator not found');
      return;
    }
    // Check if the current password is correct
    if (donator.password !== currentPassword) {
      response.status(401).send('Incorrect current password');
      return;
    }
    // Update Donator password in the database
    donator.password = newPassword;
    await donator.save();
    response.send('Password changed successfully');
  } catch (error) {
    console.log(error);
    response.status(500).send('Error changing password');
  }
};

const addPhoneNumber = async (request, response) => {
  const userId = request.userId;
  const { newPhoneNumber } = request.body;
  try {
    // Fetch Donator data from database using userId
    const donator = await Donator.findOne({ _id: userId });
    if (!donator) {
      response.status(404).send('Donator not found');
      return;
    }
    // Add the new phone number to the phoneNumber array
    donator.phoneNumber.push(newPhoneNumber);
    // Update Donator phoneNumber array in the database
    await donator.save();
    response.send('Phone number added successfully');
  } catch (error) {
    console.log(error);
    response.status(500).send('Error adding phone number');
  }
};

const addAddress = async (request, response) => {
  const userId = request.userId;
  const { newAddress } = request.body;
  try {
    // Fetch Donator data from database using userId
    const donator = await Donator.findOne({ _id: userId });
    if (!donator) {
      response.status(404).send('Donator not found');
      return;
    }
    // Add the new address to the address array
    donator.address.push(newAddress);
    // Update Donator address array in the database
    await donator.save();
    response.send('Address added successfully');
  } catch (error) {
    console.log(error);
    response.status(500).send('Error adding address');
  }
};

const removeAddress = async (request, response) => {
  const userId = request.userId;
  const { addressIndex } = request.body;
  try {
    // Fetch Donator data from database using userId
    const donator = await Donator.findOne({ _id: userId });
    if (!donator) {
      response.status(404).send('Donator not found');
      return;
    }
    // Check if the addressIndex is a valid index in the address array
    if (addressIndex < 0 || addressIndex >= donator.address.length) {
      response.status(404).send('Invalid address index');
      return;
    }
    // Remove the address from the address array
    donator.address.splice(addressIndex, 1);
    // Update Donator address array in the database
    await donator.save();
    response.send('Address removed successfully');
  } catch (error) {
    console.log(error);
    response.status(500).send('Error removing address');
  }
};

const removePhoneNumber = async (request, response) => {
  const userId = request.userId;
  const { phoneNumberIndex } = request.body;
  try {
    // Fetch Donator data from database using userId
    const donator = await Donator.findOne({ _id: userId });
    if (!donator) {
      response.status(404).send('Donator not found');
      return;
    }
    // Check if the phoneNumber is a valid index in the phoneNumber array
    if (phoneNumberIndex < 0 || phoneNumberIndex >= donator.phoneNumber.length) {
      response.status(404).send('Invalid phoneNumber index');
      return;
    }
    // Remove the phoneNumber from the phoneNumber array
    donator.phoneNumber.splice(phoneNumberIndex, 1);
    // Update Donator phoneNumber array in the database
    await donator.save();
    response.send('phoneNumber removed successfully');
  } catch (error) {
    console.log(error);
    response.status(500).send('Error removing phoneNumber');
  }
};

module.exports = {
  getDonator,
  changePassword,
  addPhoneNumber,
  addAddress,
  removeAddress,
  removePhoneNumber
};
