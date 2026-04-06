import React from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { Outlet } from 'react-router-dom'

function MainLayout() {
  return (
    <main className='w-full min-h-screen bg-gray-100'>
        <Header />
        <Outlet />
        <Footer />
    </main>
  )
}

export default MainLayout