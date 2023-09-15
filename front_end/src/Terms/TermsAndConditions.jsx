import React from 'react';
import './TermsAndConditions.css';
import { Link } from 'react-router-dom';


export const TermsAndConditions = ({ onFormSwitch }) => {
  return (
    <div className='MainTerms'>
      <h1>Terms and Conditions</h1>
      <p className='p1'>
        Food Waste Management System is a web application which makes food businesses offer their leftover food on the website and NGOs request this food to distribute it among those in need. Once the request is accepted, the NGOs can collect the food from the food businesses for its distribution. In this way, the food waste management system will help in reducing food waste and feeding the poor and needy people.
      </p>
      <p className='p3'>
        Please read these terms and conditions carefully before using the Food Waste Management System, by accessing and using the website, you agree to comply with these terms :-
      </p>
      <h2>1. Acceptance of Terms</h2>
      <p className='p2'>
        By accessing and using the Food Waste Management System website, you agree to comply with these Terms and Conditions. If you do not agree with any part of these terms, please refrain from using the website.
      </p>
      <h2>2. Description of Service</h2>
      <p className='p2'>
        The Food Waste Management System is a web application designed to facilitate the donation of leftover food from food businesses to NGOs for distribution among people in need. The system acts as a platform for food businesses to offer their surplus food and for NGOs to request and collect the donated food.
      </p>
      <h2>3. Account Creation</h2>
      <p className='p2'>
        To participate in the Food Waste Management System, users must create an account. You agree to provide accurate and up-to-date information during the registration process. You are responsible for maintaining the confidentiality of your account information and for all activities that occur under your account.
      </p>
      <h2>4. Limitation of Liability</h2>
      <p className='p2'>
        The Food Waste Management System and its creators shall not be held liable for any damages, losses, or liabilities arising out of the use or inability to use the system, including but not limited to any direct, indirect, incidental, special, or consequential damages.      </p>



      <h1>NGOs Terms:</h1>
      <h2>1. Eligibility</h2>
      <p className='p2'>
        a. NGOs must be registered and recognized as charitable organizations.
        b. NGOs must comply with all local laws and regulations regarding food distribution and safety.      </p>
      <h2>2. Account Creation</h2>
      <p className='p2'>
        a. NGOs must create an account to request and collect donated food through the system.
        <br />  b. NGOs agree to provide accurate and up-to-date information during the registration process.
        <br />  c. NGOs are responsible for maintaining the confidentiality of their account information.      </p>
      <h2>3. Food Distribution</h2>
      <p className='p2'>
        a. NGOs must ensure proper distribution of the donated food to people in need.
        <br /> b. NGOs must adhere to food safety guidelines and regulations during the handling and distribution of the donated food.
        <br />   c. NGOs are responsible for verifying the quality, safety, and validity for consumption of the donated food.      </p>
      <h2>4. Compliance</h2>
      <p className='p2'>
        a. NGOs must comply with all applicable laws, regulations, and policies related to food donation and distribution.
        <br />   b. NGOs agree to use the Food Waste Management System for its intended purpose and in accordance with these Terms and Conditions.
      </p>
      <h1>Donators Terms:</h1>
      <h2>1. Eligibility</h2>
      <p className='p2'>a. Food businesses must be authorized to donate food according to local laws and regulations.</p>
      <h2>2. Account Creation</h2>
      <p className='p2'>a. Food businesses must create an account to offer their leftover food through the system.
        <br /> b. Food businesses agree to provide accurate and up-to-date information during the registration process.
        <br /> c. Food businesses are responsible for maintaining the confidentiality of their account information.</p>
      <h2 >3. Food Donations</h2>
      <p className='p2'>a. Food businesses must ensure that the donated food is safe, of suitable quality, and fit for consumption.
        <br />  b. Only food that is safe and fit for consumption should be offered for donation.
        <br />  c. Food businesses should adhere to all applicable food safety guidelines and regulations.</p>
      <h2>4. Compliance</h2>
      <p className='p2'>a. Food businesses must comply with all applicable laws, regulations, and policies related to food donation and safety.
        <br /> b. Food businesses agree to use the Food Waste Management System for its intended purpose and in accordance with these Terms and Conditions.</p>

      <Link to="/AccountCreationForm"><button
        className="btnCreate">
       Create New Account
      </button></Link>

      <Link to="/"><button
        className="btnHome">
        Home Page
      </button></Link>
    </div>
  );
};

export default TermsAndConditions;