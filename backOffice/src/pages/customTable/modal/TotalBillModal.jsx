import React, { useState } from "react";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import { FoodListData } from "../../../components/mockData/CustomTable/FoodListData";

function TotalBillModal({ isTotalBill, closeModal }) {
  const [selectedRows, setSelectedRows] = useState([]);

  const handleCheckboxChange = (id) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((row) => row !== id) : [...prev, id]
    );
  };

  return (
    isTotalBill && (
      <div className="fixed inset-0 bg-black/60 bg-opacity-50 flex items-center justify-center z-20">
        <div className=" relative bg-white rounded-lg shadow-lg w-[800px]">
          <button
            onClick={closeModal}
            className=" absolute -top-8 -right-8 cursor-pointer"
          >
            <CancelOutlinedIcon
              sx={{ fontSize: 35 }}
              className="text-white hover:text-red-500"
            />
          </button>

          <div className="flex items-center justify-between w-full rounded-t-lg bg-[#013D59] px-6 py-3">
            <p className="flex items-center justify-center gap-2">
              <p className="text-[23px] font-[600] text-white">โต๊ะ</p>
              <p className="text-[23px] font-[600] text-white">02</p>
            </p>
            <div className="flex items-center ">
              <p className="text-[16px] font-[400] text-white">
                หมายเลขออเดอร์ :
              </p>
              <p className="ml-2 text-[18px] font-[600] text-white">000004</p>
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

          <div className="w-full h-[420px] py-3 overflow-y-auto ">
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

          <div className="flex items-start justify-between px-6 pb-5">
            <p className="text-[23px] font-[700] text-[#313131]">ยอดทั้งหมด</p>
            <p className="text-[23px] font-[700] text-[#313131]">$ 00,000.00</p>
          </div>
        </div>
      </div>
    )
  );
}

export default TotalBillModal;
