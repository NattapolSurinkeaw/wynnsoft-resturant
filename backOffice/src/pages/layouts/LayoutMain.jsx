import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

function LayoutMain() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 1280);

  useEffect(() => {
    const handleResize = () => {
      setIsSidebarOpen(window.innerWidth >= 1280);
    };

    // เรียกใช้ครั้งแรกเมื่อ component โหลด
    handleResize();

    // เพิ่ม event listener สำหรับเช็คขนาดหน้าจอ
    window.addEventListener("resize", handleResize);

    // ลบ event listener เมื่อ component ถูก unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <main>
      <div className="relative flex w-full h-screen overflow-hidden bg-[#FFEFC6]">
        <div className="absolute top-0 left-0 w-full h-[59.6px] shadow-2 bg-white "></div>
        <Sidebar
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />
        <div className="flex flex-col w-full overflow-auto">
          <Navbar
            isSidebarOpen={isSidebarOpen}
            setIsSidebarOpen={setIsSidebarOpen}
          />
          <div className="w-full max-h-screen h-full overflow-y-auto xl:p-6 p-4 ">
            <Outlet />
          </div>
        </div>
      </div>
    </main>
  );
}

export default LayoutMain;
