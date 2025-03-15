import React, { useState, useEffect, useRef } from "react";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import ScheduleOutlinedIcon from "@mui/icons-material/ScheduleOutlined";
import html2canvas from "html2canvas";
import Swal from "sweetalert2";
import { jsPDF } from "jspdf";
import { NewLatestData } from "../../../components/mockData/NewLatest/NewLatestData";

function NewOrderModal({ isOpenNewOrderModal, closeModal, orderId }) {
  const [activeTab, setActiveTab] = useState(1);

  const printRef = useRef(null);

  const fillterOrderData = NewLatestData.find((table) => table.id === orderId);

  if (!isOpenNewOrderModal || !orderId) return null;

  console.log("orderId", orderId);

  const handleCloseModal = () => {
    setActiveTab(1);
    closeModal();
  };

  const handleTow = async () => {
    setActiveTab(3);

    setTimeout(() => {
      handleExportPDF();

      setTimeout(() => {
        handleCloseModal();

        const Toast = Swal.mixin({
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
          },
        });

        Toast.fire({
          icon: "success",
          title: "รับออเดอร์สำเร็จ",
        });
      }, 500);
    }, 500);
  };

  const handleExportPDF = async () => {
    if (!printRef.current) return;

    const canvas = await html2canvas(printRef.current, { scale: 10 });
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = pageWidth - 20; // ลดขอบ
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    if (imgHeight > pageHeight - 10) {
      pdf.addImage(
        imgData,
        "PNG",
        10,
        10,
        imgWidth,
        imgHeight,
        undefined,
        "FAST"
      );
      pdf.addPage();
    } else {
      pdf.addImage(
        imgData,
        "PNG",
        10,
        10,
        imgWidth,
        imgHeight,
        undefined,
        "FAST"
      );
    }

    pdf.save("Order.pdf");
  };

  return (
    isOpenNewOrderModal && (
      <div className="fixed inset-0 bg-black/60 bg-opacity-50 flex items-center justify-center z-20">
        {/* Tab 1 */}
        {activeTab === 1 && (
          <div className="relative bg-white p-4 rounded-lg shadow-lg w-[480px]">
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
                  src={fillterOrderData.thumbnail_link}
                  alt={fillterOrderData.details}
                />
              </figure>
              <div className="flex flex-col justify-between w-full">
                <p className="text-[#313131] text-[22px] font-[600] line-clamp-2">
                  {fillterOrderData.details}
                </p>
                <div className="flex justify-between">
                  <div className="flex items-center gap-1">
                    <ScheduleOutlinedIcon
                      sx={{ fontSize: 20 }}
                      className="text-[#8F8F8F]"
                    />
                    <p className="text-[#8F8F8F] text-[18px] font-[400]">
                      {new Date(fillterOrderData.createdAt).toLocaleTimeString(
                        "th-TH",
                        {
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )}{" "}
                      น.
                    </p>
                  </div>
                  <div className="flex items-center gap-4 ">
                    <p className="text-[#00537B] text-[18px] font-[600]">
                      จำนวน
                    </p>
                    <p className="text-[#00537B] text-[26px] font-[600]">
                      {fillterOrderData.amount}
                    </p>
                    <p className="text-[#00537B] text-[18px] font-[400]">
                      รายการ
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full text-[#313131] text-[16px] font-[400] h-[100px] bg-[#EEEEEE] rounded-md p-2 mt-6">
              {fillterOrderData.note}
            </div>

            <div className="flex justify-between space-x-3 mt-7">
              <button className="w-[137px] py-1.5 bg-[#F5A100] hover:bg-[#ffa600] hover:scale-105 transition duration-300 text-white rounded-lg cursor-pointer shadow-1">
                แจ้งพนักงาน
              </button>
              <button className="w-[137px] py-1.5 bg-[#F44D4D] hover:bg-[#ff0000] hover:scale-105 transition duration-300 text-white rounded-lg cursor-pointer shadow-1">
                สินค้าหมด
              </button>
              <button
                className="w-[137px] py-1.5 bg-[#013D59] hover:bg-[#004b6e] hover:scale-105 transition duration-300 text-white rounded-lg cursor-pointer shadow-1"
                onClick={() => setActiveTab(2)}
              >
                ยืนยัน
              </button>
            </div>
          </div>
        )}

        {/* Tab 2 */}
        {activeTab === 2 && (
          <div className="relative bg-white p-4 rounded-lg shadow-lg 2xl:w-[580px] w-[85%]">
            <button
              onClick={handleCloseModal}
              className="absolute -top-8 -right-8 cursor-pointer"
            >
              <CancelOutlinedIcon
                sx={{ fontSize: 35 }}
                className="text-white hover:text-red-500"
              />
            </button>

            <div className="flex gap-4 w-full">
              <figure className="max-w-[80px] h-[80px] shadow-md">
                <img
                  className="w-full h-full object-cover rounded-lg"
                  src="/images/66.jpg"
                  alt=""
                />
              </figure>
              <div className="flex 2xl:flex-row flex-col w-full justify-between">
                <div>
                  <p className="text-[18px] text-[#313131] font-[500]">
                    {fillterOrderData.details}
                  </p>
                  <p className="text-[16px] text-[#313131] font-[400]">
                    {fillterOrderData.note}
                  </p>
                </div>
                <p className="text-[18px] text-[#313131] font-[400]">
                  {fillterOrderData.amount} <span className="ml-2">รายการ</span>
                </p>
              </div>
            </div>

            <div className="border-t border-[#8F8F8F]/50 my-3"></div>

            <div className="flex justify-center space-x-5 mt-7">
              <button className="w-[137px] py-1.5 bg-[#F5A100] hover:bg-[#ffa600] hover:scale-105 transition duration-300 text-white rounded-lg cursor-pointer shadow-1">
                เพิ่มรายการ
              </button>
              <button
                onClick={handleTow}
                className="w-[137px] py-1.5 bg-[#013D59] hover:bg-[#004b6e] hover:scale-105 transition duration-300 text-white rounded-lg cursor-pointer shadow-1"
              >
                ยืนยันพิมพ์
              </button>
            </div>
          </div>
        )}

        {/* Tab 3 */}
        {activeTab === 3 && (
          <div
            ref={printRef}
            className=" relative bg-white p-2 shadow-lg w-[316px] "
          >
            <button
              onClick={handleCloseModal}
              className="absolute -top-8 -right-8 cursor-pointer"
            >
              <CancelOutlinedIcon
                sx={{ fontSize: 35 }}
                className="text-white hover:text-red-500"
              />
            </button>

            <img
              className="w-auto h-[50px]"
              src="/icons/โลโก้-Soju-Day-Final-1.png"
              alt=""
            />
            <p className="text-black text-[35px] font-[700] text-center">
              {fillterOrderData.Order.Table.title}
            </p>
            <div className="flex justify-between mt-4 mb-1">
              <p className="text-black text-[14px] font-[300] text-center">
                {new Date(fillterOrderData.createdAt).toLocaleDateString(
                  "th-TH",
                  {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  }
                )}
              </p>
              <p className="text-black text-[14px] font-[300] text-center">
                {new Date(fillterOrderData.createdAt).toLocaleTimeString(
                  "th-TH",
                  {
                    hour: "2-digit",
                    minute: "2-digit",
                  }
                )}{" "}
                น.
              </p>
            </div>

            <div className="mb-2">
              <div className="flex justify-between">
                <p className="w-[220px] text-black text-[16px] font-[500] mt-4">
                  {fillterOrderData.details}
                </p>
                <p className="text-black text-[16px] font-[500] mt-4">
                  {fillterOrderData.price}
                </p>
              </div>
              <p className="text-black text-[15px] font-[500] mt-1 underline decoration-1">
                หมายเหตุ
              </p>
              <p className="text-black text-[15px] font-[300]">
                {fillterOrderData.note}
              </p>
            </div>
            <div className="mb-2">
              <div className="flex justify-between">
                <p className="w-[220px] text-black text-[16px] font-[500] mt-4">
                  {fillterOrderData.details}
                </p>
                <p className="text-black text-[16px] font-[500] mt-4">
                  {fillterOrderData.price}
                </p>
              </div>
              <p className="text-black text-[15px] font-[500] mt-1 underline decoration-1">
                หมายเหตุ
              </p>
              <p className="text-black text-[15px] font-[300]">
                {fillterOrderData.note}
              </p>
            </div>
          </div>
        )}
      </div>
    )
  );
}

export default NewOrderModal;
