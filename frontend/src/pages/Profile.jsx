import React from 'react'
import { useParams } from 'react-router-dom'

import Profiles from '../../components/Profile/Profiles'

const Profile = () => {
  const { id } = useParams();
  return <Profiles userId={id || null} />
}
export default Profile