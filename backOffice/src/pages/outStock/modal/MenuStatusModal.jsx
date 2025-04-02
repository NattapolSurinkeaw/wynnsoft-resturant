import React, { useState, useEffect, useRef } from "react";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import InsertInvitationIcon from "@mui/icons-material/InsertInvitation";
import Swal from "sweetalert2";
import { getAllOutFoods } from "../../../services/kitchen.service";
import { api_path } from "../../../store/setting";

function MenuStatusModal({ isOpenEditModal, closeModal, selectedEditId }) {
  const [selectedStatusMenu1, setSelectedStatusMenu1] = useState(null);
  const [showStatusMenu1, setShowStatusMenu1] = useState(false);
  const [filteredOrderData, setFilteredOrderData] = useState(null);
  const [outFoods, setOutFoods] = useState([]);

  console.log("selectedEditId", selectedEditId);
  console.log("isOpenEditModal", isOpenEditModal);
  console.log("outFoods", outFoods);

  const statusMenuRef1 = useRef(null);

  useEffect(() => {
    getAllOutFoods().then((res) => {
      setOutFoods(res.outFoods);
    });
  }, []);

  useEffect(() => {
    if (selectedEditId) {
      const foundData = outFoods.find((item) => item.id === selectedEditId);
      setFilteredOrderData(foundData || null);
    }
  }, [selectedEditId]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        statusMenuRef1.current &&
        !statusMenuRef1.current.contains(event.target)
      ) {
        setShowStatusMenu1(false);
      }
    };

    if (showStatusMenu1) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showStatusMenu1]);

  useEffect(() => {
    if (selectedStatusMenu1 === null) {
      setShowStatusMenu1(false);
    }
  }, [selectedStatusMenu1]);

  if (!isOpenEditModal || !filteredOrderData) return null;

  return (
    isOpenEditModal && (
      <div
        onClick={closeModal}
        className="fixed inset-0 bg-black/60 bg-opacity-50 flex items-center justify-center z-20"
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className="relative bg-white p-4 rounded-lg shadow-lg w-[480px]"
        >
          <button
            onClick={closeModal}
            className="absolute -top-8 -right-8 cursor-pointer"
          >
            <CancelOutlinedIcon
              sx={{ fontSize: 35 }}
              className="text-white hover:text-red-500"
            />
          </button>

          <div className="flex w-full items-center gap-2">
            <InsertInvitationIcon
              sx={{ fontSize: 25 }}
              className="text-[#00537B]"
            />
            <p className="text-[25px] font-[600] text-[#00537B]">
              เพิ่มหมายเหตุ
            </p>
          </div>

          <div className="flex space-x-4 mt-6 mb-2">
            <img
              src={api_path + filteredOrderData.thumbnail_link}
              alt={filteredOrderData.name}
              className="w-22 h-22 object-cover rounded-md shadow-md"
            />
            <p className="text-xl font-[600px]">{filteredOrderData.name}</p>
          </div>
          <textarea
            className="w-full min-h-[80px] p-2 mt-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-y"
            placeholder="หมายเหตุ..."
          >
            {filteredOrderData.note}
          </textarea>
          <div className="flex justify-center space-x-3 mt-6">
            <button
              className="w-[137px] py-1.5 bg-[#013D59] hover:bg-[#004b6e] hover:scale-105 transition duration-300 text-white rounded-lg cursor-pointer shadow-1"
            >
              บันทึก
            </button>
            <button
              onClick={closeModal}
              className="w-[137px] py-1.5 bg-[#F5A100] hover:bg-[#ffa600] hover:scale-105 transition duration-300 text-white rounded-lg cursor-pointer shadow-1"
            >
              ยกเลิก
            </button>
          </div>
        </div>
      </div>
    )
  );
}

export default MenuStatusModal;
