import React from "react";
import { Link } from "react-router-dom";
import { ControlData } from "../../../components/mockData/ControlData/ControlData";

function Payment() {
  return (
    <>
      <div className="h-full bg-white rounded-lg shadow-sm py-4 px-5">
        <div className="flex justify-between items-center">
          <p className="text-[23px] text-[#013D59] font-[700]">ชำระเงิน</p>
          <Link
            to="/payment"
            className="text-[16px] text-[#013D59] font-[500] underline decoration-transparent hover:decoration-inherit cursor-pointer"
          >
            ดูทั้งหมด
          </Link>
        </div>

        <div className=" overflow-y-auto px-2 mt-4">
          {ControlData.slice(0, 7).map((item) => (
            <div key={item.id}>
              <div className="flex justify-between ">
                <div className="flex justify-center items-center w-[60px] h-[60px] text-white text-[28px] font-[600] bg-[#FFBA41] rounded-lg">
                  {item.name_table}
                </div>
                <div className="w-[270px]">
                  <p className=" text-[18px] text-[#013D59] font-[600]">
                    #{item.order_number}
                  </p>
                  <p className="text-[18px] text-[#013D59] font-[400]">
                    5 รายการ
                  </p>
                </div>
                <div className="flex flex-col justify-center items-center gap-1">
                  <button
                    onClick={() =>
                      (window.location.href = `/ordersDay/detail/${item.id}`)
                    }
                    className="bg-[#00537B] hover:bg-[#F5A100] transition duration-300 text-white text-[16px] w-[100px] py-1 rounded-lg shadow-md cursor-pointer"
                  >
                    รอการชำระ
                  </button>
                </div>
              </div>
              <div className="border-b border-gray-200 mt-3 mb-3"></div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default Payment;
