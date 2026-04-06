import React from 'react'
import { Link } from 'react-router-dom'
import { useContext,useState, useReducer } from 'react'
import { useCart } from '../Context/CartContext';

function Cart() {
  
  const { state,removeCart,increaseCart,decreaseCart } = useCart();
  const [selectedLocation, setSelectedLocation] = useState('within-5km')
  const subtotal = state.cart.reduce((sum, item) => sum + (item.price * item.cartquantity), 0);

  const deliveryFees = {
    'within-2km': 300,
    'within-5km': 500,
    'within-10km': 800,
    'outside-10km': 1200
  }
  const getDeliveryFee = () => {
    const fee = deliveryFees[selectedLocation] || 0;
    if (subtotal >= 20000) {
      return 0
    }
    if (subtotal >= 10000) {
      return Math.floor(fee * 0.5)
    }
    return fee;
  }


  const deliveryFee = getDeliveryFee()
  const total = subtotal + deliveryFee

  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link to="/">
              <h1 className="text-2xl font-bold">
                KENYS<span className="text-yellow-300">kitchen</span>
              </h1>
            </Link>
            <Link to="/menu" className="text-white hover:text-yellow-300 transition-colors">
              ← Continue Shopping
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        
        {/* Page Title */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Your <span className="text-blue-600">Cart</span></h2>
          <div className="w-20 h-1 bg-blue-600 mt-2"></div>
          <p className="text-gray-600 mt-2">{state.cart.length} item(s) in your cart</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Cart Items Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              
              {/* Table Header */}
              <div className="hidden md:grid grid-cols-12 gap-4 bg-gray-50 px-6 py-3 border-b border-gray-200 text-sm font-semibold text-gray-600">
                <div className="col-span-6">Product</div>
                <div className="col-span-2 text-center">Price</div>
                <div className="col-span-2 text-center">Quantity</div>
                <div className="col-span-2 text-right">Total</div>
              </div>

              {/* Cart Items */}
              <div className="divide-y divide-gray-100">
                {state.cart.map((item) => (
                  <div key={item.id} className="p-4 md:p-6 hover:bg-gray-50 transition-colors">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                      
                      {/* Product Info */}
                      <div className="md:col-span-6 flex items-center gap-4">
                        <img 
                          src={item.image} 
                          alt={item.name}
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                        <div>
                          <h3 className="font-semibold text-gray-800">{item.name}</h3>
                          <p className="text-sm text-gray-500 md:hidden">₦{item.price.toLocaleString()}</p>
                        </div>
                      </div>
                      
                      {/* Price (Desktop) */}
                      <div className="hidden md:block md:col-span-2 text-center text-gray-700">
                        ₦{item.price.toLocaleString()}
                      </div>
                      
                      {/* Quantity */}
                      <div className="md:col-span-2 flex justify-center">
                        <div className="flex items-center gap-2">
                          <button className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-600 font-bold transition-colors"
                          onClick={() => decreaseCart(item)}
                          >
                            -
                          </button>
                          <span className="w-8 text-center font-semibold text-gray-800">{item.cartquantity}</span>
                          <button className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-600 font-bold transition-colors"
                          onClick={() => increaseCart(item) }
                          >
                            +
                          </button>
                        </div>
                      </div>
                      
                      {/* Total */}
                      <div className="md:col-span-2 flex justify-between items-center md:justify-end">
                        <span className="font-bold text-blue-600">
                          ₦{(item.price * item.cartquantity).toLocaleString()}
                        </span>
                        <button className="ml-4 text-red-500 hover:text-red-700 transition-colors"
                          onClick={() => removeCart(item)}
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Empty Cart State */}
              {state.cart.length === 0 && (
                <div className="p-12 text-center">
                  <div className="text-6xl mb-4">🛒</div>
                  <p className="text-gray-500 text-lg">Your cart is empty</p>
                  <p className="text-gray-400 text-sm mt-1">Add some delicious food to your cart</p>
                  <Link to="/menu" className="inline-block mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    Browse Menu
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Order Summary Section */}
          <div>
            <div className="bg-white rounded-xl shadow-md overflow-hidden sticky top-24">
              <div className="bg-blue-50 px-6 py-4 border-b border-blue-100">
                <h3 className="text-xl font-bold text-gray-800">Order Summary</h3>
              </div>
              
              <div className="p-6">
                <div className="space-y-3">
              <div className="flex justify-between items-center">
            <span className="text-gray-600">Subtotal</span>
            <span className="font-semibold text-gray-800">₦{state.totalPrice.toLocaleString()}</span>
            </div>
    
            <div className="flex justify-between items-center">
                <span className="text-gray-600">Delivery Fee</span>
                <span className="font-semibold text-gray-800">₦{deliveryFee === 0 ? 'FREE' : `₦${deliveryFee.toLocaleString()}`}</span>
            </div>
    
              <div className="flex justify-between items-center gap-4">
              <span className="text-gray-600 whitespace-nowrap">Delivery location</span>
            <select  value={selectedLocation} onChange={(e) => setSelectedLocation(e.target.value)} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="within-2km">📍 Within 2km (₦300)</option>
              <option value="within-5km">📍 Within 5km (₦500)</option>
              <option value="within-10km">📍 Within 10km (₦800)</option>
              <option value="outside-10km">📍 Outside 10km (₦1,200)</option>
            </select>
      <span className="font-semibold text-gray-800 whitespace-nowrap">₦{state.totalPrice > 0 ? (state.totalPrice * 0.1).toLocaleString() : '0'}</span>
    </div>
    
    <div className="border-t border-gray-200 my-3"></div>
    
    <div className="flex justify-between items-center">
      <span className="text-lg font-bold text-gray-800">Total</span>
      <span className="text-xl font-bold text-blue-600">₦{state.totalPrice.toLocaleString()}</span>
    </div>
  </div>

  {state.cart.length > 0 ? (
  <Link to="/checkout">
    <button className="w-full mt-6 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg">
      Proceed to Checkout →
    </button>
  </Link>
    ) : (
  <button 
    disabled
    className="w-full mt-6 px-6 py-3 bg-gray-400 cursor-not-allowed text-white font-semibold rounded-lg"
  >
    Proceed to Checkout →
  </button>
)}

  <div className="mt-4 text-center">
    <Link to="/menu" className="text-sm text-blue-600 hover:text-blue-700">
      ← Continue Shopping
    </Link>
  </div>
</div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart