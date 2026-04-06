import React from 'react'
import { useReducer, } from 'react'
import { useContext } from 'react'
import { AuthContext } from '../Context/AuthProvider'
import { Link,useNavigate } from 'react-router-dom'


const initialState = {
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  loading: false
}
function Register() {

const navigate = useNavigate();

const reducer = (state,action)=>{
  switch(action.type){
    case "SET_NAME":
      return{...state,name: action.payload}
    case "SET_EMAIL":
      return{...state,email: action.payload}
    case "SET_PASSWORD":
      return{...state,password: action.payload}
    case "SET_CONFIRMPASSWORD":
      return{...state,confirmPassword: action.payload}
    case "SET_LOADING":
      return{...state,loading: action.payload}
    case "RESET_FORM":
      return{...initialState,loading: false}
    default:
      return state
  }
}

const [state, dispatch] = useReducer(reducer, initialState);

const {register} = useContext(AuthContext);

const handlechange = (e) => {
  const {name,value} = e.target;
  dispatch({
    type: `SET_${name}`.toUpperCase(),
    payload: value
  })
}

const handleSubmite = async (e)=>{
  e.preventDefault();

  try{

    if(state.name === "" || state.email === "" || state.password === "" || state.confirmPassword === ""){
    alert("Please fill in all fields")
    return
  }
 if(state.password.length < 8){
    alert("Password must be at least 8 characters")
    return
  }

  if(state.password !== state.confirmPassword){
    alert("Password do not match")
     return
   }



  dispatch({type: "SET_LOADING", payload: true})



  const newData = {
    name: state.name,
    email: state.email,
    password: state.password,

  }

   const success = await register(newData);

   if(success){
    navigate("/")
  
    dispatch({type: "RESET_FORM"})
   }
  dispatch({type: "SET_LOADING", payload: false})


  }catch(err){console.log(err.message)}




}

  return (
    <section className=" bg-white rounded-lg shadow-xl p-8">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
        Create an Account
      </h2>
      <p className="text-center text-gray-600 mb-6">
        Join KENYSkitchen today
      </p>

      <form className=" space-y-4" onSubmit={handleSubmite}>

        <div>
          <label className="block text-gray-700 font-semibold mb-2"> Full Name</label>
          <input
            type="text"
            name="name"
            placeholder="Enter your full name"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            value={state.name}
            onChange={handlechange}
          />
        </div>
        <div>
          <label className="block text-gray-700 font-semibold mb-2">Email Address</label>
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            value={state.email}
            onChange={handlechange}
          />
        </div>

        <div>
          <label className="block text-gray-700 font-semibold mb-2"> Password</label>
          <input
            type="password"
            name="password"
            placeholder="Create a password"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            value={state.password}
            onChange={handlechange}
          />
        </div>

        <div>
          <label className="block text-gray-700 font-semibold mb-2">Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm your password"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            value={state.confirmPassword}
            onChange={handlechange}
          />
        </div>

        <button
          type="submit"
          className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-300 shadow-md ${state.loading ? 'opacity-50 cursor-not-allowed bg-gray-400' : ''}`}
          disabled={state.loading}
        >
          {state.loading ? 'Registering...' : 'Register'}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 hover:text-blue-700 font-semibold">
            Login here
          </Link>
        </p>
      </div>

    </section>
  )
}

export default Register