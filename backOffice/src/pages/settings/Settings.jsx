import React, { useState } from "react";
import Profile from "./sections/Profile";
import Shop from "./sections/Shop";
import Account from "./sections/Account";
import Taxes from "./sections/Taxes";
import Tab from "./sections/Tab";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import AddIcon from "@mui/icons-material/Add";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import User from "./sections/User";
import AddUser from "./modal/AddUser";

function Settings() {
  const [activeTab, setActiveTab] = useState("profile");
  const [age, setAge] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const handleChange = (event) => {
    setAge(event.target.value);
  };

  const handleAdd = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  return (
    <>
      <AddUser isOpen={isOpen} closeModal={closeModal} />
      <div className="flex lg:flex-row flex-col 3xl:w-[1565px] w-full max-lg:gap-4 lg:items-center items-end max-lg:justify-between ">
        <div className="flex w-full items-center gap-2">
          <SettingsOutlinedIcon
            sx={{ fontSize: 25 }}
            className="text-[#00537B]"
          />
          <p className="text-[25px] font-[600] text-[#00537B]">การตั้งค่า</p>
        </div>
        {activeTab === "user" && (
          <div className="flex items-center xl:gap-6 gap-2">
            <div className="flex items-center gap-2">
              <p className="w-[70px] text-[16px] font-[500] text-[#313131]">
                หน้าที่ผู้ใช้
              </p>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={age || 0}
                onChange={handleChange}
                className="w-[140px] h-[37px] bg-white shadow-3 "
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

            <button
              onClick={() => handleAdd()}
              className="flex items-center justify-center xl:w-[130px] w-[120px] shadow-1 py-1.5 rounded-lg cursor-pointer text-white text-[16px] duration-200 transition bg-[#005179] hover:bg-[#ffd468]"
            >
              <AddIcon className="text-white" />
              เพิ่มผู้ใช้งาน
            </button>
          </div>
        )}
      </div>

      <div className="flex lg:flex-row flex-col gap-4 mt-6 ">
        <Tab activeTab={activeTab} setActiveTab={setActiveTab} />

        <main className="w-full ">
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
