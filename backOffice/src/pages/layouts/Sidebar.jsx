import React from "react";
import { Link, useLocation } from "react-router-dom";
import GridViewIcon from "@mui/icons-material/GridView";
import AssignmentIndOutlinedIcon from "@mui/icons-material/AssignmentIndOutlined";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import FastfoodOutlinedIcon from "@mui/icons-material/FastfoodOutlined";
import RequestQuoteOutlinedIcon from "@mui/icons-material/RequestQuoteOutlined";
import WidgetsOutlinedIcon from "@mui/icons-material/WidgetsOutlined";
import FormatListNumberedOutlinedIcon from "@mui/icons-material/FormatListNumberedOutlined";
import EventAvailableOutlinedIcon from "@mui/icons-material/EventAvailableOutlined";
import NoFoodOutlinedIcon from "@mui/icons-material/NoFoodOutlined";
import LayersOutlinedIcon from "@mui/icons-material/LayersOutlined";
import EventNoteOutlinedIcon from "@mui/icons-material/EventNoteOutlined";
import MenuBookOutlinedIcon from "@mui/icons-material/MenuBookOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import LeaderboardOutlinedIcon from "@mui/icons-material/LeaderboardOutlined";
import ChecklistOutlinedIcon from "@mui/icons-material/ChecklistOutlined";
import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined";

