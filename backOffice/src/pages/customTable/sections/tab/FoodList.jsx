import React, { useState, useEffect } from "react";
import MoveTable from "../../modal/MoveTable";
import { FoodListData } from "../../../../components/mockData/CustomTable/FoodListData";

function FoodList() {
  const [isMoveTable, setIsMoveTable] = useState(false);
  const [imageSrc, setImageSrc] = useState("/images/123.jpg");

  const handleMoveTableOnClick = () => {
    setIsMoveTable(true);
  };

  const closeModal = () => {
    setIsMoveTable(false);
  };

  return (
    <>
      <MoveTable isMoveTable={isMoveTable} closeModal={closeModal} />
      <div className="flex flex-col w-full min-h-[730px]">
        <div className="w-full h-full bg-white shadow-1 rounded-lg">
          <div className="flex items-center justify-between w-full h-[115px] rounded-t-lg bg-[#013D59] px-6 py-4">
            <div className="w-[85px] h-[85px] bg-white rounded-lg">
              <p className="flex flex-col w-full h-full items-center justify-center leading-8">
                <p className="text-[22px] font-[600] text-[#013D59]">โต๊ะ</p>
                <p className="text-[35px] font-[600] text-[#013D59]">02</p>
              </p>
            </div>
            <div className="flex flex-col items-end ">
              <p className="text-[23px] font-[600] text-white">#000004</p>
              <p className="text-[16px] font-[600] text-white">
                16 พฤษภาคม 2024
              </p>
              <p className="text-[16px] font-[600] text-white">10 ออเดอร์</p>
            </div>
          </div>

          <div className="flex items-center justify-between bg-[#A9E8F9] px-6 py-1">
            <p className="min-w-[240px] text-[18px] font-[600] text-[#013D59]">
              รายการ
            </p>
            <p className="min-w-[15px] text-[18px] font-[600] text-[#013D59]">
              จำนวน
            </p>
            <p className="min-w-[110px] text-end text-[18px] font-[600] text-[#013D59]">
              ราคา
            </p>
          </div>

          <div className="w-full h-[320px] py-3 overflow-y-auto ">
            {FoodListData.map((item) => (
              <div
                key={item.id}
                className="flex items-start justify-between px-6 mt-2"
              >
                <p className="min-w-[240px] text-[18px] font-[500] text-[#313131]">
                  {item.name} <br />
                  <span className="text-[14px] font-[300]">{item.details}</span>
                </p>
                <p className="min-w-[15px] text-[16px] font-[400] text-[#313131]">
                  {item.quantity}
                </p>
                <div className="min-w-[110px] flex flex-col items-end">
                  <p className="text-[14px] font-[500] text-[#313131] line-through">
                    {item.oldPrice}
                  </p>
                  <span className="text-[16px] font-[400]">{item.price}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="border border-[#CACACA] mx-6 my-3"></div>

          <div className="flex items-start justify-between px-6 ">
            <p className="text-[18px] font-[500] text-[#313131]">ราคา</p>
            <p className="text-[16px] font-[500] text-[#313131]">000.00</p>
          </div>
          <div className="flex items-start justify-between px-6 ">
            <p className="text-[18px] font-[500] text-[#313131]">ส่วนลด</p>
            <p className="text-[16px] font-[500] text-[#313131]">000.00</p>
          </div>
          <div className="flex items-start justify-between px-6 ">
            <p className="text-[18px] font-[500] text-[#313131]">ภาษี 7%</p>
            <p className="text-[16px] font-[500] text-[#313131]">000.00</p>
          </div>
          <div className="flex items-start justify-between px-6 ">
            <p className="text-[18px] font-[500] text-[#313131]">
              Service charge 5%
            </p>
            <p className="text-[16px] font-[500] text-[#313131]">000.00</p>
          </div>

          <div className="border border-[#CACACA] border-dashed mx-6 my-3"></div>

          <div className="flex items-start justify-between px-6 ">
            <p className="text-[23px] font-[700] text-[#313131]">ยอดทั้งหมด</p>
            <p className="text-[23px] font-[700] text-[#313131]">$ 00,000.00</p>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <button
            onClick={handleMoveTableOnClick}
            className="mt-4 flex items-center justify-center gap-1 xl:w-[145px] w-[120px] shadow-md py-1.5 rounded-lg cursor-pointer text-white text-[16px] font-medium duration-300 transition-all bg-gradient-to-r from-[#F44D4D] to-[#FF5E5E] hover:from-[#FF0A0A] hover:to-[#FF5252] hover:shadow-xl hover:scale-105"
          >
            ย้ายโต๊ะ
          </button>
          <button className="mt-4 flex items-center justify-center gap-1 xl:w-[145px] w-[120px] shadow-md py-1.5 rounded-lg cursor-pointer text-white text-[16px] font-medium duration-300 transition-all bg-gradient-to-r from-[#FFD468] to-[#FFC107] hover:from-[#F5A100] hover:to-[#FF8C00] hover:shadow-xl hover:scale-105">
            เพิ่มรายการ
          </button>
          <button className="mt-4 flex items-center justify-center gap-1 xl:w-[145px] w-[120px] shadow-md py-1.5 rounded-lg cursor-pointer text-white text-[16px] font-medium duration-300 transition-all bg-gradient-to-r from-[#076591] to-[#013D59] hover:from-[#0579af] hover:to-[#045b83] hover:shadow-xl hover:scale-105">
            ชำระเงิน
          </button>
        </div>
      </div>
    </>
  );
}

export default FoodList;
