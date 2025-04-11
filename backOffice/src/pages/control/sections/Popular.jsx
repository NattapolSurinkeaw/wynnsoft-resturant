import React from "react";
import ProductOutStock from "./ProductOutStock";
import { Link } from "react-router-dom";
import { api_path } from "../../../store/setting";


function Popular({sortedSummary, outFoods}) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col justify-between h-full bg-white rounded-lg shadow-sm ">
        <p className="text-center text-[23px] text-[#013D59] font-[700] mt-4">
          ยอดฮิตประจำเดือน
        </p>

        <div className="w-full mt-3 px-5">
          <div className="flex">
            <p className="w-[180px] text-[16px] text-[#00537B] font-[700]">
              อันดับ
            </p>
            <p className="text-[16px] text-[#00537B] font-[700]">ชื่อเมนู</p>
          </div>

          <div className="overflow-hidden">
            {sortedSummary.slice(0, 4).map((item, index) => (
              <div key={index}>
                <div className="flex mt-1">
                  <div className="flex items-center w-[180px]">
                    <p className="text-[23px] text-[#F5A100] font-[700]">
                      {item.name_table}
                    </p>
                    <figure className="w-[50px] h-[50px] ml-12 rounded-lg shadow-sm">
                      <img
                        className="w-full h-full object-cover rounded-lg"
                        src={ api_path + item.image}
                        alt={item.name}
                      />
                    </figure>
                  </div>
                  <div>
                    <p className="text-[16px] text-[#00537B] font-[400] line-clamp-1">
                      {item.name}
                    </p>
                    <p className="text-[16px] text-[#00537B] font-[400]">
                      จำนวน :{" "}
                      <span className="text-[#F5A100]">{item.amount}</span>
                    </p>
                  </div>
                </div>
                <div className="border-b border-gray-200 mt-3 mb-3"></div>
              </div>
            ))}
          </div>
        </div>

        <Link
          to="/topMenu"
          className="flex justify-center items-center w-full text-white bg-[#00537B] hover:bg-[#F5A100] transition duration-300 py-1.5 cursor-pointer rounded-b-lg"
        >
          ดูทั้งหมด
        </Link>
      </div>

      <ProductOutStock outFoods={outFoods} />
    </div>
  );
}

export default Popular;
