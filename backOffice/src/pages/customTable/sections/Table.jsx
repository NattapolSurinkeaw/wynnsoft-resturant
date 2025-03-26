import React, { useState, useEffect } from "react";
import InsertInvitationIcon from "@mui/icons-material/InsertInvitation";
import LibraryAddIcon from "@mui/icons-material/LibraryAdd";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import ReservationModal from "../modal/ReservationModal";
import OpenTable from "../modal/OpenTable";
import { ViewTableData } from "../../../components/mockData/CustomTable/ViewTableData";

function Table({
  isSettingOpen,
  currentPage,
  rowsPerPage,
  handleTotalBillClick,
  isTotalBill,
  selectedTableId,
  setIsTotalBill,
  setIsFoodList,
  setIsAddTable,
  setIsEditTable,
  isEditTable,
  setSelectedTableId,
  customTable,
  setTableDetail,
  setRefresh,
  handleFoodListClick
}) {
  const [isReservation, setIsReservation] = useState(false);
  const [isOpenTable, setIsOpenTable] = useState(false);
  const [activeTable, setActiveTable] = useState(null);
  // console.log(ViewTableData)
  // console.log(customTable)

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentTables = customTable.slice(indexOfFirstRow, indexOfLastRow);

  const handleTableClick = (tableId) => {
    setActiveTable(activeTable === tableId ? null : tableId);
  };

  // console.log("isTotalBill", isTotalBill);

  return (
    <>
      <ReservationModal
        isReservation={isReservation}
        closeModal={() => setIsReservation(false)}
        customTable={customTable}
      />
      <OpenTable
        isOpenTable={isOpenTable}
        closeModal={() => setIsOpenTable(false)}
        selectedTableId={selectedTableId}
        setRefresh={setRefresh}
        handleFoodListClick={handleFoodListClick}
      />

      <div className="2xl:min-w-[1100px] min-w-full min-h-[683px] p-6 rounded-lg shadow-1 bg-white">
        {!isSettingOpen && (
          <div className="flex md:flex-row flex-col justify-between md:items-center items-end gap-4 mb-8">
            <div className="flex items-center">
              <div className="w-4 h-4 rounded-sm bg-[#D9D9D9]"></div>
              <p className="text-[#00537B] text-[16px] font-[500] ml-1">ว่าง</p>
              <div className="w-4 h-4 rounded-sm bg-[#FFD25B] ml-3"></div>
              <p className="text-[#00537B] text-[16px] font-[500] ml-1">
                กำลังบริการ
              </p>
              <div className="w-4 h-4 rounded-sm bg-[#39ACE3] ml-3"></div>
              <p className="text-[#00537B] text-[16px] font-[500] ml-1">
                จองแล้ว
              </p>
              <div className="w-4 h-4 rounded-sm bg-white border border-gray-300 ml-3"></div>
              <p className="text-[#00537B] text-[16px] font-[500] ml-1">
                ปิดใช้งาน
              </p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => {
                  setIsReservation(true);
                  setIsTotalBill(false);
                }}
                className={`flex items-center justify-center gap-2 xl:w-[130px] w-[120px] shadow-1 py-1.5 rounded-lg cursor-pointer hover:bg-[#F5A100] text-white text-[16px] duration-200 transition ${
                  isReservation ? "bg-[#F5A100]" : "bg-[#005179]"
                }`}
              >
                <InsertInvitationIcon
                  sx={{ fontSize: 23 }}
                  className="text-white"
                />
                จอง
              </button>
              <button
                onClick={handleTotalBillClick}
                className={`flex items-center justify-center gap-2 xl:w-[130px] w-[120px] shadow-1 py-1.5 rounded-lg cursor-pointer hover:bg-[#F5A100] text-white text-[16px] duration-200 transition ${
                  isTotalBill ? "bg-[#F5A100]" : "bg-[#005179]"
                }`}
              >
                <LibraryAddIcon sx={{ fontSize: 20 }} className="text-white" />
                รวมบิล
              </button>
            </div>
          </div>
        )}

        <div className="grid 2xl:grid-cols-6 lg:grid-cols-5 sm:grid-cols-4 grid-cols-3 gap-x-4 gap-y-10 w-full">
          {currentTables.map((table) => {
            let bgColor;
            switch (table.status) {
              case 1:
                bgColor = "#D9D9D9";
                break;
              case 2:
                bgColor = "#FFD25B";
                break;
              case 3:
                bgColor = "#4CC2FB";
                break;
              case 4:
                bgColor = "#FFFFFF";
                break;
              default:
                bgColor = "#FFFFFF";
            }

            return (
              <figure
                key={table.id}
                onClick={
                  !isSettingOpen && !isEditTable && !isTotalBill
                    ? () => {
                        setSelectedTableId(table.id);
                        handleTableClick(table.id);
                        setTableDetail(table);

                        // เช็คว่า table.status เป็น 2 หรือไม่
                        if (table.status === 2) {
                          setIsFoodList(true);
                        } else {
                          setIsFoodList(false);
                        }
                      }
                    : undefined
                }
                className="relative w-full h-[106px] cursor-pointer rounded-lg "
                style={{ backgroundColor: bgColor }}
              >
                {activeTable === table.id && (
                  <CheckBoxIcon
                    sx={{ fontSize: 25 }}
                    className="absolute top-1 right-8 text-green-400 "
                  />
                )}

                <img className="w-full h-full " src="/icons/table.png" alt="" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  {table.status === 1 && (
                    <div className="text-center">
                      <div className="text-[#013D59] font-[500] text-[18px]">
                        <span className="text-[20px]">{table.title}</span>
                      </div>
                      {!isSettingOpen && !isEditTable && !isTotalBill && (
                        <button onClick={() => setIsOpenTable(true)}>
                          <AddCircleIcon
                            sx={{ fontSize: 25 }}
                            className="text-[#013D59] hover:text-green-500 cursor-pointer"
                          />
                        </button>
                      )}
                    </div>
                  )}
                  {table.status === 2 && (
                    <div className="text-center text-[#013D59] text-[18px] font-[500]">
                      <span className="text-[20px]">{table.title} </span>
                      <br /> บริการ
                    </div>
                  )}
                  {table.status === 3 && (
                    <div className="text-center">
                      <div className="text-[#013D59] font-[500] text-[18px]">
                        {table.title} <br />
                        <div className="text-[18px]">
                          {table.bookings[0]?.time_booking?.slice(0, 5) ||
                            "ไม่ระบุ"}{" "}
                          น.
                        </div>
                      </div>
                      {!isSettingOpen && !isEditTable && !isTotalBill && (
                        <button onClick={() => setIsOpenTable(true)}>
                          <AddCircleIcon
                            sx={{ fontSize: 25 }}
                            className="text-[#013D59] hover:text-[#FFD25B] mt-1.5 cursor-pointer"
                          />
                        </button>
                      )}
                    </div>
                  )}
                  {table.status === 4 && (
                    <div className="text-center">
                      <div className="text-[#013D59] font-[500] text-[18px]">
                        <span className="text-[20px]">{table.title}</span>
                        <br />
                        ปิด
                      </div>
                    </div>
                  )}
                </div>
              </figure>
            );
          })}
        </div>
      </div>
    </>
  );
}

export default Table;
