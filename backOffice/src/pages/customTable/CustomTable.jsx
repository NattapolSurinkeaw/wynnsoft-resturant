import React, { useState, useEffect } from "react";
import Header from "./sections/Header";
import AddTable from "./sections/tab/AddTable";
import EditTable from "./sections/tab/EditTable";
import ViewTable from "./sections/tab/ViewTable";
import Table from "./sections/Table";

function CustomTable() {
  const [isSettingOpen, setIsSettingOpen] = useState(false);
  const [isAddTable, setIsAddTable] = useState(false);
  const [isEditTable, setIsEditTable] = useState(false);

  console.log("isAddTable", isAddTable);
  console.log("isEditTable", isEditTable);
  

  useEffect(() => {
    if (!isSettingOpen) {
      setIsAddTable(false);
      setIsEditTable(false);
    }
  }, [isSettingOpen]);

  const handleReservationClick = () => {
    setIsAddTable(true);
    setIsEditTable(false);
  };

  const handleEditClick = () => {
    setIsEditTable(true);
    setIsAddTable(false);
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
        <Table isSettingOpen={isSettingOpen} />
        {isAddTable ? (
          <AddTable />
        ) : isEditTable ? (
          <EditTable setIsSettingOpen={setIsSettingOpen} />
        ) : (
          <ViewTable handleEditClick={handleEditClick} />
        )}
      </div>
    </div>
  );
}

export default CustomTable;
