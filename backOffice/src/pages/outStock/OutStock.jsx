import React, { useState, useEffect, useRef } from "react";
import EventAvailableOutlinedIcon from "@mui/icons-material/EventAvailableOutlined";
import TableMenuStatus from "./sections/TableMenuStatus";
import MenuStatusModal from "./modal/MenuStatusModal";
import NoFoodOutlinedIcon from "@mui/icons-material/NoFoodOutlined";

function OutStock() {
  const [selectedStatusMenu1, setSelectedStatusMenu1] = useState(null);
  const [selectedStatusMenu2, setSelectedStatusMenu2] = useState(null);
  const [showStatusMenu1, setShowStatusMenu1] = useState(false);
  const [showStatusMenu2, setShowStatusMenu2] = useState(false);
  const [isOpenEditModal, setIsOpenEditModal] = useState(false);
  const [selectedEditId, setSelectedEditId] = useState(null);
  const statusMenuRef1 = useRef(null);
  const statusMenuRef2 = useRef(null);
  const [refreshData, setRefreshData] = useState(0);

  console.log("refreshData", refreshData);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        statusMenuRef1.current &&
        !statusMenuRef1.current.contains(event.target) &&
        statusMenuRef2.current &&
        !statusMenuRef2.current.contains(event.target)
      ) {
        setShowStatusMenu1(false);
        setShowStatusMenu2(false);
      }
    };

    if (showStatusMenu1 || showStatusMenu2) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showStatusMenu1, showStatusMenu2]);

  useEffect(() => {
    if (selectedStatusMenu1 === null) {
      setShowStatusMenu1(false);
    }
    if (selectedStatusMenu2 === null) {
      setShowStatusMenu2(false);
    }
  }, [selectedStatusMenu1, selectedStatusMenu2]);

  const handleEditClick = (order) => {
    setSelectedEditId(order);
    setIsOpenEditModal(true);
  };

  const closeModal = () => {
    setIsOpenEditModal(false);
  };

  return (
    <>
      {isOpenEditModal && (
        <MenuStatusModal
          isOpenEditModal={isOpenEditModal}
          closeModal={closeModal}
          selectedEditId={selectedEditId}
          handleEditClick={handleEditClick}
          setRefreshData={setRefreshData}
        />
      )}
      <div className="flex md:flex-row flex-col md:items-center items-start justify-between gap-4 w-full">
        <div className="flex items-center gap-2">
          <NoFoodOutlinedIcon
            sx={{ fontSize: 25 }}
            className="text-[#00537B]"
          />
          <p className="text-[25px] font-[600] text-[#00537B]">สินค้าหมด</p>
        </div>
      </div>

      <TableMenuStatus
        selectedStatusMenu1={selectedStatusMenu1}
        selectedStatusMenu2={selectedStatusMenu2}
        isOpenEditModal={isOpenEditModal}
        closeModal={closeModal}
        selectedEditId={selectedEditId}
        handleEditClick={handleEditClick}
        refreshData={refreshData}
      />
    </>
  );
}

export default OutStock;
