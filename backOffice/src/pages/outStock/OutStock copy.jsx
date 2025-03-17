import React, { useState, useEffect, useRef } from "react";
import EventAvailableOutlinedIcon from "@mui/icons-material/EventAvailableOutlined";
import TableMenuStatus from "./sections/TableMenuStatus";
import MenuStatusModal from "./modal/MenuStatusModal";
import { NewLatestData } from "../../components/mockData/NewLatest/NewLatestData";

function OutStock() {
  const [selectedStatusMenu1, setSelectedStatusMenu1] = useState(null);
  const [selectedStatusMenu2, setSelectedStatusMenu2] = useState(null);
  const [showStatusMenu1, setShowStatusMenu1] = useState(false);
  const [showStatusMenu2, setShowStatusMenu2] = useState(false);
  const [isOpenEditModal, setIsOpenEditModal] = useState(false);
  const [selectedEditId, setSelectedEditId] = useState(null);
  const statusMenuRef1 = useRef(null);
  const statusMenuRef2 = useRef(null);

  const titles = [
    ...new Set(NewLatestData.map((item) => item.Order.Table.title)),
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        statusMenuRef1.current &&
        !statusMenuRef1.current.contains(event.target) &&
        statusMenuRef2.current &&
        !statusMenuRef2.current.contains(event.target)
      ) {
        setShowStatusMenu1(false);
        setShowStatusMenu2(false);
      }
    };

    if (showStatusMenu1 || showStatusMenu2) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showStatusMenu1, showStatusMenu2]);

  useEffect(() => {
    if (selectedStatusMenu1 === null) {
      setShowStatusMenu1(false);
    }
    if (selectedStatusMenu2 === null) {
      setShowStatusMenu2(false);
    }
  }, [selectedStatusMenu1, selectedStatusMenu2]);

  const handleEditClick = (id) => {
    setSelectedEditId(id);
    setIsOpenEditModal(true);
  };

  const closeModal = () => {
    setIsOpenEditModal(false);
  };

  return (
    <>
      <MenuStatusModal
        isOpenEditModal={isOpenEditModal}
        closeModal={closeModal}
        selectedEditId={selectedEditId}
        handleEditClick={handleEditClick}
      />
      <div className="flex md:flex-row flex-col md:items-center items-start justify-between gap-4 w-full">
        <div className="flex items-center gap-2">
          <EventAvailableOutlinedIcon
            sx={{ fontSize: 27 }}
            className="text-[#00537B]"
          />
          <p className="text-[25px] font-[600] text-[#00537B]">สถานะเมนู</p>
        </div>
        <div className="flex items-center max-md:w-full max-2xl:justify-end gap-6">
          <div className="relative" ref={statusMenuRef1}>
            <div className="flex flex-shrink-0 gap-2 items-center">
              <p className="text-[#313131] xl:text-xl text-base font-[600] flex-shrink-0">
                สถานะ
              </p>
              <div
                className="bg-white cursor-pointer flex justify-between items-center gap-2 py-1.5 px-2 rounded-lg shadow w-[180px] max-w-full"
                onClick={() => {
                  setShowStatusMenu1(!showStatusMenu1);
                  setSelectedStatusMenu2(null);
                }}
              >
                <p className="text-[#313131] xl:text-lg text-base font-[400]">
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
                  className={`lg:w-[30px] w-[25px] lg:h-[30px] h-[25px] transition-all duration-300 ${
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
                  <div
                    className={`py-2 px-4 cursor-pointer hover:bg-[#00537B] hover:text-white text-black rounded-lg ${
                      selectedStatusMenu1 === null
                        ? "bg-[#F5A100] text-white"
                        : ""
                    }`}
                    onClick={() => {
                      setSelectedStatusMenu1(null);
                      setShowStatusMenu1(false);
                    }}
                  >
                    ทั้งหมด
                  </div>
                  <div className="border-t border-[#e6e6e6] rounded-full w-full"></div>

                  {[
                    { id: "1", label: "กำลังทำ" },
                    { id: "2", label: "รอเสริฟ" },
                    { id: "3", label: "เสริฟเรียบร้อย" },
                    { id: "4", label: "ยกเลิก" },
                    { id: "5", label: "สินค้าหมด" },
                  ].map(({ id, label }) => (
                    <div
                      key={id}
                      className={`py-2 px-4 cursor-pointer hover:bg-[#00537B] hover:text-white text-black rounded-lg ${
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

          <div className="relative" ref={statusMenuRef2}>
            <div className="flex flex-shrink-0 gap-2 items-center">
              <p className="text-[#313131] xl:text-xl text-base font-[600] flex-shrink-0">
                โต๊ะ
              </p>
              <div
                className="bg-white cursor-pointer flex justify-between items-center gap-2 py-1.5 px-2 rounded-lg shadow w-[180px] max-w-full"
                onClick={() => {
                  setShowStatusMenu2(!showStatusMenu2);
                  setSelectedStatusMenu1(null);
                }}
              >
                <p className="text-[#313131] xl:text-lg text-base font-[400]">
                  {selectedStatusMenu2
                    ? titles.map((title) => (
                        <span key={title}>
                          {selectedStatusMenu2 === title ? title : null}
                        </span>
                      ))
                    : "เลือกโต๊ะ"}
                </p>

                <figure
                  className={`lg:w-[30px] w-[25px] lg:h-[30px] h-[25px] transition-all duration-300 ${
                    !showStatusMenu2 ? "" : "rotate-180"
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
              {showStatusMenu2 && (
                <div className="h-[305px] overflow-y-auto bg-white flex flex-col gap-2 p-2 mt-2 rounded-lg shadow">
                  <div
                    className={` py-2 px-4 cursor-pointer hover:bg-[#00537B] hover:text-white text-black rounded-lg ${
                      selectedStatusMenu2 === null
                        ? "bg-[#F5A100] text-white"
                        : ""
                    }`}
                    onClick={() => {
                      setSelectedStatusMenu2(null);
                      setShowStatusMenu2(false);
                    }}
                  >
                    ทั้งหมด
                  </div>
                  <div className="border-t border-[#e6e6e6] rounded-full w-full"></div>

                  {titles.map((title, index) => (
                    <div
                      key={index}
                      className={`py-2 px-4 cursor-pointer hover:bg-[#00537B] hover:text-white text-black rounded-lg ${
                        selectedStatusMenu2 === title
                          ? "bg-[#F5A100] text-white"
                          : ""
                      }`}
                      onClick={() => {
                        setSelectedStatusMenu2(title);
                        setShowStatusMenu2(false);
                      }}
                    >
                      {title}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <TableMenuStatus
        selectedStatusMenu1={selectedStatusMenu1}
        selectedStatusMenu2={selectedStatusMenu2}
        isOpenEditModal={isOpenEditModal}
        closeModal={closeModal}
        selectedEditId={selectedEditId}
        handleEditClick={handleEditClick}
      />
    </>
  );
}

export default OutStock;
