import React, { useState, useEffect } from "react";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import { getEditTable, getGenerateQr } from "../../../../services/table_manage.service";
import { QRCodeCanvas } from "qrcode.react";
import { front_readqr } from "../../../../store/setting";
import Swal from "sweetalert2";

function EditTable({tableDetail}) {
  // console.log(tableDetail)
  const [imageSrc, setImageSrc] = useState("/images/123.jpg");
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState(0);
  const [display, setDisplay] = useState(true);
  const [token, setToken] = useState("");

  useEffect(() => {
    setTitle(tableDetail.title)
    setPriority(tableDetail.priority)
    setDisplay(tableDetail.display)
    setToken(tableDetail.token)
  }, [])

  const onSubmit = () => {
    const params = {
      title: title,
      priority: priority,
      display: display
    }

    getEditTable(tableDetail.id, params).then((res) => {
      console.log(res);
      if(res.status) {
        Swal.fire({
          position: "center",
          text: "แก้ไขมูลโต๊ะสำเร็จ!",
          icon: "success",
          showConfirmButton: false,
          timer: 1500,
        })
      }
    })
  }

  const handleGenerateQr = () => {
    getGenerateQr(tableDetail.id).then((res) => {
      setToken(res.token);
    })
  }

  return (
    <>
      <div className="2xl:w-full md:w-[500px] w-full mx-auto h-[683px] p-6 bg-white shadow-1 rounded-lg">
        <div className="flex justify-center items-center gap-6">
          <p className="text-[20px] text-[#313131] font-[500]">ชื่อ</p>
          <input
            type="text"
            className="w-[310px] border border-gray-300 text-gray-600 text-[16px] font-[500] rounded-sm h-[37px] px-2 focus:outline-none focus:ring-2 focus:ring-[#6db8dd] "
            placeholder="ชื่อโต๊ะ..."
            onChange={(e) => setTitle(e.target.value)}
            value={title}
          />
        </div>
        <figure className="w-[360px] h-[360px] mx-auto mt-6 border-6 border-[#D9D9D9]">
          {
            token ? (
              <QRCodeCanvas size={343} value={front_readqr + token} />
            ) : (
              <img
                className="w-full h-full"
                src={"/images/not_qrcode.jpg"}
                alt="QRCode"
              />
            )
          }
        </figure>
        <button className="mt-4 mx-auto flex items-center justify-center gap-1 xl:w-[130px] w-[120px] shadow-md py-1.5 rounded-lg cursor-pointer text-gray-700 text-[16px] font-medium duration-300 transition-all bg-gradient-to-r from-[#FFD468] to-[#FFC107] hover:from-[#F5A100] hover:to-[#FF8C00] hover:shadow-xl hover:scale-105"
          onClick={handleGenerateQr}
        >
          <AutorenewIcon sx={{ fontSize: 23 }} className="text-gray-700" />
          สร้าง QR ใหม่
        </button>
        <div className="border-t-2 border-gray-500 mt-6"></div>
        <div className="flex items-center justify-center mt-4">
          <p className="mr-2 text-[18px] text-[#313131] font-[500]">ลำดับ</p>
          <input
            type="number"
            className="mr-12 w-[100px] h-[35px] border border-gray-300 text-gray-600 text-[16px] font-[500] rounded-sm  px-2 focus:outline-none focus:ring-2 focus:ring-[#6db8dd] "
            placeholder="เลข..."
            onChange={(e) => setPriority(e.target.value)}
            value={priority}
          />
          <p className="mr-2 text-[18px] text-[#313131] font-[500]">แสดงผล</p>
          <FormControlLabel
            className="px-2 py-3"
            control={
              <Switch
                checked={display}
                onChange={(e) => setDisplay(e.target.checked)}
                sx={{
                  "& .MuiSwitch-switchBase.Mui-checked": {
                    color: "#39C526",
                  },
                  "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                    backgroundColor: "#39C526",
                  },
                }}
              />
            }
          />
        </div>
        <div className="flex items-center justify-center gap-5">
          <button className="mt-4 flex items-center justify-center gap-1 xl:w-[130px] w-[120px] shadow-md py-1.5 rounded-lg cursor-pointer text-white text-[16px] font-medium duration-300 transition-all bg-gradient-to-r from-[#00537B] to-[#0072A0] hover:from-[#004669] hover:to-[#005F85] hover:shadow-xl hover:scale-105"
            onClick={onSubmit}
          >
            <SaveIcon sx={{ fontSize: 23 }} className="text-white" />
            บันทึก
          </button>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 flex items-center justify-center gap-1 xl:w-[130px] w-[120px] shadow-md py-1.5 rounded-lg cursor-pointer text-white text-[16px] font-medium duration-300 transition-all bg-gradient-to-r from-[#F44D4D] to-[#FF5E5E] hover:from-[#FF0A0A] hover:to-[#FF5252] hover:shadow-xl hover:scale-105"
          >
            <CancelIcon sx={{ fontSize: 23 }} className="text-white" />
            ยกเลิก
          </button>
        </div>
      </div>
    </>
  );
}

export default EditTable;
