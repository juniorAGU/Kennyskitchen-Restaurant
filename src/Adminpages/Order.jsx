import React from 'react'
import { Link } from 'react-router-dom'
import { useContext, useState, useReducer, useEffect } from 'react';
import { db, storage } from '../Config/Firebase'
import { collection, getDoc, setDoc, doc, addDoc, getDocs, query, orderBy, deleteDoc, onSnapshot, updateDoc } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'

function AdminOrders() {
  const [orders1, setOrders] = useState([]);
  const [status1, setStatus1] = useState('');
  const [loading, setLoading] = useState(false)
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [showProofModal, setShowProofModal] = useState(false)
  const [message,setMessage] = useState(null);
  console.log("my selection values",status1)

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


  const showMessages = (message,type) => {
    setMessage( { message, type} )
    setTimeout(() => {
    setMessage(null)
  }, 3000);
}
    const typeColor = {
      success : "bg-green-600",
      error: "bg-yellow-500",
      faild : "bg-red-600"
    }

  const hansleOrderStatusChange = async (orderId) => {
    try {
      const orderRef = doc(db, "orders", orderId)
      await updateDoc(orderRef, { status: status1,paymentStatus: status1, updatedAt: new Date().toISOString() })
      showMessages("Order status updated successfully!","success")
    } catch (err) {
      console.error("Error updating order status:", err)
      showMessages("Failed to update order status","faild")
    }
  }

  const confirmPayment = async (orderId) => {
    try {
      await updateDoc(doc(db, "orders", orderId), {
        paymentStatus: "paid",
        status: "paid",
        adminVerifiedAt: new Date().toISOString()
      })
      showMessages(" Payment confirmed! Order status updated to processing.","success")
      setShowProofModal(false)
    } catch (error) {
      console.error("Error confirming payment:", error)
      showMessages("Failed to confirm payment","faild")
    }
  }

  const rejectPayment = async (orderId) => {
    try {
      await updateDoc(doc(db, "orders", orderId), {
        paymentStatus: "unpaid",
        status: "unpaid",
        adminRejectedAt: new Date().toISOString()
      })
      showMessages(" Payment rejected. Order cancelled.","faild")
      setShowProofModal(false)
    } catch (error) {
      console.error("Error rejecting payment:", error)
      showMessages("Failed to reject payment","faild")
    }
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'paid':
        return { bg: 'bg-green-100', text: 'text-green-700', label: ' Paid' }
      case 'pending':
        return { bg: 'bg-yellow-100', text: 'text-yellow-700', label: ' Pending' }
      case 'unpaid':
        return { bg: 'bg-blue-100', text: 'text-blue-700', label: ' Processing' }
      default:
        return { bg: 'bg-red-600', text: 'text-gray-100', label: ' Unknown' }
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white z-10">
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
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filterStatus === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}>All Orders</button>

              <button onClick={() => setFilterStatus('pending')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filterStatus === 'pending'
                  ? 'bg-yellow-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >Pending</button>

              <button
                onClick={() => setFilterStatus('unpaid')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filterStatus === 'unpaid'
                  ? 'bg-red-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >Unpaid</button>

              <button onClick={() => setFilterStatus('paid')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filterStatus === 'paid'
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >Paid</button>
              
              <button onClick={() => setFilterStatus('delivered')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filterStatus === 'delivered'
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
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Delivery</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Payments</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">

                {filteredOrders.map((order) => {
                  const statusBadge = getStatusBadge(order.status)
                  return (
                    <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-medium text-gray-800">{order.id.slice(0,3) + "***" + order.id.slice(-3)}</p>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {order.createdAt ? new Date(order.createdAt).toLocaleString() : 'N/A'}
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-medium text-gray-800">{order.customer?.name}</p>
                        <p className="text-xs text-gray-500">{order.customer?.email}</p>
                        <p className="text-xs text-gray-500">{order.customer?.phoneNumber}</p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          {order.items?.map((item, idx) => (
                            <p key={idx} className="text-sm text-gray-600">
                              {item.name} x {item.quantity}
                            </p>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-bold text-blue-600">₦{order.summary?.total?.toLocaleString()}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-600">
                          {order.payment === 'card' ? ' Card' : 
                          order.payment === 'cash' ? ' Cash' : 
                          order.payment === 'transfer' ? 'Transfer' : 'N/A'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${statusBadge.bg} ${statusBadge.text}`}>
                          {statusBadge.label}
                        </span>
                      </td>

                      <td>
                        {order.deliveryStatus  === "delivered" ? (<span className='bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs'>delivered</span>) : ( <span className="text-xs text-red-600 bg-red-50 px-2 py-1 rounded">
                               not delivered
                            </span>)}
                      </td>
                      
                      {/* NEW: Payment Proof Column */}
                      <td className="px-6 py-4">
                        {order.paymentProof ? (
                          <div className="flex flex-col gap-2">

                            {order.paymentstatus === "paid" || order.status === "paid" ? (<span className='bg-green-600 text-green-100 px-2 py-1 rounded text-xs'>verified</span>) : (<div> <span className="text-xs text-yellow-600 bg-yellow-50 px-2 py-1 rounded">
                               Awaiting Verification
                            </span>
                            <button
                              onClick={() => {
                                setSelectedOrder(order)
                                setShowProofModal(true)
                              }}
                              className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                            >
                               View Proof
                            </button> </div>)}
                            {order.paymentStatus === "unpaid" || order.status === "unpaid" ? (<span className='bg-red-600 text-red-100 px-2 py-1 rounded text-xs'>Unverified</span>) : ""}
                            
                          </div>
                        ) : (
                          <span className="text-xs text-gray-400">No proof</span>
                        )}
                      </td>
                      
                      {/* Actions Column */}
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-2">
                          <select 
                            className="px-3 py-1 text-sm border border-gray-300 rounded-lg"
                            onChange={(e) => setStatus1(e.target.value)}
                            value={status1}
                          >
                            <option>Update Status</option>
                            <option value="pending"> Pending</option>
                            <option value="unpaid"> unpaid</option>
                            <option value="paid"> Paid</option>
                          </select>
                          
                          <button 
                            className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-lg"
                            onClick={() => hansleOrderStatusChange(order.id)}
                          >
                            ✓ Confirm
                          </button>
                          
                          <button className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg">
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
              <p className="text-sm text-gray-500">Showing {filteredOrders.length} of {orders1.length} orders</p>
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

      {/* Payment Proof Modal */}
      {showProofModal && selectedOrder && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl mx-4 p-6 max-h-[90vh] overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-gray-800">Payment Proof</h3>
        <button
          onClick={() => setShowProofModal(false)}
          className="text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
      </div>
      <div className="mb-4">
        <p className="text-sm text-gray-600 mb-2">Order ID: <strong>{selectedOrder.id}</strong></p>
        <p className="text-sm text-gray-600 mb-4">Customer: <strong>{selectedOrder.customer?.name}</strong></p>
        {selectedOrder.paymentProof && (
          <div className="border rounded-lg p-4 bg-gray-50 flex items-center justify-center">
            <img 
              src={selectedOrder.paymentProof} 
              alt="Payment Proof" 
              className="max-w-full max-h-96 w-auto h-auto object-contain rounded-lg"
            />
          </div>
        )}
      </div>
      <div className="flex gap-3">
        <button
          onClick={() => confirmPayment(selectedOrder.id)}
          className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-semibold"
        >
          ✅ Confirm Payment
        </button>
        <button
          onClick={() => rejectPayment(selectedOrder.id)}
          className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg font-semibold"
        >
          ❌ Reject Payment
        </button>
        <button
          onClick={() => setShowProofModal(false)}
          className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 rounded-lg font-semibold"
        >
          Close
        </button>
      </div>
    </div>
  </div>
)}
      {
        message && <div className={`slider fixed top-4 right-4 text-white px-4 py-2 rounded z-50 ${typeColor[message.type]}`}>
          <h2>{message.message}</h2>
        </div>
      }

    </div>
  )
}

export default AdminOrders