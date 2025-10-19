import React from 'react'
import Navbar from './Navbar'
import image1 from '../assets/images/WhatsApp Image 2025-10-07 at 20.23.12_f6abf9be.jpg'



function Hero() {

  return (
    <>
    <div id="Hero" className='merriweather-regular w-full h-screen sm:w-full sm:h-screen lg:w-full lg:h-screen ' 
    style={{
      backgroundImage: `url(${image1})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat'
    }}>
        <Navbar/>
    <div id="heroPart2" className='w-full h-[650px] lg:w-full lg:h-[650px] flex items-start justify-end pr-8 lg:pr-16'>
      <div id="moto" className='w-[90%] max-w-[700px] m-[10px] mt-[140px] sm:w-[70%] sm:mt-[160px] lg:w-[50%] lg:mt-[140px] text-white text-right'>
                <div id="line" className='lg:text-[50px] text-[30px] font-semibold  sm:text-[40px] lg:font-semibold'>
                    <h3 className='pr-8 lg:pr-16 whitespace-nowrap'>Style Yourself</h3>
                </div>
                <h3 className='tracking-[4px] pt-[3px] sm:text-[20px] text-[18px] lg:pt-[5px] lg:tracking-[4px] lg:text-[22px] mr-8 lg:mr-16 whitespace-nowrap'>Professional care to maintain your perfect look</h3>

            </div>


        </div>
    </div>
    
    </>
  )
}

export default Hero
