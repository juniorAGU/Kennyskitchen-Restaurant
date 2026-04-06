import React from 'react'
import { useContext } from 'react'
import { AuthContext } from '../Context/AuthProvider'
import { Navigate } from 'react-router-dom'

function ProtectedRoute( { children } ) {
  const { users, authenticated,loading } = useContext(AuthContext)



  if (loading) {
    return <div className="flex justify-center items-center h-screen">
      <div className="text-blue-600 text-xl">Loading...</div>
    </div>
  }



  if (!users || !authenticated) {
    return <Navigate to="/register" />
  }

  return children
}

export default ProtectedRoute