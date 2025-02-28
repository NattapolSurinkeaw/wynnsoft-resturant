import React from 'react'
import { Link } from 'react-router-dom'

function Sidebar() {
  return (
    <div className='w-[275px] h-[920px] bg-[#00537B] p-4'>
      <Link to="/">
        <h1 className='text-2xl text-white'>LOGO</h1>
      </Link>

      <div className='h-[2px] bg-white'></div>
      <h3 className='text-[#FFEA00]'>แดสบอท</h3>
      <ul className='ml-4'>
        <Link to="control"><li>ศูนย์ควบคุม</li></Link>
      </ul>

      <div className='h-[2px] bg-white'></div>
      <h3 className='text-[#FFEA00]'>จัดการข้อมูล</h3>
      <ul className='ml-4'>
        <Link to="catefood"><li>หมวดหมู่เมนู</li></Link>
      </ul>
    </div>
  )
}

export default Sidebar