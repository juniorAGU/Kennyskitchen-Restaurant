import { useState } from 'react'
import './App.css'
import { createBrowserRouter,RouterProvider } from 'react-router-dom'
import AuthProvider from './Context/AuthProvider'
import MainLayout from './Layouts/MainLayout'
import Home from './pages/Home'
import About from './pages/About'
import Contact from './pages/Contact'
import Menu from './pages/Menu'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard  from './pages/Dashboard'
import ErrorPlace from './components/ErrorPlace'
import ProtectedRoute  from './pages/ProtectedRoute'
import AuthLayout from './Layouts/AuthLayout'
import Cart from './pages/Cart'
import AdminLayout from './Layouts/AdminLayout'
import Admindashbord from './Adminpages/Admindashbord'
import Addfood from './Adminpages/Addfood'
import Settings from './Adminpages/Settings'
import Usersplace from './Adminpages/Usersplace'
import Order from './Adminpages/Order'
import AdminMenu from './Adminpages/AdminMenu'
import AdminProvider from './Context/AdminContext'
import CartContextProvider from './Context/CartContext'
import AdminMessage from './Adminpages/AdminMessage'
import ForgotPassword from './pages/Forgetpassword'
import RoleRouter from './pages/Redirect'
import Checkout from './pages/Checkout'
import emailjs from '@emailjs/browser'





function App() {
emailjs.init('g6k3a4SWme-oTVKk3')
  const router = createBrowserRouter([
    {
      path: '/',
      element: <MainLayout />,
      errorElement: <ErrorPlace />,
      children: [
        {index: true, element: <Home />},
        {path: 'about', element: <About />},
        {path: 'contact', element: <Contact />},
        {path: 'dashboard', element: <ProtectedRoute>  <Dashboard />  </ProtectedRoute>},
        {path: 'menu', element: <ProtectedRoute>  <Menu />  </ProtectedRoute>},
        {path: 'cart', element: <ProtectedRoute>  <Cart />  </ProtectedRoute>},
        {path: 'checkout', element: <ProtectedRoute>  <Checkout />  </ProtectedRoute>}
      ]
    },
     {
      path: '/login',
      element: <AuthLayout />,
      children: [{ index: true, element: <Login /> }]
    },
     {
      path: '/register',
      element: <AuthLayout />,
      children: [{ index: true, element: <Register /> }]
    },
    {
      path: '/forgotpassword',
      element: <AuthLayout />,
      children: [{ index: true, element: <ForgotPassword />}]
    },
    { path: "admin", 
      element: <AdminLayout />,
      children: [
        {index: true, element: <Admindashbord />},
        {path: 'addfood', element: <Addfood />},
        {path: 'settings', element: <Settings />},
        {path: 'users', element: <Usersplace />},
        {path: 'orders', element: <Order />},
        {path: 'menu', element: <AdminMenu />},
        {path: 'messages', element: <AdminMessage />},
        {path: 'messages/:messageId', element: <AdminMessage />}
      ]
    },
    {
      path: '/role-redirect',
      element: <RoleRouter />
    }
  ])

  return (
    <AuthProvider>
      <AdminProvider>
        <CartContextProvider>
          <RouterProvider router={router} />
        </CartContextProvider>
      </AdminProvider>
    </AuthProvider>
  )
}

export default App
