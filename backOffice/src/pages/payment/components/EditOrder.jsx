import React, { useState } from "react";
import Swal from "sweetalert2";
import "./EditOrder.css";
import { getEditOrder } from "../../../services/manageData.services";

function EditOrder({
  groupedMenuDetails,
  setOpenModalEdit,
  note,
  setNote,
  api_path,
  orderId,
}) {
  const [foodList, setFoodList] = useState(
    groupedMenuDetails.map((item) => ({
      ...item,
      amount: item.amount,
    }))
  );

  console.log("groupedMenuDetails", groupedMenuDetails);
  console.log("foodList", foodList);

  const formatNumber = (num) =>
    Number(num).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  const handleIncrement = (id) => {
    setFoodList((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, amount: item.amount + 1 } : item
      )
    );
  };

  const handleDecrement = (id) => {
    setFoodList((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, amount: Math.max(1, item.amount - 1) }
          : item
      )
    );
  };

  const handleDelete = (item) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
      customClass: {
        container: "swal2-container", // เพิ่มคลาสที่กำหนด z-index ให้สูง
      },
    }).then((result) => {
      if (result.isConfirmed) {
        setFoodList((prevList) => prevList.filter((f) => f.id !== item.id));
        Swal.fire({
          title: "Deleted!",
          text: "Your data has been deleted.",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
          customClass: {
            container: "swal2-container", // เพิ่มคลาสที่กำหนด z-index ให้สูง
          },
        });
      }
    });
  };

  const handleSave = () => {
    console.log("foodList in params", foodList);
    console.log("note in params", note);

    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, update it!",
      customClass: {
        container: "swal2-container", // เพิ่มคลาสที่กำหนด z-index ให้สูง
      },
    }).then((res) => {
      if (res.isConfirmed) {
        const params = {
          foodList: foodList,
          note: note,
          orders_id: orderId,
        };

        getEditOrder(params).then((res) => {
          if (res.status) {
            Swal.fire({
              title: "Update Data",
              text: "Your data has been Update.",
              icon: "success",
              timer: 1500,
              showConfirmButton: false,
              customClass: {
                container: "swal2-container", // เพิ่มคลาสที่กำหนด z-index ให้สูง
              },
            }).then(() => {
              setOpenModalEdit(false);
            });
          }
        });
      }
    });
  };

  return (
    <div className="flex flex-col gap-4 ">
      <div className="flex flex-col gap-2 h-[500px] max-h-full overflow-auto hide-scrollbar w-full">
        {foodList.map((item, index) => (
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
                    src={api_path + item.thumbnail_link}
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

                  <p
                    className={`lg:text-2xl text-lg text-[#313131] font-[500] text-center items-center w-full ${
                      item.status === "5" ? "line-through text-gray-500" : ""
                    }`}
                  >
                    {item.amount}
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
                      (item.special_price || item.price) * item.amount
                    )}
                    ฿
                  </p>
                </div>
              </div>

              <div className="flex flex-row justify-end gap-4 w-[20%] xl:pl-6">
                <button
                  onClick={() => handleDelete(item)}
                  className="bg-[#F44D4D] hover:bg-[#FFBA41] transition-all ease-in-out duration-200  cursor-pointer text-white rounded-lg w-full text-center py-1.5 font-bold text-base"
                >
                  ลบ
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="w-full lg:h-[200px] flex flex-col px-4 gap-2">
        <span className="w-[140px] flex-shrink-0 text-left text-black text-xl">
          หมายเหตุ
        </span>
        <textarea
          id="message"
          className="w-full border border-[#D9D9D9] rounded-lg outline-none py-1 px-4 lg:h-40 h-20 text-xl"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="หมายเหตุ..."
        />
      </div>

      <div className="flex flex-row justify-center gap-4">
        <button
          onClick={handleSave}
          className="bg-[#FFBA41] hover:bg-[#00537B]  transition-all ease-in-out duration-200  cursor-pointer text-white rounded-lg w-[220px] text-center py-1.5 font-bold text-xl"
        >
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
