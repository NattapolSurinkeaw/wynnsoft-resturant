import React from "react";
import ScheduleOutlinedIcon from "@mui/icons-material/ScheduleOutlined";

function NewOrder() {
  return (
    <div className="grid grid-cols-5 gap-4 w-full">
      <div className="w-full h-[355px] bg-white rounded-lg shadow-md px-4 py-3">
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
                <span className="text-[23px]">01</span>
              </p>
            </div>
            <div className="flex flex-col justify-center items-center w-[110px] h-[82px] rounded-lg border-2 border-[#b6b6b6] bg-[#D9D9D9] leading-6">
              <p className="text-[#00537B] text-[25px] font-[600]">1,000</p>
              <p className="text-[#00537B] text-[16px] font-[400]">รายการ</p>
            </div>
          </div>
        </div>
        <p className="text-[20px] font-[600] text-[#313131] mt-2">
          เต้าหู้ไข่ & หมูสับผัดกระเทียม พริกไทย
        </p>
        <p className="text-[14px] text-[#00537B]">
          เลขออเดอร์ : <span className="text-[18px] font-[400]">000001</span>
        </p>
        <div className="flex items-center gap-1 mt-1">
          <ScheduleOutlinedIcon
            sx={{ fontSize: 25 }}
            className="text-[#8F8F8F]"
          />
          <p className="text-[#8F8F8F] text-[18px] font-[400]">11.00 น.</p>
        </div>
        <button className="w-full py-2 text-white text-[20px] font-[600] rounded-lg bg-[#013D59] hover:bg-[#005983] shadow-md cursor-pointer mt-2">
          รับออเดอร์
        </button>
      </div>
    </div>
  );
}

export default NewOrder;
