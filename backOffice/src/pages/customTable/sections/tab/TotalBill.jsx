import React, { useState } from "react";
import TotalBillModal from "../../modal/TotalBillModal";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import AddToPhotosIcon from "@mui/icons-material/AddToPhotos";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import Checkbox from "@mui/material/Checkbox";
import { getAddBillPayment } from "../../../../services/table_manage.service";
import { useNavigate } from "react-router-dom";

function TotalBill({orderAll}) {
  const [isTotalBill, setIsTotalBill] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedTableId, setSelectedTableId] = useState(null);
  const [orderData, setOrderData] = useState([]);
  let navigate = useNavigate();

  const handleTotalBillOnClick = (order) => {
    setSelectedTableId(order.id);
    setOrderData(order || [])
    setIsTotalBill(true);
  };

  const closeModal = () => {
    setSelectedTableId(null);
    setIsTotalBill(false);
  };

  const handleCheckboxChange = (id) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((row) => row !== id) : [...prev, id]
    );
  };

  const handleAddBill = () => {
    if(selectedRows.length < 2) {
      return false;
    }
    console.log(selectedRows) 
    const param = {
      bill_id : selectedRows
    }
    getAddBillPayment(param).then((res) => {
      console.log(res)
      if(res.status) {
        navigate(`/payment/detail-all/${selectedRows[0]}`);
      }
    })
  }

  return (
    <>
      <TotalBillModal
        isTotalBill={isTotalBill}
        closeModal={closeModal}
        selectedTableId={selectedTableId}
        orderData={orderData}
      />
      <div className="flex flex-col 2xl:w-full md:w-[500px] w-full mx-auto 2xl:min-h-[631px] min-h-auto">
        <div className="w-full h-full bg-white shadow-1 rounded-lg p-6">
          <p className="text-[18px] font-[500] text-[#313131]">
            เลือกโต๊ะรวมบิล
          </p>

          {orderAll.map((order) => (
            <div
              key={order.id}
              className="flex items-center justify-between w-full border-b border-gray-300 py-2"
            >
              <div className="flex items-center">
                <Checkbox
                  size="medium"
                  checked={selectedRows.includes(order.id)}
                  onChange={() => handleCheckboxChange(order.id)}
                />
                <p className="text-[16px] font-[400] text-[#313131]">
                  โต๊ะ {order.name_table}
                </p>
              </div>
              <p className="text-[16px] font-[400] text-[#313131]">ยอดรวม</p>
              <p className="text-[16px] font-[400] text-[#313131]">
                {order.price.toLocaleString()} $
              </p>
              <button
                onClick={() => handleTotalBillOnClick(order)}
                className="flex items-center justify-center gap-2 xl:w-[110px] w-[120px] shadow-md py-1 rounded-lg cursor-pointer text-white text-[14px] font-medium duration-300 transition-all bg-[#F5A100] hover:bg-[#ffa600] hover:shadow-xl hover:scale-105"
              >
                <VisibilityOutlinedIcon
                  sx={{ fontSize: 23 }}
                  className="text-white"
                />
                รายละเอียด
              </button>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-center gap-4">
          <button className="mt-4 flex items-center justify-center gap-2 xl:w-[130px] w-[120px] shadow-md py-1.5 rounded-lg cursor-pointer text-white text-[16px] font-medium duration-300 transition-all bg-gradient-to-r from-[#FFD468] to-[#FFC107] hover:from-[#F5A100] hover:to-[#FF8C00] hover:shadow-xl hover:scale-105"
          onClick={handleAddBill}
          >
            <AddToPhotosIcon sx={{ fontSize: 23 }} className="text-white" />
            รวมบิล
          </button>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 flex items-center justify-center gap-2 xl:w-[130px] w-[120px] shadow-md py-1.5 rounded-lg cursor-pointer text-white text-[16px] font-medium duration-300 transition-all bg-gradient-to-r from-[#F44D4D] to-[#FF5E5E] hover:from-[#FF0A0A] hover:to-[#FF5252] hover:shadow-xl hover:scale-105"
          >
            <CancelOutlinedIcon sx={{ fontSize: 23 }} className="text-white" />
            ยกเลิก
          </button>
        </div>
      </div>
    </>
  );
}

export default TotalBill;
