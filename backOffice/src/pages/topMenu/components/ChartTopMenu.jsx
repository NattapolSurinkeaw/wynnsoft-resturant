import React from "react";
import { PieChart } from "@mui/x-charts/PieChart";
import { useMediaQuery } from "@mui/material";

function ChartTopMenu({ Total, chartFilteredOrders, TotalTen }) {
  const isLargeScreen = useMediaQuery("(min-width: 1600px)"); // >= 1024px
  const isMediumScreen = useMediaQuery("(min-width: 768px)"); // >= 768px
  const chartWidth = isLargeScreen ? 800 : isMediumScreen ? 500 : 300;
  const chartHeight = isLargeScreen ? 600 : isMediumScreen ? 400 : 200;
  const formatNumber = (num) => Number(num).toLocaleString("en-US");
  
  return (
    <div className="flex lg:flex-row flex-col lg:gap-4 gap-8 bg-white p-4 shadow rounded-lg">
      <div className="flex flex-col gap-6 justify-center items-center mx-auto">
        <PieChart
          className="w-full pl-12 text-white"
          width={chartWidth}
          height={chartHeight}
          series={[
            {
              data: chartFilteredOrders.slice(0, 10).map((item) => ({
                value: item.amount,
                label: item.name,
              })),
              arcLabel: (params) => `${params.label}`,
              arcLabelStyle: {
                fontSize: 14,
                fontWeight: "bold",
                fill: "#fff",
                textAnchor: "middle",
                stroke: "black",
                strokeWidth: 0.5,
              },
            },
          ]}
        />
        <div className="flex gap-6 justify-center w-full items-end">
          <p className="text-[#013D59] text-2xl font-[500] leading-none">
            จำนวนยอดขาย 10 อันดับ
          </p>
          <strong className="text-[40px] text-[#013D59] leading-none">
            {formatNumber(TotalTen)}
          </strong>
          <p className="text-[#013D59] text-2xl font-[500] leading-none">
            รายการ
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-8 w-full">
        <div className="flex flex-col gap-4  w-full items-end">
          <div className="flex justify-between w-full items-end gap-6">
            <p className="text-[#013D59] xl:text-2xl lg:text-lg text-xl font-[600] leading-none w-[40%] flex-shrink-0">
              จำนวนยอดขายทั้งหมด
            </p>
            <p className="text-[#013D59] xl:text-2xl lg:text-lg text-xl font-[600] leading-none bg-[#FFD25B] rounded-lg shadow p-1.5 xl:max-w-[150px] lg:max-w-[100px] max-w-[200px] w w-full text-right">
              {formatNumber(Total)}
            </p>
            <p className="text-[#013D59] xl:text-2xl lg:text-lg text-xl font-[600] leading-none flex-shrink-0">
              รายการ/เดือน
            </p>
          </div>
          <div className="flex justify-between w-full items-end gap-6">
            <p className="text-[#013D59] xl:text-2xl lg:text-lg text-xl font-[600] leading-none w-[40%]">
              จำนวนยอดขาย 10 อันดับ
            </p>
            <p className="text-[#013D59] xl:text-2xl lg:text-lg text-xl font-[600] leading-none bg-[#FFD25B] rounded-lg shadow p-1.5 xl:max-w-[150px] lg:max-w-[100px] max-w-[200px] w-full text-right">
              {formatNumber(TotalTen)}
            </p>
            <p className="text-[#013D59] xl:text-2xl lg:text-lg text-xl font-[600] leading-none flex-shrink-0">
              รายการ/เดือน
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <p className="w-full text-[#013D59] text-xl font-[600]">
            อันดับยอดขาย
          </p>
          <div className="border-t border-[#013D59] rounded-full w-full "></div>
          <div className="w-full h-[500px] overflow-auto">
            {chartFilteredOrders.slice(0, 31).map((item) => (
              <div key={item.name} className="w-full items-center flex gap-4">
                <p className="text-[#013D59] text-lg font-[400] ">
                  {item.count}.{" "}
                </p>
                <p className="text-[#013D59] text-lg font-[400] w-[80%]">
                  {item.name}
                </p>
                <p className="text-[#013D59] text-lg font-[400]">
                  {item.amount}
                </p>
                <p className="text-[#013D59] text-lg font-[400]">รายการ</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChartTopMenu;
