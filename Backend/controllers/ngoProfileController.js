const NGO = require('../models/NGO');

const getNGO = async (request, response) => {
  const userId = request.userId;
  try {
    // Fetch NGO data from database using userId
    const ngo = await NGO.findOne({ _id: userId });
    if (!ngo) {
      response.status(404).send('NGO not found');
      return;
    }
    // Send NGO data back to the client
    response.json({ ngo });
  } catch (error) {
    console.log(error);
    response.status(500).send('Error finding NGO in the database');
  }
};

const changePassword = async (request, response) => {
  const userId = request.userId;
  const { currentPassword, newPassword } = request.body;
  try {
    // Fetch NGO data from database using userId
    const ngo = await NGO.findOne({ _id: userId });
    if (!ngo) {
      response.status(404).send('NGO not found');
      return;
    }
    // Check if the current password is correct
    if (ngo.password !== currentPassword) {
      response.status(401).send('Incorrect current password');
      return;
    }
    // Update NGO password in the database
    await NGO.updateOne({ _id: userId }, { $set: { password: newPassword } });
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
    // Fetch NGO data from database using userId
    const ngo = await NGO.findOne({ _id: userId });
    if (!ngo) {
      response.status(404).send('NGO not found');
      return;
    }
    // Add the new phone number to the phoneNumber array
    ngo.phoneNumber.push(newPhoneNumber);
    // Update NGO phoneNumber array in the database
    await NGO.updateOne({ _id: userId }, { $set: { phoneNumber: ngo.phoneNumber } });
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
    // Fetch NGO data from database using userId
    const ngo = await NGO.findOne({ _id: userId });
    if (!ngo) {
      response.status(404).send('NGO not found');
      return;
    }
    // Add the new address to the address array
    ngo.address.push(newAddress);
    // Update NGO address array in the database
    await NGO.updateOne({ _id: userId }, { $set: { address: ngo.address } });
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
    // Fetch NGO data from database using userId
    const ngo = await NGO.findOne({ _id: userId });
    if (!ngo) {
      response.status(404).send('NGO not found');
      return;
    }
    // Check if the addressIndex is a valid index in the address array
    if (addressIndex < 0 || addressIndex >= ngo.address.length) {
      response.status(404).send('Invalid address index');
      return;
    }
    // Remove the address from the address array
    ngo.address.splice(addressIndex, 1);
    // Update NGO address array in the database
    await ngo.save();
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
    // Fetch NGO data from database using userId
    const ngo = await NGO.findOne({ _id: userId }); // Change variable name from "NGO" to "ngo"
    if (!ngo) {
      response.status(404).send('NGO not found');
      return;
    }
    // Check if the phoneNumber is a valid index in the phoneNumber array
    if (phoneNumberIndex < 0 || phoneNumberIndex >= ngo.phoneNumber.length) {
      response.status(404).send('Invalid phoneNumber index');
      return;
    }
    // Remove the phoneNumber from the phoneNumber array
    ngo.phoneNumber.splice(phoneNumberIndex, 1);
    // Update NGO phoneNumber array in the database
    await ngo.save();
    response.send('phoneNumber removed successfully');
  } catch (error) {
    console.log(error);
    response.status(500).send('Error removing phoneNumber');
  }
};

module.exports = {
  getNGO,
  changePassword,
  addPhoneNumber,
  addAddress,
  removeAddress,
  removePhoneNumber
};
