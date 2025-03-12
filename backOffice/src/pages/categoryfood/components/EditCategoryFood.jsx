import React, { useState, useEffect, useRef } from "react";
// import Switch from "@mui/material/Switch";
import Switch, { switchClasses } from "@mui/joy/Switch";
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
    <div className=" w-full bg-white p-4 flex flex-col gap-6 rounded-[10px]">
      {/* ✅ อัปโหลดรูปภาพ */}

      <div className="relative mx-auto w-[300px] h-[300px] bg-[#616161] rounded-lg shadow-1 flex items-center justify-center shadow-md overflow-hidden">
        {imageObj ? (
          <img
            src={imageObj || ""}
            alt="Preview"
            className="w-full h-full object-cover rounded-lg "
          />
        ) : (
          <div className="text-white text-lg text-center">
            เลือกรูปภาพ <br />
            <span className="text-[12px] text-center">(ขนาด 200*200 px)</span>
          </div>
        )}

        <label
          htmlFor="fileInput1"
          className="absolute bottom-0 bg-[#00537B]/70 transition duration-100 flex justify-center items-center gap-2 w-full h-[40px] shadow-1 cursor-pointer"
        >
          <figure className="w-[25px] h-[25px] ">
            <img src="/icons/edit.png" alt="" className="w-full h-full" />
          </figure>

          <span className="text-white">อัปรูปปก</span>
        </label>
        <input
          type="file"
          accept="image/*"
          className="hidden"
          id="fileInput1"
          ref={inputProfileImage}
          onChange={handleImageChange}
        />
      </div>

      <div className="flex flex-col gap-6 justify-between">
        <div className="flex flex-col gap-4">
          {/* ✅ ชื่อหมวดหมู่ */}
          <div className="flex flex-row items-center  gap-3">
            <span className="w-[140px] flex-shrink-0 text-right text-[#00537B] text-2xl">
              ชื่อหมวดหมู่
            </span>
            <input
              type="text"
              className="w-full border border-[#D9D9D9] rounded-lg outline-none py-1 px-4"
              value={inpTitle}
              onChange={(e) => setInpTitle(e.target.value)}
            />
          </div>
        </div>

        {/* ✅ ลำดับแสดง */}
        <div className="flex gap-6">
          <div className="flex flex-row items-center  gap-3">
            <span className="w-[140px] flex-shrink-0 text-right text-[#00537B] text-2xl">
              ลำดับแสดง
            </span>
            <input
              type="number"
              className="w-full border border-[#D9D9D9] rounded-lg outline-none py-1 px-4"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            />
          </div>
          {/* ✅ สถานะ */}
          <div className="flex flex-row items-center gap-3">
            <span className="flex-shrink-0 text-right text-[#00537B] text-2xl">
              สถานะ
            </span>
            <Switch
              checked={checkedStatus === true} // ถ้า checked เป็น 1 ให้เปิดสวิตช์
              onChange={(event) =>
                setCheckedStatus(event.target.checked ? true : false)
              } // อัปเดตค่า 1 หรือ 0
              sx={(theme) => ({
                "--Switch-thumbShadow": "0 3px 7px 0 rgba(0 0 0 / 0.12)",
                "--Switch-thumbSize": "27px",
                "--Switch-trackWidth": "51px",
                "--Switch-trackHeight": "31px",
                "--Switch-trackBackground":
                  theme.vars.palette.background.level3,
                [`& .${switchClasses.thumb}`]: {
                  transition: "width 0.2s, left 0.2s",
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
            />
          </div>
        </div>

        {/* ✅ ปุ่ม ยกเลิก & บันทึก */}
        <div className="flex justify-center gap-4 mt-6">
          <button
            className="bg-[#F44D4D] hover:bg-[#00537B] transition-all ease-in-out duration-200  cursor-pointer text-white rounded-lg w-[180px] text-center py-1.5 font-bold text-xl"
            onClick={() => {
              setHandleEdit(false);
            }}
          >
            ยกเลิก
          </button>
          <button
            className="bg-[#FFBA41] hover:bg-[#00537B] transition-all ease-in-out duration-200 cursor-pointer text-white rounded-lg w-[180px] text-center py-1.5 font-bold text-xl"
            onClick={handleSave}
          >
            บันทึก
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditCategoryFood;
