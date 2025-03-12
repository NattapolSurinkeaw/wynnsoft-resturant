import React, { useState } from "react";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import WidgetsOutlinedIcon from "@mui/icons-material/WidgetsOutlined";
import AddBoxOutlinedIcon from "@mui/icons-material/AddBoxOutlined";
import ReplyIcon from "@mui/icons-material/Reply";

function Header({
  isSettingOpen,
  setIsSettingOpen, 
  isAddTable,
  handleReservationClick,
}) {

  return (
    <>
      <div className="flex justify-between w-full">
        <div className="flex w-full items-center gap-2">
          <WidgetsOutlinedIcon
            sx={{ fontSize: 25 }}
            className="text-[#00537B]"
          />
          <p className="text-[25px] font-[600] text-[#00537B]">จัดการโต๊ะ</p>
        </div>

        <div className="flex items-center gap-4">
          {isSettingOpen ? (
            <>
              <button
                onClick={() => setIsSettingOpen(false)}
                className="flex items-center justify-center gap-1 xl:w-[130px] w-[120px] shadow-1 py-1.5 rounded-lg cursor-pointer text-white text-[16px] duration-200 transition bg-[#005179] hover:bg-[#F5A100]"
              >
                <ReplyIcon sx={{ fontSize: 23 }} className="text-white" />
                ย้อนกลับ
              </button>

              <button
                onClick={handleReservationClick}
                className={`flex items-center justify-center gap-1 xl:w-[130px] w-[120px] shadow-1 py-1.5 rounded-lg cursor-pointer text-white text-[16px] duration-200 transition ${
                  isAddTable ? "bg-[#F5A100]" : "bg-[#005179]"
                }`}
              >
                <AddBoxOutlinedIcon
                  sx={{ fontSize: 20 }}
                  className="text-white"
                />
                เพิ่มโต๊ะ
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsSettingOpen(true)}
              className="flex items-center justify-center gap-1 xl:w-[130px] w-[120px] shadow-1 py-1.5 rounded-lg cursor-pointer text-white text-[16px] duration-200 transition bg-[#005179] hover:bg-[#F5A100]"
            >
              <BorderColorIcon sx={{ fontSize: 20 }} className="text-white" />
              จัดการตั้งค่า
            </button>
          )}
        </div>
      </div>
    </>
  );
}

export default Header;
