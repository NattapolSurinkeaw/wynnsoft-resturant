import React from "react";
import { Link } from "react-router-dom";

function Current({orderData}) {
  return (
    <>
      <div className="h-full bg-white rounded-lg shadow-sm py-4 px-5">
        <div className="flex justify-between items-center">
          <p className="text-[23px] text-[#013D59] font-[700]">รายการตอนนี้</p>
          <Link
            to="/ordersDay"
            className="text-[16px] text-[#013D59] font-[500] underline decoration-transparent hover:decoration-inherit cursor-pointer"
          >
            ดูทั้งหมด
          </Link>
        </div>

        <div className="overflow-y-auto px-2 mt-4">
          {orderData.slice(0, 7).map((item) => {
            let statusText = "";
            let statusColor = "";
            
            switch (item.orderList[0]?.status) {
              case "1":
                statusText = "รับออร์เดอร์";
                statusColor = "#F5A100";
                break;
              case "2":
                statusText = "อยู่ระหว่างปรุง";
                statusColor = "#F5A100";
                break;
              case "3":
                statusText = "พร้อมเสริฟ";
                statusColor = "#FF6A00";
                break;
              case "4":
                statusText = "เสริฟแล้ว";
                statusColor = "#FF6A00";
                break;
              case "6":
                statusText = "รายการครบ";
                statusColor = "#10D024";
                break;
              default:
                statusText = "";
                statusColor = "";
            }
  
            return (
              <div key={item.id}>
                <div className="flex justify-between">
                  <div className="flex justify-center items-center w-[60px] h-[60px] text-white text-[16px] font-[600] bg-[#FFBA41] rounded-lg">
                    {item.table.title}
                  </div>
                  <p className="w-[280px] text-[18px] text-[#013D59] font-[600]">
                    {item.orderList[0]?.food.name}
                  </p>
                  <div className="flex flex-col justify-center items-center gap-1">
                    <button
                      onClick={() =>
                        (window.location.href = `/ordersDay/detail/${item.id}`)
                      }
                      className="bg-[#00537B] hover:bg-[#F5A100] transition duration-300 text-white text-[16px] w-[90px] py-1 rounded-lg shadow-md cursor-pointer"
                    >
                      ดูรายการ
                    </button>
                    {statusText && (
                      <p
                        className="text-[14px] font-[400]"
                        style={{ color: statusColor }}
                      >
                        {statusText}
                      </p>
                    )}
                  </div>
                </div>
                <div className="border-b border-gray-200 mt-3 mb-3"></div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

export default Current;
