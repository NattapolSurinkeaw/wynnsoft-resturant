import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getLogin } from "../../services/auth.service";
import PersonIcon from "@mui/icons-material/Person";
import LockIcon from "@mui/icons-material/Lock";
import Swal from "sweetalert2";
import { jwtDecode } from "jwt-decode";
import { useDispatch } from "react-redux";
import { setUserData } from "../../store/userSlice";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const submitLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Swal.fire({
        text: "กรุณากรอกชื่อผู้ใช้และรหัสผ่าน",
        icon: "warning",
        confirmButtonText: "ตกลง",
        confirmButton: "#00537B",
      });
      return;
    }
  
    const param = { email: email.trim(), password: password.trim() };
  
    try {
      const res = await getLogin(param);
  
      if (res.status) {
        localStorage.setItem("isLogin", true);
        localStorage.setItem("accessToken", res.access_token);
        localStorage.setItem("refreshToken", res.refresh_token);
        const dataDecode = jwtDecode(res.access_token);

        const userInfo = {
          username: dataDecode.username,
          display_name: dataDecode.display_name,
          token: res.access_token,
          role: dataDecode.section,
          email: dataDecode.email,
        };

        await dispatch(setUserData(userInfo));

        Swal.fire({
          icon: "success",
          title: "ล็อกอินสำเร็จ!",
          text: "กำลังเข้าสู่ระบบ...",
          timer: 1500,
          showConfirmButton: false,
        }).then(() => {
          navigate("/control");
        });
      } else {
        Swal.fire({
          title: "ล็อกอินไม่สำเร็จ!",
          text: res.description || "ชื่อผู้ใช้ หรือ รหัสผ่านไม่ถูกต้อง",
          icon: "error",
          confirmButtonText: "ลองใหม่อีกครั้ง",
          customClass: {
            confirmButton: "my-confirm-button",
          },
          buttonsStyling: false,
        });
      }
    } catch (error) {
      let errorMessage = "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง";
  
      if (error.response && error.response.data) {
        errorMessage = error.response.data.description || error.response.data.message || errorMessage;
      }
  
      Swal.fire({
        title: "ล็อกอินไม่สำเร็จ!",
        text: errorMessage,
        icon: "error",
        confirmButtonText: "ตกลง",
        customClass: {
          confirmButton: "my-confirm-button",
        },
        buttonsStyling: false,
      });
  
      console.error("Login error:", error);
    }
  };
  
  
  return (
    <div className="flex flex-col justify-center items-center lg:gap-8 gap-4 h-full w-full">
      <p className="w-full text-center lg:text-5xl text-3xl font-[600] text-[#313131]">
        เข้าสู่ระบบ
      </p>
      <div className="bg-white md:px-4 p-6 rounded-2xl w-full mx-auto h-[30px] text-[#8F8F8F] flex gap-2 items-center border border-gray-300 justify-start">
        <PersonIcon sx={{ color: "#8F8F8F", fontSize: 35 }} />
        <input
          type="email"
          placeholder="เมลผู้ใช้งาน"
          className="outline-none bg-transparent text-[#8F8F8F] lg:text-2xl text-base w-full"
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="bg-white md:px-4 p-6 rounded-2xl w-full mx-auto h-[30px] text-[#8F8F8F] flex gap-2 items-center border border-gray-300 justify-start">
        <LockIcon sx={{ color: "#8F8F8F", fontSize: 35 }} />
        <input
          type="password"
          placeholder="พาสเวิร์ด"
          className="outline-none bg-transparent text-[#8F8F8F] lg:text-2xl text-base w-full"
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              submitLogin();
            }
          }}
        />
      </div>{" "}
      <div
        onClick={submitLogin}
        className="bg-[#F5A100] px-4 py-2 rounded-2xl w-full mx-auto flex gap-2 items-center justify-center cursor-pointer hover:bg-[#00537B] transition-all duration-300 ease-in-out"
      >
        <p className="text-white lg:text-3xl text-xl">ล็อกอิน</p>
      </div>
    </div>
  );
}

export default LoginPage;
