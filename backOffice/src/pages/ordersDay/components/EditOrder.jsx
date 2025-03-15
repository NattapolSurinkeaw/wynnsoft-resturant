import React from "react";

function EditOrder({ filteredOrderList }) {
  const formatNumber = (num) =>
    Number(num).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  return (
    <div className="flex flex-col gap-2 h-[600px] overflow-auto hide-scrollbar">
      {filteredOrderList.map((item, index) => (
        <div
          key={`${item.id}-${index}`}
          className={`flex flex-col items-center px-4 py-2 ${
            index % 2 === 0 ? "bg-[#EBFBFF]" : "bg-white"
          }`}
        >
          <div className="flex flex-row justify-between w-full items-center gap-4">
            <div className="flex gap-4 items-center w-[60%]">
              <figure className="w-[75px] h-[75px] rounded-lg">
                <img
                  src={item.food.thumbnail_link}
                  alt={item.food.name}
                  className="w-full h-full rounded-lg"
                />
              </figure>
              <div className="flex flex-col justify-between gap-3">
                <p className="lg:text-2xl text-lg text-[#313131] font-[500] line-clamp-2">
                  {item.food.name}
                </p>
                <p className="text-base font-[300] w-full line-clamp-2">
                  {item.food.details}
                </p>
              </div>
            </div>
            <div className="flex justify-between items-center w-[45%]">
              <p className="lg:text-2xl text-lg text-[#313131] font-[500] text-center items-center ml-4">
                {item.amount}
              </p>

              <div className="flex flex-col justify-end text-right">
                {item.food.special_price > 0 && (
                  <p className="text-base font-[300] line-through">
                    {formatNumber(item.food.price * item.amount)}
                  </p>
                )}

                <p className="lg:text-2xl text-lg text-[#313131] font-[600]">
                  {formatNumber(
                    (item.food.special_price || item.food.price) * item.amount
                  )}{" "}
                  ฿
                </p>
              </div>
            </div>

            <div className="flex flex-row justify-end gap-4 w-[20%] xl:pl-6">
              <button className="bg-[#F44D4D] hover:bg-[#FFBA41] transition-all ease-in-out duration-200  cursor-pointer text-white rounded-lg w-full text-center py-1.5 font-bold text-base">
                ยกเลิก
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default EditOrder;
