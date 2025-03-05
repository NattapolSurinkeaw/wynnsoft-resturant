import React, { useState } from "react";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import EditUser from "../modal/EditUser";

function User() {
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

  const users = [
    {
      id: 1,
      name: "Tagi",
      email: "tagi@gmail.com",
      role: "Admin",
      status: true,
    },
    {
      id: 2,
      name: "Alice",
      email: "alice@gmail.com",
      role: "Superadmin",
      status: true,
    },
    { id: 3, name: "Bob", email: "bob@gmail.com", role: "Staff", status: true },
    {
      id: 4,
      name: "Charlie",
      email: "charlie@gmail.com",
      role: "Chef",
      status: true,
    },
    {
      id: 5,
      name: "David",
      email: "david@gmail.com",
      role: "Staff",
      status: true,
    },
    {
      id: 6,
      name: "Emma",
      email: "emma@gmail.com",
      role: "Admin",
      status: true,
    },
    {
      id: 7,
      name: "Frank",
      email: "frank@gmail.com",
      role: "Staff",
      status: false,
    },
    {
      id: 8,
      name: "Grace",
      email: "grace@gmail.com",
      role: "Admin",
      status: false,
    },
    {
      id: 9,
      name: "Henry",
      email: "henry@gmail.com",
      role: "Chef",
      status: false,
    },
    {
      id: 10,
      name: "Ivy",
      email: "ivy@gmail.com",
      role: "Staff",
      status: false,
    },
  ];

  return (
    <>
      <EditUser
        isOpen={isOpen}
        selectedUser={selectedUser}
        closeModal={closeModal}
      />
      <div className="2xl:w-[1207px] w-full">
        <div className="grid grid-cols-6 gap-4 ">
          {users.map((user) => (
            <div
              key={user.id}
              className="relative flex flex-col items-center w-full h-[230px] bg-white shadow-1 rounded-lg overflow-hidden group"
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
                {user.role === "Chef" ? (
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
                  {user.name}
                </p>
              </div>
              <p className="text-[#313131] text-[14px] font-[400] mt-2">
                {user.email}
              </p>
              <p className="text-[#313131]/80 text-[13px] font-[400] mt-1">
                ({user.role})
              </p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default User;
