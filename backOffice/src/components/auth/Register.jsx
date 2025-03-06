import React, { useState } from "react";
import { getRegister } from "../../services/auth.service";
import { Link } from "react-router-dom";
import PersonIcon from "@mui/icons-material/Person";
import LockIcon from "@mui/icons-material/Lock";
import EmailIcon from "@mui/icons-material/Email";
import Swal from "sweetalert2";

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");

  const submitRegister = () => {
    if (!username || !password || !email || !name) {
      console.log("Please enter all data");
      Swal.fire({
        // title: "ข้อมูลไม่ครบ!",
        text: "ข้อมูลไม่ครบ",
        icon: "warning",
        confirmButtonText: "ตกลง",
        customClass: {
          confirmButton: "my-confirm-button", 
        },
        buttonsStyling: false, 
      });
      return false;
    }

    const formData = new FormData();
    formData.append("username", username);
    formData.append("password", password);
    formData.append("email", email);
    formData.append("name", name);

    getRegister(formData).then((res) => {
      console.log(res);

    });
  };
  return (
    <>
      <div className="flex flex-col justify-center items-center lg:gap-8 gap-4 h-full w-full">
        <p className="w-full text-center lg:text-5xl text-3xl font-[600] text-[#313131]">
          สมัครสมาชิก
        </p>
        <div className="bg-white md:px-4 p-6 rounded-2xl w-full mx-auto h-[30px] text-[#8F8F8F] flex gap-2 items-center border border-gray-300 justify-start">
          <PersonIcon sx={{ color: "#8F8F8F", fontSize: 35 }} />
          <input
            type="text"
            placeholder="ชื่อผู้ใช้งาน"
            className="outline-none bg-transparent text-[#8F8F8F] lg:text-2xl text-base w-full"
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="bg-white md:px-4 p-6 rounded-2xl w-full mx-auto h-[30px] text-[#8F8F8F] flex gap-2 items-center border border-gray-300 justify-start">
          <EmailIcon sx={{ color: "#8F8F8F", fontSize: 35 }} />
          <input
            type="email"
            placeholder="เมลผู้ใช้งาน"
            className="outline-none bg-transparent text-[#8F8F8F] lg:text-2xl text-base w-full"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="bg-white md:px-4 p-6 rounded-2xl w-full mx-auto h-[30px] text-[#8F8F8F] flex gap-2 items-center border border-gray-300 justify-start">
          <PersonIcon sx={{ color: "#8F8F8F", fontSize: 35 }} />
          <input
            type="text"
            placeholder="ชื่อ - นามสกุล"
            className="outline-none bg-transparent text-[#8F8F8F] lg:text-2xl text-base w-full"
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="bg-white md:px-4 p-6 rounded-2xl w-full mx-auto h-[30px] text-[#8F8F8F] flex gap-2 items-center border border-gray-300 justify-start">
          <LockIcon sx={{ color: "#8F8F8F", fontSize: 35 }} />
          <input
            type="password"
            placeholder="พาสเวิร์ด"
            className="outline-none bg-transparent text-[#8F8F8F] lg:text-2xl text-base w-full"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button
          onClick={submitRegister}
          className="bg-[#F5A100] px-4 py-2 rounded-2xl w-full mx-auto  flex gap-2 items-center justify-center cursor-pointer hover:bg-[#00537B] transition-all duration-300 ease-in-out"
        >
          <p className="text-white lg:text-3xl text-xl">ยืนยัน</p>
        </button>
      </div>
    </>
  );
}

export default Register;
