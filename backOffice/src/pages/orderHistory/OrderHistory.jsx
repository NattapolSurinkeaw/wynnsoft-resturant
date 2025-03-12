import React, { useEffect, useRef, useState } from "react";
import { foodDetail } from "../../components/mockData/foodMenu";
import { order_history } from "../../components/mockData/OrderHistory";
import { CustomTable } from "../../components/mockData/CustomTable/CustomTable";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Modal } from "@mui/material";
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";
import EventNoteOutlinedIcon from "@mui/icons-material/EventNoteOutlined";
import DateRangeIcon from "@mui/icons-material/DateRange";
import dayjs from "dayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import OrderDetail from "./components/OrderDetail";
import CancelIcon from "@mui/icons-material/Cancel";

function OrderHistory() {
  const [openModalDetail, setOpenModalDetail] = useState(false);
  const [selectedRow, setSelectedRow] = useState({});
  const [openModalImg, setOpenModalImg] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(null); //สถานะ
  const [dateStart, setDateStart] = useState(null);
  const [dateEnd, setDateEnd] = useState(null);
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

  const handleOpenModalImg = (imageUrl) => {
    setSelectedImage(imageUrl);

    setOpenModalImg(true);
  };

  const handleOpenModalDetail = (row) => {
    // หาเมนูที่ตรงกับ menuID ที่มีใน row
    const menuDetails = row.menuID.map((menuId) => {
      return foodDetail.find((menu) => menu.id === menuId);
    });
    const tableDetails = CustomTable.find((table) => table.id === row.tableID);
    const note = row.note; 

    setSelectedRow({ ...row, menuDetails, tableDetails ,note});
    setOpenModalDetail(true);
  };

  const formatNumber = (num) =>
    Number(num).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  const calculateTotalByTable = () => {
    return order_history.map((order) => {
      const totalPrice = order.menuID.reduce((sum, menuId) => {
        const foodItem = foodDetail.find((food) => food.id === menuId);
        return sum + (foodItem?.price || 0) * (foodItem?.count || 1);
      }, 0);

      const totalSpecialPrice = order.menuID.reduce((sum, menuId) => {
        const foodItem = foodDetail.find((food) => food.id === menuId);
        return sum + (foodItem?.specialPrice || 0) * (foodItem?.count || 1);
      }, 0);

      const totalDiscount = totalPrice - totalSpecialPrice;

      return {
        ...order,
        totalPrice,
        totalSpecialPrice,
        totalDiscount,
      };
    });
  };

  const tableData = calculateTotalByTable();

  // **Filter ข้อมูลตามวันที่และสถานะ**
  const filteredTableData = tableData
    .filter((order) => {
      const orderDate = dayjs(order.createdAt, "DD-MM-YYYY");

      const matchStatus =
        selectedStatus === null || order.payment_status === selectedStatus;

      const matchDate =
        (!dateStart ||
          orderDate.isAfter(
            dayjs(dateStart, "DD-MM-YYYY").subtract(1, "day")
          )) &&
        (!dateEnd ||
          orderDate.isBefore(dayjs(dateEnd, "DD-MM-YYYY").add(1, "day")));

      return matchStatus && matchDate;
    })
    .sort((a, b) => {
      const dateA = dayjs(a.createdAt, "DD-MM-YYYY");
      const dateB = dayjs(b.createdAt, "DD-MM-YYYY");

      return dateB.isBefore(dateA) ? 1 : -1; // เรียงจากวันที่ใหม่ที่สุด
    })
    .map((item, index) => ({ ...item, count: index + 1 }));

  // คำนวณผลรวมของ ส่วนลดจากเฉพาะ `filteredTableData`
  const totalDiscount = filteredTableData.reduce(
    (sum, order) => sum + order.totalDiscount,
    0
  );

  // คำนวณผลรวมของ ราคาพิเศษจากเฉพาะ `filteredTableData`
  const totalSpecialPrice = filteredTableData.reduce(
    (sum, order) => sum + order.totalSpecialPrice,
    0
  );

  const columns = [
    {
      field: "count",
      headerName: "ลำดับ",
      headerAlign: "center",
      align: "center",
      width: 100,
    },
    {
      field: "order_number",
      headerName: "เลขออเดอร์",
      headerAlign: "center",
      align: "center",
      width: 200,
      editable: false,
    },
    {
      field: "createdAt",
      headerName: "วันที่สั่ง",
      width: 150,
      editable: false,
    },
    {
      field: "time",
      headerName: "เวลา",
      headerAlign: "center",
      align: "center",
      width: 100,
      editable: false,
    },
    {
      field: "tableID",
      headerName: "โต๊ะ",
      headerAlign: "center",
      align: "center",
      width: 100,
      valueGetter: (params) => {
        const tableName = CustomTable.find((item) => item.id === params);
        return tableName ? tableName.name_table : "-";
      },
    },
    {
      field: "payment_status",
      headerName: "ช่องทางชำระ",
      headerAlign: "center",
      align: "center",
      sortable: false,
      width: 170,
      renderCell: (params) => (
        <div className="flex justify-center items-center h-full">
          <p className="text-[#313131] xl:text-lg text-base font-[400] text-center">
            {params.value === 1
              ? "ชำระผ่าน QR"
              : params.value === 0
              ? "ชำระเงินสด"
              : "-"}
          </p>
        </div>
      ),
    },
    {
      field: "totalDiscount",
      headerName: "ยอดส่วนลด (฿)",
      type: "number",
      headerAlign: "center",
      align: "right",
      width: 200,
      editable: false,
      renderCell: (params) => (
        <div className="flex flex-col justify-center items-end h-full">
          <p className="text-black text-[20px]">
            {formatNumber(params.value)} ฿
          </p>
        </div>
      ),
    },
    {
      field: "priec",
      headerName: "ยอดทั้งหมด (฿)",
      type: "number",
      headerAlign: "center",
      align: "right",
      width: 150,
      editable: false,
      renderCell: (params) => (
        <div className="flex flex-col justify-center items-end h-full">
          {params.row.totalSpecialPrice > 0 && (
            <p className="text-[#8F8F8F] text-[16px] line-through h-[18px] mb-2">
              {formatNumber(params.row.totalPrice)} ฿
            </p>
          )}
          <p className="text-black text-[20px]">
            {formatNumber(
              params.row.totalSpecialPrice || params.row.totalPrice
            )}{" "}
            ฿
          </p>
        </div>
      ),
    },
    {
      field: "images",
      headerName: "สลิปโอน",
      headerAlign: "center",
      align: "center",
      sortable: false,
      width: 150,
      renderCell: (params) => (
        <div
          className={`p-1 flex justify-center items-center cursor-pointer m-auto h-full ${
            !params.value ? "pointer-events-none opacity-50" : ""
          }`}
          onClick={() => params.value && handleOpenModalImg(params.value)}
        >
          <div
            className={`cursor-pointer p-1 ${
              !params.value ? "bg-[#cccccc]" : "bg-[#15A62D]"
            } hover:bg-[#cccccc] w-[40px] h-[40px] m-auto rounded-lg transition-all duration-200 ease-in-out`}
            title="ดูรูป"
          >
            <img src={"/icons/view.png"} alt="" className="w-full h-full " />
          </div>
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
    <div className="flex flex-col justify-center gap-6 w-full flex-1">
      <div className="flex 2xl:flex-row flex-col gap-4 w-full justify-between items-center">
        <div className="flex flex-shrink-0 gap-2 justify-start items-center">
          <EventNoteOutlinedIcon sx={{ color: "#00537B", fontSize: 35 }} />
          <p className="text-[#00537B] text-2xl font-[600]">ประวัติการสั่ง</p>
        </div>

        <div className="flex gap-4 justify-ennd items-center ">
          {/* cate best seller*/}
          <div className="relative" ref={menuStatus}>
            <div className="flex flex-shrink-0 gap-2 items-center">
              <p className="text-[#313131] xl:text-xl text-base font-[600] flex-shrink-0">
                ช่องทางชำระ
              </p>
              <div
                className="bg-white cursor-pointer flex justify-between items-center gap-2 py-1.5 px-2 rounded-lg shadow w-[200px] max-w-full "
                onClick={() => setShowStatusMenu(!showStatusMenu)}
              >
                <p className="text-[#313131] xl:text-lg text-base font-[400]">
                  {selectedStatus === 1
                    ? "ชำระผ่าน QR"
                    : selectedStatus === 0
                    ? "ชำระเงินสด"
                    : "เลือกการชำระ"}
                </p>
                <figure
                  className={`lg:w-[30px] w-[25px] lg:h-[30px] h-[25px] transition-all duration-300 ${
                    !showStatusMenu ? "" : "rotate-180"
                  }`}
                >
                  <img
                    src="/icons/Group 949.png"
                    alt=""
                    className="w-full h-full"
                  />
                </figure>
              </div>
            </div>

            {/* ชำระเงิน */}
            <div
              className={`absolute w-full h-full ${
                showStatusMenu ? "z-99" : "z-0"
              }`}
            >
              {showStatusMenu && (
                <div className="bg-white flex flex-col gap-2 p-2 mt-2 rounded-lg shadow">
                  <div
                    className={`py-2 px-4 cursor-pointer hover:bg-[#00537B] hover:text-white text-black rounded-lg ${
                      selectedStatus === null ? "bg-[#F5A100] text-white" : ""
                    }`}
                    onClick={() => {
                      clearFiltersStatus();
                      setTimeout(() => setShowStatusMenu(false), 0);
                    }}
                  >
                    ทั้งหมด
                  </div>
                  <div className="border-t border-[#e6e6e6] rounded-full w-full"></div>

                  <div
                    className={`py-2 px-4 cursor-pointer hover:bg-[#00537B] hover:text-white text-black rounded-lg ${
                      selectedStatus === 1 ? "bg-[#F5A100] text-white" : ""
                    }`}
                    onClick={() => {
                      setSelectedStatus(1);
                      setShowStatusMenu(false);
                    }}
                  >
                    ชำระผ่าน QR
                  </div>
                  <div
                    className={`py-2 px-4 cursor-pointer hover:bg-[#00537B] hover:text-white text-black rounded-lg ${
                      selectedStatus === 0 ? "bg-[#F5A100] text-white" : ""
                    }`}
                    onClick={() => {
                      setSelectedStatus(0);
                      setShowStatusMenu(false);
                    }}
                  >
                    ชำระเงินสด
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* date start*/}
          <div className="flex flex-shrink-0 gap-2 items-center">
            <p className="text-[#313131] xl:text-xl text-base font-[600] flex-shrink-0">
              ตั้งแต่
            </p>

            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer
                components={["DatePicker"]}
                sx={{
                  padding: "5px 0px 0px 0px",
                  paddingRight: "0px",
                  height: "45px",
                }}
              >
                <DatePicker
                  value={dateStart}
                  onChange={(newValue) => setDateStart(newValue)}
                  sx={{ width: "250px", height: "100%" }}
                  format="DD-MM-YYYY"
                  slotProps={{
                    textField: {
                      placeholder: "วัน-เดือน-ปี",
                      label: null,
                      sx: {
                        backgroundColor: "#fff",
                        fontSize: "16px",
                        height: "100%",
                      },
                    },
                  }}
                />
              </DemoContainer>
            </LocalizationProvider>
          </div>

          {/* to start*/}
          <div className="flex flex-shrink-0 gap-2 items-center">
            <p className="text-[#313131] xl:text-xl text-base font-[600] flex-shrink-0">
              จนถึง
            </p>

            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer
                components={["DatePicker"]}
                sx={{
                  padding: "5px 0px 0px 0px",
                  paddingRight: "0px",
                  height: "45px",
                }}
              >
                <DatePicker
                  value={dateEnd}
                  onChange={(newValue) => setDateEnd(newValue)}
                  sx={{ width: "250px", height: "100%" }}
                  format="DD-MM-YYYY"
                  slotProps={{
                    textField: {
                      placeholder: "วัน-เดือน-ปี",
                      label: null,
                      sx: {
                        backgroundColor: "#fff",
                        fontSize: "16px",
                        height: "100%",
                      },
                    },
                  }}
                />
              </DemoContainer>
            </LocalizationProvider>
          </div>

          <button
            className="bg-[#00537B] cursor-pointer max-w-[200px] w-full flex flex-shrink-0 justify-center items-center gap-1 p-1 px-4 rounded-lg shadow hover:bg-[#F5A100] transition-all duration-200 ease-in-out"
            // onClick={handleOpenAdd}
          >
            <FileUploadOutlinedIcon sx={{ color: "#fff", fontSize: 30 }} />
            <p className="text-white xl:text-lg text-base font-[400]">
              Export Excel
            </p>
          </button>
        </div>
      </div>

      <Box className="w-full h-full relative">
        <DataGrid
          className="bg-white"
          rows={filteredTableData}
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
        <div className="absolute bottom-3 left-1/2 flex items-center justify-between gap-3 w-[23%]">
          <p className="w-[50%]">ยอดรวมทั้งหมด</p>
          <div className="flex items-center justify-between border-b-2 border-red-600  decoration-double w-full">
            <p className="text-lg font-bold text-right">
              {formatNumber(totalDiscount)}
            </p>
            <p className="text-lg font-bold">
              {formatNumber(totalSpecialPrice)}
            </p>
          </div>
        </div>
      </Box>

      <Modal
        open={openModalImg}
        onClose={() => {
          setOpenModalImg(false);
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <div className="flex flex-row z-50 gap-4 items-start">
            <img
              src={selectedImage}
              alt="Zoomed Shop"
              style={{
                maxWidth: "90vw",
                maxHeight: "90vh",
                width: "500px",
              }}
            />
            <button
              onClick={() => {
                setOpenModalImg(false);
              }}
            >
              <CancelOutlinedIcon
                className="hover:text-[#F5A100] text-white drop-shadow"
                sx={{ fontSize: "50px" }}
              />
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        open={openModalDetail}
        onClose={() => {
          setOpenModalDetail(false);
        }}
      >
        <Box
          className="flex flex-col gap-4 2xl:max-w-[60%] lg:max-w-[80%] max-w-[95%] w-full px-8 "
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "white",
            borderRadius: "10px",
            boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
            backgroundColor: "#FFEFC6",
            p: 4,
          }}
        >
          <div className="flex justify-between ">
            <div className="flex gap-2 items-center">
              <EventNoteOutlinedIcon sx={{ color: "#00537B", fontSize: 35 }} />
              <p className="text-[#00537B] text-2xl font-[600] ">รายละเอียด</p>
            </div>

            <button
              onClick={() => {
                setOpenModalDetail(false);
              }}
            >
              <CancelIcon className="hover:text-[#00537B]" />
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

export default OrderHistory;