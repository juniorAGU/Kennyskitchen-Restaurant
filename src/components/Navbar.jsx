import React from 'react'
import { useState,useEffect } from 'react'
import Image from '../assets/ooui--menu.png'
import { useRef } from 'react'
import { Link} from "react-router-dom"
import { NavLink } from 'react-router-dom'

function Navbar() {
    const [ isopen,setIsopen] = useState(false)
    const menuRef = useRef(null)
    const backDropref = useRef(null);

useEffect(() => {
    if(isopen){
        menuRef.current.classList.add("menu-open")
        backDropref.current.classList.add("backdrop-open")    
    }else{
        menuRef.current.classList.remove("menu-open")
        backDropref.current.classList.remove("backdrop-open")
    }
},[isopen]);


const closetab = () => {
        setIsopen(!isopen)
    }


  return (
   <section>
        <img 
        src={Image}
        alt='profile'
        className='w-10 h-10 px-1 py-1  cursor-pointer hover:border-2 hover:border-blue-500 hover:rounded-lg'
        onClick={()=> setIsopen(!isopen)}
        />

    
        <>
                    
            <div  className="fixed inset-0 bg-black/50 z-40 transition-all duration-300 ease-in-out opacity-0 pointer-events-none" ref={backDropref} onClick={closetab}/>
                    
                <div ref={menuRef} className="fixed top-0 left-0 w-[400px] h-full bg-white shadow-2xl z-50 transition-all duration-300 ease-in-out opacity-0 -translate-x-full pointer-events-none">
                        
                    <div className="flex justify-between items-center p-4 border-b border-gray-200">
                        <h2 className="text-xl font-bold text-gray-800">
                            KENYS<span className="text-blue-600">kitchen</span>
                        </h2>
                        <button 
                        onClick={closetab}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        >
                        X
                        </button>
                    </div>

                    <nav className="p-4  h-96">
                        <ul className="space-y-2 w-full h-full">
                            <li >
                                <NavLink  
                                    to="/" 
                                    className={({isActive}) => `${isActive ? "bg-blue-400 block px-4 py-3 text-white" : ""} block px-4 py-3 text-gray-700 hover:bg-blue-100 hover:text-blue-600 rounded-lg transition-colors `}
                                    onClick={closetab}
                                    >
                                       Home
                                </NavLink >
                            </li>
                            <li>
                                <NavLink 
                                    to ="/menu" 
                                    className={({isActive}) =>  `${isActive ? "bg-blue-400 block px-4 py-3 text-white" : ""} block px-4 py-3 text-gray-700 hover:bg-blue-100 hover:text-blue-600 rounded-lg transition-colors`}
                                    onClick={closetab}
                                    >
                                      Menu
                                </NavLink >
                            </li>
                            <li>
                                <NavLink 
                                    to ="/cart" 
                                    className={({isActive}) =>  `${isActive ? "bg-blue-400 block px-4 py-3 text-white" : ""} block px-4 py-3 text-gray-700 hover:bg-blue-100 hover:text-blue-600 rounded-lg transition-colors`}
                                    onClick={closetab}
                                    >
                                      Cart
                                </NavLink >
                            </li>
                            <li>
                                <NavLink 
                                    to ="/about" 
                                    className={({isActive}) =>  `${isActive ? "bg-blue-400 block px-4 py-3 text-white" : ""} block px-4 py-3 text-gray-700 hover:bg-blue-100 hover:text-blue-600 rounded-lg transition-colors`}
                                    onClick={closetab}
                                    >
                                      About
                                </NavLink >
                            </li>
                            <li>
                                    <NavLink 
                                    to ="/contact" 
                                    className={({isActive}) =>  `${isActive ? "bg-blue-400 block px-4 py-3 text-white" : ""}  block px-4 py-3 text-gray-700 hover:bg-blue-100 hover:text-blue-600 rounded-lg transition-colors`}
                                    onClick={closetab}
                                    >
                                         Contact
                                    </NavLink >
                            </li>
                            
                            <li>
                                    <NavLink  
                                        to ="/dashboard" 
                                        className={({isActive}) => `${isActive ? "bg-blue-400 block px-4 py-3 text-white" : ""} block px-4 py-3 text-gray-700 hover:bg-blue-100 hover:text-blue-600 rounded-lg transition-colors`}
                                        onClick={closetab}
                                    >
                                        Dashboard
                                    </NavLink >
                            </li>
                            <li>
                                    <NavLink  
                                        to ="/admin" 
                                        className={({isActive}) => `${isActive ? "bg-blue-400 block px-4 py-3 text-white" : ""} block px-4 py-3 text-gray-700 hover:bg-blue-100 hover:text-blue-600 rounded-lg transition-colors`}
                                        onClick={closetab}
                                    >
                                         Admin Dashboard
                                    </NavLink >
                            </li>
                        </ul>
                    </nav>
                        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
                            <div className="text-sm text-gray-500 text-center">
                                © 2026 KENYSkitchen
                            </div>
                        </div>
                    </div>
                </>
   </section>
  )
}

export default Navbar