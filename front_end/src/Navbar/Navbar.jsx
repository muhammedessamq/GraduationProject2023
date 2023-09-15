import React, { useState, useEffect } from 'react';
import logoImage from '../logo.jpeg';
import "./NavBar.css";
import { IoMdArrowDropdown } from 'react-icons/io';
import { FiLogOut } from 'react-icons/fi';
import { MdNotificationsNone } from 'react-icons/md';
import { BrowserRouter as Router, Route, Redirect, useNavigate, Link } from 'react-router-dom';
import moment from 'moment';

export const Navbar = ({ onFormSwitch, username }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [notificationCount, setNotificationCount] = useState(0);
  const [userType, setUserType] = useState(localStorage.getItem("userType"));
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        let url = '';
        if (userType === 'Donator') {
          url = 'http://localhost:4000/api/DonatorHome/notifications';
        } else if (userType === 'NGO') {
          url = 'http://localhost:4000/api/NGOHome/notifications';
        } else if (userType === 'Admin') {
          url = 'http://localhost:4000/api/Admin/notifications';
        }

        const response = await fetch(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        const unreadNotifications = data.notifications.filter(notification => notification.status === 'unread');
        setNotifications(data.notifications.reverse());
        setNotificationCount(unreadNotifications.length);
      } catch (error) {
        console.log(error);
      }
    };

    fetchNotifications();
  }, [userType, token]);


  const [readNotifications, setReadNotifications] = useState([]);

  const handleReadNotification = async (notificationId) => {
    try {
      if (readNotifications.includes(notificationId)) {
        // Notification already marked as read, return early
        return;
      }
  
      const url = `http://localhost:4000/api/Admin/readNotification/${notificationId}`;
  
      // Send the request to mark the notification as read
      await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
  
      setReadNotifications((prevReadNotifications) => [...prevReadNotifications, notificationId]);
  
      const updatedNotifications = notifications.map((notification) => {
        if (notification.notificationId === notificationId) {
          // Update the status of the clicked notification to 'read'
          return {
            ...notification,
            status: 'read',
          };
        }
        return notification;
      });
  
      setNotifications(updatedNotifications);
  
      // Update the notification count only if the status was changed to 'read'
      setNotificationCount((prevCount) => prevCount - 1);
    } catch (error) {
      console.log(error);
    }
  };
  


  const handleClickNotification = () => {
    setShowNotifications(!showNotifications);
  };

  username = localStorage.getItem("username");
  const initials = username ? username.substr(0, 2).toUpperCase() : '';
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userTest");
    navigate('../');
  };
  const handleProfile = () => {
    console.log("look");
    onFormSwitch("ProfilePage")
  };

  function menuOnClick() {
    document.getElementById('menu-bar').classList.toggle('change');
    document.getElementById('navbar').classList.toggle('change');
    document.getElementById('menu-bg').classList.toggle('change-bg');
  }

  const handleContactClick = () => {
    const email = 'wasteless.egy@gmail.com';
    const subject = 'Contact Wasteless Support Team';
    const body = 'Hello Wasteless Team,';

    window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <div>
      <nav className="navbarpage">
        <div id="menu">
          <div id="menu-bar" onClick={menuOnClick}>
            <div id="bar1" className="bar"></div>
            <div id="bar2" className="bar"></div>
            <div id="bar3" className="bar"></div>
          </div>
          <nav className="navbar" id="navbar">
            <ul>
              <li>
                <div className="nav-profileShow-username-container">
                  <div className="nav-profileShow-username-circle">
                    <span className="nav-profileShow-username-initials">{initials}</span>
                  </div>
                  <div className="nav-profileShow-username">
                    <span>{username}</span>
                  </div>
                </div>
              </li>
              {userType === 'Admin' ? (
                <li>
                  <span className="disabled-link">View Profile</span>
                </li>
              ) : (
                <li>
                  <a href="#"><Link to="/profile">View Profile</Link></a>
                </li>
              )}
              <li>
                <a href="#" onClick={handleContactClick}>Contact us</a>
              </li>
              <li>
                <a href="#" onClick={handleLogout} >Log out</a>
              </li>
            </ul>
          </nav>
        </div>
        <div className="menu-bg" id="menu-bg"></div>

     
          <img src={logoImage} alt="Logo" className="navbarpage-logo-image" />
      

        <div className='navbarpage-notification-button'>
          <button className="navbarpage-notification-button" onClick={handleClickNotification}>
            <MdNotificationsNone />
            <span className="notification-count">{notificationCount}</span>
          </button>
          {showNotifications && (
            <div className="navbarpage-notification-dropdown">
              {notifications.length > 0 ? (
                <ul>
                  {notifications.map((notification) => (
                    <li
                      className={`notification-content ${notification.status === 'read' ? 'read-notification' : ''}`}
                      key={notification._id}
                    >

                      <span className="notification-body">{notification.body}</span>
                      <br />
                      <span className="notification-time">
                        {moment(notification.timestamp).tz('Africa/Cairo').format('YYYY-MM-DD h:mm A')}
                      </span>
                      <button
                        className={`mark-as-read ${notification.status === 'read' ? 'disabled' : ''}`}
                        onClick={() => handleReadNotification(notification.notificationId)}
                        disabled={notification.status === 'read'}
                      >
                        Mark as Read
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No notifications</p>
              )}
            </div>
          )}
        </div>
        <form onSubmit={handleLogout}>
          <div className='navbarpage-logout-button'>
            <button className="navbarpage-logout-button" type='submit'>
              Logout <FiLogOut />
            </button>
          </div>
        </form>
      </nav>
    </div>
  );
};

export default Navbar;