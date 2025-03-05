import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getLogin } from "../../services/auth.service";
import PersonIcon from "@mui/icons-material/Person";
import LockIcon from "@mui/icons-material/Lock";
function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const submitLogin = () => {
    if (!username || !password) {
      console.log("userane and password empty");
      return false;
    }

    const param = {
      username: username,
      password: password,
    };

    getLogin(param).then((res) => {
      console.log(res);
      if (res.status) {
        localStorage.setItem("isLogin", true);
        localStorage.setItem("accessToken", res.access_token);
        localStorage.setItem("refreshToken", res.refresh_token);
        navigate("/");
      }
    });
  };

  return (
    <div className="flex flex-col justify-center items-center gap-8 h-full w-full">
      <p className="w-full text-center text-5xl font-[600] text-[#313131]">
        เข้าสู่ระบบ
      </p>
      <div className="bg-white md:px-4 p-6 rounded-2xl w-full mx-auto h-[30px] text-[#8F8F8F] flex gap-2 items-center border border-gray-300 justify-start">
        <PersonIcon sx={{ color: "#8F8F8F", fontSize: 35 }} />
        <input
          type="email"
          placeholder="เมลผู้ใช้งาน"
          className="outline-none bg-transparent text-[#8F8F8F] text-2xl "
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div className="bg-white md:px-4 p-6 rounded-2xl w-full mx-auto h-[30px] text-[#8F8F8F] flex gap-2 items-center border border-gray-300 justify-start">
        <LockIcon sx={{ color: "#8F8F8F", fontSize: 35 }} />
        <input
          type="password"
          placeholder="พาสเวิร์ด"
          className="outline-none bg-transparent text-[#8F8F8F] text-2xl "
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>{" "}
      <div
        onClick={submitLogin}
        className="bg-[#F5A100] px-4 py-2 rounded-2xl w-full mx-auto  flex gap-2 items-center justify-center cursor-pointer hover:bg-[#00537B] transition-all duration-300 ease-in-out"
      >
        <p className="text-white text-3xl">ล็อกอิน</p>
      </div>
    </div>
  );
}

export default LoginPage;
