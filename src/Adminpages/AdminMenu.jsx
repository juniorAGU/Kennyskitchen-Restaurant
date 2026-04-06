import React from 'react'
import { useContext,useState } from 'react'
import { AdminContext } from '../Context/AdminContext'

function AdminMenu() {

  const { products,Editproduct,Deleteproduct } = useContext(AdminContext)


  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [editForm, setEditForm] = useState({
    name: '',
    price: '',
    quantity: "",
    category: '',
    instock: false,
  })
  const [loading,setLoading] = useState(false)
  const [newImageFile, setNewImageFile] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const setpage = 7

  const indexOfLastPage = currentPage * setpage
  const indexOfFirstPage = indexOfLastPage - setpage
  const currentProducts = products.slice(indexOfFirstPage, indexOfLastPage)

  const handleEditClick = (item) => {
    setEditingItem(item)
    setEditForm({
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      category: item.category,
      instock: item.instock,
    })
    setIsModalOpen(true)
  }
  const handleEditChange = (e) => {
    const { name, value, type, checked } = e.target
    setEditForm({
      ...editForm,
      [name]: type === 'checkbox' ? checked : value
    })
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    setNewImageFile(file)
    if(file){
      const imageUrl = URL.createObjectURL(file)
      setEditForm(prev => ({ ...prev, image: imageUrl }))
    }
  }

  const handleSaveEdit = async () => {
    try{

      await Editproduct(editingItem.id, editForm, newImageFile)
    
      console.log('Saving edit:', editForm)
      setIsModalOpen(false)
      setLoading(true)

    }catch(err){
      console.error(err)
    }finally{
      setLoading(false)
    }

    
  }

  const handleDeletbutton = async (id) => {
    try{
      const success = await Deleteproduct(id)
      if(success){
        return {"success": true}
      }
    }catch(err){console.log(err.message)}
  }



  return (
    <section>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Menu Items</h1> 
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      
      <div className="overflow-x-auto">
        <table className="w-full">
          
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">ID</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Name & Image</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Quantity</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">In Stock</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Price</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Category</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Actions</th>
            </tr>
          </thead>
          

          <tbody className="divide-y divide-gray-100">
            {currentProducts.map(items =>
            <tr className="hover:bg-gray-50 transition-colors" key={items.id}>
              <td className="px-6 py-4 text-sm text-gray-600">{items.id}</td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                    <img src={items.image} alt="data image" className="w-full h-full object-cover rounded-lg" />
                  </div>
                  <span className="font-medium text-gray-800">{items.name}</span>
                </div>
              </td>

              <td className="px-6 py-4 text-sm text-gray-600">
                {items.quantity === 0 ? (<span className="px-2 py-1 bg-red-500 text-white text-xs rounded-full">Out of Stock</span> ) : (items.quantity)}
              </td>

              <td className="px-6 py-4">
                <span className="text-sm text-green-600">{items.instock ? "✓In Stock" : "x"}</span>
              </td>
              <td className="px-6 py-4 text-sm font-medium text-gray-800"> ₦{items.price.toLocaleString()}</td>
              <td className="px-6 py-4 text-sm text-gray-600">{items.category}</td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => handleEditClick(items)}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
                  >
                    Edit
                  </button>
                  <button className="text-red-600 hover:text-red-800 text-sm font-medium transition-colors"
                  onClick={() => handleDeletbutton(items.id)}
                   >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
            )}
            {products.length === 0 && (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-gray-400">
                    <div className="flex flex-col items-center gap-2">
                      <span className="text-4xl">📋</span>
                      <p>No menu items yet</p>
                      <p className="text-sm">Add your first food item to see it here</p>
                    </div>
                  </td>
                </tr>
              )}
          </tbody>
        </table>
      </div>

      <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-500">Showing {currentProducts.length} of {products.length} items</p>
          <div className="flex gap-2">
            <button className="px-3 py-1 text-sm text-gray-500 border border-gray-200 rounded hover:bg-gray-100" disabled={currentPage === 1} onClick={() => setCurrentPage(prev => prev -1)}>Previous</button>
            <button className="px-3 py-1 text-sm text-gray-500 border border-gray-200 rounded hover:bg-gray-100" onClick={() => setCurrentPage(prev => prev +1)}>Next</button>
          </div>
        </div>
      </div>
    </div>
    {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-800">Edit Food Item</h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ✕
              </button>
            </div>
            
            <div className="p-6">
              <div className="space-y-5">
                {/* Food Name */}
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Food Name</label>
                  <input
                    type="text"
                    name="name"
                    value={editForm.name}
                    onChange={handleEditChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Category</label>
                  <select
                    name="category"
                    value={editForm.category}
                    onChange={handleEditChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select category</option>
                    <option value="Main Course">Main Course</option>
                    <option value="swallow">Swallow</option>
                    <option value="plater">Plater</option>
                    <option value="breakfast">Breakfast</option>
                  </select>
                </div>

                {/* Price and Quantity Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Price (₦)</label>
                    <input
                      type="number"
                      name="price"
                      value={editForm.price}
                      onChange={handleEditChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Quantity</label>
                    <input
                      type="number"
                      name="quantity"
                      value={editForm.quantity}
                      onChange={handleEditChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Description</label>
                  <textarea
                    name="description"
                    rows="3"
                    value={editForm.description}
                    onChange={handleEditChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  ></textarea>
                </div>

                {/* Image */}
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Image URL</label>
                  <input
                    type="file"
                    name="image"
                    onChange={handleImageChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {editForm.image && (
                    <div className="mt-2">
                      <img src={editForm.image} alt="Preview" className="w-24 h-24 object-cover rounded-lg"  />
                    </div>
                  )}
                </div>

                {/* In Stock Checkbox */}
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    name="instock"
                    checked={editForm.instock}
                    onChange={handleEditChange}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <label className="text-gray-700">Available in stock</label>
                </div>

                {/* Buttons */}
                <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveEdit}
                    className={`px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors shadow-md ${loading ? " cursor-not-allowed bg-gray-200 opacity-15" : " "}`}
                    disabled={loading}
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
)
}

export default AdminMenu