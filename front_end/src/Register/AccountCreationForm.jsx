import React, { useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import logoImage from '../logo.jpeg';
import './AccountCreationForm.css';
import { BsFillEyeFill } from 'react-icons/bs';
import { BsFillEyeSlashFill } from 'react-icons/bs';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

export const AccountCreationForm = ({ onFormSwitch }) => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState([]);
  const [address, setAddress] = useState([]);
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [userType, setUserType] = useState('Donator');
  const [registrationDocs, setRegistrationDocs] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [taxNumber, setTaxNumber] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [signupError, setSignupError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username) {
      toast.error('Please enter your username.');
      return;
    }
    if (!email) {
      toast.error('Please enter your email.');
      return;
    }
    if (!phoneNumber) {
      toast.error('Please enter your phone number.');
      return;
    }
    if (!address) {
      toast.error('Please enter your address.');
      return;
    }
    if (!password) {
      toast.error('Please enter your password.');
      return;
    }
    if (!repeatPassword) {
      toast.error('Please confirm your password.');
      return;
    }
    if (!taxNumber) {
      toast.error('Please enter your tax number.');
      return;
    }
    if (!agreeTerms) {
      toast.error('Please agree to the terms and conditions.');
      return;
    }
    if (!selectedImage) {
      toast.error('Please upload your document picture.');
      return;
    }
    if (!passwordIsValid()) {
      toast.error('Passwords do not match or do not meet the requirements');
      return;
    }
    if (password !== repeatPassword) {
      toast.error('Passwords do not match');
      return;
    }

    const user = {
      username,
      email,
      phoneNumber,
      address,
      password,
      userType,
      taxNumber,
    };

    axios
      .post('http://localhost:4000/api/Register', user)
      .then((response) => {
        if (selectedImage) {
          const formData = new FormData();
          formData.append('taxIdImage', selectedImage);

          const config = {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          };

          axios
            .post('http://localhost:4000/api/Register/uploadImage', formData, config)
            .then((response) => {
              toast.success('Registration and document upload successful!');
              navigate('/Pending');
              resetForm();
            })
            .catch((error) => {
              handleError(error);
            });
        } else {
          toast.success('Registration successful!');
          navigate('/Pending');
          resetForm();
        }
      })
      .catch((error) => {
        handleError(error);
      });
  };

  const handleError = (error) => {
    if (error.response && error.response.data) {
      toast.error(`${error.response.data}`);
    } else {
      toast.error('Registration failed!');
    }
  };

  const resetForm = () => {
    setUsername('');
    setEmail('');
    setPhoneNumber([]);
    setAddress([]);
    setRepeatPassword('');
    setUserType('Donator');
    setRegistrationDocs(false);
    setAgreeTerms(false);
    setSelectedImage(null);
    setTaxNumber('');
    setPasswordError('');
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setSelectedImage(file);
  };

  const passwordIsValid = () => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,15}$/;
    console.log("password:", password);
    console.log("repeatPassword:", repeatPassword);
    console.log("passwordRegex.test(password):", passwordRegex.test(password));
    
    const passwordsMatch = password === repeatPassword;
    console.log("passwordsMatch:", passwordsMatch);
    
    const passwordIsValid = passwordsMatch && passwordRegex.test(password);
    console.log("passwordIsValid:", passwordIsValid);
    
    return passwordIsValid;
  };



  return (
    <div className="account-creation-form">
      <div className="logo-container">
        <img src={logoImage} alt="Logo" className="logo-image" />
      </div>
      <h1>Create New Account</h1>
     
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <label className="username-label">
            <div className="input-container">
              <input
                type="text"
                value={username}
                placeholder="Enter your username"
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          </label>
          <br></br>
          <label className="email-label">
            <div className="input-container">
              <input
                type="email"
                value={email}
                placeholder="Enter your email"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </label>

          <br />
          <label className="phone-label">
  <input
    type="text"
    value={phoneNumber.join(",")}
    placeholder="Phone number"
    onChange={(e) => {
      const phone = e.target.value;

      if (/^0\d{0,10}$/.test(phone)) {
        setPhoneNumber([phone]);
      } 
    }}
  />
</label>
          

          <br />
          <label className="address-label">
            <input
              type="text"
              value={address.join(",")} 
              placeholder="Enter your address"
              onChange={(e) => setAddress(e.target.value.split(","))}
            />
          </label>

          <br />
          <label className="password-label">
            <div className="password-container">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                placeholder="Enter your password"
                onChange={(e) => setPassword(e.target.value)}
                className={`password-input ${passwordError ? 'error' : ''}`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="password-toggle-btn"
              >
                {showPassword ? <BsFillEyeSlashFill /> : <BsFillEyeFill />}
              </button>
            </div>
            {passwordError && <span className="error-message">{passwordError}</span>}
          </label>

          <br />
          <label className={`password-label ${password !== repeatPassword ? 'password-mismatch' : ''}`}>
            <div className="password-container">
              <input
                type={showPassword ? 'text' : 'password'}
                value={repeatPassword}
                placeholder="Repeat password"
                onChange={(e) => setRepeatPassword(e.target.value)}
                className={`password-input ${passwordError ? 'error' : ''}`}
              />
              {password !== repeatPassword && <span className="password-mismatch-mark">✘</span>}
            </div>
          </label>


          <br />
          <label className="user-type-label">
            Enter the type:
            <input
              type="checkbox"
              name="userType"
              value="Donator"
              checked={userType === 'Donator'}
              onChange={(e) => setUserType(e.target.checked ? 'Donator' : '')}
            />
            Donator
            <input
              type="checkbox"
              name="userType"
              value="NGO"
              checked={userType === 'NGO'}
              onChange={(e) => setUserType(e.target.checked ? 'NGO' : '')}
            />
            NGO
          </label>
          <br />
          <div className="box-container">
            <label className="file-input-label">
              <span className="file-input-icon"><i className="fas fa-upload"></i></span>
              <span className="file-input-text">TaxIDImg</span>
              <input
                type="file"
                className="file-input"
                onChange={handleImageChange}
              />
              
            </label>

           
            <input
              type="text"
              id="tax-id-input"
              placeholder="Enter Tax Number"
              value={taxNumber}
              onChange={(e) => {
                const enteredValue = e.target.value;
                if (/^\d{0,9}$/.test(enteredValue)) {
                  setTaxNumber(enteredValue);
                }
              }}
            />
          </div>
          {selectedImage && (
            <img
              src={URL.createObjectURL(selectedImage)}
              alt="Selected"
              height="200px"
            />
          )}
          
          <br />
          <label className="terms-label">
            <input
              type="checkbox"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
            />
            I Agree to 
            <Link to="/TermsAndConditions"><button
              className="link-btn"
            >
              Terms & Conditions
            </button></Link>
          </label>
          <div className="register-green-rectangle"></div>
          <br /> 
          {signupError && <span className="error-message">{signupError}</span>}
          
           <button type="submit" className="register-button">

            Sign Up
             </button>
            
        </form>
        <Link to="/SignIn">
        <button className="link-btn">
          Already Have an Account?
        </button></Link>
        
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default AccountCreationForm;