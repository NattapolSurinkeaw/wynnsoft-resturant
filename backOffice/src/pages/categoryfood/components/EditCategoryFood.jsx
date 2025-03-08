import React, { useState, useEffect, useRef } from "react";
import Switch from "@mui/material/Switch";
import { getUpdateCategoryFood } from "../../../services/manageData.services";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import SwalUI from "../../../components/swal-ui/swal-ui";

function EditCategoryFood({ slcEdit, setRefreshData, setHandleEdit }) {
  // ✅ ใช้ useState และตั้งค่าเริ่มต้นจาก slcEdit
  const [inpTitle, setInpTitle] = useState("");
  const [priority, setPriority] = useState(1);
  const [checkedStatus, setCheckedStatus] = useState(false);
  const inputProfileImage = useRef(null);
  const [imageObj, setImageObj] = useState(null);

  // ✅ ใช้ useEffect เพื่ออัปเดตค่าเมื่อ slcEdit เปลี่ยน
  useEffect(() => {
    if (slcEdit) {
      setInpTitle(slcEdit.title || ""); // ถ้าไม่มี title ให้ใช้ค่าว่าง
      setPriority(slcEdit.priority || 1); // ถ้าไม่มี priority ให้ใช้ค่า 1
      setCheckedStatus(slcEdit.status_display); // แปลงเป็น boolean
      setImageObj("http://localhost:8003" + slcEdit.thumbnail);
    }
  }, [slcEdit]);

  // ✅ ฟังก์ชันอัปโหลดรูปภาพ
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (
      file &&
      ["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(
        e.target.files[0].type
      )
    ) {
      setImageObj(URL.createObjectURL(file)); // แสดงรูปที่อัปโหลด
    } else {
      Swal.fire({
        title: "กรุณาอัปโหลดเฉพาะไฟล์รูปภาพ",
        icon: "warning",
        position: "center",
        timer: 1500,
        showConfirmButton: false,
      });
      e.target.value = "";
    }
  };

  // ✅ ฟังก์ชันบันทึกข้อมูล
  const handleSave = () => {
    const formData = new FormData();
    formData.append("title", inpTitle);
    formData.append("priority", priority);
    formData.append("status", checkedStatus ? 1 : 0);
    formData.append("image", inputProfileImage.current.files[0]);

    getUpdateCategoryFood(slcEdit.id, formData)
      .then((res) => {
        SwalUI({
          status: res.status,
          description: res.description,
          title: res.title,
        });
        setHandleEdit(false);
        setRefreshData((prev) => prev + 1); // รีเฟรชข้อมูล
      })
      .catch((err) => {
        SwalUI({
          status: err.status,
          description: err.description,
          title: err.title,
        });
      });
  };

  return (
    <div className="w-1/2 bg-white p-4">
      <p>แก้ไขหมวดหมู่อาหาร</p>

      {/* ✅ อัปโหลดรูปภาพ */}
      <div className="flex justify-center">
        <label htmlFor="inputImage">
          <img className="w-20 h-20" src={imageObj || ""} alt="Preview" />
        </label>
        <input
          className="hidden"
          type="file"
          id="inputImage"
          name="inputImage"
          ref={inputProfileImage}
          onChange={handleImageChange}
        />
      </div>

      {/* ✅ ชื่อหมวดหมู่ */}
      <div>
        <label htmlFor="">ชื่อหมวดหมู่</label>
        <input
          type="text"
          className="border"
          value={inpTitle}
          onChange={(e) => setInpTitle(e.target.value)}
        />
      </div>

      {/* ✅ ลำดับแสดง */}
      <div>
        <label htmlFor="">ลำดับแสดง</label>
        <input
          type="number"
          className="border"
          value={priority}
          onChange={(e) => setPriority(Number(e.target.value))}
        />
      </div>

      {/* ✅ สถานะ */}
      <div>
        <label htmlFor="">สถานะ</label>
        <Switch
          checked={checkedStatus}
          onChange={(e) => setCheckedStatus(e.target.checked)}
        />
      </div>

      {/* ✅ ปุ่ม ยกเลิก & บันทึก */}
      <div className="flex justify-center gap-4">
        <button
          className="bg-[#F44D4D] p-1 text-white"
          onClick={() => {
            setHandleEdit(false);
          }}
        >
          ยกเลิก
        </button>
        <button className="bg-[#013D59] p-1 text-white" onClick={handleSave}>
          บันทึก
        </button>
      </div>
    </div>
  );
}

export default EditCategoryFood;
