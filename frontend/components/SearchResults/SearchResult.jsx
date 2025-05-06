import React from 'react'

import './SearchResult.css'

const SearchResult = ({result}) => {
  return (
    <div className="search-result" onClick={(e) => alert(`You Click On ${(result.name)}`)}>
        {result.name}
    </div>
  )
}

export default SearchResult