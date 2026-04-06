import React from 'react'
import { Link } from 'react-router-dom'

function Adminfooter() {
    const currentYear = new Date().getFullYear()


  return (
    <footer className="bg-gray-800 text-white border-t border-gray-700 w-full h-[100px] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 py-6">
        
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-6 border-b border-gray-700">
          
          
          <div>
            <h3 className="font-bold text-lg mb-2">
              KENYS<span className="text-yellow-300">kitchen</span>
            </h3>
            <p className="text-xs text-gray-400">
              Admin Dashboard v1.0
            </p>
          </div>

          
          <div className="text-center">
            <h4 className="text-sm font-semibold text-gray-300 mb-2">Quick Actions</h4>
            <div className="flex justify-center gap-3">
              <Link to="/admin/users" className="text-xs text-gray-400 hover:text-yellow-300">
                Users
              </Link>
              <span className="text-gray-600">•</span>
              <Link to="/admin/orders" className="text-xs text-gray-400 hover:text-yellow-300">
                Orders
              </Link>
              <span className="text-gray-600">•</span>
              <Link to="/admin/menu" className="text-xs text-gray-400 hover:text-yellow-300">
                Menu
              </Link>
            </div>
          </div>
        </div>

        
      </div>
    </footer>
  )
}

export default Adminfooter