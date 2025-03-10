import React, { useState, useEffect } from "react";
import InsertInvitationIcon from "@mui/icons-material/InsertInvitation";
import LibraryAddIcon from "@mui/icons-material/LibraryAdd";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import ReservationModal from "../modal/ReservationModal";
import OpenTable from "../modal/OpenTable";
import { CustomTable as CustomTableData } from "../../../components/mockData/CustomTable/CustomTable";

function Table({
  isSettingOpen,
  currentPage,
  rowsPerPage,
  handleTotalBillClick,
  isTotalBill,
}) {
  const [isReservation, setIsReservation] = useState(false);
  const [isCombineBill, setIsCombineBill] = useState();
  const [isOpenTable, setIsOpenTable] = useState(false);
  const [activeTable, setActiveTable] = useState(null);

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentTables = CustomTableData.slice(indexOfFirstRow, indexOfLastRow);

  const handleTableClick = (tableId) => {
    setActiveTable(activeTable === tableId ? null : tableId);
  };

  console.log("isTotalBill", isTotalBill);

  return (
    <>
      <ReservationModal
        isReservation={isReservation}
        closeModal={() => setIsReservation(false)}
      />
      <OpenTable
        isOpenTable={isOpenTable}
        closeModal={() => setIsOpenTable(false)}
      />

      <div className="min-w-[1100px] min-h-[683px] p-6 rounded-lg shadow-1 bg-white">
        {!isSettingOpen && (
          <div className="flex justify-end items-center gap-4 mb-8">
            <button
              onClick={() => setIsReservation(true)}
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
        )}

        <div className="grid grid-cols-6 gap-x-4 gap-y-10 w-full">
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
                onClick={() => handleTableClick(table.id)}
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
                      <p className="text-[#013D59] font-[500] text-[18px]">
                        โต๊ะ <br />
                        <span className="text-[26px]">{table.name_table}</span>
                      </p>
                      <button onClick={() => setIsOpenTable(true)}>
                        <AddCircleIcon
                          sx={{ fontSize: 25 }}
                          className="text-[#013D59] hover:text-green-500 cursor-pointer"
                        />
                      </button>
                    </div>
                  )}
                  {table.status === 2 && (
                    <p className="text-[#013D59] text-[18px] font-[500]">
                      บริการ
                    </p>
                  )}
                  {table.status === 3 && (
                    <div className="text-center">
                      <p className="text-[#013D59] font-[500] text-[18px]">
                        จอง <br />
                        <span className="text-[20px]">12.30 น.</span>
                      </p>
                      <button onClick={() => setIsOpenTable(true)}>
                        <AddCircleIcon
                          sx={{ fontSize: 25 }}
                          className="text-[#013D59] hover:text-[#FFD25B] mt-1.5 cursor-pointer"
                        />
                      </button>
                    </div>
                  )}
                  {table.status === 4 && (
                    <div className="text-center">
                      <p className="text-[#013D59] font-[500] text-[18px]">
                        ปิด
                      </p>
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
