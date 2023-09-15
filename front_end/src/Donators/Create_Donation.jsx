import React, { useState } from 'react';
import axios from 'axios';
import './Create_donation.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from '../Navbar/Navbar';



export const Create_Donation = () => {
  const [description, setDescription] = useState('');
  const [deliveryStatus, setDeliveryStatus] = useState('');
  const [name, setName] = useState('');
  const [tags, setTags] = useState(['']);
  const [items, setItems] = useState([{ name: '', quantity: '' }]);


  const handleDeliveryStatusChange = (e) => {
    setDeliveryStatus(e.target.value);
  };

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleTagChange = (index, e) => {
    const updatedTags = [...tags];
    updatedTags[index] = e.target.value;
    setTags(updatedTags);
  };

  const handleAddTag = () => {
    setTags([...tags, '']);
  };

  const handleRemoveTag = (index) => {
    const updatedTags = [...tags];
    updatedTags.splice(index, 1);
    setTags(updatedTags);
  };

  const handleItemNameChange = (index, e) => {
    const updatedItems = [...items];
    updatedItems[index].name = e.target.value;
    setItems(updatedItems);
  };
  const handleItemQuantityChange = (index, e) => {
    const value = e.target.value;
    const regex = /^[0-9]*$/; // Regular expression to allow only integers

    if (value === '') {
      // If the field is empty, set the quantity to an empty string
      const updatedItems = [...items];
      updatedItems[index].quantity = '';
      setItems(updatedItems);
    } else if (regex.test(value)) {
      // If the value is a valid integer, update the quantity
      const updatedItems = [...items];
      updatedItems[index].quantity = parseInt(value); // Parse the value as an integer
      setItems(updatedItems);
    }
  };


  const handleAddItem = () => {
    setItems([...items, { name: '', quantity: '' }]);
  };


  const handleRemoveItem = (index) => {
    const updatedItems = [...items];
    updatedItems.splice(index, 1);
    setItems(updatedItems);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !deliveryStatus || !tags || !items || !description) {
      toast.error('Please fill in all required fields.');
      return;
    }
    if (name.length < 2) {
      toast.error('Name cannot be less than 2 characters');
      return;
    }
    for (let i = 0; i < tags.length; i++) {
      if (tags[i].length < 2) {
        toast.error('Tags cannot be less than 2 characters.');
        return;
      }
    }

    for (let i = 0; i < items.length; i++) {
      if (items[i].name.length < 2) {
        toast.error('Item names cannot be less than 2 characters.');
        return;
      }
    }
    for (let i = 0; i < items.length; i++) {
      if (items[i].quantity <= 0) {
        toast.error('Quantity must be more than 0.');
        return;
      }
    }

    for (let i = 0; i < items.length; i++) {
      for (let j = i + 1; j < items.length; j++) {
        if (items[i].name.toLowerCase() === items[j].name.toLowerCase()) {
          toast.error('Duplicate item names are not allowed.');
          return;
        }
      }
    }


    for (let i = 0; i < tags.length; i++) {
      for (let j = i + 1; j < tags.length; j++) {
        if (tags[i].toLowerCase() === tags[j].toLowerCase()) {
          toast.error('Duplicate tags are not allowed.');
          return;
        }
      }
    }

    try {
      const donation = {
        name,
        deliveryStatus,
        tags,
        items,
        description,
      };
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:4000/api/DonatorHome/createdonation', donation, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success('Donation Created Successfully');
      // Reset the form
      setDeliveryStatus('');
      setName('');
      setTags(['']);
      setItems([{ name: '', quantity: '' }]);
      setDescription('');
      window.history.pushState(null, null, '/mydonations');
      window.location.reload(); // Reload the page to reflect the new URL
    } catch (error) {
      console.error(error);
      toast.error('Failed to create donation. Please try again later.');
    }
  };




  return (
    <div className='Create-Donation-Body'>
      <ToastContainer />
      <Navbar />



      <form className="create-donation-form" onSubmit={handleSubmit}>

        <div className="create-donation-input-group">
          <input
            placeholder="Name"
            className="create-donation-input2"
            maxLength="15"
            type="text"
            value={name}
            required
            minLength="2"
            onChange={handleNameChange}
          />
        </div>

        <div className="frame">
          <div className="create-donation-radio-group">
            Delivery Service:
            <span className="create-donation-radio-option">
              <input
                className="create-donation-radio-option"
                type="radio"
                value="Available"
                checked={deliveryStatus === 'Available'}
                onChange={handleDeliveryStatusChange}
              />
              Available
            </span>

            <span className="create-donation-radio-option">
              <input
                className="create-donation-radio-option"
                type="radio"
                value="Not Available"
                checked={deliveryStatus === 'Not Available'}
                onChange={handleDeliveryStatusChange}
              />
              Not Available
            </span>
          </div>
        </div>

        <div className="frame">
          <div className="create-donation-input-group">
            <label className="create-donation-label">Tags:</label>
            {tags.map((tag, index) => (
              <div className="create-donation-tag-input-group" key={index}>
                <input
                  className="create-donation-input"
                  type="text"
                  maxLength="10"
                  value={tag}
                  onChange={(e) => handleTagChange(index, e)}
                />
                {index !== 0 && (
                  <button
                    className="create-donation-remove"
                    type="button"
                    onClick={() => handleRemoveTag(index)}
                  >
                    -
                  </button>
                )}
              </div>
            ))}
            <button className="create-donation-add-tag" type="button" onClick={handleAddTag}>
              +
            </button>
          </div>
        </div>

        <div className="frame">
          <div className="create-donation-input-group">
            <label className="create-donation-label">Items:</label>
            <div className="create-donation-items">
              {items.map((item, index) => (
                <div className="create-donation-item-input-group" key={index}>
                  <input
                    className="create-donation-input create-donation-item-name"
                    type="text"
                    placeholder="Name"
                    maxLength="15"
                    value={item.name}
                    onChange={(e) => handleItemNameChange(index, e)}
                  />
                  <input
                    className="create-donation-input create-donation-item-quantity"
                    type="text"
                    placeholder="# No. of Meals"
                    maxLength="3"
                    value={item.quantity}
                    onChange={(e) => handleItemQuantityChange(index, e)}
                  />
                  {index !== 0 && (
                    <button
                      className="create-donation-remove"
                      type="button"
                      onClick={() => handleRemoveItem(index)}
                    >
                      -
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button className="create-donation-add-item" type="button" onClick={handleAddItem}>
              +
            </button>
          </div>
        </div>
        <textarea
          className="description"
          id="description"
          maxLength="200"
          required
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        ></textarea>

        <button className="create-donation-submit" type="submit" onClick={handleSubmit}>
          Send
        </button>

      </form>
    </div>

  );
};

export default Create_Donation;