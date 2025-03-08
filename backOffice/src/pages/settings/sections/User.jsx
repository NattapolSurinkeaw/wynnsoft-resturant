import React, { useState } from "react";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import EditUser from "../modal/EditUser";

function User({userAll}) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const handleEdit = (user) => {
    setSelectedUser(user);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setSelectedUser(null);
  };

  return (
    <>
      <EditUser
        isOpen={isOpen}
        selectedUser={selectedUser}
        closeModal={closeModal}
      />
      <div className="3xl:w-[1207px] w-full">
        <div className="grid 2xl:grid-cols-6 lg:grid-cols-3 md:grid-cols-4 sm:grid-cols-3 grid-cols-3 gap-4 ">
          {userAll.map((user) => (
            <div
              key={user.id}
              className="relative flex flex-col items-center w-full h-[230px] bg-white shadow-1 rounded-lg overflow-hidden group "
            >
              <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg">
                <div className="absolute -top-[3.7rem] -right-[3.7rem] w-[100px] h-[100px] shadow-2xl rotate-45 bg-white"></div>
                <button
                  onClick={() => handleEdit(user)}
                  className="button-mini-edit shadow-2"
                >
                  แก้ไข
                </button>

                <button className="button-mini-delete shadow-2 mb-8">ลบ</button>
              </div>

              <div
                className={`absolute top-2 right-2 w-3 h-3 rounded-full ${
                  user.status ? "bg-[#10D024]" : "bg-[#FFBA41]"
                }`}
              ></div>
              <AccountCircleIcon
                sx={{ fontSize: 130 }}
                className="text-gray-400/70 mt-2"
              />
              <div className="flex items-center gap-1">
                {user.permissionName === "Chef" ? (
                  <SupervisorAccountIcon
                    sx={{ fontSize: 25 }}
                    className="text-[#313131]"
                  />
                ) : (
                  <AdminPanelSettingsIcon
                    sx={{ fontSize: 25 }}
                    className="text-[#313131]"
                  />
                )}
                <p className="text-[#313131] text-[16px] font-[700]">
                  {user.displayName}
                </p>
              </div>
              <p className="text-[#313131] text-[14px] font-[400] mt-2">
                {user.email}
              </p>
              <p className="text-[#313131]/80 text-[13px] font-[400] mt-1">
                ({user.permissionName})
              </p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default User;
