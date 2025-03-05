import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

import Register from "./Register";
import ForgetPassword from "./forgetPassword";
import LoginPage from "./LoginPage";
function Login() {
  const location = useLocation();

  const [activeTab, setActiveTab] = useState("Login");

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    let tab = params.get("tab") || "Login";

    // ทำให้ตัวแรกเป็นตัวพิมพ์ใหญ่
    tab = tab.charAt(0).toUpperCase() + tab.slice(1);

    setActiveTab(tab);
  }, [location.search]);

  return (
    // <div
    //   style={{ backgroundImage: "url('/images/background/bg-login.png')" }}
    //   className="w-screen h-screen flex justify-center items-center"
    // >
    //   <div className="bg-white rounded-lg flex gap-4 py-12 px-8 max-w-[1320px] m-auto">
    //     <figure className=" rouded-2xl" >
    //       <img src="/images/background/mockLogo.png" alt="" />
    //     </figure>

    //     <div>
    //       <div>
    //         <label htmlFor="">Username</label>
    //         <input
    //           type="text"
    //           className="border"
    //           onChange={(e) => setUsername(e.target.value)}
    //         />
    //       </div>
    //       <div>
    //         <label htmlFor="">Password</label>
    //         <input
    //           type="text"
    //           className="border"
    //           onChange={(e) => setPassword(e.target.value)}
    //         />
    //       </div>

    //       <div className="flex gap-4">
    //         <button className="border bg-green-500" onClick={submitLogin}>
    //           Login
    //         </button>
    //         <Link to="/register">register</Link>
    //       </div>
    //     </div>
    //   </div>
    // </div>

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
          <div className="grid grid-cols-2 gap-12 bg-white px-12 py-16 place-items-center rounded-4xl">
            <figure className="max-w-[500px] h-[500px] rounded-sm">
              <img
                src="/images/background/mockLogo.png"
                alt=""
                className="w-full h-full object-cover rounded-sm"
              />
            </figure>

            <div className="flex flex-col justify-between items-center w-full h-full gap-8 ">
              {activeTab.toLowerCase() === "login" && <LoginPage />}
              {activeTab.toLowerCase() === "register" && <Register />}
              {activeTab.toLowerCase() === "forgetpassword" && (
                <ForgetPassword />
              )}

              <div className="flex flex-row justify-center items-center gap-4">
                {!(location.pathname === "/login" && !location.search) && (
                  <>
                    <Link to="/login" className="text-[#8F8F8F] text-3xl">
                      ล็อกอิน
                    </Link>
                    <div className="border-l border-[#8F8F8F] h-[40px] rounded-full"></div>
                  </>
                )}

                {!(
                  location.pathname === "/login" &&
                  location.search.startsWith("?tab=register")
                ) && (
                  <>
                    <Link
                      to="/login?tab=register"
                      className="text-[#8F8F8F] text-3xl"
                    >
                      สมัครสมาชิก
                    </Link>
                  </>
                )}

                {!(
                  location.pathname === "/login" &&
                  location.search.startsWith("?tab=forgetPassword")
                ) && (
                  <>
                    {!(
                      location.pathname === "/login" &&
                      location.search.startsWith("?tab=register")
                    ) && (
                      <div className="border-l border-[#8F8F8F] h-[40px] rounded-full"></div>
                    )}
                    <Link
                      to="/login?tab=forgetPassword"
                      className="text-[#8F8F8F] text-3xl"
                    >
                      ลืมรหัสผ่าน ?
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
