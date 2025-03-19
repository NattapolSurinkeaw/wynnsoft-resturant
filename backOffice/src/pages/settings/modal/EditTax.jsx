import React, { useState, useEffect } from "react";
import BorderColorOutlinedIcon from "@mui/icons-material/BorderColorOutlined";
import Switch from "@mui/material/Switch";
import { getUpdateTaxService } from "../../../services/setting.service";
import Swal from "sweetalert2";

function EditTax({ isOpen, closeModal, slcTax, setRefresh }) {
  const [infoValue, setInfoValue] = useState("");
  const [status, setStatus] = useState(true);

  useEffect(() => {
    console.log(slcTax.info_value);
    setInfoValue(slcTax.info_value)
    setStatus(slcTax.info_display)
  }, [slcTax])

  const onSubmit = () => {
    const params = {
      id: slcTax.info_id,
      info_value: infoValue,
      display_status: status
    } 
    
    getUpdateTaxService(params).then((res) => {
      console.log(res)
      if(res.status) {
        Swal.fire({
          position: "center",
          icon: "success",
          title: "บันทึกข้อมูลเสร็จ",
          showConfirmButton: false,
          timer: 1500,
        }).then(() => {
          setRefresh(prev => !prev)
          closeModal()
        })
      }
    })
  }

  return (
    isOpen && (
      <div className="fixed inset-0 bg-black/60 bg-opacity-50 flex items-center justify-center z-20">
        <div className=" relative bg-white p-8 rounded-lg shadow-lg w-[480px]">
          <div className="flex w-full items-center gap-2">
            <BorderColorOutlinedIcon
              sx={{ fontSize: 25 }}
              className="text-[#00537B]"
            />
            <p className="text-[25px] font-[600] text-[#00537B]">
              แก้ไขข้อมูลภาษีและบริการ
            </p>
          </div>

          <div className="w-full space-y-3 mt-6">
            <div className="flex items-center ">
              <p className="min-w-[90px] text-[#313131] font-[400]">Param</p>
              <input
                type="text"
                className="border border-gray-300 text-gray-600 text-[14px] font-[300] rounded-sm h-[37px] px-2 focus:outline-none focus:ring-2 focus:ring-[#6db8dd] w-full"
                placeholder="กรอกชื่อ..."
                value={slcTax.info_param}
                disabled
              />
            </div>
            <div className="flex items-center ">
              <p className="min-w-[90px] text-[#313131] font-[400]">Title</p>
              <input
                type="text"
                className="border border-gray-300 text-gray-600 text-[14px] font-[300] rounded-sm h-[37px] px-2 focus:outline-none focus:ring-2 focus:ring-[#6db8dd] w-full"
                placeholder="กรอกอีเมล..."
                value={slcTax.info_title}
                disabled
              />
            </div>
            <div className="flex items-center">
              <p className="min-w-[90px] text-[#313131] font-[400]">Value</p>
              <input
                type="text"
                className="border border-gray-300 text-gray-600 text-[14px] font-[300] rounded-sm h-[37px] px-2 focus:outline-none focus:ring-2 focus:ring-[#6db8dd] w-full"
                placeholder="0"
                value={infoValue}
                onChange={(e) => setInfoValue(e.target.value)}
              />
            </div>

            <div className="flex items-center ">
              <p className="min-w-[90px] text-[#313131] font-[400]">สถานะ</p>
              <Switch
                checked={status} // ใช้ค่าจาก tax.info_display
                onChange={(e) => setStatus(e.target.checked)} // เรียกใช้ฟังก์ชันเมื่อเปลี่ยนค่า
                sx={{
                  "& .MuiSwitch-switchBase.Mui-checked": {
                    color: "#39C526",
                  },
                  "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track":
                    { backgroundColor: "#39C526" },
                }}
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-8">
            <button onClick={closeModal} className="button-cancel-1">
              ยกเลิก
            </button>
            <button onClick={onSubmit} className="button-save-1">บันทึก</button>
          </div>
        </div>
      </div>
    )
  );
}

export default EditTax;
