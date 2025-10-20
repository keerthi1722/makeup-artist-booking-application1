import React from 'react'
import UserNav from '../componets/UserNav'
import Hero from '../componets/Hero'
import Aboutus from '../componets/Aboutus'
import Shop from './Shop'

function User() {
  return (
    <div className=' h-screen w-full'>
      <UserNav/>
      <Hero/>
      <Aboutus/>
  <Shop/>
    </div>
  )
}

export default User
