import React, { useState } from "react";
import Tab from "./Tab";
import Button from "@mui/material/Button";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import CreateIcon from "@mui/icons-material/Create";

function Profile() {
  const [image1, setImage1] = useState(null);
  const [image2, setImage2] = useState(null);

  const handleImageChange = (e, setImage) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      <div className="3xl:w-[1000px] w-full p-5 rounded-lg shadow-1 bg-white">
        <p className="text-[22px] text-[#00537B] font-[600] ">โปรไฟล์ร้านค้า</p>
        <div className="flex gap-5 mt-4">
          <div className="relative min-w-[219px] max-w-[219px] h-[219px] bg-[#616161] rounded-lg shadow-1 flex items-center justify-center shadow-md overflow-hidden">
            {image1 ? (
              <img
                src={image1}
                alt="Uploaded"
                className="w-full h-full object-cover rounded-lg "
              />
            ) : (
              <div className="text-white text-lg text-center">
                เลือกรูปภาพ <br />
                <span className="text-[12px] text-center">
                  (ขนาด 200*200 px)
                </span>
              </div>
            )}

            <label
              htmlFor="fileInput1"
              className="absolute bottom-2 right-2 bg-[#FFD25B] hover:bg-[#00537B] transition duration-100 flex justify-center items-center w-[30px] h-[30px] rounded-full shadow-1 cursor-pointer"
            >
              <CreateIcon
                fontSize="small"
                className="text-white hover:text-white"
              />
            </label>

            <input
              type="file"
              accept="image/*"
              className="hidden"
              id="fileInput1"
              onChange={(e) => handleImageChange(e, setImage1)}
            />
          </div>

          <div className="relative w-full h-[219px] bg-[#616161] rounded-lg shadow-1 flex items-center justify-center overflow-hidden">
            {image2 ? (
              <img
                src={image2}
                alt="Uploaded"
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <div className="text-white text-lg text-center">
                เลือกรูปภาพ <br />
                <span className="text-[12px] text-center">
                  (ขนาด 200*200 px)
                </span>
              </div>
            )}
            <label
              htmlFor="fileInput2"
              className="absolute bottom-2 right-2 bg-[#FFD25B] hover:bg-[#00537B] transition duration-100 flex justify-center items-center w-[30px] h-[30px] rounded-full shadow-1 cursor-pointer"
            >
              <CreateIcon
                fontSize="small"
                className="text-white hover:text-white"
              />
            </label>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              id="fileInput2"
              onChange={(e) => handleImageChange(e, setImage2)}
            />
          </div>
        </div>
      </div>

      <div className="3xl:w-[1000px] w-full p-5 rounded-lg shadow-1 mt-5 bg-white">
        <div className="3xl:w-[650px] w-full space-y-6">
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

        <div className="flex justify-center ">
          <button className="button-1 mt-10">บันทึก</button>
        </div>
      </div>
    </>
  );
}

export default Profile;
