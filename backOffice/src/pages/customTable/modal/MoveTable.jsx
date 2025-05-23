import React, { useState, useEffect } from "react";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import { Select, MenuItem } from "@mui/material";
import { getTableOnly, getChangeTable } from "../../../services/table_manage.service";
import Swal from "sweetalert2";

function MoveTable({ isMoveTable, closeModal, tableData }) {
  const [tables, setTables] = useState("");
  const [currentTable, setCurrentTable] = useState([]);
  // console.log("table :",  tableData)
  useEffect(() => {
    const fetchData = async() => {
      const res = await getTableOnly()
      setTables(res.tables);
    }
    
    fetchData()
  }, []);
  
  // console.log("tables : ", tables)
  useEffect(() => {
    setCurrentTable(tableData.table.id);
  }, [tableData]);

  const onSubmit = () => {
    const params = {
      old_table: tableData.table.id,
      new_table: currentTable,
      order_id: tableData.id
    }
    getChangeTable(params).then((res) => {
      // console.log(res);
      if(res.status) {
        location.reload()
      }
    })
  }

  return (
    isMoveTable && (
      <div
        onClick={closeModal}
        className="fixed inset-0 bg-black/60 bg-opacity-50 flex items-center justify-center z-20"
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className=" relative bg-white py-8 px-[4rem] rounded-lg shadow-lg w-[380px]"
        >
          <button
            onClick={closeModal}
            className=" absolute -top-8 -right-8 cursor-pointer"
          >
            <CancelOutlinedIcon
              sx={{ fontSize: 35 }}
              className="text-white hover:text-red-500"
            />
          </button>
          <p className="text-[25px] text-center font-[600] text-[#8F8F8F]">
            เลือกโต๊ะที่ต้องการย้าย
          </p>

          <div className="flex justify-center mt-4">
            <Select
              value={currentTable}
              onChange={(e) => setCurrentTable(e.target.value)}
              className="w-[200px] h-[37px] text-[14px]"
            >
              {tables.map((table) => (
                <MenuItem key={table.id} value={table.id} disabled={table.status === 2}>
                  {table.title}
                </MenuItem>
              ))}
            </Select>
          </div>

          <div className="flex justify-center space-x-5 mt-8">
            <button 
            onClick={onSubmit}
            className="w-[110px] py-1.5 bg-[#013D59] hover:bg-[#002b3f] hover:scale-105 transition duration-300 text-white rounded-lg cursor-pointer shadow-1">
              บันทึก
            </button>
          </div>
        </div>
      </div>
    )
  );
}

export default MoveTable;
