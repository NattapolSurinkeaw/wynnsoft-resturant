import React, { useEffect, useRef, useState } from "react";
import RequestQuoteOutlinedIcon from "@mui/icons-material/RequestQuoteOutlined";
import { orderToday } from "../../components/mockData/orderToDay";
import dayjs from "dayjs";
import "dayjs/locale/th"; // ใช้ภาษาไทย
import { Link } from "react-router-dom";

function Orders() {
  dayjs.locale("th");
  const [showDate, setShowDate] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const menuDate = useRef(null);
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 8;

  const formatNumber = (num) =>
    Number(num).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuDate.current && !menuDate.current.contains(event.target)) {
        setShowDate(false);
      }
    };
    if (showDate) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDate]);

  const getFilteredOrderDetails = (orderToday, selectedDate) => {
    return orderToday
      .filter((order) => order.status === "4") // 🔹 กรองออเดอร์ที่มี status === "4"
      .map((order) => {
        const formattedDate = dayjs(order.createdAt).format("D MMMM YYYY");
        const formattedTime = dayjs(order.createdAt).format("HH:mm น.");

        // 🔹 กรอง orderList เฉพาะที่มี status === "4"
        const filteredOrderList = order.orderList.filter(
          (orderItem) => orderItem.status === "4"
        );

        if (!filteredOrderList.length) return null;

        // 🔹 รวมรายการอาหารที่ซ้ำกัน
        const {
          mergedOrderList,
          totalPrice,
          totalSpecialPrice,
          totalPriceAll,
        } = filteredOrderList.reduce(
          (acc, orderItem) => {
            const key = `${orderItem.food.id}_${orderItem.food.name}_${orderItem.status}`;

            if (!acc.mergedOrderList[key]) {
              acc.mergedOrderList[key] = { ...orderItem };
            } else {
              acc.mergedOrderList[key].amount += orderItem.amount;
            }

            const count = orderItem.amount || 1;
            const price = orderItem.food.price || 0;
            const specialPrice = orderItem.food.special_price || price;

            acc.totalPrice += price * count;
            acc.totalSpecialPrice += orderItem.food.special_price
              ? specialPrice * count
              : 0;
            acc.totalPriceAll += specialPrice * count;

            return acc;
          },
          {
            mergedOrderList: {},
            totalPrice: 0,
            totalSpecialPrice: 0,
            totalPriceAll: 0,
          }
        );

        return {
          ...order,
          orderList: Object.values(mergedOrderList), // ใช้ Object.values() เพื่อดึง array กลับมา
          table: order.table ? order.table.title : "ไม่มีข้อมูลโต๊ะ",
          table_id: order.table?.id || null,
          formattedDate,
          formattedTime,
          totalPrice,
          totalSpecialPrice,
          totalDiscount: totalPrice - totalPriceAll,
          totalPriceAll,
        };
      })
      .filter((order) => order !== null)
      .filter((order) => {
        const dateMatch = !selectedDate || order.createdAt === selectedDate;
        return dateMatch;
      });
  };

  const filteredOrders = getFilteredOrderDetails(orderToday, selectedDate);

  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(
    indexOfFirstOrder,
    indexOfLastOrder
  );

  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="flex flex-col justify-between h-full gap-4 w-full">
      <div className="flex flex-col gap-4">
        <div className="flex 2xl:flex-row flex-col gap-4 w-full justify-between 2xl:items-center">
          <div className="flex flex-shrink-0 gap-2 justify-start items-center">
            <RequestQuoteOutlinedIcon sx={{ color: "#00537B", fontSize: 35 }} />
            <p className="text-[#00537B] text-2xl font-[600]">รอเสริฟ</p>
          </div>

          <div className="flex gap-4 justify-ennd items-center ">
            {/* date */}
            <div className="relative" ref={menuDate}>
              <div className="flex flex-shrink-0 gap-2 items-center">
                <p className="text-[#313131] xl:text-xl text-base font-[600] flex-shrink-0">
                  วันที่
                </p>
                <div
                  className="bg-white cursor-pointer flex justify-between items-center gap-2 p-1.5 px-2 rounded-lg shadow w-[250px] max-w-full"
                  onClick={() => setShowDate(!showDate)}
                >
                  <p className="text-[#313131] xl:text-lg text-base font-[400]">
                    {selectedDate
                      ? `${
                          filteredOrders.find(
                            (order) => order.formattedDate === selectedDate
                          )?.formattedDate || "เลือกวันที่"
                        }`
                      : "เลือกวันที่"}
                  </p>

                  <figure
                    className={`lg:w-[30px] w-[25px] lg:h-[30px] h-[25px] transition-all duration-300 ${
                      !showDate ? "" : "rotate-180"
                    }`}
                  >
                    <img
                      src="/icons/Group 949.png"
                      alt=""
                      className="w-full h-full"
                    />
                  </figure>
                </div>
              </div>

              {showDate && (
                <div className="absolute bg-white flex flex-col gap-2 p-2 mt-2 rounded-lg shadow max-h-[400px] overflow-y-auto">
                  <div
                    className={`py-2 px-4 cursor-pointer hover:bg-[#00537B] hover:text-white text-black rounded-lg ${
                      selectedDate === null ? "bg-[#F5A100] text-white" : ""
                    }`}
                    onClick={() => {
                      setSelectedDate(null);
                      setTimeout(() => setShowDate(false), 100);
                    }}
                  >
                    ทั้งหมด
                  </div>
                  <div className="border-t border-[#e6e6e6] rounded-full w-[250px] max-w-full"></div>
                  {orderToday
                    .filter(
                      (value, index, self) =>
                        index ===
                        self.findIndex((t) => t.createdAt === value.createdAt)
                    )
                    .map((date) => (
                      <div
                        key={date.createdAt}
                        className={`py-2 px-4 cursor-pointer hover:bg-[#00537B] hover:text-white text-black rounded-lg ${
                          selectedDate === date.createdAt
                            ? "bg-[#F5A100] text-white"
                            : ""
                        }`}
                        onClick={() => {
                          setSelectedDate(date.createdAt);
                          setShowDate(false);
                        }}
                      >
                        {dayjs(date.createdAt).format("D MMMM YYYY")}
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="h-auto flex flex-col overflow-auto hide-scrollbar">
          <div className="grid xl:grid-cols-4 lg:grid-cols-3 grid-cols-2 h-full gap-3 ">
            {currentOrders.length === 0 ? (
              <div className="flex justify-center items-center w-full py-10 col-span-4 h-full">
                <p className="text-lg text-gray-500">ยังไม่มีออเดอร์</p>
              </div>
            ) : (
              currentOrders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white rounded-lg py-3 px-6 w-full h-full flex flex-col gap-2 shadow "
                >
                  <div className="flex justify-between gap-4 items-center">
                    <div className="flex gap-2 h-full">
                      <div className="bg-[#FFBA41] flex flex-col justify-center items-center p-1.5 w-[60px] h-[60px] rounded-lg">
                        {/* <p className="text-white  leading-none">โต๊ะ</p> */}
                        <p className="text-white text-sm font-[600] leading-none line-clamp-3 break-all">
                          {order.table}
                        </p>
                      </div>
                      <div className="flex flex-col justify-between h-full">
                        <p className="text-[#013D59] font-[600] text-lg">
                          #{order.order_number}
                        </p>
                        <p className="text-[#00537B]">
                          {order.orderList.length} ออเดอร์
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between gap-4 items-center">
                    <p className="text-base text-[#00537B] font-[500]">
                      {order.formattedDate}
                    </p>
                    <p className="text-base text-[#00537B] font-[500]">
                      {order.formattedTime}
                    </p>
                  </div>
                  <div className="border-y-2 border-[#CACACA] py-1 flex justify-between gap-2 w-full">
                    <p className="w-[60%] text-[#8F8F8F] text-sm font-[500]">
                      รายการ
                    </p>
                    <p className="w-[10%] text-center text-[#8F8F8F] text-sm font-[500]">
                      จำนวน
                    </p>
                    <p className="w-[20%] text-right text-[#8F8F8F] text-sm font-[500]">
                      ราคา
                    </p>
                  </div>

                  <div className="flex flex-col gap-1 w-full h-[100px] ">
                    {order.orderList.slice(0, 3).map((menu) => (
                      <div
                        key={menu.id}
                        className="flex justify-between w-full items-end  gap-2"
                      >
                        <p className="w-[60%] text-[#013D59] text-sm font-[500] line-clamp-1">
                          {menu.food.name}
                        </p>
                        <p className="w-[10%] text-center text-[#013D59] text-sm font-[500]">
                          {menu.amount}
                        </p>
                        <div className="flex flex-col w-[20%]">
                          {menu.food.special_price > 0 && (
                            <p className="text-right text-[#013D59] text-[8px] line-through">
                              {menu.food.price * menu.amount}
                            </p>
                          )}
                          <p className="text-right text-[#013D59] text-sm font-[500]">
                            {(menu.food.special_price || menu.food.price) *
                              menu.amount}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-b-2 border-[#00537B] w-full flex justify-center items-center">
                    <p className="w-[60%] text-[#00537B] text-sm text-center font-[500]">
                      +{" "}
                      {order.orderList.length > 3
                        ? order.orderList.length - 3
                        : 0}{" "}
                      รายการ
                    </p>
                  </div>

                  <div className="flex justify-between w-full">
                    <p className=" text-left text-[#013D59] text-xl font-[600]">
                      ยอดทั้งหมด
                    </p>
                    <p className=" text-right text-[#013D59] text-xl font-[600]">
                      ฿ {formatNumber(order.totalPriceAll)}
                    </p>
                  </div>

                  <div className="flex justify-center items-center gap-3">
                    <Link
                      to={`/ordersDay/detail/${order.id}`}
                      className="bg-[#FFBA41] hover:bg-[#00537B] text-center p-1 w-full text-white text-lg font-[500] rounded-lg cursor-pointer transition-all duration-200 ease-in-out"
                    >
                      ดูรายละเอียด
                    </Link>

                    <Link
                      to={`/payment/detail-all/${order.id}`}
                      className={`bg-[#00537B] hover:bg-[#F44D4D] text-center p-1 w-full text-white text-lg font-[500] rounded-lg cursor-pointer transition-all duration-200 ease-in-out`}
                    >
                      ลบ
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/*  pagination */}
      <div className="flex justify-end gap-1 bg-white w-fit ml-auto border border-[#DFDFDF] rounded-sm">
        <button
          onClick={handlePrevious}
          disabled={currentPage === 1}
          className={`text-sm py-2 px-4 rounded-sm cursor-pointer ${
            currentPage === 1
              ? "bg-white text-gray-500 cursor-not-allowed"
              : "hover:bg-[#00537B] hover:text-white"
          }`}
        >
          Previous
        </button>

        {[...Array(totalPages)].map((_, index) => {
          const pageNumber = index + 1;
          return (
            <button
              key={pageNumber}
              onClick={() => setCurrentPage(pageNumber)}
              className={`text-sm py-2 px-4 rounded-sm cursor-pointer ${
                currentPage === pageNumber
                  ? "bg-[#00537B] text-white"
                  : "hover:bg-[#00537B] hover:text-white"
              }`}
            >
              {pageNumber}
            </button>
          );
        })}

        <button
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className={`text-sm py-2 px-4 rounded-sm cursor-pointer ${
            currentPage === totalPages
              ? "bg-white text-gray-500 cursor-not-allowed"
              : "hover:bg-[#00537B] hover:text-white"
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default Orders;
