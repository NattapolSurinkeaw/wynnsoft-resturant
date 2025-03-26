import React, { useState, useEffect } from "react";
import NewOrder from "./sections/NewOrder";
import OrderProgress from "./sections/OrderProgress";
import SendOrder from "./sections/SendOrder";
import { getOrderList } from "../../services/kitchen.service";
import { io } from "socket.io-client";
import { socketPath } from "../../store/setting";

const socket = io(socketPath);

function NewLatest() {
  const [activeTab, setActiveTab] = useState("newOrder");
  const [orderListAll, setOrderListAll] = useState([]);

  const fetchData = async() => {
    const res = await getOrderList()
    setOrderListAll(res.orderList)
  }

  useEffect(() => {
    fetchData(); // โหลดข้อมูลครั้งแรก

    // สร้าง handler แยกออกมา
    const handleNewOrder = () => {
      console.log("New Order Event Received");
      fetchData(); // โหลดข้อมูลใหม่เมื่อมี order ใหม่
    };

    socket.on("newOrder", handleNewOrder); // ฟัง event

    return () => {
      socket.off("newOrder", handleNewOrder); // ปิดเฉพาะ event handler ที่ถูกสร้างไว้
    };
  }, []);

  return (
    <div>
      <div className="flex items-center gap-4 w-full">
        <button
          className={`w-[150px] py-1.5 rounded-lg text-[16px] font-[600] shadow-md cursor-pointer ${
            activeTab === "newOrder"
              ? "bg-[#00537B] text-white"
              : "bg-[#FFD25B] text-[#00537B]"
          }`}
          onClick={() => setActiveTab("newOrder")}
        >
          ออเดอร์ใหม่
        </button>
        <button
          className={`w-[150px] py-1.5 rounded-lg text-[16px] font-[600] shadow-md cursor-pointer ${
            activeTab === "orderProgress"
              ? "bg-[#00537B] text-white"
              : "bg-[#FFD25B] text-[#00537B]"
          }`}
          onClick={() => setActiveTab("orderProgress")}
        >
          กำลังทำ
        </button>
        <button
          className={`w-[150px] py-1.5 rounded-lg text-[16px] font-[600] shadow-md cursor-pointer ${
            activeTab === "sendOrder"
              ? "bg-[#00537B] text-white"
              : "bg-[#FFD25B] text-[#00537B]"
          }`}
          onClick={() => setActiveTab("sendOrder")}
        >
          ส่งออเดอร์
        </button>
      </div>

      <div className="mt-4 ">
        {activeTab === "newOrder" && <NewOrder orderListAll={orderListAll} />}
        {activeTab === "orderProgress" && <OrderProgress orderListAll={orderListAll} />}
        {activeTab === "sendOrder" && <SendOrder orderListAll={orderListAll} />}
      </div>
    </div>
  );
}

export default NewLatest;
