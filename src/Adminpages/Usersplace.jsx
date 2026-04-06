import React from 'react'
import { useContext,useState, useReducer,useEffect } from 'react';
import { db,storage } from '../Config/Firebase'
import { collection,getDoc,setDoc,doc,addDoc,getDocs, query, orderBy, deleteDoc,onSnapshot,updateDoc } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import Editusers from '../components/Editusers';


function Usersplace() {
  const [users, setusers] = useState([]);
  const [isopen, setIsopen] = useState(false);
  const [selecteduser, setSelecteduser] = useState(null);
  const [filteredusers, setFilteredusers] = useState("all");
  const [searchuser, setSearchuser] = useState("");


  useEffect(() => {
    const usersRef = collection(db, "users");
    const unsubscribe = onSnapshot(usersRef, (snapshot) => {
      const usersList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setusers(usersList);
    });
    return () => unsubscribe();
  }, []);

  const deleteUser = async (id) => {
    try{
      const userRef = doc(db, "users",id);
       await deleteDoc(userRef)
       setusers(prev => (prev.filter(p => p.id !== id)))
    }catch(err){console.error(err)}
  }
  const handleSelecteuser = (user) => {
    setSelecteduser(user)
    setIsopen(true)
    console.log(user)
  }

  if(isopen){
    return <Editusers 
    isopen={isopen} 
    isclosed={() => setIsopen(false)} 
    users={users} 
    putusers={() => setusers([])}
    selecteduser={selecteduser}
    />
    
  }

  const filtered = users.filter(p => p.name.toLowerCase().includes(searchuser.toLowerCase()));
  const filteredItems = filteredusers === "all" ? filtered  : filtered.filter(p => p.role === filteredusers)
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">User Management</h1>
      
      <div className="bg-white rounded-xl shadow-md">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 rounded-t-xl">
          <div className="flex flex-wrap justify-between items-center gap-4">
            <h2 className="font-bold text-gray-800">All Users</h2>
            <div className="flex gap-3">
              {/* Role Filter Dropdown */}
              <select className="px-3 py-1 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => setFilteredusers(e.target.value)}
              value={filteredusers}
              >
                <option value={"all"}>all</option>
                <option value ={'admin'}>Admin</option>
                <option value ={'user'}>User</option>
              </select>
              
              {/* Search Input */}
              <input
                onChange={(e) => setSearchuser(e.target.value)}
                value={searchuser}
                type="text"
                placeholder="Search users..."
                className="px-3 py-1 border rounded-lg text-sm w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Joined</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredItems.map((user) => {
                // const roleBadge = getRoleBadge(user.role)
                return (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 font-semibold">
                            {user.name.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">{user.name}</p>
                        </div>
                      </div>
                     </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-600">{user.email}</p>
                     </td>
                    <td className="px-6 py-4">
                      <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${user.role === 'admin' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                        {user.role === 'admin' ? 'Admin' : 'User'}
                      </span>
                     </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-600">{user.createdAt.toLocaleString()}</p>
                     </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors"
                        onClick={() => handleSelecteuser(user)}
                        >
                          Edit
                        </button>
                        <button className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded-lg transition-colors"
                        onClick={() => deleteUser(user.id)}
                        >
                          Delete
                        </button>
                      </div>
                     </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
    
      </div>
    </div>
  )
}

export default Usersplace