import React, { useState, useEffect } from 'react';
import logoImage from '../logo.jpeg';
import forgetPassword from './Capture.png';
import axios from 'axios';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './forgetPassword.css';

export const ForgetPassword = ({ onFormSwitch }) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState(3);
  const [isPasswordReset, setIsPasswordReset] = useState(false);
  const location = useLocation();
  const token = new URLSearchParams(location.search).get('token');
  const navigate = useNavigate();

  const handleNewPasswordChange = (e) => {
    const newPassword = e.target.value.trim();
    const inputElements = document.getElementsByClassName('inputs-container-forget');
    const inputElement = e.target;
    inputElement.classList.remove('input-error')
    // Validate the new password
    const passwordRegex = /^(?=.[a-z])(?=.[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    if(!passwordRegex.test(newPassword) ) {
      inputElement.classList.add('input-error');
    }
    else{
      inputElement.classList.remove('input-error');
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,15}$/;
    if (!passwordRegex.test(newPassword) ) {
      toast.error("The password must be 8 characters and contain at least 1 capital letter, 1 small letter, and 1 number");
      return;
    } 
    if (newPassword !== confirmPassword ) {
      toast.error('Passwords do not match!');
      return;
    }

    const user = {
      newPassword
    };
    
    try {
      const response = await axios.post(`http://localhost:4000/api/Login/resetPassword?token=${token}`, user);
      toast.success('Password reset successful!');
      setNewPassword('');
      setConfirmPassword('');
      setStep(2);
      setIsPasswordReset(true);
    } catch (error) {
      console.error(error);
      if (error.response && error.response.data) {
        toast.error(`${error.response.data}`);
      } else {
        toast.error('Failed to reset password!');
      }
    }
  };

  useEffect(() => {
    if (isPasswordReset) {
      const timer = setTimeout(() => {
        navigate('/');
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [isPasswordReset, onFormSwitch]);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="ForgetCreation">
      <div className="logo-container-forget">
        <img src={logoImage} alt="Logo" className="logos-image-forget" />
      </div>
      <div className="belong-To-H1-forget"></div>
      <div className="sort-container-forget">
        <img src={forgetPassword} alt="Logo" className="forget-image" />
        <h1 className="about-all-forget">
          <span>moment</span> <span>of</span> <span>new</span> <span>password</span>
        </h1>
        <br />
        <form onSubmit={handleSubmit} className="SignIn-form-forget">
          <label className="usersname-label-forget">
          <div className="inputs-container-forget">
              <input
                className="holder-forget"
                type={showPassword ? 'text' : 'password'}
                value={newPassword}
                required
                placeholder="Enter new password" 
                minLength="8"
                maxLength="15"
                onChange={(e) => {setNewPassword(e.target.value); handleNewPasswordChange(e);}}
              />
            </div>
          </label>
          <br />
          <label className="usersname-label-forget">
            <div className="inputs-container-forget">
              <input
                className="holder-forget"
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                required
                minLength="8"
                maxLength="15"
                placeholder="Retype new password"
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </label>
          <br />
          <div className="password-toggle">
            <input
              type="checkbox"
              id="showPassword"
              checked={showPassword}
              onChange={togglePasswordVisibility}
            />
            <label htmlFor="showPassword">{showPassword ? 'Hide Password' : 'Show Password'}</label>
          </div>
          <br />
          <div className="grow-rectangle"></div>
          <button type="submit" className="doos-forget">
            Reset Password
          </button>
          <br />
          <br />
          <div className="step-progress-bar">
            <div className={`step ${step >= 1 ? 'completed' : ''} ${step === 1 ? 'active' : ''}`}>1</div>
            <div className={`step-line-1 ${step >= 1 ? 'completed' : ''}`}></div>
            <div className={`step-line-2 ${step >= 2 ? 'completed' : ''}`}></div>
            <div className={`step ${step >= 3 ? 'completed' : ''} ${step === 3 ? 'active' : ''}`}>2</div>
          </div>
        </form>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default ForgetPassword;