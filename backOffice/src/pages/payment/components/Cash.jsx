import React, { useEffect, useRef, useState } from "react";
import { NumericFormat } from "react-number-format";

function Cash({ Tatal, setCash, cash ,change ,setChange}) {
  const inputRef = useRef(null); // ใช้ useRef เพื่ออ้างอิง input

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus(); // ทำให้ input ได้รับโฟกัสเมื่อโหลดหน้า
    }
  }, []);

  useEffect(() => {
    const changeTotal = cash - Tatal;
    setChange(Math.max(0, changeTotal)); // ถ้าค่าติดลบให้เป็น 0
  }, [cash, Tatal]);

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
        <div className="border border-[#CACACA] bg-[#EEEEEE] py-2 px-4 rounded-lg w-full h-[50px] flex items-center justify-end">
          <p className="text-[#013D59] 2xl:text-4xl lg:text-3xl text-xl text-center font-bold">
            {formatNumber(Tatal)} ฿
          </p>
        </div>
      </div>

      <div className="flex lg:gap-6 gap-2 items-center">
        <p className="text-[#013D59] 2xl:text-3xl text-xl 2xl:max-w-[150px] max-w-[100px] w-full font-[600] flex-shrink-0 ">
          รับเงินสดมา
        </p>
        <div className="border border-[#CACACA] bg-[#EEEEEE] py-2 px-4 rounded-lg w-full h-[50px] flex items-center justify-end">
          <NumericFormat
            className="text-[#013D59] 2xl:text-4xl lg:text-3xl text-xl text-right placeholder:text-center font-bold bg-transparent outline-none w-full placeholder:text-xl placeholder:font-[400] placeholder:text-[#8F8F8F]"
            value={cash}
            thousandSeparator=","
            decimalScale={2}
            placeholder="กรอกจำนวนเงิน"
            suffix=" ฿"
            fixedDecimalScale
            allowNegative={false}
            allowLeadingZeros={false}
            onValueChange={(values) => {
              setCash(values.value);
            }}
            getInputRef={inputRef}
          />
        </div>
      </div>

      <div className="flex lg:gap-6 gap-2 items-center">
        <p className="text-[#013D59] 2xl:text-3xl text-xl 2xl:max-w-[150px] max-w-[100px] w-full font-[600] flex-shrink-0 ">
          เงินทอน
        </p>
        <div className="border border-[#CACACA] bg-[#EEEEEE] py-2 px-4 rounded-lg w-full h-[50px] flex items-center justify-end">
          <p className="text-[#013D59] 2xl:text-4xl lg:text-3xl text-xl text-center font-bold">
            {formatNumber(change)} ฿
          </p>
        </div>
      </div>
    </div>
  );
}

export default Cash;
