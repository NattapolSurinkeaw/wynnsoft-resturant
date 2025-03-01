import React, { useState } from 'react'
import Switch from "@mui/material/Switch";
import { getCreateCategoryFood } from '../../../services/manageData.services';

function AddCategoryFood() {
  const [inpTitle, setInpTitle] = useState("");
  const [priority, setPriority] = useState(1);
  const [checkedStatus, setCheckedStatus] = useState(true);

  const submitCreateCatefood = () => {
    const formData = new FormData();
    formData.append('title', inpTitle);
    formData.append('priority', priority);
    formData.append('status', checkedStatus);

    getCreateCategoryFood(formData).then((res) => {
      console.log(res)
    })
  }
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
        <Switch 
          checked={checkedStatus} 
          onChange={(e) => setCheckedStatus(e.target.checked)} 
        />
      </div>
      <div className='flex justify-center gap-4'>
        <button
          className='bg-[#F44D4D] p-1 text-white'
        >ยกเลิก</button>
        <button
          onClick={submitCreateCatefood}
          className='bg-[#013D59] p-1 text-white'
        >บันทึก</button>
      </div>

    </div>
  )
}

export default AddCategoryFood