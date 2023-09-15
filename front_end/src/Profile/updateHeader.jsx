import React, { useState, useEffect } from "react";
import "./UpdateHeader.css";
import { BsPlus, BsTrashFill, BsBellFill, BsPencilSquare, BsCheck, BsFillPencilFill } from "react-icons/bs";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from "../Navbar/Navbar";
import { Link } from "react-router-dom";


const UpdateHeader = ({ onFormSwitch }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [test, setTest] = useState('');
  const [profileData, setProfileData] = useState({
    username: '',
    email: '',
    password: '',
    phoneNumber: [],
    address: [],
    userType: '',
    taxNumber: '',
  });
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  const token = localStorage.getItem('token');

  const fetchDonatorProfile = async (token) => {
    try {
      const donatorResponse = await fetch('http://localhost:4000/api/DonatorProfile', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const donatorData = await donatorResponse.json();

      if (donatorData.donator) {
        return donatorData.donator;
      } else {
        return null;
      }
    } catch (error) {
      console.log('Error fetching donator profile:', error);
      return null;
    }
  };

  const fetchNGOProfile = async (token) => {
    try {
      const ngoResponse = await fetch('http://localhost:4000/api/NGOProfile', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const ngoData = await ngoResponse.json();

      if (ngoData.ngo) {
        return ngoData.ngo;
      } else {
        return null;
      }
    } catch (error) {
      console.log('Error fetching NGO profile:', error);
      return null;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Donator profile
        const donatorProfile = await fetchDonatorProfile(token);
        if (donatorProfile) {
          setProfileData(donatorProfile);
          return;
        }

        // Fetch NGO profile
        const ngoProfile = await fetchNGOProfile(token);
        if (ngoProfile) {
          setProfileData(ngoProfile);
          return;
        }

        console.log('Profile data:', profileData.username);
      } catch (error) {
        console.log('Error fetching profile data:', error);
      }
    };

    fetchData();
  }, []);

  const initials = profileData.username ? profileData.username.slice(0, 2).toUpperCase() : '';

  const address = Array.isArray(profileData.address) ? profileData.address.join(', ') : '';
  const phoneNumber = Array.isArray(profileData.phoneNumber) ? profileData.phoneNumber.join(', ') : '';

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleUpdatePassword = () => {
    setShowPasswordForm(true);
  };

  const handlePasswordFormSubmit = (e) => {
    e.preventDefault();
    setShowPasswordForm(false);
  };
  const [currentPassword, setCurrentPassword] = useState('');


  const handleAddPhoneNumber = async (e) => {
    e.preventDefault();
    const inputNumber = e.target.elements.phoneNumber.value.trim();
    console.log("Input Number:", inputNumber);

    // Check if the input number doesn't exist in the array and has a length of 11 digits
    if (!profileData.phoneNumber.includes(inputNumber) && inputNumber.length === 11 && inputNumber.startsWith('0')) {
      let apiEndpoint;
      if (profileData.userType === 'Donator') {
        apiEndpoint = 'http://localhost:4000/api/DonatorProfile/phoneNumber';
      } else if (profileData.userType === 'NGO') {
        apiEndpoint = 'http://localhost:4000/api/NGOProfile/phoneNumber';
      } else {
        console.log('Invalid user type');
        return;
      }

      try {
        const response = await fetch(apiEndpoint, {
          method: 'PUT', // Use POST instead of PUT
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ newPhoneNumber: inputNumber }), // Use the correct field name 'newPhoneNumber'
        });

        if (response.ok) {
          // Update the state with the added phone number
          setProfileData((prevData) => ({
            ...prevData,
            phoneNumber: [...prevData.phoneNumber, inputNumber],

          }));
          toast.success("the new number added successfully")
        } else {
          console.log('Failed to add phone number');
        }
      } catch (error) {
        console.log('Error adding phone number:', error);
      }
    }
    else {
      toast.error("this number is already existed")
    }
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    const inputAddress = e.target.elements.address.value.trim();

    // Check if the input address is empty or contains only spaces
    if (!inputAddress || /^\s*$/.test(inputAddress)) {
      toast.error('Please enter a valid address');
      return;
    }

    // Check if the input address doesn't exist in the array (ignoring case)
    if (!profileData.address.map((a) => a.toLowerCase()).includes(inputAddress.toLowerCase())) {
      let apiEndpoint;
      if (profileData.userType === 'Donator') {
        apiEndpoint = 'http://localhost:4000/api/DonatorProfile/address';
      } else if (profileData.userType === 'NGO') {
        apiEndpoint = 'http://localhost:4000/api/NGOProfile/address';
      } else {
        console.log('Invalid user type');
        return;
      }

      try {
        const response = await fetch(apiEndpoint, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ newAddress: inputAddress }),
        });

        if (response.ok) {
          // Update the state with the added address
          setProfileData((prevData) => ({
            ...prevData,
            address: [...prevData.address, inputAddress],
          }));
          toast.success('The new address added successfully');
        } else {
          console.log('Failed to add address');
        }
      } catch (error) {
        console.log('Error adding address:', error);
      }
    } else {
      toast.error('This address already exists');
    }
  };

  const handleDeletePhoneNumber = async (index) => {
    const updatedPhoneNumbers = [...profileData.phoneNumber];
    const phoneNumberToDelete = updatedPhoneNumbers[index];

    let apiEndpoint;
    if (profileData.userType === 'Donator') {
      apiEndpoint = `http://localhost:4000/api/DonatorProfile/phoneNumber`;
    } else if (profileData.userType === 'NGO') {
      apiEndpoint = `http://localhost:4000/api/NGOProfile/phoneNumber`;
    } else {
      console.log('Invalid user type');
      return;
    }

    try {
      const response = await fetch(apiEndpoint, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ phoneNumberIndex: index }), // Pass the phoneNumberIndex in the request body
      });

      if (response.ok) {
        updatedPhoneNumbers.splice(index, 1); // Remove the element at the specified index
        setProfileData((prevData) => ({
          ...prevData,
          phoneNumber: updatedPhoneNumbers,
        }));
        toast.success(`The phone number "${phoneNumberToDelete}" has been deleted successfully`);
      } else {
        console.log('Failed to delete phone number');
        toast.error('Failed to delete phone number');
      }
    } catch (error) {
      console.log('Error deleting phone number:', error);
      toast.error(`Error deleting phone number: ${error}`);
    }
  };


  const handleDeleteAddress = async (index) => {
    const updatedAddresses = [...profileData.address];
    const addressToDelete = updatedAddresses[index];

    let apiEndpoint;
    if (profileData.userType === 'Donator') {
      apiEndpoint = 'http://localhost:4000/api/DonatorProfile/address';
    } else if (profileData.userType === 'NGO') {
      apiEndpoint = 'http://localhost:4000/api/NGOProfile/address';
    } else {
      console.log('Invalid user type');
      return;
    }

    try {
      const response = await fetch(apiEndpoint, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ addressIndex: index }), // Pass the address index in the request body
      });

      if (response.ok) {
        updatedAddresses.splice(index, 1); // Remove the element at the specified index
        setProfileData((prevData) => ({
          ...prevData,
          address: updatedAddresses,
        }));
        toast.success(`The address "${addressToDelete}" has been deleted successfully`);
      } else {
        console.log('Failed to delete address');
        toast.error(`Failed to delete address`);
      }
    } catch (error) {
      console.log('Error deleting address:', error);
      toast.error(`Error deleting address: ${error}`);
    }
  };


  const handleCurrentPasswordChange = (e) => {
    const currentPassword = e.target.value.trim();
    const inputElements = document.getElementsByClassName('input-inside-Rectangle');

    // Reset background color for all input fields
    for (let i = 0; i < inputElements.length; i++) {
      inputElements[i].style.backgroundColor = '';
    }

    // Validate the current password
    const plow = profileData.password;
    if (currentPassword !== plow) {
      // Current password is incorrect, show error indication
      inputElements[2].style.backgroundColor = 'red';
    } else {
      // Current password is correct, remove error indication
      inputElements[2].style.backgroundColor = '';
    }
  };


  const handleNewPasswordChange = (e) => {
    const newPassword = e.target.value.trim();
    const inputElements = document.getElementsByClassName('input-inside-Rectangle');

    // Reset background color for all input fields
    for (let i = 0; i < inputElements.length; i++) {
      inputElements[i].style.backgroundColor = '';
    }
    // Validate the new password
    const passwordRegex = /^(?=.[a-z])(?=.[A-Z])(?=.*\\d)[a-zA-Z\\d]{8,15}$/;
    const plow = profileData.password;
    if (passwordRegex.test(newPassword) && newPassword !== plow) {
      // New password meets the requirements, remove error indication
      inputElements[1].style.backgroundColor = '';
    } else {
      // New password does not meet the requirements, show error indication
      //inputElements[1].style.backgroundColor = 'red';
    }
  };

  const handleSaveNewPassword = async (e) => {
    e.preventDefault();

    const currentPassword = e.target.elements.currentPassword.value.trim();
    const newPassword = e.target.elements.newPassword.value.trim();

    // Validate the current password
    const plow = profileData.password;
    if (currentPassword !== plow) {
      // Current password is incorrect, show error indication
      e.target.elements.currentPassword.classList.add('input-error');
      toast.error("Incorrect current password");
      return;
    }
        // Validate the new password
        /*const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d]{8,15}$/;
        if (!passwordRegex.test(newPassword)) {
          // New password does not meet the requirements, show error indication
          e.target.elements.newPassword.classList.add('input-error');
          toast.error("The password does not meet the specifications");
          return;
        }
        if(newPassword === profileData.password){
          e.target.elements.newPassword.classList.add('input-error');
          toast.error("this is the same old password please write the new password");
          return;
        }*/

    try {
      let apiEndpoint;
      if (profileData.userType === 'Donator') {
        apiEndpoint = 'http://localhost:4000/api/DonatorProfile/password';
      } else if (profileData.userType === 'NGO') {
        apiEndpoint = 'http://localhost:4000/api/NGOProfile/password';
      } else {
        console.log('Invalid user type');
        return;
      }

      const response = await fetch(apiEndpoint, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      if (response.ok) {
        // Password updated successfully, remove any error indication and reset the form
        toast.success("Password updated");
        e.target.reset();
        e.target.elements.currentPassword.classList.remove('input-error');
        e.target.elements.newPassword.classList.remove('input-error');
      } else {
        toast.error("Failed to update password");
        console.log('Failed to update password');
      }
    } catch (error) {
      console.log('Error updating password:', error);
      toast.error("Failed to update password");
    }
  };



  return (
    <div>
      <Navbar />

      <div className="rectangle-afterNavUpdate">
        <h2 className="headerForRectangle">Update Profile</h2>

        {/* Phone Number Table */}
        <div className="table-with-form-insideRectangle">
          <table className="tables-inside-rectangle">
            <thead>
              <tr>
                <th className="updateHeader-in-each-table">Phone Number</th>
            
              </tr>
            </thead>
            <tbody>
              {profileData.phoneNumber.map((number, index) => (
                <tr key={index}>
                  <td className="updateDetails-in-each-row-in-table">{number}</td>
                  <td className="updateDetails-in-each-row-in-table">
                    <button className="delete-button-insideTablesOfTheRectangle" onClick={() => handleDeletePhoneNumber(index)}>
                      <BsTrashFill />
                    </button>
                  </td>
                </tr>
              ))}
              <tr>
                <td colSpan="2" className="updateDetails-in-each-row-in-table">
                  <form className="add-form-inside-rectangle" onSubmit={handleAddPhoneNumber}>
                  <input
                    type="text"
                    name="phoneNumber"
                    placeholder="Add Phone Number"
                    className="input-inside-Rectangle"
                    maxLength="11"
                    pattern="[0-9]*" // Only accept numbers
                    inputMode="numeric" // Show numeric keyboard on mobile devices
                    title="Please enter only numbers" // Error message for unsupported browsers
                  />
                    <button type="submit" className="specified-for-add-button">
                      <BsPlus />Add
                    </button>
                  </form>
                </td>
              </tr>
            </tbody>
          </table>
        </div>



        {/* Address Table */}
        <div className="table-with-form-insideRectangle">
          <table className="tables-inside-rectangle">
            <thead>
              <tr>
                <th className="updateHeader-in-each-table">Address</th>
                <th className="updateHeader-in-each-table"></th>
              </tr>
            </thead>
            <tbody>
              {profileData.address.map((address, index) => (
                <tr key={index}>
                  <td className="updateDetails-in-each-row-in-table">
                    <div className="table-row-content-inside-rectangle">{address}</div>
                  </td>
                  <td className="updateDetails-in-each-row-in-table">
                    <button className="delete-button-insideTablesOfTheRectangle" onClick={() => handleDeleteAddress(index)}>
                      <BsTrashFill />
                    </button>
                  </td>
                </tr>
              ))}
              <tr>
                <td colSpan="2" className="updateDetails-in-each-row-in-table">
                  <form className="add-form-inside-rectangle" onSubmit={handleAddAddress}>
                    <input
                      type="text"
                      name="address"
                      placeholder="Add Address"
                      className="input-inside-Rectangle"
                    />
                    <button type="submit" className="specified-for-add-button">
                      <BsPlus />Add
                    </button>
                  </form>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        
        {/* Password Table */}
        <div className="table-with-form-insideRectangle">
          <table className="tables-inside-rectangle">
            <thead>
              <tr>
                <th className="updateHeader-in-each-table">Password</th>
                <th className="updateHeader-in-each-table"></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="updateDetails-in-each-row-in-table">
                  <input className="passVal" type="password" value={profileData.password} disabled />
                </td>

                <td className="updateDetails-in-each-row-in-table">
                  <button className="update-button-password-inside-rectangle" onClick={handleUpdatePassword}>
                    <BsFillPencilFill />
                  </button>
                </td>
              </tr>
              {showPasswordForm && (
                <tr>
                  <td colSpan="2" className="updateDetails-in-each-row-in-table">

                    <form className="add-form-inside-rectangle" onSubmit={handleSaveNewPassword}>
                      <input type="password" placeholder="Current Password" className="input-inside-Rectangle" maxLength="15" minLength="8" onChange={handleCurrentPasswordChange} name="currentPassword" />
                      <input type="password" placeholder="New Password" className="input-inside-Rectangle" minLength="8" maxLength="15" onChange={handleNewPasswordChange} name="newPassword" />
                      <button type="submit" className="specified-for-add-button">
                        <BsCheck />Save
                      </button>
                    </form>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <Link to="/Profile"><button className="check-button-atLast">Back</button></Link>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default UpdateHeader;