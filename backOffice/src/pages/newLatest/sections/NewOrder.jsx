import React, { useState, useEffect } from "react";
import ScheduleOutlinedIcon from "@mui/icons-material/ScheduleOutlined";
import NewOrderModal from "../modal/NewOrderModal";
import { NewLatestData } from "../../../components/mockData/NewLatest/NewLatestData";

function NewOrder() {
  const [isOpenNewOrderModal, setIsOpenNewOrderModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  const filteredOrders = NewLatestData.filter((order) => order.status === "1");

  const handleOpenModal = (id) => {
    setSelectedOrderId(id); 
    setIsOpenNewOrderModal(true); 
  };

  return (
    <>
      <NewOrderModal
        isOpenNewOrderModal={isOpenNewOrderModal}
        closeModal={() => setIsOpenNewOrderModal(false)}
        orderId={selectedOrderId}
      />
      <div className="grid 2xl:grid-cols-5 lg:grid-cols-4 sm:grid-cols-3 grid-cols-2 2xl:gap-4 gap-2 w-full">
        {filteredOrders.map((order) => (
          <div
            key={order.id}
            className="w-full h-auto bg-white rounded-lg shadow-md 2xl:px-4 px-2 2xl:py-3 py-2"
          >
            <div className="flex 2xl:flex-row flex-col 2xl:gap-3 gap-2">
              <figure className="2xl:w-1/2 w-full 2xl:h-[130px] h-[120px]">
                <img
                  className="w-full h-full object-cover rounded-lg"
                  src={order.thumbnail_link.toLocaleString()}
                  alt=""
                />
              </figure>
              <div className="flex 2xl:w-1/2 2xl:flex-col flex-row items-end justify-center 2xl:gap-3 gap-2">
                <div className="flex flex-col items-center justify-center 2xl:w-[55px] sm:w-1/3 w-1/2 2xl:h-[55px] h-[50px] rounded-lg bg-[#FFBA41]">
                  <p className="text-center text-[16px] text-white font-[600] leading-5">
                    โต๊ะ <br />
                    <span className="2xl:text-[23px] text-[20px]">
                      {order.Order.Table.title.replace("โต๊ะ ", "")}
                    </span>
                  </p>
                </div>
                <div className="flex flex-col justify-center items-center 2xl:w-full sm:w-1/3 w-1/2 2xl:h-1/2 h-[50px] rounded-lg border-2 border-[#b6b6b6] bg-[#D9D9D9] 2xl:leading-6 leading-5">
                  <p className="text-[#00537B] 2xl:text-[25px] text-[20px] font-[600]">
                    {order.food_items.toLocaleString()}
                  </p>
                  <p className="text-[#00537B] 2xl:text-[16px] text-[14px] font-[400]">
                    รายการ
                  </p>
                </div>
              </div>
            </div>
            <p className="2xl:h-[60px] h-auto 2xl:text-[20px] text-[16px] font-[600] text-[#313131] 2xl:line-clamp-2 line-clamp-1 mt-2">
              {order.details}
            </p>
            <p className="text-[14px] text-[#00537B]">
              เลขออเดอร์ :{" "}
              <span className="2xl:text-[18px] text-[14px] font-[400]">
                {order.Order.order_number}
              </span>
            </p>
            <div className="flex items-center gap-1 mt-1">
              <ScheduleOutlinedIcon
                sx={{ fontSize: 25 }}
                className="text-[#8F8F8F]"
              />
              <p className="text-[#8F8F8F] 2xl:text-[18px] text-[12px] font-[400]">
                {new Date(order.createdAt).toLocaleTimeString("th-TH", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}{" "}
                น.
              </p>
            </div>
            <button
              onClick={() => handleOpenModal(order.id)}
              className="w-full py-2 text-white 2xl:text-[20px] text-[16px] font-[600] rounded-lg bg-[#013D59] hover:bg-[#005983] shadow-md cursor-pointer mt-4"
            >
              รับออเดอร์
            </button>
          </div>
        ))}
      </div>
    </>
  );
}

export default NewOrder;
