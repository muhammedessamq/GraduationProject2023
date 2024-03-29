import React, { useState, useEffect } from 'react';
import './MyDonations.css';
import axios from 'axios';
import moment from 'moment';
import 'moment-timezone';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter, faAngleRight, faAngleLeft } from '@fortawesome/free-solid-svg-icons';
import Navbar from '../Navbar/Navbar';
import { Link } from 'react-router-dom';

const MyDonations = () => {
  const [donations, setDonations] = useState([]);
  const [filteredDonations, setFilteredDonations] = useState([]);
  const [statusFilter, setStatusFilter] = useState('All');
  const [deliveryStatusFilter, setDeliveryStatusFilter] = useState('All');
  const [expandedCards, setExpandedCards] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [cardsPerPage] = useState(3);
  const [deleteDonationId, setDeleteDonationId] = useState(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);


  useEffect(() => {
    fetchDonations();
    applyFilters();
  }, [donations, statusFilter, deliveryStatusFilter]);

  const fetchDonations = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:4000/api/DonatorHome/', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setDonations(response.data.donations.reverse());
    } catch (error) {
      console.log(error);
    }
  };

  const handleRemoveDonation = (donationId) => {
    setDeleteDonationId(donationId);
    setShowDeleteConfirmation(true);
  };

  const confirmDeleteDonation = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `http://localhost:4000/api/DonatorHome/removedonation/${deleteDonationId}`,
        null,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchDonations();
      toast.success('Donation removed successfully.');
      setShowDeleteConfirmation(false);
      setDeleteDonationId(null);
    } catch (error) {
      console.log(error);
      toast.error('Failed to remove donation.');
    }
  };

  const cancelDeleteDonation = () => {
    setShowDeleteConfirmation(false);
    setDeleteDonationId(null);
  };

  const applyFilters = () => {
    let filtered = donations;

    if (statusFilter !== 'All') {
      filtered = filtered.filter((donation) => donation.donationStatus === statusFilter);
    }

    if (deliveryStatusFilter !== 'All') {
      filtered = filtered.filter((donation) => donation.deliveryStatus === deliveryStatusFilter);
    }

    setFilteredDonations(filtered);
  };

  const handleStatusOptionClick = (option) => {
    setStatusFilter(option);
 
  };

  const handleDeliveryOptionClick = (option) => {
    setDeliveryStatusFilter(option);
  
  };

  
  const toggleFilterDropdown = () => {
    const dropdown = document.querySelector(".filter-dropdown");
    dropdown.style.display = dropdown.style.display === "none" ? "block" : "none";
  };
  
  // Pagination Logic
  const indexOfLastCard = currentPage * cardsPerPage;
  const indexOfFirstCard = indexOfLastCard - cardsPerPage;
  const currentCards = filteredDonations.slice(indexOfFirstCard, indexOfLastCard);
  const totalPages = Math.ceil(filteredDonations.length / cardsPerPage);

  const goToNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const goToPreviousPage = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };

  const handleCardToggle = (donationId) => {
    setExpandedCards((prevExpandedCards) => {
      const updatedExpandedCards = [...prevExpandedCards];
      const index = updatedExpandedCards.indexOf(donationId);
      if (index !== -1) {
        updatedExpandedCards.splice(index, 1);
      } else {
        updatedExpandedCards.push(donationId);
      }
      return updatedExpandedCards;
    });
  };

  return (
    <div>
      <Navbar />
      <div className="container21">
        <Link to="/DonatorHistory">
          <button className="History">History</button>
        </Link>
        <Link to="/Create_Donation">
          <button className="AddNewButton">Add New Donation</button>
        </Link>
        <Link to="/DonatorChatPage">
          <button className="DonatorChatPage">Chat</button>
        </Link>

        <div className="filter-container">
          <div className="FilterBy">Filter By:</div>
          <div className="filter-button" onClick={toggleFilterDropdown}>
            <FontAwesomeIcon icon={faFilter} />
          </div>
          <div className={'filter-dropdown '}>
            <div className="filter-section">
              <div className="filter-header">Status</div>
              <div className="filter-options">
                <label>
                  <input
                    type="checkbox"
                    value="All"
                    checked={statusFilter === 'All'}
                    onChange={() => handleStatusOptionClick('All')}
                  />
                  All
                </label>
                <label>
                  <input
                    type="checkbox"
                    value="Available"
                    checked={statusFilter === 'Available'}
                    onChange={() => handleStatusOptionClick('Available')}
                  />
                  Available
                </label>
                <label>
                  <input
                    type="checkbox"
                    value="Delivered"
                    checked={statusFilter === 'Delivered'}
                    onChange={() => handleStatusOptionClick('Delivered')}
                  />
                  Delivered
                </label>
                <label>
                  <input
                    type="checkbox"
                    value="Removed"
                    checked={statusFilter === 'Removed'}
                    onChange={() => handleStatusOptionClick('Removed')}
                  />
                  Removed
                </label>
                <label>
                  <input
                    type="checkbox"
                    value="Requested"
                    checked={statusFilter === 'Requested'}
                    onChange={() => handleStatusOptionClick('Requested')}
                  />
                  Requested
                </label>
              </div>
            </div>
            <div className="filter-section">
              <div className="filter-header">Delivery Status</div>
              <div className="filter-options">
                <label>
                  <input
                    type="checkbox"
                    value="All"
                    checked={deliveryStatusFilter === 'All'}
                    onChange={() => handleDeliveryOptionClick('All')}
                  />
                  All Delivery Status
                </label>
                <label>
                  <input
                    type="checkbox"
                    value="Available"
                    checked={deliveryStatusFilter === 'Available'}
                    onChange={() => handleDeliveryOptionClick('Available')}
                  />
                  Available for Delivery
                </label>
                <label>
                  <input
                    type="checkbox"
                    value="Not Available"
                    checked={deliveryStatusFilter === 'Not Available'}
                    onChange={() => handleDeliveryOptionClick('Not Available')}
                  />
                  Not Available for Delivery
                </label>
              </div>
            </div>
          </div>
        </div>
        <div className="buttons-container">
          {currentPage > 1 && (
            <button className="page-arrow-left" onClick={goToPreviousPage}>
              <FontAwesomeIcon icon={faAngleLeft} />
            </button>
          )}
          {currentCards.length === 0 ? (
            <div className="no-donations-message">No donations available</div>
          ) : (

          currentCards.map((donation, index) => (
            <div className="card text-center" key={donation.donationId}>
              <div className="card-content">
                <div className="title">
                  <h2>Donation #{donation.donationId}</h2>
                  <h4 className="status">{donation.donationStatus}</h4>
               
                </div>
                {expandedCards[index] ? (
                  <div className="donation-details">
                    <h4>Date:{moment(donation.donationDate).tz('Africa/Cairo').format('YYYY-MM-DD h:mm A')}</h4>
                    <h4>Name: {donation.name}</h4>
                    <h4>Description: </h4> {donation.description}
                    <h4>Delivery Status</h4> {donation.deliveryStatus}
                    {donation.items && donation.items.length > 0 && (
                      <div>
                        <h4>Items:</h4>
                        <ul>
                          {donation.items.map((item, index) => (
                            <li key={index}>
                              {item.name} - Quantity: {item.quantity}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    <h4>Tags:</h4>
                    {donation.tags && donation.tags.length > 0 && (
                      <div className="tag-container">
                        {donation.tags.map((tag, index) => (
                          <div className="tag" key={index}>
                            {tag}
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {donation.donationStatus !== 'Removed' && donation.donationStatus !== 'Requested' && donation.donationStatus !== 'Delivered' &&(
                      <div className="button-container">
                        <button className="reject" onClick={() => handleRemoveDonation(donation.donationId)}>
                          Delete
                        </button>
                       
                      </div>
                      
                    )}
                     <button
                          className="expand-button"
                          onClick={() => {
                            const updatedExpandedCards = [...expandedCards];
                            updatedExpandedCards[index] = false;
                            setExpandedCards(updatedExpandedCards);
                          }}
                        >
                          -
                        </button>
                  </div>
                ) : (
                  <div className="donation-summary">
                    <h3>Date:</h3> {moment(donation.donationDate).tz('Africa/Cairo').format('YYYY-MM-DD h:mm A')}
                 
                    <h3>Name:</h3>
                    {donation.name}
                
                    <h3>Delivery Status:</h3> {donation.deliveryStatus}
                    <button
                      className="expand-button"
                      onClick={() => {
                        const updatedExpandedCards = [...expandedCards];
                        updatedExpandedCards[index] = true;
                        setExpandedCards(updatedExpandedCards);
                      }}
                    >
                      +
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
          )}
          {currentPage < totalPages && (
            <button className="page-arrow-right" onClick={goToNextPage}>
              <FontAwesomeIcon icon={faAngleRight} />
            </button>
          )}
        <div className="pagination">
            <button onClick={goToPreviousPage} disabled={currentPage === 1}>
              Previous
            </button>
            <div className="page-numbers">
              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  key={index + 1}
                  className={currentPage === index + 1 ? 'active' : ''}
                  onClick={() => setCurrentPage(index + 1)}
                >
                  {index + 1}
                </button>
              ))}
            </div>
            <button onClick={goToNextPage} disabled={currentPage === totalPages}>
              Next
            </button>
          </div>

          <div className="confirm-delete-modal" style={{ display: showDeleteConfirmation ? 'flex' : 'none' }}>
            <div className="modal-content">
              <h2>Are you sure you want to delete this donation?</h2>
              <div className="button-container">
                <button className="cancel" onClick={cancelDeleteDonation}>
                  Cancel
                </button>
                <button className="confirm" onClick={confirmDeleteDonation}>
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyDonations;