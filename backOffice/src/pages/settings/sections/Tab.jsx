import React from "react";

function Tab({ activeTab, setActiveTab, infoType }) {

  return (
    <div className="flex flex-col 3xl:min-w-[341px] min-w-[241px]">
      <ul className="max-lg:hidden w-full h-[227px] space-y-2 bg-[#FFD25B] shadow-1 rounded-lg p-4 list-disc list-inside">
        {infoType.map((tab) => (
          <li
            key={tab.id}
            onClick={() => setActiveTab(tab.info_type)}
            className={`text-[16px] font-[400] p-1 pl-4 duration-100 transition rounded-lg cursor-pointer ${
              activeTab === tab.info_type
                ? "text-white bg-[#00537B]"
                : "text-[#313131] hover:text-white hover:bg-[#00537B]"
            }`}
          >
            {tab.info_title}
          </li>
        ))}
      </ul>
      <div className="lg:hidden flex justify-start overflow-x-auto 3xl:min-w-[341px] min-w-[241px] min-h-auto space-x-2 bg-[#FFD25B] shadow-1 rounded-lg p-3 whitespace-nowrap hide-scrollbar">
        {infoType.map((tab) => (
          <div
            key={tab.id}
            onClick={() => setActiveTab(tab.info_type)}
            className={`text-[16px] font-[400] px-3 py-2 duration-100 transition rounded-lg cursor-pointer ${
              activeTab === tab.info_type
                ? "text-white bg-[#00537B]"
                : "text-[#313131] hover:text-white hover:bg-[#00537B]"
            }`}
          >
            {tab.info_title}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Tab;
