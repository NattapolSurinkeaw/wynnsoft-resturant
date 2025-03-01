import React from "react";
import { Link } from "react-router-dom";
import GridViewIcon from "@mui/icons-material/GridView";
import AssignmentIndOutlinedIcon from '@mui/icons-material/AssignmentIndOutlined';
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined';
import FastfoodOutlinedIcon from '@mui/icons-material/FastfoodOutlined';
import RequestQuoteOutlinedIcon from '@mui/icons-material/RequestQuoteOutlined';
import WidgetsOutlinedIcon from '@mui/icons-material/WidgetsOutlined';

function Sidebar() {
  return (
    <div className="min-w-[275px] h-full overflow-y-auto bg-[#00537B] p-5">
      <figure className="flex justify-center w-full mt-4">
        <Link to="/">
          <img className="w-[100px] h-auto" src="/icons/LOGO.png" alt="" />
        </Link>
      </figure>
      <div className="border-t-2 border-white mt-6"></div>

      <div className="ml-3 mr-3 mt-3 ">
        <p className="text-[16px] text-[#FFEA00]">แดชบอร์ด</p>
        <Link
          to="control"
          className="flex items-center justify-between transition duration-300 rounded-md px-4 pt-1.5 pb-1.5 mt-2 hover:bg-white group"
        >
          <div className="flex items-center gap-3">
            <GridViewIcon
              sx={{ fontSize: 25 }}
              className="text-white group-hover:text-[#00537B]"
            />
            <p className="text-[16px] text-white group-hover:text-[#00537B]">
              ศูนย์ควบคุม
            </p>
          </div>
        </Link>
      </div>
      <div className="border-t border-white mt-4"></div>

      <div className="ml-3 mr-3 mt-3 ">
        <p className="text-[16px] text-[#FFEA00]">จัดการออเดอร์</p>
        <Link
          to="control"
          className="flex items-center justify-between transition duration-300 rounded-md px-4 pt-1.5 pb-1.5 mt-2 hover:bg-white group"
        >
          <div className="flex items-center gap-3">
            <AssignmentIndOutlinedIcon
              sx={{ fontSize: 25 }}
              className="text-white group-hover:text-[#00537B]"
            />
            <p className="text-[16px] text-white group-hover:text-[#00537B]">
              ออเดอร์วันนี้
            </p>
          </div>
          <div className="flex justify-center items-center w-6 h-6 rounded-md text-[#013D59] group-hover:text-white bg-white group-hover:bg-[#00537B] ">
            10
          </div>
        </Link>
        <Link
          to="control"
          className="flex items-center justify-between transition duration-300 rounded-md px-4 pt-1.5 pb-1.5 mt-2 hover:bg-white group"
        >
          <div className="flex items-center gap-3">
            <ReceiptLongOutlinedIcon
              sx={{ fontSize: 25 }}
              className="text-white group-hover:text-[#00537B]"
            />
            <p className="text-[16px] text-white group-hover:text-[#00537B]">
              ชำระเงิน
            </p>
          </div>
          <div className="flex justify-center items-center w-6 h-6 rounded-md text-[#013D59] group-hover:text-white bg-white group-hover:bg-[#00537B] ">
            10
          </div>
        </Link>
        <Link
          to="control"
          className="flex items-center justify-between transition duration-300 rounded-md px-4 pt-1.5 pb-1.5 mt-2 hover:bg-white group"
        >
          <div className="flex items-center gap-3">
            <FastfoodOutlinedIcon
              sx={{ fontSize: 25 }}
              className="text-white group-hover:text-[#00537B]"
            />
            <p className="text-[16px] text-white group-hover:text-[#00537B]">
              รอเสริฟ
            </p>
          </div>
          <div className="flex justify-center items-center w-6 h-6 rounded-md text-[#013D59] group-hover:text-white bg-white group-hover:bg-[#00537B] ">
            10
          </div>
        </Link>
        <Link
          to="control"
          className="flex items-center justify-between transition duration-300 rounded-md px-4 pt-1.5 pb-1.5 mt-2 hover:bg-white group"
        >
          <div className="flex items-center gap-3">
            <RequestQuoteOutlinedIcon
              sx={{ fontSize: 25 }}
              className="text-white group-hover:text-[#00537B]"
            />
            <p className="text-[16px] text-white group-hover:text-[#00537B]">
              ออเดอร์ทั้งหมด
            </p>
          </div>
        </Link>
        <Link
          to="control"
          className="flex items-center justify-between transition duration-300 rounded-md px-4 pt-1.5 pb-1.5 mt-2 hover:bg-white group"
        >
          <div className="flex items-center gap-3">
            <WidgetsOutlinedIcon
              sx={{ fontSize: 25 }}
              className="text-white group-hover:text-[#00537B]"
            />
            <p className="text-[16px] text-white group-hover:text-[#00537B]">
              จัดการโต๊ะ
            </p>
          </div>
        </Link>
      </div>
      <div className="border-t border-white mt-4"></div>

      <div className="ml-3 mr-3 mt-3 ">
        <p className="text-[16px] text-[#FFEA00]">ห้องครัว</p>
        <Link
          to="control"
          className="flex items-center justify-between transition duration-300 rounded-md px-4 pt-1.5 pb-1.5 mt-2 hover:bg-white group"
        >
          <div className="flex items-center gap-3">
            <GridViewIcon
              sx={{ fontSize: 25 }}
              className="text-white group-hover:text-[#00537B]"
            />
            <p className="text-[16px] text-white group-hover:text-[#00537B]">
              รายการล่าสุด
            </p>
          </div>
        </Link>
        <Link
          to="control"
          className="flex items-center justify-between transition duration-300 rounded-md px-4 pt-1.5 pb-1.5 mt-2 hover:bg-white group"
        >
          <div className="flex items-center gap-3">
            <GridViewIcon
              sx={{ fontSize: 25 }}
              className="text-white group-hover:text-[#00537B]"
            />
            <p className="text-[16px] text-white group-hover:text-[#00537B]">
              สถานะเมนู
            </p>
          </div>
        </Link>
        <Link
          to="control"
          className="flex items-center justify-between transition duration-300 rounded-md px-4 pt-1.5 pb-1.5 mt-2 hover:bg-white group"
        >
          <div className="flex items-center gap-3">
            <GridViewIcon
              sx={{ fontSize: 25 }}
              className="text-white group-hover:text-[#00537B]"
            />
            <p className="text-[16px] text-white group-hover:text-[#00537B]">
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
          className="flex items-center justify-between transition duration-300 rounded-md px-4 pt-1.5 pb-1.5 mt-2 hover:bg-white group"
        >
          <div className="flex items-center gap-3">
            <GridViewIcon
              sx={{ fontSize: 25 }}
              className="text-white group-hover:text-[#00537B]"
            />
            <p className="text-[16px] text-white group-hover:text-[#00537B]">
              หมวดหมู่เมนู
            </p>
          </div>
        </Link>
        <Link
          to="control"
          className="flex items-center justify-between transition duration-300 rounded-md px-4 pt-1.5 pb-1.5 mt-2 hover:bg-white group"
        >
          <div className="flex items-center gap-3">
            <GridViewIcon
              sx={{ fontSize: 25 }}
              className="text-white group-hover:text-[#00537B]"
            />
            <p className="text-[16px] text-white group-hover:text-[#00537B]">
              เมนูอาหาร
            </p>
          </div>
        </Link>
        <Link
          to="control"
          className="flex items-center justify-between transition duration-300 rounded-md px-4 pt-1.5 pb-1.5 mt-2 hover:bg-white group"
        >
          <div className="flex items-center gap-3">
            <GridViewIcon
              sx={{ fontSize: 25 }}
              className="text-white group-hover:text-[#00537B]"
            />
            <p className="text-[16px] text-white group-hover:text-[#00537B]">
              ประวัติการสั่ง
            </p>
          </div>
        </Link>
        <Link
          to="control"
          className="flex items-center justify-between transition duration-300 rounded-md px-4 pt-1.5 pb-1.5 mt-2 hover:bg-white group"
        >
          <div className="flex items-center gap-3">
            <GridViewIcon
              sx={{ fontSize: 25 }}
              className="text-white group-hover:text-[#00537B]"
            />
            <p className="text-[16px] text-white group-hover:text-[#00537B]">
              การตั้งค่า
            </p>
          </div>
        </Link>
      </div>
      <div className="border-t border-white mt-4"></div>

      <div className="ml-3 mr-3 mt-3 ">
        <p className="text-[16px] text-[#FFEA00]">รายงาน</p>
        <Link
          to="catefood"
          className="flex items-center justify-between transition duration-300 rounded-md px-4 pt-1.5 pb-1.5 mt-2 hover:bg-white group"
        >
          <div className="flex items-center gap-3">
            <GridViewIcon
              sx={{ fontSize: 25 }}
              className="text-white group-hover:text-[#00537B]"
            />
            <p className="text-[16px] text-white group-hover:text-[#00537B]">
              รายได้รายวัน
            </p>
          </div>
        </Link>
        <Link
          to="control"
          className="flex items-center justify-between transition duration-300 rounded-md px-4 pt-1.5 pb-1.5 mt-2 hover:bg-white group"
        >
          <div className="flex items-center gap-3">
            <GridViewIcon
              sx={{ fontSize: 25 }}
              className="text-white group-hover:text-[#00537B]"
            />
            <p className="text-[16px] text-white group-hover:text-[#00537B]">
              รายได้รายเดือน
            </p>
          </div>
        </Link>
        <Link
          to="control"
          className="flex items-center justify-between transition duration-300 rounded-md px-4 pt-1.5 pb-1.5 mt-2 hover:bg-white group"
        >
          <div className="flex items-center gap-3">
            <GridViewIcon
              sx={{ fontSize: 25 }}
              className="text-white group-hover:text-[#00537B]"
            />
            <p className="text-[16px] text-white group-hover:text-[#00537B]">
              เมนูติดอันดับ
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
}

export default Sidebar;
