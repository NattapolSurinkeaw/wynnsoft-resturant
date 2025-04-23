import React from "react";
import { Link } from "react-router-dom";

const menuItems = [
  "เต้าหู้ไข่ & หมูสับผัดกระเทียมพริกไทย",
  "ปลากระพงทอดน้ำปลา",
  "ข้าวต้มทรงเครื่อง",
  "ข้าวต้มปลาทรงเครื่อง",
];

function ProductOutStock({outFoods}) {
  // console.log(outFoods);
  return (
    <div className="bg-white rounded-lg shadow-sm py-4 px-5 ">
      <div className="flex justify-between items-center">
        <p className="text-[23px] text-[#013D59] font-[700]">สินค้าหมด</p>
        <Link
          to="/outStock"
          className="text-[16px] text-[#013D59] font-[500] underline decoration-transparent hover:decoration-inherit cursor-pointer"
        >
          ดูทั้งหมด
        </Link>
      </div>
      <div className="mt-2">
        {outFoods.map((item, index) => (
          <div key={index}>
            <p className="text-[16px] text-[#00537B] font-[400]">{item.name}</p>
            <div className="border-b border-gray-200 mt-3 mb-3"></div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductOutStock;
