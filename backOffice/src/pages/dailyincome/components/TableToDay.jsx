import React, { useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Modal } from "@mui/material";
import LeaderboardOutlinedIcon from "@mui/icons-material/LeaderboardOutlined";
import CancelIcon from "@mui/icons-material/Cancel";
import OrderDetail from "./OrderDetail";

function TableToDay({
  filteredOrders,
  PriceTotal,
  DiscountTotal,
  PriceAllTotal,
}) {
  const [openModalDetail, setOpenModalDetail] = useState(false);
  const [selectedRow, setSelectedRow] = useState({});

  const formatNumber = (num) =>
    Number(num).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  const handleOpenModalDetail = (row) => {
    setSelectedRow({ ...row });
    setOpenModalDetail(true);
  };

  const columns = [
    {
      field: "count",
      headerName: "ลำดับ",
      headerAlign: "center",
      align: "center",
      width: 80,
    },
    {
      field: "order_number",
      headerName: "เลขออเดอร์",
      headerAlign: "center",
      align: "center",
      width: 150,
    },
    {
      field: "formattedTime",
      headerName: "เวลา",
      headerAlign: "center",
      align: "center",
      minWidth: 150,
      maxWidth: 200,
    },
    {
      field: "table",
      headerName: "โต๊ะ",
      headerAlign: "center",
      align: "center",
      minWidth: 150,
      maxWidth: 200,
    },
    {
      field: "totalamount",
      headerName: "รายการ",
      headerAlign: "center",
      align: "center",
      minWidth: 150,
      maxWidth: 200,
    },
    {
      field: "payment",
      headerName: "ช่องทางชำระ",
      headerAlign: "center",
      align: "center",
      sortable: false,
      width: 170,
      renderCell: (params) => (
        <div className="flex justify-center items-center h-full">
          <p className="text-[#313131] xl:text-lg text-base font-[400] text-center">
            {params.value === "1"
              ? "ชำระผ่าน QR"
              : params.value === "2"
              ? "ชำระเงินสด"
              : "-"}
          </p>
        </div>
      ),
    },
    {
      field: "totalPrice",
      headerName: "ยอดรวม (฿)",
      headerAlign: "center",
      align: "right",
      width: 150,
      renderCell: (params) => (
        <div className="flex flex-col justify-center items-end h-full">
          <p className="text-black text-[20px]">
            {params.value ? formatNumber(params.value) : formatNumber(0)} ฿
          </p>
        </div>
      ),
    },
    {
      field: "totalDiscount",
      headerName: "ยอดส่วนลด (฿)",
      headerAlign: "center",
      align: "right",
      width: 150,
      renderCell: (params) => (
        <div className="flex flex-col justify-center items-end h-full">
          <p className="text-black text-[20px]">
            {params.value ? formatNumber(params.value) : formatNumber(0)} ฿
          </p>
        </div>
      ),
    },
    {
      field: "totalPriceAll",
      headerName: "ยอดทั้งหมด (฿)",
      headerAlign: "center",
      align: "right",
      width: 150,
      renderCell: (params) => (
        <div className="flex flex-col justify-center items-end h-full">
          <p className="text-black text-[20px]">
            {params.value ? formatNumber(params.value) : formatNumber(0)} ฿
          </p>
        </div>
      ),
    },
    {
      field: "detail",
      headerAlign: "center",
      align: "center",
      sortable: false,
      width: 150,
      headerName: "",
      renderCell: (params) => (
        <div
          className="h-full flex justify-center items-center"
          onClick={() => {
            handleOpenModalDetail(params.row);
          }}
        >
          <p
            className="cursor-pointer text-lg text-white p-1 px-2 bg-[#F5A100] hover:bg-[#00537B] m-auto rounded-lg transition-all duration-200 ease-in-out"
            title="รายละเอียด"
          >
            รายละเอียด
          </p>
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
            className="cursor-pointer p-1 bg-[#F44D4D] hover:bg-[#00537B] w-[40px] h-[40px] m-auto rounded-lg transition-all duration-200 ease-in-out"
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
      <Box className="w-full h-full relative">
        <DataGrid
          className="bg-white"
          rows={filteredOrders}
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

        <div className="w-full flex 3xl:justify-end justify-center items-center xl:gap-6 gap-4 absolute 2xl:-inset-x-[20%] xl:-inset-x-4 lg:-inset-x-16 -inset-x-[10%] bottom-2">
          <div className="flex justify-center items-center gap-2 ">
            <p className="xl:text-lg text-sm font-semibold text-[#313131] flex-shrink-0">
              ยอดรวม :{" "}
            </p>
            <p className="xl:text-lg text-sm font-bold text-[#313131] w-full text-center border-b-6 border-red-600 border-double">
              {formatNumber(PriceTotal)} ฿
            </p>
          </div>
          <div className="flex justify-center items-center gap-2 ">
            <p className="xl:text-lg text-sm font-semibold text-[#313131] flex-shrink-0">
              ยอดรวมส่วนลด :{" "}
            </p>
            <p className="xl:text-lg text-sm font-bold text-[#313131] w-full text-center border-b-6 border-red-600 border-double">
              {formatNumber(DiscountTotal)} ฿
            </p>
          </div>
          <div className="flex justify-center items-center gap-2 ">
            <p className="xl:text-lg text-sm font-semibold text-[#313131] flex-shrink-0">
              ยอดรวมทั้งหมด :{" "}
            </p>
            <p className="xl:text-lg text-sm font-bold text-[#313131] w-full text-center border-b-6 border-red-600 border-double">
              {formatNumber(PriceAllTotal)} ฿
            </p>
          </div>
        </div>
      </Box>

      <Modal
        open={openModalDetail}
        onClose={() => {
          setOpenModalDetail(false);
        }}
      >
        <Box
          className="flex flex-col gap-4 2xl:max-w-[60%] lg:max-w-[80%] max-w-[95%] w-full px-4 "
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "white",
            borderRadius: "10px",
            boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
            backgroundColor: "#FFEFC6",
            p: 2,
          }}
        >
          <div className="flex justify-between ">
            <div className="flex gap-2 items-center">
              <LeaderboardOutlinedIcon
                sx={{ color: "#00537B", fontSize: 35 }}
              />
              <p className="text-[#00537B] text-2xl font-[600] ">รายละเอียด</p>
            </div>

            <button
              onClick={() => {
                setOpenModalDetail(false);
              }}
            >
              <CancelIcon className="hover:text-[#00537B] cursor-pointer" />
            </button>
          </div>

          <OrderDetail
            selectedRow={selectedRow}
            onClickClose={setOpenModalDetail}
          />
        </Box>
      </Modal>
    </div>
  );
}

export default TableToDay;
