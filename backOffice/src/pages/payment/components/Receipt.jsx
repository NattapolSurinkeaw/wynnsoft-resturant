import React from "react";

function Receipt({
  detailOrder,
  formattedDate,
  formatNumber,
  groupedMenuDetails,
  serviceCharge,
  tax,
  totalPriceAll,
  totalDiscount,
}) {
  const serviceChargeTotal = totalPriceAll * (serviceCharge / 100);
  const grandTotal = totalPriceAll + serviceChargeTotal;
  const taxTotal = grandTotal * (tax / 100);
  const Tatal = grandTotal + taxTotal;
  return (
    <div id="print" className="w-[400px] h-full flex flex-col">
      <div className="flex justify-between bg-white py-3 pl-4 pr-10 h-full">
        <div className="flex gap-2 items-center">
          <div className="bg-white rounded-lg p-0.5 w-[80px] h-[80px] flex gap-1 justify-center items-center flex-shrink-0 border shadow">
          <img
            className="w-full h-auto"
            src="/icons/โลโก้-Soju-Day-Final-1.png"
            alt=""
          />
          </div>
          <div className="flex flex-col">
            <p className="text-lg text-black font-[600]">ชื่อร้าน</p>
            <p className="text-sm text-black font-[600]">ที่อยู่ติดต่อ</p>
            <p className="text-sm text-black font-[600]">
              เลขประจำตัวผู้เสียภาษี : 11111111121
            </p>
          </div>
        </div>
        <div className="flex flex-col justify-between gap-2">
          <p className="text-lg text-right text-black font-[600] ">
            หมายเลขออเดอร์ : {detailOrder.order_number}
          </p>
          <p className="text-sm text-black text-right font-[600] ">
            {formattedDate}
          </p>
        </div>
      </div>

      <div className="bg-white h-full flex flex-col ">
        {/* header */}
        <div className="bg-white py-1 pl-4 pr-10 flex justify-start w-full items-center gap-x-4">
          <p className="w-[55%] text-sm text-black font-[500]">รายการ</p>
          <p className="w-[10%] text-sm text-black font-[500] text-center">
            จำนวน
          </p>
          <p className="w-[30%] text-sm text-black font-[500] text-right pr-4">
            ราคา
          </p>
        </div>
        {/* header */}

        <div className={`h-full`}>
          {groupedMenuDetails.length > 0 ? (
            groupedMenuDetails.map((item) => (
              <div key={item.id} className="flex flex-col items-start py-1 pl-4 pr-10" >
                <div className="flex flex-row justify-between w-full items-end gap-4">
                  <p
                    className={`text-sm font-[500] line-clamp-1 w-[50%] ${
                      item.status === "5" ? "line-through text-gray-700" : ""
                    }`}
                  >
                    {item.name}
                  </p>

                  <p
                    className={`text-sm font-[500] line-clamp-1 text-center w-[10%] ${
                      item.status === "5" ? "line-through text-gray-700" : ""
                    }`}
                  >
                    {item.amount}
                  </p>

                  <div className="w-[30%] flex justify-between">
                    {item.status === "5" && (
                      <p
                        className={`text-sm font-[500] ${
                          item.status === "5" ? " text-gray-700" : ""
                        }`}
                      >
                        ยกเลิก
                      </p>
                    )}
                    <div className=" flex flex-col justify-end text-right flex-1">
                      {item.special_price > 0 && (
                        <p className="text-[12px] font-[300] line-through">
                          {formatNumber(item.price * item.amount)}
                        </p>
                      )}

                      <p
                        className={`text-sm font-[500] ${
                          item.status === "5"
                            ? "line-through text-gray-700"
                            : ""
                        }`}
                      >
                        {formatNumber(
                          (item.special_price || item.price) * item.amount
                        )}{" "}
                        ฿
                      </p>
                    </div>
                  </div>
                </div>

                {item.status !== "5" && (
                  <p className="text-[12px] font-[400] max-w-[50%] w-full">
                    {item.details}
                  </p>
                )}
              </div>
            ))
          ) : (
            <div>No menu details available</div>
          )}
        </div>

        <div className="flex flex-col gap-1 py-1 pl-4 pr-10 ">
          <div className="border-t border-[#CACACA] rounded-full"></div>
          <div className="flex justify-between">
            <p className="text-sm font-[500]">ราคา</p>
            <p className="text-sm font-[400]">
              {formatNumber(totalPriceAll)} ฿
            </p>
          </div>
          <div className="flex justify-between">
            <p className="text-sm font-[500]">ส่วนลด</p>
            <p className="text-sm font-[400]">
              -{formatNumber(totalDiscount)} ฿
            </p>
          </div>

          {tax !== 0 && (
            <div className="flex justify-between">
              <p className="text-sm font-[500]">ภาษี {tax}%</p>
              <p className="text-sm font-[400]">{formatNumber(taxTotal)} ฿</p>
            </div>
          )}

          {serviceCharge !== 0 && (
            <div className="flex justify-between">
              <p className="text-sm font-[500]">
                Service charge {serviceCharge}%
              </p>
              <p className="text-sm font-[400]">
                {formatNumber(serviceChargeTotal)} ฿
              </p>
            </div>
          )}

          <div className="border-t border-[#CACACA] border-dashed"></div>
        </div>

        <div className="flex flex-row gap-2 justify-end items-center w-full py-2 pl-4 pr-10">
          <p className="text-xl font-[700]">ยอดทั้งหมด</p>
          <p className="text-xl font-[700]">{formatNumber(Tatal)} ฿</p>
        </div>
        {detailOrder.order_note && (
          <div className="flex w-full flex-row gap-2 justify-start items-start lg:py-2 py-1 pl-4 pr-10 ">
            <p className="text-sm font-[400] flex-shrink-0">หมายเหตุ :</p>
            <p className="text-sm font-[400] line-clamp-3">
              {detailOrder.order_note}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Receipt;
