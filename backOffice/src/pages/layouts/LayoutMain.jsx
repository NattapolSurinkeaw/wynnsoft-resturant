import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

function LayoutMain() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <main>
      <div className="relative flex w-full h-screen bg-[#FFEFC6]">
        <div className=" absolute top-0 left-0 w-full h-[59.6px] shadow-2 bg-white ">
        </div>
        <Sidebar
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />
        <div className="flex flex-col w-full">
          <Navbar
            isSidebarOpen={isSidebarOpen}
            setIsSidebarOpen={setIsSidebarOpen}
          />
          <div className="w-full p-6">
            <Outlet />
          </div>
        </div>
      </div>
    </main>
  );
}

export default LayoutMain;
