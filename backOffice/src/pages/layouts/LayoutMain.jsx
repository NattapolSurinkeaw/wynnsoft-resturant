import React from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Navbar from './Navbar'

function LayoutMain() {
  return (
    <div>
      <div className="bg-[#FFEFC6] flex">
        <Sidebar />
        <div className="flex-1">
          <Navbar />
          <div className='p-4'>
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  )
}

export default LayoutMain