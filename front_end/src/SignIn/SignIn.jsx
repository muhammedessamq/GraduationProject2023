import React, { useState } from 'react';
import logoImage from '../logo.jpeg';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link, useNavigate } from 'react-router-dom';
import './SignIn.css';

export const SignIn = ({ onFormSwitch }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [userType, setUserType] = useState('');
  const navigate = useNavigate();

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    const user = {
      username,
      password,
    };

    axios
      .post('http://localhost:4000/api/Login', user)
      .then((response) => {
        const token = response.data.token;
        const userType = response.data.userType;
        localStorage.setItem('token', token);
        localStorage.setItem('userType', userType);
        localStorage.setItem('username', username);
        console.log(token);
        setUserType(userType);
        setUsername('');
        setPassword('');

        if (response.data=== 'Your Registration is Pending'){
          toast.error('Your Registration is Pending');
        }
        
        // Use an if statement to check the user type and toggle the switch to the appropriate page
        if (userType === 'Donator' && token) {
          navigate('/MyDonations');
        } else if (userType === 'NGO' && token) {
          navigate('/NGOHome');
        } else if (userType === 'Admin' && token) {
          navigate('/AdminDashboard');
        }
      })
      .catch((error) => {
        console.error(error);
        if (error.response && error.response.status === 404) {
          toast.error('Invalid username or password!');
        } else {
          toast.error('Login failed!');
        }
      });
  };

  return (
    <div className="LoginCreation">
      <div className="logo-container">
        <img src={logoImage} alt="Logo" className="logos-image" />
      </div>
      <div className="belong-To-H1">
        <h1 className="about-signIn">SignIn</h1>
      </div>
      <div className="sort-container">
        <h1 className="SignInTxt">Sign In</h1>
        <h2 className="welcome-Back">Welcome back</h2>
        <form className="about-all" onKeyDown={handleKeyDown}>
          <label className="usersname-label">
            <div className="inputs-container">
              <input
                className="holder"
                type="text"
                value={username}
                required
                placeholder="Enter your username"
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          </label>
          <br />

          <label className="passwordCheck-label">
            <div className="passwordd-container">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                required
                placeholder="Enter your password"
                onChange={(e) => setPassword(e.target.value)}
                className="passwordd-input"
              />
            </div>
          </label>
          <br />
          <Link to="/ForgetEmail">
            <button className="forgetPass">Forgot password?</button>
          </Link>
          <br />
          <br />
          <div className="grow-rectangle"></div>
          <button type="button" className="SubmitB" onClick={handleSubmit}>
            Sign In
          </button>
          <br />
          <br />
          <Link to="/AccountCreationForm">
            <button className="CreateAcc">Don't have an account?</button>
          </Link>
        </form>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default SignIn;
