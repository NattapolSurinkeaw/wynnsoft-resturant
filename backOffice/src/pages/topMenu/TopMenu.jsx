import React, { useEffect, useRef, useState } from "react";
import FormatListNumberedOutlinedIcon from "@mui/icons-material/FormatListNumberedOutlined";
import { orderToday } from "../../components/mockData/orderToDay";
import DetailTopMenu from "./components/DetailTopMenu";
import ChartTopMenu from "./components/ChartTopMenu";
import { Link, useLocation } from "react-router-dom";
import * as XLSX from "xlsx";
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";
import FeedIcon from "@mui/icons-material/Feed";
import dayjs from "dayjs";
import "dayjs/locale/th"; // ใช้ภาษาไทย

function TopMenu() {
  dayjs.locale("th");
  const [activeTab, setActiveTab] = useState("ChartTopMenu");
  const location = useLocation();


  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get("tab") || "ChartTopMenu";
    setActiveTab(tab);
  }, [location.search]);

  const chartFilteredOrderDetails = (orderToday) => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth(); // เดือนปัจจุบัน (0-11)
    const currentYear = currentDate.getFullYear(); // ปีปัจจุบัน

    console.log("🗓️ Current Month:", currentMonth + 1, "Year:", currentYear);

    const chartFilteredOrders = orderToday.filter((order) => {
      if (!order.createdAt) {
        console.warn("⚠️ Missing order date:", order);
        return false;
      }

      const orderDate = new Date(order.createdAt);

      if (isNaN(orderDate)) {
        console.warn("⚠️ Invalid date format:", order.createdAt);
        return false;
      }

      return (
        order.status === "5" &&
        orderDate.getUTCMonth() === currentMonth &&
        orderDate.getUTCFullYear() === currentYear
      );
    });

    const mergedOrderList = chartFilteredOrders.reduce((acc, order) => {
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

  const chartFilteredOrders = chartFilteredOrderDetails(orderToday)
    .sort((a, b) => b.amount - a.amount) // เรียงจากมากไปน้อยตาม amount
    .map((item, index) => ({
      ...item,
      count: index + 1, // เพิ่มลำดับที่เริ่มจาก 1
    }));

  const Total = chartFilteredOrders.reduce(
    (sum, order) => sum + order.amount,
    0
  );
  const TotalTen = chartFilteredOrders
    .slice(0, 10)
    .reduce((sum, order) => sum + order.amount, 0);

  const exportToExcel = () => {
    const date = new Date();
    const today = date.toLocaleDateString("en-GB", {
      month: "numeric",
      year: "numeric",
    });

    const excelData = [
      ["ลำดับ", "เมนูอาหาร", "จำนวนขาย"],
      ...chartFilteredOrders.map((item) => [
        item.count,
        item.name,
        item.amount,
      ]),
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
    XLSX.writeFile(wb, `Report_TopMenu_${today}.xlsx`);
  };

  return (
    <div className="flex flex-col gap-4">
      {activeTab === "ChartTopMenu" && (
        <div className="flex justify-between h-[42px]">
          <div className="flex flex-shrink-0 gap-2 justify-start items-center">
            <FormatListNumberedOutlinedIcon
              sx={{ color: "#00537B", fontSize: 35 }}
            />
            <p className="text-[#00537B] text-2xl font-[600]">เมนูติดอันดับ</p>
          </div>
          <div className="flex gap-3 justify-end">
            <Link
              to={`/topMenu?tab=DetailTopMenu`}
              className="max-lg:order-2 bg-[#00537B] cursor-pointer 2xl:max-w-[200px] lg:max-w-[160px] max-w-[250px] w-full flex flex-shrink-0 justify-center items-center gap-1 p-1 px-4 rounded-lg shadow hover:bg-[#F5A100] transition-all duration-200 ease-in-out"
            >
              <FeedIcon sx={{ color: "#fff", fontSize: 30 }} />
              <p className="text-white 2xl:text-lg text-base font-[400]">
                รายระเอียด
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
      )}

      {activeTab === "ChartTopMenu" && (
        <ChartTopMenu
          chartFilteredOrders={chartFilteredOrders}
          Total={Total}
          TotalTen={TotalTen}
        />
      )}
      {activeTab === "DetailTopMenu" && <DetailTopMenu />}
    </div>
  );
}

export default TopMenu;
