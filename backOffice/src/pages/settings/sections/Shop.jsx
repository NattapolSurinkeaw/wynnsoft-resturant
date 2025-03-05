import React from "react";

function Shop() {
  return (
    <>
      <div className="xl:w-[680px] w-full p-5 rounded-lg shadow-1 bg-white">
        <p className="text-[22px] text-[#00537B] font-[600] ">ข้อมูลร้านค้า</p>
        <div className="w-full space-y-6 mt-4">
          <div className="flex items-center ">
            <p className="min-w-[100px] text-[#313131] font-[400]">ชื่อร้าน</p>
            <input
              type="text"
              className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#6db8dd] w-full"
              placeholder="กรอกชื่อร้าน..."
            />
          </div>
          <div className="flex items-center ">
            <p className="min-w-[100px] text-[#313131] font-[400]">
              เจ้าของร้าน
            </p>
            <input
              type="text"
              className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#6db8dd] w-full"
              placeholder="กรอกชื่อเจ้าของร้าน..."
            />
          </div>
          <div className="flex">
            <p className="min-w-[100px] text-[#313131] font-[400]">ที่อยู่</p>
            <textarea
              className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#6db8dd] w-full"
              placeholder="กรอกที่อยู่..."
              rows="4"
            />
          </div>
          <div className="flex items-center ">
            <p className="min-w-[100px] text-[#313131] font-[400]">เบอร์โทร</p>
            <input
              type="text"
              className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#6db8dd] w-full"
              placeholder="กรอกเบอร์โทร..."
            />
          </div>
          <div className="flex items-center ">
            <p className="min-w-[100px] text-[#313131] font-[400]">E-mail</p>
            <input
              type="text"
              className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#6db8dd] w-full"
              placeholder="กรอกอีเมล..."
            />
          </div>
          <div className="flex items-center ">
            <p className="min-w-[100px] text-[#313131] font-[400]">
              เลขผู้เสียภาษี
            </p>
            <input
              type="text"
              className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#6db8dd] w-full"
              placeholder="กรอกเลข..."
            />
          </div>
        </div>

        <div className="flex justify-center">
          <button className="button-1 mt-10">บันทึก</button>
        </div>
      </div>
    </>
  );
}

export default Shop;
