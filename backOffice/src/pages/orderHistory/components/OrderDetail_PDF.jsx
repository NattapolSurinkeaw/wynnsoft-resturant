import React, { useState } from "react";
import dayjs from "dayjs";
import "dayjs/locale/th"; // ใช้ภาษาไทย

function OrderDetail_PDF({
  detailData,
  groupedMenuDetails,
  tax,
  serviceCharge,
}) {
 

  const formattedDate = dayjs(detailData.createdAt, "DD-MM-YYYY").format(
    "DD MMMM YYYY"
  );
  
  const formatNumber = (num) =>
    Number(num).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  const serviceChargeTotal = detailData.totalSpecialPrice * (serviceCharge / 100);
  const grandTotal = detailData.totalSpecialPrice + serviceChargeTotal;
  const taxTotal = grandTotal * (tax / 100);
  const Tatal = grandTotal + taxTotal;

  return (
    <div id="print" className="w-full rounded-lg shadow flex flex-col mx-auto border border-[#EEEEEE]">
      <div className="flex justify-between bg-[#00537B] py-3 px-4 rounded-t-lg h-[90px]">
        <div className="flex gap-4 items-center">
          <div className="bg-white rounded-lg p-2 w-[80px] h-[80px] flex flex-col justify-center items-center flex-shrink-0">
            {/* <p className="text-lg text-[#00537B] font-[600]">โต๊ะ</p> */}
            <p className="text-lg text-[#00537B] font-[700] line-clamp-3 break-all">
              {detailData.tableDetails.name_table}
            </p>
          </div>
          <div className="flex flex-col">
            <p className="text-xl text-white font-[600]">ชื่อร้าน</p>
            <p className="text-lg text-white font-[600]">ที่อยู่ติดต่อ</p>
            <p className="text-sm text-white font-[600]">
              เลขประจำตัวผู้เสียภาษี : 11111111121
            </p>
          </div>
        </div>
        <div className="flex flex-col justify-between items-end text-right gap-3 h-full">
          <p className="text-lg text-white font-[600]">
            หมายเลขออเดอร์ : {detailData.order_number}
          </p>
          <p className="text-sm text-white font-[600] ">{formattedDate}</p>
        </div>
      </div>

      <div className="bg-white h-full rounded-b-lg flex flex-col ">
        {/* header */}
        <div className="bg-[#A9E8F9] py-1 px-4 flex justify-start w-full items-center gap-x-4">
          <p className="w-[55%] lg:text-base text-sm text-[#013D59] font-[500]">
            รายการ
          </p>
          <p className="w-[20%] lg:text-base text-sm text-[#013D59] font-[500] text-center">
            จำนวน
          </p>
          <p className="w-[30%] lg:text-base text-sm text-[#013D59] font-[500] text-right pr-4">
            ราคา
          </p>
        </div>
        {/* header */}

        <div className="h-full">
          {groupedMenuDetails.length > 0 ? (
            groupedMenuDetails.map((item) => (
              <div
                key={item.id}
                className="flex flex-col items-start py-1 px-4"
              >
                <div className="flex flex-row justify-between w-full items-end gap-4">
                  <p className="lg:text-base text-sm font-[500] line-clamp-1 w-[50%]">
                    {item.name}
                  </p>

                  <p className="lg:text-base text-sm font-[500] text-center w-[20%]">
                    {item.count}
                  </p>

                  <div className="w-[30%] flex flex-col justify-end text-right flex-1">
                    {item.specialPrice && (
                      <p className="text-[12px] font-[300] line-through">
                        {formatNumber(item.price * item.count)}
                      </p>
                    )}

                    <p className="lg:text-base text-sm font-[500]">
                      {/* ราคาที่ลดแล้ว คูณกับ จำนวน */}
                      {item.specialPrice
                        ? formatNumber(item.specialPrice * item.count)
                        : formatNumber(item.price * item.count)}{" "}
                      ฿
                    </p>
                  </div>
                </div>

                <p className="text-[12px] font-[300] max-w-[50%] w-full">
                  {item.detail}
                </p>
              </div>
            ))
          ) : (
            <div>No menu details available</div>
          )}
        </div>

        <div className="flex flex-col gap-1 py-1 mx-4 ">
          <div className="border-t-2 border-[#CACACA] rounded-full"></div>
          <div className="flex justify-between">
            <p className="lg:text-base text-sm font-[500]">ราคา</p>
            <p className="lg:text-base text-sm font-[400]">
              {formatNumber(detailData.totalSpecialPrice)} ฿
            </p>
          </div>
          <div className="flex justify-between">
            <p className="lg:text-base text-sm font-[500]">ส่วนลด</p>
            <p className="lg:text-base text-sm font-[400]">
              -{formatNumber(detailData.totalDiscount)} ฿
            </p>
          </div>

          {tax !== 0 && (
            <div className="flex justify-between">
              <p className="lg:text-base text-sm font-[500]">ภาษี 7%</p>
              <p className="lg:text-base text-sm font-[400]">
                {formatNumber(taxTotal)} ฿
              </p>
            </div>
          )}

          {serviceCharge !== 0 && (
            <div className="flex justify-between">
              <p className="lg:text-base text-sm font-[500]">
                Service charge 5%
              </p>
              <p className="lg:text-base text-sm font-[400]">
                {formatNumber(serviceChargeTotal)} ฿
              </p>
            </div>
          )}

          <div className="border-t-2 border-[#CACACA] border-dashed"></div>
        </div>

        <div className="flex flex-row gap-2 justify-end items-center w-full py-2 px-4">
          <p className="lg:text-2xl text-xl font-[700]">ยอดทั้งหมด</p>
          <p className="lg:text-2xl text-xl font-[700]">
            {formatNumber(Tatal)} ฿
          </p>
        </div>
        {detailData.note && (
          <div className="flex flex-row gap-2 justify-start items-start lg:py-2 py-1 px-4">
            <p className="lg:text-base text-sm font-[400] flex-shrink-0">
              หมายเหตุ :{" "}
            </p>
            <p className="lg:text-base text-sm font-[400] line-clamp-4">
              {detailData.note}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default OrderDetail_PDF;
