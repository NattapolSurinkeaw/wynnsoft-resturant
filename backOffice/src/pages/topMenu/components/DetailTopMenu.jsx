import React, { useEffect, useRef, useState } from "react";
import FormatListNumberedOutlinedIcon from "@mui/icons-material/FormatListNumberedOutlined";
import dayjs from "dayjs";
import "dayjs/locale/th"; // ใช้ภาษาไทย
import { DataGrid } from "@mui/x-data-grid";
import { Box } from "@mui/material";
import { orderToday } from "../../../components/mockData/orderToDay";
import { Link } from "react-router-dom";
import ReplyIcon from "@mui/icons-material/Reply";
import * as XLSX from "xlsx";
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";

function DetailTopMenu({}) {
  dayjs.locale("th");
  const [showDate, setShowDate] = useState(false);
  const menuDate = useRef(null);
  const [selectedDate, setSelectedDate] = useState(null);
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
    const filteredOrders = orderToday.filter((order) => {
      if (!selectedDate) return order.status === "5";
      return (
        order.status === "5" &&
        dayjs(order.createdAt).format("MMMM YYYY") === selectedDate
      );
    });

    const mergedOrderList = filteredOrders.reduce((acc, order) => {
      order.orderList
        .filter((orderItem) => orderItem.status === "4")
        .forEach((orderItem) => {
          const key = `${orderItem.food.id}_${orderItem.food.name}`;

          if (!acc[key]) {
            acc[key] = {
              id: orderItem.food.id,
              name: orderItem.food.name,
              amount: orderItem.amount,
            };
          } else {
            acc[key].amount += orderItem.amount;
          }
        });

      return acc;
    }, {});

    return Object.values(mergedOrderList);
  };

  const filteredOrders = getFilteredOrderDetails(orderToday, selectedDate).map(
    (item, index) => ({
      ...item,
      count: index + 1,
    })
  );

  const Total = filteredOrders.reduce((sum, order) => sum + order.amount, 0);
  console.log("filteredOrders", filteredOrders);

  const columns = [
    {
      field: "count",
      headerName: "ลำดับ",
      headerAlign: "center",
      align: "center",
      width: 100,
    },
    {
      field: "name",
      headerName: "เมนูอาหาร",
      headerAlign: "left",
      align: "left",
      flex: 0.2,
      minWidth: 400,
      maxWidth: 1200,
    },
    {
      field: "amount",
      headerName: "จำนวนขาย",
      headerAlign: "center",
      align: "right",
      width: 200,
      renderCell: (params) => <div className="pr-8">{params.value}</div>,
    },
  ];

  const exportToExcel = () => {
    const date = new Date();
    const today = date.toLocaleDateString("en-GB", {
      month: "numeric",
      // day: "numeric",
      year: "numeric",
    });

    const excelData = [
      ["ลำดับ", "เมนูอาหาร", "จำนวนขาย"],
      ...filteredOrders.map((item) => [item.count, item.name, item.amount]),
      [],
      [],
      ["ยอดรวมทั้งหมด (฿)", "", Total, "", "", "", "", "", ""],
    ];

    const ws = XLSX.utils.aoa_to_sheet(excelData);

    ws["!merges"] = [
      {
        s: { r: excelData.length - 2, c: 0 },
        e: { r: excelData.length - 2, c: 1 },
      },
      {
        s: { r: excelData.length - 1, c: 0 },
        e: { r: excelData.length - 1, c: 1 },
      },
    ];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Orders");
    XLSX.writeFile(wb, `Report_TopMenu_${selectedDate}.xlsx`);
  };

  return (
    <div className="flex flex-col gap-4 max-w-[80%] w-full">
      <div className="flex 2xl:flex-row flex-col gap-4 w-full justify-between 2xl:items-center">
        <div className="flex flex-shrink-0 gap-2 justify-start items-center">
          <FormatListNumberedOutlinedIcon
            sx={{ color: "#00537B", fontSize: 35 }}
          />
          <p className="text-[#00537B] text-2xl font-[600]">เมนูติดอันดับ</p>
        </div>
        <div className="flex gap-3 w-full justify-end">
          <div className="flex gap-4 justify-ennd items-center ">
            {/* date */}
            <div className="relative" ref={menuDate}>
              <div className="flex flex-shrink-0 gap-2 items-center">
                <p className="text-[#313131] xl:text-xl text-base font-[600] flex-shrink-0">
                  เดือน
                </p>
                <div
                  className="bg-white cursor-pointer flex justify-between items-center gap-2 p-1.5 px-2 rounded-lg shadow w-[250px] max-w-full"
                  onClick={() => setShowDate(!showDate)}
                >
                  <p className="text-[#313131] xl:text-lg text-base font-[400]">
                    {selectedDate ? selectedDate : "เลือกเดือน"}
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
                <div
                  className={`absolute bg-white flex flex-col gap-2 p-2 mt-2 rounded-lg shadow max-h-[400px] overflow-y-auto ${
                    showDate ? "z-99" : "z-0"
                  }`}
                >
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
                    .filter((m) => m.status === "5")
                    .filter(
                      (value, index, self) =>
                        index ===
                        self.findIndex(
                          (t) =>
                            dayjs(t.createdAt).format("MMMM YYYY") ===
                            dayjs(value.createdAt).format("MMMM YYYY")
                        )
                    )
                    .sort(
                      (a, b) =>
                        dayjs(a.createdAt).month() - dayjs(b.createdAt).month()
                    )
                    .map((date) => (
                      <div
                        key={date.createdAt}
                        className={`py-2 px-4 cursor-pointer hover:bg-[#00537B] hover:text-white text-black rounded-lg ${
                          selectedDate ===
                          dayjs(date.createdAt).format("MMMM YYYY")
                            ? "bg-[#F5A100] text-white"
                            : ""
                        }`}
                        onClick={() => {
                          setSelectedDate(
                            dayjs(date.createdAt).format("MMMM YYYY")
                          );
                          setShowDate(false);
                        }}
                      >
                        {dayjs(date.createdAt).format("MMMM YYYY")}
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>

          <Link
            to="/topMenu"
            className="max-lg:order-2 bg-[#00537B] cursor-pointer 2xl:max-w-[200px] lg:max-w-[160px] max-w-[250px] w-full flex flex-shrink-0 justify-center items-center gap-1 p-1 px-4 rounded-lg shadow hover:bg-[#F5A100] transition-all duration-200 ease-in-out"
          >
            <ReplyIcon sx={{ color: "#fff", fontSize: 30 }} />
            <p className="text-white 2xl:text-lg text-base font-[400]">
              ย้อนกลับ
            </p>
          </Link>
          
          <button
            onClick={exportToExcel}
            className="max-lg:order-2 bg-[#00537B] cursor-pointer 2xl:max-w-[200px] lg:max-w-[160px] max-w-[250px] w-full flex flex-shrink-0 justify-center items-center gap-1 p-1 px-4 rounded-lg shadow hover:bg-[#F5A100] transition-all duration-200 ease-in-out"
          >
            <FileUploadOutlinedIcon sx={{ color: "#fff", fontSize: 30 }} />
            <p className="text-white 2xl:text-lg text-base font-[400]">
              Export Excel
            </p>
          </button>
        </div>
      </div>
      <Box className="w-full h-full relative">
        <DataGrid
          className="bg-white"
          rows={filteredOrders}
          rowHeight={70}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 10,
              },
            },
          }}
          pageSizeOptions={[5]}
          disableSelectionOnClick
        />

        <div className="w-full flex 3xl:justify-end justify-center items-center gap-4 absolute 2xl:-inset-x-[25%] xl:-inset-x-4 lg:-inset-x-16 -inset-x-[10%] bottom-2">
          <div className="flex justify-center items-center gap-2 ">
            <p className="text-lg font-semibold text-[#313131] flex-shrink-0">
              ยอดรวมทั้งหมด :{" "}
            </p>
            <p className="text-lg font-bold text-[#313131] w-full text-center border-b-6 border-red-600 border-double">
              {Total}
            </p>
          </div>
        </div>
      </Box>
    </div>
  );
}

export default DetailTopMenu;
