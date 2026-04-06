import React from 'react'
import { AuthContext } from '../Context/AuthProvider'
import { AdminContext } from '../Context/AdminContext'
import { useState,useEffect,useContext } from 'react'
import { db,storage } from '../Config/Firebase'
import { collection,getDoc,setDoc,doc,addDoc,getDocs, query, orderBy, where, deleteDoc,onSnapshot,updateDoc } from 'firebase/firestore'


function Admindashbord() {
  const { users } = useContext(AuthContext)
  const [allusers, setAllusers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [totalmenu, setTotalmenu] = useState([]);
  const [pendingorders, setPendingorders] = useState(0);


  useEffect(() => {
    const usersRef = collection(db, "users")
    const onsub = onSnapshot(usersRef,(subquerry) => {
      const userList = subquerry.docs.map(docc => ({
        id: docc.id,
        ...docc.data()
      }))
      setAllusers(userList)
    })

    return  () => onsub()
  },[])
  
  useEffect(() => {
    const orderRef = collection(db, "orders");
    const subscrib = onSnapshot(orderRef,(subquerry) => {
      const orderList = subquerry.docs.map(docc => ({
        id: docc.id,
        ...docc.data(),
      }))
      setOrders(orderList)
    })
    return () => subscrib()
  },[])
  useEffect(() => {
    const productRef = collection(db, "products");
    const subscrib = onSnapshot(productRef,(subquerry) => {
      const productList = subquerry.docs.map(docc => ({
        id: docc.id,
        ...docc.data()
      }))
      setTotalmenu(productList)
    })
    return () => subscrib() 
  },[])
  useEffect(() => {
    const pendingRef = collection(db,"orders")
    const qer = query(pendingRef, where("status", "==", "pending"));
    const subscrib = onSnapshot(qer,(subquerry) => {
      const pendingList = subquerry.docs.map(docc => ({
        id: docc.id,
        ...docc.data()
      }))
      setPendingorders(pendingList.length)
    })
    return () => subscrib()
  },[])
  console.log(orders)

 
  return (
    <section className='w-full '>
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard Overview</h1>
      
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 ">
        
          <div  className="bg-white rounded-xl shadow-md p-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-500 text-sm">Total Users</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">{allusers.length || 0}</p>
              </div>
              <div className="text-3xl"></div>
            </div>
          </div>

          <div  className="bg-white rounded-xl shadow-md p-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-500 text-sm">Total Orders</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">{orders.length || 0}</p>
              </div>
              <div className="text-3xl"></div>
            </div>
          </div>

          <div  className="bg-white rounded-xl shadow-md p-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-500 text-sm">Total Menu</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">{totalmenu.length || 0}</p>
              </div>
              <div className="text-3xl"></div>
            </div>
          </div>

          <div  className="bg-white rounded-xl shadow-md p-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-500 text-sm">Pending Orders</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">{pendingorders}</p>
              </div>
              <div className="text-3xl"></div>
            </div>
          </div>
        
      </div>

      
      <div className="grid lg:grid-cols-2 gap-6">
        
        <div className="bg-white rounded-xl shadow-md flex flex-col h-96">
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 rounded-t-xl">
            <h2 className="font-bold text-gray-800">Recent Orders</h2>
          </div>
          <div className='flex-1 overflow-y-auto'>
            {
            orders.map(order => 
            <div className="p-6 flex items-center justify-around" key={order.id}>
            <p className="text-gray-500 break-words max-w-[100px]">{order.items.map(item => item.name).join(",")}</p>
            <p  className="text-gray-500">{order.status}</p>
            <p  className="text-gray-500">{order.cartquantity}</p>
            <p  className="text-gray-500"> ₦{(order.summary.total).toLocaleString()}</p>
          </div>
            )
          }
          </div>
          
        </div>

        
        <div className="bg-white rounded-xl shadow-md flex flex-col h-96">
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 rounded-t-xl">
            <h2 className="font-bold text-gray-800">Recent Users</h2>
          </div>
         <div className='flex-1 overflow-y-auto'>
          {
          allusers.map(user => 
             <div className="p-6 flex items-center justify-around space-x-4  key={user.id}">
            <p className="text-gray-500">{user.name}</p>
            <p className="text-sm text-gray-500">{user.email}</p>
            <p className="text-xs text-gray-400">{user.role}</p>
          </div>
          )
         }
         </div>
        </div>
        
      </div>
    </div>
    </section>
  )
}

export default Admindashbord