import React from "react";

function Tab({ activeTab, setActiveTab }) {
  const tabs = [
    { id: "profile", label: "โปรไฟล์ร้านค้า" },
    { id: "shop", label: "ข้อมูลร้านค้า" },
    { id: "account", label: "ข้อมูลบัญชีธนาคาร" },
    { id: "taxes", label: "ตั้งค่าภาษีและบริการ" },
    { id: "user", label: "ผู้ใช้งาน" },
  ];

  return (
    <ul className="w-[341px] h-[227px] space-y-2 bg-[#FFD25B] shadow-1 rounded-lg p-4 list-disc list-inside">
      {tabs.map((tab) => (
        <li
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`text-[16px] font-[400] p-1 pl-4 duration-100 transition rounded-lg cursor-pointer ${
            activeTab === tab.id
              ? "text-white bg-[#00537B]"
              : "text-[#313131] hover:text-white hover:bg-[#00537B]"
          }`}
        >
          {tab.label}
        </li>
      ))}
    </ul>
  );
}

export default Tab;
