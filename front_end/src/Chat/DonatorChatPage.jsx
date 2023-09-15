import React, { useRef, useState, useEffect } from "react";
import { BsFillChatFill } from "react-icons/bs";
import axios from "axios";
import moment from 'moment';
import 'moment-timezone';
import Navbar from "../Navbar/Navbar";
import jwt_decode from "jwt-decode"; 

import "./ChatPage.css";

const DonatorChatPage = ({ onFormSwitch }) => {
  const inputRef = useRef(null);
  const [chatInstances, setChatInstances] = useState([]);
  const [selectedChatInstance, setSelectedChatInstance] = useState(null);
  const [messages, setMessages] = useState({});
  const [messageText, setMessageText] = useState("");
  const initials = (ngoName) => ngoName ? ngoName.substr(0, 2).toUpperCase() : '';
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [deliveryDonationId, setDeliveryDonationId] = useState(null);

  useEffect(() => {
    fetchChatInstances();
    // Start fetching messages periodically
    const interval = setInterval(() => {
      if (selectedChatInstance) {
        fetchChatMessages(selectedChatInstance);
      }
    }, 3000); // Fetch messages every 3 seconds

    // Clean up the interval on unmount
    return () => clearInterval(interval);
  }, []);

  // Fetch chat instances from the API
  const fetchChatInstances = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:4000/api/DonatorHome/chatinstances", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setChatInstances(response.data.chatInstances.reverse());
    } catch (error) {
      console.log(error);
    }
  };

  // Fetch chat messages for the selected chat instance
  useEffect(() => {
    if (selectedChatInstance) {
      fetchChatMessages(selectedChatInstance);
    }
  }, [selectedChatInstance]);

  // Fetch chat messages from the API
  const fetchChatMessages = async (chatInstanceId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:4000/api/DonatorHome/chat/${chatInstanceId}/messages`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessages((prevMessages) => ({
        ...prevMessages,
        [chatInstanceId]: response.data.chatMessages,
      }));
    } catch (error) {
      console.log(error);
    }
  };

  const handleInputChange = () => {
    const input = inputRef.current;
    if (input) {
      const { scrollWidth, clientWidth } = input;
      if (scrollWidth > clientWidth) {
        input.style.height = "auto";
        input.style.height = `${input.scrollHeight}px`;
      } else {
        input.style.height = "auto";
      }
    }
  };

  const handleChatInstanceClick = (chatInstance) => {
    setSelectedChatInstance(chatInstance);
  };

  const handleSendMessage = async () => {
    if (messageText.trim() !== "" && selectedChatInstance) {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.post(
          `http://localhost:4000/api/DonatorHome/chat/${selectedChatInstance}/message`,
          { message: messageText },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const newMessage = response.data.chatMessage;
        if (newMessage) {
          setMessages((prevMessages) => ({
            ...prevMessages,
            [selectedChatInstance]: [
              ...(prevMessages[selectedChatInstance] || []),
              newMessage,
            ],
          }));
          setMessageText("");
        } else {
          console.log("Received invalid message data from the server");
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  
  const handleDeliverDonation = async () => {
    try {
      const token = localStorage.getItem("token");
      const donationId = deliveryDonationId;
  
      // Call the delivery endpoint
      await axios.put(
        `http://localhost:4000/api/DonatorHome/deliverdonation/${donationId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      console.log("Donation delivered successfully");
      fetchChatInstances();
  
      setShowDeleteConfirmation(false);
      setDeliveryDonationId(null);
    } catch (error) {
      console.log(error);
    }
  };
  
  const cancelDeleteDonation = () => {
    setShowDeleteConfirmation(false);
    setDeliveryDonationId(null);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Retrieve the userId from the token
  const token = localStorage.getItem("token");
  const decodedToken = jwt_decode(token);
  const userId = decodedToken.userId;

  return (
    <div>
      <Navbar />
      <div className="rectangle-container-chat">
        <div className="rectangle rectangle-left-chat">
        {chatInstances.map((chatInstance) => (
  <div
    key={chatInstance.chatInstanceId}
    className={`user-rectangle-left-donator ${selectedChatInstance === chatInstance.chatInstanceId ? "selected" : ""}`}
    onClick={() => handleChatInstanceClick(chatInstance.chatInstanceId)}
  >
    <div className="user-circle-left">{initials(chatInstance.ngoName)}</div>
    <div className="username-left">
      {chatInstance.ngoName + ", " + chatInstance.donationName + " Donation #" + chatInstance.donationId}
    </div>
    <button
      className="deliver-button"
      onClick={() => {
        setDeliveryDonationId(chatInstance.donationId);
        setShowDeleteConfirmation(true);
      }}
    >
      Complete
    </button>
  </div>
))}

        </div>
        <div className="rectangle rectangle-right-chat">
          <div className="message-display-right">
            {selectedChatInstance && messages[selectedChatInstance] ? (
              messages[selectedChatInstance].map((message) => (
                <div
                  key={message._id}
                  className={`message-text ${message.senderId === userId ? "sent" : "received" }`}
                >
                  <div className="message-content">{message.message}</div>
                  <div className="message-timestamp">{moment(message.timestamp).tz('Africa/Cairo').format('YYYY-MM-DD h:mm A')}</div>
                </div>
              ))
            ) : (
              <div className="empty-message">Select a chat instance to start messaging</div>
            )}
          </div>

          <div className="message-form">
            <textarea
              ref={inputRef}
              placeholder="Write a message..."
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              onKeyPress={handleKeyPress}
            ></textarea>
            <button
              className={`send-button-message ${messageText.trim() === "" ? "empty" : ""}`}
              onClick={handleSendMessage}
            >
              <BsFillChatFill />
            </button>

            <div className="confirm-delete-modal" style={{ display: showDeleteConfirmation ? 'flex' : 'none' }}>
              <div className="modal-content">
                <h2>Are you sure you want to end chat?</h2>
                <div className="button-container">
                  <button className="cancel" onClick={cancelDeleteDonation}>
                    Cancel
                  </button>
                  <button className="confirm" onClick={() => handleDeliverDonation()}>
                    Confirm
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default DonatorChatPage;
