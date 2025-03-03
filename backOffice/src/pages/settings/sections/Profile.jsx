import React from "react";
import Tab from "./Tab";
import Button from "@mui/material/Button";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";

function Profile() {
  return (
    <>
      <div className="w-[1000px] p-5 rounded-lg bg-white">
        <p className="text-[22px] text-[#00537B] font-[600] ">โปรไฟล์ร้านค้า</p>
        <div className="flex gap-5 mt-4">
          <div className="min-w-[219px] h-[219px] bg-[#616161] rounded-lg">
            awdawd
          </div>
          <div className="w-full h-[219px] bg-[#616161] rounded-lg">awdawd</div>
        </div>
      </div>

      <div className="w-[1000px] p-5 rounded-lg mt-5 bg-white">
        <div className="w-[650px] space-y-6">
          <div className="flex items-center ">
            <p className="min-w-[70px] text-[#313131] font-[400]">เปิดร้าน</p>
            <input
              type="text"
              className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#6db8dd] w-full"
              placeholder="กรอกวันเปิดร้าน..."
            />
          </div>
          <div className="flex items-center ">
            <p className="min-w-[70px] text-[#313131] font-[400]">หยุดร้าน</p>
            <input
              type="text"
              className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#6db8dd] w-full"
              placeholder="กรอกวันหยุดร้าน..."
            />
          </div>
          <div className="flex w-full gap-6 items-center ">
            <div className="flex w-1/2 items-center">
              <p className="min-w-[70px] text-[#313131] font-[400]">เวลาเปิด</p>
              <input
                type="text"
                className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#6db8dd] w-full"
                placeholder="กรอกเวลา เปิด..."
              />
            </div>
            <div className="flex w-1/2 items-center">
              <p className="min-w-[70px] text-[#313131] font-[400]">เวลาปิด</p>
              <input
                type="text"
                className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#6db8dd] w-full"
                placeholder="กรอกเวลา ปิด..."
              />
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <button className="button-1 mt-10">
            บันทึก
          </button>
        </div>
      </div>
    </>
  );
}

export default Profile;
