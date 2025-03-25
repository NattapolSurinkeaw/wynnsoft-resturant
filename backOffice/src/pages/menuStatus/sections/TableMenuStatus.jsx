import React, { useState, useEffect } from "react";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { api_path } from "../../../store/setting";

const TableMenuStatus = ({
  selectedStatusMenu1,
  selectedStatusMenu2,
  selectedEditId,
  handleEditClick,
  orderList
  
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  const filteredData = orderList.filter(
    (item) =>
      (selectedStatusMenu1 === null || item.status === selectedStatusMenu1) &&
      (selectedStatusMenu2 === null ||
        item.order.table.title === selectedStatusMenu2)
  );

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  const currentData = filteredData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <>
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
            {currentData.map((order, index) => (
              <tr
                key={order.id}
                className={index % 2 === 0 ? "bg-[#EEEEEE]" : "bg-white"}
              >
                <td className="flex items-center justify-center py-3">
                  <div className="flex items-center justify-center text-[20px] font-[600] w-[55px] h-[55px] text-white bg-[#FFBA31] rounded-lg">
                    {order.order.table.title}
                  </div>
                </td>
                <td className="py-3">
                  <div className="flex gap-3">
                    <figure className="w-[55px] h-[55px] rounded-lg shadow-sm">
                      <img
                        className="w-full h-full object-cover rounded-lg"
                        src={api_path+ order.food.thumbnail_link}
                        alt={order.food.name}
                      />
                    </figure>
                    <div className="flex flex-col items-start">
                      <p className="text-[16px] font-[500]">{order.food.name}</p>
                      <p className="text-[12px] font-[300]">{order.note}</p>
                    </div>
                  </div>
                </td>
                <td className="p-3">{order.amount}</td>
                <td className="p-3">{order.food.price * order.amount} ฿</td>
                <td
                  className={`p-3 ${
                    order.status === "1"
                      ? "text-blue-500"
                      : order.status === "2"
                      ? "text-[#FF6A00]"
                      : order.status === "3"
                      ? "text-[#F44D4D]"
                      : order.status === "4"
                      ? "text-green-500"
                      : order.status === "5"
                      ? "text-red-500"
                      : order.status === "6"
                      ? "text-gray-500"
                      : ""
                  }`}
                >
                  {(() => {
                    switch (order.status) {
                      case "1":
                        return "รับออเดอร์";
                      case "2":
                        return "กำลังทำ";
                      case "3":
                        return "รอเสริฟ";
                      case "4":
                        return "เสริฟเรียบร้อย";
                      case "5":
                        return "ยกเลิก";
                      case "6": 
                        return "สินค้าหมด";
                      default:
                        return "ไม่ทราบสถานะ";
                    }
                  })()}
                </td>
                <td className="p-3">{order.note || "-"}</td>
                <td className="py-3">
                  <div className="w-full flex items-center justify-center">
                    <button
                      onClick={() => handleEditClick(order.id)}
                      className="flex justify-center items-center w-[35px] h-[35px] bg-[#F5A100] hover:bg-[#ffa600] hover:scale-105 duration-200 transition shadow-sm cursor-pointer rounded-lg"
                    >
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

      {/* Pagination */}
      <div className="flex justify-end gap-1 bg-white w-fit mt-8 ml-auto border border-[#DFDFDF] rounded-sm ">
        <button
          onClick={handlePrevious}
          disabled={currentPage === 1}
          className={`text-sm py-2 px-4 rounded-sm cursor-pointer ${
            currentPage === 1
              ? "bg-white text-gray-500 cursor-not-allowed"
              : "hover:bg-[#00537B] hover:text-white"
          }`}
        >
          Previous
        </button>

        {[...Array(totalPages)].map((_, index) => {
          const pageNumber = index + 1;
          return (
            <button
              key={pageNumber}
              onClick={() => setCurrentPage(pageNumber)}
              className={`text-sm py-2 px-4 rounded-sm cursor-pointer ${
                currentPage === pageNumber
                  ? "bg-[#00537B] text-white"
                  : "hover:bg-[#00537B] hover:text-white"
              }`}
            >
              {pageNumber}
            </button>
          );
        })}

        <button
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className={`text-sm py-2 px-4 rounded-sm cursor-pointer ${
            currentPage === totalPages
              ? "bg-white text-gray-500 cursor-not-allowed"
              : "hover:bg-[#00537B] hover:text-white"
          }`}
        >
          Next
        </button>
      </div>
    </>
  );
};

export default TableMenuStatus;
