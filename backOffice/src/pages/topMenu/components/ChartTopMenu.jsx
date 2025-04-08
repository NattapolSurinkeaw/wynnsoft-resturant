import React, { useEffect, useState } from "react";
import { PieChart , pieArcLabelClasses } from "@mui/x-charts/PieChart";
import { useMediaQuery } from "@mui/material";


function ChartTopMenu({ topMenu}) {
  const isLargeScreen = useMediaQuery("(min-width: 1600px)"); // >= 1024px
  const isMediumScreen = useMediaQuery("(min-width: 768px)"); // >= 768px
  const chartWidth = isLargeScreen ? 800 : isMediumScreen ? 500 : 300;
  const chartHeight = isLargeScreen ? 600 : isMediumScreen ? 400 : 200;
  const formatNumber = (num) => Number(num).toLocaleString("en-US");
  const [totalSold, setTotalSold] = useState(0);
  const [totalTop10, setTotalTop10] = useState(0);
  
  const totalSumSold = (menu, count) => {
    if (!Array.isArray(menu)) return 0; // ตรวจสอบว่าเป็น array
    return menu
      .slice(0, count)
      .reduce((sum, item) => sum + parseInt(item.totalSold || 0), 0);
  };
  
  useEffect(() => {
    if (Array.isArray(topMenu) && topMenu.length > 0) {
      setTotalSold(totalSumSold(topMenu, topMenu.length));
      setTotalTop10(totalSumSold(topMenu, 10));
    }
  }, [topMenu]);
  
  return (
    <div className="flex lg:flex-row flex-col lg:gap-4 gap-8 bg-white p-4 shadow rounded-lg">
      <div className="flex flex-col gap-6 justify-center items-center mx-auto">
        <PieChart
          className="w-full ml-12"
          width={chartWidth}
          height={chartHeight}
          series={[
            {
              data: Array.isArray(topMenu)
                ? topMenu.slice(0, 10).map((item) => ({
                    value: parseInt(item.totalSold || 0),
                    label: item.name,
                  }))
                : [],
              arcLabel: (params) => `${params.label}`,
            },
          ]}
          sx={{
            [`& .${pieArcLabelClasses.root}`]: {
              fill: 'white',
              fontSize: 18,
              width: "100%",
            },
          }}
        />
        <div className="flex gap-6 justify-center w-full items-end">
          <p className="text-[#013D59] text-2xl font-[500] leading-none">
            จำนวนยอดขาย 10 อันดับ
          </p>
          <strong className="text-[40px] text-[#013D59] leading-none">
            {formatNumber(totalTop10)}
          </strong>
          <p className="text-[#013D59] text-2xl font-[500] leading-none">
            รายการ
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-8 w-full">
        <div className="flex flex-col gap-4  w-full items-end">
          <div className="flex justify-between w-full items-end gap-6">
            <p className="text-[#013D59] xl:text-2xl lg:text-lg text-xl font-[600] leading-none w-[40%] flex-shrink-0">
              จำนวนยอดขายทั้งหมด
            </p>
            <p className="text-[#013D59] xl:text-2xl lg:text-lg text-xl font-[600] leading-none bg-[#FFD25B] rounded-lg shadow p-1.5 xl:max-w-[150px] lg:max-w-[100px] max-w-[200px] w w-full text-right">
              {formatNumber(totalSold || 0)}
            </p>
            <p className="text-[#013D59] xl:text-2xl lg:text-lg text-xl font-[600] leading-none flex-shrink-0">
              รายการ/เดือน
            </p>
          </div>
          <div className="flex justify-between w-full items-end gap-6">
            <p className="text-[#013D59] xl:text-2xl lg:text-lg text-xl font-[600] leading-none w-[40%]">
              จำนวนยอดขาย 10 อันดับ
            </p>
            <p className="text-[#013D59] xl:text-2xl lg:text-lg text-xl font-[600] leading-none bg-[#FFD25B] rounded-lg shadow p-1.5 xl:max-w-[150px] lg:max-w-[100px] max-w-[200px] w-full text-right">
              {formatNumber(totalTop10 || 0)}
            </p>
            <p className="text-[#013D59] xl:text-2xl lg:text-lg text-xl font-[600] leading-none flex-shrink-0">
              รายการ/เดือน
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <p className="w-full text-[#013D59] text-xl font-[600]">
            อันดับยอดขาย
          </p>
          <div className="border-t border-[#013D59] rounded-full w-full "></div>
          <div className="w-full h-[500px] overflow-auto">
            {
              topMenu.length > 0 && (
                topMenu.slice(0, 31).map((item, index) => (
                  <div key={item.id} className="w-full items-center flex gap-4">
                    <p className="text-[#013D59] text-lg font-[400] ">
                      {index+1}.{" "}
                    </p>
                    <p className="text-[#013D59] text-lg font-[400] w-[80%]">
                      {item.name}
                    </p>
                    <p className="text-[#013D59] text-lg font-[400]">
                      {item.totalSold}
                    </p>
                    <p className="text-[#013D59] text-lg font-[400]">รายการ</p>
                  </div>
                ))
              )
            }
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChartTopMenu;
