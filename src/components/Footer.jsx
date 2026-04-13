import React from 'react'
import { Link } from 'react-router-dom';

function Footer() {
    const toaday = new Date().getFullYear();
  return (
    <footer className="w-full  bg-gray-900 text-white mt-16">
        <div className="max-w-7xl mx-auto px-4 py-12">
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
                <div className='space-y-4'>
                    <h2 className="text-2xl font-bold">
                        KENYS <span  className="text-blue-400">kitchen</span>
                    </h2>
                    <p className="text-gray-400 text-sm leading-relaxed">
                        Serving delicious meals with passion and love. Experience the finest flavors prepared just for you.
                    </p>
                </div>

                <div>
                    <h3 className="text-lg font-semibold mb-4 text-blue-400">Quike access</h3>
                    <ul className="space-y-2">
              <li>
                <Link to ="/" className="text-gray-400 hover:text-blue-400 transition-colors duration-300 text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-400 hover:text-blue-400 transition-colors duration-300 text-sm">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/menu" className="text-gray-400 hover:text-blue-400 transition-colors duration-300 text-sm">
                  Our Menu
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-blue-400 transition-colors duration-300 text-sm">
                  Contact
                </Link>
              </li>
              <Link to={'dashboard'} className="text-gray-400 hover:text-blue-400 transition-colors duration-300 text-sm">
                    DashBoard
              </Link>
            </ul>
                </div>


                <div>
                <h3 className="text-lg font-semibold mb-4 text-blue-400">Our Services</h3>
                <ul className="space-y-2">
              <li className="text-gray-400 text-sm">Dine-in Experience</li>
              <li className="text-gray-400 text-sm">Takeaway Service</li>
              <li className="text-gray-400 text-sm">Catering Service</li>
              <li className="text-gray-400 text-sm">Online Ordering</li>
                </ul>
                </div>

                <div>
            <h3 className="text-lg font-semibold mb-4 text-blue-400">Contact Info</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-gray-400 text-sm">
                <span>123 odim Street Nsukka, ENUGU, Nigeria</span>
              </li>
              <li className="flex items-center gap-3 text-gray-400 text-sm">
                <span>+234 7068797258</span>
              </li>
              <li className="flex items-center gap-3 text-gray-400 text-sm">
                <span>perryfresh25@gmail.com</span>
              </li>
              <li className="flex items-center gap-3 text-gray-400 text-sm">
                <span>Mon-Sun: 9:00 AM - 10:00 PM</span>
              </li>
            </ul>
                </div>


            </div>


    


        </div>

    </footer>
  )
}

export default Footer