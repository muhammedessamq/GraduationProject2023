import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faPhone, faMapMarkerAlt, faIdCard } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import "./AdminDashboard.css";
import Navbar from '../Navbar/Navbar';
import { Link } from 'react-router-dom';


export const AdminDashboard = ({ onFormSwitch }) => {
  const [activeIndex, setActiveIndex] = useState(-1);
  const [filterType, setFilterType] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [requirements, setRequirements] = useState([]);


  const toggleCollapse = (index) => {
    setActiveIndex(activeIndex === index ? -1 : index);
  };

  const getPendingDonators = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:4000/api/Admin/pendingDonators', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const donators = response.data.donators;
      return donators;
    } catch (error) {
      console.log(error);
      toast.error("Error retrieving pending NGO requests from the server");
      return [];
    }
  };

  const getPendingNGOs = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:4000/api/Admin/pendingNgos', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const ngos = response.data.NGOs;
      return ngos;
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
    const ngos = await getPendingNGOs();
    const donators = await getPendingDonators();
    const data = [...ngos, ...donators];
    setRequirements(data);
  };

  const approveDonator = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`http://localhost:4000/api/Admin/approveDonator/${id}`, null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("Donator request approved successfully");
      fetchData();
    } catch (error) {
      console.log(error);
      toast.error("Error approving donator request");
    }
  };

  const approveNGO = async (id) => {
    try {
      console.log(id);
      const token = localStorage.getItem('token');
      await axios.post(`http://localhost:4000/api/Admin/approveNgo/${id}`, null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("NGO request approved successfully");
      fetchData();
    } catch (error) {
      console.log(error);
      toast.error("Error approving NGO request");
    }
  };

  const rejectDonator = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`http://localhost:4000/api/Admin/rejectDonator/${id}`, null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("Donator request rejected");
      fetchData();
    } catch (error) {
      console.log(error);
      toast.error("Error rejecting donator request");
    }
  };

  const rejectNGO = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`http://localhost:4000/api/Admin/rejectNgo/${id}`, null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("NGO request rejected");
      fetchData();
    } catch (error) {
      console.log(error);
      toast.error("Error rejecting NGO request");
    }
  };

  const filteredRequirements = filterType ? requirements.filter(req => req.type === filterType) : requirements;
  const displayedRequirements = filteredRequirements.slice(currentPage * pageSize, (currentPage + 1) * pageSize);
  const pageCount = Math.ceil(filteredRequirements.length / pageSize);

  return (
    <div className='All-Admin'>
      <Navbar />
      <div className="admincontainer1L">
        <div className="buttons-containerL">
          <div className="button1">

          </div>
          <div className="button1">
            <Link to="/DonatorList"><button className="b">
              <h1 className="textL">Donators List</h1>
            </button></Link>
          </div>
          <div className="button1">
            <Link to="/NGOList"><button className="b">
              <h1 className="textL">NGO List</h1>
            </button></Link>
          </div>
        </div>
      </div>
      <div className="admincontainerL">

        {displayedRequirements.length > 0 ? (

          displayedRequirements.map((requirement, index) => (
            <div key={requirement._id} className={`reqL-buttons-containerL ${activeIndex === index ? 'expanded' : ''}`}>
              <button
                className={`accordion ${activeIndex === index ? 'active' : ''}`}
                onClick={() => toggleCollapse(index)}
              >
                <div className="req-headerL">
                  <p className={`type ${activeIndex === index ? 'highlight-text' : ''}`}>
                    <i className="typee">{requirement.userType}</i>
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
                      <img className="img" src={requirement.taxIdImage} alt="Card Image" style={{ width: '350px', height: '200px' }} />
                    </div>
                  </p>

                </div>
                {activeIndex === index && (
                  <div className="req-actionsL">
                    {requirement.userType === 'Donator' && (
                      <>
                        <button className="approveL" onClick={() => approveDonator(requirement.donatorId)}>
                          Approve
                        </button>
                        <button className="rejectL" onClick={() => rejectDonator(requirement.donatorId)}>
                          Reject
                        </button>
                      </>
                    )}
                    {requirement.userType === 'NGO' && (
                      <>
                        <button className="approveL" onClick={() => approveNGO(requirement.ngoId)}>
                          Approve
                        </button>
                        <button className="rejectL" onClick={() => rejectNGO(requirement.ngoId)}>
                          Reject
                        </button>
                      </>
                    )}
                  </div>
                )}</button>

            </div>
          ))
        ) : (
          <div className="no-requests-message">
            <p>No requests found, Please cheack back later</p>
          </div>
        )}

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
  );
};

export default AdminDashboard;