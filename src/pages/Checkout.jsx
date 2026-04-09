import { Link, useNavigate} from 'react-router-dom'
import { useContext, useState,useEffect  } from 'react'
import { useCart } from '../Context/CartContext';
import { AdminContext } from '../Context/AdminContext'
import { db,storage } from '../Config/Firebase'
import { auth } from '../Config/Firebase'
import { collection,getDoc,setDoc,doc,addDoc,getDocs, query, orderBy, deleteDoc,onSnapshot, count, updateDoc,} from 'firebase/firestore'
import { onAuthStateChanged } from 'firebase/auth'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import Uploadpayment from '../components/Uploadpayment';
import { v4 as uuidv4 } from 'uuid'


function Checkout() {
  const { state, clearCart} = useCart();

  const [dataset, setDataset] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    deliveryaddress: "",
    city: "",
    postalcode: "",
    payment: "cash",
    note: ""
  })
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)
  const [toggle, setToggle] = useState(false)
  const [uploadid, setUploadid] = useState(null)
  const navigate = useNavigate()

  

 useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
      console.log("Auth state changed:", currentUser)
    })
    
    return () => unsubscribe()
  }, [])
  
  console.log("User:", user)
  console.log("User ID:", user?.uid)


const items = state.cart.map(item => ({
        productId: item.id,
        name: item.name,
        price: item.price,
        quantity: item.cartquantity,
        subtotal: item.price * item.cartquantity
      }))
const handleChange = (e) => {
  const {name,value} = e.target;
  // const cleanValue = value.trim()


  

  // const cleanValue = value.replace(/["']/g, '').trim()

  setDataset({...dataset,
    [name]: value
  })
}
const subtotal = state.cart.reduce((sum, item) => sum + (item.price * item.cartquantity), 0)
const deliveryFee = subtotal > 0 ? 500 : 0
const total = subtotal + deliveryFee


