import React, { useState, useEffect } from "react";
import BorderColorOutlinedIcon from "@mui/icons-material/BorderColorOutlined";
import { getUpdateDataUser } from "../../../services/setting.service";
import Swal from "sweetalert2";

function EditUser({ isOpen, closeModal, selectedUser, permissionAll, setRefreshUser }) {
  const [adminCode, setAdminCode] = useState("");
  const [nameUser, setNameUser] = useState("");
  const [emailUser, setEmailUser] = useState("");
  const [permission, setPermission] = useState("");
  const [statusUser, setStatusUser] = useState("");

  useEffect(() => {
    setAdminCode(selectedUser.adminCode);
    setNameUser(selectedUser.displayName);
    setEmailUser(selectedUser.email);
    setPermission(selectedUser.permission);
    setStatusUser(selectedUser.status);
  }, [selectedUser])

  const onSubmit = () => {
    const params = {
      adminCode: adminCode,
      displayName: nameUser,
      email: emailUser,
      permission: permission,
      status: statusUser
    }

    getUpdateDataUser(params).then((res) => {
      if(res.status) {
        Swal.fire({
          position: "center",
          icon: "success",
          title: "บันทึกข้อมูลเสร็จ",
          showConfirmButton: false,
          timer: 1500,
        }).then(() => {
          closeModal()
          setRefreshUser(prev => !prev)
        })
      }
    })
  }
  return (
    isOpen && (
      <div className="fixed inset-0 bg-black/60 bg-opacity-50 flex items-center justify-center z-20">
        <div className=" relative bg-white p-8 rounded-lg shadow-lg w-[480px]">
          {/* <ArrowBackIosNewOutlinedIcon
            sx={{ fontSize: 40 }}
            className=" absolute top-0 right-0 rotate-135 text-[#00537B]"
          />
          <ArrowBackIosNewOutlinedIcon
            sx={{ fontSize: 40 }}
            className=" absolute bottom-0 left-0 -rotate-45 text-[#00537B]"
          /> */}
          <div className="flex w-full items-center gap-2">
            <BorderColorOutlinedIcon
              sx={{ fontSize: 25 }}
              className="text-[#00537B]"
            />
            <p className="text-[25px] font-[600] text-[#00537B]">
              แก้ไขข้อมูลผู้ใช้
            </p>
          </div>

          <div className="w-full space-y-3 mt-6">
            <div className="flex items-center ">
              <p className="min-w-[90px] text-[#313131] font-[400]">ชื่อ</p>
              <input
                type="text"
                className="border border-gray-300 text-gray-600 text-[14px] font-[300] rounded-sm h-[37px] px-2 focus:outline-none focus:ring-2 focus:ring-[#6db8dd] w-full"
                placeholder="กรอกชื่อ..."
                value={nameUser}
                onChange={(e) => setNameUser(e.target.value)}
              />
            </div>
            <div className="flex items-center ">
              <p className="min-w-[90px] text-[#313131] font-[400]">อีเมล</p>
              <input
                type="text"
                className="border border-gray-300 text-gray-600 text-[14px] font-[300] rounded-sm h-[37px] px-2 focus:outline-none focus:ring-2 focus:ring-[#6db8dd] w-full"
                placeholder="กรอกอีเมล..."
                value={emailUser}
                onChange={(e) => setEmailUser(e.target.value)}
              />
            </div>
            <div className="flex items-center">
              <p className="min-w-[90px] text-[#313131] font-[400]">หน้าที่</p>
              <select className="border rounded border-gray-300 text-[14px] text-gray-600 font-[300] pl-1 focus:outline-none focus:ring-2 focus:ring-[#6db8dd] cursor-pointer w-full h-[37px]"
                value={permission}
                onChange={(e) => setPermission(e.target.value)}
              >
                {
                  permissionAll.map((permiss) => (
                    <option key={permiss.id} value={permiss.id}>{permiss.user_type_th} ({permiss.user_type})</option>
                  ))
                }
              </select>
            </div>

            <div className="flex items-center ">
              <p className="min-w-[90px] text-[#313131] font-[400]">สถานะ</p>
              <select className="border text-[14px] rounded border-gray-300 text-gray-600 font-[300] pl-1 focus:outline-none focus:ring-2 focus:ring-[#6db8dd] cursor-pointer w-full h-[37px]"
                value={statusUser}
                onChange={(e) => setStatusUser(e.target.value)}
              >
                <option value="active">เปิดใช้งาน</option>
                <option value="pending">รออนุมัติ</option>
                <option value="inactive">ปิดใช้งาน</option>
                <option value="banned">ปิดกั้น</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-8">
            <button onClick={closeModal} className="button-cancel-1">
              ยกเลิก
            </button>
            <button className="button-save-1" onClick={onSubmit}>บันทึก</button>
          </div>
        </div>
      </div>
    )
  );
}

export default EditUser;
