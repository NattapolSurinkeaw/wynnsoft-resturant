import React, { useState } from "react";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import InsertInvitationIcon from "@mui/icons-material/InsertInvitation";
import LibraryAddIcon from "@mui/icons-material/LibraryAdd";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { CustomTable } from "../../../components/mockData/CustomTable/CustomTable"; 

function Table({ isSettingOpen }) {
  const [isReservation, setIsReservation] = useState(false);
  const [isCombineBill, setIsCombineBill] = useState(false);

  // console.log(isReservation);

  const handleReservationClick = () => {
    setIsReservation(!isReservation);
    setIsCombineBill(false);
  };

  const handleCombineBillClick = () => {
    setIsCombineBill(!isCombineBill);
    setIsReservation(false);
  };

  return (
    <div className="min-w-[978px] p-6 rounded-lg shadow-1 bg-white">
      {!isSettingOpen && (
        <div className="flex justify-end items-center gap-4 mb-8">
          <button
            onClick={handleReservationClick}
            className={`flex items-center justify-center gap-2 xl:w-[130px] w-[120px] shadow-1 py-1.5 rounded-lg cursor-pointer text-white text-[16px] duration-200 transition ${
              isReservation ? "bg-[#F5A100]" : "bg-[#005179]"
            }`}
          >
            <InsertInvitationIcon
              sx={{ fontSize: 23 }}
              className="text-white"
            />
            {isReservation ? "ยกเลิก" : "จอง"}
          </button>
          <button
            onClick={handleCombineBillClick}
            className={`flex items-center justify-center gap-2 xl:w-[130px] w-[120px] shadow-1 py-1.5 rounded-lg cursor-pointer text-white text-[16px] duration-200 transition ${
              isCombineBill ? "bg-[#F5A100]" : "bg-[#005179]"
            }`}
          >
            <LibraryAddIcon sx={{ fontSize: 20 }} className="text-white" />
            {isCombineBill ? "ยกเลิก" : "รวมบิล"}
          </button>
        </div>
      )}

      <div className="grid grid-cols-5 gap-x-6 gap-y-10 w-full">
        {CustomTable.map((table) => {
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
              className="relative w-full h-[106px] "
              style={{ backgroundColor: bgColor }}
            >
              <img className="w-full h-full " src="/icons/table.png" alt="" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                {table.status === 1 && (
                  <div className="text-center">
                    <p className="text-[#013D59] font-[500] text-[18px]">
                      โต๊ะ <br />
                      <span className="text-[26px]">{table.name_table}</span>
                    </p>

                      <button>
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
                  </div>
                )}
                {table.status === 4 && (
                  <div className="text-center">
                    <p className="text-[#013D59] font-[500] text-[18px]">ปิด</p>
                  </div>
                )}
              </div>
            </figure>
          );
        })}
      </div>
    </div>
  );
}

export default Table;
