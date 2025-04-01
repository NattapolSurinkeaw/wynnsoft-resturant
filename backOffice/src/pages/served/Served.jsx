import React, { useState, useEffect } from "react";
import FastfoodOutlinedIcon from "@mui/icons-material/FastfoodOutlined";
import dayjs from "dayjs";
import "dayjs/locale/th"; // ใช้ภาษาไทย
import ScheduleOutlinedIcon from "@mui/icons-material/ScheduleOutlined";
import { getOrderList } from "../../services/kitchen.service";
import { api_path } from "../../store/setting";
import { getUpdateStatusOrderList } from "../../services/kitchen.service";

function Served() {
  const [orderToday, setOrderToday] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  dayjs.locale("th");

  useEffect(() => {
    const fetchData = async() => {
      const res = await getOrderList();
      setOrderToday(res.orderList);
    }

    fetchData()
  }, [])

  useEffect(() => {
    if (orderToday.length > 0) {
      setFilteredOrders(getFilteredOrderDetails(orderToday));
    }
  }, [orderToday]);

  const getFilteredOrderDetails = (orderToday) => {
    return orderToday.filter((order) => order.status == "3")
  };

  const getServeOrder = (order) => {
    const params = {
      orderList : 
      [{
        id: order.id,
        status: 4
      }]
    }
    getUpdateStatusOrderList(params).then((res) => {
      console.log(res);
    })
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-shrink-0 gap-2 justify-start items-center">
        <FastfoodOutlinedIcon sx={{ color: "#00537B", fontSize: 35 }} />
        <p className="text-[#00537B] text-2xl font-[600]">รอเสริฟ</p>
      </div>

      <div className="grid max-md:grid-cols-2 max-lg:grid-cols-3 max-xxl:grid-cols-4 grid-cols-5 gap-3 2xl:gap-4">
        {filteredOrders.length === 0 ? (
          <div className="flex justify-center items-center w-full py-10 col-span-5 h-full">
            <p className="text-lg text-gray-500">ยังไม่มีออเดอร์พร้อมเสริฟ</p>
          </div>
        ) : (
          filteredOrders.map((order) => (
            <div key={order.id} className="bg-white w-full h-full rounded-lg 2xl:p-4 p-3 flex flex-col gap-4">
              { console.log(order)}
              <div className="flex 2xl:flex-row flex-col 2xl:gap-4 gap-2">
                <figure className="2xl:w-[150px] 2xl:h-[150px] w-full h-[120px] rounded-lg flex-shrink-0 shadow">
                  <img
                    src={api_path + order.food.thumbnail_link}
                    alt=""
                    className="w-full h-full rounded-lg object-cover"
                  />
                </figure>
                <div className="flex 2xl:flex-col flex-row w-full items-end 2xl:justify-start justify-center gap-3">
                  <p className="bg-[#FFBA41] p-1 2xl:w-[60px] h-[60px] sm:w-1/3 w-1/2 rounded-lg line-clamp-2 items-center flex justify-center break-all sm:flex-shrink-0 text-white text-sm font-[600]">
                    {order.order.table.title}
                  </p>
                  <div className="bg-[#EEEEEE] border border-[#D9D9D9] p-1 rounded-[10px] flex flex-col justify-center items-center 2xl:w-full sm:w-1/3 w-1/2 2xl:h-1/2 h-[60px] sm:flex-shrink-0">
                    <p className="text-[#00537B] font-[600] 2xl:text-3xl text-xl">
                      {" "}
                      {order.amount}
                    </p>
                    <p className="text-[#00537B] 2xl:text-lg text-sm">รายการ</p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col justify-start gap-1 ">
                <p className="xl:h-[60px] h-[50px] line-clamp-2 text-[#313131] xl:text-2xl text-lg font-bold break-all">
                  {order.food.name}
                </p>
                <div className="flex gap-1 items-end">
                  <p className="text-[#00537B] text-sm font-[400]">
                    {" "}
                    เลขออเดอร์ :
                  </p>
                  <p className="text-[#00537B] 2xl:text-lg text-sm font-[400] leading-none">
                    {order.order.order_number}
                  </p>
                </div>
                <div className="flex gap-1 ">
                  <ScheduleOutlinedIcon
                    sx={{ fontSize: 25 }}
                    className="text-[#8F8F8F]"
                  />
                  <p className="text-[#8F8F8F] 2xl:text-lg text-sm font-[400]">
                    {dayjs(order.updatedAt).format("HH:mm น.")}
                  </p>
                </div>
                <button 
                  onClick={() => getServeOrder(order)}
                  className="bg-[#013D59] hover:bg-[#FFBA41] rounded-lg py-2 text-white 2xl:text-xl md:text-lg font-[600] cursor-pointer transition-all duration-200 ease-in-out mt-4">
                  เสริฟออเดอร์
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Served;
