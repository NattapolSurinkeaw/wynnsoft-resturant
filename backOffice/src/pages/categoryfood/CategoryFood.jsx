import React, { useState, useEffect, useRef } from "react";
import {
  getCategoryFoods,
  getDeleteCategoryFood,
  getUpdateDisplayCatefood,
} from "../../services/manageData.services";
import AddCategoryFood from "./components/AddCategoryFood";
import EditCategoryFood from "./components/EditCategoryFood";
import { Box, Modal } from "@mui/material";
import Switch, { switchClasses } from "@mui/joy/Switch";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import SwalUI from "../../components/swal-ui/swal-ui";
import { DataGrid } from "@mui/x-data-grid";
import LayersOutlinedIcon from "@mui/icons-material/LayersOutlined";
import CancelIcon from "@mui/icons-material/Cancel";

function CategoryFood() {
  const [cateFood, setCateFood] = useState([]);

  const [handleCreate, setHandleCreate] = useState(false);
  const [handleEdit, setHandleEdit] = useState(false);
  const api_path = "http://localhost:8003";
  const [slcEdit, setSlcEdit] = useState([]);
  const [refreshData, setRefreshData] = useState(0);
  const MySwal = withReactContent(Swal);
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(null); //สถานะ

  const menuStatus = useRef(null);

  const FiltercateFood = cateFood
    .sort((a, b) => new Date(a.priority) - new Date(b.priority))
    .map((item, index) => ({
      ...item,
      count: index + 1,
    }))
    .filter((item) => {
      return selectedStatus === null
        ? true
        : item.status_display === selectedStatus;
    });

  const clearFiltersStatus = () => {
    setSelectedStatus(null);
  };

  useEffect(() => {
    getCategoryFoods().then((res) => {
      setCateFood(res.cateFood);
    });
  }, [refreshData]);

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

  const functionHandleCreate = () => {
    setHandleCreate(true);
    setHandleEdit(false);
  };

  const functionHandleEdit = (cate) => {
    setSlcEdit(cate);
    setHandleCreate(false);
    setHandleEdit(true);
  };

  const functionHandleDelete = (id) => {
    MySwal.fire({
      title: "คุณแน่ใจหรือไม่?",
      text: "หากลบหมวดหมู่อาหารนี้แล้ว จะไม่สามารถกู้คืนข้อมูลได้!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "ตกลง",
      cancelButtonText: "ยกเลิก",
    }).then((result) => {
      if (result.isConfirmed) {
        getDeleteCategoryFood(id)
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

  const handleUpdateDisplay = (id, checked) => {
    setCateFood((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status_display: checked ? 1 : 0 } : item
      )
    );

    const param = { status: checked ? 1 : 0 };

    getUpdateDisplayCatefood(id, param)
      .then((res) => {
        // console.log("Updated successfully", res);
        Swal.fire({
          position: "top-end",
          icon: "success",
          text: "เปลี่ยนสถานะหมวดหมู่สำเร็จ",
          showConfirmButton: false,
          timer: 1000,
          width: "300px",
          customClass: {
            icon: "custom-swal-icon"
          }
        });
        setRefreshData((prev) => prev + 1);
      })
      .catch((err) => {
        // console.error("Error updating:", err);
        setCateFood((prev) =>
          prev.map((item) =>
            item.id === id
              ? { ...item, status_display: !checked ? 1 : 0 }
              : item
          )
        );
      });
  };

  const columns = [
    {
      field: "count",
      headerName: "ลำดับ",
      headerAlign: "center",
      align: "center",
      width: 100,
    },
    {
      field: "thumbnail",
      headerName: "รูป",
      headerAlign: "center",
      align: "center",
      sortable: false,
      flex: 0.2, 
      minWidth: 120, 
      maxWidth: 200, 
      renderCell: (params) => (
        <div className="p-1 flex justify-center items-center">
          <img
            src={params.value ? api_path + params.value : "/icons/image-off.png"}
            alt="Thumbnail"
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
      field: "title",
      headerName: "",
      width: 400,
      flex: 1,
      minWidth: 200,
      editable: false,
    },
    {
      field: "status_display",
      headerName: "สถานะ",
      headerAlign: "center",
      align: "center",
      type: "number",
      flex: 0.2, 
      minWidth: 130, 
      maxWidth: 250, 
      editable: false,
      renderCell: (params) => {
        // console.log("params.value", params.id, params.value);

        return (
          <div
            className="relative flex justify-center items-center m-auto h-full w-full cursor-pointer"
            onClick={() => {
              const newValue = !params.value ? true : false;
              handleUpdateDisplay(params.id, newValue);
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
      field: "edit",
      headerAlign: "center",
      align: "center",
      sortable: false,
      flex: 0.2, 
      minWidth: 80, 
      maxWidth: 150, 
      headerName: "",
      renderCell: (params) => (
        <div className="h-full flex justify-center items-center">
          <button
            className="cursor-pointer p-1 bg-[#F5A100] hover:bg-[#00537B] w-[40px] h-[40px] m-auto rounded-lg transition-all duration-200 ease-in-out"
            title="แก่ไข"
          >
            <img
              src={"/icons/edit.png"}
              alt=""
              onClick={() => functionHandleEdit(params.row)}
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
      flex: 0.2, 
      minWidth: 80, 
      maxWidth: 150, 
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
    <div className="flex flex-col gap-4">
      <div className="flex justify-between w-full">
        <div className="flex flex-shrink-0 gap-2 justify-start items-center">
          <LayersOutlinedIcon sx={{ color: "#00537B", fontSize: 35 }} />
          <p className="text-[#00537B] text-2xl font-[600]">หมวดหมู่เมนู</p>
        </div>
        <div className="flex gap-4">
          <div className="flex flex-row items-center  gap-3">
            <span className="flex-shrink-0 text-right text-[#313131] text-xl font-bold">
              สถานะ
            </span>

            <div className="relative" ref={menuStatus}>
              <div
                className="bg-white cursor-pointer flex justify-between items-center border border-[#D9D9D9] gap-2 py-1.5 px-2 rounded-lg w-[245px] lg:h-[45px] max-w-full"
                onClick={() => setShowStatusMenu((prevState) => !prevState)}
              >
                <p className="text-[#313131] xl:text-lg text-base font-[400]">
                  {selectedStatus === true
                    ? "พร้อมบริการ"
                    : selectedStatus === false
                    ? "ไม่พร้อมบริการ"
                    : "เลือกสถานะ"}
                </p>
                <figure
                  className={`lg:w-[30px] w-[25px] lg:h-[30px] h-[25px] transition-all duration-300 ${
                    showStatusMenu ? "rotate-180" : ""
                  }`}
                >
                  <img
                    src="/icons/Group 949.png"
                    alt=""
                    className="w-full h-full"
                  />
                </figure>
              </div>

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
                        setTimeout(() => setShowStatusMenu(false), false);
                      }}
                    >
                      ทั้งหมด
                    </div>
                    <div className="border-t border-[#e6e6e6] rounded-full w-full"></div>

                    <div
                      className={`py-2 px-4 cursor-pointer hover:bg-[#00537B] hover:text-white text-black rounded-lg ${
                        selectedStatus === true ? "bg-[#F5A100] text-white" : ""
                      }`}
                      onClick={() => {
                        setSelectedStatus(true);
                        setShowStatusMenu(false);
                      }}
                    >
                      พร้อมบริการ
                    </div>
                    <div
                      className={`py-2 px-4 cursor-pointer hover:bg-[#00537B] hover:text-white text-black rounded-lg ${
                        selectedStatus === false
                          ? "bg-[#F5A100] text-white"
                          : ""
                      }`}
                      onClick={() => {
                        setSelectedStatus(false); // เลือกสถานะ "ไม่พร้อมบริการ"
                        setShowStatusMenu(false); // ซ่อนเมนู
                      }}
                    >
                      ไม่พร้อมบริการ
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          <button
            className="bg-[#00537B] cursor-pointer max-w-[150px] w-full flex flex-shrink-0 justify-center items-center gap-2 p-1 px-2 rounded-lg shadow hover:bg-[#F5A100] transition-all duration-200 ease-in-out"
            onClick={functionHandleCreate}
          >
            <AddCircleOutlineIcon sx={{ color: "#fff", fontSize: 30 }} />
            <p className="text-white xl:text-lg text-base font-[400]">
              เพิ่มหมวดหมู่
            </p>
          </button>
        </div>
      </div>

      <div className="w-full h-full flex gap-5">
        <Box className="w-full h-full">
          <DataGrid
            className="bg-white"
            rows={FiltercateFood}
            rowHeight={70}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 10,
                },
              },
            }}
            pageSizeOptions={[5,10]}
            disableSelectionOnClick
          />
        </Box>

        <Modal
          open={handleCreate}
          onClose={() => {
            setHandleCreate(false);
          }}
          style={{ position: "absolute", zIndex: 1,}}
        >
          <Box
            className="flex flex-col lg:w-[50%] w-[80%] px-8"
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
                {/* <FastfoodIcon sx={{ color: "#00537B", fontSize: 35 }} /> */}
                <p className="text-[#00537B] text-2xl font-[600]">
                  เพิ่มข้อมูล
                </p>
              </div>

              <button
                onClick={() => {
                  setHandleCreate(false);
                }}
              >
                <CancelIcon className="hover:text-[#00537B] cursor-pointer" />
              </button>
            </div>

            <AddCategoryFood
              setRefreshData={setRefreshData}
              setHandleCreate={setHandleCreate}
            />
          </Box>
        </Modal>

        <Modal
          open={handleEdit}
          onClose={() => {
            setHandleEdit(false);
          }}
          style={{ position: "absolute", zIndex: 1,}}
        >
          <Box
            className="flex flex-col lg:w-[50%] w-[80%] px-8"
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
                {/* <FastfoodIcon sx={{ color: "#00537B", fontSize: 35 }} /> */}
                <p className="text-[#00537B] text-2xl font-[600]">
                  แก้ไขข้อมูล
                </p>
              </div>

              <button
                onClick={() => {
                  setHandleEdit(false);
                }}
              >
              <CancelIcon className="hover:text-[#00537B] cursor-pointer" />
              </button>
            </div>

            <EditCategoryFood
              slcEdit={slcEdit}
              setRefreshData={setRefreshData}
              setHandleEdit={setHandleEdit}
            />
          </Box>
        </Modal>
      </div>
    </div>
  );
}

export default CategoryFood;
