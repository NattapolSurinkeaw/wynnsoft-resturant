import React, { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { orderToday } from "../../../components/mockData/orderToDay";
import dayjs from "dayjs";
import "dayjs/locale/th"; // ใช้ภาษาไทย
import EditOrder from "./EditOrder";
import CancelIcon from "@mui/icons-material/Cancel";
import { Box, Modal } from "@mui/material";

function DetailOrderToday() {
  dayjs.locale("th");
  const { id } = useParams(); // ดึง `id` จาก URL
  const [tax, setTaxTotal] = useState(7);
  const [serviceCharge, setServiceCharge] = useState(5);
  const [openModal, setOpenModal] = useState(false);
  const menuOrder = orderToday.find((item) => item.id === parseInt(id));

  const formatNumber = (num) =>
    Number(num).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  console.log("Menu Order:", menuOrder.orderList);
  const formattedDate = dayjs(menuOrder.createdAt).format("D MMMM YYYY");

  const filteredOrderList = menuOrder
    ? menuOrder.orderList.filter((item) => item.status !== "4")
    : [];
    
  // console.log("filteredOrderList", filteredOrderList);

  const groupedMenuDetails = useMemo(() => {
    const grouped = menuOrder.orderList
      .filter((item) => item.status === "4") // กรองเฉพาะ status === "4"
      .reduce((acc, item) => {
        const existingItem = acc.find((menu) => menu.name === item.food.name);
        if (existingItem) {
          existingItem.amount += item.amount;
        } else {
          acc.push({ ...item.food, amount: item.amount });
        }
        return acc;
      }, []);
    return grouped;
  }, [menuOrder.orderList]);

  const { totalPrice, totalSpecialPrice, totalPriceAll } = menuOrder.orderList
    .filter((orderItem) => orderItem.status === "4") // กรองเฉพาะ status === "4"
    .reduce(
      (acc, orderItem) => {
        const foodItem = orderItem.food;
        if (foodItem) {
          const count = orderItem.amount || 1;
          const price = foodItem.price || 0;
          const specialPrice = foodItem.special_price || price;

          acc.totalPrice += price * count;
          acc.totalPriceAll += specialPrice * count;

          if (foodItem.special_price > 0) {
            acc.totalSpecialPrice += specialPrice * count;
          }
        }
        return acc;
      },
      { totalPrice: 0, totalSpecialPrice: 0, totalPriceAll: 0 }
    );

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const totalDiscount = totalPrice - totalPriceAll; // ส่วนลดรวม
  const serviceChargeTotal = totalPriceAll * (serviceCharge / 100);
  const grandTotal = totalPriceAll + serviceChargeTotal;
  const taxTotal = grandTotal * (tax / 100);
  const Tatal = grandTotal + taxTotal;

  return (
    <div className="flex xl:gap-4 gap-2 h-full">
      <div className="w-full h-full flex flex-col xl:gap-4 gap-2">
        <div className="w-full bg-white rounded-lg shadow py-4 flex flex-col gap-3 h-[520px]">
          <div className="flex w-full items-end gap-3 px-4 ">
            <p className="text-[#013D59] text-3xl font-bold w-full">
              กำลังปรุง
            </p>
            <p className="text-[#313131] text-lg text-center  w-[20%]">จำนวน</p>
            <div className="w-[30%] flex justify-end" onClick={handleOpenModal}>
              <button className="bg-[#013D59] hover:bg-[#FFBA41] xl:text-xl text-lg rounded-lg text-white max-w-[100px] w-full py-1 cursor-pointer ">
                เเก้ไข
              </button>
            </div>
          </div>
          {menuOrder.orderList.some((item) => item.status !== "4") && (
            <div className="flex flex-col overflow-auto hide-scrollbar">
              {menuOrder.orderList
                .filter((item) => item.status !== "4") // กรองเฉพาะออเดอร์ที่ยังไม่เสิร์ฟ
                .map((item, index) => (
                  <div
                    key={`${item.id}-${index}`}
                    className={`flex flex-col items-center px-4 py-2 ${
                      index % 2 === 0 ? "bg-[#EBFBFF]" : "bg-white"
                    }`}
                  >
                    <div className="flex flex-row justify-between w-full items-center gap-3">
                      <div className="flex gap-4 w-full items-center">
                        <figure className="2xl:w-[75px] 2xl:h-[75px] w-[70px] h-[60px] rounded-lg">
                          <img
                            src={item.food.thumbnail_link}
                            alt={item.food.name}
                            className="w-full h-full rounded-lg object-cover"
                          />
                        </figure>
                        <div className="flex flex-col justify-between gap-3 w-full">
                          <p className="lg:text-2xl text-lg text-[#313131] font-[500] line-clamp-2">
                            {item.food.name}
                          </p>
                          <p className="text-base font-[300] w-full line-clamp-2">
                            {item.food.details}
                          </p>
                        </div>
                      </div>

                      <p className="lg:text-2xl text-lg text-[#313131] font-[500] text-center items-center w-[20%]">
                        {item.amount}
                      </p>

                      <div className="w-[30%] flex flex-col justify-end text-right">
                        {item.food.special_price > 0 && (
                          <p className="text-base font-[300] line-through">
                            {formatNumber(item.food.price * item.amount)}
                          </p>
                        )}

                        <p className="lg:text-2xl text-lg text-[#313131] font-[600]">
                          {formatNumber(
                            (item.food.special_price || item.food.price) *
                              item.amount
                          )}{" "}
                          ฿
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>

        <div className="w-full bg-white rounded-lg shadow py-4 flex flex-col gap-3 h-[370px]">
          <div className="flex w-full items-end gap-3 px-4">
            <p className="text-[#013D59] text-3xl font-bold w-[90%]">
              เสริฟ์เรียบร้อย
            </p>
            <p className="text-[#313131] text-lg w-[40%]">จำนวน</p>
          </div>
          {menuOrder.orderList.some((item) => item.status === "4") && (
            <div className="flex flex-col gap-2 overflow-auto hide-scrollbar">
              {menuOrder.orderList
                .filter((item) => item.status === "4") // กรองเฉพาะออเดอร์ที่ยังไม่เสิร์ฟ
                .map((item, index) => (
                  <div
                    key={`${item.id}-${index}`}
                    className={`flex flex-col items-center px-4 py-2 ${
                      index % 2 === 0 ? "bg-[#EBFBFF]" : " bg-white"
                    }`}
                  >
                    <div className="flex flex-row justify-between w-full items-center gap-3">
                      <div className="flex gap-4 w-[90%] items-center">
                        <figure className="2xl:w-[75px] 2xl:h-[75px] w-[70px] h-[60px] rounded-lg">
                          <img
                            src={item.food.thumbnail_link}
                            alt={item.food.name}
                            className="w-full h-full rounded-lg object-cover"
                          />
                        </figure>
                        <div className="flex flex-col justify-between gap-3 w-full">
                          <p className="lg:text-2xl text-lg text-[#313131] font-[500] line-clamp-2">
                            {item.food.name}
                          </p>
                          <p className="text-base font-[300] w-full line-clamp-2">
                            {item.food.details}
                          </p>
                        </div>
                      </div>

                      <div className="flex justify-between items-center w-[40%]">
                        <p className="lg:text-2xl text-lg text-[#313131] font-[500] ml-4 text-left items-center w-[20%]">
                          {item.amount}
                        </p>

                        <div className="w-full flex flex-col justify-end text-right">
                          {item.food.special_price > 0 && (
                            <p className="text-base font-[300] line-through">
                              {formatNumber(item.food.price * item.amount)}
                            </p>
                          )}

                          <p className="lg:text-2xl text-lg text-[#313131] font-[600]">
                            {formatNumber(
                              (item.food.special_price || item.food.price) *
                                item.amount
                            )}{" "}
                            ฿
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>

      <div className="xl:max-w-[500px] max-w-[280px] w-full h-full flex flex-col gap-4">
        <div className="w-full h-full flex flex-col bg-white rounded-lg shadow">
          <div className="flex justify-between bg-[#00537B] py-3 px-4 rounded-t-lg">
            <div className="bg-white rounded-lg p-2 w-[90px] h-[90px] flex flex-col justify-center items-center flex-shrink-0 shadow">
              <p className="text-lg text-[#00537B] font-[600]">โต๊ะ</p>
              <p className="text-5xl text-[#00537B] font-[700]">
                {menuOrder.table.title}
              </p>
            </div>

            <div className="flex flex-col justify-between items-end text-right gap-3 h-full">
              <p className="xl:text-3xl text-xl text-white font-[600]">
                #{menuOrder.order_number}
              </p>
              <div className="flex flex-col gap-0.5 h-full">
                <p className="text-sm text-white font-[600] ">
                  {formattedDate}
                </p>
                <p className="text-sm text-white font-[600] ">
                  {filteredOrderList.length} ออเดอร์
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white h-full rounded-b-lg flex flex-col ">
            {/* header */}
            <div className="bg-[#A9E8F9] py-1 px-4 flex justify-start w-full items-center gap-x-4">
              <p className="w-[50%] lg:text-base text-sm text-[#013D59] font-[500]">
                รายการ
              </p>
              <p className="w-[20%] lg:text-base text-sm text-[#013D59] font-[500] text-center">
                จำนวน
              </p>
              <p className="w-[30%] lg:text-base text-sm text-[#013D59] font-[500] text-right ">
                ราคา
              </p>
            </div>
            {/* header */}

            <div className="max-h-[486px] h-full overflow-auto hide-scrollbar">
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
                        {item.amount}
                      </p>

                      <div className="w-[30%] flex flex-col justify-end text-right">
                        {item.special_price > 0 && (
                          <p className="text-[12px] font-[300] line-through">
                            {formatNumber(item.price * item.amount)}
                          </p>
                        )}

                        <p className="lg:text-base text-sm font-[500]">
                          {/* ราคาที่ลดแล้ว คูณกับ จำนวน */}
                          {formatNumber((item.special_price || item.price) *
                            item.amount)}{" "}
                          ฿
                        </p>
                      </div>
                    </div>

                    <p className="text-[12px] font-[300] max-w-[50%] w-full">
                      {item.details}
                    </p>
                  </div>
                ))
              ) : (
                <div className="flex justify-center py-4 text-[#616060]">
                  ยังไม่มีรายการเมนู
                </div>
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

            <div className="flex flex-row gap-2 justify-between items-center w-full py-2 px-4">
              <p className="lg:text-2xl text-xl font-[700]">ยอดทั้งหมด</p>
              <p className="lg:text-2xl text-xl font-[700]">
                {formatNumber(Tatal)} ฿
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <div className="flex flex-row justify-center gap-4 w-full">
            <Link
              to={"/ordersDay"}
              className="bg-[#FFBA41] hover:bg-[#00537B] transition-all ease-in-out duration-200  cursor-pointer text-white rounded-lg w-full text-center py-1.5 font-bold xl:text-xl text-lg"
            >
              ย้อนกลับ
            </Link>
            <Link
              to={
                groupedMenuDetails.length > 0
                  ? `/payment/detail-all/${menuOrder.id}`
                  : "#"
              }
              className={`bg-[#F44D4D] hover:bg-[#00537B] transition-all ease-in-out duration-200 cursor-pointer text-white rounded-lg w-full text-center py-1.5 font-bold xl:text-xl text-lg ${
                groupedMenuDetails.length <= 0
                  ? "pointer-events-none opacity-50"
                  : ""
              }`}
            >
              ชำระเงิน
            </Link>
          </div>
        </div>
      </div>

      <Modal
        open={openModal}
        onClose={() => {
          setOpenModal(false);
        }}
      >
        <Box
          className="flex flex-col gap-4 2xl:max-w-[60%] lg:max-w-[80%] max-w-[95%] w-full py-4"
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "white",
            borderRadius: "10px",
            boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
            backgroundColor: "#FFf",
            // p: 2,
          }}
        >
          <div className="flex gap-4 w-full px-4">
            <div className="flex gap-2 items-center w-[60%]">
              {/* <EventNoteOutlinedIcon sx={{ color: "#00537B", fontSize: 35 }} /> */}
              <p className="text-[#00537B] text-2xl font-[600] ">กำลังปรุง</p>
            </div>

            <p className="text-[#313131] text-lg text-left w-[45%]">จำนวน</p>

            <button
              onClick={() => {
                setOpenModal(false);
              }}
              className="flex flex-row justify-end gap-4 w-[20%]"
            >
              <CancelIcon className="hover:text-[#00537B] cursor-pointer" />
            </button>
          </div>

          <EditOrder filteredOrderList={filteredOrderList} />
        </Box>
      </Modal>
    </div>
  );
}

export default DetailOrderToday;
