import React, { useState, useEffect } from "react";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { NewLatestData } from "../../../components/mockData/NewLatest/NewLatestData";
import { getAllOutFoods } from "../../../services/kitchen.service";
import { api_path } from "../../../store/setting";

const TableMenuStatus = ({
  selectedStatusMenu1,
  selectedStatusMenu2,
  selectedEditId,
  handleEditClick,
}) => {
  const [outFoods, setOutFoods] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  useEffect(() => {
    getAllOutFoods().then((res) => {
      setOutFoods(res.outFoods);
    })
  }, [])

  const filteredData = outFoods.filter(
    (item) =>
      (selectedStatusMenu1 === null || item.status === selectedStatusMenu1) &&
      (selectedStatusMenu2 === null ||
        item.Order.Table.title === selectedStatusMenu2)
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
      <div className="overflow-x-auto mt-6 ">
        <table className="2xl:w-full md:w-[1200px] w-[1000px] text-center">
          <thead>
            <tr className="text-[18px] bg-white text-[#013D59]">
              <th className="rounded-tl-lg p-4">รายการอาหาร</th>
              <th className="p-4">หมายเหตุ</th>
              <th className="py-4 pr-4">เพิ่มเหตุ</th>
              <th className="rounded-tr-lg py-4 pr-6">ยกเลิก</th>
            </tr>
          </thead>
          <tbody>
            {currentData.map((order, index) => (
              <tr
                key={order.id}
                className={index % 2 === 0 ? "bg-[#EEEEEE]" : "bg-white"}
              >
                <td className="py-3 pl-6">
                  <div className="flex gap-3">
                    <figure className="w-[55px] h-[55px] rounded-lg shadow-sm">
                      <img
                        className="w-full h-full object-cover rounded-lg"
                        src={api_path + order.thumbnail_link}
                        alt={order.details}
                      />
                    </figure>
                    <div className="flex flex-col items-start">
                      <p className="text-[16px] font-[500]">{order.name}</p>
                      {/* <p className="text-[12px] font-[300]">{order.note}</p> */}
                    </div>
                  </div>
                </td>
                <td className="p-3">{order.note || "-"}</td>
                <td className="py-3 w-[60px] pr-4">
                  <div className="w-full flex items-center justify-center">
                    <button
                      onClick={() => handleEditClick(order.id)}
                      className="flex justify-center items-center w-[80px] h-[35px] text-white font-[500] bg-[#F5A100] hover:bg-[#ffa600] hover:scale-105 duration-200 transition shadow-sm cursor-pointer rounded-lg"
                    >
                      เพิ่มเหตุ
                    </button>
                  </div>
                </td>
                <td className="py-3 w-[60px] pr-6">
                  <div className="w-full flex items-center justify-center">
                    <button className="flex justify-center items-center w-[80px] h-[35px] text-white font-[500] bg-[#F44D4D] hover:bg-[#ff1c1c] hover:scale-105 duration-200 transition shadow-sm cursor-pointer rounded-lg">
                      ยกเลิก
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
