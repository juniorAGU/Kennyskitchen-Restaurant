import React from 'react'
import { createContext, useEffect, useState } from 'react'
import { auth } from '../Config/Firebase'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword,signOut,onAuthStateChanged } from 'firebase/auth'
import { db } from '../Config/Firebase'
import { getDoc,setDoc,doc } from 'firebase/firestore'



export const AuthContext = createContext()

function AuthProvider({children}) {
    const [users , setUsers] = useState(null)
    const [authenticated, setAuthenticated] = useState(false)
    const [loading, setLoading] = useState(true)

    useEffect(()=> {
        const dataCollected = onAuthStateChanged(auth, async (user) => {
            if (user){
                const restData = await getDoc(doc(db, "users", user.uid))
                const existedData = restData.exists() ? restData.data() : {}

                localStorage.setItem("users", JSON.stringify({
                    email: user.email,
                    uid: user.uid,
                    name: existedData.name || ""
                }))
                setUsers({
                    email: user.email,
                    uid: user.uid,
                    name: existedData.name || "",
                    role: existedData.role || "",
                    createdAt: existedData.createdAt || "",
                    updatedAt: existedData.updatedAt || ""
                })
                setLoading(false)
                setAuthenticated(true)
            }else{
                setAuthenticated(false)
                setUsers(null)
                localStorage.removeItem("users")
            }
            setLoading(false)
        })

        return () => dataCollected()
    },[])

    const register = async (data) => {
        try{
            const userData = await createUserWithEmailAndPassword(auth, data.email, data.password)
            const user = userData.user
            await setDoc(doc(db, "users",user.uid),{
                name: data.name,
                email: data.email,
                role: "user",
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            })
            setUsers({
                userID: user.uid,
                name: data.name,
                email: user.email,
                role: "user",
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            })
            setAuthenticated(true)
            return true
        }catch(error){
            console.log(error.message)
            return false
        }
    }

    const login = async (email, password)=>{
        try{
            let dataGoten = await signInWithEmailAndPassword(auth, email,password)
            const user = dataGoten.user


            const stirDoc = await getDoc(doc(db, "users", user.uid))
            const stepDoc = stirDoc.data();

            setUsers({
                id: user.uid,
                email: user.email,
                role: stepDoc.role || "user",
                ...stepDoc
            })
            setAuthenticated(true)
            return { success: true, role: stepDoc?.role || "user"}
            
            }catch(err){
                console.log(err.message)
                alert("email not Registered.")
            }
    }

    const logout = async ()=>{
        try{
           const success = await signOut(auth);
            setUsers(null)
            setAuthenticated(false)
            return true
        }catch(err){console.log(err.message)}
    }

    const values= {
        users,
        register,
        login,
        logout,
        authenticated,
        loading
    }
  return <AuthContext.Provider value={values}>
    {children}
  </AuthContext.Provider>
}

export default AuthProvider