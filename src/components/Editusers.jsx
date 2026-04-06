import React from 'react'
import { useContext,useState, useReducer,useEffect } from 'react';
import { db,storage } from '../Config/Firebase'
import { collection,getDoc,setDoc,doc,addDoc,getDocs, query, orderBy, deleteDoc,onSnapshot,updateDoc } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'

function Editusers( {isopen, isclosed, users,selecteduser} ) {
    const [dataset, setDataset] = useState({
        name: "",
        email: "",
        phoneNumber: "",
        role: "",
        loading: false
    })
    useEffect(() => {
        if (selecteduser) {
            setDataset({
                name: selecteduser.name || "",
                email: selecteduser.email || "",
                phoneNumber: selecteduser.phoneNumber || "",
                role: selecteduser.role || "user",
                loading: false
            })
        }
    }, [selecteduser])


    const handlechange = (e) => {
        const {name,value} = e.target;
        setDataset({
            ...dataset,
            [name]: value
        }) 
    }


    const handdleSubmit = async (e) => {
        e.preventDefault()

        setDataset({...dataset, loading: true})
        const newData = {
            name: dataset.name,
            email: dataset.email,
            phoneNumber: dataset.phoneNumber,
            role: dataset.role,
            updatedAt: new Date().toISOString()
        }
        try{

            if(dataset.name === "" || dataset.email === "" || dataset.phoneNumber === "" || dataset.role === ""){
                alert("please ensure that you put all your details")
                return
            }

            const userRef = doc(db, "users", selecteduser.id)
            await updateDoc(userRef,newData)





            alert(`you have successfully updated ${users.name} profile`)
            isclosed()
        }catch(err){
            console.error()
        }finally{
            setDataset({...dataset,loading: false})
        
        }
    }
    if(!isopen) return null

 return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4">
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">User Information</h2>
          <button 
            onClick={isclosed}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ✕
          </button>
        </div>

        
        <form className="p-6 space-y-4" onSubmit={handdleSubmit}>
          
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Full Name</label>
            <input
              type="text"
              name='name'
              value={dataset.name}
              onChange={handlechange}
              placeholder="Enter full name"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Email Address</label>
            <input
              type="email"
              name="email"
              value={dataset.email}
              onChange={handlechange}
              placeholder="Enter email address"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Phone Number</label>
            <input
              type="tel"
              name="phoneNumber"
              value={dataset.phoneNumber}
              onChange={handlechange}
              placeholder="Enter phone number"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Role</label>
            <select
            value={dataset.role}
            onChange={handlechange}
              name="role"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={isclosed}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled = {dataset.loading}
              className={`flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors shadow-md ${dataset.loading ? " bg-gray-400 opacity-50 cursor-not-allowed" : " "}`}
            >
              {dataset.loading ? "proccesisng... " : "proceed"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Editusers