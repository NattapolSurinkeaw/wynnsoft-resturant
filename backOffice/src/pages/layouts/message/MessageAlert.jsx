import React from "react";
import animationGif from "../../../../public/sound/Animation - 1742356737363.gif";

function MessageAlert({ message, onClose }) {
  return (
    <div
      className="modal fixed top-0 left-0 w-full h-full bg-black/10 bg-opacity-50 flex justify-center items-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white p-6 rounded-lg"
        onClick={(e) => e.stopPropagation()}
      >
        {/* แสดง Animation.gif */}
        <img
          src={animationGif}
          alt="Loading Animation"
          className="w-[100px] h-auto mb-4"
        />
        {/* <h2 className="text-center text-xl">{message}</h2> */}
        {/* <button
          className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg"
          onClick={onClose}
        >
          ปิด
        </button> */}
      </div>
    </div>
  );
}

export default MessageAlert;
