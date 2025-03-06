import React, { useState, useEffect } from "react";
import {
  getCategoryFoods,
  getDeleteCategoryFood,
  getUpdateDisplayCatefood,
} from "../../services/manageData.services";
import AddCategoryFood from "./components/AddCategoryFood";
import EditCategoryFood from "./components/EditCategoryFood";
import { Switch } from "@mui/material";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

function CategoryFood() {
  const [categFood, setCateFood] = useState([]);
  const [handleCreate, setHandleCreate] = useState(false);
  const [handleEdit, setHandleEdit] = useState(false);
  const api_path = "http://localhost:8003";
  const [slcEdit, setSlcEdit] = useState([]);
  const [refreshData, setRefreshData] = useState(0);
  const MySwal = withReactContent(Swal);

  useEffect(() => {
    getCategoryFoods().then((res) => {
      setCateFood(res.cateFood);
    });
  }, [refreshData]);

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
            console.log(res);
            MySwal.fire({
              title: "ลบสำเร็จ!",
              text: "หมวดหมู่อาหารถูกลบแล้ว",
              icon: "success",
              showConfirmButton: false,
              timer: 1500,
            });
            setRefreshData((prev) => prev + 1);
          })
          .catch((err) => {
            // console.error("ลบไม่สำเร็จ:", err);

            MySwal.fire({
              title: "เกิดข้อผิดพลาด!",
              text: "ไม่สามารถลบหมวดหมู่อาหารนี้ได้ กรุณาลองใหม่อีกครั้ง",
              icon: "error",
              showConfirmButton: false,
              timer: 1500,
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
                    <Switch
                      checked={cate.status_display === 1}
                      onChange={(e) =>
                        handleUpdateDisplay(cate.id, e.target.checked)
                      }
                    />
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
        {handleCreate && (
          <AddCategoryFood
            setRefreshData={setRefreshData}
            setHandleCreate={setHandleCreate}
          />
        )}
        {handleEdit && (
          <EditCategoryFood
            slcEdit={slcEdit}
            setRefreshData={setRefreshData}
            setHandleEdit={setHandleEdit}
          />
        )}
      </div>
    </div>
  );
}

export default CategoryFood;
