import React from 'react'
import { Outlet,Link } from 'react-router-dom'


function AuthLayout() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
        <header className="w-full py-6 px-4">
        <div className="max-w-md mx-auto text-center">
          <Link to="/">
            <h1 className="text-3xl font-bold tracking-tight bg-black text-white px-4 py-2 rounded-lg inline-block">
              KENYS<span className="text-blue-400">kitchen</span>
            </h1>
          </Link>
        </div>
      </header>

      <section className="flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
            <Outlet />
        </div>
      </section>
    </main>
  )
}

export default AuthLayout