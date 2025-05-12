import React from 'react'
import constantCheckLoggedIn from '../../components/CheckLoggedIn/CheckLoggedIn'

const NoPage = () => {

  constantCheckLoggedIn()
  return (
    <div>NoPage</div>
  )
}

export default NoPage