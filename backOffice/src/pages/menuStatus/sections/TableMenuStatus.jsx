import React, { useState, useEffect } from "react";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { NewLatestData } from "../../../components/mockData/NewLatest/NewLatestData";

const TableMenuStatus = () => {
  return (
    <div className="overflow-x-auto mt-6">
      <table className="2xl:w-full md:w-[1200px] w-[1000px] text-center">
        <thead>
          <tr className="text-[18px] bg-white text-[#013D59]">
            <th className="rounded-tl-lg py-4">โต๊ะ</th>
            <th className="p-4">รายการอาหาร</th>
            <th className="p-4">จำนวน</th>
            <th className="p-4">ยอดรวม (฿)</th>
            <th className="p-4">สถานะ</th>
            <th className="p-4">หมายเหตุ</th>
            <th className="py-4">แก้ไข</th>
            <th className="rounded-tr-lg py-4">ลบ</th>
          </tr>
        </thead>
        <tbody>
          {NewLatestData.map((order, index) => (
            <tr
              key={order.id}
              className={index % 2 === 0 ? "bg-[#EEEEEE]" : "bg-white"}
            >
              <td className="flex items-center justify-center py-3">
                <div className="flex items-center justify-center w-[55px] h-[55px] text-white bg-[#FFBA31] rounded-lg">
                  {order.table}
                </div>
              </td>
              <td className="py-3">
                <div className="flex gap-3">
                  <figure className="w-[55px] h-[55px] rounded-lg shadow-sm">
                    <img
                      className="w-full h-full object-cover rounded-lg"
                      src="/images/1.jpg"
                      alt=""
                    />
                  </figure>
                  <div className="flex flex-col items-start">
                    <p className="text-[16px] font-[500]">{order.food}</p>
                    <p className="text-[12px] font-[300]">{order.food}</p>
                  </div>
                </div>
              </td>
              <td className="p-3">{order.quantity}</td>
              <td className="p-3">{order.total} ฿</td>
              <td className="p-3">
                {(() => {
                  switch (order.status) {
                    case 1:
                      return "กำลังทำ";
                    case 2:
                      return "รอเสริฟ";
                    case 3:
                      return "เสริฟเรียบร้อย";
                    case 4:
                      return "ยกเลิก";
                    case 5:
                      return "สินค้าหมด";
                    default:
                      return "ไม่ทราบสถานะ";
                  }
                })()}
              </td>
              <td className="p-3">{order.note}</td>
              <td className="py-3">
                <div className="w-full flex items-center justify-center">
                  <button className="flex justify-center items-center w-[35px] h-[35px] bg-[#F5A100] hover:bg-[#ffa600] hover:scale-105 duration-200 transition shadow-sm cursor-pointer rounded-lg">
                    <BorderColorIcon
                      sx={{ fontSize: 23 }}
                      className="text-white"
                    />
                  </button>
                </div>
              </td>
              <td className="text-center py-3">
                <div className="w-full flex items-center justify-center">
                  <button className="flex justify-center items-center w-[35px] h-[35px] bg-[#F44D4D] hover:bg-[#ff1c1c] hover:scale-105 duration-200 transition shadow-sm cursor-pointer rounded-lg">
                    <DeleteForeverIcon
                      sx={{ fontSize: 25 }}
                      className="text-white"
                    />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableMenuStatus;
