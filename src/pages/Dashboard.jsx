import React from 'react'
import { Link } from 'react-router-dom'
import { AuthContext } from '../Context/AuthProvider'
import { db,storage, auth} from '../Config/Firebase'
import { collection,getDoc,setDoc,doc,addDoc,getDocs, query, orderBy,where, deleteDoc,onSnapshot } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { useState,useEffect,useContext } from 'react'
import { useNavigate } from 'react-router-dom'


function Dashboard() {
  const { users,logout} = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [pending, setPending] = useState([]);


  const navigate = useNavigate()
  const handleLogeout = async () => {
    try {
        const success = await logout()
        if (success) {
            navigate('/')
        }
    } catch(err) {
        console.log("Error:", err.message)
    }
}
const current = auth.currentUser?.uid;

useEffect(() => {
  const orderRef = collection(db, "orders");
  const quer = query(orderRef, where("userID","==",current));
  const subscrib = onSnapshot(quer,(snapquery) => {
    const orderList = snapquery.docs.map(docc => ({
      id: docc.id,
      ...docc.data()
    }))
    
    setOrders(orderList)
  })
  return () => subscrib()
},[current])

useEffect(() => {
  const orderRef = collection(db,"orders")
  const qure = query(orderRef,  where("userID","==", current));
  const querypend = query(qure,where("status","==","pending"));
  const sub = onSnapshot(querypend,(squar) => {
    const pendingList = squar.docs.map(docc => ({
      id: docc.id,
      ...docc.data(),
    }))
    setPending(pendingList)
  })
},[])


   console.log("the pending orders",pending)

   const totalspending = orders.reduce((sum,order) => sum + (order.summary?.total || 0), 0)
  return (
    <section className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">
                Welcome back, <span className="text-yellow-300">Customer!</span>
              </h1>
              <p className="text-blue-100 mt-1">Track your orders and manage your account</p>
            </div>
            <button onClick={handleLogeout} 
             className="px-5 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition-all duration-300 shadow-md">
              🚪 Logout
            </button>
          </div>
        </div>
      </div>

      <section className="max-w-7xl mx-auto px-4 py-8">
                    {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Orders</p>
                <p className="text-3xl font-bold text-gray-800">{orders.length || 0}</p>
              </div>
              <div className="text-4xl">📦</div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Unpaid Orders</p>
                <p className="text-3xl font-bold text-orange-600">{pending.length || 0}</p>
              </div>
              <div className="text-4xl">💰</div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Spent</p>
                <p className="text-3xl font-bold text-green-600">₦{totalspending.toLocaleString()}</p>
              </div>
              <div className="text-4xl">💳</div>
            </div>
          </div>
        </div>
      </section>  

      <div className="lg:col-span-2">
            
                               {/* another sectction */}
            <div className="bg-white rounded-xl shadow-md overflow-y-auto h-96">
              <div className="bg-orange-50 px-6 py-4 border-b border-orange-100">
                <h2 className="text-xl font-bold text-gray-800">
                  💰 Unpaid Orders (0)
                </h2>
                <p className="text-gray-600 text-sm mt-1">Complete payment to confirm your orders</p>
              </div>
              <div className="p-12 text-center">
                <p className="text-gray-500"> unpaid orders</p>
                {
                  pending.map(order =>
                    <div key={order.id} className="mt-4 p-4 border rounded-lg flex items-center justify-around">
                      <p >{order.items.map(item => item.name)}</p>
                      <p className='bg-yellow-500 px-1 py-1 rounded-lg'>{order.status}</p>
                      <p>{order.items.map(item => item.quantity)}</p>
                      <p>{order.items.map(item => item.subtotal)}</p>
                    </div>
                  )
                }
              </div>
            </div>

                                 {/* {another section} */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden mt-8">
                  <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                   <h2 className="text-xl font-bold text-gray-800">
                      📋 Order History
                    </h2>
                    <p className="text-gray-600 text-sm mt-1">View all your previous orders</p>
                  </div>
                  <div className="p-12 text-center overflow-y-auto h-96">
                    {
                      orders.map(order => 
                         <div key={order.id} className="mt-4 p-4 border rounded-lg flex items-center justify-around">
                          <p>{order.items.map(item => item.name)}</p>
                          <p className='bg-yellow-500 px-1 py-1 rounded-lg'>{order.status}</p>
                          <p>{order.items.map(item => item.quantity)}</p>
                          <p>{order.items.map(item => item.subtotal)}</p>
                          <p>Time orderd {order.createdAt}</p>
                         </div>

                      )
                    }
                    <p className="text-sm text-gray-400 mt-1">Start ordering from our menu</p>
                  </div>
                </div>
            </div>


            
          <div>
            <div className="bg-white rounded-xl shadow-md overflow-hidden sticky top-24">
              
              
              <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-8 text-center">
                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-5xl">👤</span>
                </div>
                <h3 className="text-xl font-bold text-white">{users.name}</h3>
                <p className="text-blue-100 text-sm mt-1">{users.email}</p>
              </div>
              

              
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">📞 Phone</span>
                    <span className="font-semibold text-gray-800">+234 XXX XXX XXXX</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">📍 Location</span>
                    <span className="font-semibold text-gray-800">Your City, Country</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">📅 Member Since</span>
                    <span className="font-semibold text-gray-800">Month Year</span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span className="text-gray-600">⭐ Total Orders</span>
                    <span className="font-semibold text-gray-800">0</span>
                  </div>
                </div>

                {/* ==================== SECTION 4C: ORDER BUTTON ==================== */}
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <Link 
                    to="/menu"
                    className="block w-full text-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all duration-300"
                  >
                    🍽️ Order More Food
                  </Link>
                </div>
                {/* ==================== END OF SECTION 4C ==================== */}
                
              </div>
              {/* ==================== END OF SECTION 4B ==================== */}
              
            </div>
          </div>

    </section>
  )
}

export default Dashboard