import React from "react";
import ScheduleOutlinedIcon from "@mui/icons-material/ScheduleOutlined";
// import { NewLatestData } from "../../../components/mockData/NewLatest/NewLatestData";
// import { orderToday } from "../../../components/mockData/orderToDay";
import { api_path } from "../../../store/setting";

function SendOrder({ orderListAll }) {
  const filteredOrders = orderListAll.filter((order) => order.status === "3");

  return (
    <div className="grid max-md:grid-cols-2 max-lg:grid-cols-3 max-xxl:grid-cols-4 grid-cols-5 gap-3 2xl:gap-4">
      {filteredOrders.map((order) => (
        <div
          key={order.id}
          className="w-full h-auto bg-white rounded-lg shadow-md 2xl:px-4 px-2 2xl:py-3 py-2"
        >
          <div className="flex 2xl:flex-row flex-col 2xl:gap-4 gap-2">
            {order.food && (
              <figure className="2xl:w-[150px] 2xl:h-[150px] w-full h-[120px] rounded-lg flex-shrink-0 shadow">
                <img
                  className="w-full h-full object-cover rounded-lg"
                  src={api_path + order.food.thumbnail_link}
                  alt={order.food.name}
                />
              </figure>
            )}
            <div className="flex 2xl:w-1/2 2xl:flex-col flex-row items-end justify-center 2xl:gap-3 gap-2">
              <p className="bg-[#FFBA41] p-1 2xl:w-[60px] xl:h-[60px] h-[50px] sm:w-1/3 w-1/2 rounded-lg line-clamp-2 items-center flex justify-center break-all sm:flex-shrink-0 text-white text-sm font-[600]">
                {order.order.table.title.replace("โต๊ะ ", "")}
              </p>
              <div className="flex flex-col justify-center items-center sm:flex-shrink-0 2xl:w-full sm:w-1/3 w-1/2 2xl:h-1/2 xl:h-[60px] h-[50px] rounded-lg bg-[#EEEEEE] border border-[#D9D9D9] 2xl:leading-6 leading-5">
                {order && (
                  <p className="text-[#00537B] 2xl:text-[25px] text-[20px] font-[600]">
                    {order.amount}
                  </p>
                )}
                <p className="text-[#00537B] 2xl:text-[16px] text-[14px] font-[400]">
                  รายการ
                </p>
              </div>
            </div>
          </div>
          {order.food && (
            <p className="2xl:h-[60px] h-auto 2xl:text-[20px] text-[16px] font-[600] text-[#313131] 2xl:line-clamp-2 line-clamp-1 mt-2 break-all">
              {order.food.name}
            </p>
          )}
          <p className="text-[14px] text-[#00537B]">
            เลขออเดอร์ :{" "}
            <span className="2xl:text-[18px] text-[14px] font-[400]">
              {order.order.order_number}
            </span>
          </p>
          <div className="flex items-center gap-1 mt-1">
            <ScheduleOutlinedIcon
              sx={{ fontSize: 25 }}
              className="text-[#8F8F8F]"
            />
            <p className="text-[#8F8F8F] 2xl:text-[18px] text-[12px] font-[400]">
              {new Date(order.updatedAt).toLocaleTimeString("th-TH", {
                hour: "2-digit",
                minute: "2-digit",
              })}{" "}
              น.
            </p>
          </div>

          <p className=" text-center text-[#F44D4D] 2xl:text-[20px] text-[16px] font-[600] mt-5">
            รอเสริฟ
          </p>
        </div>
      ))}
    </div>
  );
}

export default SendOrder;
