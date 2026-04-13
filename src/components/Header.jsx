import React from 'react'
import { Icon } from '@iconify/react'
import menuIcon from '@iconify/icons-ooui/menu';
import Navbar from './Navbar';
import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../Context/AuthProvider'
function Header() {
  const { users } = useContext(AuthContext);
  return (
    <header className='w-full h-[80px] bg-blue-200 flex items-center gap-20 px-4 sticky top-0 z-50  rounded-lg p-2 shadow-md'>

        <div className="menubar  p-2 rounded-lg cursor-pointer">
            <Navbar />
        </div>

        <div className="logo bg-slate-300">
            <h1 className='text-2xl md:text-3xl font-bold tracking-tight bg-black text-white px-2 py-1 rounded-lg'>
                KENYS<span className='text-blue-600'>kitchen</span>
            </h1>
        </div>


        {
            !users ? (<div className="hidden md:flex items-center gap-3 ml-auto">
            <button 
                className="px-5 py-2 bg-transparent border-2 border-blue-600 text-blue-600 font-semibold rounded-lg hover:bg-blue-600 hover:text-white transition-all duration-300"
            >
                <Link to={'/login'}> 
                Login
                 </Link>
            </button>
            <button 
                className="px-5 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all duration-300 shadow-md"
            >
                <Link to={'/register'}>
                  Register
                </Link>
            </button>
        </div>) : (
            <div className="hidden md:flex items-center gap-3 ml-auto">
               <p className='font-bold bg-blue-400 px-2 py-1 rounded-md text-white'><i>Hi !!</i>, {users.name}!</p>

            </div>
        )
        }
        
    </header>
  )
}

export default Header