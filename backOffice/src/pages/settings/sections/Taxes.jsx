import React, { useState, useEffect, use } from "react";
import { Tune } from "@mui/icons-material";
import Tab from "./Tab";
import Button from "@mui/material/Button";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import CreateIcon from "@mui/icons-material/Create";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import EditTax from "../modal/EditTax";

function Taxes({webinfo}) {
  const [dataTax, setDataTax] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [slcTax, setSlcTax] = useState([]);

  const closeModal = () => {
    setIsOpen(false);
    setSelectedUser(null);
  };

  useEffect(() => {
    setDataTax(webinfo);
  }, [webinfo])

  const handleToggleSwitch = (id) => {
    setDataTax((prevData) =>
      prevData.map((tax) =>
        tax.info_id === id ? { ...tax, info_display: !tax.info_display } : tax
      )
    );
  };

  const handleEditTax = (tax) => {
    setIsOpen(true);
    setSlcTax(tax);
  }

  return (
    <>
      <div className="3xl:w-[800px] w-full p-5 rounded-lg shadow-1 bg-white">
        <p className="text-[22px] text-[#00537B] font-[600] ">
          ตั้งค่าภาษีและบริการ
        </p>
        <div className="mt-4">
          <table className="min-w-full table-auto">
            <thead>
              <tr>
                <th className="px-2 py-3 text-left bg-[#F3F4F6]">หัวข้อ</th>
                <th className="px-2 py-3 text-left bg-[#F3F4F6]">
                  เปอร์เซ็นต์
                </th>
                <th className="px-2 py-3 text-left bg-[#F3F4F6]">สถานะ</th>
                <th className="px-2 py-3 text-left bg-[#F3F4F6] rounded-tr-lg">
                  แก้ไข
                </th>
              </tr>
            </thead>
            <tbody>
              {dataTax.map((tax) => (
                <tr
                  key={tax.info_id}
                  className={tax.info_id % 2 === 0 ? "bg-[#F9FAFB]" : "bg-[#F3F4F6]"}
                >
                  <td className="px-2 py-3">{tax.info_title}</td>
                  <td className="px-2 py-3">{tax.info_value}%</td>
                  <FormControlLabel
                    className="px-2 py-3"
                    control={
                      <Switch
                        checked={tax.info_display} // ใช้ค่าจาก tax.info_display
                        onChange={() => handleToggleSwitch(tax.info_id)} // เรียกใช้ฟังก์ชันเมื่อเปลี่ยนค่า
                        sx={{
                          "& .MuiSwitch-switchBase.Mui-checked": {
                            color: "#39C526",
                          },
                          "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track":
                            { backgroundColor: "#39C526" },
                        }}
                      />
                    }
                  />
                  <td className="px-2 py-3">
                    <div 
                      className="flex justify-center items-center w-[35px] h-[35px] rounded-lg bg-[#F5A100] group hover:bg-[#013D59] transition duration-100 shadow-1 cursor-pointer"
                      onClick={() => handleEditTax(tax)}
                    >
                      <BorderColorIcon
                        fontSize="small"
                        className="text-white group-hover:text-white"
                      />
                    </div>

                    {
                      isOpen && (
                        <EditTax 
                          isOpen={isOpen} 
                          closeModal={closeModal} 
                          slcTax={slcTax} 
                        />
                      )
                    }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default Taxes;
