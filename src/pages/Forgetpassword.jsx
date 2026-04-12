import React, { useState } from 'react';
import { getAuth, sendPasswordResetEmail } from "firebase/auth";

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState(null);
  const [error, setError] = useState('');

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

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setError('');

    if (!email) {
      showMessages('Please enter your email address. !!!', "faild");
      return;
    }

    const auth = getAuth();
    try {
      await sendPasswordResetEmail(auth, email);
      showMessages(`A password reset link has been sent to ${email}. Please check your inbox.`,"success");
      setEmail(''); 
    } catch (err) {
      console.error("Error sending reset email:", err);
      
      switch (err.code) {
        case 'auth/user-not-found':
          setError('No account found with this email address.');
          break;
        case 'auth/invalid-email':
          setError('Please enter a valid email address.');
          break;
        default:
          setError('Failed to send reset email. Please try again later.');
      }
    }
  };

  return (
    <div className="flex justify-center items-center min-h-80 bg-gray-100 ">
      <div className="bg-white p-8 rounded-lg shadow-md w-96 ">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Reset Your Password</h2>
        <form onSubmit={handlePasswordReset}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">Email Address</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="you@example.com"
              required
            />
          </div>
          {message && <p className="text-green-500 text-xs italic mb-4">{message}</p>}
          {error && <p className="text-red-500 text-xs italic mb-4">{error}</p>}
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300"
          >
            Send Reset Link
          </button>
        </form>
      </div>
      {
        message && <div className={`slider fixed top-4 right-4 text-white px-4 py-2 z-50 rounded ${typeColor[message.type]}`}>
          <h2>{message.message}</h2>
        </div>
      }
    </div>
  );
}

export default ForgotPassword;