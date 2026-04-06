import React from 'react'
import { useContext,useState, useReducer,useEffect } from 'react';
import { Link, useParams,useNavigate } from 'react-router-dom';

import { db,storage } from '../Config/Firebase'
import { collection,getDoc,setDoc,doc,addDoc,getDocs, query, orderBy, deleteDoc,onSnapshot,updateDoc } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'

function AdminMessage() {
    const navigate = useNavigate();
    const  { messageId }  = useParams()
    const [messages, setMessage] = useState([]);
    const [currentpage, setCurrentpage] = useState(1)
    const [statusFilter, setStatusFilter] = useState("all")
    const setPage = 3
    useEffect(()=> {
        const messageRef = collection(db,"messages")
        const unsubscribe = onSnapshot(messageRef,(messageQueery)=> {
            const messageList = messageQueery.docs.map(docc => ({
                id: docc.id,
                ...docc.data()
            }))
        setMessage(messageList)

        })

        return  () => unsubscribe()
    },[])
console.log(messages)

    const deleteMessage = async (id) => {
        try{
            const messageRef = doc(db, "messages", id)
            await deleteDoc(messageRef)

            setMessage(prev => (prev.filter(mess => mess.id !== id)))
            navigate('/admin/messages')
        }catch(eer){console.error(eer)}
    }
    
    const indexLast = currentpage * setPage;      
    const indexFirst = indexLast - setPage;
    const filterdMessage = messages.slice(indexFirst,indexLast);

    const setStatuseFiltering = filterdMessage.filter(filteredData => {
      if(statusFilter === "all") return true 
      if(statusFilter === "unread") return filteredData.status === "unread"
      if(statusFilter === "read") return filteredData.status === "read"
      return true ;
    })

    console.log(filterdMessage)
    const updatingDoc = async (messageId) => {
        const messageRef = doc(db,"messages", messageId)
        await updateDoc(messageRef,{status: "read"})
      }

      useEffect(() => {
        if(messageId){
          updatingDoc(messageId)
        }
      },[messageId])
    if(messageId){

       const messagedata = messages.find(mess => mess.id === messageId)
       console.log("the messageId is ",messagedata)
        return(
            <div>
                <h1 className="text-2xl font-bold text-gray-800 mb-6">Message Details</h1>
                <div className="bg-white rounded-xl shadow-md p-6">
                    <p className="text-sm text-gray-600 mb-2">From: {messages.find(m => m.id === messageId)?.name}</p>
                    <p className="text-sm text-gray-600 mb-2">Email: {messages.find(m => m.id === messageId)?.email}</p>
                    <h2 className="font-bold text-gray-800 mb-1">{messages.find(m => m.id === messageId)?.subject}</h2>
                    <p className="text-gray-600 text-sm mb-3">{messages.find(m => m.id === messageId)?.message}</p>
                    <p className="text-xs text-gray-400">{messages.find(m => m.id === messageId)?.date}</p>
                    <div className="flex gap-2 mt-4">
                        <button className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg"
                        onClick={() => updatingDoc(messagedata.id)}
                        >
                            Reply
                        </button>
                        <button className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded-lg"
                         onClick={() => deleteMessage(messagedata.id)}
                        >
                          Delete
                        </button>
                    </div>
                </div>

            </div>
        )
    }
    
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Customer Messages</h1>
      
      {/* Filters */}
      <div className="bg-white rounded-xl shadow-md p-4 mb-6">
        <div className="flex flex-wrap justify-between items-center gap-4">
          <div className="flex gap-2">
            <button className={`${statusFilter === "all" ? 'bg-blue-600 text-whte px-4 py-2 rounded-lg text-sm font-medium' : "px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium"}`}
            onClick={() => setStatusFilter("all")}
            >All</button>
            <button className={`${statusFilter === "unread" ? "bg-red-400 text-white  rounded-lg text-sm font-medium hover:bg-gray-300 px-4 py-2" : "px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300"}`}
            onClick={() => setStatusFilter("unread")}
            >Unread</button>
            <button className={`${statusFilter === "read" ? "bg-green-400 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50" : " px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300"}`}
            onClick={()=>setStatusFilter("read")}
            >Read</button>
          </div>
          <input
            type="text"
            placeholder="Search messages..."
            className="px-3 py-2 border rounded-lg text-sm w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Messages Cards */}
      <div className="space-y-4">
        {setStatuseFiltering.map((message) => (
          <div key={message.id} className={`bg-white rounded-xl shadow-md p-6 border-l-4 ${message.status === 'unread' ? 'border-l-red-500' : 'border-l-green-300'}`}>
          
            
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-semibold">
                      {message.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">{message.name}</p>
                    <p className="text-xs text-gray-500">{message.email}</p>
                  </div>
                  {message.status === 'unread' && (
                    <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full">Unread</span>
                  )}
                </div>
                
                <h3 className="font-bold text-gray-800 mb-1">{message.subject}</h3>
                <p className="text-gray-600 text-sm mb-3">{message.message?.length > 100 ? `${message.message.substring(0, 100)}...` : message.message}</p>
                <p className="text-xs text-gray-400">{message.date}</p>
              </div>
              
              <div className="flex gap-2">
                <button className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg">
                     <Link to={`/admin/messages/${message.id}`}>
                          View
                     </Link>
                </button>
              </div>
            </div>
        ))}
      </div>

      {/* Empty State */}
      {setStatuseFiltering.length === 0 && (
        <div className="text-center py-16 bg-white rounded-xl shadow-md">
          <div className="text-6xl mb-4">📭</div>
          <p className="text-gray-500 text-lg">No messages yet</p>
          <p className="text-gray-400 text-sm mt-1">Messages from customers will appear here</p>
        </div>
      )}

      {/* Pagination */}
      <div className="flex justify-center mt-6">
        <div className="flex gap-2">
          <button className="px-3 py-1 text-sm text-gray-500 border border-gray-200 rounded hover:bg-gray-100"
          onClick={() => setCurrentpage(prev => prev - 1)}
          >
            Previous
          </button>
          <button className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">
            1
          </button>
          <button className="px-3 py-1 text-sm text-gray-500 border border-gray-200 rounded hover:bg-gray-100">
            2
          </button>
          <button className="px-3 py-1 text-sm text-gray-500 border border-gray-200 rounded hover:bg-gray-100">
            3
          </button>
          <button className="px-3 py-1 text-sm text-gray-500 border border-gray-200 rounded hover:bg-gray-100"
          onClick={() => setCurrentpage(prev => prev + 1)}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  )
}

export default AdminMessage