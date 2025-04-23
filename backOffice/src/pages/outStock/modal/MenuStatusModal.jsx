import React, { useState, useEffect } from "react";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import InsertInvitationIcon from "@mui/icons-material/InsertInvitation";
import Swal from "sweetalert2";
import { api_path } from "../../../store/setting";
import { getUpdateNoteOutFood } from "../../../services/kitchen.service";

function MenuStatusModal({
  isOpenEditModal,
  closeModal,
  selectedEditId,
  setRefreshData,
}) {
  const [noteFood, setNoteFood] = useState("");

  useEffect(() => {
    setNoteFood(selectedEditId.note);
  }, [selectedEditId]);

  const onSubmit = () => {
    const params = {
      note: noteFood,
    };

    getUpdateNoteOutFood(selectedEditId.id, params).then((res) => {
      console.log();
      if (res.status) {
        Swal.fire({
          icon: "success",
          title: "แจ้งสินค้าหมด",
          text: "เพิ่มหมายเหตุสินค้าหมดเรียบร้อย",
          timer: 1500,
          showConfirmButton: false,
        }).then(() => {
          closeModal();
          setRefreshData((prev) => prev + 1);
        });
      }
    });
  };

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
              src={api_path + selectedEditId.thumbnail_link}
              alt={selectedEditId.name}
              className="w-22 h-22 object-cover rounded-md shadow-md"
            />
            <p className="text-xl font-[600px]">{selectedEditId.name}</p>
          </div>
          <textarea
            value={noteFood}
            onChange={(e) => setNoteFood(e.target.value)}
            className="w-full min-h-[80px] p-2 mt-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-y"
            placeholder="หมายเหตุ..."
          ></textarea>
          <div className="flex justify-center space-x-3 mt-6">
            <button
              onClick={onSubmit}
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
