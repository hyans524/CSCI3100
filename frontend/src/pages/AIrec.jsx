import React from 'react'
import Fuji_background from '../assets/Fuji_background.jpg'
import Recommend from '../../components/Recommend/Recommend'
import constantCheckLoggedIn from '../../components/CheckLoggedIn/CheckLoggedIn'
const AIrec = () => {

  constantCheckLoggedIn()
  return (
    <>
      <div>
        <div className="relative h-[1100px]">
          <img
            src={Fuji_background}
            alt="Fuji background"
            className="absolute right-0 top-0 h-[1100px] w-full object-cover z-[-1] opacity-75"
          />
          <Recommend />
        </div>
      </div>
    </>
  )
}

export default AIrec