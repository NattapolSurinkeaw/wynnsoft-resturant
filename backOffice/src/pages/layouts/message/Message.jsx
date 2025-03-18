import React, { useState } from "react";
import { Link } from "react-router-dom";
import ListAltOutlinedIcon from "@mui/icons-material/ListAltOutlined";
import ContactPhoneOutlinedIcon from "@mui/icons-material/ContactPhoneOutlined";
import CircularProgress from "@mui/material/CircularProgress";
import { MessageOrderData } from "../../../components/mockData/MessageData/MessageData";
import { MessageCallData } from "../../../components/mockData/MessageData/MessageData";

function Message({ isImageVisible }) {
  const [activeTab, setActiveTab] = useState("order");
  const [loadingId, setLoadingId] = useState(null);

  const handleAccept = (id) => {
    setLoadingId(id);
    setTimeout(() => {
      console.log(`รับออเดอร์ที่ ID: ${id}`);
      setLoadingId(null);
    }, 1000);
  };

  return (
    <>
      {isImageVisible && (
        <div className="animate-swing-in-top-fwd fixed top-[5.4rem] right-7 w-[400px] h-[400px] bg-white shadow-md rounded-lg z-90">
          <div className="relative p-4 w-full">
            <img
              className=" absolute -top-[25px] xl:left-[12.2rem] left-[12.8rem] w-[35px] "
              src="/icons/triangle-svgrepo-com.png"
              alt=""
            />
            <Link
              to="/orders"
              className="text-[16px] font-[500] text-[#013D59] block text-end hover:underline"
            >
              ออเดอร์ทั้งหมด
            </Link>
            <div className="flex items-center gap-3 w-full mt-2">
              <button
                className={`flex w-1/2 py-1.5 px-3 rounded-lg justify-between items-center cursor-pointer shadow-sm  ${
                  activeTab === "order"
                    ? "bg-gradient-to-b from-[#FFD25B] to-[#FFAA33]"
                    : "bg-[#D9D9D9]/50"
                }`}
                onClick={() => setActiveTab("order")}
              >
                <div className="flex items-center gap-1">
                  <ListAltOutlinedIcon
                    sx={{ fontSize: 20 }}
                    className="text-[#00537B]"
                  />
                  <p className="text-[16px] font-[600] text-[#013D59]">
                    ออเดอร์
                  </p>
                </div>
                <p className="text-[16px] font-[600] text-[#F92727]">2</p>
              </button>
              <button
                className={`flex w-1/2 py-1.5 px-3 rounded-lg justify-between items-center cursor-pointer shadow-sm  ${
                  activeTab === "call"
                    ? "bg-gradient-to-b from-[#FFD25B] to-[#FFAA33]"
                    : "bg-[#D9D9D9]/50"
                }`}
                onClick={() => setActiveTab("call")}
              >
                <div className="flex items-center gap-1">
                  <ContactPhoneOutlinedIcon
                    sx={{ fontSize: 20 }}
                    className="text-[#00537B]"
                  />
                  <p className="text-[16px] font-[600] text-[#013D59]">
                    เรียกพนักงาน
                  </p>
                </div>
                <p className="text-[16px] font-[600] text-[#F92727]">3</p>
              </button>
            </div>

            {activeTab === "order" && (
              <div className="mt-2 overflow-y-auto max-h-[293px] px-2">
                {MessageOrderData.filter(
                  (order) => order.status === "1" || order.status === "2"
                )
                  .sort((a, b) => {
                    if (a.status === "2" && b.status !== "2") return -1;
                    if (a.status !== "2" && b.status === "2") return 1;

                    return new Date(b.createdAt) - new Date(a.createdAt);
                  })
                  .map((order) => (
                    <div
                      key={order.id}
                      className="flex w-full justify-between border-b border-gray-400/50 py-2.5"
                    >
                      <p className="text-[14px] font-[600] text-[#F5A100]">
                        โต๊ะ {order.Order.Table.title}
                      </p>
                      <p className="text-[14px] font-[400] text-[#013D59]">
                        {new Date(order.createdAt).toLocaleTimeString("th-TH", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                      <p
                        className={`text-[14px] font-[600] ${
                          order.status === "1"
                            ? "text-[#013D59]"
                            : order.status === "2"
                            ? "text-[#F92727]"
                            : ""
                        }`}
                      >
                        {(() => {
                          switch (order.status) {
                            case "1":
                              return "เพิ่มออเดอร์";
                            case "2":
                              return "ส่งออเดอร์";
                            default:
                              return "ไม่ทราบสถานะ";
                          }
                        })()}
                      </p>
                      <div className="text-[14px] font-[600] text-[#F5A100]">
                        {order.food_items}
                        <span className="text-[14px] font-[600] text-[#013D59] ml-2">
                          รายการ
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            )}

            {activeTab === "call" && (
              <div className="mt-2 overflow-y-auto max-h-[293px] px-2">
                {MessageCallData.sort(
                  (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
                ).map((order) => (
                  <div
                    key={order.id}
                    className="flex w-full justify-between items-center border-b border-gray-400/50 py-2.5"
                  >
                    <p
                      className={`w-[60px] text-[14px] font-[600] ${
                        order.status_call ? "text-[#F5A100]" : "text-[#F92727]"
                      }`}
                    >
                      {order.status_call
                        ? `โต๊ะ ${order.name_table}`
                        : "ห้องครัว"}
                    </p>
                    <p className="text-[14px] font-[400] text-[#013D59]">
                      {new Date(order.createdAt).toLocaleTimeString("th-TH", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                    <p className="text-[14px] font-[600] text-[#F92727]">
                      เรียกพนักงาน
                    </p>
                    <button
                      onClick={() => handleAccept(order.id)}
                      className={`w-[35px] h-[25px] rounded-md shadow-sm cursor-pointer text-[14px] font-[600] hover:bg-[#00537B] text-[#013D59] hover:text-white flex items-center justify-center ${
                        loadingId === order.id ? "bg-[#00537B]" : "bg-[#FFD25B]"
                      } `}
                      disabled={loadingId === order.id}
                    >
                      {loadingId === order.id ? (
                        <CircularProgress size={17} sx={{ color: "white" }} />
                      ) : (
                        "รับ"
                      )}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default Message;
