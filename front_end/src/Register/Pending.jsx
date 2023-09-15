import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './pending.css';

const Pending = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timeout = setTimeout(() => {
      navigate('/');
    }, 3000);

    return () => {
      clearTimeout(timeout);
    };
  }, [navigate]);

  return (
    <div className="pending-container">
      <i className="fas fa-spinner"></i>
      <h1 className='holkk'>Thank you for your registration</h1>
      <p className='lpooooo'>Our admins are currently reviewing your request and will approve it soon.</p>
    </div>
  );
};

export default Pending;
