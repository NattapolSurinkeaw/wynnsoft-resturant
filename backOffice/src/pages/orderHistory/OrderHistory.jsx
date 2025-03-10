import React, { useEffect, useRef, useState } from "react";
import { cate, foodDetail } from "../../components/mockData/foodMenu";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Modal } from "@mui/material";
import { order_history } from "../../components/mockData/OrderHistory";
import { CustomTable } from "../../components/mockData/CustomTable/CustomTable";
function OrderHistory() {
  const [openModal, setOpenModal] = useState(false);
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(null); //สถานะ
  const menuStatus = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuStatus.current && !menuStatus.current.contains(event.target)) {
        setShowStatusMenu(false);
      }
    };
    if (showStatusMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showStatusMenu]);

  const clearFiltersStatus = () => {
    setSelectedStatus(null);
  };

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const formatNumber = (num) =>
    Number(num).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    
  const columns = [
    {
      field: "count",
      headerName: "ลำดับ",
      headerAlign: "center",
      align: "center",
      width: 100,
    },
    {
      field: "images",
      headerName: "รูป",
      headerAlign: "center",
      align: "center",
      sortable: false,
      width: 150,
      renderCell: (params) => (
        <div className="p-1 flex justify-center items-center">
          <img
            src={params.value}
            alt=""
            style={{
              borderRadius: "5px",
              width: "60px",
              height: "60px",
              objectFit: "cover",
            }}
          />
        </div>
      ),
    },
    {
      field: "name",
      headerName: "ชื่อ",
      width: 250,
      editable: false,
    },
    {
      field: "cateID",
      headerName: "หมวดหมู่",
      headerAlign: "center",
      align: "center",
      width: 150,
      valueGetter: (params) => {
        const category = cate.find((item) => item.id === params);
        return category ? category.name : "ไม่ระบุ";
      },
    },
    {
      field: "price",
      headerName: "ราคา (฿)",
      type: "number",
      headerAlign: "center",
      align: "right",
      width: 150,
      editable: false,
      renderCell: (params) => (
        <div className="flex flex-col justify-center items-end h-full">
          {params.row.specialPrice && (
            <p className="text-[#8F8F8F] text-[16px] line-through h-[18px] mb-2">
              {formatNumber(params.row.price)} ฿
            </p>
          )}
          <p className="text-black text-[20px]">
            {formatNumber(params.row.specialPrice || params.row.price)} ฿
          </p>
        </div>
      ),
    },
    {
      field: "status",
      headerName: "สถานะ",
      headerAlign: "center",
      align: "center",
      sortable: false,
      width: 170,
      renderCell: (params) => (
        <div className="flex justify-center items-center h-full">
          <p className="text-[#313131] xl:text-lg text-base font-[400] text-center">
            {params.value === 1
              ? "พร้อมบริการ"
              : params.value === 0
              ? "สินค้าหมด"
              : "-"}
          </p>
        </div>
      ),
    },
    {
      field: "detail",
      headerName: "รายละเอียด",
      sortable: false,
      width: 300,
      renderCell: (params) => {
        if (!params.value) {
          return "-";
        }
        return params.value;
      },
    },
    {
      field: "edit",
      headerAlign: "center",
      align: "center",
      sortable: false,
      width: 80,
      headerName: "",
      renderCell: (params) => (
        <div className="h-full flex justify-center items-center">
          <button
            className="cursor-pointer p-1 bg-[#F5A100] hover:bg-[#00537B] w-[30px] h-[30px] m-auto rounded-lg transition-all duration-200 ease-in-out"
            title="แก่ไข"
          >
            <img
              src={"/icons/edit.png"}
              alt=""
              onClick={() => {
                handleOpenEdit(params.row);
              }}
              className="w-full h-full "
            />
          </button>
        </div>
      ),
    },
    {
      field: "delete",
      headerAlign: "center",
      align: "center",
      sortable: false,
      width: 80,
      headerName: "",
      renderCell: (params) => (
        <div className="h-full flex justify-center items-center">
          <button
            className="cursor-pointer p-1 bg-[#F44D4D] hover:bg-[#00537B] w-[30px] h-[30px] m-auto rounded-lg transition-all duration-200 ease-in-out"
            title="ลบ"
          >
            <img src={"/icons/trash.png"} alt="" className="w-full h-full " />
          </button>
        </div>
      ),
    },
  ];
  return (
    <div>
      {" "}
      <Box className="w-full h-full">
        <DataGrid
          className="bg-white"
          rows={foodDetail}
          rowHeight={70}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 10,
              },
            },
          }}
          pageSizeOptions={[5]}
          disableSelectionOnClick
        />
      </Box>
    </div>
  );
}

export default OrderHistory;
