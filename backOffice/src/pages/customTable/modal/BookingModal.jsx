import React from "react";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import InsertInvitationIcon from "@mui/icons-material/InsertInvitation";

function BookingModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 bg-opacity-50 flex items-center justify-center z-20">
      <div className=" relative bg-white py-8 px-6 rounded-lg shadow-lg w-[380px]">
        <button
          onClick={onClose}
          className=" absolute -top-8 -right-8 cursor-pointer"
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
          <p className="text-[23px] font-[600] text-[#00537B]">
            รายระเอียดการจอง
          </p>
        </div>
        <div className="w-full mt-4 space-y-2 border-3 p-4 border-[#39ACE3]">
          <p className="min-w-[90px] text-[#313131] font-[600]">
            ชื่อผู้จอง : <span className="text-[#313131] font-[400]">Ta</span>
          </p>
          <p className="min-w-[90px] text-[#313131] font-[600]">
            เบอร์ติดต่อ :{" "}
            <span className="text-[#313131] font-[400]">09343762374</span>
          </p>
          <p className="min-w-[90px] text-[#313131] font-[600]">
            E-mail :{" "}
            <span className="text-[#313131] font-[400]">Ta@gmail.com</span>
          </p>
          <p className="min-w-[90px] text-[#313131] font-[600]">
            วันที่ :{" "}
            <span className="text-[#313131] font-[400]">10/01/2558</span>
          </p>
          <p className="min-w-[90px] text-[#313131] font-[600]">
            เวลาจอง :{" "}
            <span className="text-[#313131] font-[400]">12.30 น.</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default BookingModal;
