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
    <>
      <div className="w-screen h-screen relative z-50 overflow-hidden">
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
              {activeTab.toLowerCase() === "login" && <LoginPage />}
              {activeTab.toLowerCase() === "register" && <Register />}
              {activeTab.toLowerCase() === "forgetpassword" && (
                <ForgetPassword />
              )}

              <div className="flex flex-row justify-center items-center gap-4">
                {!(location.pathname === "/login" && !location.search) && (
                  <>
                    <Link to="/login" className="text-[#8F8F8F] lg:text-3xl text-lg">
                      เข้าสู่ระบบ
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
                      className="text-[#8F8F8F] lg:text-3xl text-lg"
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
                      className="text-[#8F8F8F] lg:text-3xl text-lg"
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
