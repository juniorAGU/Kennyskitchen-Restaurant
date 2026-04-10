import React from 'react'
import { useNavigate } from 'react-router-dom'
import { generateOTP,sendOtpByEmail,storeOTPInFirestore } from './Otp'
import { useState } from 'react'

function ReceiptModal({ order, setShowReceipt, dataset }) {
  const navigate = useNavigate()
  const [isgenerating, setIsgenerating] = useState(false)


    const handleTestOTP = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      setIsgenerating(true)

        const otp = generateOTP()
        console.log("Generated OTP:", otp)
        
        const result = await sendOtpByEmail(dataset.email, otp, dataset.name)
        console.log("Email send result:", result)
    
        if(result) {
            
            await storeOTPInFirestore(order.id, otp)
            console.log("OTP stored in Firestore for order ID:", order.id)
            alert('OTP sent! Check your email')
            navigate("/dashboard")
        } else {
            alert('Failed to send')
        }
    } catch(err) {
        console.error('OTP Error:', err)
    }finally{
      setIsgenerating(false)
    }
}

  const handlePrint = () => {
    window.print()
  }
  const handleDownload = () => {
    // Create a text version of the receipt
    const receiptText = `
      KENYS KITCHEN - ORDER RECEIPT
      ================================
      
      Order ID: ${order.orderId}
      Date: ${new Date(order.createdAt).toLocaleString()}
      
      CUSTOMER INFORMATION
      --------------------------------
      Name: ${order.customer?.name}
      Email: ${order.customer?.email}
      Phone: ${order.customer?.phoneNumber}
      Address: ${order.customer?.address}
      City: ${order.customer?.city}
      
      ORDER DETAILS
      --------------------------------
      ${order.items?.map(item => `${item.name} x ${item.quantity} = ₦${(item.price * item.quantity).toLocaleString()}`).join('\n      ')}
      
      PAYMENT SUMMARY
      --------------------------------
      Subtotal: ₦${order.summary?.subtotal?.toLocaleString()}
      Delivery Fee: ₦${order.summary?.deliveryFee?.toLocaleString()}
      Total: ₦${order.summary?.total?.toLocaleString()}
      
      Payment Method: ${order.payment}
      Order Status: ${order.status}
      
      Thank you for shopping with KENYSkitchen!
    `
    
    const blob = new Blob([receiptText], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `receipt_${order.id}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6 rounded-t-xl">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">KENYS<span className="text-yellow-300">kitchen</span></h1>
              <p className="text-sm mt-1">Order Receipt</p>
            </div>
            <button
              onClick={() => setShowReceipt(false)}
              className="text-white hover:text-yellow-300 text-2xl"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Receipt Content */}
        <div className="p-6" id="receipt-content">
          {/* Order Info */}
          <div className="border-b border-gray-200 pb-4 mb-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500">Order ID</p>
                <p className="font-mono text-sm font-semibold">{order.orderId}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Date</p>
                <p className="text-sm font-semibold">
                  {order.createdAt ? new Date(order.createdAt).toLocaleString() : 'N/A'}
                </p>
              </div>
            </div>
          </div>

          {/* Customer Information */}
          <div className="border-b border-gray-200 pb-4 mb-4">
            <h3 className="font-semibold text-gray-800 mb-2">Customer Information</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <p className="text-gray-500">Name</p>
                <p className="font-medium">{order.customer?.name}</p>
              </div>
              <div>
                <p className="text-gray-500">Email</p>
                <p className="font-medium">{order.customer?.email}</p>
              </div>
              <div>
                <p className="text-gray-500">Phone</p>
                <p className="font-medium">{order.customer?.phoneNumber}</p>
              </div>
              <div>
                <p className="text-gray-500">City</p>
                <p className="font-medium">{order.customer?.city}</p>
              </div>
              <div className="col-span-2">
                <p className="text-gray-500">Delivery Address</p>
                <p className="font-medium">{order.customer?.address}</p>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="border-b border-gray-200 pb-4 mb-4">
            <h3 className="font-semibold text-gray-800 mb-3">Order Items</h3>
            <div className="space-y-2">
              {/* Table Header */}
              <div className="grid grid-cols-3 text-sm font-semibold text-gray-600 pb-2 border-b">
                <div>Item</div>
                <div className="text-center">Quantity</div>
                <div className="text-right">Price</div>
              </div>
              
              {/* Items */}
              {order.items?.map((item, idx) => (
                <div key={idx} className="grid grid-cols-3 text-sm">
                  <div className="font-medium text-gray-800">{item.name}</div>
                  <div className="text-center text-gray-600">x{item.quantity}</div>
                  <div className="text-right text-gray-800">
                    ₦{(item.price * item.quantity).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Summary */}
          <div className="border-b border-gray-200 pb-4 mb-4">
            <h3 className="font-semibold text-gray-800 mb-3">Payment Summary</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">₦{order.summary?.subtotal?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Delivery Fee</span>
                <span className="font-medium">₦{order.summary?.deliveryFee?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-200">
                <span>Total</span>
                <span className="text-blue-600">₦{order.summary?.total?.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Payment Status */}
          <div className="mb-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500">Payment Method</p>
                <p className="font-semibold">
                  {order.payment === 'card' ? '💳 Credit/Debit Card' : 
                   order.payment === 'cash' ? '💵 Cash on Delivery' : 
                   order.payment === 'transfer' ? '🏦 Bank Transfer' : 'N/A'}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Order Status</p>
                <p className={`font-semibold ${
                  order.status === 'paid' ? 'text-green-600' :
                  order.status === 'pending' ? 'text-yellow-600' :
                  order.status === 'processing' ? 'text-blue-600' :
                  order.status === 'delivered' ? 'text-purple-600' : 'text-gray-600'
                }`}>
                  {order.status === 'paid' ? '✅ Paid' :
                   order.status === 'pending' ? '⏳ Pending' :
                   order.status === 'processing' ? '🔄 Processing' :
                   order.status === 'delivered' ? '📦 Delivered' : '❓ Unknown'}
                </p>
              </div>
            </div>
          </div>

          {/* Thank You Message */}
          <div className="text-center pt-4 border-t border-gray-200">
            <p className="text-gray-600 text-sm">Thank you for shopping with us!</p>
            <p className="text-xs text-gray-400 mt-1">For support, contact: support@kenyskitchen.com</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="border-t border-gray-200 p-4 flex gap-3">
          <button
            onClick={handlePrint}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold transition-colors"
          >
            🖨️ Print Receipt
          </button>
          <button
          disabled ={isgenerating}
            onClick={handleTestOTP}
            className={`flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-semibold transition-colors ${isgenerating ? "cursor-not-allowed bg-gray-300" : " "}`}
          >
            {isgenerating ? "generating OTP..." : "Delivery Number"}
          </button>
          <button
            onClick={() => {
              setShowReceipt(false)
              navigate('/dashboard')
            }}
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 rounded-lg font-semibold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

export default ReceiptModal

