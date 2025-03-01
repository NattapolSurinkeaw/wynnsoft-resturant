import React from "react";

function Navbar() {
  const logOut = () => {
    localStorage.clear();
    location.reload();
  };
  return (
    <div
      className="flex items-center w-full h-[60px] bg-white py-4 px-6"
      style={{
        boxShadow:
          "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px",
      }}
    >
      <div className="flex justify-end w-[1530px] mx-auto ">
        <div className="flex gap-5 items-center">
          <figure className=" shadow-md p-1 rounded-full cursor-pointer">
            <img
              className="w-[25px] h-auto"
              src="/icons/Group 514.png"
              alt=""
            />
          </figure>
          <div className="flex w-[110px] h-[35px] gap-2 items-center rounded-full p-1 bg-[#00537B] cursor-pointer">
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

        {/* <button onClick={logOut} className="cursor-pointer border">
          Logout
        </button> */}
      </div>
    </div>
  );
}

export default Navbar;
