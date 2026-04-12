import React from 'react'
import { useState,useReducer,useContext, useEffect} from 'react'
import { AdminContext } from '../Context/AdminContext'
import { useNavigate } from 'react-router-dom'



const initialState = {
  name: "",
  category: "",
  price: "",
  quantity: "",
  description: "",
  image: null,
  instock: false,
  loading: false
}
function Addfood() {

  const { addProduct } = useContext(AdminContext)
  const navigate = useNavigate();
  const [message, setMessage] = useState(null)

  const reducer = (state, action) => {
    switch(action.type){
      case "SET_NAME":
        return {...state, name: action.payload}
      case "SET_CATEGORY":
        return {...state, category: action.payload}
      case "SET_PRICE":
        return {...state,price: action.payload}
      case "SET_QUANTITY":
        return {...state, quantity: action.payload}
      case "SET_DESCRIPTION":
        return {...state, description: action.payload}
      case "SET_IMAGE":
        const file = action.payload
        if(file){
          const secondFile = URL.createObjectURL(file)
          return { ...state, image: file, imagedata: secondFile}
        }
        return {...state, image: null, imagedata: ""}
      case "SET_INSTOCK":
        return {...state, instock: action.payload }
      case "SET_LOADING":
        return {...state, loading: action.payload}
      case "RESET_FORM":
        return initialState
      default:
        return state
    }

  }

  const [state, dispatch] = useReducer(reducer, initialState)
  console.log(state)
  const handleChange = (e) => {
    const {name, value} = e.target;
    dispatch({
      type: `SET_${name}`.toUpperCase(),
      payload: value
    })
  }
  const handleImage = (e)=>{
    const file = e.target.files[0]
    dispatch({type: "SET_IMAGE",payload: file})
  }

  const handleChecked = (e)=>{
    const chek = e.target.checked;
    dispatch({
      type: "SET_INSTOCK",
      payload: chek
    }) 
  }


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





  const handdleSubmit = async (e) => {
    e.preventDefault();

    if(state.name === "" || state.category === "" || state.price === "" || state.description === "" || state.quantity === "" || state.instock === false){
      showMessages("Ensure that you put your details", "faild")
      return 
    }

    dispatch({ type: "SET_LOADING", payload: true })

     try{
    const datacollect = {
      name: state.name,
      category: state.category,
      price: Number(state.price),
      quantity: Number(state.quantity),
      description: state.description,
      stockquantity: 0,
      instock: state.instock
    }

    const success = await addProduct( datacollect, state.image)
    if(success){
      navigate("/admin/menu")
      dispatch({type: "RESET_FORM"})
    }




     }catch(error){
      console.error("Error adding product:", error);
     }finally{
      dispatch({type: "SET_LOADING", payload: false})
     }
  }

  useEffect(() => {
    return () => {
      if (state.imagedata) {
        URL.revokeObjectURL(state.imagedata)
      }
    }
  }, [state.imagedata])

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Add New Food Item</h1>
      
      <div className="bg-white rounded-xl shadow-md p-6">
        <form className="space-y-5" onSubmit={handdleSubmit}>
          
          
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Food Name</label>
            <input
              name='name'
              onChange={handleChange}
              value={state.name}
              type="text"
              placeholder="Enter food name"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Category</label>
            <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            name='category'
            onChange={handleChange}
            value={state.category}
            >
              <option>Select category</option>
              <option value={'main course'}>Main Course</option>
              <option value={'swallow'}>Swallow</option>
              <option value={'plater'}>Plater</option>
              <option value={'breakfast'}>Breakfast</option>
            </select>
          </div>

          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Price (₦)</label>
              <input
              value={state.price}
              onChange={handleChange}
              name='price'
                type="number"
                placeholder="Enter price"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Quantity</label>
              <input
                name='quantity'
                value={state.quantity}
                onChange={handleChange}
                type="number"
                placeholder="Enter quantity available"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Description</label>
            <textarea
              name='description'
              value={state.description}
              onChange={handleChange}
              rows="4"
              placeholder="Enter food description"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            ></textarea>
          </div>

          
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Food Image</label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
              <input
                type="file"
                onChange={handleImage}
                accept="image/*"
                className="hidden"
                id="imageUpload"
              />
              <label htmlFor="imageUpload" className="cursor-pointer">
                <div className="flex flex-col items-center gap-2">
                  <span className="text-4xl">📸</span>
                  <p className="text-gray-600">Click to upload image</p>
                  <p className="text-sm text-gray-400">PNG, JPG, JPEG up to 5MB</p>
                </div>
              </label>
            </div>
          </div>

        
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Image Preview</label>
            <div className="w-full h-48 bg-gray-100 rounded-lg border border-gray-300 flex items-center justify-center">
              <div className="text-center">
                <span className="text-3xl text-gray-400">
                  {state.imagedata ? <img src={state.imagedata} alt="Preview" className="max-h-40 rounded-lg"/> : "🖼️ "}
                </span>
              </div>
            </div>
          </div>

          
          <div className="flex items-center gap-3">
            <input 
              type="checkbox"
              checked={state.instock}
              onChange={handleChecked} 
              id="available" 
              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
            />
            <label htmlFor="available" className="text-gray-700">Available in stock</label>
          </div>

          
          <button 
            type="submit"
            disabled={state.loading}
            className={`w-full md:w-auto px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all shadow-md ${state.loading ? "cursor-not-allowed opacity-50" : ""}`}
          >
           {state.loading ? "Adding..." : "Add Food Item"}
          </button>
        </form>
      </div>
      {
        message && <div className={`slider fixed top-4 right-4 text-white px-4 py-2 rounded z-50 ${typeColor[message.type]}`}>
          <h2>{message.message}</h2>
        </div>
      }
    </div>
  )
}

export default Addfood