import React, {useState} from 'react'
import great_wall from '../assets/great_wall.jpg'
import SearchBar from '../../components/Browseoption/SearchBar' 

import { SearchResultsList } from '../../components/SearchList/SearchResultsList'
import '../css/Browse.css'
const Browse = () => {
  const [results, setResults] = useState([]);

  return (
    <div>
        <div className="relative h-[1000px]">
          <img
            src={great_wall}
            alt="great_wall"
            className="absolute right-0 top-0 h-[1000px] w-full object-cover z-[-1] opacity-75"
          />
        <div className='search-bar-container'>
          <SearchBar setResults={setResults} />
          <SearchResultsList results={results} />
        </div>
        </div>
      </div>
  );
}

export default Browse
