import React, { useState, useEffect } from "react";
import Header from "./sections/Header";
import AddTable from "./sections/tab/AddTable";
import EditTable from "./sections/tab/EditTable";
import ViewTable from "./sections/tab/ViewTable";
import FoodList from "./sections/tab/FoodList";
import Table from "./sections/Table";
import TotalBill from "./sections/tab/TotalBill";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
// import { CustomTable as CustomTableData } from "../../components/mockData/CustomTable/CustomTable";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import { getTableall } from "../../services/table_manage.service";
import { getOrderCurrent } from "../../services/order.service";

function CustomTable() {
  const [isSettingOpen, setIsSettingOpen] = useState(false);
  const [isAddTable, setIsAddTable] = useState(false);
  const [isEditTable, setIsEditTable] = useState(false);
  const [isFoodList, setIsFoodList] = useState(false);
  const [isTotalBill, setIsTotalBill] = useState(false);
  const [selectedTableId, setSelectedTableId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 24;
  const [customTable, setCustomTable] = useState([]);
  const [tableDetail, setTableDetail] = useState([]);
  const [orderAll, setOrderAll] = useState([]);
  const [refresh, setRefresh] = useState(false);


  useEffect(() => {
    const fetchData = async() => {
      const res = await getTableall();
      console.log(res)
      setCustomTable(res.tables);
    }
    
    fetchData()
  }, [refresh])
  
  useEffect(() => {
    const fetchData = async() => {
      const res = await getOrderCurrent()
      console.log(res)
      setOrderAll(res.orders);
    }

    fetchData()
  }, [refresh])

  useEffect(() => {
    if (!isSettingOpen) {
      setIsAddTable(false);
      setIsEditTable(false);
      setIsFoodList(false);
      setIsTotalBill(false);
    }
  }, [isSettingOpen]);

  const handleReservationClick = () => {
    setIsAddTable(true);
    setIsEditTable(false);
    setIsFoodList(false);
    setIsTotalBill(false);
  };

  const handleEditClick = () => {
    setIsEditTable(true);
    setIsAddTable(false);
    setIsFoodList(false);
    setIsTotalBill(false);
  };

  const handleFoodListClick = () => {
    console.log("เข้าเงื่อนไข")
    setIsFoodList(true);
    setIsAddTable(false);
    setIsEditTable(false);
    setIsTotalBill(false);
  };

  const handleTotalBillClick = () => {
    setIsTotalBill(true);
    setIsFoodList(false);
    setIsAddTable(false);
    setIsEditTable(false);
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  // console.log(isAddTable)
  // console.log(selectedTableId)
  return (
    <div>
      <Header
        isSettingOpen={isSettingOpen}
        setIsSettingOpen={setIsSettingOpen}
        handleReservationClick={handleReservationClick}
        isAddTable={isAddTable}
        setIsAddTable={setIsAddTable}
      />
      <div className="flex 2xl:flex-row flex-col-reverse gap-6 w-full mt-6">
        <Table
          isSettingOpen={isSettingOpen}
          currentPage={currentPage}
          rowsPerPage={rowsPerPage}
          handleTotalBillClick={handleTotalBillClick}
          isTotalBill={isTotalBill}
          selectedTableId={selectedTableId}
          setSelectedTableId={setSelectedTableId}
          setIsTotalBill={setIsTotalBill}
          setIsFoodList={setIsFoodList}
          setIsAddTable={setIsAddTable}
          setIsEditTable={setIsEditTable}
          isEditTable={isEditTable}
          customTable={customTable}
          setTableDetail={setTableDetail}
          setRefresh={setRefresh}
          handleFoodListClick={handleFoodListClick}
        />
        {isAddTable ? (
          <AddTable />
        ) : isEditTable ? (
          <EditTable 
            setIsSettingOpen={setIsSettingOpen} 
            tableDetail={tableDetail}
            setRefresh={setRefresh}
          />
        ) : isFoodList ? (
          <FoodList 
            selectedTableId={selectedTableId} 
            tableDetail={tableDetail}
            orderAll={orderAll}
          />
        ) : isTotalBill ? (
          <TotalBill 
            // customTable={customTable}
            orderAll={orderAll}
          />
        ) : (
          <ViewTable
            handleEditClick={handleEditClick}
            selectedTableId={selectedTableId}
            setSelectedTableId={setSelectedTableId}
            customTable={customTable}
            setTableEdit={setTableDetail}
          />
        )}
      </div>

      {/* Pagination */}
      <div className=" flex justify-end mt-8">
        <Stack spacing={2}>
          <Pagination
            count={Math.ceil(customTable.length / rowsPerPage)}
            page={currentPage}
            onChange={handlePageChange}
            variant="outlined"
            shape="rounded"
            sx={{
              "& .MuiPaginationItem-root": {
                backgroundColor: "white !important",
                color: "#013D59 !important",
                border: "1px solid #013D59 !important",
                transition: "background-color 0.3s ease-in-out !important",
              },
              "& .MuiPaginationItem-root.Mui-selected": {
                backgroundColor: "#013D59 !important",
                color: "white !important",
              },
              "& .MuiPaginationItem-root:hover": {
                backgroundColor: "#013D59 !important",
                color: "white !important",
              },
            }}
          />
        </Stack>
      </div>

      {/* <button onClick={handleFoodListClick}>
        <BorderColorIcon
          sx={{ fontSize: 25 }}
          className="text-[#313131] hover:text-[#F5A100] cursor-pointer"
        />
      </button> */}
    </div>
  );
}

export default CustomTable;
