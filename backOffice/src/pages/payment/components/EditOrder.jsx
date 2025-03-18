import React, { useState } from "react";

function EditOrder({ groupedMenuDetails, setOpenModalEdit }) {
  const [count, setCount] = useState(() =>
    Object.fromEntries(groupedMenuDetails.map((item) => [item.id, item.amount]))
  );

  console.log("groupedMenuDetails", groupedMenuDetails);

  const formatNumber = (num) =>
    Number(num).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  const handleIncrement = (id) => {
    setCount((prev) => ({ ...prev, [id]: prev[id] + 1 }));
  };

  const handleDecrement = (id) => {
    setCount((prev) => ({ ...prev, [id]: Math.max(0, prev[id] - 1) }));
  };
  return (
    <div className="flex flex-col gap-4 ">
      <div className="flex flex-col gap-2 h-[500px] max-h-full overflow-auto hide-scrollbar w-full">
        {groupedMenuDetails.map((item, index) => (
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
                    src={item.thumbnail_link}
                    alt={item.name}
                    className="w-full h-full rounded-lg"
                  />
                </figure>
                <div className="flex flex-col justify-between gap-3">
                  <p className="lg:text-2xl text-lg text-[#313131] font-[500] line-clamp-2">
                    {item.name}
                  </p>
                  <p className="text-base font-[300] w-full line-clamp-2">
                    {item.details}
                  </p>
                </div>
              </div>

              <div className="flex justify-between items-center w-[60%]">
                <div className="w-full flex-1 flex flex-row justify-start ml-4 items-end gap-4 ">
                  <figure
                    className={`btn-minus w-[30px] h-[30px] cursor-pointer flex-shrink-0  ${
                      item.status === "5" ? "hidden" : ""
                    }`}
                    onClick={() => handleDecrement(item.id)}
                  >
                    <img
                      src="/icons/Group 1105.png"
                      alt="ลดจำนวน"
                      className="w-full h-full"
                    />
                  </figure>

                  <p className={`lg:text-2xl text-lg text-[#313131] font-[500] text-center items-center w-full ${
                        item.status === "5" ? "line-through text-gray-500" : ""
                      }`}>
                    {count[item.id]}
                  </p>

                  <figure
                    className={`btn-plus w-[30px] h-[30px] cursor-pointer flex-shrink-0  ${
                      item.status === "5" ? "hidden" : ""
                    }`}
                    onClick={() => handleIncrement(item.id)}
                  >
                    <img
                      src="/icons/Group 1106.png"
                      alt="เพิ่มจำนวน"
                      className="w-full h-full"
                    />
                  </figure>
                </div>

                <div className="flex flex-col justify-end text-right w-full flex-1">
                  {item.special_price > 0 && (
                    <p className="text-base font-[300] line-through">
                      {formatNumber(item.price * item.amount)}
                    </p>
                  )}

                  <p className="lg:text-2xl text-lg text-[#313131] font-[600]">
                    {formatNumber(
                      (item.special_price || item.price) * count[item.id]
                    )}
                    ฿
                  </p>
                </div>
              </div>

              <div className="flex flex-row justify-end gap-4 w-[20%] xl:pl-6">
                <button className="bg-[#F44D4D] hover:bg-[#FFBA41] transition-all ease-in-out duration-200  cursor-pointer text-white rounded-lg w-full text-center py-1.5 font-bold text-base">
                  ลบ
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="w-full h-[200px] flex flex-col px-4 gap-2">
        <span className="w-[140px] flex-shrink-0 text-left text-black text-xl">
          หมายเหตุ
        </span>
        <textarea
          id="message"
          className="w-full border border-[#D9D9D9] rounded-lg outline-none py-1 px-4 lg:h-40 h-20 text-xl"
          // value={text}
          // onChange={(e) => setText(e.target.value)}
          placeholder="หมายเหตุ..."
        />
      </div>
      
      <div className="flex flex-row justify-center gap-4">
        <button className="bg-[#FFBA41] hover:bg-[#00537B]  transition-all ease-in-out duration-200  cursor-pointer text-white rounded-lg w-[220px] text-center py-1.5 font-bold text-xl">
          บันทึก
        </button>
        <button
          onClick={() => {
            setOpenModalEdit(false);
          }}
          className="bg-[#F44D4D] hover:bg-[#00537B]  transition-all ease-in-out duration-200  cursor-pointer text-white rounded-lg w-[220px] text-center py-1.5 font-bold text-xl"
        >
          ย้อนกลับ
        </button>
      </div>
    </div>
  );
}

export default EditOrder;