function Sidebar({ isSidebarOpen }) {
  const location = useLocation();

  return (
    <div
      className={`h-full overflow-y-auto bg-[#00537B] transition-all duration-600 ease-in-out hide-scrollbar
    ${
      isSidebarOpen
        ? "min-w-[275px] max-w-[275px] px-5 pb-5 transform translate-x-0 opacity-100"
        : "min-w-0 max-w-0 transform -translate-x-full opacity-0"
    }`}
    >
      <figure className="flex justify-center w-full ">
        <Link to="/">
          <img
            className="w-[120px] h-auto"
            src="/icons/โลโก้-Soju-Day-Final-1.png"
            alt=""
          />
        </Link>
      </figure>
      <div className="border-t-2 border-white mt-2"></div>

      <div className="ml-3 mr-3 mt-3 ">
        <p className="text-[16px] text-[#FFEA00]">แดชบอร์ด</p>
        <Link
          to="/control"
          className={`flex items-center justify-between transition duration-100 rounded-md px-4 pt-1.5 pb-1.5 mt-2 
          ${
            location.pathname === "/control"
              ? "bg-white"
              : "hover:bg-white group"
          }`}
        >
          <div className="flex items-center gap-3">
            <GridViewIcon
              sx={{ fontSize: 25 }}
              className={`${
                location.pathname === "/control"
                  ? "text-[#00537B]"
                  : "text-white group-hover:text-[#00537B]"
              }`}
            />
            <p
              className={`text-[16px] ${
                location.pathname === "/control"
                  ? "text-[#00537B]"
                  : "text-white group-hover:text-[#00537B]"
              }`}
            >
              ศูนย์ควบคุม
            </p>
          </div>
        </Link>
      </div>
      <div className="border-t border-white mt-4"></div>

      <div className="ml-3 mr-3 mt-3 ">
        <p className="text-[16px] text-[#FFEA00]">จัดการออเดอร์</p>
        <Link
          to="ordersDay"
          className={`flex items-center justify-between transition duration-100 rounded-md px-4 pt-1.5 pb-1.5 mt-2 "
          ${
            location.pathname === "/ordersDay"
              ? "bg-white"
              : "hover:bg-white group"
          }`}
        >
          <div className="flex items-center gap-3">
            <AssignmentIndOutlinedIcon
              sx={{ fontSize: 25 }}
              className={`${
                location.pathname === "/ordersDay"
                  ? "text-[#00537B]"
                  : "text-white group-hover:text-[#00537B]"
              }`}
            />
            <p
              className={`text-[16px] ${
                location.pathname === "/ordersDay"
                  ? "text-[#00537B]"
                  : "text-white group-hover:text-[#00537B]"
              }`}
            >
              ออเดอร์วันนี้
            </p>
          </div>
          <div
            className={`flex justify-center items-center w-6 h-6 rounded-md ${
              location.pathname === "/ordersDay"
                ? "text-white bg-[#00537B]"
                : "text-[#00537B] bg-white group-hover:text-white group-hover:bg-[#00537B]"
            }`}
          >
            10
          </div>
        </Link>
        <Link
          to="payment"
          className={`flex items-center justify-between transition duration-100 rounded-md px-4 pt-1.5 pb-1.5 mt-2 "
            ${
              location.pathname === "/payment"
                ? "bg-white"
                : "hover:bg-white group"
            }`}
        >
          <div className="flex items-center gap-3">
            <ReceiptLongOutlinedIcon
              sx={{ fontSize: 25 }}
              className={`${
                location.pathname === "/payment"
                  ? "text-[#00537B]"
                  : "text-white group-hover:text-[#00537B]"
              }`}
            />
            <p
              className={`text-[16px] ${
                location.pathname === "/payment"
                  ? "text-[#00537B]"
                  : "text-white group-hover:text-[#00537B]"
              }`}
            >
              ชำระเงิน
            </p>
          </div>
          <div
            className={`flex justify-center items-center w-6 h-6 rounded-md ${
              location.pathname === "/payment"
                ? "text-white bg-[#00537B]"
                : "text-[#00537B] bg-white group-hover:text-white group-hover:bg-[#00537B]"
            }`}
          >
            10
          </div>
        </Link>
        <Link
          to="served"
          className={`flex items-center justify-between transition duration-100 rounded-md px-4 pt-1.5 pb-1.5 mt-2 "
            ${
              location.pathname === "/served"
                ? "bg-white"
                : "hover:bg-white group"
            }`}
        >
          <div className="flex items-center gap-3">
            <FastfoodOutlinedIcon
              sx={{ fontSize: 25 }}
              className={`${
                location.pathname === "/served"
                  ? "text-[#00537B]"
                  : "text-white group-hover:text-[#00537B]"
              }`}
            />
            <p
              className={`text-[16px] ${
                location.pathname === "/served"
                  ? "text-[#00537B]"
                  : "text-white group-hover:text-[#00537B]"
              }`}
            >
              รอเสริฟ
            </p>
          </div>
          <div
            className={`flex justify-center items-center w-6 h-6 rounded-md ${
              location.pathname === "/served"
                ? "text-white bg-[#00537B]"
                : "text-[#00537B] bg-white group-hover:text-white group-hover:bg-[#00537B]"
            }`}
          >
            10
          </div>
        </Link>
        <Link
          to="orders"
          className={`flex items-center justify-between transition duration-100 rounded-md px-4 pt-1.5 pb-1.5 mt-2 
            ${
              location.pathname === "/orders"
                ? "bg-white"
                : "hover:bg-white group"
            }`}
        >
          <div className="flex items-center gap-3">
            <RequestQuoteOutlinedIcon
              sx={{ fontSize: 25 }}
              className={`${
                location.pathname === "/orders"
                  ? "text-[#00537B]"
                  : "text-white group-hover:text-[#00537B]"
              }`}
            />
            <p
              className={`text-[16px] ${
                location.pathname === "/orders"
                  ? "text-[#00537B]"
                  : "text-white group-hover:text-[#00537B]"
              }`}
            >
              ออเดอร์ทั้งหมด
            </p>
          </div>
        </Link>
        <Link
          to="customTable"
          className={`flex items-center justify-between transition duration-100 rounded-md px-4 pt-1.5 pb-1.5 mt-2 
            ${
              location.pathname === "/customTable"
                ? "bg-white"
                : "hover:bg-white group"
            }`}
        >
          <div className="flex items-center gap-3">
            <WidgetsOutlinedIcon
              sx={{ fontSize: 25 }}
              className={`${
                location.pathname === "/customTable"
                  ? "text-[#00537B]"
                  : "text-white group-hover:text-[#00537B]"
              }`}
            />
            <p
              className={`text-[16px] ${
                location.pathname === "/customTable"
                  ? "text-[#00537B]"
                  : "text-white group-hover:text-[#00537B]"
              }`}
            >
              จัดการโต๊ะ
            </p>
          </div>
        </Link>
      </div>
      <div className="border-t border-white mt-4"></div>

      <div className="ml-3 mr-3 mt-3 ">
        <p className="text-[16px] text-[#FFEA00]">ห้องครัว</p>
        <Link
          to="newLatest"
          className={`flex items-center justify-between transition duration-100 rounded-md px-4 pt-1.5 pb-1.5 mt-2 
            ${
              location.pathname === "/newLatest"
                ? "bg-white"
                : "hover:bg-white group"
            }`}
        >
          <div className="flex items-center gap-3">
            <ChecklistOutlinedIcon
              sx={{ fontSize: 25 }}
              className={`${
                location.pathname === "/newLatest"
                  ? "text-[#00537B]"
                  : "text-white group-hover:text-[#00537B]"
              }`}
            />
            <p
              className={`text-[16px] ${
                location.pathname === "/newLatest"
                  ? "text-[#00537B]"
                  : "text-white group-hover:text-[#00537B]"
              }`}
            >
              รายการล่าสุด
            </p>
          </div>
        </Link>
        <Link
          to="menuStatus"
          className={`flex items-center justify-between transition duration-100 rounded-md px-4 pt-1.5 pb-1.5 mt-2 
            ${
              location.pathname === "/menuStatus"
                ? "bg-white"
                : "hover:bg-white group"
            }`}
        >
          <div className="flex items-center gap-3">
            <EventAvailableOutlinedIcon
              sx={{ fontSize: 25 }}
              className={`${
                location.pathname === "/menuStatus"
                  ? "text-[#00537B]"
                  : "text-white group-hover:text-[#00537B]"
              }`}
            />
            <p
              className={`text-[16px] ${
                location.pathname === "/menuStatus"
                  ? "text-[#00537B]"
                  : "text-white group-hover:text-[#00537B]"
              }`}
            >
              สถานะเมนู
            </p>
          </div>
        </Link>
        <Link
          to="outStock"
          className={`flex items-center justify-between transition duration-100 rounded-md px-4 pt-1.5 pb-1.5 mt-2 
            ${
              location.pathname === "/outStock"
                ? "bg-white"
                : "hover:bg-white group"
            }`}
        >
          <div className="flex items-center gap-3">
            <NoFoodOutlinedIcon
              sx={{ fontSize: 25 }}
              className={`${
                location.pathname === "/outStock"
                  ? "text-[#00537B]"
                  : "text-white group-hover:text-[#00537B]"
              }`}
            />
            <p
              className={`text-[16px] ${
                location.pathname === "/outStock"
                  ? "text-[#00537B]"
                  : "text-white group-hover:text-[#00537B]"
              }`}
            >
              สินค้าหมด
            </p>
          </div>
        </Link>
      </div>
      <div className="border-t border-white mt-4"></div>

      <div className="ml-3 mr-3 mt-3 ">
        <p className="text-[16px] text-[#FFEA00]">จัดการข้อมูล</p>
        <Link
          to="catefood"
          className={`flex items-center justify-between transition duration-100 rounded-md px-4 pt-1.5 pb-1.5 mt-2 
            ${
              location.pathname === "/catefood"
                ? "bg-white"
                : "hover:bg-white group"
            }`}
        >
          <div className="flex items-center gap-3">
            <LayersOutlinedIcon
              sx={{ fontSize: 25 }}
              className={`${
                location.pathname === "/catefood"
                  ? "text-[#00537B]"
                  : "text-white group-hover:text-[#00537B]"
              }`}
            />
            <p
              className={`text-[16px] ${
                location.pathname === "/catefood"
                  ? "text-[#00537B]"
                  : "text-white group-hover:text-[#00537B]"
              }`}
            >
              หมวดหมู่เมนู
            </p>
          </div>
        </Link>
        <Link
          to="foodMenu"
          className={`flex items-center justify-between transition duration-100 rounded-md px-4 pt-1.5 pb-1.5 mt-2 
            ${
              location.pathname === "/foodMenu"
                ? "bg-white"
                : "hover:bg-white group"
            }`}
        >
          <div className="flex items-center gap-3">
            <MenuBookOutlinedIcon
              sx={{ fontSize: 25 }}
              className={`${
                location.pathname === "/foodMenu"
                  ? "text-[#00537B]"
                  : "text-white group-hover:text-[#00537B]"
              }`}
            />
            <p
              className={`text-[16px] ${
                location.pathname === "/foodMenu"
                  ? "text-[#00537B]"
                  : "text-white group-hover:text-[#00537B]"
              }`}
            >
              เมนูอาหาร
            </p>
          </div>
        </Link>
        <Link
          to="orderHistory"
          className={`flex items-center justify-between transition duration-100 rounded-md px-4 pt-1.5 pb-1.5 mt-2 
            ${
              location.pathname === "/orderHistory"
                ? "bg-white"
                : "hover:bg-white group"
            }`}
        >
          <div className="flex items-center gap-3">
            <EventNoteOutlinedIcon
              sx={{ fontSize: 25 }}
              className={`${
                location.pathname === "/orderHistory"
                  ? "text-[#00537B]"
                  : "text-white group-hover:text-[#00537B]"
              }`}
            />
            <p
              className={`text-[16px] ${
                location.pathname === "/orderHistory"
                  ? "text-[#00537B]"
                  : "text-white group-hover:text-[#00537B]"
              }`}
            >
              ประวัติการสั่ง
            </p>
          </div>
        </Link>
        <Link
          to="settings"
          className={`flex items-center justify-between transition duration-100 rounded-md px-4 pt-1.5 pb-1.5 mt-2 
            ${
              location.pathname === "/settings"
                ? "bg-white"
                : "hover:bg-white group"
            }`}
        >
          <div className="flex items-center gap-3">
            <SettingsOutlinedIcon
              sx={{ fontSize: 25 }}
              className={`${
                location.pathname === "/settings"
                  ? "text-[#00537B]"
                  : "text-white group-hover:text-[#00537B]"
              }`}
            />
            <p
              className={`text-[16px] ${
                location.pathname === "/settings"
                  ? "text-[#00537B]"
                  : "text-white group-hover:text-[#00537B]"
              }`}
            >
              การตั้งค่า
            </p>
          </div>
        </Link>
      </div>
      <div className="border-t border-white mt-4"></div>

      <div className="ml-3 mr-3 mt-3 ">
        <p className="text-[16px] text-[#FFEA00]">รายงาน</p>
        <Link
          to="dailyincome"
          className={`flex items-center justify-between transition duration-100 rounded-md px-4 pt-1.5 pb-1.5 mt-2 
            ${
              location.pathname === "/dailyincome"
                ? "bg-white"
                : "hover:bg-white group"
            }`}
        >
          <div className="flex items-center gap-3">
            <LeaderboardOutlinedIcon
              sx={{ fontSize: 25 }}
              className={`${
                location.pathname === "/dailyincome"
                  ? "text-[#00537B]"
                  : "text-white group-hover:text-[#00537B]"
              }`}
            />
            <p
              className={`text-[16px] ${
                location.pathname === "/dailyincome"
                  ? "text-[#00537B]"
                  : "text-white group-hover:text-[#00537B]"
              }`}
            >
              รายได้รายวัน
            </p>
          </div>
        </Link>
        <Link
          to="monthlyincome"
          className={`flex items-center justify-between transition duration-100 rounded-md px-4 pt-1.5 pb-1.5 mt-2 
            ${
              location.pathname === "/monthlyincome"
                ? "bg-white"
                : "hover:bg-white group"
            }`}
        >
          <div className="flex items-center gap-3">
            <PaymentsOutlinedIcon
              sx={{ fontSize: 25 }}
              className={`${
                location.pathname === "/monthlyincome"
                  ? "text-[#00537B]"
                  : "text-white group-hover:text-[#00537B]"
              }`}
            />
            <p
              className={`text-[16px] ${
                location.pathname === "/monthlyincome"
                  ? "text-[#00537B]"
                  : "text-white group-hover:text-[#00537B]"
              }`}
            >
              รายได้รายเดือน
            </p>
          </div>
        </Link>
        <Link
          to="topMenu"
          className={`flex items-center justify-between transition duration-100 rounded-md px-4 pt-1.5 pb-1.5 mt-2 
            ${
              location.pathname === "/topMenu"
                ? "bg-white"
                : "hover:bg-white group"
            }`}
        >
          <div className="flex items-center gap-3">
            <FormatListNumberedOutlinedIcon
              sx={{ fontSize: 25 }}
              className={`${
                location.pathname === "/topMenu"
                  ? "text-[#00537B]"
                  : "text-white group-hover:text-[#00537B]"
              }`}
            />
            <p
              className={`text-[16px] ${
                location.pathname === "/topMenu"
                  ? "text-[#00537B]"
                  : "text-white group-hover:text-[#00537B]"
              }`}
            >
              เมนูติดอันดับ
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
}

export default Sidebar;
