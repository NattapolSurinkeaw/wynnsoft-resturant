import React, { useState } from "react";
import Profile from "./sections/Profile";
import Shop from "./sections/Shop";
import Account from "./sections/Account";
import Taxes from "./sections/Taxes";
import User from "./sections/User";
import Tab from "./sections/Tab";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";

function Settings() {
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <>
      <div className="flex w-full items-center gap-2">
        <SettingsOutlinedIcon
          sx={{ fontSize: 25 }}
          className="text-[#00537B] "
        />
        <p className="text-[25px] font-[600] text-[#00537B]">การตั้งค่า</p>
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
