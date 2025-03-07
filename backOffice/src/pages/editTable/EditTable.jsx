import React, { useState } from "react";
import Header from "./sections/Header";
import AddTable from "./sections/AddTable";
import Table from "./sections/Table";

function EditTable() {
  return (
    <div>
      <Header />
      <div className="flex gap-6 w-full mt-6">
      <Table />
      <AddTable />
      </div>
    </div>
  );
}

export default EditTable;
