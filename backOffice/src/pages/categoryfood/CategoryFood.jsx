import React, { useState, useEffect } from "react";
import {
  getCategoryFoods,
  getDeleteCategoryFood,
} from "../../services/manageData.services";
import AddCategoryFood from "./components/AddCategoryFood";
import EditCategoryFood from "./components/EditCategoryFood";
import { Switch } from "@mui/material";

function CategoryFood() {
  const [categFood, setCateFood] = useState([]);
  const [handleCreate, setHandleCreate] = useState(false);
  const [handleEdit, setHandleEdit] = useState(false);
  const api_path = "http://localhost:8003";
  const [slcEdit, setSlcEdit] = useState([]);

  useEffect(() => {
    getCategoryFoods().then((res) => {
      console.log(res);
      setCateFood(res.cateFood);
    });
  }, []);

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
    getDeleteCategoryFood(id).then((res) => {
      console.log(res);
    });
  };

  return (
    <div>
      <div className="flex">
        <h1>หมวดหมู่เมนู</h1>
        <button
          className="bg-[#013D59] text-white p-1"
          onClick={functionHandleCreate}
        >
          + เพิ่มหมวดหมู่
        </button>
      </div>

      <div className="w-full flex gap-5">
        <div className="w-full relative overflow-x-auto">
          <table className="w-[600px] text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">
                  ลำดับ
                </th>
                <th scope="col" className="px-6 py-3">
                  รูปภาพ
                </th>
                <th scope="col" className="px-6 py-3">
                  สถานะ
                </th>
              </tr>
            </thead>
            <tbody>
              {categFood.map((cate) => (
                <tr
                  key={cate.id}
                  className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200"
                >
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    {cate.id}
                  </th>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <img
                        className="w-[70px] h-[70px]"
                        src={api_path + cate.thumbnail}
                        alt=""
                      />
                      <p>{cate.title}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Switch checked={cate.status_display} />
                    <button
                      className="border w-10 mr-2"
                      onClick={() => functionHandleEdit(cate)}
                    >
                      แก้ไข
                    </button>
                    <button
                      className="border w-10 "
                      onClick={() => functionHandleDelete(cate.id)}
                    >
                      ลบ
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* call component Add and Edit  */}
        {handleCreate && <AddCategoryFood />}
        {handleEdit && <EditCategoryFood slcEdit={slcEdit} />}
      </div>
    </div>
  );
}

export default CategoryFood;
