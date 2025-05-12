import React, { useState, useEffect } from 'react';
import { postApi } from '../../src/utils/api';

const Searchbox = ({ onSearch }) => {
  
  // State for form inputs
  const [destination, setDestination] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [priceValue, setPriceValue] = useState(500);
  
  // State for location suggestions
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [allLocations, setAllLocations] = useState([]);

  // autocomplete
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await postApi.getAll();
        if (response.data) {
          const locations = [...new Set(response.data.map(post => post.location))];
          setAllLocations(locations);
        }
      } catch (error) {
        console.error("Error fetching locations:", error);
      }
    };

    fetchLocations();
  }, []);


  const handleDestinationChange = (e) => {
    const value = e.target.value;
    setDestination(value);
    
    if (value.trim() === '') {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    
    const filteredLocations = allLocations.filter(location => 
      location.toLowerCase().includes(value.toLowerCase())
    );
    
    setSuggestions(filteredLocations);
    setShowSuggestions(true);
  };

  const selectSuggestion = (suggestion) => {
    setDestination(suggestion);
    setShowSuggestions(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    
    const searchCriteria = {
      location: destination || null,
      fromDate: fromDate || null,
      toDate: toDate || null,
      budget: priceValue || null
    };
    
    if (onSearch) {
      onSearch(searchCriteria);
    }
  };

  return (
    <div className="bg-gradient-to-b from-black/40 to-black/20 backdrop-blur-[2px] h-full">
      <div className="h-full flex justify-center items-center p-4 md:p-8">
        <div className="container max-w-7xl">
          
          {/* text content section */}
          <div className="text-white mb-6">
            <h1
              data-aos="fade-up"
              data-aos-delay="300"
              className="font-bold text-3xl md:text-4xl drop-shadow-lg"
            >
              Search Your Trip
            </h1>
            <p data-aos="fade-up" data-aos-delay="400" className="mt-2 max-w-2xl drop-shadow-md">
              Find your perfect destination with unforgettable experiences
            </p>
          </div>

          {/* form section */}
          <form 
            onSubmit={handleSearch}
            data-aos="fade-up"
            data-aos-delay="600"
            className="bg-white/95 backdrop-blur-sm rounded-xl p-6 md:p-8 shadow-2xl"
          >
            <div className="flex flex-col md:flex-row gap-6 md:gap-4">
              <div className="w-full md:w-[31%]">
                <label htmlFor="destination" className="text-gray-700 font-medium block mb-2">
                  Destination
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="destination"
                    id="destination"
                    placeholder="Enter destination"
                    value={destination}
                    onChange={handleDestinationChange}
                    onFocus={() => destination.trim() !== '' && setShowSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 pl-4 focus:outline-none focus:ring-2 focus:ring-orange-400 transition-all duration-300"
                  />
                  <svg className="w-5 h-5 text-gray-500 absolute right-3 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                  </svg>
                  
                  {/* Location suggestions dropdown */}
                  {showSuggestions && suggestions.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                      {suggestions.map((suggestion, index) => (
                        <div
                          key={index}
                          className="p-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => selectSuggestion(suggestion)}
                        >
                          {suggestion}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="w-full md:w-[23%]">
                <label htmlFor="from-date" className="text-gray-700 font-medium block mb-2">
                  From
                </label>
                <div className="relative">
                  <input
                    type="date"
                    name="from-date"
                    id="from-date"
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-orange-400 transition-all duration-300"
                  />
                  <svg className="w-5 h-5 text-gray-500 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                </div>
              </div>

              <div className="w-full md:w-[23%]">
                <label htmlFor="to-date" className="text-gray-700 font-medium block mb-2">
                  To
                </label>
                <div className="relative">
                  <input
                    type="date"
                    name="to-date"
                    id="to-date"
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-orange-400 transition-all duration-300"
                  />
                  <svg className="w-5 h-5 text-gray-500 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                </div>
              </div>

              <div className="w-full md:w-[23%]">
                <label htmlFor="price-range" className="text-gray-700 font-medium block mb-2">
                  <div className="w-full flex justify-between items-center">
                    <p className="font-medium">Budget</p>
                    <p className="font-bold text-orange-600">{priceValue} HKD</p>
                  </div>
                </label>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 px-4">
                  <input
                    type="range"
                    name="price-range"
                    id="price-range"
                    className="appearance-none w-full h-2 bg-gray-200 rounded-full accent-orange-600 cursor-pointer"
                    min="500"
                    max="10000"
                    value={priceValue}
                    step="100"
                    onChange={(e) => setPriceValue(e.target.value)}
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>500</span>
                    <span>10000</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Search button */}
            <div className="flex justify-center mt-8 gap-6">
              <button 
                type="submit"
                className="text-white font-medium text-center bg-gradient-to-r from-orange-500 to-amber-500 px-8 py-3 rounded-lg shadow-lg hover:shadow-orange-300/30 hover:scale-105 transition-all duration-300 transform"
              >
                Search Trips
              </button>
              <button 
                type="button"
                onClick={() => {
                  setDestination('');
                  setFromDate('');
                  setToDate('');
                  setPriceValue(500);
                  if (onSearch) {
                    onSearch(null);
                  }
                }}
                className="text-gray-700 font-medium text-center bg-gray-100 border border-gray-300 px-8 py-3 rounded-lg shadow hover:bg-gray-200 transition-all duration-300 transform"
              >
                Clear Search
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Searchbox;