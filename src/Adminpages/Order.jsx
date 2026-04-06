import React from 'react'
import { Link } from 'react-router-dom'
import { useContext,useState, useReducer,useEffect } from 'react';
import { db,storage } from '../Config/Firebase'
import { collection,getDoc,setDoc,doc,addDoc,getDocs, query, orderBy, deleteDoc,onSnapshot,updateDoc } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'





function AdminOrders() {
  const [orders1, setOrders] = useState([]);
  const [status1 , setStatus1] = useState('');
  const [loading, setLoading] = useState(false)
  const [filterStatus, setFilterStatus] = useState('all'); 

  useEffect(() => {
    const ordersRef = collection(db, "orders")
    
    
    const unsubscribe = onSnapshot(ordersRef, (snapshot) => {
      const ordersList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()  
      }))
      
      console.log("Fetched orders:", ordersList)  
      setOrders(ordersList)
      setLoading(false)
    }, (error) => {
      console.error("Error fetching orders:", error)
      setLoading(false)
    })
    
    
    return () => unsubscribe()
  }, [])

  const filteredOrders = orders1.filter(order => {
    if (filterStatus === 'all') return true
    return order.status === filterStatus
  })

  const hansleOrderStatusChange = async (orderId) => {
    try{
      const orderRef = doc(db, "orders", orderId)
      await updateDoc(orderRef,{status: status1, updatedAt: new Date().toISOString()})
    }catch(err){
      console.error("Error updating order status:", err)
    }
  }




  const getStatusBadge = (status) => {
    switch(status) {
      case 'paid':
        return { bg: 'bg-green-100', text: 'text-green-700', label: ' Paid' }
      case 'pending':
        return { bg: 'bg-yellow-100', text: 'text-yellow-700', label: ' Pending' }
      case 'processing':
        return { bg: 'bg-blue-100', text: 'text-blue-700', label: ' Processing' }
      case 'delivered':
        return { bg: 'bg-purple-100', text: 'text-purple-700', label: ' Delivered' }
      default:
        return { bg: 'bg-gray-100', text: 'text-gray-700', label: ' Unknown' }
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white  z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link to="/admin">
              <h1 className="text-2xl font-bold">
                KENYS<span className="text-yellow-300">kitchen</span>
                <span className="ml-2 text-sm bg-red-500 px-2 py-1 rounded-md">Admin</span>
                <span className="ml-2 text-sm bg-blue-500 px-2 py-1 rounded-md">Orders</span>
              </h1>
            </Link>
            <Link to="/admin" className="text-white hover:text-yellow-300 transition-colors">
              ← Back to Dashboard
            </Link>
          </div>
        </div>
      </div>

      <div className="w-full mx-auto px-4 py-8">
        
        {/* Page Title */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Order <span className="text-blue-600">Management</span></h2>
          <div className="w-20 h-1 bg-blue-600 mt-2"></div>
          <p className="text-gray-600 mt-2">View and manage all customer orders</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-md p-4 mb-6">
          <div className="flex flex-wrap gap-3 items-center justify-between">
            <div className="flex flex-wrap gap-2">
              <button onClick={() => setFilterStatus('all')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      filterStatus === 'all' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}>All Orders</button>
                    
              <button onClick={() => setFilterStatus('pending')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      filterStatus === 'pending' 
                        ? 'bg-yellow-500 text-white' 
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                >Pending</button>

              <button 
              onClick={() => setFilterStatus('processing')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      filterStatus === 'processing' 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
              >Processing</button>

              <button onClick={() => setFilterStatus('paid')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      filterStatus === 'paid' 
                        ? 'bg-green-500 text-white' 
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
              >Paid</button>
              <button onClick={() => setFilterStatus('delivered')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      filterStatus === 'delivered' 
                        ? 'bg-purple-500 text-white' 
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
              >Delivered</button>
            </div>
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search orders..." 
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden w-full">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Order ID</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Date</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Customer</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Items</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Total</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Payment</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredOrders.map((order) => {
                  const statusBadge = getStatusBadge(order.status)
                  return (
                    <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-medium text-gray-800">{order.id}</p>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{order.createdAt.toLocaleString()}</td>
                      <td className="px-6 py-4">
                        <p className="font-medium text-gray-800">{order.customer?.name }</p>
                        <p className="text-xs text-gray-500">{order.customer?.email }</p>
                        <p className="text-xs text-gray-500">{order.customer?.phoneNumber}</p>
                        <p className="text-xs text-gray-500">{order.customer?.address}</p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          {order.items.map((item, idx) => (
                            <p key={idx} className="text-sm text-gray-600">
                              {item.name} x {item.quantity}
                            </p>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-bold text-blue-600">₦{order.summary?.total ? order.summary.total.toLocaleString() : 
                                  order.total ? order.total.toLocaleString() : '0'}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-600">
                          {order.payment === 'card' ? ' Card' : order.payment === 'cash' ? ' Cash' : ' Transfer'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${statusBadge.bg} ${statusBadge.text}`}>
                          {statusBadge.label}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-2">
                          {/* Status Update Buttons */}
                          <select className="px-3 py-1 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            onChange={(e) => setStatus1(e.target.value)}
                            value={status1}
                            >
                            <option>Update Status</option>
                            <option value="pending"> Pending</option>
                            <option value="processing"> Processing</option>
                            <option value="paid"> Paid</option>
                            <option value="delivered"> Delivered</option>
                          </select>
                          
                          {/* Confirm Order Button */}
                          <button className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-lg transition-colors"
                          onClick={() => hansleOrderStatusChange(order.id)}>
                            ✓ Confirm
                          </button>
                          
                          {/* View Details Button */}
                          <button className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors">
                             View
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-500">Showing {orders1.length} of {orders1.length} orders</p>
              <div className="flex gap-2">
                <button className="px-3 py-1 text-sm text-gray-500 border border-gray-200 rounded hover:bg-gray-100">Previous</button>
                <button className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">1</button>
                <button className="px-3 py-1 text-sm text-gray-500 border border-gray-200 rounded hover:bg-gray-100">2</button>
                <button className="px-3 py-1 text-sm text-gray-500 border border-gray-200 rounded hover:bg-gray-100">3</button>
                <button className="px-3 py-1 text-sm text-gray-500 border border-gray-200 rounded hover:bg-gray-100">Next</button>
              </div>
            </div>
          </div>
        </div>

        {/* Empty State */}
        {filteredOrders.length === 0 && (
          <div className="text-center py-16 bg-white rounded-xl shadow-md">
            <div className="text-6xl mb-4">📭</div>
            <p className="text-gray-500 text-lg">No orders yet</p>
            <p className="text-gray-400 text-sm mt-1">Orders will appear here when customers place them</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminOrders