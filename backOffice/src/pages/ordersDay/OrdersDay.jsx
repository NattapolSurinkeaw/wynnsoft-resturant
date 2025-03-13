import React, { useEffect, useMemo, useRef, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import AssignmentIndOutlinedIcon from "@mui/icons-material/AssignmentIndOutlined";
import { foodDetail } from "../../components/mockData/foodMenu";
import { order_history } from "../../components/mockData/OrderHistory";
import { CustomTable } from "../../components/mockData/CustomTable/CustomTable";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import "dayjs/locale/th"; // ใช้ภาษาไทย
import Pagination from "@mui/material/Pagination";
import { ButtonGroup } from "@mui/joy";
function OrdersDay() {
  dayjs.locale("th");
  const [selectedStatusMenu, setSelectedStatusMenu] = useState(null);
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const [selectedTable, setSelectedTable] = useState(null);
  const [showTable, setShowTable] = useState(false);
  const statusMenuRef = useRef(null);
  const tableRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 8;

  const formatNumber = (num) =>
    Number(num).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        statusMenuRef.current &&
        !statusMenuRef.current.contains(event.target) &&
        tableRef.current &&
        !tableRef.current.contains(event.target)
      ) {
        setShowStatusMenu(false);
        setShowTable(false);
      }
    };

    if (showStatusMenu || showTable) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showStatusMenu, showTable]);

  useEffect(() => {
    if (selectedStatusMenu === null) {
      setShowStatusMenu(false);
    }
    if (selectedTable === null) {
      setShowTable(false);
    }
  }, [selectedStatusMenu, selectedTable]);

  const clearFiltersStatusMenu = () => {
    setSelectedStatusMenu(null);
  };

  const clearFiltersTable = () => {
    setSelectedTable(null);
  };

  const getFilteredOrderDetails = (
    order_history,
    CustomTable,
    foodDetail,
    selectedStatusMenu,
    selectedTable
  ) => {
    return (
      order_history
        .map((order) => {
          // Find the table from CustomTable
          const table = CustomTable.find((table) => table.id === order.tableID);

          // Find the menu details from foodDetail
          const menuDetails = foodDetail.filter((food) =>
            order.menuID.includes(food.id)
          );

          const formattedDate = dayjs(order.createdAt, "DD-MM-YYYY").format(
            "DD MMMM YYYY"
          );

          let totalPrice = 0;
          let totalSpecialPrice = 0;
          let totalPriceAll = 0;

          order.menuID.forEach((menuId) => {
            const foodItem = foodDetail.find((food) => food.id === menuId);
            if (foodItem) {
              const count = foodItem.count || 1;
              const price = foodItem.price || 0;
              const specialPrice = foodItem.specialPrice || price;

              totalPrice += price * count;
              totalPriceAll += specialPrice * count;

              if (foodItem.specialPrice) {
                totalSpecialPrice += specialPrice * count;
              }
            }
          });

          const totalDiscount = totalPrice - totalPriceAll;

          return {
            ...order,
            table: table ? table.name_table : "ไม่มีข้อมูลโต๊ะ",
            tableQRCode: table ? table.qrcode : "",
            menu: menuDetails.map((food) => ({
              name: food.name,
              price: food.price,
              specialPrice: food.specialPrice,
              count: food.count,
              detail: food.detail,
              image: food.images,
            })),
            formattedDate,
            totalPrice,
            totalSpecialPrice,
            totalDiscount,
            totalPriceAll,
          };
        })
        // Filter by selected status
        .filter((order) => {
          if (selectedStatusMenu) {
            return order.statusOrder === selectedStatusMenu;
          }
          return true; // No filtering if no status is selected
        })
        // Filter by selected table
        .filter((order) => {
          if (selectedTable) {
            return order.tableID === selectedTable;
          }
          return true; // No filtering if no table is selected
        })
    );
  };

  const combinedOrderDetails = getFilteredOrderDetails(
    order_history,
    CustomTable,
    foodDetail,
    selectedStatusMenu,
    selectedTable
  );

  console.log(combinedOrderDetails);
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = combinedOrderDetails.slice(
    indexOfFirstOrder,
    indexOfLastOrder
  );

  const totalPages = Math.ceil(combinedOrderDetails.length / ordersPerPage);
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
    <div className="flex flex-col justify-start gap-6 w-full h-full flex-1">
      <div className="flex 2xl:flex-row flex-col gap-4 w-full justify-between 2xl:items-center">
        <div className="flex flex-shrink-0 gap-2 justify-start items-center">
          <AssignmentIndOutlinedIcon sx={{ color: "#00537B", fontSize: 35 }} />
          <p className="text-[#00537B] text-2xl font-[600]">ออเดอร์วันนี้</p>
        </div>

        <div className="flex gap-4 justify-ennd items-center ">
          {/* status */}
          <div className="relative" ref={statusMenuRef}>
            <div className="flex flex-shrink-0 gap-2 items-center">
              <p className="text-[#313131] xl:text-xl text-base font-[600] flex-shrink-0">
                สถานะ
              </p>
              <div
                className="bg-white cursor-pointer flex justify-between items-center gap-2 py-1.5 px-2 rounded-lg shadow w-[180px] max-w-full "
                onClick={() => setShowStatusMenu(!showStatusMenu)}
              >
                <p className="text-[#313131] xl:text-lg text-base font-[400]">
                  {selectedStatusMenu === "1"
                    ? "ครบเเล้ว"
                    : selectedStatusMenu === "2"
                    ? "พร้อมเสริฟ"
                    : selectedStatusMenu === "3"
                    ? "เรียกพนักงาน"
                    : "เลือกสถานะ"}
                </p>

                <figure
                  className={`lg:w-[30px] w-[25px] lg:h-[30px] h-[25px] transition-all duration-300 ${
                    !showStatusMenu ? "" : "rotate-180"
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

            {/* สินค้าขายดี */}
            <div className="absolute w-full h-full z-99">
              {showStatusMenu && (
                <div className="bg-white flex flex-col gap-2 p-2 mt-2 rounded-lg shadow">
                  <div
                    className={`py-2 px-4 cursor-pointer hover:bg-[#00537B] hover:text-white text-black rounded-lg ${
                      selectedStatusMenu === null
                        ? "bg-[#F5A100] text-white"
                        : ""
                    }`}
                    onClick={() => {
                      clearFiltersStatusMenu();
                      setShowStatusMenu(false);
                    }}
                  >
                    ทั้งหมด
                  </div>
                  <div className="border-t border-[#e6e6e6] rounded-full w-full"></div>

                  <div
                    className={`py-2 px-4 cursor-pointer hover:bg-[#00537B] hover:text-white text-black rounded-lg ${
                      selectedStatusMenu === "1"
                        ? "bg-[#F5A100] text-white"
                        : ""
                    }`}
                    onClick={() => {
                      setSelectedStatusMenu("1");
                      setShowStatusMenu(false);
                    }}
                  >
                    ครบเเล้ว
                  </div>
                  <div
                    className={`py-2 px-4 cursor-pointer hover:bg-[#00537B] hover:text-white text-black rounded-lg ${
                      selectedStatusMenu === "2"
                        ? "bg-[#F5A100] text-white"
                        : ""
                    }`}
                    onClick={() => {
                      setSelectedStatusMenu("2");
                      setShowStatusMenu(false);
                    }}
                  >
                    พร้อมเสริฟ
                  </div>
                  <div
                    className={`py-2 px-4 cursor-pointer hover:bg-[#00537B] hover:text-white text-black rounded-lg ${
                      selectedStatusMenu === "3"
                        ? "bg-[#F5A100] text-white"
                        : ""
                    }`}
                    onClick={() => {
                      setSelectedStatusMenu("3");
                      setShowStatusMenu(false);
                    }}
                  >
                    เรียกพนักงาน
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* table */}
          <div className="relative" ref={tableRef}>
            <div className="flex flex-shrink-0 gap-2 items-center">
              <p className="text-[#313131] xl:text-xl text-base font-[600] flex-shrink-0">
                โต๊ะที่เปิด
              </p>
              <div
                className="bg-white cursor-pointer flex justify-between items-center gap-2 p-1.5 px-2 rounded-lg shadow  w-[170px] max-w-full"
                onClick={() => setShowTable(!showTable)}
              >
                <p className="text-[#313131] xl:text-lg text-base font-[400]">
                  {selectedTable
                    ? CustomTable.find((c) => c.id === selectedTable)
                        ?.name_table
                    : "เลือกโต๊ะ"}
                </p>
                <figure
                  className={`lg:w-[30px] w-[25px] lg:h-[30px] h-[25px] transition-all duration-300 ${
                    !showTable ? "" : "rotate-180"
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

            {/* ชื่อโต๊ะ */}
            <div className="absolute w-full h-full z-99">
              {showTable && (
                <div className="bg-white flex flex-col gap-2 p-2 mt-2 rounded-lg shadow h-[400px] overflow-y-auto">
                  <div
                    className={`py-2 px-4 cursor-pointer hover:bg-[#00537B] hover:text-white text-black rounded-lg ${
                      selectedTable === null ? "bg-[#F5A100] text-white" : ""
                    }`}
                    onClick={() => {
                      clearFiltersTable();
                      setTimeout(() => setShowTable(false), 0);
                    }}
                  >
                    ทั้งหมด
                  </div>
                  <div className="border-t border-[#e6e6e6] rounded-full w-full"></div>
                  {CustomTable.map((table) => (
                    <div
                      key={table.id}
                      className={`py-2 px-4 cursor-pointer hover:bg-[#00537B] hover:text-white text-black rounded-lg ${
                        selectedTable === table.id
                          ? "bg-[#F5A100] text-white"
                          : ""
                      }`}
                      onClick={() => {
                        setSelectedTable(table.id);
                        setShowTable(false);
                      }}
                    >
                      {table.name_table}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <Link
            to={"/customTable"}
            className="bg-[#00537B] cursor-pointer max-w-[150px] w-full flex flex-shrink-0 justify-center items-center gap-2 p-1 px-2 rounded-lg shadow hover:bg-[#F5A100] transition-all duration-200 ease-in-out"
          >
            <AddIcon sx={{ color: "#fff", fontSize: 30 }} />
            <p className="text-white xl:text-lg text-base font-[400]">
              เปิดโต๊ะ
            </p>
          </Link>
        </div>
      </div>
      <div className="h-screen flex flex-col justify-between overflow-auto hide-scrollbar">
        <div className="grid xl:grid-cols-4 grid-cols-2 h-[450px] gap-4 ">
          {currentOrders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-lg py-4 px-6 w-full h-full flex flex-col gap-2 shadow"
            >
              <div className="flex justify-between gap-4 items-center">
                <div className="flex gap-2 h-full">
                  <div className="bg-[#FFBA41] flex flex-col justify-center items-center p-1.5 w-[60px] h-[60px] rounded-lg">
                    <p className="text-white text-sm">โต๊ะ</p>
                    <p className="text-white text-3xl font-[600]">
                      {order.table}
                    </p>
                  </div>
                  <div className="flex flex-col justify-between h-full">
                    <p className="text-[#013D59] font-[600] text-xl">
                      #{order.order_number}
                    </p>
                    <p className="text-[#00537B]">
                      {order.menu.length} ออเดอร์
                    </p>
                  </div>
                </div>
                <div
                  className={`max-w-[120px] w-full text-center text-white rounded-full p-1 
                ${
                  order.statusOrder === "1"
                    ? "bg-[#39C526]"
                    : order.statusOrder === "2"
                    ? "bg-[#FF6A00]"
                    : order.statusOrder === "3"
                    ? "bg-[#F92727]"
                    : ""
                }`}
                >
                  {order.statusOrder === "1"
                    ? "ครบเเล้ว"
                    : order.statusOrder === "2"
                    ? "พร้อมเสริฟ"
                    : order.statusOrder === "3"
                    ? "เรียกพนักงาน"
                    : ""}
                </div>
              </div>
              <div className="flex justify-between gap-4 items-center">
                <p className="text-base text-[#00537B] font-[500]">
                  {order.formattedDate}
                </p>
                <p className="text-base text-[#00537B] font-[500]">
                  {order.time}
                </p>
              </div>
              <div className="border-y-2 border-[#CACACA] py-1 flex justify-between gap-2 w-full">
                <p className="w-[60%] text-[#8F8F8F] text-base font-[500]">
                  รายการ
                </p>
                <p className="w-[10%] text-center text-[#8F8F8F] text-base font-[500]">
                  จำนวน
                </p>
                <p className="w-[20%] text-right text-[#8F8F8F] text-base font-[500]">
                  ราคา
                </p>
              </div>

              <div className="flex flex-col gap-2 w-full max-h-[200px] h-full ">
                {order.menu.slice(0, 5).map((menu) => (
                  <div
                    key={menu.name}
                    className="flex justify-between w-full items-center gap-2"
                  >
                    <p className="w-[60%] text-[#013D59] text-base font-[500] line-clamp-1">
                      {menu.name}
                    </p>
                    <p className="w-[10%] text-center text-[#013D59] text-base font-[500]">
                      {menu.count}
                    </p>
                    <div className="flex flex-col w-[20%]">
                      {menu.specialPrice > 0 && (
                        <p className="text-right text-[#013D59] text-[10px] line-through">
                          {menu.price}
                        </p>
                      )}
                      <p className="text-right text-[#013D59] text-base font-[500]">
                        {menu.price || menu.specialPrice}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-b-2 border-[#00537B] w-full flex justify-center items-center">
                <p className="w-[60%] text-[#00537B] text-base text-center font-[500]">
                  + {order.menu.length > 5 ? order.menu.length - 5 : 0} รายการ
                </p>
              </div>

              <div className="flex justify-between w-full">
                <p className=" text-left text-[#013D59] text-2xl font-[600]">
                  ยอดทั้งหมด
                </p>
                <p className=" text-right text-[#013D59] text-2xl font-[600]">
                  ฿ {formatNumber(order.totalPriceAll)}
                </p>
              </div>

              <div className="flex justify-center items-center">
                <button className="bg-[#00537B] hover:bg-[#FFBA41] p-2 max-w-[150px] w-full text-white text-xl font-[500] rounded-lg cursor-pointer transition-all duration-200 ease-in-out">
                  ดูรายละเอียด
                </button>
              </div>
            </div>
          ))}
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

export default OrdersDay;
