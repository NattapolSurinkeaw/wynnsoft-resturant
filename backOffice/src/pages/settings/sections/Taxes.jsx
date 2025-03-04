import React, { useState } from "react";
import { Tune } from "@mui/icons-material";
import Tab from "./Tab";
import Button from "@mui/material/Button";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import CreateIcon from "@mui/icons-material/Create";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";

const mockData = [
  {
    Name: "ภาษี",
    percent: 7,
    status: 1,
  },
  {
    Name: "Service charge",
    percent: 5,
    status: 2,
  },
];

function Taxes() {
  return (
    <>
      <div className="w-[800px] p-5 rounded-lg shadow-1 bg-white">
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
              {mockData.map((data, index) => (
                <tr
                  key={index}
                  className={index % 2 === 0 ? "bg-[#F9FAFB]" : "bg-[#F3F4F6]"}
                >
                  <td className="px-2 py-3">{data.Name}</td>
                  <td className="px-2 py-3">{data.percent}%</td>
                  <FormControlLabel
                    className="px-2 py-3"
                    control={
                      <Switch
                        defaultChecked
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
                    <div className="flex justify-center items-center w-[35px] h-[35px] rounded-lg bg-[#F5A100] group hover:bg-[#013D59] transition duration-100 shadow-1 cursor-pointer">
                      <BorderColorIcon
                        fontSize="small"
                        className="text-white group-hover:text-white"
                      />
                    </div>
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
