import React from 'react'

function Contact() {
  return (
    <div id='contact' className='w-full h-[60vh] bg-black flex flex-col justify-center items-center text-center px-8'>
      <div className="space-y-4">
        {/* CONTACT Title */}
        <h1 className="text-4xl md:text-5xl font-bold text-blue-400 drop-shadow-[0_0_15px_rgba(59,130,246,0.6)]">
          CONTACT
        </h1>
        
        {/* Name */}
        <div className="text-lg md:text-xl">
          <span className="text-white">Name: </span>
          <span className="text-blue-400">Style Union</span>
        </div>
        
        {/* Email */}
        <div className="text-lg md:text-xl">
          <span className="text-white">Email: </span>
          <span className="text-blue-400">styleunion1722@gmail.com</span>
        </div>
        
        {/* Phone Number */}
        <div className="text-lg md:text-xl">
          <span className="text-white">Phone: </span>
          <span className="text-blue-400">9894499133</span>
        </div>
        
        {/* Address */}
        <div className="text-lg md:text-xl">
          <span className="text-white">Address: </span>
          <span className="text-blue-400">Main road, Vijayawada, NTR Dt - 520001, AP</span>
        </div>
      </div>
    </div>
  )
}

export default Contact
