import React, { useState } from "react";
import TotalBillModal from "../../modal/TotalBillModal";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import AddToPhotosIcon from "@mui/icons-material/AddToPhotos";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import Checkbox from "@mui/material/Checkbox";

function TotalBill() {
  const [isTotalBill, setIsTotalBill] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);

  const handleTotalBillOnClick = () => {
    setIsTotalBill(true);
  };

  const closeModal = () => {
    setIsTotalBill(false);
  };

  const handleCheckboxChange = (id) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((row) => row !== id) : [...prev, id]
    );
  };

  const tables = [
    { id: 1, name: "โต๊ะ 01", total: 520 },
    { id: 2, name: "โต๊ะ 02", total: 750 },
    { id: 3, name: "โต๊ะ 03", total: 390 },
    { id: 4, name: "โต๊ะ 04", total: 690 },
    { id: 5, name: "โต๊ะ 05", total: 490 },
    { id: 6, name: "โต๊ะ 06", total: 500 },
  ];

  return (
    <>
      <TotalBillModal isTotalBill={isTotalBill} closeModal={closeModal} />
      <div className="flex flex-col w-full min-h-[631px]">
        <div className="w-full h-full bg-white shadow-1 rounded-lg p-6">
          <p className="text-[18px] font-[500] text-[#313131]">
            เลือกโต๊ะรวมบิล
          </p>

          {tables.map((table) => (
            <div
              key={table.id}
              className="flex items-center justify-between w-full border-b border-gray-300 py-2"
            >
              <div className="flex items-center">
                <Checkbox
                  size="medium"
                  checked={selectedRows.includes(table.id)}
                  onChange={() => handleCheckboxChange(table.id)}
                />
                <p className="text-[16px] font-[400] text-[#313131]">
                  {table.name}
                </p>
              </div>
              <p className="text-[16px] font-[400] text-[#313131]">ยอดรวม</p>
              <p className="text-[16px] font-[400] text-[#313131]">
                {table.total.toLocaleString()} $
              </p>
              <button
                onClick={handleTotalBillOnClick}
                className="flex items-center justify-center gap-2 xl:w-[110px] w-[120px] shadow-md py-1 rounded-lg cursor-pointer text-white text-[14px] font-medium duration-300 transition-all bg-[#F5A100] hover:bg-[#ffa600] hover:shadow-xl hover:scale-105"
              >
                <VisibilityOutlinedIcon
                  sx={{ fontSize: 23 }}
                  className="text-white"
                />
                รายละเอียด
              </button>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-center gap-4">
          <button className="mt-4 flex items-center justify-center gap-2 xl:w-[130px] w-[120px] shadow-md py-1.5 rounded-lg cursor-pointer text-white text-[16px] font-medium duration-300 transition-all bg-gradient-to-r from-[#FFD468] to-[#FFC107] hover:from-[#F5A100] hover:to-[#FF8C00] hover:shadow-xl hover:scale-105">
            <AddToPhotosIcon sx={{ fontSize: 23 }} className="text-white" />
            รวมบิล
          </button>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 flex items-center justify-center gap-2 xl:w-[130px] w-[120px] shadow-md py-1.5 rounded-lg cursor-pointer text-white text-[16px] font-medium duration-300 transition-all bg-gradient-to-r from-[#F44D4D] to-[#FF5E5E] hover:from-[#FF0A0A] hover:to-[#FF5252] hover:shadow-xl hover:scale-105"
          >
            <CancelOutlinedIcon sx={{ fontSize: 23 }} className="text-white" />
            ยกเลิก
          </button>
        </div>
      </div>
    </>
  );
}

export default TotalBill;
