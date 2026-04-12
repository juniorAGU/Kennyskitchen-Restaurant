import React from 'react'
import { useState } from 'react'
import { useContext } from 'react'
import { AuthContext } from '../Context/AuthProvider'
import { Link,useNavigate } from 'react-router-dom'

function Login() {

  const { login } = useContext(AuthContext)
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);



  const showMessage = (message,type1) => {
    setMessage( { message, type1 } )
    setTimeout(() => setMessage(null),3000)
  }
  const testColors = {
    success : "bg-green-600",
    faild: "bg-red-600",
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try{
      setLoading(true)

    if (email === '' || password === '') {
      showMessage("Please fill in all fields!!!!!!", "faild")
      setLoading(false)
      return
    }

    if (password.length < 8) {
      showMessage("Password must be at least 8 characters","faild")
      setLoading(false)
      return

    }


    const succes = await login (email, password)
    showMessage("loged in successfully !!", "success")
    if(succes){
      navigate('/role-redirect')
      
      setEmail('')
      setPassword('')
      setLoading(false)
    }
    
    }catch(err){console.log(err.message)}
    

  }


  return (
    <section className="bg-white rounded-lg shadow-xl p-8">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
        Welcome Back
      </h2>
      <p className="text-center text-gray-600 mb-6">
        Login to your KENYSkitchen account
      </p>

      <form className="space-y-5" onSubmit={handleSubmit}>
        {/* Email */}
        <div>
          <label className="block text-gray-700 font-semibold mb-2">
            Email Address
          </label>
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-gray-700 font-semibold mb-2">Password</label>
          <input
            type="password"
            name="password"
            placeholder="Enter your password"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="remember"
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}

            />
            <label htmlFor="remember" className="ml-2 text-sm text-gray-600">Remember me</label>
          </div>
          <Link to={'/forgotpassword'} className="text-sm text-blue-600 hover:text-blue-700 font-semibold">
            Forgot Password?
          </Link>
        </div>

  
        <button
          type="submit"
          className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-300 shadow-md ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
      {
        message && <div className={`slider fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded ${testColors[message.type1]}`}>
          <h3>{message}</h3>
        </div>
      }

    </section>
  )
}

export default Login