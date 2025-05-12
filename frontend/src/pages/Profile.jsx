import React from 'react'

import Profiles from '../../components/Profile/Profiles'
import constantCheckLoggedIn from '../../components/CheckLoggedIn/CheckLoggedIn'
const Profile = () => {

  constantCheckLoggedIn()
  return (
    <Profiles />
  )
}

export default Profile