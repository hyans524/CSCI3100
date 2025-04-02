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
    <div className="centered-container">
        <div className="browser-box-container">
          <input
            type="text"
            className="browser-box-input"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={placeholder}
            disabled={disabled}
          />
          <button 
            className="browser-box-button" 
            onClick={handleBrowseClick}
            disabled={disabled}
          >
            Browse
          </button>
        </div>
      </div>
    );
  };
  
  Browseoption.propTypes = {
    initialValue: PropTypes.string,
    placeholder: PropTypes.string,
    onBrowse: PropTypes.func.isRequired,
    disabled: PropTypes.bool
  };
export default Browseoption

