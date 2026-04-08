import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { db, storage } from '../Config/Firebase'
import { collection, addDoc, doc, updateDoc, getDoc } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { v4 as uuidv4 } from 'uuid'

function Uploadpayment({ setToggle, dataset, cart, user, clearCart }) {
  const [loading, setLoading] = useState(false)
  const [proof, setProof] = useState(null)  
  const [uploading, setUploading] = useState(false)
  const navigate = useNavigate()

  // Calculate totals
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.cartquantity), 0)
  const deliveryFee = subtotal > 0 ? 500 : 0
  const total = subtotal + deliveryFee

  const items = cart.map(item => ({
    productId: item.id,
    name: item.name,
    price: item.price,
    quantity: item.cartquantity,
    subtotal: item.price * item.cartquantity
  }))

  
  const handleImageSelect = (e) => {
    const file = e.target.files[0]
    if (file) {
      
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file')
        return
      }
      if (file.size > 5 * 1024 * 1024) { 
        alert('Image size should be less than 5MB')
        return
      }
      setProof(file)
    }
  }

  // Function to upload image and create order
  const handlePlaceOrder = async () => {
    
    if(dataset.name === "" || dataset.email === "" || dataset.phoneNumber === "" || 
       dataset.deliveryaddress === "" || dataset.city === "" || dataset.postalcode === ""){
      alert("Please ensure you put all your details")
      return
    }

    if(!user){
      alert("Something went wrong. Please login again.")
      return
    }

    if(cart.length === 0) {
      alert("Your cart is empty")
      return
    }

    
    if(dataset.payment === "transfer" && !proof) {
      alert("Please upload your payment proof image")
      return
    }

    setLoading(true)
    setUploading(true)

    try {
      
      for(const cartitem of cart) {
        const productRef = doc(db, "products", cartitem.id)
        const productDoc = await getDoc(productRef)
        
        if(productDoc.exists()) {
          const productData = productDoc.data()
          const currentStock = productData.quantity
          const newStock = currentStock - cartitem.cartquantity
          
          await updateDoc(productRef, {
            quantity: newStock,
            instock: newStock > 0
          })
        }
      }

      
      const orderId = uuidv4()
      const ordersData = {
        orderId: orderId,
        userID: user.uid,
        customer: {
          name: dataset.name,
          email: dataset.email,
          phoneNumber: dataset.phoneNumber,
          address: dataset.deliveryaddress,
          city: dataset.city,
          postalcode: dataset.postalcode
        },
        items: items,
        payment: dataset.payment,
        note: dataset.note,
        summary: {
          subtotal: subtotal,
          deliveryFee: deliveryFee,
          total: total,
        },
        status: "pending",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      
      if(dataset.payment === "transfer") {
        ordersData.paymentStatus = "pending"
        
      }

      const docRef = await addDoc(collection(db, "orders"), ordersData)
      const newOrderId = docRef.id

      
      let imageUrl = null
      if(dataset.payment === "transfer"  && proof) {
        try {
    
          const filename = `payment-proofs/${Date.now()}`
          const storageRef = ref(storage, filename)
          await uploadBytes(storageRef, proof)
          imageUrl = await getDownloadURL(storageRef)

          
          await updateDoc(docRef, {
            paymentProof: imageUrl,
            paymentStatus: "pending",
            customerConfirmedAt: new Date().toISOString()
          })
          
          alert("Order placed! Payment proof uploaded. Admin will verify your payment.")
        } catch (uploadError) {
          console.error("Upload error:", uploadError)
          alert("Error uploading payment proof, but order was created. Please contact support.")
        }
      } else {
        alert("Order placed successfully!")
      }

      
      clearCart()
      setToggle(false)
      navigate('/dashboard')

    } catch(err) {
      console.error("Order error:", err)
      alert("Error placing order: " + err.message)
    } finally {
      setLoading(false)
      setUploading(false)
    }
  }

  return (
    <section>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4 p-6">
          <div className="text-center">
            <div className="text-5xl mb-4">🏦</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Complete Your Payment</h2>
            
            
            <div className="bg-gray-50 p-4 rounded-lg mb-4 text-left">
              <p className="font-semibold mb-2">Order Summary:</p>
              <p className="text-sm">Subtotal: ₦{subtotal.toLocaleString()}</p>
              <p className="text-sm">Delivery Fee: ₦{deliveryFee.toLocaleString()}</p>
              <p className="text-sm font-bold">Total: ₦{total.toLocaleString()}</p>
              <p className="text-sm mt-2">Payment Method: {dataset.payment}</p>
            </div>
            
            
            {dataset.payment === "transfer" && (
              <div className="bg-yellow-50 p-4 rounded-lg mb-4 text-left">
                <p className="font-semibold mb-2">Bank Transfer Details:</p>
                <p className="text-sm">Bank: <strong>Zenith Bank</strong></p>
                <p className="text-sm">Account Name: <strong>KENYSkitchen</strong></p>
                <p className="text-sm">Account Number: <strong>2264672713</strong></p>
                <p className="text-sm">Amount: <strong className="text-blue-600">₦{total.toLocaleString()}</strong></p>
              </div>
            )}
            
            
            {dataset.payment === "transfer" && (
              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2 text-left">
                  Upload Payment Proof (Screenshot)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}  
                  className="w-full border border-gray-300 rounded-lg p-2"
                />
                {proof && (
                  <p className="text-xs text-green-600 mt-1">
                    ✓ File selected: {proof.name}
                  </p>
                )}
                <p className="text-xs text-gray-400 mt-1">
                  Upload a screenshot of your bank transfer (Max 5MB)
                </p>
              </div>
            )}
            
          
            <button
              onClick={handlePlaceOrder}
              disabled={loading || (dataset.payment === "transfer" && !proof)}
              className={`w-full py-2 rounded-lg font-semibold mb-2 ${
                loading || (dataset.payment === "transfer" && !proof)
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-green-600 hover:bg-green-700 text-white'
              }`}
            >
              {loading ? (
                uploading ? "Uploading image..." : "Placing Order..."
              ) : (
                "✅ Confirm & Place Order"
              )}
            </button>
            
            {/* Close button */}
            <button
              onClick={() => setToggle(false)}
              className="w-full py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Uploadpayment