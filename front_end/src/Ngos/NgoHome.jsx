import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import moment from 'moment';
import 'moment-timezone';
import 'react-toastify/dist/ReactToastify.css';
import logoImage from '../logo.jpeg';
import './NGOHome.css';
import Navbar from '../Navbar/Navbar';
import { Link } from 'react-router-dom';

export const NGOHome = ({ onFormSwitch }) => {
  const [donations, setDonations] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCards, setExpandedCards] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [cardsPerPage] = useState(9);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [selectedDonationId, setSelectedDonationId] = useState(null);

  useEffect(() => {
    fetchDonations();
  }, []);

  const fetchDonations = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:4000/api/NGOHome', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setDonations(data.donations);
    } catch (error) {
      console.error('Error fetching donations:', error);
    }
  };

  const handleRequest = async (id) => {
    setShowConfirmationModal(true);
    setSelectedDonationId(id);
  };

  const confirmRequest = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:4000/api/NGOHome/request/${selectedDonationId}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success('You have successfully requested donation');
      fetchDonations();
    } catch (error) {
      console.error('Error requesting donation:', error);
      toast.error('Error requesting donation');
    } finally {
      setShowConfirmationModal(false);
      setSelectedDonationId(null);
    }
  };

  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
  };

  const filteredBySearch = donations.filter(
    (donation) =>
    donation.tags.some((tag) => tag.toLowerCase().includes(searchQuery)) ||
      donation.name.toLowerCase().includes(searchQuery) ||
      donation.description.toLowerCase().includes(searchQuery)
  );

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

  const indexOfLastCard = currentPage * cardsPerPage;
  const indexOfFirstCard = indexOfLastCard - cardsPerPage;
  const currentCards = filteredBySearch.slice(indexOfFirstCard, indexOfLastCard);
  const totalPages = Math.ceil(filteredBySearch.length / cardsPerPage);

  const goToNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const goToPreviousPage = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };

  return (
    <div className="NGOhome">
      <Navbar />
      <div className="ngo-container">
        <div className="ngo-navbar">
          <Link to="/NgoRequests">
            <button className="MyRequests">My Requests</button>
          </Link>
          <Link to="/NgoChatPage">
            <button className="MyChat">Chat</button>
          </Link>
          <div className="ngo-search-container">
            <input type="text" placeholder="Search donations" onChange={handleSearch} />
          </div>
        </div>
        <div className="ngo-donations-container">
          {currentCards.length === 0 ? (
            <div className="no-donations-message">No donations available, Please check back later.</div>
          ) : (
            currentCards.map((donation, index) => (
              <div key={donation._id} className="ngo-donation-container">
                <div className="ngo-donation">
                  {expandedCards[index] ? (
                    <div className="donation-details">
                      <h4>Date: {moment(donation.donationDate).tz('Africa/Cairo').format('YYYY-MM-DD h:mm A')}</h4>
                      <h4>Name: {donation.name}</h4>
                      <h4>Description: {donation.description}</h4>
                      <h4>Delivery Status: {donation.deliveryStatus}</h4>
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
                    <div className="NGOdonation-summary">
                      <div className="DonatorDN">
                        <h2 className="DonationName">{donation.name}</h2>
                        <h3>Donator Name:</h3>
                        {donation.donatorName}
                        <h3>Delivery Status:</h3> {donation.deliveryStatus}
                      </div>
                      <br />
                      <span className="DonationDate">
                        {moment(donation.donationDate).tz('Africa/Cairo').format('YYYY-MM-DD h:mm A')}
                      </span>
                      {!donation.purchased && (
                        <button className="ngo-request-button" onClick={() => handleRequest(donation.donationId)}>
                          Request
                        </button>
                      )}
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
          <div className="paginationNGO">
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
          <ToastContainer />
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmationModal && (
        <div className="confirm-delete-modal">
          <div className="modal-content">
            <h2>Confirm Donation Request</h2>
            <p>Are you sure you want to request this donation?</p>
            <div className="button-container">
              <button className="confirm" onClick={confirmRequest}>
                Confirm
              </button>
              <button className="cancel" onClick={() => setShowConfirmationModal(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NGOHome;