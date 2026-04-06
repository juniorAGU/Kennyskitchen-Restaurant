// components/RoleRouter.jsx
import React from 'react'
import { useContext } from 'react'
import { AuthContext } from '../Context/AuthProvider'
import { Navigate } from 'react-router-dom'

function RoleRouter() {
  const { users, authenticated, loading } = useContext(AuthContext)

  if (loading) {
    return <div className="flex justify-center items-center h-screen">
      <div className="text-blue-600 text-xl">Loading...</div>
    </div>
  }

  
  if (!authenticated || !users) {
    return <Navigate to="/" />
  }

  
  if (users.role === "admin") {
    return <Navigate to="/admin" />
  }

  
  return <Navigate to="/dashboard" />
}

export default RoleRouter