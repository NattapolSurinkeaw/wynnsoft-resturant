import React, { useState } from "react";
import { getRegister } from "../../services/auth.service";
import { Link } from "react-router-dom";
import PersonIcon from "@mui/icons-material/Person";
import LockIcon from "@mui/icons-material/Lock";
import EmailIcon from '@mui/icons-material/Email';
function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");

  const submitRegister = () => {
    if (!username || !password || !email || !name) {
      console.log("Please enter all data");
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
      {/* <div className="w-screen h-screen flex justify-center items-center">
        <div className="bg-white rounded-lg flex gap-4 p-6">
          <img src="/images/background/mockLogo.png" alt="" />
          <div>
            <div>
              <label htmlFor="">Username</label>
              <input
                type="text"
                className="border"
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="">Password</label>
              <input
                type="text"
                className="border"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="">Email</label>
              <input
                type="text"
                className="border"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="">Display Name</label>
              <input
                type="text"
                className="border"
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div>
              <button onClick={submitRegister} className="border bg-blue-400">
                Register
              </button>
              <Link to="/login">login</Link>
            </div>
          </div>
        </div>
      </div> */}


      <div className="flex flex-col justify-center items-center gap-8 h-full w-full">
        <p className="w-full text-center text-5xl font-[600] text-[#313131]">
          สมัครสมาชิก
        </p>
        <div className="bg-white md:px-4 p-6 rounded-2xl w-full mx-auto h-[30px] text-[#8F8F8F] flex gap-2 items-center border border-gray-300 justify-start">
          <PersonIcon sx={{ color: "#8F8F8F", fontSize: 35 }} />
          <input
            type="text"
            placeholder="ชื่อผู้ใช้งาน"
            className="outline-none bg-transparent text-[#8F8F8F] text-2xl "
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="bg-white md:px-4 p-6 rounded-2xl w-full mx-auto h-[30px] text-[#8F8F8F] flex gap-2 items-center border border-gray-300 justify-start">
          <EmailIcon sx={{ color: "#8F8F8F", fontSize: 35 }} />
          <input
            type="email"
            placeholder="เมลผู้ใช้งาน"
            className="outline-none bg-transparent text-[#8F8F8F] text-2xl "
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="bg-white md:px-4 p-6 rounded-2xl w-full mx-auto h-[30px] text-[#8F8F8F] flex gap-2 items-center border border-gray-300 justify-start">
          <PersonIcon sx={{ color: "#8F8F8F", fontSize: 35 }} />
          <input
            type="text"
            placeholder="ชื่อ - นามสกุล"
            className="outline-none bg-transparent text-[#8F8F8F] text-2xl "
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="bg-white md:px-4 p-6 rounded-2xl w-full mx-auto h-[30px] text-[#8F8F8F] flex gap-2 items-center border border-gray-300 justify-start">
          <LockIcon sx={{ color: "#8F8F8F", fontSize: 35 }} />
          <input
            type="password"
            placeholder="พาสเวิร์ด"
            className="outline-none bg-transparent text-[#8F8F8F] text-2xl w-full"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <Link to="/login"
          onClick={submitRegister}
          className="bg-[#F5A100] px-4 py-2 rounded-2xl w-full mx-auto  flex gap-2 items-center justify-center cursor-pointer hover:bg-[#00537B] transition-all duration-300 ease-in-out"
        >
          <p className="text-white text-3xl">ยืนยัน</p>
        </Link>
      </div>
    </>
  );
}

export default Register;
