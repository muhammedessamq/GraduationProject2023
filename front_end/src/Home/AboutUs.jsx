import React from 'react';
import './AboutUs.css';
import NavbarUS from '../Navbar/NavbarUs';

export const Aboutus = ({ onFormSwitch }) => {
  return (
    <div>
      <NavbarUS />
      
      <div className="aboutus-container">
        <h1 className="aboutus-title">About Us</h1>

        <div className="aboutus-section">
          <h2 className="aboutus-section-title">Our Mission</h2>
          <p className="aboutus-section-content">To transform surplus food into opportunities to make the world a kinder place.</p>
        </div>

        <div className="aboutus-section">
          <h2 className="aboutus-section-title">Our Vision</h2>
          <p className="aboutus-section-content">A world where no good food goes to waste.</p>
        </div>

        <div className="aboutus-section">
          <h2 className="aboutus-section-title">Our Values</h2>
          <ul className="aboutus-values-list">
            <li className="aboutus-value"><h3>Integrity</h3>We uphold the highest ethical standards in all our actions.</li>
            <li className="aboutus-value"><h3>Innovation</h3>We constantly seek new and better ways to serve our customers.</li>
            <li className="aboutus-value"><h3>Collaboration</h3>We believe in working together to achieve shared goals.</li>
            <li className="aboutus-value"><h3>Customer Focus</h3>We put our customers at the center of everything we do.</li>
          </ul>
        </div>

        <div className="aboutus-section">
  <h2 className="aboutus-section-title">Team</h2>
  <p className="aboutus-section-content">
    We have a dedicated team of professionals who are passionate about what they do and committed to delivering exceptional results.
  </p>

  <div className="aboutus-team-members">
    <div className="aboutus-team-member">
      <h3>Sohaila Mohamed</h3>
    </div>
    <div className="aboutus-team-member">
      <h3>Lilian Nagy</h3>
    </div>
    <div className="aboutus-team-member">
      <h3>Mohamed Essam</h3>
    </div>
    <div className="aboutus-team-member">
      <h3>Ziad Alaa</h3>
    </div>
    <div className="aboutus-team-member">
      <h3>Mohamed Mahmoud</h3>
    </div>
  </div>
</div>

      </div>
    </div>
  );
};

export default Aboutus;