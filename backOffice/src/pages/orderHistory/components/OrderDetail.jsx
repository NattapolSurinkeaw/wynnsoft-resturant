import React, { useEffect, useMemo, useRef, useState } from "react";
import dayjs from "dayjs";
import "dayjs/locale/th"; // ใช้ภาษาไทย
import SaveAsPDF from "../../../components/SaveAsPDF_Order/SaveAsPDF_OrderDetail";
import OrderDetail_PDF from "./OrderDetail_PDF";
import Swal from "sweetalert2";

function OrderDetail({ onClickClose, selectedRow }) {
  dayjs.locale("th");
  const [detailData, setDetailData] = useState(selectedRow);
  const [tax, setTaxTotal] = useState(7);
  const [serviceCharge, setServiceCharge] = useState(5);
  const [showPdfContent, setShowPdfContent] = useState(false);
  const [showDetails, setShowDetails] = useState(true);
  const pdfRef = useRef();

  const formatNumber = (num) =>
    Number(num).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  const groupedMenuDetails = useMemo(() => {
    const map = new Map();

    detailData?.orderList
      .filter((item) => item.status === "4" || item.status === "5")
      .forEach((item) => {
        const key = item.food.name;
        if (map.has(key)) {
          const existingItem = map.get(key);
          existingItem.amount += item.amount;
          existingItem.statusList.add(item.status); // เก็บค่า status เป็น Set
        } else {
          map.set(key, {
            ...item.food,
            amount: item.amount,
            price: item.status === "5" ? 0 : item.food.price, // ราคา 0 ถ้าเป็น status 5
            special_price: item.status === "5" ? 0 : item.food.special_price,
            statusList: new Set([item.status]), // เก็บ status ในรูปแบบ Set
          });
        }
      });

    return Array.from(map.values()).map((item) => ({
      ...item,
      status: Array.from(item.statusList).join(", "), // แปลง Set เป็น string
    }));
  }, [detailData?.orderList]);

  console.log("groupedMenuDetails", groupedMenuDetails);

  // คำนวณผลรวม
  const totalDiscount = detailData.totalPrice - detailData.totalPriceAll; // ส่วนลดรวม
  const serviceChargeTotal = detailData.totalPriceAll * (serviceCharge / 100);
  const grandTotal = detailData.totalPriceAll + serviceChargeTotal;
  const taxTotal = grandTotal * (tax / 100);
  const Tatal = grandTotal + taxTotal;

  const handleSavePDF = () => {
    setShowPdfContent(true); // แสดงเนื้อหาชั่วคราวเพื่อให้จับภาพได้
  };

  useEffect(() => {
    if (showPdfContent) {
      const date = new Date();
      const today = date.toLocaleDateString("en-GB", {
        month: "numeric",
        day: "numeric",
        year: "numeric",
      });

      const order_number = detailData.order_number;

      setTimeout(() => {
        onClickClose(false);

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
          title: "กำลังดาวน์โหลด PDF",
        });

        SaveAsPDF("print", today, order_number);

        // Hide the PDF content after generating the PDF
        setTimeout(() => {
          setShowPdfContent(false);
        }, 500); // Delay to ensure PDF is generated before hiding
      }, 500);
    }
  }, [showPdfContent]);

  return (
    <>
      {onClickClose && (
        <div className="w-full flex xl:flex-row flex-col gap-4 h-full bg-[#FFEFC6]">
          <div className="w-full rounded-lg shadow flex flex-col mx-auto border border-[#EEEEEE]">
            <div className="flex justify-between bg-[#00537B] py-3 px-4 rounded-t-lg">
              <div className="flex gap-4 items-center">
                <div className="bg-white rounded-lg p-2 w-[90px] h-[90px] flex flex-col justify-center items-center ">
                  <p className="text-xl text-[#00537B] font-[700] line-clamp-3 break-all">
                    {detailData.table}
                  </p>
                </div>
                <div className="flex flex-col">
                  <p className="text-3xl text-white font-[600]">ชื่อร้าน</p>
                  <p className="text-xl text-white font-[600]">ที่อยู่ติดต่อ</p>
                  <p className="text-base text-white font-[600]">
                    เลขประจำตัวผู้เสียภาษี : 11111111121
                  </p>
                </div>
              </div>
              <div className="flex flex-col justify-between items-end h-full">
                <p className="text-xl text-white font-[600]">
                  เลขออเดอร์ : {detailData.order_number}
                </p>
                <p className="text-base text-white font-[600]">
                  {detailData.formattedDate}
                </p>
              </div>
            </div>

            <div className="bg-white h-full rounded-b-lg flex flex-col ">
              {/* header */}
              <div className="bg-[#A9E8F9] py-1 px-4 flex justify-start w-full items-center gap-x-4">
                <p className="w-[55%] lg:text-base text-sm text-[#013D59] font-[500]">
                  รายการ
                </p>
                <p className="w-[20%] lg:text-base text-sm text-[#013D59] font-[500] text-center">
                  จำนวน
                </p>
                <p className="w-[30%] lg:text-base text-sm text-[#013D59] font-[500] text-right pr-4">
                  ราคา
                </p>
              </div>
              {/* header */}

              <div className={`xl:h-[350px] h-[240px] overflow-y-auto`}>
                {groupedMenuDetails.length > 0 ? (
                  groupedMenuDetails.map((item) => (
                    <div
                      key={item.id}
                      className="flex flex-col items-start py-1 px-4"
                    >
                      <div className="flex flex-row justify-between w-full items-end gap-4">
                        <p className="lg:text-base text-sm font-[500] line-clamp-1 w-[50%]">
                          {item.name}
                        </p>

                        <p className="lg:text-base text-sm font-[500] text-center w-[20%]">
                          {item.count}
                        </p>

                        <div className="w-[30%] flex flex-col justify-end text-right flex-1">
                          {item.special_price > 0 && (
                            <p className="text-[12px] font-[300] line-through">
                              {formatNumber(item.price * item.amount)}
                            </p>
                          )}

                          <p className="lg:text-base text-sm font-[500]">
                            {/* ราคาที่ลดแล้ว คูณกับ จำนวน */}
                            {formatNumber(
                              (item.special_price || item.price) * item.amount
                            )}
                            ฿
                          </p>
                        </div>
                      </div>

                      <p className="text-[12px] font-[300] max-w-[50%] w-full">
                        {item.detail}
                      </p>
                    </div>
                  ))
                ) : (
                  <div>No menu details available</div>
                )}
              </div>

              <div className="flex flex-col gap-1 py-1 mx-4 ">
                <div className="border-t-2 border-[#CACACA] rounded-full"></div>
                <div className="flex justify-between">
                  <p className="lg:text-base text-sm font-[500]">ราคา</p>
                  <p className="lg:text-base text-sm font-[400]">
                    {formatNumber(detailData.totalPriceAll)} ฿
                  </p>
                </div>
                <div className="flex justify-between">
                  <p className="lg:text-base text-sm font-[500]">ส่วนลด</p>
                  <p className="lg:text-base text-sm font-[400]">
                    -{formatNumber(totalDiscount)} ฿
                  </p>
                </div>

                {tax !== 0 && (
                  <div className="flex justify-between">
                    <p className="lg:text-base text-sm font-[500]">
                      ภาษี {tax}%
                    </p>
                    <p className="lg:text-base text-sm font-[400]">
                      {formatNumber(taxTotal)} ฿
                    </p>
                  </div>
                )}

                {serviceCharge !== 0 && (
                  <div className="flex justify-between">
                    <p className="lg:text-base text-sm font-[500]">
                      Service charge {serviceCharge}%
                    </p>
                    <p className="lg:text-base text-sm font-[400]">
                      {formatNumber(serviceChargeTotal)} ฿
                    </p>
                  </div>
                )}

                <div className="border-t-2 border-[#CACACA] border-dashed"></div>
              </div>

              <div className="flex flex-row gap-2 justify-end items-center w-full py-2 px-4">
                <p className="lg:text-2xl text-xl font-[700]">ยอดทั้งหมด</p>
                <p className="lg:text-2xl text-xl font-[700]">
                  {formatNumber(Tatal)} ฿
                </p>
              </div>
              {detailData.note && (
                <div className="flex flex-row gap-2 justify-start items-start lg:py-2 py-1 px-4">
                  <p className="lg:text-base text-sm font-[400] flex-shrink-0">
                    หมายเหตุ :{" "}
                  </p>
                  <p className="lg:text-base text-sm font-[400] line-clamp-4">
                    {detailData.note}
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="xl:max-w-[20%] w-full flex xl:flex-col gap-4">
            <div
              onClick={handleSavePDF}
              className="bg-white hover:bg-[#F5A100] w-full xl:h-[200px] h-[90px] p-3 rounded-lg shadow cursor-pointer transition-all duration-200 ease-in-out flex flex-col justify-center items-center gap-2 group"
            >
              <figure className="xl:w-[80px] xl:h-[80px] w-[40px] h-[40px]">
                <img
                  src="/icons/downloadO.png"
                  alt=""
                  className="w-full h-full group-hover:filter group-hover:invert group-hover:brightness-0"
                />
              </figure>
              <p className="group-hover:text-white text-[#313131] text-2xl font-[600]">
                ดาวน์โหลด PDF
              </p>
            </div>

            <div
              onClick={() => {
                onClickClose(false);
              }}
              className="bg-white hover:bg-[#F5A100] w-full xl:h-[200px] h-[90px] p-3 rounded-lg shadow cursor-pointer transition-all duration-200 ease-in-out flex flex-col justify-center items-center gap-2 group"
            >
              <figure className="xl:w-[80px] xl:h-[80px] w-[40px] h-[40px]">
                <img
                  src="/icons/solid_back.png"
                  alt=""
                  className="w-full h-full group-hover:filter group-hover:invert group-hover:brightness-0"
                />
              </figure>
              <p className="group-hover:text-white text-[#313131] text-2xl font-[600]">
                กลับหน้าหลัก
              </p>
            </div>

            <div className="bg-white hover:bg-[#F5A100] w-full xl:h-[200px] h-[90px] p-3 rounded-lg shadow cursor-pointer transition-all duration-200 ease-in-out flex flex-col justify-center items-center gap-2 group">
              <figure className="xl:w-[80px] xl:h-[80px] w-[40px] h-[40px]">
                <img
                  src="/icons/delete-32.png"
                  alt=""
                  className="w-full h-full group-hover:filter group-hover:invert group-hover:brightness-0"
                />
              </figure>

              <p className="group-hover:text-white text-[#313131] text-2xl font-[600]">
                ลบรายการ
              </p>
            </div>
          </div>
        </div>
      )}

      {showPdfContent && (
        <div style={{ position: "absolute", left: "-999999px" }}>
          <div ref={pdfRef}>
            <OrderDetail_PDF
              detailData={detailData}
              groupedMenuDetails={groupedMenuDetails}
              tax={tax}
              serviceCharge={serviceCharge}
            />
          </div>
        </div>
      )}
    </>
  );
}

export default OrderDetail;
