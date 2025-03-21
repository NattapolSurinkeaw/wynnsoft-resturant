import React, { useState, useEffect, useRef } from "react";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import ScheduleOutlinedIcon from "@mui/icons-material/ScheduleOutlined";
import Swal from "sweetalert2";
import { NewLatestData } from "../../../components/mockData/NewLatest/NewLatestData";

function MenuStatusModal({ isOpenEditModal, closeModal, selectedEditId }) {
  const [selectedStatusMenu1, setSelectedStatusMenu1] = useState(null);
  const [showStatusMenu1, setShowStatusMenu1] = useState(false);
  const [filteredOrderData, setFilteredOrderData] = useState(null);

  // console.log("selectedEditId", selectedEditId);

  const statusMenuRef1 = useRef(null);

  useEffect(() => {
    if (selectedEditId) {
      const foundData = NewLatestData.find(
        (item) => item.id === selectedEditId
      );
      setFilteredOrderData(foundData || null);
    }
  }, [selectedEditId]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        statusMenuRef1.current &&
        !statusMenuRef1.current.contains(event.target)
      ) {
        setShowStatusMenu1(false);
      }
    };

    if (showStatusMenu1) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showStatusMenu1]);

  useEffect(() => {
    if (selectedStatusMenu1 === null) {
      setShowStatusMenu1(false);
    }
  }, [selectedStatusMenu1]);

  if (!isOpenEditModal || !filteredOrderData) return null;

  return (
    isOpenEditModal && (
      <div onClick={closeModal} className="fixed inset-0 bg-black/60 bg-opacity-50 flex items-center justify-center z-20">
        <div onClick={(e) => e.stopPropagation()} className="relative bg-white p-4 rounded-lg shadow-lg w-[480px]">
          <button
            onClick={closeModal}
            className="absolute -top-8 -right-8 cursor-pointer"
          >
            <CancelOutlinedIcon
              sx={{ fontSize: 35 }}
              className="text-white hover:text-red-500"
            />
          </button>

          <div className="flex gap-4 w-full">
            <figure className="max-w-[130px] min-w-[130px] h-[130px] shadow-md">
              <img
                className="w-full h-full object-cover rounded-lg"
                src={filteredOrderData.thumbnail_link}
                alt={filteredOrderData.details}
              />
            </figure>
            <div className="flex flex-col justify-between w-full">
              <p className="text-[#313131] text-[22px] font-[600] line-clamp-2">
                {filteredOrderData.details}
              </p>
              <div className="flex justify-between">
                <div className="flex items-center gap-1">
                  <ScheduleOutlinedIcon
                    sx={{ fontSize: 20 }}
                    className="text-[#8F8F8F]"
                  />
                  <p className="text-[#8F8F8F] text-[18px] font-[400]">
                    {new Date(filteredOrderData.createdAt).toLocaleTimeString(
                      "th-TH",
                      {
                        hour: "2-digit",
                        minute: "2-digit",
                      }
                    )}{" "}
                    น.
                  </p>
                </div>
                <div className="flex items-center gap-2 ">
                  <p className="text-[#00537B] text-[18px] font-[600]">จำนวน</p>
                  <p className="flex justify-center items-center w-[70px] h-[40px] text-[#00537B] text-[26px] font-[600] bg-[#EEEEEE] p-1 border border-[#D9D9D9] rounded-lg">
                    {filteredOrderData.amount}
                  </p>
                  <p className="text-[#00537B] text-[18px] font-[400]">
                    รายการ
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full text-[#313131] text-[16px] font-[400] h-[80px] bg-[#EEEEEE] rounded-md p-2 mt-6">
            {filteredOrderData.note}
          </div>

          <textarea
            className="w-full min-h-[80px] p-2 mt-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-y"
            placeholder="หมายเหตุ..."
          ></textarea>

          <div className="flex justify-between mt-3">
            <p className="text-[16px] font-[600]">เปลี่ยนสถานะ</p>
            <div className="relative" ref={statusMenuRef1}>
              <div className="flex flex-shrink-0 gap-2 items-center">
                <div
                  className="bg-white cursor-pointer flex justify-between items-center gap-2 py-1 px-2 rounded-lg shadow border border-gray-200 w-[180px] max-w-full"
                  onClick={() => {
                    setShowStatusMenu1(!showStatusMenu1);
                  }}
                >
                  <p className="text-[#313131] xl:text-[16px] text-[12px] font-[400]">
                    {selectedStatusMenu1 === "1"
                      ? "กำลังทำ"
                      : selectedStatusMenu1 === "2"
                      ? "รอเสริฟ"
                      : selectedStatusMenu1 === "3"
                      ? "เสริฟเรียบร้อย"
                      : selectedStatusMenu1 === "4"
                      ? "ยกเลิก"
                      : selectedStatusMenu1 === "5"
                      ? "สินค้าหมด"
                      : "เลือกสถานะ"}
                  </p>

                  <figure
                    className={`lg:w-[25px] w-[20px] lg:h-[25px] h-[20px] transition-all duration-300 ${
                      !showStatusMenu1 ? "" : "rotate-180"
                    }`}
                  >
                    <img
                      src="/icons/Group 949.png"
                      alt=""
                      className="w-full h-full"
                    />
                  </figure>
                </div>
              </div>

              {/* สินค้าขายดี */}
              <div className="absolute w-full h-full z-50">
                {showStatusMenu1 && (
                  <div className="bg-white flex flex-col gap-2 p-2 mt-2 rounded-lg shadow">
                    {[
                      { id: "1", label: "กำลังทำ" },
                      { id: "2", label: "รอเสริฟ" },
                      { id: "3", label: "เสริฟเรียบร้อย" },
                      { id: "4", label: "ยกเลิก" },
                      { id: "5", label: "สินค้าหมด" },
                    ].map(({ id, label }) => (
                      <div
                        key={id}
                        className={`py-1 px-4 cursor-pointer hover:bg-[#00537B] hover:text-white text-black rounded-lg ${
                          selectedStatusMenu1 === id
                            ? "bg-[#F5A100] text-white"
                            : ""
                        }`}
                        onClick={() => {
                          setSelectedStatusMenu1(id);
                          setShowStatusMenu1(false);
                        }}
                      >
                        {label}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="flex flex-col space-y-3">
              <button className="w-[137px] py-1.5 bg-[#013D59] hover:bg-[#004b6e] hover:scale-105 transition duration-300 text-white rounded-lg cursor-pointer shadow-1">
                บันทึก
              </button>
              <button
                onClick={closeModal}
                className="w-[137px] py-1.5 bg-[#F5A100] hover:bg-[#ffa600] hover:scale-105 transition duration-300 text-white rounded-lg cursor-pointer shadow-1"
              >
                ยกเลิก
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  );
}

export default MenuStatusModal;
