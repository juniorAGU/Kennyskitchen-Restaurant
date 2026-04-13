import React from 'react'
import { Link } from 'react-router-dom'
import Cart from './Cart'
import { useContext,useState, useReducer } from 'react'
import { AdminContext } from '../Context/AdminContext'
import { useCart } from '../Context/CartContext'
import { typeColor } from '../components/Typecolor'





function Menu() {
  const { products } = useContext(AdminContext)
  const [searchTerm, setSearchTerm] = useState('')
  const { state, addtoCart, removeCart, message, showMessage } = useCart();
  

  


  const filteredProducts = products.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

   const totalQuantity = state.cart.reduce((total, item) => total + item.cartquantity, 0)


  





  

  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* Header with Search Bar and Cart Icon - STATIC (no scroll) */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <Link to="/">
              <h1 className="text-2xl font-bold">
                KENYS<span className="text-yellow-300">kitchen</span>
              </h1>
            </Link>
            
            {/* Search Bar */}
            <div className="flex-1 max-w-md mx-4">
              <div className="relative">
                <input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  type="text"
                  placeholder="Search for delicious food..."
                  className="w-full px-4 py-2 pl-10 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-yellow-300"
                />
                <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
              </div>
            </div>
            
            {/* Cart Icon */}
            <Link to="/cart" className="relative">
              <span className="text-2xl">🛒</span>
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {totalQuantity}
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content Container - STATIC header, SCROLLABLE grid */}
      <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col h-[calc(100vh-80px)]">
        
        {/* Page Title - STATIC (no scroll) */}
        <div className="flex-shrink-0 mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Our <span className="text-blue-600">Menu</span></h2>
          <div className="w-20 h-1 bg-blue-600 mt-2"></div>
          <p className="text-gray-600 mt-2">Discover our delicious selection of meals</p>
        </div>

        {/* Grid Layout - 4 columns with SCROLL */}
        <div className="flex-1 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-blue-600 scrollbar-track-gray-200">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-4">
            
            {filteredProducts.map((item) => (
              <div key={item.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={item.image} 
                    alt={item.name}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                  />
                  {/* Out of Stock Badge */}
                  {item.instock ? (
                    <div className="absolute top-2 right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">
                      IN STOCK
                    </div>
                  ) : (
                    <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                      OUT OF STOCK
                    </div>
                  )}
                </div>
                
                {/* Content */}
                <div className="p-4">
                  {/* Food Name */}
                  <h3 className="text-lg font-bold text-gray-800 mb-1">{item.name}</h3>
                  
                  {/* Description */}
                  <p className="text-gray-500 text-sm mb-3 line-clamp-2">{item.description}</p>
                  
                  {/* Price and Button */}
                  <div className="flex justify-between items-center">
                    <span className="text-blue-600 font-bold text-lg">₦{(item.price).toLocaleString()}</span>
                    
                    {/* Add Button */}
                    <button 
                    onClick={() => {
                      addtoCart(item);
                    }}
                      disabled={!item.instock}
                      className={`px-3 py-1 rounded-lg text-sm font-semibold transition-all ${
                        item.instock 
                          ? 'bg-blue-600 hover:bg-blue-900 text-white' 
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      {item.instock ? 'Add to Cart +' : 'Unavailable'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {
        message && <div className={`slider fixed top-4 right-4 text-white px-4 py-2 rounded z-50 ${typeColor[message.type]}`}>
          <h2>{message.msg}</h2>
        </div>
      }
    </div>
  )
  
}

export default Menu