import React from 'react'
import great_wall from '../assets/great_wall.jpg'

const Browse = () => {
  return (
    <div>
        <div className="relative h-[1000px]">
          <img
            src={great_wall}
            alt="great_wall"
            className="absolute right-0 top-0 h-[1000px] w-full object-cover z-[-1] opacity-75"
          />
         <Browseoption />
        </div>
      </div>
  )
}

export default Browse
