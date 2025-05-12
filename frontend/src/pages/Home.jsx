import React, { useState } from 'react'
import Temple_background from '../assets/Temple_background.png'
import Searchbox from '../../components/Searchbox/Searchbox'
import Trip from '../../components/Trips/Trip'

const Home = () => {

  const [searchCriteria, setSearchCriteria] = useState(null);

  const handleSearch = (criteria) => {
    setSearchCriteria(criteria);
    document.getElementById('trip-results')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <div>
        <div className="relative h-[700px]">
          <img
            src={Temple_background}
            alt="Temple background"
            className="absolute right-0 top-0 h-[700px] w-full object-cover z-[-1] opacity-75"
          />
          <Searchbox onSearch={handleSearch} />
        </div>
        <div id="trip-results" className="pt-2 px-20 py-10">
          <Trip 
            searchCriteria={searchCriteria}
            heading={searchCriteria ? "Search Results" : "Interested Trips to Join"} 
          />
        </div>
      </div>
    </>
  )
}

export default Home