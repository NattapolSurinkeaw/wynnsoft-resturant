import React from "react";
import { BarChart } from "@mui/x-charts/BarChart";
import { useMediaQuery } from "@mui/material";

function ChartToDay({ filteredOrders, amountTotal }) {
  const isLargeScreen = useMediaQuery("(min-width: 1280px)");
  const isMediumScreen = useMediaQuery("(min-width: 1024px)");

  const chartWidth = isLargeScreen ? 1550 : isMediumScreen ? 950 : 750;
  const chartHeight = isLargeScreen ? 700 : isMediumScreen ? 600 : 600;

  const timeLabels = Array.from(
    { length: 24 },
    (_, i) => `${String(i).padStart(2, "0")}:00`
  );

  const groupedData = {};
  filteredOrders.forEach((order) => {
    const hour = parseInt(order.formattedTime.split(":")[0]);
    if (!isNaN(hour)) {
      if (!groupedData[order.table]) {
        groupedData[order.table] = new Array(24).fill(0);
      }
      groupedData[order.table][hour] += order.totalamount;
    }
  });

  const seriesData = Object.keys(groupedData).map((table) => {
    return {
      label: `โต๊ะ ${table}`,
      data: groupedData[table],
      stack: "A",
      color: "#FFBA41",
    };
  });

  return (
    <div className="bg-white w-full p-4 rounded-lg shadow">
      <div className="flex gap-4 items-end">
        <p className="text-[#013D59] text-lg">จำนวน (รายการ)</p>
        <p className="text-[#313131] text-2xl font-bold bg-[#FFD25B] py-1 px-4 rounded-lg">
          {amountTotal} รายการ
        </p>
      </div>
      <div className="overflow-auto">
        <BarChart
          xAxis={[
            {
              data: timeLabels,
              scaleType: "band",
              categoryGapRatio: 0.6,
              barGapRatio: 0.1,
            },
          ]}
          series={seriesData}
          width={chartWidth}
          height={chartHeight}
          // barLabel="value"
        />
      </div>
    </div>
  );
}

export default ChartToDay;
