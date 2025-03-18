import React, { useState, useEffect, use } from "react";
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
import { getWebinfoSetting, getUserAll } from "../../services/setting.service";

function Settings() {
  const [activeTab, setActiveTab] = useState("profile");
  const [isOpen, setIsOpen] = useState(false);
  const [infoType, setinfoType] = useState([]);
  const [webinfo, setWebinfo] = useState([]);
  const [userAll, setUserAll] = useState([]);
  const [permission, setPermission] = useState([]);
  const [slcPermission, setSlcPermission] = useState(0);
  const [slcStatus, setStatus] = useState("all");
  const [filteredUsers, setFilteredUsers] = useState(userAll);

  const handleAdd = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  // ฟิลเตอร์ webInfo 
  const filterWebinfo = (info_id) => {
    return webinfo.filter(info => info.info_type == info_id)
  }

  useEffect(() => {
    getWebinfoSetting().then((res) => {
      setinfoType(res.webinfotype);
      setWebinfo(res.webinfo);
    })
    getUserAll().then((res) => {
      setUserAll(res.user);
      setPermission(res.permission);
    })
  }, [])

  useEffect(() => {
    const filterUsers = () => {
      let filtered = userAll;

      // กรองตาม permission
      if (slcPermission !== 0) {
        filtered = filtered.filter(user => user.permission === String(slcPermission));
      }

      // กรองตาม status
      if (slcStatus !== "all") { 
        filtered = filtered.filter(user => user.status === slcStatus);
      }

      setFilteredUsers(filtered);
    };

    filterUsers();
  }, [slcPermission, slcStatus, userAll]); // อัปเดตเมื่อค่าพวกนี้เปลี่ยน

  return (
    <>
      <AddUser 
        isOpen={isOpen} 
        closeModal={closeModal} 
        permissionAll={permission}
      />
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
                value={slcPermission}
                onChange={(e) => setSlcPermission(e.target.value)}
                className="w-[140px] h-[37px] bg-white shadow-3 "
              >
                <MenuItem value={0}>ทั้งหมด</MenuItem>
                {
                  permission.map((permiss) => (
                    <MenuItem key={permiss.id} value={permiss.id}>{permiss.user_type_th}</MenuItem>
                  ))
                }
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <p className="w-[70px] text-[16px] font-[500] text-[#313131]">
                สถานะผู้ใช้
              </p>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={slcStatus} // ✅ ใช้ state ที่เก็บค่า
                onChange={(e) => setStatus(e.target.value)}
                className="w-[140px] h-[37px] bg-white shadow-3"
              >
                <MenuItem value="all">ทั้งหมด</MenuItem>  {/* เปลี่ยนจาก "" เป็น "all" */}
                <MenuItem value={"active"}>เปิดใช้งาน</MenuItem>
                <MenuItem value={"pending"}>รออนุมัติ</MenuItem>
                <MenuItem value={"inactive"}>ปิดใช้งาน</MenuItem>
                <MenuItem value={"banned"}>ปิดกั้น</MenuItem>
              </Select>
            </div>

            <button
              onClick={() => handleAdd()}
              className="flex items-center justify-center xl:w-[130px] w-[120px] shadow-1 py-1.5 rounded-lg cursor-pointer text-white text-[16px] duration-200 transition bg-[#005179] hover:bg-[#F5A100]"
            >
              <AddIcon className="text-white" />
              เพิ่มผู้ใช้งาน
            </button>
          </div>
        )}
      </div>

      <div className="flex lg:flex-row flex-col gap-4 mt-6 ">
        <Tab 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          infoType={infoType}
        />

        <main className="w-full ">
          {activeTab === "profile" && <Profile webinfo={filterWebinfo(1)} />}
          {activeTab === "shop" && <Shop webinfo={filterWebinfo(2)} />}
          {activeTab === "bankaccount" && <Account webinfo={filterWebinfo(3)} />}
          {activeTab === "taxes" && <Taxes webinfo={filterWebinfo(4)} />}
          {activeTab === "user" && <User userAll={filteredUsers} permission={permission} />}
        </main>
      </div>
    </>
  );
}

export default Settings;
