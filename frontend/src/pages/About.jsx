import React from 'react'

import Abouts from '../../components/About/Abouts'
import constantCheckLoggedIn from '../../components/CheckLoggedIn/CheckLoggedIn'
const About = () => {

  constantCheckLoggedIn()
  return (
    <Abouts />
  )
}

export default About