import React from 'react'
import { useNavigate } from 'react-router-dom'
import './SearchResult.css'

const SearchResult = ({result}) => {
  const navigate = useNavigate()

  const handleClick = () => {
    navigate('/mytrip')
  }
  return (
    <div className="search-result" onClick={handleClick}>
        {result.destination}
    </div>
  )
}

export default SearchResult