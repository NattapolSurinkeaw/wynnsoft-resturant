import React, { useEffect, useRef, useState } from "react";
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";
import { Link, useLocation } from "react-router-dom";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import LeaderboardOutlinedIcon from "@mui/icons-material/LeaderboardOutlined";
import BackupTableSharpIcon from "@mui/icons-material/BackupTableSharp";
import dayjs from "dayjs";
import "dayjs/locale/th"; // ใช้ภาษาไทย
import { orderToday } from "../../components/mockData/orderToDay";
import * as XLSX from "xlsx";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import TableToMonthly from "./components/TableToMonthly";
import ChartToMonthly from "./components/ChartToMonthly";

function Monthlyincome() {
  dayjs.locale("th");
  const [activeTab, setActiveTab] = useState("TableToMonthly");
  const location = useLocation();
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(null); //ช่องทางชำระ
  const menuStatus = useRef(null);
  const [dateStart, setDateStart] = useState(null);
  const [dateEnd, setDateEnd] = useState(null);
  const [showMonthly, setShowMonthly] = useState(false);
  const [selectedMonthly, setSelectedMonthly] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get("tab") || "TableToMonthly";
    setActiveTab(tab);
  }, [location.search]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuStatus.current && !menuStatus.current.contains(event.target)) {
        setShowStatusMenu(false);
      }
    };
    if (showStatusMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showStatusMenu]);

  const clearFiltersStatus = () => {
    setSelectedStatus(null);
  };

  const getFilteredOrderDetails = (
    orderToday,
    selectedStatus,
    selectedMonthly
  ) => {
    return orderToday
      .filter((order) => order.status === "5")
      .map((order) => {
        const formattedDate = dayjs(order.createdAt).format("D MMMM YYYY");
        const formattedTime = dayjs(order.createdAt).format("HH:mm น.");

        let totalPrice = 0;
        let totalSpecialPrice = 0;
        let totalPriceAll = 0;
        let totalamount = 0;

        const filteredOrderList = order.orderList.filter(
          (orderItem) => orderItem.status === "4"
        );

        if (filteredOrderList.length === 0) {
          return null;
        }

        const mergedOrderList = Object.values(
          filteredOrderList.reduce((acc, orderItem) => {
            const key = `${orderItem.food.id}_${orderItem.food.name}_${orderItem.status}`;

            if (!acc[key]) {
              acc[key] = { ...orderItem };
            } else {
              acc[key].amount += orderItem.amount;
            }

            return acc;
          }, {})
        );

        mergedOrderList.forEach((orderItem) => {
          const foodItem = orderItem.food;
          if (foodItem) {
            const count = orderItem.amount || 1;
            const price = foodItem.price || 0;
            const specialPrice = foodItem.special_price || price;

            totalamount += count;
            totalPrice += price * count;
            totalPriceAll += specialPrice * count;

            if (foodItem.special_price) {
              totalSpecialPrice += specialPrice * count;
            }
          }
        });

        const totalDiscount = totalPrice - totalPriceAll;

        return {
          ...order,
          orderList: mergedOrderList,
          table: order.table ? order.table.title : "ไม่มีข้อมูลโต๊ะ",
          table_id: order.table?.id || null,
          formattedDate,
          formattedTime,
          totalPrice,
          totalSpecialPrice,
          totalDiscount,
          totalPriceAll,
          totalamount,
        };
      })
      .filter((order) => order !== null) // กรองค่า null ที่เกิดจากออเดอร์ที่ไม่มีสินค้า
      .filter((order) => {
        return !selectedStatus || order.payment === selectedStatus;
      });
  };

  const filteredByMonth = getFilteredOrderDetails(
    orderToday,
    selectedStatus,
    selectedMonthly
  )
    .filter((order) => {
      if (!selectedMonthly) return true; // If no month is selected, return all
      return dayjs(order.createdAt).format("MMMM YYYY") === selectedMonthly;
    })
    .map((item, index) => ({
      ...item,
      count: index + 1, // เพิ่มลำดับที่เริ่มจาก 1
    }));

  const filteredOrders = getFilteredOrderDetails(
    orderToday,
    selectedStatus,
    dateStart
  )
    .filter((order) => {
      if (!dateStart || !dateEnd) return true;

      const orderDate = dayjs(order.createdAt).startOf("day");
      const startDate = dayjs(dateStart).startOf("day");
      const endDate = dayjs(dateEnd).endOf("day");

      return orderDate.isBetween(startDate, endDate, null, "[]"); // ตรวจสอบว่าอยู่ในช่วงที่เลือก
    })
    .map((item, index) => ({
      ...item,
      count: index + 1, // เพิ่มลำดับที่เริ่มจาก 1
    }));

  const PriceTotal = filteredOrders.reduce(
    (sum, order) => sum + order.totalPrice,
    0
  );
  const DiscountTotal = filteredOrders.reduce(
    (sum, order) => sum + order.totalDiscount,
    0
  );

  const PriceAllTotal = filteredOrders.reduce(
    (sum, order) => sum + order.totalPriceAll,
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
      ...filteredOrders.map((item) => [
        item.count,
        item.order_number,
        item.formattedDate,
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
    XLSX.writeFile(wb, `Report_Monthly_income_${today}.xlsx`);
  };

  return (
    <div className="flex flex-col gap-4">
      {activeTab === "TableToMonthly" && (
        <div className="flex 2xl:flex-row flex-col  2xl:justify-between 2xl:h-[42px] h-full">
          <div className="flex flex-shrink-0 gap-2 justify-start items-center ">
            <LeaderboardOutlinedIcon sx={{ color: "#00537B", fontSize: 35 }} />
            <p className="text-[#00537B] text-2xl font-[600]">รายได้รายเดือน</p>
          </div>
          <div className="flex gap-3 justify-end w-full">
            <div className="relative" ref={menuStatus}>
              <div className="flex flex-shrink-0 gap-2 items-center">
                <p className="text-[#313131] 2xl:text-xl text-base font-[600] flex-shrink-0">
                  ช่องทางชำระ
                </p>
                <div
                  className="bg-white cursor-pointer flex justify-between items-center gap-2 py-1.5 px-2 rounded-lg shadow w-[250px] max-w-full"
                  onClick={() => setShowStatusMenu(!showStatusMenu)}
                >
                  <p className="text-[#313131] xl:text-lg text-base font-[400]">
                    {selectedStatus === "1"
                      ? "ชำระผ่าน QR"
                      : selectedStatus === "2"
                      ? "ชำระเงินสด"
                      : "เลือกการชำระ"}
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

              {/* ชำระเงิน */}
              <div
                className={`absolute w-full h-full ${
                  showStatusMenu ? "z-99" : "z-0"
                }`}
              >
                {showStatusMenu && (
                  <div className="bg-white flex flex-col gap-2 p-2 mt-2 rounded-lg shadow ">
                    <div
                      className={`py-2 px-4 cursor-pointer hover:bg-[#00537B] hover:text-white text-black rounded-lg ${
                        selectedStatus === null ? "bg-[#F5A100] text-white" : ""
                      }`}
                      onClick={() => {
                        clearFiltersStatus();
                        setTimeout(() => setShowStatusMenu(false), 0);
                      }}
                    >
                      ทั้งหมด
                    </div>
                    <div className="border-t border-[#e6e6e6] rounded-full w-full"></div>

                    <div
                      className={`py-2 px-4 cursor-pointer hover:bg-[#00537B] hover:text-white text-black rounded-lg ${
                        selectedStatus === "1" ? "bg-[#F5A100] text-white" : ""
                      }`}
                      onClick={() => {
                        setSelectedStatus("1");
                        setShowStatusMenu(false);
                      }}
                    >
                      ชำระผ่าน QR
                    </div>
                    <div
                      className={`py-2 px-4 cursor-pointer hover:bg-[#00537B] hover:text-white text-black rounded-lg ${
                        selectedStatus === "2" ? "bg-[#F5A100] text-white" : ""
                      }`}
                      onClick={() => {
                        setSelectedStatus("2");
                        setShowStatusMenu(false);
                      }}
                    >
                      ชำระเงินสด
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Monthly start*/}
            <div className="flex flex-shrink-0 gap-2 items-center max-lg:order-3">
              <p className="text-[#313131] 2xl:text-xl text-base font-[600] flex-shrink-0">
                ตั้งแต่
              </p>

              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer
                  components={["DatePicker"]}
                  sx={{
                    padding: "5px 0px 0px 0px",
                    paddingRight: "0px",
                    height: "45px",
                    width: "200px",
                  }}
                  className="lg:w-[200px] w-full"
                >
                  <DatePicker
                    value={dateStart}
                    onChange={(newValue) => setDateStart(newValue)}
                    sx={{ width: "250px", height: "100%" }}
                    format="DD-MM-YYYY"
                    slotProps={{
                      textField: {
                        placeholder: "วัน-เดือน-ปี",
                        label: null,
                        sx: {
                          backgroundColor: "#fff",
                          fontSize: "16px",
                          height: "100%",
                        },
                      },
                    }}
                  />
                </DemoContainer>
              </LocalizationProvider>
            </div>

            {/* to end*/}
            <div className="flex flex-shrink-0 gap-2 items-center max-lg:order-4">
              <p className="text-[#313131] 2xl:text-xl text-base font-[600] flex-shrink-0">
                จนถึง
              </p>

              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer
                  components={["DatePicker"]}
                  sx={{
                    padding: "5px 0px 0px 0px",
                    paddingRight: "0px",
                    height: "45px",
                    width: "200px",
                  }}
                  className="lg:w-[200px] w-full"
                >
                  <DatePicker
                    value={dateEnd}
                    onChange={(newValue) => setDateEnd(newValue)}
                    sx={{ width: "250px", height: "100%" }}
                    format="DD-MM-YYYY"
                    slotProps={{
                      textField: {
                        placeholder: "วัน-เดือน-ปี",
                        label: null,
                        sx: {
                          backgroundColor: "#fff",
                          fontSize: "16px",
                          height: "100%",
                        },
                      },
                    }}
                  />
                </DemoContainer>
              </LocalizationProvider>
            </div>

            <button
              onClick={exportToExcel}
              className="max-lg:order-2 bg-[#00537B] cursor-pointer 2xl:max-w-[200px] lg:max-w-[160px] max-w-[200px] w-full flex flex-shrink-0 justify-center items-center gap-1 p-1 px-4 rounded-lg shadow hover:bg-[#F5A100] transition-all duration-200 ease-in-out"
            >
              <FileUploadOutlinedIcon sx={{ color: "#fff", fontSize: 30 }} />
              <p className="text-white 2xl:text-lg text-base font-[400]">
                Export Excel
              </p>
            </button>

            <Link
              to={`/monthlyincome?tab=ChartToMonthly`}
              className="max-lg:order-2 bg-[#00537B] cursor-pointer 2xl:max-w-[200px] lg:max-w-[160px] max-w-[200px] w-full flex flex-shrink-0 justify-center items-center gap-1 p-1 px-4 rounded-lg shadow hover:bg-[#F5A100] transition-all duration-200 ease-in-out"
            >
              <TrendingUpIcon sx={{ color: "#fff", fontSize: 30 }} />
              <p className="text-white 2xl:text-lg text-base font-[400]">
                แสดงกราฟ
              </p>
            </Link>
          </div>
        </div>
      )}

      {activeTab === "TableToMonthly" && (
        <TableToMonthly
          filteredOrders={filteredOrders}
          PriceTotal={PriceTotal}
          DiscountTotal={DiscountTotal}
          PriceAllTotal={PriceAllTotal}
        />
      )}

      {activeTab === "ChartToMonthly" && (
        <ChartToMonthly
          filteredByMonth={filteredByMonth}
          setShowMonthly={setShowMonthly}
          showMonthly={showMonthly}
          selectedMonthly={selectedMonthly}
          setSelectedMonthly={setSelectedMonthly}
        />
      )}
    </div>
  );
}

export default Monthlyincome;
