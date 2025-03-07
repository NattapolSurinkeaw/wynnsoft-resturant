import React, { useState } from "react";
import Header from "./sections/Header";
import AddTable from "./sections/AddTable";
import Table from "./sections/Table";

function EditTable() {
  const [isSettingOpen, setIsSettingOpen] = useState(false);

  return (
    <div>
      <Header
        isSettingOpen={isSettingOpen}
        setIsSettingOpen={setIsSettingOpen}
      />
      <div className="flex 2xl:flex-row flex-col gap-6 w-full mt-6">
        <Table isSettingOpen={isSettingOpen} />
        <AddTable />
      </div>
    </div>
  );
}

export default EditTable;
