import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useContext,useState, useReducer,useEffect } from 'react';
import { db,storage } from '../Config/Firebase'
import { collection,getDoc,setDoc,doc,addDoc,getDocs, query, orderBy, deleteDoc,onSnapshot,updateDoc } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'

function Contact() {
  const navigate = useNavigate();
  const [forms, setForms] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    loading: false
  })
  
  const handleChange = (e)=> {
    const { name, value} = e.target;

    setForms({...forms, 
      [name]:value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try{



      if(forms.name === "" || forms.email === "" || forms.subject === "" || forms.message === ""){
      alert("put your details")
      setForms({...forms, loading: false})
      return
    }

    setForms({...forms,loading: true})

    const newData = {
    name: forms.name,
    email: forms.email,
    subject: forms.subject,
    message: forms.message,
    status: "unread",
    createdAt: new Date().toISOString()
    }


    const messageRef = collection(db, "messages");
    await addDoc(messageRef,newData)



    setForms({
      name: "",
      email: "",
      subject: "",
      message: "",
    })
    alert("message successfully sent")
    navigate("/")
    }catch(err){
        alert("something went wrong")
        console.error(err)
    }finally{
      setForms({
        ...forms,
        loading: false
      })
    }

    
  }

  return (
    <section className="min-h-screen bg-gray-50">
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Contact <span className="text-yellow-300">Us</span>
          </h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            We would love to hear from you. Reach out with questions, feedback, or just to say hello!
          </p>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6">

            <div className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-bold text-gray-800 mb-2">Phone</h3>
              <p className="text-gray-600 mb-1">+234 7068797258</p>
              <p className="text-gray-500 text-sm">Mon-Sun, 9am - 10pm</p>
            </div>

  
            <div className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-bold text-gray-800 mb-2">Email</h3>
              <p className="text-gray-600 mb-1">perryfresh25@gmail.com</p>
              <p className="text-gray-600">support@kenyskitchen.com</p>
            </div>

        
            <div className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-bold text-gray-800 mb-2">Location</h3>
              <p className="text-gray-600">123 odim Street,</p>
              <p className="text-gray-600">Enugu, Nigeria</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12">
            
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Send Us a <span className="text-blue-600">Message</span>
              </h2>
              <div className="w-20 h-1 bg-blue-600 mb-6"></div>
              <p className="text-gray-600 mb-8">
                Have a question, feedback, or special request? Fill out the form and we'll get back to you within 24 hours.
              </p>

              <form className="space-y-5" onSubmit={handleSubmit}>
                <div className="grid md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Full Name</label>
                    <input
                      name='name'
                      type="text"
                      placeholder="Enter your name"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      onChange={handleChange}
                      value={forms.name}
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Email Address</label>
                    <input
                      name='email'
                      type="email"
                      placeholder="Enter your email"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      onChange={handleChange}
                      value={forms.email}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Subject</label>
                  <input
                    name='subject'
                    type="text"
                    placeholder="What is this regarding?"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    onChange={handleChange}
                    value={forms.subject}
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Message</label>
                  <textarea
                    name='message'
                    onChange={handleChange}
                    value={forms.message}
                    rows="5"
                    placeholder="Tell us how we can help..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  ></textarea>
                </div>

                <button
                  disabled={forms.loading}
                  type="submit"
                  className={`w-full md:w-auto px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all duration-300 shadow-md${forms.loading ? " bg-gray-200 opacity-5 " : " "}`}
                >
                  {forms.loading ? "submitting.." : "submit"}
                </button>
              </form>
            </div>

            
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Find <span className="text-blue-600">Us</span>
              </h2>
              <div className="w-20 h-1 bg-blue-600 mb-6"></div>
              
              
              <div className="bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg overflow-hidden mb-6 p-8 text-center">
                <p className="text-blue-800 font-semibold text-lg">123 odim Street nsukka, ENUGU STATE</p>
                <p className="text-blue-600 text-sm mt-2">View on Google Maps</p>
              </div>

              
              <div className="bg-blue-50 rounded-lg p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4"> Business Hours</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Monday - Friday</span>
                    <span className="font-semibold text-gray-800">9:00 AM - 10:00 PM</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Saturday</span>
                    <span className="font-semibold text-gray-800">10:00 AM - 11:00 PM</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Sunday</span>
                    <span className="font-semibold text-gray-800">11:00 AM - 9:00 PM</span>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-blue-200">
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold text-blue-600">Note:</span> Last orders taken 30 minutes before closing
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

    </section>
  )
}

export default Contact