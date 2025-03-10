import React, { useState } from "react";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import { Select, MenuItem } from "@mui/material";

function MoveTable({ isMoveTable, closeModal }) {
  const [age, setAge] = useState("");

  return (
    isMoveTable && (
      <div className="fixed inset-0 bg-black/60 bg-opacity-50 flex items-center justify-center z-20">
        <div className=" relative bg-white py-8 px-[4rem] rounded-lg shadow-lg w-[380px]">
          <button
            onClick={closeModal}
            className=" absolute -top-8 -right-8 cursor-pointer"
          >
            <CancelOutlinedIcon
              sx={{ fontSize: 35 }}
              className="text-white hover:text-red-500"
            />
          </button>
          <p className="text-[25px] text-center font-[600] text-[#8F8F8F]">
            เลือกโต๊ะที่ต้องการย้าย
          </p>

          <div className="flex justify-center mt-4">
            <Select
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="w-[200px] h-[37px] text-[14px]"
            >
              <MenuItem value={10}>1</MenuItem>
              <MenuItem value={20}>2</MenuItem>
              <MenuItem value={30}>3</MenuItem>
            </Select>
          </div>

          <div className="flex justify-center space-x-5 mt-8">
            <button className="w-[110px] py-1.5 bg-[#013D59] hover:bg-[#002b3f] hover:scale-105 transition duration-300 text-white rounded-lg cursor-pointer shadow-1">
              บันทึก
            </button>
          </div>
        </div>
      </div>
    )
  );
}

export default MoveTable;
