import React, { useState, useEffect } from "react";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import LocalPrintshopIcon from "@mui/icons-material/LocalPrintshop";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

function ViewTable({ handleEditClick }) {
  const [imageSrc, setImageSrc] = useState("/images/123.jpg");

  return (
    <>
      <div className="w-full h-[683px] p-6 bg-white shadow-1 rounded-lg">
        <div className="flex justify-around items-center gap-6">
          <p className="text-[20px] text-[#313131] font-[500]">ชื่อ</p>
          <p className="text-[35px] text-[#313131] font-[700]">โต๊ะ 01</p>
          <button onClick={handleEditClick}>
            <BorderColorIcon
              sx={{ fontSize: 25 }}
              className="text-[#313131] hover:text-[#F5A100] cursor-pointer"
            />
          </button>
        </div>
        <figure className="w-[360px] h-[360px] mx-auto mt-6 border-6 border-[#D9D9D9]">
          <img
            className="w-full h-full"
            src={imageSrc || "/images/not_qrcode.jpg"}
            alt="QRCode"
          />
        </figure>
        {/* <button className="mt-4 mx-auto flex items-center justify-center gap-1 xl:w-[130px] w-[120px] shadow-md py-1.5 rounded-lg cursor-pointer text-gray-700 text-[16px] font-medium duration-300 transition-all bg-gradient-to-r from-[#FFD468] to-[#FFC107] hover:from-[#F5A100] hover:to-[#FF8C00] hover:shadow-xl hover:scale-105">
          <AutorenewIcon sx={{ fontSize: 23 }} className="text-gray-700" />
          สร้าง QR ใหม่
        </button> */}
        <div className="border-t-2 border-gray-500 mt-8"></div>
        <div className="flex items-center justify-center mt-4">
          <p className="mr-2 text-[18px] text-[#313131] font-[500]">ลำดับ</p>
          <input
            type="number"
            className="mr-12 w-[100px] h-[35px] border border-gray-300 text-gray-600 text-[16px] font-[500] rounded-sm px-2 focus:outline-none focus:ring-2 focus:ring-[#6db8dd] bg-gray-200 cursor-not-allowed"
            placeholder="เลข..."
            disabled
          />

          <p className="mr-2 text-[18px] text-[#313131] font-[500]">แสดงผล</p>
          <FormControlLabel
            className="px-2 py-3"
            control={
              <Switch
                defaultChecked
                disabled
                sx={{
                  "& .MuiSwitch-switchBase.Mui-checked": {
                    color: "#39C526",
                  },
                  "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                    backgroundColor: "#39C526",
                  },
                }}
              />
            }
          />
        </div>
        <div className="flex items-center justify-center gap-5">
          <button className="mt-4 flex items-center justify-center gap-1 xl:w-[130px] w-[120px] shadow-md py-1.5 rounded-lg cursor-pointer text-white text-[16px] font-medium duration-300 transition-all bg-gradient-to-r from-[#FFD468] to-[#FFC107] hover:from-[#F5A100] hover:to-[#FF8C00] hover:shadow-xl hover:scale-105">
            <LocalPrintshopIcon sx={{ fontSize: 23 }} className="text-white" />
            ปริ้น QR
          </button>

          {/* <button className="mt-4 flex items-center justify-center gap-1 xl:w-[130px] w-[120px] shadow-md py-1.5 rounded-lg cursor-pointer text-white text-[16px] font-medium duration-300 transition-all bg-gradient-to-r from-[#00537B] to-[#0072A0] hover:from-[#004669] hover:to-[#005F85] hover:shadow-xl hover:scale-105">
            <SaveIcon sx={{ fontSize: 23 }} className="text-white" />
            บันทึก
          </button> */}

          <button className="mt-4 flex items-center justify-center gap-1 xl:w-[130px] w-[120px] shadow-md py-1.5 rounded-lg cursor-pointer text-white text-[16px] font-medium duration-300 transition-all bg-gradient-to-r from-[#F44D4D] to-[#FF5E5E] hover:from-[#FF0A0A] hover:to-[#FF5252] hover:shadow-xl hover:scale-105">
            <DeleteForeverIcon sx={{ fontSize: 23 }} className="text-white" />
            ลบโต๊ะ
          </button>
        </div>
      </div>
    </>
  );
}

export default ViewTable;
