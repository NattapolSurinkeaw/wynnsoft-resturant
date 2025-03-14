import React, { useState } from "react";
import NewOrder from "./sections/NewOrder";
import OrderProgress from "./sections/OrderProgress";
import SendOrder from "./sections/SendOrder";

function NewLatest() {
  const [activeTab, setActiveTab] = useState("newOrder");

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
        {activeTab === "newOrder" && <NewOrder />}
        {activeTab === "orderProgress" && <OrderProgress />}
        {activeTab === "sendOrder" && <SendOrder />}
      </div>
    </div>
  );
}

export default NewLatest;
