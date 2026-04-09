import React from 'react'
import { Link } from 'react-router-dom'
import { AuthContext } from '../Context/AuthProvider'
import { db,storage, auth} from '../Config/Firebase'
import { collection,getDoc,setDoc,doc,addDoc,getDocs, query, orderBy,where, deleteDoc,onSnapshot } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { useState,useEffect,useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import OtpVerificationModal from '../components/OtpVerification'



function Dashboard() {
  const { users,logout} = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [pending, setPending] = useState([]);
  const [openotpmodal, setOpenOtpModal] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState(null)

  


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
console.log("the orders",selectedOrder)

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

           {/* Mobile Layout - Shows only on mobile */}
<div className="block lg:hidden">
            
  {/* Unpaid Orders Section */}
  <div className="bg-white rounded-xl shadow-md overflow-hidden mb-4">
    <div className="bg-orange-50 px-4 py-3 border-b border-orange-100">
      <h2 className="text-lg font-bold text-gray-800">
        💰 Unpaid Orders ({pending.length})
      </h2>
      <p className="text-gray-600 text-xs mt-1">Complete payment to confirm your orders</p>
    </div>
  
    <div className="p-3 max-h-80 overflow-y-auto">
      {pending.length === 0 ? (
        <div className="text-center py-6">
          <p className="text-gray-500 text-sm">No unpaid orders</p>
        </div>
      ) : (
        <div className="space-y-2">
          {pending.map(order => (
            <div key={order.id} className="p-3 border rounded-lg">
              <p className="font-semibold text-gray-800 text-sm mb-1">
                {order.items?.map(item => item.name).join(", ")}
              </p>
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs text-gray-500">Qty: {order.items?.map(item => item.quantity).join(", ")}</span>
                <span className="inline-block bg-yellow-500 px-2 py-0.5 rounded-lg text-xs text-white">
                  {order.status}
                </span>
              </div>
              <p className="text-sm font-semibold text-blue-600">
                ₦{order.items?.reduce((sum, item) => sum + (item.price * item.quantity), 0).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  </div>

  {/* Order History Section */}
  <div className="bg-white rounded-xl shadow-md overflow-hidden">
    <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
      <h2 className="text-lg font-bold text-gray-800">
        📋 Order History
      </h2>
      <p className="text-gray-600 text-xs mt-1">View all your previous orders</p>
    </div>
    
    <div className="p-3 max-h-80 overflow-y-auto">
      {orders.length === 0 ? (
        <div className="text-center py-6">
          <p className="text-gray-500 text-sm">No orders yet</p>
          <p className="text-xs text-gray-400 mt-1">Start ordering from our menu</p>
        </div>
      ) : (
        <div className="space-y-2">
          {orders.map(order => (
            <div key={order.id} className="p-3 border rounded-lg">
              <p className="font-semibold text-gray-800 text-sm mb-1">
                {order.items?.map(item => item.name).join(", ")}
              </p>
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs text-gray-500">Qty: {order.items?.map(item => item.quantity).join(", ")}</span>
                <span className={`inline-block px-2 py-0.5 rounded-lg text-xs text-white ${
                  order.status === 'pending' ? 'bg-yellow-500' :
                  order.status === 'processing' ? 'bg-blue-500' :
                  order.status === 'delivered' ? 'bg-green-500' : 'bg-gray-500'
                }`}>
                  {order.status}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-sm font-semibold text-blue-600">
                  ₦{order.items?.reduce((sum, item) => sum + (item.price * item.quantity), 0).toLocaleString()}
                </p>
                <p className="text-xs text-gray-400">
                  {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
</div>

{/* Desktop Layout - Shows only on desktop */}
                      <div className="hidden lg:block lg:col-span-2">
                                  
                        {/* Unpaid Orders Section */}
                        <div className="bg-white rounded-xl shadow-md overflow-hidden">
                          <div className="bg-orange-50 px-6 py-4 border-b border-orange-100">
                            <h2 className="text-xl font-bold text-gray-800">
                              💰 Unpaid Orders ({pending.length})
                            </h2>
                            <p className="text-gray-600 text-sm mt-1">Complete payment to confirm your orders</p>
                          </div>
                          
                          <div className="p-4 max-h-96 overflow-y-auto">

                            

                            {pending.length === 0 ? (
                              <div className="text-center py-8">
                                <p className="text-gray-500">No unpaid orders</p>
                              </div>
                            ) : (
                              <div className="space-y-3">
                                {pending.map(order => (
                                  <div key={order.id} className="p-3 border rounded-lg flex justify-between items-center">
                                    <div className="mb-2">
                                      <p className="font-semibold text-gray-800 text-sm">Items:</p>
                                      <p className="text-gray-600 text-sm">
                                        {order.items?.map(item => item.name).join(", ")}
                                      </p>
                                       <button onClick={() => {
                                          setSelectedOrder(order)  // You need to add this state
                                          setOpenOtpModal(true)
                                       }}
                                          className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-lg text-sm cursor-pointer"
                                            >
                                             Verify OTP
                                        </button>
                                    </div>
                                    <div className="mb-2">
                                      <span className="inline-block bg-yellow-500 px-2 py-1 rounded-lg text-xs text-white">
                                        {order.status}
                                      </span>
                                    </div>
                                    <div className="mb-2">
                                      <p className="text-sm text-gray-600">
                                        Quantity: {order.items?.map(item => item.quantity).join(", ")}
                                      </p>
                                    </div>
                                    <div>
                                      <p className="text-sm font-semibold text-blue-600">
                                        Total: ₦{order.items?.reduce((sum, item) => sum + (item.price * item.quantity), 0).toLocaleString()}
                                      </p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Order History Section */}
                        <div className="bg-white rounded-xl shadow-md overflow-hidden mt-8">
                          <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                            <h2 className="text-xl font-bold text-gray-800">
                              📋 Order History
                            </h2>
                            <p className="text-gray-600 text-sm mt-1">View all your previous orders</p>
                          </div>
                          
                          <div className="p-4 max-h-96 overflow-y-auto">
                            {orders.length === 0 ? (
                              <div className="text-center py-8">
                                <p className="text-gray-500">No orders yet</p>
                                <p className="text-sm text-gray-400 mt-1">Start ordering from our menu</p>
                              </div>
                            ) : (
                              <div className="space-y-3">
                                {orders.map(order => (
                                  <div key={order.id} className="p-3 border rounded-lg flex justify-around items-center">
                                    <div className="mb-2">
                                      <p className="font-semibold text-gray-800 text-sm">Items:</p>
                                      <p className="text-gray-600 text-sm">
                                        {order.items?.map(item => item.name).join(", ")}
                                      </p>
                                    </div>
                                    <div className="mb-2">
                                      <span className={`inline-block px-2 py-1 rounded-lg text-xs text-white ${
                                        order.status === 'pending' ? 'bg-yellow-500' :
                                        order.status === 'processing' ? 'bg-blue-500' :
                                        order.status === 'delivered' ? 'bg-green-500' : 'bg-gray-500'
                                      }`}>
                                        {order.status}
                                      </span>
                                    </div>
                                    <div className="mb-2">
                                      <p className="text-sm text-gray-600">
                                        Quantity: {order.items?.map(item => item.quantity).join(", ")}
                                      </p>
                                    </div>
                                    <div className="mb-2">
                                      <p className="text-sm font-semibold text-blue-600">
                                        Total: ₦{order.items?.reduce((sum, item) => sum + (item.price * item.quantity), 0).toLocaleString()}
                                      </p>
                                    </div>
                                    <div>
                                      <p className="text-xs text-gray-400">
                                        Ordered: {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}
                                      </p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
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
                    <span className="font-semibold text-gray-800">{pending.map(order => order.customer?.phoneNumber).join(", ").slice(0, 12)}</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">📍 Location</span>
                    <span className="font-semibold text-gray-800">{pending.map(order => order.customer?.city).join(", ").slice(0, 12)}</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">📅 Member Since</span>
                    <span className="font-semibold text-gray-800">{users.createdAt ? new Date(users.createdAt).toLocaleDateString() : 'N/A'}</span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span className="text-gray-600">⭐ Total Orders</span>
                    <span className="font-semibold text-gray-800">{orders.length}</span>
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
                
                
              </div>
            </div>
          </div>

           {openotpmodal && selectedOrder && (
      <OtpVerificationModal
        order={selectedOrder}
        onClose={() => {
          setOpenOtpModal(false)
          setSelectedOrder(null)
        }}
        onVerified={() => {
          setOpenOtpModal(false)
          setSelectedOrder(null)
        }}
      />
    )}
              
    </section>
  )
}

export default Dashboard