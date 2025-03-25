import React, { useEffect, useRef, useState } from "react";
import { BarChart } from "@mui/x-charts/BarChart";
import { useMediaQuery } from "@mui/material";
import ReplyIcon from "@mui/icons-material/Reply";
import * as XLSX from "xlsx";
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";
import LeaderboardOutlinedIcon from "@mui/icons-material/LeaderboardOutlined";
import { orderToday } from "../../../components/mockData/orderToDay";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import "dayjs/locale/th"; // ใช้ภาษาไทย

function ChartToMonthly({
  filteredByMonth,
  showMonthly,
  setShowMonthly,
  selectedMonthly,
  setSelectedMonthly,
}) {
  const menuMonthly = useRef(null);
  const isLargeScreen = useMediaQuery("(min-width: 1280px)");
  const isMediumScreen = useMediaQuery("(min-width: 1024px)");
  const chartWidth = isLargeScreen ? 1550 : isMediumScreen ? 950 : 750;
  const chartHeight = isLargeScreen ? 700 : isMediumScreen ? 600 : 600;

  console.log("filteredByMonth", filteredByMonth);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuMonthly.current && !menuMonthly.current.contains(event.target)) {
        setShowMonthly(false);
      }
    };
    if (showMonthly) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showMonthly]);

  const PriceTotal = filteredByMonth.reduce(
    (sum, order) => sum + order.totalPrice,
    0
  );
  const DiscountTotal = filteredByMonth.reduce(
    (sum, order) => sum + order.totalDiscount,
    0
  );

  const PriceAllTotal = filteredByMonth.reduce(
    (sum, order) => sum + order.totalPriceAll,
    0
  );

  const amountTotal = filteredByMonth.reduce(
    (sum, order) => sum + order.totalamount,
    0
  );

  const exportToExcel = () => {
    const date = new Date();
    const today = date.toLocaleDateString("en-GB", {
      month: "numeric",
      day: "numeric",
      year: "numeric",
    });

    const excelData = [
      [
        "ลำดับ",
        "เลขออเดอร์",
        "วันที่",
        "เวลา",
        "โต๊ะ",
        "รายการ",
        "ช่องทางชำระ",
        "ยอดรวม (฿)",
        "ยอดส่วนลด (฿)",
        "ยอดทั้งหมด (฿)",
      ],
      ...filteredByMonth.map((item) => [
        item.count,
        item.order_number,
        item.formattedMonthly,
        item.formattedTime,
        item.table,
        item.totalamount,
        item.payment === "1"
          ? "ชำระผ่าน QR"
          : item.payment === "2"
          ? "ชำระเงินสด"
          : "-",
        item.totalPrice,
        item.totalDiscount,
        item.totalPriceAll,
      ]),
      [],
      [],
      ["ยอดรวม (฿)", "", PriceTotal, "", "", "", "", "", ""],
      ["ยอดรวมส่วนลด (฿)", "", DiscountTotal, "", "", "", "", "", ""],
      ["ยอดรวมทั้งหมด (฿)", "", PriceAllTotal, "", "", "", "", "", ""],
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
    if (selectedMonthly) {
      XLSX.writeFile(wb, `Report_Monthly_income_${selectedMonthly}.xlsx`);
    } else {
      XLSX.writeFile(wb, `Report_Monthly_income_${today}.xlsx`);
    }
  };

  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const totalAmountsPerDay = Array(31).fill(0);

  filteredByMonth.forEach((order) => {
    const day = new Date(order.createdAt).getDate();
    totalAmountsPerDay[day - 1] += order.totalamount;
  });

  const chartData = totalAmountsPerDay;
  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex 2xl:flex-row flex-col gap-4 w-full justify-between 2xl:items-center">
        <div className="flex flex-shrink-0 gap-2 justify-start items-center">
          <LeaderboardOutlinedIcon sx={{ color: "#00537B", fontSize: 35 }} />
          <p className="text-[#00537B] text-2xl font-[600]">รายได้รายเดือน</p>
        </div>
        <div className="flex gap-3 w-full justify-end">
          <div className="flex gap-4 justify-ennd items-center ">
            {/* Monthly */}
            <div className="relative" ref={menuMonthly}>
              <div className="flex flex-shrink-0 gap-2 items-center">
                <p className="text-[#313131] xl:text-xl text-base font-[600] flex-shrink-0">
                  เดือน
                </p>
                <div
                  className="bg-white cursor-pointer flex justify-between items-center gap-2 p-1.5 px-2 rounded-lg shadow w-[250px] max-w-full"
                  onClick={() => setShowMonthly(!showMonthly)}
                >
                  <p className="text-[#313131] xl:text-lg text-base font-[400]">
                    {selectedMonthly ? selectedMonthly : "เลือกเดือน"}
                  </p>

                  <figure
                    className={`lg:w-[30px] w-[25px] lg:h-[30px] h-[25px] transition-all duration-300 ${
                      !showMonthly ? "" : "rotate-180"
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

              {showMonthly && (
                <div
                  className={`absolute bg-white flex flex-col gap-2 p-2 mt-2 rounded-lg shadow max-h-[400px] overflow-y-auto ${
                    showMonthly ? "z-99" : "z-0"
                  }`}
                >
                  <div
                    className={`py-2 px-4 cursor-pointer hover:bg-[#00537B] hover:text-white text-black rounded-lg ${
                      selectedMonthly === null ? "bg-[#F5A100] text-white" : ""
                    }`}
                    onClick={() => {
                      setSelectedMonthly(null);
                      setTimeout(() => setShowMonthly(false), 100);
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
                    .map((Monthly) => (
                      <div
                        key={Monthly.createdAt}
                        className={`py-2 px-4 cursor-pointer hover:bg-[#00537B] hover:text-white text-black rounded-lg ${
                          selectedMonthly ===
                          dayjs(Monthly.createdAt).format("MMMM YYYY")
                            ? "bg-[#F5A100] text-white"
                            : ""
                        }`}
                        onClick={() => {
                          setSelectedMonthly(
                            dayjs(Monthly.createdAt).format("MMMM YYYY")
                          );
                          setShowMonthly(false);
                        }}
                      >
                        {dayjs(Monthly.createdAt).format("MMMM YYYY")}
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>

          <button
            onClick={exportToExcel}
            className="max-lg:order-2 bg-[#00537B] cursor-pointer 2xl:max-w-[200px] lg:max-w-[160px] max-w-[250px] w-full flex flex-shrink-0 justify-center items-center gap-1 p-1 px-4 rounded-lg shadow hover:bg-[#F5A100] transition-all duration-200 ease-in-out"
          >
            <FileUploadOutlinedIcon sx={{ color: "#fff", fontSize: 30 }} />
            <p className="text-white 2xl:text-lg text-base font-[400]">
              Export Excel
            </p>
          </button>

          <Link
            to="/monthlyincome"
            className="max-lg:order-2 bg-[#00537B] cursor-pointer 2xl:max-w-[200px] lg:max-w-[160px] max-w-[250px] w-full flex flex-shrink-0 justify-center items-center gap-1 p-1 px-4 rounded-lg shadow hover:bg-[#F5A100] transition-all duration-200 ease-in-out"
          >
            <ReplyIcon sx={{ color: "#fff", fontSize: 30 }} />
            <p className="text-white 2xl:text-lg text-base font-[400]">
              ย้อนกลับ
            </p>
          </Link>
        </div>
      </div>
      <div className="bg-white w-full p-4 rounded-lg shadow">
        <div className="flex gap-4 items-end">
          <p className="text-[#013D59] text-lg">จำนวน (รายการ)</p>
          <div className="flex gap-2 items-end">
            <p className="text-[#013D59] text-lg">ทั้งหมด</p>

            <p className="text-[#313131] text-2xl font-bold bg-[#FFD25B] py-1 px-4 rounded-lg">
              {amountTotal || 0}
            </p>
            <p className="text-[#013D59] text-lg">รายการ</p>
          </div>
        </div>

        <div className="overflow-auto">
          <BarChart
            xAxis={[
              {
                data: days,
                scaleType: "band",
                categoryGapRatio: 0.6,
                barGapRatio: 0.1,
              },
            ]}
            series={[
              {
                label: "จำนวน (รายการ)",
                data: chartData,
                color: "#FFBA41",
              },
            ]}
            width={chartWidth}
            height={chartHeight}
            // barLabel="value"
          />
        </div>
      </div>
    </div>
  );
}

export default ChartToMonthly;