const orderId = uuidv4();
/*const handleSubmit = async (e) => {
  e.preventDefault();
  setToggle(true)


  if(state.cart.length === 0) {
    alert("Your cart is empty. Please add items before checking out.")
    return
  }


   if(dataset.name === "" || dataset.email === "" || dataset.phoneNumber === "" || dataset.deliveryaddress === "" || dataset.city === "" || dataset.postalcode ===""){
     alert("please ensure you put all your details")
     setLoading(false)
     return
   }

   if(!user){
    alert("somethng went wrong")
    return
   }

   setLoading(true)

  try{

    for(const cartitem of state.cart) {
      
      
      const productRef = doc(db, "products", cartitem.id)
      const productDoc = await getDoc(productRef)
      
      console.log(`   - Document exists: ${productDoc.exists()}`)
      
      if(productDoc.exists()) {
        const productData = productDoc.data()
        
        
        const currentStock = productData.quantity
        const newStock = currentStock - cartitem.cartquantity
        
       
        
        await updateDoc(productRef, {
          quantity: newStock,
          instock: newStock > 0
        })
        
        console.log(`   ✅ Stock updated! ${cartitem.name}: ${currentStock} → ${newStock}`)
        navigate("/dashboard")
      } else {
        console.log(`   Product NOT FOUND in Firebase!`)
      }
    }

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
      status: "unpaid",
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
    

    
    const doceRef = await addDoc(collection(db, "orders"),ordersData)
    console.log("Order placed with ID:", doceRef.id)
    setUploadid(doceRef.id)
    // setDataset({
    //   name: "",
    //   email: "",
    //   phoneNumber: "",
    //   deliveryaddress: "",
    //   city: "",
    //   postalcode: "",
    //   payment: "cash",
    //   note: ""
    // })
    // clearCart()
    alert("your Order is placed succesfully")
  }catch(err){
    console.error(err)
  }finally{
    setLoading(false)
    
  }

}*/








  

  

  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white sticky top-0 z-0">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link to="/">
              <h1 className="text-2xl font-bold">
                KENYS<span className="text-yellow-300">kitchen</span>
              </h1>
            </Link>
            <Link to="/cart" className="text-white hover:text-yellow-300 transition-colors">
              ← Back to Cart
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        
        {/* Page Title */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Checkout</h2>
          <div className="w-20 h-1 bg-blue-600 mt-2"></div>
          <p className="text-gray-600 mt-2">Complete your order</p>
        </div>
        <form>
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Left Column - Form */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Delivery Information */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span>📦</span> Delivery Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Full Name</label>
                  <input
                  name='name'
                  onChange={handleChange}
                  value={dataset.name}
                    type="text"
                    placeholder="Enter your full name"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Phone Number</label>
                  <input
                    type="tel"
                    name='phoneNumber'
                    onChange={handleChange}
                    value={dataset.phoneNumber}
                    placeholder="Enter your phone number"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-gray-700 font-semibold mb-2">Email Address</label>
                  <input
                  name='email'
                  onChange={handleChange}
                  value={dataset.email}
                    type="email"
                    placeholder="Enter your email"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-gray-700 font-semibold mb-2">Delivery Address</label>
                  <textarea
                  name='deliveryaddress'
                  onChange={handleChange}
                  value={dataset.deliveryaddress}
                    rows="3"
                    placeholder="Enter your full address"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  ></textarea>
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">City</label>
                  <input
                  name='city'
                  onChange={handleChange}
                  value={dataset.city}
                    type="text"
                    placeholder="Enter your city"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Postal Code</label>
                  <input
                    name='postalcode'
                     onChange={handleChange}
                     value={dataset.postalcode}
                    type="number"
                    placeholder="Enter postal code"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span>💳</span> Payment Method
              </h3>
              <div className="space-y-3">
                <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                  <input 
                  type="radio" 
                  name="payment" 
                  value="card" 
                  checked={dataset.payment === "card" } 
                  className="w-4 h-4 text-blue-600" 
                  onChange={handleChange}/>
                  <div>
                    <p className="font-semibold text-gray-800">💳 Credit / Debit Card</p>
                    <p className="text-sm text-gray-500">Pay with your card</p>
                  </div>
                </label>
                <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                  <input 
                  type="radio" 
                  name="payment" 
                  value="cash"  
                  checked={dataset.payment === "cash"} 
                  onChange={handleChange} 
                  className="w-4 h-4 text-blue-600" />
                  <div>
                    <p className="font-semibold text-gray-800">💵 Cash on Delivery</p>
                    <p className="text-sm text-gray-500">Pay when you receive your order</p>
                  </div>
                </label>
                <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                  <input 
                  type="radio" 
                  name="payment" 
                  value="transfer" 
                  checked = {dataset.payment === "transfer"} 
                  className="w-4 h-4 text-blue-600" 
                  onChange={handleChange}/>
                  <div>
                    <p className="font-semibold text-gray-800">🏦 Bank Transfer</p>
                    <p className="text-sm text-gray-500">Pay via bank transfer</p>
                  </div>
                </label>
              </div>
            </div>

            {/* Order Notes */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span>📝</span> Order Notes (required)
              </h3>
              <textarea
              name='note'
              onChange={handleChange}
              value={dataset.note}
                rows="3"
                placeholder="Special instructions, delivery notes, etc."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              ></textarea>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div>
            <div className="bg-white rounded-xl shadow-md overflow-hidden sticky top-24">
              <div className="bg-blue-50 px-6 py-4 border-b border-blue-100">
                <h3 className="text-xl font-bold text-gray-800">Order Summary</h3>
              </div>
              
              <div className="p-6">
                {/* ✅ FIXED: Dynamic cart items from state */}
                <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                  {state.cart.length === 0 ? (
                    <p className="text-center text-gray-500 py-4">Your cart is empty</p>
                  ) : (
                    state.cart.map((item) => (
                      <div key={item.id} className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">
                          {item.name} x {item.cartquantity}
                        </span>
                        <span className="font-semibold text-gray-800">
                          ₦{(item.price * item.cartquantity).toLocaleString()}
                        </span>
                      </div>
                    ))
                  )}
                </div>
                
                <div className="border-t border-gray-200 pt-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-semibold text-gray-800">
                      ₦{subtotal.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Delivery Fee</span>
                    <span className="font-semibold text-gray-800">
                      ₦{deliveryFee.toLocaleString()}
                    </span>
                  </div>
                  <div className="border-t border-gray-200 my-3"></div>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-800">Total</span>
                    <span className="text-xl font-bold text-blue-600">
                      ₦{total.toLocaleString()}
                    </span>
                  </div>
                </div>

                <button className={`w-full mt-6 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all duration-300 shadow-md ${loading ? "bg-gray-300 cursor-not-allowed" : " "}`}
                type='button'
                onClick={() => setToggle(true)}
                disabled={loading}
                >
                  {loading ? "placing your oreders...." : "Place Order →"}
                </button>

                <p className="text-center text-xs text-gray-400 mt-4">
                  By placing your order, you agree to our Terms of Service and Privacy Policy
                </p>
              </div>
            </div>
          </div>
        </div>
                    {toggle && (
                    <Uploadpayment 
                      setToggle={setToggle}
                      dataset={dataset}  // Pass form data
                      cart={state.cart}  // Pass cart items
                      user={user}        // Pass user
                      clearCart={clearCart}
                    />
                  )}
        </form>
      </div>
    </div>
  )
}

export default Checkout