import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import moment from 'moment';
import 'moment-timezone';
import 'react-toastify/dist/ReactToastify.css';
import logoImage from '../logo.jpeg';
import './NGOHome.css';
import Navbar from '../Navbar/Navbar';
import { Link } from 'react-router-dom';

export const NgoRequests = ({ onFormSwitch }) => {
  const [requests, setRequests] = useState([]);
  const [filterType, setFilterType] = useState({ purchased: true, all: false });
  const [showDelivery, setShowDelivery] = useState(false);
  const [selectedDonation, setSelectedDonation] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCards, setExpandedCards] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [cardsPerPage] = useState(9);
  const [filteredDonations, setFilteredDonations] = useState([]);
  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:4000/api/NGOHome/myrequests', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setRequests(data.requests.reverse());
    } catch (error) {
      console.error('Error fetching requests:', error);
    }
  };

  const handleSearch = event => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
  };

  const filteredBySearch = requests.length > 0 ? requests.filter(
    request =>
      request.donationName.toLowerCase().includes(searchQuery) ||
      request.description.toLowerCase().includes(searchQuery)
  ) : [];

  const handleCardToggle = (requestId) => {
    setExpandedCards((prevExpandedCards) => {
      const updatedExpandedCards = [...prevExpandedCards];
      const index = updatedExpandedCards.indexOf(requestId);
      if (index !== -1) {
        updatedExpandedCards.splice(index, 1);
      } else {
        updatedExpandedCards.push(requestId);
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
    <div className='NGOhome'>
      <Navbar />
      <div className="ngo-container">


        <div className="ngo-navbar">

        <Link to="/NGOHome"><button className="MyRequests">
        Donations Dashboard
        </button></Link>
          <div className="ngo-search-container">
            <input type="text" placeholder="Search donations" onChange={handleSearch} />
          </div>
        </div>
        <div className="ngo-donations-container">

          {currentCards.map((request, index) => (
            <div key={request._id} className="ngo-donation-container">
              <div className="ngo-donation">

                {expandedCards[index] ? (
                  <div className="donation-details">
                    <h4>Request Date: {moment(request.requestDate).tz('Africa/Cairo').format('YYYY-MM-DD h:mm A')}</h4>
                    <h4>Name: {request.donationName}</h4>
                    <h4>Description: </h4> {request.description}
                    <h4>Delivery Status</h4> {request.deliveryStatus}
                    {request.donationItems && request.donationItems.length > 0 && (
                      <div>
                        <h4>Items:</h4>
                        <ul>
                          {request.donationItems.map((donationItems, index) => (
                            <li key={index}>
                              {donationItems.name} - Quantity: {donationItems.quantity}
                            </li>
                          ))}
                        </ul>
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

                    <div className='DonatorDN'>

                      <h2 className='DonationName'>{request.donationName}</h2>
                      <h3 class="requestStatus">{request.donationStatus}</h3> 
                      <h3 >Donator Name:</h3>{request.donatorName}
                      <h3>Delivery Status:</h3> {request.deliveryStatus}
                      
                    </div>

                    <br />  <span className='DonationDate'>{moment(request.requestDate).tz('Africa/Cairo').format('YYYY-MM-DD h:mm A')}</span>

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
          ))}
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

    </div>
  );
};

export default NgoRequests;