import React, { useState } from "react";
import ArrowCircleLeftOutlinedIcon from "@mui/icons-material/ArrowCircleLeftOutlined";
import ArrowCircleLeftIcon from "@mui/icons-material/ArrowCircleLeft";
import Sidebar from "./Sidebar";
import MenuIcon from "@mui/icons-material/Menu";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";

function Navbar({ isSidebarOpen, setIsSidebarOpen }) {

  const logOut = () => {
    localStorage.clear();
    location.reload();
  };

  return (
    <>
      <div className="flex items-center justify-between xl:justify-end w-full h-[60px] bg-white shadow-2 py-4 xl:px-6 px-4 ">
        <div className="xl:hidden z-10">
          {isSidebarOpen ? (
            <MenuOpenIcon
              sx={{ fontSize: 35 }}
              className="text-[#00537B] cursor-pointer"
              onClick={() => setIsSidebarOpen(false)}
            />
          ) : (
            <MenuIcon
              sx={{ fontSize: 35 }}
              className="text-[#00537B] cursor-pointer"
              onClick={() => setIsSidebarOpen(true)}
            />
          )}
        </div>

        <div className="flex gap-5 items-center z-10">
          <figure className=" shadow-1 p-1 rounded-full cursor-pointer">
            <img
              className="w-[25px] h-auto"
              src="/icons/Group 514.png"
              alt=""
            />
          </figure>
          <div className="flex w-[110px] h-[35px] gap-2 items-center rounded-full p-1 bg-[#00537B] shadow-1 cursor-pointer">
            <figure className="bg-white shadow-md p-0.5 rounded-full">
              <img
                className="w-[23px] h-auto"
                src="/icons/material-symbols_person.png"
                alt=""
              />
            </figure>
            <p className="text-[14px] text-white ml-2">ADMIN</p>
          </div>
          <img
            className="w-[24px] h-auto cursor-pointer"
            src="/icons/Vector (1).png"
            alt=""
          />
        </div>

         <button onClick={logOut} className="cursor-pointer border z-10">
          Logout
        </button>
      </div>
    </>
  );
}

export default Navbar;
