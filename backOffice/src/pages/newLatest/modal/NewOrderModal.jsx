import React, { useState, useEffect, useRef } from "react";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import ScheduleOutlinedIcon from "@mui/icons-material/ScheduleOutlined";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import BorderColorOutlinedIcon from "@mui/icons-material/BorderColorOutlined";
import html2canvas from "html2canvas";
import Swal from "sweetalert2";
import { jsPDF } from "jspdf";
// import { NewLatestData } from "../../../components/mockData/NewLatest/NewLatestData";
// import { orderToday } from "../../../components/mockData/orderToDay";
import Receipt_Print from "../../../components/Receipt/Receipt_Print ";
import { api_path } from "../../../store/setting";
import { getUpdateStatusOrderList } from "../../../services/kitchen.service";

Receipt_Print;

function NewOrderModal({ isOpenNewOrderModal, closeModal, orderData }) {
  const [activeTab, setActiveTab] = useState(1);
  const [slcOrderCook, setSlcOrderCook] = useState([]);

  const printRef = useRef(null);
  const formatNumber = (num) => Number(num).toLocaleString("en-US");

  const fillterOrderData = orderData;
  // const fillterOrderData = orderToday.find((table) => table.id === orderData);

  console.log(fillterOrderData)

  useEffect(() => {
    setSlcOrderCook(orderData);
  }, [orderData])

  if (!isOpenNewOrderModal || !orderData) return null;

  const handleCloseModal = () => {
    setActiveTab(1);
    closeModal();
  };

  const handleTow = async () => {
    setActiveTab(3);

    setTimeout(() => {
      // handleExportPDF();
      Receipt_Print("print");

      setTimeout(() => {
        handleCloseModal();

        const params = {
          orderList : 
          [{
            id: fillterOrderData.id,
            status: 2
          }]
        }
        getUpdateStatusOrderList(params).then((res) => {
          console.log(res);
        })


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
                {fillterOrderData.food && (
                  <img
                    className="w-full h-full object-cover rounded-lg"
                    src={api_path + fillterOrderData.food.thumbnail_link}
                    alt={
                      fillterOrderData.food.name ||
                      "อาหาร"
                    }
                  />
                )}
              </figure>
              <div className="flex flex-col justify-between w-full">
                {fillterOrderData.food && (
                  <p className="text-[#313131] text-[22px] font-[600] line-clamp-2">
                    {fillterOrderData.food.name}
                  </p>
                )}
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
                  <div className="flex items-center gap-2 ">
                    <p className="text-[#00537B] text-[18px] font-[600]">
                      จำนวน
                    </p>
                    {fillterOrderData && (
                      <p className="flex justify-center items-center w-[70px] h-[40px] text-[#00537B] text-[26px] font-[600] bg-[#EEEEEE] p-1 border border-[#D9D9D9] rounded-lg">
                        {fillterOrderData.amount}
                      </p>
                    )}
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
          <div className="relative bg-white p-4 rounded-lg shadow-lg 2xl:w-[580px] w-[85%] ">
            <button
              onClick={handleCloseModal}
              className="absolute -top-8 -right-8 cursor-pointer"
            >
              <CancelOutlinedIcon
                sx={{ fontSize: 35 }}
                className="text-white hover:text-red-500"
              />
            </button>
            <div className="w-full h-[400px] px-2 overflow-y-auto">
              {slcOrderCook && (
                <div key={slcOrderCook.id}>
                  <div className="flex gap-4 w-full">
                    <figure className="min-w-[80px] h-[80px] shadow-md">
                      <img
                        className="w-full h-full object-cover rounded-lg"
                        src={api_path + slcOrderCook.food?.thumbnail_link}
                        alt={slcOrderCook?.food?.thumbnail_title || "อาหาร"}
                      />
                    </figure>
                    <div className="flex 2xl:flex-row flex-col w-full justify-between">
                      <div>
                        <p className="text-[18px] text-[#313131] font-[500]">
                          {slcOrderCook.food.name}
                        </p>
                        <p className="text-[16px] text-[#313131] font-[400]">
                          {slcOrderCook.note}
                        </p>
                      </div>
                      <div className="flex flex-col items-center justify-between">
                        <p className="text-[18px] text-[#313131] font-[400]">
                          {slcOrderCook?.amount}{" "}
                          <span className="ml-2">รายการ</span>
                        </p>
                        {/* <DeleteForeverIcon
                          sx={{ fontSize: 32 }}
                          className="text-red-500 hover:text-red-800 cursor-pointer"
                        /> */}
                      </div>
                    </div>
                  </div>
                  <div className="border-t border-[#8F8F8F]/50 my-3"></div>
                </div>
              )}
            </div>
            <div className="flex justify-center space-x-5 mt-7">
              {/* <button
                onClick={handleOpenModal}
                className="w-[137px] py-1.5 bg-[#F5A100] hover:bg-[#ffa600] hover:scale-105 transition duration-300 text-white rounded-lg cursor-pointer shadow-1"
              >
                เพิ่มรายการ
              </button> */}
              <button
                onClick={handleTow}
                className="w-[137px] py-1.5 bg-[#013D59] hover:bg-[#004b6e] hover:scale-105 transition duration-300 text-white rounded-lg cursor-pointer shadow-1"
              >
                ยืนยันพิมพ์
              </button>
            </div>

            {/* ✅ แก้เงื่อนไขให้ถูกต้อง
            {isOpen && (
              <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-20">
                <div className="relative bg-white p-8 rounded-lg shadow-lg w-[480px]">
                  <div className="flex w-full items-center gap-2">
                    <BorderColorOutlinedIcon
                      sx={{ fontSize: 25 }}
                      className="text-[#00537B]"
                    />
                    <p className="text-[25px] font-[600] text-[#00537B]">
                      เพิ่มรายการอาหาร
                    </p>
                  </div>
                  <div className="w-full space-y-3 mt-6">
                    <div className="flex items-center">
                      <p className="min-w-[90px] text-[#313131] font-[400]">
                        Param
                      </p>
                      <input
                        type="text"
                        className="border border-gray-300 text-gray-600 text-[14px] font-[300] rounded-sm h-[37px] px-2 focus:outline-none focus:ring-2 focus:ring-[#6db8dd] w-full"
                        placeholder="กรอกชื่อ..."
                        disabled
                      />
                    </div>
                    <div className="flex items-center">
                      <p className="min-w-[90px] text-[#313131] font-[400]">
                        Title
                      </p>
                      <input
                        type="text"
                        className="border border-gray-300 text-gray-600 text-[14px] font-[300] rounded-sm h-[37px] px-2 focus:outline-none focus:ring-2 focus:ring-[#6db8dd] w-full"
                        placeholder="กรอกอีเมล..."
                        disabled
                      />
                    </div>
                    <div className="flex items-center">
                      <p className="min-w-[90px] text-[#313131] font-[400]">
                        Value
                      </p>
                      <input
                        type="text"
                        className="border border-gray-300 text-gray-600 text-[14px] font-[300] rounded-sm h-[37px] px-2 focus:outline-none focus:ring-2 focus:ring-[#6db8dd] w-full"
                        placeholder="0"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end space-x-3 mt-8">
                    <button
                      onClick={closeModalAddOrder}
                      className="button-cancel-1"
                    >
                      ยกเลิก
                    </button>
                    <button className="button-save-1">บันทึก</button>
                  </div>
                </div>
              </div>
            )} */}
          </div>
        )}

        {/* Tab 3 */}
        {activeTab === 3 && (
          <div
            id="print"
            ref={printRef}
            className=" relative bg-white py-3 pl-3 pr-8 shadow-lg w-[316px] "
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
              {fillterOrderData?.table?.title}
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

            {fillterOrderData && (
              <div>
                <div className="flex justify-between">
                  <p className="w-[220px] text-black text-[16px] font-[500] mt-3">
                    {fillterOrderData.food.name}
                  </p>
                  <p className="text-black text-[16px] font-[500] mt-4">
                    {formatNumber(fillterOrderData.food.price)}
                  </p>
                </div>
                <p className="text-black text-[15px] font-[500] mt-1 underline decoration-1">
                  หมายเหตุ
                </p>
                <p className="text-black text-[15px] font-[300]">
                  {fillterOrderData.note}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    )
  );
}

export default NewOrderModal;
