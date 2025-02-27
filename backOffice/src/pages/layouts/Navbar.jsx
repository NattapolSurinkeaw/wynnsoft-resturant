import React from 'react'

function Navbar() {
  const logOut = () => {
    localStorage.clear();
    location.reload();
  }
  return (
    <div className='bg-white p-4'>
      <div className='flex justify-between'>
        <h1>Navbar</h1>
        <button
          onClick={logOut} 
          className='cursor-pointer border' 
        >Logout</button>
      </div>
    </div>
  )
}

export default Navbar