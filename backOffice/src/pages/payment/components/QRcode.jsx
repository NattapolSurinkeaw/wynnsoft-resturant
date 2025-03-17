import React from "react";

function QRcode({ Tatal }) {
  
  const formatNumber = (num) =>
    Number(num).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  return (
    <div className="flex flex-col h-full gap-6">
      <div className="flex lg:gap-6 gap-2 items-center">
        <p className="text-[#013D59] 2xl:text-3xl text-xl 2xl:max-w-[150px] max-w-[100px] w-full font-[600] flex-shrink-0 ">
          ยอดทั้งหมด
        </p>
        <div className="border border-[#CACACA] bg-[#EEEEEE] py-2 px-4 rounded-lg w-full h-[50px] flex items-center justify-center">
          <p className="text-[#013D59] 2xl:text-4xl lg:text-3xl text-xl text-center font-bold">
            {formatNumber(Tatal)} ฿
          </p>
        </div>
      </div>

      <div className="border border-[#CACACA] bg-white shadow p-4 rounded-3xl flex flex-col justify-between items-center gap-4 h-full">
        <figure className="w-[200px] h-[50px]">
          <img src="/icons/prompt-pay.svg" alt="" className="w-full h-full" />
        </figure>

        <figure className="max-w-[250px] w-full max-h-[250px] h-full">
          <img src="/images/img/qrcode.svg" alt="" className="w-full h-full" />
        </figure>
        <div className="flex flex-col justify-center items-center gap-0.5">
          <p className="text-[#313131] 2xl:text-3xl text-xl">
            พร้อมเพย์ 011-111-1111
          </p>
          <p className="text-[#313131] 2xl:text-2xl text-lg">
            บัญชี ชื่อ xxxxxxxx xxxxx
          </p>
        </div>
      </div>
    </div>
  );
}

export default QRcode;
