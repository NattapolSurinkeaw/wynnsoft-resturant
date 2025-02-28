import React, { useState } from 'react'

function AddCategoryFood() {
  const [inpTitle, setInpTitle] = useState("");
  const [priority, setPriority] = useState(1);

  return (
    <div className='w-1/2 bg-white p-4'>
      <div>
        <div className='flex justify-center'>
          <label htmlFor="inputImage">
            <img className='w-20 h-20' src="" alt="" />
          </label>
          <input className='hidden' type="file" id='inputImage' name='inputImage' />
        </div>
      </div>
      <div>
        <label htmlFor="">ชื่อหมวดหมู่</label>
        <input type="text"
        className='border' 
        onChange={(e) => setInpTitle(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="">ลำดับแสดง</label>
        <input type="text"
        className='border' 
          onChange={(e) => setPriority(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="">สถานะ</label>
        <input type="checkbox" 
        />
      </div>
      <div className='flex justify-center gap-4'>
        <button
          className='bg-[#F44D4D] p-1 text-white'
        >ยกเลิก</button>
        <button
          className='bg-[#013D59] p-1 text-white'
        >บันทึก</button>
      </div>

    </div>
  )
}

export default AddCategoryFood