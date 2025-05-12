import React, {useState} from 'react'
import './SearchBar.css'
import {FaSearch} from "react-icons/fa"

import { tripApi } from '../../src/utils/api'
const SearchBar = ({setResults}) => {
  const [input, setInput] = useState("")

  const fetchData = async (value) => {
    try {
      const response = await tripApi.getAll();
      // Assuming response.data is an array of trips
      const results = response.data.filter((trip) => {
        return (
          value &&
          trip &&
          trip.destination && // or trip.title, depending on your schema
          trip.destination.toLowerCase().includes(value.toLowerCase())
        );
      });
      setResults(results);
    } catch (error) {
      // Handle error as needed
      setResults([]);
    }
  }

  const handleChange = (value) => {
    setInput(value)
    fetchData(value)
  }
  return (
    <>
    <div className='Search-name'>
        <h2>Search for trips</h2>
    </div>
    <div className="input-wrapper"> 
        <FaSearch id="search-icon"/>
        <input 
        className="inputss"
        placeholder='Type to search...' 
        value={input}
        onChange={(e) => handleChange(e.target.value)}/>
    </div>
    </>
  )
}

export default SearchBar
