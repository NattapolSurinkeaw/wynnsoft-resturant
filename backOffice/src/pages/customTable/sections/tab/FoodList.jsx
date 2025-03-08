import React, { useState, useEffect } from "react";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import LocalPrintshopIcon from "@mui/icons-material/LocalPrintshop";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

function FoodList({ handleFoodListClick }) {
  const [imageSrc, setImageSrc] = useState("/images/123.jpg");

  return (
    <>
      <div className="w-full h-[683px] bg-white shadow-1 rounded-lg">
        <div className="flex items-center justify-between w-full h-[115px] rounded-t-lg bg-[#013D59] px-6 py-4">
          <div className="w-[85px] h-[85px] bg-white rounded-lg">
            <p className="flex flex-col w-full h-full items-center justify-center leading-8">
              <p className="text-[22px] font-[600] text-[#013D59]">โต๊ะ</p>
              <p className="text-[35px] font-[600] text-[#013D59]">02</p>
            </p>
          </div>
          <div className="flex flex-col items-end ">
            <p className="text-[23px] font-[600] text-white">#000004</p>
            <p className="text-[16px] font-[600] text-white">16 พฤษภาคม 2024</p>
            <p className="text-[16px] font-[600] text-white">10 ออเดอร์</p>
          </div>
        </div>

        <div className="flex items-center justify-center gap-5">
          <button className="mt-4 flex items-center justify-center gap-1 xl:w-[130px] w-[120px] shadow-md py-1.5 rounded-lg cursor-pointer text-white text-[16px] font-medium duration-300 transition-all bg-gradient-to-r from-[#F44D4D] to-[#FF5E5E] hover:from-[#FF0A0A] hover:to-[#FF5252] hover:shadow-xl hover:scale-105">
            ย้ายโต๊ะ
          </button>
          <button className="mt-4 flex items-center justify-center gap-1 xl:w-[130px] w-[120px] shadow-md py-1.5 rounded-lg cursor-pointer text-white text-[16px] font-medium duration-300 transition-all bg-gradient-to-r from-[#FFD468] to-[#FFC107] hover:from-[#F5A100] hover:to-[#FF8C00] hover:shadow-xl hover:scale-105">
            เพิ่มรายการ
          </button>
          <button className="mt-4 flex items-center justify-center gap-1 xl:w-[130px] w-[120px] shadow-md py-1.5 rounded-lg cursor-pointer text-white text-[16px] font-medium duration-300 transition-all bg-gradient-to-r from-[#076591] to-[#013D59] hover:from-[#0579af] hover:to-[#045b83] hover:shadow-xl hover:scale-105">
            ชำระเงิน
          </button>
        </div>
      </div>
    </>
  );
}

export default FoodList;
