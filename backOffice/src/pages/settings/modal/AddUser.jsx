import React, { useState } from "react";
import PersonAddAltOutlinedIcon from '@mui/icons-material/PersonAddAltOutlined';
import { getCreateNewUser } from "../../../services/setting.service";
import Swal from "sweetalert2";

function AddUser({ isOpen, closeModal, permissionAll }) {
  const [userName, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [emailUser, setEmailUser] = useState(""); 
  const [displayName, setDisplayName] = useState("");
  const [permission, setPermission] = useState("1");
  const [statusUser, setStatusUser] = useState("pending");

  const onSubmit = () => {
    const params = {
      username: userName,
      password: password,
      email: emailUser,
      displayName: displayName,
      permission: permission,
      status: statusUser
    }

    getCreateNewUser(params).then((res) => {
      if(res.status) {
        Swal.fire({
          position: "center",
          icon: "success",
          title: "บันทึกข้อมูลเสร็จ",
          showConfirmButton: false,
          timer: 1500,
        }).then(() => {
          setUsername("");
          setPassword("");
          setEmailUser("")
          setDisplayName("")
          setPermission("1")
          setStatusUser("pending")
          closeModal()
        })
      }
    })
  }

  return (
    isOpen && (
      <div className="fixed inset-0 bg-black/60 bg-opacity-50 flex items-center justify-center z-20">
        <div className=" relative bg-white p-8 rounded-lg shadow-lg w-[480px]">
          <div className="flex w-full items-center gap-2">
            <PersonAddAltOutlinedIcon
              sx={{ fontSize: 25 }}
              className="text-[#00537B]"
            />
            <p className="text-[25px] font-[600] text-[#00537B]">
              เพิ่มข้อมูลผู้ใช้
            </p>
          </div>

          <div className="w-full space-y-3 mt-6">
            <div className="flex items-center">
              <p className="min-w-[90px] text-[#313131] font-[400]">
                ชื่อผู้ใช้
              </p>
              <input
                type="text"
                className="border border-gray-300 text-gray-600 text-[14px] font-[300] rounded-sm h-[37px] px-2 focus:outline-none focus:ring-2 focus:ring-[#6db8dd] w-full"
                placeholder="กรอกชื่อผู้ใช้..."
                onChange={(e) => setUsername(e.target.value)}
                value={userName}
              />
            </div>
            <div className="flex items-center">
              <p className="min-w-[90px] text-[#313131] font-[400]">รหัสผ่าน</p>
              <input
                type="password"
                className="border border-gray-300 text-gray-600 text-[14px] font-[300] rounded-sm h-[37px] px-2 focus:outline-none focus:ring-2 focus:ring-[#6db8dd] w-full"
                placeholder="กรอกรหัสผ่าน..."
                onChange={(e) => setPassword(e.target.value)}
                value={password}
              />
            </div>
            <div className="flex items-center">
              <p className="min-w-[90px] text-[#313131] font-[400]">อีเมล</p>
              <input
                type="email"
                className="border border-gray-300 text-gray-600 text-[14px] font-[300] rounded-sm h-[37px] px-2 focus:outline-none focus:ring-2 focus:ring-[#6db8dd] w-full"
                placeholder="กรอกอีเมล..."
                onChange={(e) => setEmailUser(e.target.value)}
                value={emailUser}
              />
            </div>
            <div className="flex items-center">
              <p className="min-w-[90px] text-[#313131] font-[400]">
                ชื่อที่แสดง
              </p>
              <input
                type="text"
                className="border border-gray-300 text-gray-600 text-[14px] font-[300] rounded-sm h-[37px] px-2 focus:outline-none focus:ring-2 focus:ring-[#6db8dd] w-full"
                placeholder="กรอกชื่อที่แสดง..."
                onChange={(e) => setDisplayName(e.target.value)}
                value={displayName}
              />
            </div>
            <div className="flex items-center">
              <p className="min-w-[90px] text-[#313131] font-[400]">
                หน้าที่
              </p>
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
            <div className="flex items-center">
              <p className="min-w-[90px] text-[#313131] font-[400]">
                สถานะ
              </p>
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

export default AddUser;
