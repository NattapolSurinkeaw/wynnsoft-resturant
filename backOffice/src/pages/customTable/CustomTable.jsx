import React, { useState, useEffect } from "react";
import Header from "./sections/Header";
import AddTable from "./sections/tab/AddTable";
import EditTable from "./sections/tab/EditTable";
import ViewTable from "./sections/tab/ViewTable";
import FoodList from "./sections/tab/FoodList";
import Table from "./sections/Table";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import { CustomTable as CustomTableData } from "../../components/mockData/CustomTable/CustomTable";
import BorderColorIcon from "@mui/icons-material/BorderColor";

function CustomTable() {
  const [isSettingOpen, setIsSettingOpen] = useState(false);
  const [isAddTable, setIsAddTable] = useState(false);
  const [isEditTable, setIsEditTable] = useState(false);
  const [isFoodList, setIsFoodList] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 20;

  useEffect(() => {
    if (!isSettingOpen) {
      setIsAddTable(false);
      setIsEditTable(false);
      setIsFoodList(false);
    }
  }, [isSettingOpen]);

  const handleReservationClick = () => {
    setIsAddTable(true);
    setIsEditTable(false);
    setIsFoodList(false);
  };

  const handleEditClick = () => {
    setIsEditTable(true);
    setIsAddTable(false);
    setIsFoodList(false);
  };

  const handleFoodListClick = () => {
    setIsFoodList(true);
    setIsAddTable(false);
    setIsEditTable(false);
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  return (
    <div>
      <Header
        isSettingOpen={isSettingOpen}
        setIsSettingOpen={setIsSettingOpen}
        handleReservationClick={handleReservationClick}
        isAddTable={isAddTable}
        setIsAddTable={setIsAddTable}
      />
      <div className="flex 2xl:flex-row flex-col gap-6 w-full mt-6">
        <Table
          isSettingOpen={isSettingOpen}
          currentPage={currentPage}
          rowsPerPage={rowsPerPage}
        />
        {isAddTable ? (
          <AddTable />
        ) : isEditTable ? (
          <EditTable setIsSettingOpen={setIsSettingOpen} />
        ) : isFoodList ? (
          <FoodList handleFoodListClick={handleFoodListClick} />
        ) : (
          <ViewTable handleEditClick={handleEditClick} />
        )}
      </div>

      {/* Pagination */}
      <div className=" flex justify-end mt-8">
        <Stack spacing={2}>
          <Pagination
            count={Math.ceil(CustomTableData.length / rowsPerPage)}
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

      <button onClick={handleFoodListClick}>
            <BorderColorIcon
              sx={{ fontSize: 25 }}
              className="text-[#313131] hover:text-[#F5A100] cursor-pointer"
            />
          </button>

    </div>
  );
}

export default CustomTable;
