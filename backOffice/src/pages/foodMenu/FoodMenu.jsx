import React, { useEffect, useRef, useState } from "react";
import { cate, foodDetail } from "../../components/mockData/foodMenu";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Modal } from "@mui/material";
import Switch, { switchClasses } from "@mui/joy/Switch";
import CancelIcon from "@mui/icons-material/Cancel";
import FastfoodIcon from "@mui/icons-material/Fastfood";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import AddFood from "./AddFood";
import EditFood from "./EditFood";

function FoodMenu() {
  const [searchTerm, setSearchTerm] = useState(""); // ค้นหาเมนู
  const [selectedCategory, setSelectedCategory] = useState(null); // สำหรับหมวดหมู่ที่เลือก
  const [selectedBestSeller, setSelectedBestSeller] = useState(null); // สำหรับสินค้าขายดีที่เลือก
  const [showCategoryMenu, setShowCategoryMenu] = useState(false);
  const [showBestSellerMenu, setShowBestSellerMenu] = useState(null);
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedRow, setSelectedRow] = useState({});
  const categoryMenuRef = useRef(null);
  const bestSellerMenuRef = useRef(null);
  const [refreshData, setRefreshData] = useState(0);

  const filteredFood = foodDetail
    .filter((item) => {
      return (
        (selectedCategory ? item.cateID === selectedCategory : true) &&
        (selectedBestSeller !== null
          ? item.bestSeller === selectedBestSeller
          : true)
      );
    })
    .filter((item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        categoryMenuRef.current &&
        !categoryMenuRef.current.contains(event.target) &&
        bestSellerMenuRef.current &&
        !bestSellerMenuRef.current.contains(event.target)
      ) {
        setShowCategoryMenu(false);
        setShowBestSellerMenu(false);
      }
    };

    if (showCategoryMenu || showBestSellerMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showCategoryMenu, showBestSellerMenu]);

  useEffect(() => {
    if (selectedBestSeller === null) {
      setShowBestSellerMenu(false);
    }
    if (selectedCategory === null) {
      setShowCategoryMenu(false);
    }
  }, [selectedBestSeller, selectedCategory]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };
  // Clear Filters
  const clearFiltersCate = () => {
    setSelectedCategory(null);
  };
  const clearFiltersBestSeller = () => {
    setSelectedBestSeller(null);
  };

  const handleOpenAdd = () => {
    setOpenAdd(true);
  };

  const handleOpenEdit = (row) => {
    console.log(row);
    setSelectedRow(row);
    setOpenEdit(true);
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
      field: "bestSeller",
      headerName: "สินค้าขายดี",
      headerAlign: "center",
      align: "center",
      type: "number",
      width: 110,
      editable: false,
      renderCell: (params) => {
        return (
          <div
            className="relative flex justify-center items-center m-auto h-full w-full cursor-pointer"
            onClick={() => {
              const newValue = !params.value ? 1 : 0;
              params.api.updateRows([{ id: params.id, bestSeller: newValue }]);
            }}
          >
            <Switch
              sx={(theme) => ({
                pointerEvents: "none",
                "--Switch-thumbShadow": "0 3px 7px 0 rgba(0 0 0 / 0.12)",
                "--Switch-thumbSize": "27px",
                "--Switch-trackWidth": "51px",
                "--Switch-trackHeight": "31px",
                "--Switch-trackBackground":
                  theme.vars.palette.background.level3,
                [`& .${switchClasses.thumb}`]: {
                  transition: "width 0.05s, left 0.05s",
                },
                "&:hover": {
                  "--Switch-trackBackground":
                    theme.vars.palette.background.level3,
                },
                "&:active": {
                  "--Switch-thumbWidth": "32px",
                },
                [`&.${switchClasses.checked}`]: {
                  "--Switch-trackBackground": "rgb(48 209 88)",
                  "&:hover": {
                    "--Switch-trackBackground": "rgb(48 209 88)",
                  },
                },
              })}
              checked={Boolean(params.value)}
            />
          </div>
        );
      },
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
    <div className="flex flex-col justify-center gap-6 w-full flex-1">
      <div className="flex 2xl:flex-row flex-col gap-4 w-full justify-between items-center">
        <div className="flex flex-shrink-0 gap-2 justify-start items-center">
          <FastfoodIcon sx={{ color: "#00537B", fontSize: 35 }} />
          <p className="text-[#00537B] text-2xl font-[600]">เมนูอาหาร</p>
        </div>

        <div className="flex gap-4 justify-ennd items-center ">
          {/* cate */}
          <div className="relative" ref={categoryMenuRef}>
            <div className="flex flex-shrink-0 gap-2 items-center">
              <p className="text-[#313131] xl:text-xl text-base font-[600] flex-shrink-0">
                หมวดเมนู
              </p>
              <div
                className="bg-white cursor-pointer flex justify-between items-center gap-2 p-1.5 px-2 rounded-lg shadow  w-[170px] max-w-full"
                onClick={() => setShowCategoryMenu(!showCategoryMenu)}
              >
                <p className="text-[#313131] xl:text-lg text-base font-[400]">
                  {selectedCategory
                    ? cate.find((c) => c.id === selectedCategory)?.name
                    : "เลือกหมวดหมู่"}
                </p>
                <figure
                  className={`lg:w-[30px] w-[25px] lg:h-[30px] h-[25px] transition-all duration-300 ${
                    !showCategoryMenu ? "" : "rotate-180"
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

            {/* เมนูหมวดหมู่ */}
            <div className="absolute w-full h-full z-99">
              {showCategoryMenu && (
                <div className="bg-white flex flex-col gap-2 p-2 mt-2 rounded-lg shadow">
                  <div
                    className={`py-2 px-4 cursor-pointer hover:bg-[#00537B] hover:text-white text-black rounded-lg ${
                      selectedCategory === null ? "bg-[#F5A100] text-white" : ""
                    }`}
                    onClick={() => {
                      clearFiltersCate();
                      setTimeout(() => setShowCategoryMenu(false), 0);
                    }}
                  >
                    ทั้งหมด
                  </div>
                  <div className="border-t border-[#e6e6e6] rounded-full w-full"></div>
                  {cate.map((category) => (
                    <div
                      key={category.id}
                      className={`py-2 px-4 cursor-pointer hover:bg-[#00537B] hover:text-white text-black rounded-lg ${
                        selectedCategory === category.id
                          ? "bg-[#F5A100] text-white"
                          : ""
                      }`}
                      onClick={() => {
                        setSelectedCategory(category.id);
                        setShowCategoryMenu(false);
                      }}
                    >
                      {category.name}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* cate best seller*/}
          <div className="relative" ref={bestSellerMenuRef}>
            <div className="flex flex-shrink-0 gap-2 items-center">
              <p className="text-[#313131] xl:text-xl text-base font-[600] flex-shrink-0">
                สินค้าขายดี
              </p>
              <div
                className="bg-white cursor-pointer flex justify-between items-center gap-2 py-1.5 px-2 rounded-lg shadow w-[180px] max-w-full "
                onClick={() => setShowBestSellerMenu(!showBestSellerMenu)}
              >
                <p className="text-[#313131] xl:text-lg text-base font-[400]">
                  {selectedBestSeller === 1
                    ? "สินค้าขายดี"
                    : selectedBestSeller === 0
                    ? "สินค้าทั่วไป"
                    : "เลือกแสดงผล"}
                </p>
                <figure
                  className={`lg:w-[30px] w-[25px] lg:h-[30px] h-[25px] transition-all duration-300 ${
                    !showBestSellerMenu ? "" : "rotate-180"
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

            {/* สินค้าขายดี */}
            <div className="absolute w-full h-full z-99">
              {showBestSellerMenu && (
                <div className="bg-white flex flex-col gap-2 p-2 mt-2 rounded-lg shadow">
                  <div
                    className={`py-2 px-4 cursor-pointer hover:bg-[#00537B] hover:text-white text-black rounded-lg ${
                      selectedBestSeller === null
                        ? "bg-[#F5A100] text-white"
                        : ""
                    }`}
                    onClick={() => {
                      clearFiltersBestSeller();
                      setTimeout(() => setShowBestSellerMenu(false), 0);
                    }}
                  >
                    ทั้งหมด
                  </div>
                  <div className="border-t border-[#e6e6e6] rounded-full w-full"></div>

                  <div
                    className={`py-2 px-4 cursor-pointer hover:bg-[#00537B] hover:text-white text-black rounded-lg ${
                      selectedBestSeller === 1 ? "bg-[#F5A100] text-white" : ""
                    }`}
                    onClick={() => {
                      setSelectedBestSeller(1);
                      setShowBestSellerMenu(false);
                    }}
                  >
                    สินค้าขายดี
                  </div>
                  <div
                    className={`py-2 px-4 cursor-pointer hover:bg-[#00537B] hover:text-white text-black rounded-lg ${
                      selectedBestSeller === 0 ? "bg-[#F5A100] text-white" : ""
                    }`}
                    onClick={() => {
                      setSelectedBestSeller(0);
                      setShowBestSellerMenu(false);
                    }}
                  >
                    สินค้าทั่วไป
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* search menu */}
          <div className="bg-white md:px-4 px-1 py-1.5 rounded-lg max-w-[300px] mx-auto h-[40px] text-[#8F8F8F] flex items-center border border-gray-300 justify-between">
            <input
              type="text"
              placeholder="ค้นหาเมนู"
              className="outline-none bg-transparent text-[#313131] w-full"
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <SearchIcon sx={{ color: "#00537B", fontSize: 25 }} />
          </div>

          <button
            className="bg-[#00537B] cursor-pointer max-w-[110px] w-full flex flex-shrink-0 justify-center items-center gap-2 p-1 px-2 rounded-lg shadow hover:bg-[#F5A100] transition-all duration-200 ease-in-out"
            onClick={handleOpenAdd}
          >
            <AddIcon sx={{ color: "#fff", fontSize: 30 }} />
            <p className="text-white xl:text-lg text-base font-[400]">
              เพิ่มเมนู
            </p>
          </button>
        </div>
      </div>

      <Box sx={{ height: "100%", width: "100%" }}>
        <DataGrid
          className="bg-white"
          rows={filteredFood}
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
      <Modal
        open={openAdd}
        onClose={() => {
          setOpenAdd(false);
        }}
      >
        <Box
          className="flex flex-col gap-4 xl:max-w-[60%] max-w-[90%] w-full px-8"
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "white",
            borderRadius: "10px",
            boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
            p: 4,
          }}
        >
          <div className="flex justify-between">
            <div className="flex gap-2 items-center">
              <FastfoodIcon sx={{ color: "#00537B", fontSize: 35 }} />
              <p className="text-[#00537B] text-2xl font-[600]">
                เพิ่มข้อมูล เมนูอาหาร
              </p>
            </div>

            <button
              onClick={() => {
                setOpenAdd(false);
              }}
            >
              <CancelIcon className="hover:text-[#00537B]" />
            </button>
          </div>

          <AddFood onClickClose={setOpenAdd} />
        </Box>
      </Modal>

      <Modal
        open={openEdit}
        onClose={() => {
          setOpenEdit(false);
        }}
      >
        <Box
          className="flex flex-col gap-4 xl:max-w-[60%] max-w-[90%] w-full px-8"
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "white",
            borderRadius: "10px",
            boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
            p: 4,
          }}
        >
          <div className="flex justify-between">
            <div className="flex gap-2 items-center">
              <FastfoodIcon sx={{ color: "#00537B", fontSize: 35 }} />
              <p className="text-[#00537B] text-2xl font-[600]">
                แก้ไขข้อมูล เมนูอาหาร
              </p>
            </div>

            <button
              onClick={() => {
                setOpenEdit(false);
              }}
            >
              <CancelIcon className="hover:text-[#00537B]" />
            </button>
          </div>

          {/* <UpdateFrom
              selectedRow={selectedRow}
              setOpenEdit={setOpenEdit}
              setRefreshData={setRefreshData}
            /> */}

          <EditFood selectedRow={selectedRow} onClickClose={setOpenEdit} />
        </Box>
      </Modal>
    </div>
  );
}

export default FoodMenu;
