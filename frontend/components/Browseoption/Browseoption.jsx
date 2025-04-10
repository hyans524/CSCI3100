import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './Browseoption.css';

const Browseoption = ({ 
    initialValue = '', 
    placeholder = 'Browse...', 
    onBrowse, 
    disabled = false 
  }) => {
    const [value, setValue] = useState(initialValue);
  
    const handleBrowseClick = () => {
      if (onBrowse) {
        const selectedValue = onBrowse();
        if (selectedValue !== undefined) {
          setValue(selectedValue);
        }
      }
    };
  
    return (
    <><div className="centered-container">
          <h1 className='title-for-browse-box'>Search for your trip</h1>
          <div className="browser-box-container">        
            
            <input
              type="text"
              className="browser-box-input"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={placeholder}
              disabled={disabled} />
            <button
              className="browser-box-button"
              onClick={handleBrowseClick}
              disabled={disabled}
            >
              Browse
            </button>
          </div>
          <div class="recommendations">
            <div class="recommendation-header">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#6d28d9">
                <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z"/>
                <path d="M12 7a1 1 0 0 0-1 1v4a1 1 0 0 0 .293.707l2 2a1 1 0 0 0 1.414-1.414L13 11.586V8a1 1 0 0 0-1-1z"/>
              </svg>
              Recommended for you
            </div>
            <div class="recommendation-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6d28d9">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
              </svg>
              Hidden gems in Portugal
            </div>
            <div class="recommendation-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6d28d9">
                <path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/>
              </svg>
              Eco-friendly stays
            </div>
          </div>
        </div></>
    );
  };
  
  Browseoption.propTypes = {
    initialValue: PropTypes.string,
    placeholder: PropTypes.string,
    onBrowse: PropTypes.func.isRequired,
    disabled: PropTypes.bool
  };
export default Browseoption

