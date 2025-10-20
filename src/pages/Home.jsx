import React from 'react'
import Navbar from '../componets/Navbar'
import Hero from '../componets/Hero'
import Aboutus from '../componets/Aboutus'
import Shop from './Shop'
import BookAppoinment from './BookAppoinment'
import ContactUS from './ContactUS'
import Footer from '../componets/Footer'


function Home() {
  return (
    <div className=' h-screen w-full'>
      <Hero/>
      <Aboutus/>
      <Shop/>
  <Footer/>
     
      
    </div>
  )
}

export default Home
