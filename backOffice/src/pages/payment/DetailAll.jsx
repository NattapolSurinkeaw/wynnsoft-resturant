import React, { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { orderToday } from "../../components/mockData/orderToDay";
import dayjs from "dayjs";
import "dayjs/locale/th"; // ใช้ภาษาไทย

function DetailAll() {
  dayjs.locale("th");
  const { id } = useParams(); // ดึง `id` จาก URL
  const [tax, setTaxTotal] = useState(7);
  const [serviceCharge, setServiceCharge] = useState(5);
  const detailOrder = orderToday.find((item) => item.id === parseInt(id));
  const [height, setHeight] = useState(window.innerHeight);

  useEffect(() => {
    const updateSize = () => setHeight(window.innerHeight);
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  const reducedHeight =
  tax === 0 && serviceCharge === 0
    ? window.innerWidth >= 768
      ? height - 440
      : height - 420
    : tax > 0 && serviceCharge > 0
    ? window.innerWidth >= 768
      ? height - 500
      : height - 420
    : window.innerWidth >= 768
    ? height - 460
    : height - 420;


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

  console.log("groupedMenuDetails", groupedMenuDetails);

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

  const totalDiscount = totalPrice - totalPriceAll; // ส่วนลดรวม
  const serviceChargeTotal = totalPriceAll * (serviceCharge / 100);
  const grandTotal = totalPriceAll + serviceChargeTotal;
  const taxTotal = grandTotal * (tax / 100);
  const Tatal = grandTotal + taxTotal;
  return (
    <div className="flex gap-4">
      <div className="w-full h-full rounded-lg shadow flex flex-col mx-auto border border-[#EEEEEE]">
        <div className="flex justify-between bg-[#00537B] py-3 px-4 rounded-t-lg">
          <div className="flex gap-4 items-center">
            <div className="bg-white rounded-lg p-2 w-[90px] h-[90px] flex flex-col justify-center items-center ">
              <p className="text-xl text-[#00537B] font-[600]">โต๊ะ</p>
              <p className="text-6xl text-[#00537B] font-[700]">
                {detailOrder.table.title}
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
              หมายเลขออเดอร์ : {detailOrder.order_number}
            </p>
            <p className="text-base text-white font-[600]">{formattedDate}</p>
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
                หมายเหตุ :{" "}
              </p>
              <p className="lg:text-base text-sm font-[400] line-clamp-4">
                {detailOrder.order_note}
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="xl:max-w-[500px] w-full h-full flex xl:flex-col gap-4"></div>
    </div>
  );
}

export default DetailAll;
