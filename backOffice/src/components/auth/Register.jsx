import React, { useState } from "react";
import { getRegister } from "../../services/auth.service";
import { Link,useNavigate } from "react-router-dom";
import PersonIcon from "@mui/icons-material/Person";
import LockIcon from "@mui/icons-material/Lock";
import EmailIcon from "@mui/icons-material/Email";
import Swal from "sweetalert2";

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const submitRegister = async () => {
    if (!username.trim() || !password.trim() || !email.trim() || !name.trim()) {
      Swal.fire({
        text: "กรุณากรอกข้อมูลให้ครบถ้วน",
        icon: "warning",
        confirmButtonText: "ตกลง",
        customClass: {
          confirmButton: "my-confirm-button",
        },
        buttonsStyling: false,
      });
      return;
    }
  
    // Validate email format
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      Swal.fire({
        text: "รูปแบบอีเมลไม่ถูกต้อง",
        icon: "error",
        confirmButtonText: "ตกลง",
      });
      return;
    }
  
    if (password.length < 6) {
      Swal.fire({
        text: "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร",
        icon: "error",
        confirmButtonText: "ตกลง",
      });
      return;
    }
  
    const formData = new FormData();
    formData.append("username", username.trim());
    formData.append("password", password.trim());
    formData.append("email", email.trim());
    formData.append("name", name.trim());
  
    try {
      const res = await getRegister(formData);
      if(res.status === true) {
        Swal.fire({
          position: "center",
          text: "ลงทะเบียนสำเร็จ!",
          icon: "success",
          showConfirmButton: false,
          timer: 1500,
        }).then(() => {
          navigate("/login");
        });
      } else {
        Swal.fire({
          position: "center",
          title: "เกิดข้อผิดพลาด!",
          text: "error : " + res.response.data.description,
          icon: "error",
          showConfirmButton: false,
          // timer: 1500,
        })
      }
      
    } catch (error) {
      console.error("Registration Error:", error);
      Swal.fire({
        text: "เกิดข้อผิดพลาด กรุณาลองใหม่",
        icon: "error",
        confirmButtonText: "ตกลง",
      });
    }
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
