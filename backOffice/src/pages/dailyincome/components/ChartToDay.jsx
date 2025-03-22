import React from "react";
import { BarChart } from "@mui/x-charts/BarChart";

function ChartToDay({ filteredOrders }) {
  const timeLabels = [
    "00:00",
    "01:00",
    "02:00",
    "03:00",
    "04:00",
    "05:00",
    "06:00",
    "07:00",
    "08:00",
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
    "18:00",
    "19:00",
    "20:00",
    "21:00",
    "22:00",
    "23:00",
  ];

  const tableLabels = filteredOrders.map((order) => order.table); // ชื่อโต๊ะ
  const orderAmounts = filteredOrders.map((order) => order.totalamount); // จำนวนรายการ
  const formattedTimes = filteredOrders.map((order) => order.formattedTime); // เวลาจริง

  const orderAmountsByTime = new Array(24).fill(0);

  formattedTimes.forEach((time, index) => {
    const hour = parseInt(time.split(":")[0]);
    if (!isNaN(hour)) {
      orderAmountsByTime[hour] += orderAmounts[index];
    }
  });

  return (
    <div>
      <BarChart
        xAxis={[{ scaleType: "band", data: timeLabels }]}
        series={[
          {
            data: orderAmountsByTime,
            color: "#FFBA41",
            ...(tableLabels.length > 0 && {
              label: `โต๊ะ ${tableLabels.join(", ")}`,
            }),
          },
        ]}
        width={1600}
        height={800}
      />
    </div>
  );
}

export default ChartToDay;
