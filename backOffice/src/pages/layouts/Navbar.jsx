import React from "react";

function Navbar() {
  const logOut = () => {
    localStorage.clear();
    location.reload();
  };
  return (
    <div
      className="flex items-center w-full h-[60px] bg-white shadow-2 py-4 px-6"
    >
      <div className="flex justify-end w-[1530px] mx-auto ">
        <div className="flex gap-5 items-center">
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
          <img className="w-[24px] h-auto cursor-pointer" src="/icons/Vector (1).png" alt="" />
        </div>

        <button onClick={logOut} className="cursor-pointer border">
          Logout
        </button>
      </div>
    </div>
  );
}

export default Navbar;
