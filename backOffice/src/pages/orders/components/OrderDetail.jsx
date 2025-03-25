import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import dayjs from "dayjs";
import "dayjs/locale/th"; // ใช้ภาษาไทย
import Swal from "sweetalert2";
import OrderDetail_Print from "./OrderDetail_Print";
import OrderDetail_Print_A4 from "./OrderDetail_Print_A4";
import Receipt_Print from "../../../components/Receipt/Receipt_Print ";
import Receipt_Print_A4 from "../../../components/Receipt/Receipt_Print _A4";

function OrderDetail({ onClickClose, selectedRow }) {
  dayjs.locale("th");
  const [detailData, setDetailData] = useState(selectedRow);
  const [tax, setTaxTotal] = useState(7);
  const [serviceCharge, setServiceCharge] = useState(5);
  const [height, setHeight] = useState(window.innerHeight);
  const [showPdfContent, setShowPdfContent] = useState(false);
  const [showPdfContentA4, setShowPdfContentA4] = useState(false);
  const [showDetails, setShowDetails] = useState(true);
  const pdfRef = useRef();
  // console.log("detailData", detailData);

  useEffect(() => {
    const updateSize = () => setHeight(window.innerHeight);
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  let deduction = 420; // ค่าหักเริ่มต้นสำหรับหน้าจอขนาดเล็ก
  if (window.innerWidth >= 768) {
    deduction = 440;
  }
  if (tax > 0 && serviceCharge > 0 && detailData.order_note) {
    deduction = window.innerWidth >= 768 ? 650 : 420;
  } else if (tax > 0 && serviceCharge > 0) {
    deduction = window.innerWidth >= 768 ? 600 : 420;
  } else if (tax === 0 && serviceCharge === 0 && !detailData.order_note) {
    deduction = window.innerWidth >= 768 ? 600 : 420;
  } else {
    deduction = window.innerWidth >= 768 ? 600 : 420;
  }

  const reducedHeight = height - deduction;

  const formatNumber = (num) =>
    Number(num).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  const formattedDate = dayjs(detailData.createdAt).format("D MMMM YYYY");

  const groupedMenuDetails = useMemo(() => {
    const map = new Map();

    detailData.orderList
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
  }, [detailData.orderList]);

  // console.log("groupedMenuDetails", groupedMenuDetails);

  const { totalPrice, totalSpecialPrice, totalPriceAll } = detailData.orderList
    .filter((orderItem) => orderItem.status === "4" || orderItem.status === "5") // รวม status 5
    .reduce(
      (acc, orderItem) => {
        const foodItem = orderItem.food;
        if (foodItem) {
          const count = orderItem.amount || 1;
          const price = orderItem.status === "5" ? 0 : foodItem.price || 0; // ราคา 0 ถ้า status 5
          const specialPrice =
            orderItem.status === "5" ? 0 : foodItem.special_price || price;

          acc.totalPrice += price * count;
          acc.totalPriceAll += specialPrice * count;

          if (foodItem.special_price > 0 && orderItem.status !== "5") {
            acc.totalSpecialPrice += specialPrice * count;
          }
        }
        return acc;
      },
      { totalPrice: 0, totalSpecialPrice: 0, totalPriceAll: 0 }
    );

  const handleSavePDF = () => {
    setShowPdfContent(true);
  };
  const handleSavePrintA4 = () => {
    setShowPdfContentA4(true);
  };

  useEffect(() => {
    if (showPdfContent || showPdfContentA4) {
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
          title: "กำลังดาวน์โหลดใบเสร็จ",
        });
        if (showPdfContent) {
          Receipt_Print("print");
        }
        if (showPdfContentA4) {
          Receipt_Print_A4("print");
        }

        setTimeout(() => {
          setShowPdfContent(false);
        }, 500);
      }, 500);
    }
  }, [showPdfContent, showPdfContentA4]);

  // คำนวณผลรวม
  const totalDiscount = totalPrice - totalPriceAll; // ส่วนลดรวม
  const serviceChargeTotal = totalPriceAll * (serviceCharge / 100);
  const grandTotal = totalPriceAll + serviceChargeTotal;
  const taxTotal = grandTotal * (tax / 100);
  const Tatal = grandTotal + taxTotal;

  return (
    <>
      {onClickClose && (
        <div className="w-full flex xl:flex-row flex-col gap-4 h-full bg-[#FFEFC6]">
          <div className="w-full h-full rounded-lg shadow flex flex-col mx-auto border border-[#EEEEEE]">
            <div className="flex justify-between bg-[#00537B] py-3 lg:px-4 px-2 rounded-t-lg h-full">
              <div className="flex gap-4 items-center">
                <div className="bg-white rounded-lg p-2 w-[90px] h-[90px] flex gap-1 justify-center items-center flex-shrink-0 ">
                  <p className="text-xl text-[#00537B] font-[700] line-clamp-3 break-all">
                    {detailData.table}
                  </p>
                </div>
                <div className="flex flex-col">
                  <p className="xl:text-3xl lg:text-xl text-white font-[600]">
                    ชื่อร้าน
                  </p>
                  <p className="xl:text-xl lg:text-lg text-white font-[600]">
                    ที่อยู่ติดต่อ
                  </p>
                  <p className="xl:text-base text-sm text-white font-[600]">
                    เลขประจำตัวผู้เสียภาษี : 11111111121
                  </p>
                </div>
              </div>
              <div className="flex flex-col justify-between gap-2">
                <p className="xl:text-xl lg:text-lg text-right text-white font-[600] ">
                  เลขออเดอร์ : {detailData.order_number}
                </p>
                <p className="xl:text-base text-sm text-white text-right font-[600] ">
                  {formattedDate}
                </p>
              </div>
            </div>

            <div className="bg-white h-full rounded-b-lg flex flex-col ">
              {/* header */}
              <div className="bg-[#A9E8F9] py-1 px-4 flex justify-start w-full items-center gap-x-4">
                <p className="w-[55%] lg:text-base text-sm text-[#013D59] font-[500]">
                  รายการ
                </p>
                <p className="w-[10%] lg:text-base text-sm text-[#013D59] font-[500] text-center">
                  จำนวน
                </p>
                <p className="w-[30%] lg:text-base text-sm text-[#013D59] font-[500] text-right pr-4">
                  ราคา
                </p>
              </div>
              {/* header */}

              <div
                style={{ height: `calc(${reducedHeight}px)` }}
                className={`overflow-auto hide-scrollbar`}
              >
                {groupedMenuDetails.length > 0 ? (
                  groupedMenuDetails.map((item) => (
                    <div
                      key={item.id}
                      className="flex flex-col items-start py-1 px-4"
                    >
                      <div className="flex flex-row justify-between w-full items-end gap-4">
                        <p
                          className={`lg:text-base text-sm font-[500] line-clamp-1 w-[50%] ${
                            item.status === "5"
                              ? "line-through text-gray-500"
                              : ""
                          }`}
                        >
                          {item.name}
                        </p>

                        <p
                          className={`lg:text-base text-sm font-[500] line-clamp-1 text-center w-[10%] ${
                            item.status === "5"
                              ? "line-through text-gray-500"
                              : ""
                          }`}
                        >
                          {item.amount}
                        </p>

                        <div className="w-[30%] flex justify-between">
                          {item.status === "5" && (
                            <p
                              className={`lg:text-base text-sm font-[500] ${
                                item.status === "5" ? " text-gray-500" : ""
                              }`}
                            >
                              ยกเลิก
                            </p>
                          )}
                          <div className=" flex flex-col justify-end text-right flex-1">
                            {item.special_price > 0 && (
                              <p className="text-[12px] font-[300] line-through">
                                {formatNumber(item.price * item.amount)}
                              </p>
                            )}

                            <p
                              className={`lg:text-base text-sm font-[500] ${
                                item.status === "5"
                                  ? "line-through text-gray-500"
                                  : ""
                              }`}
                            >
                              {formatNumber(
                                (item.special_price || item.price) * item.amount
                              )}{" "}
                              ฿
                            </p>
                          </div>
                        </div>
                      </div>

                      <p className="text-[12px] font-[300] max-w-[50%] w-full">
                        {item.details}
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
                    {formatNumber(totalPriceAll)} ฿
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
              {detailData.order_note && (
                <div className="flex flex-row gap-2 justify-start items-start lg:py-2 py-1 px-4">
                  <p className="lg:text-base text-sm font-[400] flex-shrink-0">
                    หมายเหตุ :
                  </p>
                  <p className="lg:text-base text-sm font-[400] line-clamp-3">
                    {detailData.order_note}
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="xl:max-w-[20%] w-full flex xl:flex-col gap-4">
            <div
              onClick={handleSavePrintA4}
              className="bg-white hover:bg-[#F5A100] w-full xl:h-[200px] h-[90px] p-3 rounded-lg shadow cursor-pointer transition-all duration-200 ease-in-out flex flex-col justify-center items-center gap-2 group"
            >
              <figure className="xl:w-[80px] xl:h-[80px] w-[40px] h-[40px]">
                <img
                  src="/icons/ic_baseline-print.svg"
                  alt=""
                  className="w-full h-full group-hover:filter group-hover:invert group-hover:brightness-0"
                />
              </figure>
              <p className="group-hover:text-white text-[#313131] text-2xl font-[600]">
                พิมพ์ใบเสร็จA4
              </p>
            </div>
            <div
              onClick={handleSavePDF}
              className="bg-white hover:bg-[#F5A100] w-full xl:h-[200px] h-[90px] p-3 rounded-lg shadow cursor-pointer transition-all duration-200 ease-in-out flex flex-col justify-center items-center gap-2 group"
            >
              <figure className="xl:w-[80px] xl:h-[80px] w-[40px] h-[40px]">
                <img
                  src="/icons/ic_baseline-print.svg"
                  alt=""
                  className="w-full h-full group-hover:filter group-hover:invert group-hover:brightness-0"
                />
              </figure>
              <p className="group-hover:text-white text-[#313131] text-2xl font-[600]">
                พิมพ์ใบเสร็จ
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
          </div>
        </div>
      )}
      {showPdfContent && (
        <div style={{ position: "absolute", left: "-999999px" }}>
          <div ref={pdfRef}>
            <OrderDetail_Print
              detailData={detailData}
              groupedMenuDetails={groupedMenuDetails}
              serviceCharge={serviceCharge}
              tax={tax}
              formattedDate={formattedDate}
              formatNumber={formatNumber}
              totalPriceAll={totalPriceAll}
              totalDiscount={totalDiscount}
            />
          </div>
        </div>
      )}
      {showPdfContentA4 && (
        <div style={{ position: "absolute", left: "-999999px" }}>
          <div ref={pdfRef}>
            <OrderDetail_Print_A4
              detailData={detailData}
              groupedMenuDetails={groupedMenuDetails}
              serviceCharge={serviceCharge}
              tax={tax}
              formattedDate={formattedDate}
              formatNumber={formatNumber}
              totalPriceAll={totalPriceAll}
              totalDiscount={totalDiscount}
            />
          </div>
        </div>
      )}{" "}
      
    </>
  );
}

export default OrderDetail;
