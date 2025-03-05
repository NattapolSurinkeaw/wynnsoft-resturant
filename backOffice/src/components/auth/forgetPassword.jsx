import React from 'react'
import PersonIcon from "@mui/icons-material/Person";

function forgetPassword() {
  return (
    <div className="flex flex-col justify-center items-center gap-8 h-full w-full">
      <p className="w-full text-center text-5xl font-[600] text-[#313131]">
        ลืมรหัสผ่าน
      </p>
      <div className="bg-white md:px-4 p-6 rounded-2xl w-full mx-auto h-[30px] text-[#8F8F8F] flex gap-2 items-center border border-gray-300 justify-start">
        <PersonIcon sx={{ color: "#8F8F8F", fontSize: 35 }} />
        <input
          type="email"
          placeholder="เมลผู้ใช้งาน"
          className="outline-none bg-transparent text-[#8F8F8F] text-2xl "
        //   onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      
      <div
        // onClick={submitLogin}
        className="bg-[#F5A100] px-4 py-2 rounded-2xl w-full mx-auto  flex gap-2 items-center justify-center cursor-pointer hover:bg-[#00537B] transition-all duration-300 ease-in-out"
      >
        <p className="text-white text-3xl">ยืนยัน</p>
      </div>
    </div>
  )
}

export default forgetPassword