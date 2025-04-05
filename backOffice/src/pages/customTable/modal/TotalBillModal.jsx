import React, { useState } from "react";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";

function TotalBillModal({ isTotalBill, closeModal, orderData }) {
  const tax = 7;
  const serviceCharge = 5;
  if (!isTotalBill) return null;

  const { total_price, total_special_price, total_rawPrice } =
    orderData?.orderList.reduce(
      (acc, item) => {
        const price = item.food.price || 0;
        const specialPrice = item.food.special_price || 0;
        const rawPrice = item.food.special_price != null
          ? item.food.special_price
          : price;

        acc.total_price += price;
        acc.total_special_price += specialPrice;
        acc.total_rawPrice += rawPrice;

        return acc;
      },
      {
        total_price: 0,
        total_special_price: 0,
        total_rawPrice: 0,
      }
    ) || {
      total_price: 0,
      total_special_price: 0,
      total_rawPrice: 0,
    }

    const priceService = total_rawPrice * (serviceCharge / 100);
    const priceTax = (total_rawPrice + priceService) * (tax / 100);

  return (
    isTotalBill && (
      <div className="fixed inset-0 bg-black/60 bg-opacity-50 flex items-center justify-center px-12 z-20">
        <div className=" relative bg-white rounded-lg shadow-lg w-[800px]">
          <button
            onClick={closeModal}
            className=" absolute -top-8 -right-8 cursor-pointer"
          >
            <CancelOutlinedIcon
              sx={{ fontSize: 35 }}
              className="text-white hover:text-red-500"
            />
          </button>

          {orderData && (
            <div className="flex items-center justify-between w-full rounded-t-lg bg-[#013D59] px-6 py-3">
              <div className="flex items-center gap-2">
                <span className="text-[23px] font-[600] text-white">โต๊ะ</span>
                <span className="text-[23px] font-[600] text-white">
                  {orderData.table.title}
                </span>
              </div>
              <div className="flex items-center">
                <p className="text-[16px] font-[400] text-white">
                  เลขออเดอร์ :
                </p>
                <p className="ml-2 text-[18px] font-[600] text-white">
                  {orderData.order_number}
                </p>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between bg-[#A9E8F9] px-6 py-1">
            <p className="min-w-[240px] text-[18px] font-[600] text-[#013D59]">
              รายการ
            </p>
            <p className="min-w-[15px] text-[18px] font-[600] text-[#013D59]">
              จำนวน
            </p>
            <p className="min-w-[110px] text-end text-[18px] font-[600] text-[#013D59]">
              ราคา
            </p>
          </div>

          <div className="w-full h-[420px] py-3 overflow-y-auto">
            {orderData && orderData.orderList.length > 0 ? (
              orderData.orderList.map((item) => (
                <div
                  key={item.id}
                  className="flex items-start justify-between px-6 mt-2"
                >
                  {console.log(item)}
                  <p className="min-w-[240px] text-[18px] font-[500] text-[#313131]">
                    {item.food.name} <br />
                    <span className="text-[14px] font-[300]">
                      {item.food.details}
                    </span>
                  </p>
                  <p className="min-w-[15px] text-[16px] font-[400] text-[#313131]">
                    {item.amount}
                  </p>
                  <div className="min-w-[110px] flex flex-col items-end">
                    { item.food.special_price && (
                      <p className="text-[14px] font-[500] text-[#313131] line-through">
                        {item.food.price}
                      </p>
                    )}
                    <span className="text-[16px] font-[400]">{item.food.special_price}</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-[18px] text-gray-500">
                ไม่มีข้อมูล
              </p>
            )}
          </div>
          <div className="border border-[#CACACA] mx-6 my-3"></div>

          <div className="flex items-start justify-between px-6 ">
            <p className="text-[18px] font-[500] text-[#313131]">ราคา</p>
            <p className="text-[16px] font-[500] text-[#313131]">{total_rawPrice}</p>
          </div>
          <div className="flex items-start justify-between px-6 ">
            <p className="text-[18px] font-[500] text-[#313131]">ส่วนลด</p>
            <p className="text-[16px] font-[500] text-[#313131]">-{total_price - total_special_price}</p>
          </div>
          <div className="flex items-start justify-between px-6 ">
            <p className="text-[18px] font-[500] text-[#313131]">ภาษี {tax}%</p>
            <p className="text-[16px] font-[500] text-[#313131]">{priceTax}</p>
          </div>
          <div className="flex items-start justify-between px-6 ">
            <p className="text-[18px] font-[500] text-[#313131]">
              Service charge {serviceCharge}%
            </p>
            <p className="text-[16px] font-[500] text-[#313131]">{priceService}</p>
          </div>

          <div className="border border-[#CACACA] border-dashed mx-6 my-3"></div>

          <div className="flex items-start justify-between px-6 pb-5">
            <p className="text-[23px] font-[700] text-[#313131]">ยอดทั้งหมด</p>
            <p className="text-[23px] font-[700] text-[#313131]">$ {total_special_price + priceTax + priceService}</p>
          </div>
        </div>
      </div>
    )
  );
}

export default TotalBillModal;
