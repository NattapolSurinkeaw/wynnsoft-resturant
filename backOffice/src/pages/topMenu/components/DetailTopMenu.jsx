import React, { useEffect, useRef, useState } from "react";
import FormatListNumberedOutlinedIcon from "@mui/icons-material/FormatListNumberedOutlined";
import dayjs from "dayjs";
import "dayjs/locale/th"; // ใช้ภาษาไทย
import { DataGrid } from "@mui/x-data-grid";
import { Box, Button } from "@mui/material";
import { orderToday } from "../../../components/mockData/orderToDay";
import { Link } from "react-router-dom";
import ReplyIcon from "@mui/icons-material/Reply";
import * as XLSX from "xlsx";
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";
import { getPureDataTopmenu } from "../../../services/report.service";

function DetailTopMenu({setActiveTab}) {
  dayjs.locale("th");
  const [showDate, setShowDate] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [orderList, setOrderList] = useState([]);
  const [foods, setFoods] = useState([]);
  const menuDate = useRef(null);

  useEffect(() => {
    const fetchData = async() => {
      const res = await getPureDataTopmenu();
      setOrderList(res.orderList);
      setFoods(res.foods);
    }

    fetchData()
  }, [])

  const filteredOrders = orderList.filter(item => {
    const date = new Date(item.createdAt);
    const yearMonth = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    return (selectedDate)? yearMonth === selectedDate : item;
  });

  const getFoodNameById = (id) => {
    const food = foods.find(item => item.id === id);
    return food ? food.name : "ไม่พบเมนูนี้";
  };

  const summedByFoodId = filteredOrders.reduce((acc, item) => {
    if (acc[item.food_id]) {
      acc[item.food_id] += item.amount;
    } else {
      acc[item.food_id] = item.amount;
    }
    return acc;
  }, {});
  
  // ถ้าต้องการเป็น array
  const resultArray = Object.entries(summedByFoodId).map(([food_id, totalAmount], index) => ({
    id: index + 1, // ใช้ index โดยตรงและบวก 1 เพื่อให้เริ่มจาก 1
    name: getFoodNameById(parseInt(food_id)),
    totalAmount,
  }));

  const filterMonth = Array.from(new Set(
    orderList.map(item => {
      const date = new Date(item.createdAt);
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    })
  ));

  // console.log(resultArray)
  // console.log(filterMonth)
  // console.log(selectedDate)
  
  console.log(getFoodNameById(1))

  const Total = filteredOrders.reduce((sum, order) => sum + order.amount, 0);
  // console.log("filteredOrders", filteredOrders);

  const columns = [
    {
      field: 'id',
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
      field: "totalAmount",
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
                    {selectedDate ? dayjs(selectedDate).format("MMMM YYYY") : "เลือกเดือน"}
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
                  {filterMonth.map((date) => (
                      <div
                        key={date}
                        className={`py-2 px-4 cursor-pointer hover:bg-[#00537B] hover:text-white text-black rounded-lg ${
                          selectedDate ===
                          dayjs(date).format("MMMM YYYY")
                            ? "bg-[#F5A100] text-white"
                            : ""
                        }`}
                        onClick={() => {
                          setSelectedDate(date);
                          setShowDate(false);
                        }}
                      >
                        {dayjs(date).format("MMMM YYYY")}
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>

          <button
            onClick={() => setActiveTab('ChartTopMenu')}
            className="max-lg:order-2 bg-[#00537B] cursor-pointer 2xl:max-w-[200px] lg:max-w-[160px] max-w-[250px] w-full flex flex-shrink-0 justify-center items-center gap-1 p-1 px-4 rounded-lg shadow hover:bg-[#F5A100] transition-all duration-200 ease-in-out"
          >
            <ReplyIcon sx={{ color: "#fff", fontSize: 30 }} />
            <p className="text-white 2xl:text-lg text-base font-[400]">
              ย้อนกลับ
            </p>
          </button>
          
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
          rows={resultArray}
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
