import React from 'react'
import Adminheader from '../components/Adminheader'
import Adminfooter from '../components/Adminfooter'
import { Outlet } from 'react-router-dom'
import { useContext,useState, useReducer,useEffect } from 'react';
import { db,storage } from '../Config/Firebase'
import { collection,getDoc,setDoc,doc,addDoc,getDocs, query, orderBy, deleteDoc,onSnapshot,updateDoc } from 'firebase/firestore'
import { NavLink } from 'react-router-dom'
import { AuthContext } from '../Context/AuthProvider'
import { useNavigate } from 'react-router-dom'


function AdminLayout() {
  const { logout } = useContext(AuthContext)
  const navigate = useNavigate()

  const [numbermessage, setNumbermessage] = useState(0)
  const [messagelist, setMessagelist ] = useState([])
  useEffect(() =>{
    const messageRef = collection(db,"messages")
    const subscribing = onSnapshot(messageRef,(messagequaery) => {
      const messageList = messagequaery.docs.map(docc => ({
        id: docc.id,
        ...docc.data(),
      }))
      setMessagelist(messageList)
      const unread = messageList.filter(filt => filt.status === "unread").length;
      setNumbermessage(unread)
    })
    return () => subscribing
  },[])

 const handleLogeout = async () => {
    try {
        const success = await logout()
        if (success) {
            navigate('/login')
        } else {
        }
    } catch(err) {
        console.log("Error:", err.message)
    }
}
  return (
    <div className='h-screen flex flex-col bg-gray-100'>
      
      
      <div className="flex-shrink-0">
        <Adminheader />
      </div>

      <div className="flex flex-1 min-h-0">
        
        
        <nav className="w-54 bg-white shadow-lg flex flex-col flex-shrink-0">
          <div className="flex-1 overflow-y-auto py-6">
            <ul className="space-y-1 px-3">
              <li>
                <NavLink  
                  to="/admin" 
                  className={({isActive}) => `${isActive ? "bg-blue-200 text-white" : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"} block px-4 py-3 rounded-lg transition-colors`}
                >
                  Dashboard
                </NavLink>
              </li>
              
              <li>
                <NavLink 
                  to="/admin/addfood" 
                  className={({isActive}) => `${isActive ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"} block px-4 py-3 rounded-lg transition-colors`}
                >
                  Add Foods
                </NavLink>
              </li>


              <li>
                <NavLink 
                  to="/admin/menu" 
                  className={({isActive}) => `${isActive ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"} block px-4 py-3 rounded-lg transition-colors`}
                >
                  Menu
                </NavLink>
              </li>
              
              <li>
                <NavLink 
                  to="/admin/orders" 
                  className={({isActive}) => `${isActive ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"} block px-4 py-3 rounded-lg transition-colors`}
                >
                  Orders
                </NavLink>
              </li>
              
              <li>
                <NavLink 
                  to="/admin/users" 
                  className={({isActive}) => `${isActive ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"} block px-4 py-3 rounded-lg transition-colors`}
                >
                  Users
                </NavLink>
              </li>
               <li>
                  <NavLink 
                    to="/admin/messages" 
                    className={({isActive}) => `${isActive ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"} block px-4 py-3 rounded-lg transition-colors`}
                  >
                    <div className="flex items-center gap-2">
                      <span>Messages</span>
                      {numbermessage > 0 && (
                        <span className="bg-red-500 text-white text-xs font-bold rounded-full px-2 py-0.5 min-w-[20px] text-center">
                          {numbermessage > 99 ? '99+' : numbermessage}
                        </span>
                      )}
                    </div>
                  </NavLink>
                </li>
              <li>
                <NavLink  
                  to="/admin/settings" 
                  className={({isActive}) => `${isActive ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"} block px-4 py-3 rounded-lg transition-colors`}
                >
                  Settings
                </NavLink>
              </li>
            </ul>
          </div>

          {/* Logout at bottom of sidebar */}
          <div className="flex-shrink-0 p-4 border-t border-gray-200">
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
            onClick={handleLogeout}
            >
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </nav>

        {/* Scrollable Content Area */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>

      {/* Static Footer */}
      <div className="flex-shrink-0">
        <Adminfooter />
      </div>
    </div>
  )
}

export default AdminLayout