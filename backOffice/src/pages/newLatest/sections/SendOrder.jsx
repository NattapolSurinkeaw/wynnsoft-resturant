import React from "react";
import ScheduleOutlinedIcon from "@mui/icons-material/ScheduleOutlined";
import { NewLatestData } from "../../../components/mockData/NewLatest/NewLatestData";

function SendOrder() {
  const filteredOrders = NewLatestData.filter((order) => order.status === "3");

  return (
    <div className="grid grid-cols-5 gap-4 w-full">
      {filteredOrders.map((order) => (
        <div
          key={order.id}
          className="w-full h-[355px] bg-white rounded-lg shadow-md px-4 py-3"
        >
          <div className="flex justify-between">
            <figure className="w-[150px] h-[150px]">
              <img
                className="w-full h-full object-cover rounded-lg"
                src="/images/1.jpg"
                alt=""
              />
            </figure>
            <div className="flex flex-col items-end gap-3">
              <div className="flex flex-col items-center justify-center w-[56px] h-[56px] rounded-lg bg-[#FFBA41]">
                <p className="text-center text-[16px] text-white font-[600] leading-5">
                  โต๊ะ <br />
                  <span className="text-[23px]">
                    {order.Order.Table.title.replace("โต๊ะ ", "")}
                  </span>
                </p>
              </div>
              <div className="flex flex-col justify-center items-center w-[110px] h-[82px] rounded-lg border-2 border-[#b6b6b6] bg-[#D9D9D9] leading-6">
                <p className="text-[#00537B] text-[25px] font-[600]">
                  {order.food_items.toLocaleString()}
                </p>
                <p className="text-[#00537B] text-[16px] font-[400]">รายการ</p>
              </div>
            </div>
          </div>
          <p className="h-[60px] text-[20px] font-[600] text-[#313131] line-clamp-2 mt-2">
            {order.details}
          </p>
          <p className="text-[14px] text-[#00537B]">
            เลขออเดอร์ :{" "}
            <span className="text-[18px] font-[400]">
              {order.Order.order_number}
            </span>
          </p>
          <div className="flex items-center gap-1 mt-1">
            <ScheduleOutlinedIcon
              sx={{ fontSize: 25 }}
              className="text-[#8F8F8F]"
            />
            <p className="text-[#8F8F8F] text-[18px] font-[400]">
              {new Date(order.createdAt).toLocaleTimeString("th-TH", {
                hour: "2-digit",
                minute: "2-digit",
              })}{" "}
              น.
            </p>
          </div>

          <p className=" text-center text-[#F44D4D] text-[20px] font-[600] mt-4">
            รอเสริฟ
          </p>
        </div>
      ))}
    </div>
  );
}

export default SendOrder;
