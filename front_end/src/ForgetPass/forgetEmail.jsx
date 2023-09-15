import React, { useState, useEffect } from 'react';
import logoImage from '../logo.jpeg';
import forgetPassword from './Capture.png';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './forgetEmail.css';

export const ForgetEmail = ({ onFormSwitch }) => {
  const [email, setEmail] = useState('');
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [remainingTime, setRemainingTime] = useState(30);

  useEffect(() => {
    let timer = null;

    if (isSendingEmail) {
      timer = setInterval(() => {
        setRemainingTime((prevTime) => prevTime - 1);
      }, 1000);
    }

    return () => {
      clearInterval(timer);
    };
  }, [isSendingEmail]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const user = {
      email,
    };

    setIsSendingEmail(true);

    try {
      await axios.post('http://localhost:4000/api/Login/sendActivationMail', user);
      toast.success('Activation email sent!');
      setEmail('');
      setStep(2);

      setTimeout(() => {
        setIsSendingEmail(false);
      }, 3000); // Delay navigation to next page for 3 seconds

      // Disable send button for 30 seconds
      setTimeout(() => {
        setIsSendingEmail(false);
      }, 30000); // 30 seconds

      setRemainingTime(30); // Reset the remaining time
    } catch (error) {
      console.error(error);
      toast.error('Failed to send activation email!');
      setIsSendingEmail(false);
      setStep(2);
    }
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
          <span>forget</span> <span>password</span>
        </h1>
        <br />
        <form onSubmit={handleSubmit} className="SignIn-form-forget">
          <label className="usersname-label-forget">
            <div className="inputs-container-forget">
              <input
                className="holder-forget"
                type="email"
                value={email}
                required
                placeholder="Enter your email"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </label>
          <br />
          <div className="grow1-rectangle"></div>
          <button type="submit" className="doos-forget" disabled={isSendingEmail}>
            {isSendingEmail ? `Sending... ${remainingTime}s` : 'Send activation email'}
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

export default ForgetEmail;
