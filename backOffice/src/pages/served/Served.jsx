import React from "react";
import FastfoodOutlinedIcon from "@mui/icons-material/FastfoodOutlined";
import { orderToday } from "../../components/mockData/orderToDay";

function Served() {

  const filteredOrders = orderToday.filter((order) => order.status === "3");
  console.log("filteredOrders",filteredOrders);
  
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-shrink-0 gap-2 justify-start items-center">
        <FastfoodOutlinedIcon sx={{ color: "#00537B", fontSize: 35 }} />
        <p className="text-[#00537B] text-2xl font-[600]">รอเสริฟ</p>
      </div>
    </div>
  );
}

export default Served;
