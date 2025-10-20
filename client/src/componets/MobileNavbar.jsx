import React , {useState} from 'react'
import { HashLink as Link } from "react-router-hash-link";

function MobileNavbar() {
  const isHome = typeof window !== 'undefined' && (
    window.location.hash === '' || window.location.hash === '#' || window.location.hash === '#/' || window.location.pathname === '/')
  
  return (
    <>
    <div id="mobileMenu" className='bg-yellow-300 h-[500px] w-[300px]'>
    <ul className="">
            
            <li>
              <Link to="#Home" className="">
                Home
              </Link>
            </li>
            <li className="button">
              <Link to="#aboutus" className="">
                About Us
              </Link>
            </li>
            <li className="button">
              <Link to="#service" className="">
                Services
              </Link>
            </li>
            <li className="button">
              <Link to="#shop" className="">
                Shop 
              </Link>
            </li>
            {/* Contact link removed */}
            <li className="button">
              <Link to="#Contact" className="lg:border-[3px] lg:border-black lg:p-2">
                Booking
              </Link>
            </li>
            {/* Logout moved into dashboard pages only */}
            
          </ul>
      

    </div>
    </>
  )
}

export default MobileNavbar
