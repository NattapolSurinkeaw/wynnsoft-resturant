import React, { useState } from "react";
import Profile from "./sections/Profile";
import Shop from "./sections/Shop";
import Account from "./sections/Account";
import Taxes from "./sections/Taxes";
import User from "./sections/User";
import Tab from "./sections/Tab";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import AddIcon from "@mui/icons-material/Add";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";

function Settings() {
  const [activeTab, setActiveTab] = useState("profile");
  const [age, setAge] = useState("");

  const handleChange = (event) => {
    setAge(event.target.value);
  };

  return (
    <>
      <div className="flex w-[1565px] items-center justify-between">
        <div className="flex w-full items-center gap-2">
          <SettingsOutlinedIcon
            sx={{ fontSize: 25 }}
            className="text-[#00537B]"
          />
          <p className="text-[25px] font-[600] text-[#00537B]">การตั้งค่า</p>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <p className="w-[70px] text-[16px] font-[500] text-[#313131]">
              หน้าที่ผู้ใช้
            </p>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={age || 0}
              onChange={handleChange}
              className="w-[140px] h-[37px] bg-white shadow-3"
            >
              <MenuItem value={0}>ทั้งหมด</MenuItem>
              <MenuItem value={10}>test 1</MenuItem>
              <MenuItem value={20}>test 2</MenuItem>
              <MenuItem value={30}>test 3</MenuItem>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <p className="w-[70px] text-[16px] font-[500] text-[#313131]">
              สถานะผู้ใช้
            </p>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={age || 0}
              onChange={handleChange}
              className="w-[140px] h-[37px] bg-white shadow-3"
            >
              <MenuItem value={0}>ทั้งหมด</MenuItem>
              <MenuItem value={10}>test 1</MenuItem>
              <MenuItem value={20}>test 2</MenuItem>
              <MenuItem value={30}>test 3</MenuItem>
            </Select>
          </div>

          <button className="flex items-center justify-center w-[130px] shadow-1 py-1.5 rounded-lg cursor-pointer text-white text-[16px] duration-200 transition bg-[#005179] hover:bg-[#ffd468]">
            <AddIcon className="text-white" />
            เพิ่มผู้ใช้งาน
          </button>
        </div>
      </div>

      <div className="flex gap-4 mt-6">
        <Tab activeTab={activeTab} setActiveTab={setActiveTab} />

        <main className="flex-1">
          {activeTab === "profile" && <Profile />}
          {activeTab === "shop" && <Shop />}
          {activeTab === "account" && <Account />}
          {activeTab === "taxes" && <Taxes />}
          {activeTab === "user" && <User />}
        </main>
      </div>
    </>
  );
}

export default Settings;
