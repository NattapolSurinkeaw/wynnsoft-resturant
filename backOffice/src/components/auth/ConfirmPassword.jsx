import React from "react";
import LockIcon from "@mui/icons-material/Lock";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

function ConfirmPassword() {
  const navigate = useNavigate();

  const handleClick = async () => {
    await Swal.fire({
      position: "top-end",
      icon: "success",
      title: "เปลี่ยนรหัสผ่านสำเร็จ",
      showConfirmButton: false,
      timer: 1500,
    });
  
    navigate("/login"); // ย้ายไปหน้าล็อกอินหลังจาก SweetAlert ปิด
  };
  
  return (
    <>
      <div className="w-screen h-screen relative z-50">
        <div className="absolute w-full h-full">
          <img
            src="/images/background/bg-login.png"
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute top-0 left-0 w-full h-full bg-[#313131] opacity-20"></div>
        </div>

        <div className="absolute inset-0 z-50 max-w-[1320px] h-fit m-auto px-4 flex justify-center">
          <div className="grid lg:grid-cols-2 gap-12 bg-white md:px-12 px-6 md:py-16 py-8 place-items-center rounded-4xl">
            <figure className="max-w-[500px] lg:h-[500px] h-[200px] rounded-sm lg:block ">
              <img
                src="/images/background/mockLogo.png"
                alt=""
                className="w-full h-full object-cover rounded-sm"
              />
            </figure>

            <div className="flex flex-col justify-between items-center w-full h-full gap-8 ">
              <div className="flex flex-col justify-center items-center gap-8 h-full w-full">
                <p className="w-full text-center lg:text-5xl text-3xl font-[600] text-[#313131]">
                  สร้างรหัสผ่านใหม่
                </p>
                <div className="bg-white md:px-4 p-6 rounded-2xl w-full mx-auto h-[30px] text-[#8F8F8F] flex gap-2 items-center border border-gray-300 justify-start">
                  <LockIcon sx={{ color: "#8F8F8F", fontSize: 35 }} />
                  <input
                    type="password"
                    placeholder="รหัสผ่านใหม่"
                    className="outline-none bg-transparent text-[#8F8F8F] lg:text-2xl text-base w-full"
                    //   onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <div className="bg-white md:px-4 p-6 rounded-2xl w-full mx-auto h-[30px] text-[#8F8F8F] flex gap-2 items-center border border-gray-300 justify-start">
                  <LockIcon sx={{ color: "#8F8F8F", fontSize: 35 }} />
                  <input
                    type="password"
                    placeholder="ยื่นยันรหัส"
                    className="outline-none bg-transparent text-[#8F8F8F] lg:text-2xl text-base w-full"
                    //   onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                <button
                  onClick={handleClick}
                  className="bg-[#F5A100] px-4 py-2 rounded-2xl w-full mx-auto flex gap-2 items-center justify-center cursor-pointer hover:bg-[#00537B] transition-all duration-300 ease-in-out"
                >
                  <p className="text-white lg:text-3xl text-xl">ยืนยัน</p>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ConfirmPassword;
