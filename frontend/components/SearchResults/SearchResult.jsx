import React from 'react'
import { useNavigate } from 'react-router-dom'
import './SearchResult.css'
import { tripApi } from '../../src/utils/api'
const SearchResult = ({result}) => {
  const navigate = useNavigate()

const handleClick = async () => {
  navigate('/mytrip')
};
  return (
    <div className="search-result" onClick={handleClick}>
        {result.destination}
    </div>
  )
}

export default SearchResult