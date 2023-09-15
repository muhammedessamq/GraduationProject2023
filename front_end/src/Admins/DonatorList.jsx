import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faPhone, faMapMarkerAlt, faIdCard } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import logoImage from '../logo.jpeg';
import "./AdminDashboard.css";
import Navbar from '../Navbar/Navbar';
import { faCheckCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';


export const DonatorList =({ onFormSwitch }) => {
  const [activeIndex, setActiveIndex] = useState(-1);
  const [filterType, setFilterType] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [requirements, setRequirements] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const toggleCollapse = (index) => {
    setActiveIndex(activeIndex === index ? -1 : index);
  };

  const getDonators = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:4000/api/Admin/donators', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const dons = response.data.donators;
      return dons;
    } catch (error) {
      console.log(error);
      toast.error("Error retrieving pending Donator requests from the server");
      return [];
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const dons = await getDonators();
      if (dons && dons.length > 0) {
        const filteredData = dons.filter(req => req.username.toLowerCase().includes(searchQuery.toLowerCase()));
        setRequirements(filteredData);
      } else {
        setRequirements([]);
      }
    } catch (error) {
      console.log(error);
      toast.error("Error retrieving Donators from the server");
    }
  };

  const filteredRequirements = searchQuery
    ? requirements.filter(req => req.username.toLowerCase().includes(searchQuery.toLowerCase()))
    : requirements;
  const displayedRequirements = filteredRequirements.slice(currentPage * pageSize, (currentPage + 1) * pageSize);
  const pageCount = Math.ceil(filteredRequirements.length / pageSize);

  return (
    <div className='All-Admin'>
      <Navbar/>
      <div className="admincontainer1L">
        <div className="buttons-containerL">
          <div className="button1-ngoList">
          <Link to="/AdminDashboard"><button className="b1-admin">
              <h1 className="textngoL">Dashboard</h1>
            </button></Link>
            <Link to="/NGOList"><button className="b1">
              <h1 className="textngoL">Ngos List</h1>
            </button></Link>
          </div>
          </div>
      <div className="button1">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by username"
        />
        
        {displayedRequirements.map((requirement, index) => (
          <div key={requirement._id} className={`reqL-buttons-containerL ${activeIndex === index ? 'expanded' : ''}`}>
            <button
              className={`accordion ${activeIndex === index ? 'active' : ''}`}
              onClick={() => toggleCollapse(index)}
            >
              <div className="req-headerL">
                <p className={`typee ${activeIndex === index ? 'highlight-text' : ''}`}>
                  <FontAwesomeIcon icon={faCheckCircle} color={requirement.status === 'Approved' ? 'green' : requirement.status === 'Rejected' ? 'red' : 'gray'} />
                  {requirement.status}
                </p>
                <p className={`highlight ${activeIndex === index ? 'highlight-text' : ''}`}>
                  <FontAwesomeIcon icon={faUser} /> {requirement.username} | <FontAwesomeIcon icon={faEnvelope} /> {requirement.email}
                </p>
                <p className={`highlight ${activeIndex === index ? 'highlight-text' : ''}`}>
                  <FontAwesomeIcon icon={faIdCard} />  Tax ID: {requirement.taxNumber}
                </p> 
                <p className={`highlight ${activeIndex === index ? 'highlight-text' : ''}`}>
                  <FontAwesomeIcon icon={faPhone} /> Phone Number: {requirement.phoneNumber}
                </p>
                <p className={`highlight ${activeIndex === index ? 'highlight-text' : ''}`}>
                  <FontAwesomeIcon icon={faMapMarkerAlt} /> Address: {requirement.address}
                </p>
                <p className={`document ${activeIndex === index ? 'document' : ''}`}>
                <div className="image-container">
                  <img className="img" src={requirement.taxIdImage} alt="Card Image" style={{ width: '350px', height: '200px' }}/>
                  </div>
                </p>
              </div>
            </button>
          </div>
        ))}
        <div className="paginationL">
          <button
            className="page-buttonL"
            disabled={currentPage === 0}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            Previous
          </button>
          {Array.from(Array(pageCount).keys()).map((index) => (
            <button
              key={index}
              className={`page-buttonL ${currentPage === index ? 'active' : ''}`}
              onClick={() => setCurrentPage(index)}
            >
              {index + 1}
            </button>
          ))}
          <button
            className="page-buttonL"
            disabled={currentPage === pageCount - 1}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            Next
          </button>
        </div>
      </div>
      <ToastContainer />
    </div>
    </div>
  );
};

export default DonatorList;
