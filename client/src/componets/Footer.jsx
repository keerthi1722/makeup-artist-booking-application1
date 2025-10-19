import React from 'react'

function Footer() {
  return (
    <footer className="w-full bg-gray-900 text-gray-200 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-semibold mb-2">Style Union</h3>
            <p className="text-sm text-gray-400">Professional beauty services &amp; makeup artists near you.</p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Contact</h4>
            <p className="text-sm text-gray-400">Email: styleunion1722@gmail.com</p>
            <p className="text-sm text-gray-400">Phone: 9894499133</p>
            <p className="text-sm text-gray-400">Main road, Vijayawada, NTR Dt - 520001, AP</p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Follow Us</h4>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white text-sm">Instagram</a>
              <a href="#" className="text-gray-400 hover:text-white text-sm">Facebook</a>
              <a href="#" className="text-gray-400 hover:text-white text-sm">Twitter</a>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-800 pt-6 text-sm text-gray-500 text-center">
          © {new Date().getFullYear()} Style Union. All rights reserved.
        </div>
      </div>
    </footer>
  )
}

export default Footer
