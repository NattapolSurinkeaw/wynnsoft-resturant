import React from "react";
import { Link } from "react-router-dom";
import NotificationsIcon from "@mui/icons-material/Notifications";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import FastfoodOutlinedIcon from "@mui/icons-material/FastfoodOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import NotificationsActiveOutlinedIcon from "@mui/icons-material/NotificationsActiveOutlined";
import RequestQuoteOutlinedIcon from "@mui/icons-material/RequestQuoteOutlined";
import BookmarkAddedOutlinedIcon from "@mui/icons-material/BookmarkAddedOutlined";
import Current from "./sections/Current";
import Payment from "./sections/Payment";
import Popular from "./sections/Popular";

import { ControlData } from "../../components/mockData/ControlData/ControlData";

const OrderStatus = ({ status }) => {
  switch (status) {
    case 3:
      return (
        <div className="flex justify-between bg-[#FF6A00] py-2 px-4 rounded-full mt-2">
          <p className="text-[16px] text-white font-[500]">พร้อมเสริฟ</p>
          <div className="flex items-center gap-4 text-[16px] text-white font-[600]">
            1
            <DescriptionOutlinedIcon
              sx={{ fontSize: 25 }}
              className="text-white"
            />
          </div>
        </div>
      );
    case 2:
      return (
        <div className="flex justify-between bg-[#FFD25B] py-2 px-4 rounded-full mt-2">
          <p className="text-[16px] text-[#013D59] font-[500]">
            อยู่ระหว่างปรุง
          </p>
          <div className="flex items-center gap-4 text-[16px] text-[#013D59] font-[600]">
            1
            <AccessTimeOutlinedIcon
              sx={{ fontSize: 25 }}
              className="text-[#013D59]"
            />
          </div>
        </div>
      );
    case 1:
      return (
        <div className="flex justify-between bg-[#D9D9D9] py-2 px-4 rounded-full mt-2">
          <p className="text-[16px] text-[#013D59] font-[500]">ไม่มีออเดอร์</p>
          <div className="flex items-center gap-4 text-[16px] text-[#013D59] font-[600]">
            1
            <AccessTimeOutlinedIcon
              sx={{ fontSize: 25 }}
              className="text-[#013D59]"
            />
          </div>
        </div>
      );
    default:
      return null;
  }
};

function Control() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-4 w-full justify-between 2xl:items-center">
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
      <div className="flex 2xl:gap-6 gap-3 w-full overflow-x-auto pb-3">
        {ControlData.filter((table) => [1, 2, 3].includes(table.status)).map(
          (table) => (
            <div
              key={table.id}
              className="min-w-[381px] bg-white rounded-lg shadow py-4 px-5"
            >
              <div className="flex w-full justify-between items-center">
                <div className="flex gap-1 items-center">
                  <FastfoodOutlinedIcon
                    sx={{ fontSize: 30 }}
                    className="text-[#00537B]"
                  />
                  <p className="text-[26px] text-[#013D59] font-[600]">
                    : โต๊ะ {table.name_table}
                  </p>
                </div>
                <p className="text-[16px] text-[#8F8F8F] font-[500]">
                  {table.food_menu} รายการ
                </p>
              </div>

              <OrderStatus status={table.status} />
            </div>
          )
        )}
      </div>
      <div className="grid 2xl:grid-cols-4 grid-cols-2 2xl:gap-6 gap-3 w-full ">
        <div className="flex justify-between items-center w-full bg-[#00537B] rounded-lg shadow py-4 px-5">
          <div>
            <p className="text-[16px] text-white font-[500]">รายการสั่งใหม่</p>
            <p className="text-[35px] text-white font-[700]">05</p>
          </div>
          <div className="flex w-[60px] h-[60px] items-center justify-center bg-white  rounded-lg">
            <NotificationsActiveOutlinedIcon
              sx={{ fontSize: 40 }}
              className="text-[#00537B]"
            />
          </div>
        </div>
        <div className="flex justify-between items-center w-full bg-[#F44D4D] rounded-lg shadow py-4 px-5">
          <div>
            <p className="text-[16px] text-white font-[500]">รอชำระเงิน</p>
            <p className="text-[35px] text-white font-[700]">02</p>
          </div>
          <div className="flex w-[60px] h-[60px] items-center justify-center bg-white  rounded-lg">
            <RequestQuoteOutlinedIcon
              sx={{ fontSize: 40 }}
              className="text-[#F44D4D]"
            />
          </div>
        </div>
        <div className="flex justify-between items-center w-full bg-[#FF6A00] rounded-lg shadow py-4 px-5">
          <div>
            <p className="text-[16px] text-white font-[500]">พร้อมเสริฟ</p>
            <p className="text-[35px] text-white font-[700]">03</p>
          </div>
          <div className="flex w-[60px] h-[60px] items-center justify-center bg-white  rounded-lg">
            <BookmarkAddedOutlinedIcon
              sx={{ fontSize: 40 }}
              className="text-[#FF6A00]"
            />
          </div>
        </div>
        <div className="flex justify-between items-center w-full bg-[#FFD25B] rounded-lg shadow py-4 px-5">
          <div>
            <p className="text-[16px] text-white font-[500]">อยู่ระหว่างปรุง</p>
            <p className="text-[35px] text-white font-[700]">01</p>
          </div>
          <div className="flex w-[60px] h-[60px] items-center justify-center bg-white  rounded-lg">
            <AccessTimeOutlinedIcon
              sx={{ fontSize: 40 }}
              className="text-[#00537B]"
            />
          </div>
        </div>
      </div>

      <div className="grid 2xl:grid-cols-3 grid-cols-1 w-full 2xl:gap-6 gap-3">
        <Current />
        <Payment />
        <Popular />
      </div>
    </div>
  );
}

export default Control;
