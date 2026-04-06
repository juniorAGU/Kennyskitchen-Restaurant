import React from 'react'

function Settings() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Settings</h1>
      
      <div className="space-y-6">
        {/* Profile Settings */}
        <div className="bg-white rounded-xl shadow-md">
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 rounded-t-xl">
            <h2 className="font-bold text-gray-800">Profile Settings</h2>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Admin Name</label>
              <input
                type="text"
                placeholder="Enter admin name"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Admin Email</label>
              <input
                type="email"
                placeholder="Enter admin email"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button className="px-6 py-2 bg-blue-600 text-white rounded-lg">Update Profile</button>
          </div>
        </div>

        {/* Security Settings */}
        <div className="bg-white rounded-xl shadow-md">
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 rounded-t-xl">
            <h2 className="font-bold text-gray-800">Security</h2>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Current Password</label>
              <input
                type="password"
                placeholder="Enter current password"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">New Password</label>
              <input
                type="password"
                placeholder="Enter new password"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button className="px-6 py-2 bg-blue-600 text-white rounded-lg">Change Password</button>
          </div>
        </div>

        {/* Site Settings */}
        <div className="bg-white rounded-xl shadow-md">
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 rounded-t-xl">
            <h2 className="font-bold text-gray-800">Site Settings</h2>
          </div>
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-gray-800">Maintenance Mode</p>
                <p className="text-sm text-gray-500">Enable maintenance mode for the website</p>
              </div>
              <button className="px-4 py-2 bg-gray-300 text-gray-600 rounded-lg">Disabled</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Settings