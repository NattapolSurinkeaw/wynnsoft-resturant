import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { orderToday } from "../../components/mockData/orderToDay";
import dayjs from "dayjs";
import "dayjs/locale/th"; // ใช้ภาษาไทย
import Cash from "./components/Cash";
import QRcode from "./components/QRcode";
import Receipt from "./components/Receipt";
import Swal from "sweetalert2";
import Receipt_PDF from "../../components/Receipt/Receipt_PDF";

function DetailAll() {
  dayjs.locale("th");
  const { id } = useParams(); // ดึง `id` จาก URL
  const location = useLocation();
  const [tax, setTaxTotal] = useState(7);
  const [serviceCharge, setServiceCharge] = useState(5);
  const detailOrder = orderToday.find((item) => item.id === parseInt(id));
  const [height, setHeight] = useState(window.innerHeight);
  const [activeTab, setActiveTab] = useState("QRcode");
  const [showPdfContent, setShowPdfContent] = useState(false);
  const pdfRef = useRef();

  // console.log("detailOrder", detailOrder);

  useEffect(() => {
    const params = new URLSearchParams(location.search);

    const tab = params.get("tab") || "QRcode";
    setActiveTab(tab);
  }, [location.search]);

  useEffect(() => {
    const updateSize = () => setHeight(window.innerHeight);
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  let deduction = 420; // ค่าหักเริ่มต้นสำหรับหน้าจอขนาดเล็ก
  if (window.innerWidth >= 768) {
    deduction = 440;
  }
  if (tax > 0 && serviceCharge > 0 && detailOrder.order_note) {
    deduction = window.innerWidth >= 768 ? 500 : 420;
  } else if (tax > 0 && serviceCharge > 0) {
    deduction = window.innerWidth >= 768 ? 450 : 420;
  } else if (tax === 0 && serviceCharge === 0 && !detailOrder.order_note) {
    deduction = window.innerWidth >= 768 ? 450 : 420;
  } else {
    deduction = window.innerWidth >= 768 ? 450 : 420;
  }

  const reducedHeight = height - deduction;

  const formatNumber = (num) =>
    Number(num).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  const formattedDate = dayjs(detailOrder.createdAt).format("D MMMM YYYY");

  const groupedMenuDetails = useMemo(() => {
    const map = new Map();

    detailOrder.orderList
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
  }, [detailOrder.orderList]);

  // console.log("groupedMenuDetails", groupedMenuDetails);

  const { totalPrice, totalSpecialPrice, totalPriceAll } = detailOrder.orderList
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

        Receipt_PDF("print", today, order_number);

        // Hide the PDF content after generating the PDF
        setTimeout(() => {
          setShowPdfContent(false);
        }, 500); // Delay to ensure PDF is generated before hiding
      }, 500);
    }
  }, [showPdfContent]);
  const totalDiscount = totalPrice - totalPriceAll; // ส่วนลดรวม
  const serviceChargeTotal = totalPriceAll * (serviceCharge / 100);
  const grandTotal = totalPriceAll + serviceChargeTotal;
  const taxTotal = grandTotal * (tax / 100);
  const Tatal = grandTotal + taxTotal;

  return (
    <div className="flex gap-4">
      <div className="w-full h-full rounded-lg shadow flex flex-col mx-auto border border-[#EEEEEE]">
        <div className="flex justify-between bg-[#00537B] py-3 lg:px-4 px-2 rounded-t-lg h-full">
          <div className="flex gap-4 items-center">
            <div className="bg-white rounded-lg p-2 w-[90px] h-[90px] flex gap-1 justify-center items-center flex-shrink-0 ">
              <p className="text-xl text-[#00537B] font-[700] line-clamp-3 break-all">
                {detailOrder.table.title}
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
              หมายเลขออเดอร์ : {detailOrder.order_number}
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
                        item.status === "5" ? "line-through text-gray-500" : ""
                      }`}
                    >
                      {item.name}
                    </p>

                    <p
                      className={`lg:text-base text-sm font-[500] line-clamp-1 text-center w-[10%] ${
                        item.status === "5" ? "line-through text-gray-500" : ""
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
                <p className="lg:text-base text-sm font-[500]">ภาษี {tax}%</p>
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
          {detailOrder.order_note && (
            <div className="flex flex-row gap-2 justify-start items-start lg:py-2 py-1 px-4">
              <p className="lg:text-base text-sm font-[400] flex-shrink-0">
                หมายเหตุ :
              </p>
              <p className="lg:text-base text-sm font-[400] line-clamp-3">
                {detailOrder.order_note}
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="2xl:max-w-[500px] lg:max-w-[400px] max-w-[300px] w-full flex flex-col gap-4">
        <div className="w-full h-full bg-white p-4 rounded-lg flex flex-col gap-6">
          <div className="flex  lg:gap-4 gap-2 justify-between items-center">
            <Link
              to={`/payment/detail-all/${detailOrder.id}?tab=QRcode`}
              className={`group flex lg:flex-row flex-col justify-center items-center lg:gap-4 gap-2 lg:max-w-[50%] w-full rounded-2xl border border-[#D9D9D9] lg:p-3 py-3 cursor-pointer transition-all duration-200 ease-in-out hover:bg-[#013D59] ${
                activeTab === "QRcode"
                  ? "bg-[#013D59] text-white"
                  : "bg-white text-[#013D59]"
              }`}
            >
              <figure className="xl:w-[40px] xl:h-[40px] w-[30px] h-[30px]">
                <img
                  src="/icons/QR.svg"
                  alt=""
                  className={`w-full h-full group-hover:filter group-hover:invert group-hover:brightness-0 ${
                    activeTab === "QRcode" ? "filter invert brightness-0" : ""
                  }`}
                />
              </figure>
              <div
                className={`border-l-2 border-[#013D59] group-hover:border-white lg:h-[50px] lg:block hidden rounded-full ${
                  activeTab === "QRcode" ? "border-white" : ""
                }`}
              ></div>

              <p
                className={`2xl:text-2xl text-lg font-[500] text-[#013D59] group-hover:text-white ${
                  activeTab === "QRcode" ? "text-white" : ""
                }`}
              >
                เเสกน QR
              </p>
            </Link>

            <Link
              to={`/payment/detail-all/${detailOrder.id}?tab=Cash`}
              className={`group flex lg:flex-row flex-col justify-center items-center lg:gap-4 gap-2 lg:max-w-[50%] w-full rounded-2xl border border-[#D9D9D9] lg:p-3 py-3 cursor-pointer transition-all duration-200 ease-in-out hover:bg-[#013D59] ${
                activeTab === "Cash"
                  ? "bg-[#013D59] text-white"
                  : "bg-white text-[#013D59]"
              }`}
            >
              <figure className="xl:w-[40px] xl:h-[40px] w-[30px] h-[30px]">
                <img
                  src="/icons/Group 591.svg"
                  alt=""
                  className={`w-full h-full group-hover:filter group-hover:invert group-hover:brightness-0 ${
                    activeTab === "Cash" ? "filter invert brightness-0" : ""
                  }`}
                />
              </figure>
              <div
                className={`border-l-2 border-[#013D59] group-hover:border-white lg:h-[50px] lg:block hidden rounded-full ${
                  activeTab === "Cash" ? "border-white" : ""
                }`}
              ></div>

              <p
                className={`2xl:text-2xl text-lg font-[500] text-[#013D59] group-hover:text-white ${
                  activeTab === "Cash" ? "text-white" : ""
                }`}
              >
                ชำระเงินสด
              </p>
            </Link>
          </div>

          {activeTab === "QRcode" && <QRcode Tatal={Tatal} />}
          {activeTab === "Cash" && <Cash Tatal={Tatal} />}
        </div>

        <div className="flex gap-4 flex-wrap items-center justify-center">
          {activeTab === "QRcode" && (
            <div className="bg-[#FFBA41] p-1 px-2 rounded-lg flex gap-4 items-center justify-center 2xl:max-w-[220px] lg:max-w-[180px] max-w-[130px]  w-full cursor-pointer group hover:bg-[#FF6A00]">
              <figure className="xl:w-[40px] xl:h-[40px] w-[30px] h-[30px]">
                <img
                  src="/icons/Group 322.svg"
                  alt=""
                  className={`w-full h-full group-hover:filter group-hover:invert group-hover:brightness-0 `}
                />
              </figure>
              <div
                className={`border-l-2 border-[#313131] group-hover:border-white lg:h-[30px] h-[20px] rounded-full `}
              ></div>

              <p
                className={`2xl:text-2xl lg:text-lg font-[500] text-[#313131] group-hover:text-white`}
              >
                อัปสลิป
              </p>
            </div>
          )}
          {activeTab === "Cash" && (
            <div className="bg-[#FFBA41] p-1 px-2 rounded-lg flex gap-4 items-center justify-center 2xl:max-w-[220px] lg:max-w-[180px] max-w-[130px] w-full cursor-pointer group hover:bg-[#FF6A00]">
              <figure className="xl:w-[40px] xl:h-[40px] w-[30px] h-[30px]">
                <img
                  src="/icons/cash-money.svg"
                  alt=""
                  className={`w-full h-full group-hover:filter group-hover:invert group-hover:brightness-0 `}
                />
              </figure>
              <div
                className={`border-l-2 border-[#313131] group-hover:border-white lg:h-[30px] h-[20px] rounded-full `}
              ></div>

              <p
                className={`2xl:text-2xl lg:text-lg font-[500] text-[#313131] group-hover:text-white`}
              >
                ยืนยัน
              </p>
            </div>
          )}
          <div className="bg-[#FFBA41] p-1 px-2 rounded-lg flex gap-4 items-center justify-center 2xl:max-w-[220px] lg:max-w-[180px] max-w-[150px]  w-full cursor-pointer group hover:bg-[#FF6A00]">
            <figure className="xl:w-[40px] xl:h-[40px] w-[30px] h-[30px]">
              <img
                src="/icons/edit.svg"
                alt=""
                className={`w-full h-full group-hover:filter group-hover:invert group-hover:brightness-0 `}
              />
            </figure>
            <div
              className={`border-l-2 border-[#313131] group-hover:border-white lg:h-[30px] h-[20px]  rounded-full `}
            ></div>

            <p
              className={`2xl:text-2xl lg:text-lg font-[500] text-[#313131] group-hover:text-white`}
            >
              แก้ไขเมนู
            </p>
          </div>
          <div
            onClick={handleSavePDF}
            className="bg-[#013D59] hover:bg-[#FF6A00] p-1 px-2 rounded-lg flex gap-4 items-center justify-center 2xl:max-w-[220px] lg:max-w-[180px] max-w-[170px] w-full cursor-pointer group"
          >
            <figure className="xl:w-[40px] xl:h-[40px] w-[30px] h-[30px]">
              <img
                src="/icons/print.svg"
                alt=""
                className={`w-full h-full group-hover:filter group-hover:invert group-hover:brightness-0 `}
              />
            </figure>
            <div
              className={`border-l-2 border-white lg:h-[30px] h-[20px] rounded-full `}
            ></div>

            <p className={`2xl:text-2xl lg:text-lg font-[500] text-white`}>
              พิมพ์ใบเสร็จ
            </p>
          </div>
        </div>
      </div>

      {showPdfContent && (
        <div style={{ position: "absolute", left: "-999999px" }}>
          <div ref={pdfRef}>
            <Receipt />
          </div>
        </div>
      )}
    </div>
  );
}

export default DetailAll;
