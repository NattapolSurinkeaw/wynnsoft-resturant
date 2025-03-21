import React, { useRef } from "react";
import LocalPrintshopIcon from "@mui/icons-material/LocalPrintshop";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import { QRCodeCanvas } from "qrcode.react";
import { jsPDF } from "jspdf";

function QrCodeModal({ isOpen, closeModal, qrCode }) {
  const contentRef = useRef();
  if (!isOpen) return null;
  console.log(qrCode);

  const handlePrint = () => {
    const doc = new jsPDF("p", "mm", "a4"); // ใช้ A4 ขนาด
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
      doc.text(qrCodeText, pageWidth / 2, textY, { align: "center" }); // จัดข้อความให้ตรงกลางในแนวนอน

      // วาง QR Code ที่ตำแหน่งที่คำนวณไว้
      doc.addImage(qrCodeDataUrl, "PNG", x, y, qrCodeSize, qrCodeSize);

      doc.save("QRCode.pdf");
    }
  };

  return (
    <div
      onClick={closeModal}
      className="fixed inset-0 flex items-center justify-center bg-black/50 bg-opacity-50"
    >
      <div
        ref={contentRef}
        onClick={(e) => e.stopPropagation()}
        className=" relative bg-white p-6 rounded-lg shadow-lg w-auto max-w-[570px] max-h-screen"
      >
        <h2 className="text-xl font-semibold mb-4">QR Code</h2>
        <QRCodeCanvas size={343} value={qrCode} />
        <button
          onClick={closeModal}
          className=" absolute -top-8 -right-8 cursor-pointer"
        >
          <CancelOutlinedIcon
            sx={{ fontSize: 35 }}
            className="text-white hover:text-red-500"
          />
        </button>
        <button
          onClick={handlePrint}
          className="mx-auto mt-8 flex items-center justify-center gap-1 xl:w-[130px] w-[120px] shadow-md py-1.5 rounded-lg cursor-pointer text-white text-[16px] font-medium duration-300 transition-all bg-gradient-to-r from-[#FFD468] to-[#FFC107] hover:from-[#F5A100] hover:to-[#FF8C00] hover:shadow-xl hover:scale-105"
        >
          <LocalPrintshopIcon sx={{ fontSize: 23 }} className="text-white" />
          ปริ้น QR
        </button>
      </div>
    </div>
  );
}

export default QrCodeModal;
