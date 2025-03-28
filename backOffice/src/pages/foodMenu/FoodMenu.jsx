import React, { useEffect, useRef, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Modal } from "@mui/material";
import Switch, { switchClasses } from "@mui/joy/Switch";
import CancelIcon from "@mui/icons-material/Cancel";
import FastfoodIcon from "@mui/icons-material/Fastfood";
import SearchIcon from "@mui/icons-material/Search";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import AddFood from "./AddFood";
import EditFood from "./EditFood";
import {
  getFood,
  getCategoryFoods,
  getUpdateBestSellerFood,
  getDeleteFood,
} from "../../services/manageData.services";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import SwalUI from "../../components/swal-ui/swal-ui";

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
  const [foods, setFoods] = useState([]);
  const [cateFood, setCateFood] = useState([]);
  const MySwal = withReactContent(Swal);
  const api_path = "http://localhost:8003";

  const filteredFood = foods
    .filter((item) => {
      return (
        (selectedCategory
          ? item.cate_id.split(",").includes(selectedCategory.toString())
          : true) &&
        (selectedBestSeller !== null
          ? item.best_seller === selectedBestSeller
          : true)
      );
    })
    .filter((item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

  useEffect(() => {
    getFood().then((res) => {
      console.log("f", res.foods);
      setFoods(res.foods);
    });
    getCategoryFoods().then((res) => {
      console.log("c", res.cateFood);
      setCateFood(res.cateFood);
    });
  }, [refreshData]);

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
    setSelectedRow(row);
    setOpenEdit(true);
  };

  const formatNumber = (num) =>
    Number(num).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  const functionHandleDelete = (id) => {
    MySwal.fire({
      title: "คุณแน่ใจหรือไม่?",
      text: "หากลบเมนูอาหารนี้แล้ว จะไม่สามารถกู้คืนข้อมูลได้!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "ตกลง",
      cancelButtonText: "ยกเลิก",
    }).then((result) => {
      if (result.isConfirmed) {
        getDeleteFood(id)
          .then((res) => {
            SwalUI({
              status: res.status,
              description: res.description,
              title: res.title,
            });
            setRefreshData((prev) => prev + 1);
          })
          .catch((err) => {
            SwalUI({
              status: err.status,
              description: err.description,
              title: err.title,
            });
          });
      }
    });
  };

  const handleUpdateBestSeller = (id, checked) => {
    setFoods((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, best_seller: checked ? 1 : 0 } : item
      )
    );

    const param = { status: checked ? 1 : 0 };

    getUpdateBestSellerFood(id, param)
      .then((res) => {
        Swal.fire({
          position: "top-end",
          icon: "success",
          text: "เปลี่ยนสถานะสินค้าขายดีสำเร็จ",
          showConfirmButton: false,
          timer: 1000,
          width: "300px",
          customClass: {
            icon: "custom-swal-icon",
          },
        });
        setRefreshData((prev) => prev + 1);
      })
      .catch((err) => {
        setFoods((prev) =>
          prev.map((item) =>
            item.id === id ? { ...item, best_seller: !checked ? 1 : 0 } : item
          )
        );
      });
  };

  const columns = [
    {
      field: "index",
      headerName: "ลำดับ",
      headerAlign: "center",
      align: "center",
      width: 100,
      renderCell: (params) => {
        const index = filteredFood.findIndex(
          (item) => item.id === params.row.id
        );
        return index + 1;
      },
    },
    {
      field: "thumbnail_link",
      headerName: "รูป",
      headerAlign: "center",
      align: "center",
      sortable: false,
      width: 150,
      renderCell: (params) => (
        <div className="p-1 flex justify-center items-center">
          <img
            src={
              params.value ? api_path + params.value : "/icons/image-off.png"
            }
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
      field: "cate_id",
      headerName: "หมวดหมู่",
      headerAlign: "center",
      align: "center",
      width: 150,
      valueGetter: (params) => {
        const cateIds = params.split(",");
        const categoryNames = cateIds
          .map((cateId) => {
            const category = cateFood.find(
              (cate) => cate.id === Number(cateId)
            );
            return category ? category.title : null;
          })
          .filter(Boolean);
        return categoryNames.join(" , ");
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
          {params.row.special_price !== null &&
            params.row.special_price !== 0 && (
              <p className="text-[#8F8F8F] text-[16px] line-through h-[18px] mb-2">
                {formatNumber(params.row.price)} ฿
              </p>
            )}
          <p className="text-black text-[20px]">
            {formatNumber(params.row.special_price || params.row.price)} ฿
          </p>
        </div>
      ),
    },
    {
      field: "display",
      headerName: "สถานะ",
      headerAlign: "center",
      align: "center",
      sortable: false,
      width: 170,
      renderCell: (params) => (
        <div className="flex justify-center items-center h-full">
          <p className="text-[#313131] xl:text-lg text-base font-[400] text-center">
            {params.value === true
              ? "พร้อมบริการ"
              : params.value === false
              ? "สินค้าหมด"
              : "-"}
          </p>
        </div>
      ),
    },
    {
      field: "best_seller",
      headerName: "สินค้าขายดี",
      headerAlign: "center",
      align: "center",
      type: "number",
      width: 110,
      editable: false,
      renderCell: (params) => {
        // console.log("params.value", params.id, params.value , params.api.updateRows);

        return (
          <div
            className="relative flex justify-center items-center m-auto h-full w-full cursor-pointer"
            onClick={() => {
              const newValue = !params.value ? true : false;
              // params.api.updateRows([{ id: params.id, bestSeller: newValue }]);
              handleUpdateBestSeller(params.id, newValue);
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
      field: "details",
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
            className="cursor-pointer p-1 bg-[#F5A100] hover:bg-[#00537B]  w-[40px] h-[40px] m-auto rounded-lg transition-all duration-200 ease-in-out"
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
            onClick={() => functionHandleDelete(params.id)}
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
      <div className="flex 2xl:flex-row flex-col gap-4 w-full justify-between 2xl:items-center">
        <div className="flex flex-shrink-0 gap-2 justify-start items-center">
          <FastfoodIcon sx={{ color: "#00537B", fontSize: 35 }} />
          <p className="text-[#00537B] text-2xl font-[600]">เมนูอาหาร</p>
        </div>

        <div className="flex gap-4 justify-end items-center ">
          {/* cate */}
          <div className="relative" ref={categoryMenuRef}>
            <div className="flex flex-shrink-0 gap-2 items-center">
              <p className="text-[#313131] xl:text-xl text-base font-[600] flex-shrink-0">
                หมวดเมนู
              </p>
              <div
                className="bg-white cursor-pointer flex justify-between items-center gap-2 p-1.5 px-2 rounded-lg shadow  lg:w-[250px] w-[170px] max-w-full"
                onClick={() => setShowCategoryMenu(!showCategoryMenu)}
              >
                <p className="text-[#313131] xl:text-lg text-base font-[400] line-clamp-1">
                  {selectedCategory
                    ? cateFood.find((c) => c.id === selectedCategory)?.title
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
                <div className="bg-white flex flex-col gap-2 p-2 mt-2 rounded-lg shadow max-h-[400px] overflow-y-auto">
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
                  {cateFood.map((category) => (
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
                      {category.title}
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
                className="bg-white cursor-pointer flex justify-between items-center gap-2 py-1.5 px-2 rounded-lg shadow lg:w-[250px] w-[180px] max-w-full"
                onClick={() => setShowBestSellerMenu(!showBestSellerMenu)}
              >
                <p className="text-[#313131] xl:text-lg text-base font-[400] line-clamp-1">
                  {selectedBestSeller === true
                    ? "สินค้าขายดี"
                    : selectedBestSeller === false
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
                <div className="bg-white flex flex-col gap-2 p-2 mt-2 rounded-lg shadow max-h-[400px] overflow-y-auto">
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
                      setSelectedBestSeller(true);
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
                      setSelectedBestSeller(false);
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
            className="bg-[#00537B] cursor-pointer lg:max-w-[150px] max-w-[110px] w-full flex flex-shrink-0 justify-center items-center gap-2 p-1 px-2 rounded-lg shadow hover:bg-[#F5A100] transition-all duration-200 ease-in-out"
            onClick={handleOpenAdd}
          >
            <AddCircleOutlineIcon sx={{ color: "#fff", fontSize: 30 }} />
            <p className="text-white xl:text-lg text-base font-[400] ">
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
          pageSizeOptions={[5, 10]}
          disableSelectionOnClick
          localeText={{ noRowsLabel: "ไม่พบข้อมูล" }}
        />
      </Box>

      <Modal
        open={openAdd}
        onClose={() => {
          setOpenAdd(false);
        }}
        style={{ position: "absolute", zIndex: 1 }}
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
              <CancelIcon className="hover:text-[#00537B] cursor-pointer" />
            </button>
          </div>

          <AddFood
            setOpenAdd={setOpenAdd}
            setRefreshData={setRefreshData}
            cateFood={cateFood}
          />
        </Box>
      </Modal>

      <Modal
        open={openEdit}
        onClose={() => {
          setOpenEdit(false);
        }}
        style={{ position: "absolute", zIndex: 1 }}
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
              <CancelIcon className="hover:text-[#00537B] cursor-pointer" />
            </button>
          </div>

          <EditFood
            selectedRow={selectedRow}
            setOpenEdit={setOpenEdit}
            cateFood={cateFood}
            setRefreshData={setRefreshData}
            api_path={api_path}
          />
        </Box>
      </Modal>
    </div>
  );
}

export default FoodMenu;
