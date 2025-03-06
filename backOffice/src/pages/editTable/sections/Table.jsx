import React from "react";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import InsertInvitationIcon from "@mui/icons-material/InsertInvitation";
import LibraryAddIcon from "@mui/icons-material/LibraryAdd";

function Table({ isSettingOpen }) {
  return (
    <>
      <div className="min-w-[978px] p-6 rounded-lg shadow-1 bg-white">
        {!isSettingOpen && (
          <div className="flex justify-end items-center gap-4 mb-8">
            <button className="flex items-center justify-center gap-2 xl:w-[130px] w-[120px] shadow-1 py-1.5 rounded-lg cursor-pointer text-white text-[16px] duration-200 transition bg-[#005179] hover:bg-[#F5A100]">
              <InsertInvitationIcon
                sx={{ fontSize: 23 }}
                className="text-white"
              />
              จอง
            </button>
            <button className="flex items-center justify-center gap-1 xl:w-[130px] w-[120px] shadow-1 py-1.5 rounded-lg cursor-pointer text-white text-[16px] duration-200 transition bg-[#005179] hover:bg-[#F5A100]">
              <LibraryAddIcon sx={{ fontSize: 20 }} className="text-white" />
              รวมบิล
            </button>
          </div>
        )}
        <div className="grid grid-cols-5 gap-x-6 gap-y-10 w-full ">
          <figure className="relative w-full h-[106px] bg-[#FFD25B]">
            <img className="w-full h-full" src="/icons/Exclude.png" alt="" />
            <div className=" absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <p className="text-[#013D59] font-[500]">บริการ</p>
            </div>
          </figure>
          <figure className="relative w-full h-[106px] bg-[#FFD25B]">
            <img className="w-full h-full" src="/icons/Exclude.png" alt="" />
            <div className=" absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <p className="text-[#013D59] font-[500]">บริการ</p>
            </div>
          </figure>
          <figure className="relative w-full h-[106px] bg-[#FFD25B]">
            <img className="w-full h-full" src="/icons/Exclude.png" alt="" />
            <div className=" absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <p className="text-[#013D59] font-[500]">บริการ</p>
            </div>
          </figure>
          <figure className="relative w-full h-[106px] bg-[#FFD25B]">
            <img className="w-full h-full" src="/icons/Exclude.png" alt="" />
            <div className=" absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <p className="text-[#013D59] font-[500]">บริการ</p>
            </div>
          </figure>
        </div>
      </div>
    </>
  );
}

export default Table;
