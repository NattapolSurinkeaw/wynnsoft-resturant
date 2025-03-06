import React from 'react'
import PersonIcon from "@mui/icons-material/Person";
import Swal from "sweetalert2";
import { useNavigate } from 'react-router-dom';

function forgetPassword() {
  const navigate = useNavigate();

  const handleClick = async () => {
    await Swal.fire({
      position: "top-end",
      icon: "success",
      title: "กำลังส่งคำร้องเปลี่ยนรหัสผ่านใหม่",
      showConfirmButton: false,
      timer: 1500,
    });
  
    navigate("/login"); // ย้ายไปหน้าล็อกอินหลังจาก SweetAlert ปิด
  };
  
  return (
    <div className="flex flex-col justify-center items-center lg:gap-8 gap-4 h-full w-full">
      <p className="w-full text-center lg:text-5xl text-3xl font-[600] text-[#313131]">
        ลืมรหัสผ่าน
      </p>
      <div className="bg-white md:px-4 p-6 rounded-2xl w-full mx-auto h-[30px] text-[#8F8F8F] flex gap-2 items-center border border-gray-300 justify-start">
        <PersonIcon sx={{ color: "#8F8F8F", fontSize: 35 }} />
        <input
          type="email"
          placeholder="เมลผู้ใช้งาน"
          className="outline-none bg-transparent text-[#8F8F8F] lg:text-2xl text-base w-full"
        //   onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      
      <button
        onClick={handleClick}
        className="bg-[#F5A100] px-4 py-2 rounded-2xl w-full mx-auto flex gap-2 items-center justify-center cursor-pointer hover:bg-[#00537B] transition-all duration-300 ease-in-out"
      >
        <p className="text-white lg:text-3xl text-xl">ยืนยัน</p>
      </button>
    </div>
  )
}

export default forgetPassword