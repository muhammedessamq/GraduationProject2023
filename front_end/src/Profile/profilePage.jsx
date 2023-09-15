import React, { useEffect, useState } from 'react';
import './profilePage.css';
import { BsInfoCircleFill } from 'react-icons/bs';
import Navbar from '../Navbar/Navbar';
import { Link } from 'react-router-dom/dist';

const ProfilePage = () => {
  const [profileData, setProfileData] = useState({
    username: '',
    email: '',
    password: '',
    phoneNumber: [],
    address: [],
    userType: '',
    taxNumber: '',
  });
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

  return (
    <div>
      <Navbar />
      <div className="rectangle-container-profile">
        <div className="middle-rectangle-profile">
          <div className="circle-container-profile">
            <div className="circle-profile">{initials}</div>
          </div>
          <div className="username-profile">{profileData.username}</div>
          <div className="type-profile">{profileData.userType} </div>
          <h2 className="about-label-profile">About</h2>
          <div className="info-item-profile">
            <span className="info-label-profile">Username:</span>
            <span className="info-value-profile">{profileData.username}</span>
          </div>
          <div className="line-profile"></div>
          <div className="info-item-profile">
            <span className="info-label-profile">Email:</span>
            <span className="info-value-profile">{profileData.email}</span>
          </div>
          <div className="line-profile"></div>
          <div className="info-item-profile">
            <span className="info-label-profile">Type:</span>
            <span className="info-value-profile">{profileData.userType}</span>
          </div>
        </div>
        <div className="right-rectangle-profile">
          <h2 className="more-info-label-profile">More Information</h2>
          <div className="info-item-profile">
            <span className="info-label-profile">Address:</span>
            <span className="info-value-profile">{address}</span>
          </div>
          <div className="line-profile"></div>
          <div className="info-item-profile">
            <span className="info-label-profile">Tax ID:</span>
            <span className="info-value-profile">{profileData.taxNumber}</span>
          </div>
          <div className="line-profile"></div>
          <div className="info-item-profile">
            <span className="info-label-profile">Phone Number:</span>
            <span className="info-value-profile">{phoneNumber}</span>
          </div>
          <div className="button-container-profile">
            <Link to="/UpdateHeader"><button className="more-info-button-profile">update profile</button></Link>
            <div className="info-icon-profile">
              <BsInfoCircleFill className="info-icon-text-profile" />
              <div className="info-tooltip-profile">
                You can change password, delete or add phone number and address
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
