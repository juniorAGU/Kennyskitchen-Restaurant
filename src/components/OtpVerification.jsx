import React, { useState, useEffect} from 'react'
import { doc, updateDoc } from 'firebase/firestore'
import { db } from '../Config/Firebase'
import { verifyOTP,generateOTP,storeOTPInFirestore,sendOtpByEmail} from './Otp'


function OTPVerificationModal({ order, onClose, onVerified }) {
  const [otpInput, setOtpInput] = useState('')
  const [verificationMessage, setVerificationMessage] = useState('')
  const [isVerifying, setIsVerifying,] = useState(false)
  const [isgenerating, setIsgeneratin ] = useState(false);
  const [cooldown, setCooldown] = useState(0)
  const [message, setMessage] = useState(null)

  useEffect(() => {
    if(cooldown > 0){
      const timer = setTimeout(() => {
        setCooldown(cooldown - 1)
      },1000)

      return () => clearTimeout(timer)
    }
  },[cooldown])
  

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


  const handleGenerateOtp = async () => {

    if (cooldown > 0) {
      setVerificationMessage(` Please wait ${cooldown} seconds before requesting again`)
      return
    }

    if (isgenerating) {
      return
    }


    try{

      

      setIsgeneratin(true)
      const otp =  generateOTP();
      const send = await sendOtpByEmail(order.customer?.email, otp, order.customer?.name)
      const saveToFirebase = await storeOTPInFirestore(order.id, otp)

      if(!saveToFirebase){
         setVerificationMessage(" OTP sent but failed to save. Please try again.")
         return 
      }
      setCooldown(50)
      setVerificationMessage(" OTP sent to " + order.customer?.email)
      showMessages("check your email for your code !!!", "success")

    }catch(err){
      console.error("check your code something is wrong", err)
        setVerificationMessage(" Something went wrong. Please try again.")
    }finally{
      setIsgeneratin(false)
    }
  }

  const handleVerifyOTP = async () => {
    if (!otpInput || otpInput.length !== 6) {
      setVerificationMessage("Please enter a 6-digit OTP code")
      return
    }
    
    setIsVerifying(true)
    
    // Verify the OTP
    const result =  await verifyOTP(order.id, otpInput)
    
    if (result.valid) {
      setVerificationMessage( result.message)
      
      // Update order status in Firebase
      try {
        const orderRef = doc(db, "orders", order.id)
        await updateDoc(orderRef, {
          deliveryStatus: "delivered",
          deliveredAt: new Date().toISOString(),
          verifiedBy: "customer"
        })
        
        showMessages(" Delivery confirmed! Thank you for your order !!.", "success")
        onVerified() // Callback to refresh orders
        onClose() // Close modal
      } catch (error) {
        console.error("Failed to update order:", error)
        setVerificationMessage(" Failed to update order status. Please try again.")
      }
    } else {
      setVerificationMessage(result.message)
    }
    
    setIsVerifying(false)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
        <div className="bg-gradient-to-r from-green-600 to-green-800 text-white p-6 rounded-t-xl">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Verify Delivery</h2>
            <button onClick={onClose} className="text-white hover:text-yellow-300 text-2xl">
              ✕
            </button>
          </div>
          <p className="text-sm mt-2">Order #{order.orderId || order.id.slice(-8)}</p>
        </div>

        <div className="p-6">
          {/* Order Info */}
          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <p className="text-sm text-gray-600">Order Details:</p>
            <p className="font-semibold">{order.customer?.name}</p>
            <p className="text-sm text-gray-500 mt-1">
              {order.items?.map(item => item.name).join(", ")}
            </p>
            <p className="text-sm font-semibold text-blue-600 mt-2">
              Total: ₦{order.summary?.total?.toLocaleString()}
            </p>
          </div>

          {/* OTP Input */}
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">
              Enter Delivery OTP Code
            </label>
            <input
              type="text"
              maxLength="6"
              placeholder="Enter 6-digit code"
              value={otpInput}
              onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, ''))}
              className="w-full px-4 py-3 text-center text-2xl font-mono tracking-wider border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              autoFocus
            />
            {verificationMessage && (
              <p className={`mt-2 text-sm ${verificationMessage.includes('✅') ? 'text-green-600' : 'text-red-600'}`}>
                {verificationMessage}
              </p>
            )}
          </div>

          {/* Verify Button */}
          <button
            onClick={handleVerifyOTP}
            disabled={isVerifying || !otpInput || otpInput.length !== 6}
            className={`w-full py-3 rounded-lg font-semibold ${
              isVerifying || !otpInput || otpInput.length !== 6
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-green-600 hover:bg-green-700 text-white'
            }`}
          >
            {isVerifying ? "Verifying..." : " Confirm Delivery"}
          </button>

          <p className="text-xs text-gray-400 text-center mt-4">
            Enter the OTP code sent to your email to confirm delivery
          </p>
          <button className={`px-1 py-1 bg-green-500 font-semibold text-white rounded-md ${isgenerating ? "bg-gray-300 cursor-not-allowed " : "bg-blue-600 hover:bg-blue-700 text-white "}`}
          onClick={handleGenerateOtp}
          disabled={isVerifying}
          >
            {isgenerating ?  "Requesting..." : cooldown > 0 ? `Wait ${cooldown}s to request again` : " Request OTP Code"}
          </button>
        </div>
      </div>
      {
        message && <div className={`slider fixed top-4 right-4 text-white px-4 py-2 rounded z-50 ${typeColor[message.type]}`}>
          <h2>{message.message}</h2>
        </div>
      }
    </div>
  )
}

export default OTPVerificationModal