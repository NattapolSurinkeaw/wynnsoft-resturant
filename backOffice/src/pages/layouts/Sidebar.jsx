import React from 'react'
import { Link } from 'react-router-dom'

function Sidebar() {
  return (
    <div className='w-[275px] h-[920px] bg-[#00537B]'>
      <Link to="/">
        <h1 className='text-2xl text-white'>LOGO</h1>
      </Link>
      <hr />
      <ul>
        <Link to="control"><li>Control</li></Link>
      </ul>
    </div>
  )
}

export default Sidebar