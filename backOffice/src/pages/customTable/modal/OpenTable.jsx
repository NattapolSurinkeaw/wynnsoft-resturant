import React, { useState } from "react";
import PersonAddAltOutlinedIcon from "@mui/icons-material/PersonAddAltOutlined";
import InsertInvitationIcon from "@mui/icons-material/InsertInvitation";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { renderTimeViewClock } from "@mui/x-date-pickers/timeViewRenderers";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { Select, MenuItem } from "@mui/material";

function OpenTable({ isOpenTable, closeModal }) {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [age, setAge] = useState("");

  return (
    isOpenTable && (
      <div className="fixed inset-0 bg-black/60 bg-opacity-50 flex items-center justify-center z-20">
        <div className=" relative bg-white p-8 rounded-lg shadow-lg w-[380px]">
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
            ต้องการเปิดโต๊ะ
          </p>

          <div className="flex justify-center space-x-5 mt-8">
            <button className="w-[110px] py-1.5 bg-[#013D59] hover:bg-[#002b3f] hover:scale-105 transition duration-300 text-white rounded-lg cursor-pointer shadow-1">
              ยืนยัน
            </button>
          </div>
        </div>
      </div>
    )
  );
}

export default OpenTable;
