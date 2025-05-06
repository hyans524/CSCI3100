import React from 'react'

import './SearchResult.css'

export const SearchResult = ({results}) => {
  return (
    <div className="search-result">
        {results.name}
    </div>
  )
}
