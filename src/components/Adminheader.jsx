import React from 'react'
import { Link } from 'react-router-dom'
function Adminheader() {
  return (
    <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          
          
          <div className="flex items-center gap-3">
            <div className="text-2xl">⚙️</div>
            <Link to="/admin">
              <h1 className="text-xl md:text-2xl font-bold">
                KENYS<span className="text-yellow-300">kitchen</span>
                <span className="ml-2 text-sm bg-red-500 px-2 py-1 rounded-md">Admin</span>
              </h1>
            </Link>
          </div>

          
          <div className="flex items-center gap-4">
            <div className="hidden md:block text-right">
              <p className="text-sm font-semibold">Admin User</p>
              <p className="text-xs text-blue-200">admin@kenyskitchen.com</p>
            </div>
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
              <span className="text-blue-600 font-bold text-lg">A</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Adminheader