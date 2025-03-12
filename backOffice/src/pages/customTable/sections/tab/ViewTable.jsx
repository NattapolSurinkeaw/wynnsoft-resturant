import React, { useState, useEffect, useRef } from "react";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import LocalPrintshopIcon from "@mui/icons-material/LocalPrintshop";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import AddCardOutlinedIcon from "@mui/icons-material/AddCardOutlined";
import BookingModal from "../../modal/BookingModal";
import { QRCodeCanvas } from "qrcode.react";
import { ViewTableData } from "../../../../components/mockData/CustomTable/ViewTableData";
import { jsPDF } from "jspdf"; // Import jsPDF

function ViewTable({ handleEditClick, selectedTableId, setSelectedTableId }) {
  const [tableDetails, setTableDetails] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const contentRef = useRef();

  useEffect(() => {
    if (!selectedTableId && ViewTableData.length > 0) {
      setSelectedTableId(ViewTableData[0].id);
    }
  }, [selectedTableId, setSelectedTableId]);

  useEffect(() => {
    if (selectedTableId) {
      const table = ViewTableData.find((table) => table.id === selectedTableId);
      if (table) {
        setTableDetails(table);
      } else {
        console.log("ไม่พบข้อมูลโต๊ะที่มี id:", selectedTableId);
      }
    }
  }, [selectedTableId]);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handlePrint = () => {
    const doc = new jsPDF('p', 'mm', 'a4'); // ใช้ A4 ขนาด
    const qrCodeCanvas = contentRef.current.querySelector("canvas");
  
    if (qrCodeCanvas) {
      const qrCodeDataUrl = qrCodeCanvas.toDataURL();
      const pageWidth = doc.internal.pageSize.width; // ความกว้างของหน้า
      const pageHeight = doc.internal.pageSize.height; // ความสูงของหน้า
      const qrCodeSize = 150; // ขนาด QR Code ที่คุณต้องการ (ปรับตามต้องการ)
      const qrCodeText = "Scan this QR Code"; // ข้อความที่จะแสดงบนหัว QR Code
  
      // คำนวณตำแหน่งให้อยู่กลาง
      const x = (pageWidth - qrCodeSize) / 2; // คำนวณตำแหน่ง X ของ QR Code
      const y = (pageHeight - qrCodeSize) / 2; // คำนวณตำแหน่ง Y ของ QR Code
  
      // คำนวณตำแหน่ง Y สำหรับข้อความให้อยู่ด้านบนของ QR Code
      const textY = y - 16; // ขยับข้อความขึ้นจาก QR Code เล็กน้อย
  
      // เพิ่มข้อความที่หัว QR Code
      doc.setFontSize(35); // ขนาดตัวอักษร
      doc.text(qrCodeText, pageWidth / 2, textY, { align: 'center' }); // จัดข้อความให้ตรงกลางในแนวนอน
  
      // วาง QR Code ที่ตำแหน่งที่คำนวณไว้
      doc.addImage(qrCodeDataUrl, "PNG", x, y, qrCodeSize, qrCodeSize); 
  
      doc.save("QRCode.pdf");
    }
  };

  return (
    <>
      <BookingModal isOpen={isModalOpen} onClose={handleCloseModal} />
      {tableDetails ? (
        <div className=" relative 2xl:w-full md:w-[500px] w-full mx-auto h-[683px] p-6 bg-white shadow-1 rounded-lg overflow-hidden">
          {tableDetails && tableDetails.status === 3 && (
            <div className=" absolute top-3 -left-7 flex justify-center items-center text-lg font-[600] -rotate-45 w-[120px] h-[30px] text-white bg-gradient-to-r from-[#4CC2FB] to-[#4CC2FB]">
              ติดจอง
            </div>
          )}
          <div className="flex justify-around items-center gap-6">
            <p className="text-[20px] text-[#313131] font-[500]">ชื่อ</p>
            <p className="text-[35px] text-[#313131] font-[700]">
              โต๊ะ {tableDetails.name_table}
            </p>
            <button onClick={handleEditClick}>
              <BorderColorIcon
                sx={{ fontSize: 25 }}
                className="text-[#313131] hover:text-[#F5A100] cursor-pointer"
              />
            </button>
          </div>
          <figure ref={contentRef} className="w-[360px] h-[360px] flex justify-center items-center mx-auto mt-6 border-6 border-[#D9D9D9]">
            <QRCodeCanvas size={343} value={tableDetails.qrcode} />
          </figure>
          <div className="border-t-2 border-gray-500 mt-8"></div>
          <div className="flex items-center justify-center mt-4">
            <p className="mr-2 text-[18px] text-[#313131] font-[500]">ลำดับ</p>
            <input
              type="number"
              className="mr-12 w-[100px] h-[35px] border border-gray-300 text-gray-600 text-[16px] font-[500] rounded-sm px-2 focus:outline-none focus:ring-2 focus:ring-[#6db8dd] bg-gray-200 cursor-not-allowed"
              placeholder="เลข..."
              value={tableDetails.priority}
              disabled
            />

            <p className="mr-2 text-[18px] text-[#313131] font-[500]">แสดงผล</p>
            <FormControlLabel
              className="px-2 py-3"
              control={
                <Switch
                  checked={tableDetails.status === 1}
                  disabled
                  sx={{
                    "& .MuiSwitch-switchBase.Mui-checked": {
                      color: "#39C526",
                    },
                    "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                      backgroundColor: "#39C526",
                    },
                  }}
                />
              }
            />
          </div>
          <div className="flex items-center justify-center gap-3">
            {tableDetails && tableDetails.status === 3 && (
              <button
                onClick={handleOpenModal}
                className="mt-4 flex items-center justify-center gap-1 xl:w-[130px] w-[120px] shadow-md py-1.5 rounded-lg cursor-pointer text-white text-[16px] font-medium duration-300 transition-all bg-gradient-to-r from-[#4CC2FB] to-[#4CC2FB] hover:from-[#4CC2FB] hover:to-[#4CC2FB] hover:shadow-xl hover:scale-105"
              >
                <AddCardOutlinedIcon
                  sx={{ fontSize: 23 }}
                  className="text-white"
                />
                รายระเอียด
              </button>
            )}
            <button onClick={handlePrint} className="mt-4 flex items-center justify-center gap-1 xl:w-[130px] w-[120px] shadow-md py-1.5 rounded-lg cursor-pointer text-white text-[16px] font-medium duration-300 transition-all bg-gradient-to-r from-[#FFD468] to-[#FFC107] hover:from-[#F5A100] hover:to-[#FF8C00] hover:shadow-xl hover:scale-105">
              <LocalPrintshopIcon
                sx={{ fontSize: 23 }}
                className="text-white"
              />
              ปริ้น QR
            </button>

            <button className="mt-4 flex items-center justify-center gap-1 xl:w-[130px] w-[120px] shadow-md py-1.5 rounded-lg cursor-pointer text-white text-[16px] font-medium duration-300 transition-all bg-gradient-to-r from-[#F44D4D] to-[#FF5E5E] hover:from-[#FF0A0A] hover:to-[#FF5252] hover:shadow-xl hover:scale-105">
              <DeleteForeverIcon sx={{ fontSize: 23 }} className="text-white" />
              ลบโต๊ะ
            </button>
          </div>
        </div>
      ) : (
        <p>กำลังโหลดข้อมูล...</p>
      )}
    </>
  );
}

export default ViewTable;
