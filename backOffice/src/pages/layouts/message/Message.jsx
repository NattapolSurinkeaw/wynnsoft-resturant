import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Stack from "@mui/material/Stack";
import Slider from "@mui/material/Slider";
import VolumeDown from "@mui/icons-material/VolumeDown";
import VolumeUp from "@mui/icons-material/VolumeUp";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import ListAltOutlinedIcon from "@mui/icons-material/ListAltOutlined";
import ContactPhoneOutlinedIcon from "@mui/icons-material/ContactPhoneOutlined";
import CircularProgress from "@mui/material/CircularProgress";
import TuneOutlinedIcon from "@mui/icons-material/TuneOutlined";
import LyricsOutlinedIcon from "@mui/icons-material/LyricsOutlined";
// import { MessageOrderData } from "../../../components/mockData/MessageData/MessageData";
import { MessageCallData } from "../../../components/mockData/MessageData/MessageData";
import { Box } from "@mui/material";
import { getOrderCurrent } from "../../../services/order.service";
import { io } from "socket.io-client";
import { socketPath } from "../../../store/setting";

const socket = io(socketPath);

function Message({
  isImageVisible,
  setIsImageVisible,
  handleNotificationChange,
  handleSoundChange,
  handleVolumeChange,
  isNotificationsEnabled,
  isSoundEnabled,
  volume,
  setHasNotification,
}) {
  const [activeTab, setActiveTab] = useState("order");
  const [loadingId, setLoadingId] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [orderList, setOrderList] = useState([]);

  useEffect(() => {
    setIsOpen(false);
  }, [isImageVisible]);

  const totalInnerOrderCount = orderList.reduce((total, order) => {
    return total + (order.orderList?.length || 0);
  }, 0);
  

  const countPendingCall = MessageCallData.length;

  // console.log("countPendingOrders", countPendingOrders);
  // console.log("countPendingCall", countPendingCall);
  useEffect(() => {
    const fetchData = async() => {
      const res = await getOrderCurrent();
      setOrderList(res.orders);
    }

    fetchData()

    const handleNewOrder = () => {
      console.log("New Order Event Received");
      fetchData(); // โหลดข้อมูลใหม่เมื่อมี order ใหม่
    };

    socket.on("newOrder", handleNewOrder); // ฟัง event

    return () => {
      socket.off("newOrder", handleNewOrder); // ปิดเฉพาะ event handler ที่ถูกสร้างไว้
    };
  }, [])
  
  // console.log(orderList)
  

  const handleAccept = (id) => {
    setLoadingId(id);
    setTimeout(() => {
      console.log(`รับออเดอร์ที่ ID: ${id}`);
      setLoadingId(null);
    }, 1000);
  };

  const toggleSlide = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {isImageVisible && (
        <div
          onClick={() => setIsImageVisible(false)}
          className="fixed top-0 left-0 w-full h-full bg-black/10 bg-opacity-50 z-90"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="animate-swing-in-top-fwd fixed top-[5.4rem] right-7 w-[400px] h-[400px] bg-white shadow-md rounded-lg "
          >
            <div className="relative p-4 w-full">
              {/* Setting */}
              <div
                className={`absolute sm:top-0 top-[3rem] sm:-left-[51%] -left-0 w-[200px] bg-white shadow-1 rounded-lg p-4 transition-all duration-300 ${
                  isOpen
                    ? "transform translate-x-0 opacity-100 visible"
                    : "transform translate-x-full opacity-0 invisible"
                }`}
              >
                <div className="text-[16px] font-[600] text-[#013D59]">
                  <LyricsOutlinedIcon
                    sx={{ fontSize: 18 }}
                    className="text-[#00537B] mr-1"
                  />
                  ตั้งค่าควบคุม
                </div>
                <Box className="flex items-center w-full mt-1">
                  <FormControlLabel
                    control={
                      <Switch
                        checked={isNotificationsEnabled}
                        onChange={handleNotificationChange}
                      />
                    }
                    sx={{
                      "& .MuiFormControlLabel-label": {
                        marginRight: 0,
                      },
                      marginRight: 0,
                    }}
                  />
                  <p className="text-[14px] font-[500] text-[#013D59]">
                    แสดงการแจ้งเตือน
                  </p>
                </Box>
                <Box className="flex items-center w-full">
                  <FormControlLabel
                    control={
                      <Switch
                        checked={isSoundEnabled}
                        onChange={handleSoundChange}
                      />
                    }
                    sx={{
                      "& .MuiFormControlLabel-label": {
                        marginRight: 0,
                      },
                      marginRight: 0,
                    }}
                  />
                  <p className="text-[14px] font-[500] text-[#013D59]">เสียง</p>
                </Box>
                <p className="text-[14px] font-[500] text-[#013D59] mt-2">
                  ปรับระดับเสียง
                </p>
                <Stack
                  spacing={2}
                  direction="row"
                  sx={{
                    alignItems: "center",
                    fontSize: "0.8rem",
                    opacity: isSoundEnabled ? 1 : 0.5,
                    pointerEvents: isSoundEnabled ? "auto" : "none",
                  }}
                >
                  <VolumeDown
                    sx={{ fontSize: 20 }}
                    className="text-[#00537B]"
                  />
                  <Slider
                    aria-label="Volume"
                    value={volume}
                    onChange={handleVolumeChange}
                    sx={{ width: 150 }}
                    disabled={!isSoundEnabled}
                  />
                  <VolumeUp sx={{ fontSize: 20 }} className="text-[#00537B]" />
                </Stack>
              </div>

              <img
                className=" absolute -top-[25px] xl:left-[12.2rem] left-[12.8rem] w-[35px] "
                src="/icons/triangle-svgrepo-com.png"
                alt=""
              />
              <div className="flex items-center justify-between">
                <button onClick={toggleSlide} className="cursor-pointer">
                  <TuneOutlinedIcon
                    sx={{ fontSize: 25 }}
                    className="text-[#00537B] hover:text-[#F5A100]"
                  />
                </button>
                <Link
                  to="/ordersDay"
                  className="text-[16px] font-[500] text-[#013D59] text-end hover:underline"
                >
                  ออเดอร์ทั้งหมด
                </Link>
              </div>
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
                  <p className="text-[16px] font-[600] text-[#F92727]">
                    {totalInnerOrderCount}
                  </p>
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
                  <p className="text-[16px] font-[600] text-[#F92727]">
                    {countPendingCall}
                  </p>
                </button>
              </div>

              {activeTab === "order" && (
                <div className="mt-2 overflow-y-auto max-h-[293px] px-2">
                  {orderList
                    .map((order) => (
                      <div
                        key={order.id}
                        className="flex w-full justify-between border-b border-gray-400/50 py-2.5"
                      >
                        {
                          console.log(order)
                        }
                        <p className="text-[14px] font-[600] text-[#F5A100]">
                          โต๊ะ {order.table.title}
                        </p>
                        <p className="text-[14px] font-[400] text-[#013D59]">
                          {new Date(order.createdAt).toLocaleTimeString(
                            "th-TH",
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
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
                            switch (order.orderList[(order.orderList.length) - 1].status) {
                              case "1":
                                return "เพิ่มออเดอร์";
                              case "2":
                                return "กำลังปรุง";
                              case "3":
                                return "รอส่งออเดอร์";
                              case "4":
                                return "ส่งออเดอร์";
                              default:
                                return "ไม่ทราบสถานะ";
                            }
                          })()}
                        </p>
                        <div className="text-[14px] font-[600] text-[#F5A100]">
                          {order?.orderList?.length || 0}
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
                          order.status_call
                            ? "text-[#F5A100]"
                            : "text-[#F92727]"
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
                          loadingId === order.id
                            ? "bg-[#00537B]"
                            : "bg-[#FFD25B]"
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
        </div>
      )}
    </>
  );
}

export default Message;
