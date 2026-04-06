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
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    try{
      setLoading(true)

    if (email === '' || password === '') {
      alert("Please fill in all fields")
      setLoading(false)
      return
    }

    if (password.length < 8) {
      alert("Password must be at least 8 characters")
      setLoading(false)
      return

    }


    const succes = await login (email, password)
    console.log("data collected from login",succes)
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

    </section>
  )
}

export default Login