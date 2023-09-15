import React from 'react';
import logoImage from '../logo.jpeg';
import "./HomePage.css";
import { Link } from 'react-router-dom';

export const HomePage = ({ onFormSwitch }) => {
 
  const handleContactClick = () => {
    const email = 'wasteless.egy@gmail.com';
    const subject = 'Contact Wasteless Support Team';
    const body = 'Hello Wasteless Team,';

    window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <div className='HomeMain'>
      {/* Navbar */}
      <nav className="nav">
      
      <a href='/' className='site-title'>
        </a>
      <ul className="left-nav">
          <li>
            <Link to="/AboutUs"><button className="transparent-buttonL">About</button></Link>
          </li>
         
          <li>
          <button className="transparent-buttonL"  onClick={handleContactClick}>Contact Us</button>
          </li>
        </ul>
        
        

        <ul className="right-nav">
          <li>
            <Link to="/AccountCreationForm"><button className="transparent-button">Sign up</button></Link>
          </li>
          <li>
            <Link to="/SignIn"><button className="transparent-button" >Sign in</button></Link>
          </li>
        </ul>
      </nav>
      <div className="content">
        <div className="image-container">
          <img src={logoImage} alt="Image" className="content-image" />
          <Link to="/TermsAndConditions"><button className="round-button">Learn more</button></Link>
        
        </div>
        <p className="content-paragraph">
        Food Waste Management System to connect the NGOs with Food Businesses.
        </p>
        </div>
        <div >
            <p className="about-us-paragraph">
             <p className="about-us-inside">ABOUT US</p>
              Wasteless is a web application that makes food businesses offer leftover food on the website, and NGOs request this food to be distributed among those in need. Once the request is accepted, NGOs can collect food from food businesses for distribution. In this way, the food waste management system will help to reduce food waste and feed poor and needy people.            </p>
        </div>


    </div>
  );
}
export default HomePage;