import React, { useState, useEffect } from "react";
import QrCodeScannerOutlinedIcon from "@mui/icons-material/QrCodeScannerOutlined";
import MoveTable from "../../modal/MoveTable";
import QrCodeModal from "../../modal/QrCodeModal";
import { FoodListData } from "../../../../components/mockData/CustomTable/FoodListData";
import { front_readqr } from "../../../../store/setting";
import { getOrderAll } from "../../../../services/order.service";

function FoodList({ selectedTableId, tableDetail }) {
  const [isMoveTable, setIsMoveTable] = useState(false);
  const [currentFoodData, setCurrentFoodData] = useState(null);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [orderAll, setOrderAll] = useState([]);

  useEffect(() => {
    getOrderAll().then((res) => {
      setOrderAll(res.orders);
    })
  }, [])

  useEffect(() => {
    // console.log(orderAll)
    const filteredData = orderAll.find(
      (item) => item.table_id === selectedTableId
    );
    setCurrentFoodData(filteredData);
  }, [orderAll, selectedTableId]);

  const handleMoveTableOnClick = () => {
    setIsMoveTable(true);
  };

  const closeModal = () => {
    setIsMoveTable(false);
  };

  const total_price = currentFoodData?.orderList.reduce((sum, item) => sum + (item.food.price || 0), 0);
  const total_special_price = currentFoodData?.orderList.reduce((sum, item) => sum + (item.food.special_price || 0), 0);

  return (
    <>
      {currentFoodData && (
        <>
          <MoveTable 
            isMoveTable={isMoveTable} 
            closeModal={closeModal} 
            table={currentFoodData?.table}
          />
          <QrCodeModal
            isOpen={isQrModalOpen}
            closeModal={() => setIsQrModalOpen(false)}
            qrCode={ front_readqr + tableDetail.qrcode }
          />
          <div className="flex flex-col 2xl:w-full md:w-[500px] w-full mx-auto min-h-[730px]">
            <div className="w-full h-full bg-white shadow-1 rounded-lg">
              <div className="flex items-center justify-between w-full h-[115px] rounded-t-lg bg-[#013D59] px-6 py-4">
                <div className="w-[85px] h-[85px] bg-white rounded-lg">
                  <p className="flex flex-col w-full h-full items-center justify-center leading-8">
                    <p className="text-[35px] font-[600] text-[#013D59] text-center">
                      {currentFoodData.table.title}
                    </p>
                  </p>
                </div>
                <figure
                  className="cursor-pointer"
                  onClick={() => setIsQrModalOpen(true)}
                >
                  <QrCodeScannerOutlinedIcon
                    sx={{ fontSize: 35 }}
                    className="text-white hover:text-[#F5A100] mr-[8rem]"
                  />
                </figure>
                <div className="flex flex-col items-end ">
                  <p className="text-[23px] font-[600] text-white">
                    {`#${currentFoodData.order_number}`}
                  </p>
                  <p className="text-[16px] font-[600] text-white">
                    {currentFoodData.date}
                  </p>
                  <p className="text-[16px] font-[600] text-white">
                    {currentFoodData.orderList.length} ออเดอร์
                  </p>
                </div>
              </div>

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

              <div className="w-full h-[320px] py-3 overflow-y-auto ">
                {currentFoodData?.orderList?.length > 0 ? (
                  currentFoodData.orderList.map((item) => (
                    <div key={item.id} className="flex items-start justify-between px-6 mt-2">
                      <p className="min-w-[240px] text-[18px] font-[500] text-[#313131]">
                        {item.food.name} <br />
                        <span className="text-[14px] font-[300]">{item.details}</span>
                      </p>
                      <p className="min-w-[15px] text-[16px] font-[400] text-[#313131]">
                        {item.amount}
                      </p>
                      <div className="min-w-[110px] flex flex-col items-end">
                        <p className="text-[14px] font-[500] text-[#313131] line-through">
                          {item.food.price}
                        </p>
                        <span className="text-[16px] font-[400]">{item.food.special_price}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-500">ไม่มีรายการอาหาร</p>
                )}
              </div>
              <div className="border border-[#CACACA] mx-6 my-3"></div>

              {/* แสดงราคาและข้อมูลต่าง ๆ */}
              <div className="flex items-start justify-between px-6 ">
                <p className="text-[18px] font-[500] text-[#313131]">ราคา</p>
                <p className="text-[16px] font-[500] text-[#313131]">{total_special_price}</p>
              </div>
              <div className="flex items-start justify-between px-6 ">
                <p className="text-[18px] font-[500] text-[#313131]">ส่วนลด</p>
                <p className="text-[16px] font-[500] text-[#313131]">{total_price - total_special_price}</p>
              </div>
              <div className="flex items-start justify-between px-6 ">
                <p className="text-[18px] font-[500] text-[#313131]">ภาษี 7%</p>
                <p className="text-[16px] font-[500] text-[#313131]">000.00</p>
              </div>
              <div className="flex items-start justify-between px-6 ">
                <p className="text-[18px] font-[500] text-[#313131]">
                   Service charge 5%
                </p>
                <p className="text-[16px] font-[500] text-[#313131]">000.00</p>
              </div>

              <div className="border border-[#CACACA] border-dashed mx-6 my-3"></div>

              <div className="flex items-start justify-between px-6 ">
                <p className="text-[23px] font-[700] text-[#313131]">
                  ยอดทั้งหมด
                </p>
                <p className="text-[23px] font-[700] text-[#313131]">
                  $ 00,000.00
                </p>
              </div>
            </div>
            <div className="flex items-center 2xl:justify-between justify-center gap-4">
              <button
                onClick={handleMoveTableOnClick}
                className="mt-4 flex items-center justify-center gap-1 xl:w-[145px] w-[120px] shadow-md py-1.5 rounded-lg cursor-pointer text-white text-[16px] font-medium duration-300 transition-all bg-gradient-to-r from-[#F44D4D] to-[#FF5E5E] hover:from-[#FF0A0A] hover:to-[#FF5252] hover:shadow-xl hover:scale-105"
              >
                ย้ายโต๊ะ
              </button>
              <button className="mt-4 flex items-center justify-center gap-1 xl:w-[145px] w-[120px] shadow-md py-1.5 rounded-lg cursor-pointer text-white text-[16px] font-medium duration-300 transition-all bg-gradient-to-r from-[#FFD468] to-[#FFC107] hover:from-[#F5A100] hover:to-[#FF8C00] hover:shadow-xl hover:scale-105">
                เพิ่มรายการ
              </button>
              <button className="mt-4 flex items-center justify-center gap-1 xl:w-[145px] w-[120px] shadow-md py-1.5 rounded-lg cursor-pointer text-white text-[16px] font-medium duration-300 transition-all bg-gradient-to-r from-[#076591] to-[#013D59] hover:from-[#0579af] hover:to-[#045b83] hover:shadow-xl hover:scale-105">
                ชำระเงิน
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default FoodList;
