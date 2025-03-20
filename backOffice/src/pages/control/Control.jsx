import React from "react";
import NotificationsIcon from "@mui/icons-material/Notifications";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { Link } from "react-router-dom";
import NotificationsActiveOutlinedIcon from "@mui/icons-material/NotificationsActiveOutlined";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import BookmarkAddedOutlinedIcon from "@mui/icons-material/BookmarkAddedOutlined";
import AccessTimeSharpIcon from "@mui/icons-material/AccessTimeSharp";
import { orderToday } from "../../components/mockData/orderToDay";

function Control() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex 2xl:flex-row flex-col gap-4 w-full justify-between 2xl:items-center">
        <div className="flex flex-shrink-0 gap-2 justify-start items-center">
          <p className="text-[#013D59] text-2xl font-[600]">
            เเจ้งเตือนออเดอร์
          </p>
          <NotificationsIcon sx={{ color: "#013D59", fontSize: 35 }} />
        </div>

        <Link
          to={"/customTable"}
          className="bg-[#00537B] cursor-pointer max-w-[150px] w-full flex flex-shrink-0 justify-center items-center gap-2 p-1 px-2 rounded-lg shadow hover:bg-[#F5A100] transition-all duration-200 ease-in-out"
        >
          <AddCircleOutlineIcon sx={{ color: "#fff", fontSize: 30 }} />
          <p className="text-white xl:text-lg text-base font-[400]">เปิดโต๊ะ</p>
        </Link>
      </div>
      {/* hide-scrollbar */}
      <div className="w-full overflow-y-auto ">
        <div className="w-[370px] bg-white rounded-lg shadow p-4 flex flex-col justify-center items-center gap-2">
          
        </div>
      </div>
    </div>
  );
}

export default Control;
