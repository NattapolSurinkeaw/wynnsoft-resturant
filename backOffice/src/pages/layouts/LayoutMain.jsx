import React from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Navbar from './Navbar'

function LayoutMain() {
  return (
    <div>
      <div className="flex h-screen bg-[#FFEFC6]">
        <Sidebar />
        <div className="flex-1">
          <Navbar />
          <div className='p-6'>
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  )
}

export default LayoutMain