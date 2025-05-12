import React from 'react'
import { useParams } from 'react-router-dom'

import Profiles from '../../components/Profile/Profiles'
import constantCheckLoggedIn from '../../components/CheckLoggedIn/CheckLoggedIn'

const Profile = () => {
  constantCheckLoggedIn()
  const { id } = useParams();
  return <Profiles userId={id || null} />
}
export default Profile