import React, { useEffect, useRef , useState } from "react";
import { HashLink as Link } from "react-router-hash-link";
import { CiMenuBurger } from "react-icons/ci";
import MobileNavbar from "./MobileNavbar";
// logo removed per request




function AdminNav() {
  
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
      <div className="bg-white/90 backdrop-blur-md shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div>
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Artist Panel</span>
              </div>
            </div>
            <nav className="hidden md:flex items-center space-x-8">
              <Link 
                to="/admin/dashboard" 
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 flex items-center space-x-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                </svg>
                <span>Dashboard</span>
              </Link>
              <Link 
                to="/admin/artists/register" 
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 flex items-center space-x-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
                <span>Register Artist</span>
              </Link>
              <Link 
                to="/admin/bookings" 
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 flex items-center space-x-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>Bookings</span>
              </Link>
              {/* Logout moved into dashboard pages only */}
            </nav>
            {/* Mobile Menu Button */}
            <button className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default AdminNav;
