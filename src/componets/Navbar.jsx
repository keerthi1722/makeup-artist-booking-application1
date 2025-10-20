import React, { useEffect, useRef , useState } from "react";
import { HashLink as Link } from "react-router-hash-link";
import { CiMenuBurger } from "react-icons/ci";
import MobileNavbar from "./MobileNavbar";




function Navbar() {
  const isHome = typeof window !== 'undefined' && (
    window.location.hash === '' || window.location.hash === '#' || window.location.hash === '#/' || window.location.pathname === '/')
  // const [selectedService, setSelectedService] = useState('');

  // const renderServiceComponent = () => {
  //   switch (selectedService) {
  //     case 'MobileMenu':
  //       return <MobileNavbar/>;
      
  //     default:
  //       return null;
  //   }
  // };

  
  
  return (
    <>
      <div id="navBar" className="merriweather-regular flex justify-between h-[90px] lg:flex lg:justify-between bg-transparent lg:h-[100px] lg:p-[10px] ">
        <div id="leftNav" className="lg:p-[20px] p-[20px] ">
          
        </div>
        <div id="rightNav" className="lg:pt-[10px]">
        <li className="visible -pt-[10px] sm:hidden ">
          {/* <div id="menu"  onClick={() => setSelectedService('MobileMenu')} className=" -ml-[50px] w-full bg-red-300">
          <CiMenuBurger />
          </div>
          <div className="service-details">
          {renderServiceComponent()}
        </div> */}
            
            </li>
          <ul className="hidden text-white text-[20px]   lg:flex lg:p-[20px] lg:gap-[40px]">
            
            <li>
              <Link to="/" className="border-b-[4px] border-transparent hover:border-[#ae8547] pb-2">
                Home
              </Link>
            </li>
            <li className="button">
              <Link to="#aboutus" className="border-b-[4px] border-transparent hover:border-[#ae8547] pb-2">
                About Us
              </Link>
            </li>
            <li className="button">
              <Link to="#shop" className="border-b-[4px] border-transparent hover:border-[#ae8547] pb-2">
                Shop 
              </Link>
            </li>
            {/* Contact link removed */}
            <li className="button">
              <Link to='/login' className="lg:border-[3px] lg:border-white lg:p-2  hover:bg-[#ae8547] hover:border-[#ae8547]">
              Booking
              </Link>
            </li>
            {/* Logout moved into dashboard pages only */}
            
          </ul>
          
        </div>
      </div>
    </>
  );
}

export default Navbar;
