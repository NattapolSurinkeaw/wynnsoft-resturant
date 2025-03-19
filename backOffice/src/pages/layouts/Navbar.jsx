import React, { useState, useEffect } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import Badge from "@mui/material/Badge";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import Message from "./message/Message";
import MessageAlert from "./message/MessageAlert";
import alertSound from "../../../public/sound/incoming.mp3";
import { MessageOrderData } from "../../components/mockData/MessageData/MessageData";
import { MessageCallData } from "../../components/mockData/MessageData/MessageData";

function Navbar({ isSidebarOpen, setIsSidebarOpen }) {
  const [hasNotification, setHasNotification] = useState(true);
  const [isImageVisible, setIsImageVisible] = useState(false);
  const [modalMessageAlert, setModalMessageAlert] = useState(false);

  const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(() => {
    return JSON.parse(localStorage.getItem("notificationsEnabled")) ?? true;
  });

  const [isSoundEnabled, setIsSoundEnabled] = useState(() => {
    return JSON.parse(localStorage.getItem("soundEnabled")) ?? true;
  });

  const [volume, setVolume] = useState(() => {
    return Number(localStorage.getItem("volume")) ?? 50;
  });

  useEffect(() => {
    localStorage.setItem(
      "notificationsEnabled",
      JSON.stringify(isNotificationsEnabled)
    );
  }, [isNotificationsEnabled]);

  useEffect(() => {
    localStorage.setItem("soundEnabled", JSON.stringify(isSoundEnabled));
  }, [isSoundEnabled]);

  useEffect(() => {
    localStorage.setItem("volume", volume.toString());
  }, [volume]);

  const handleNotificationChange = (event) => {
    setIsNotificationsEnabled(event.target.checked);
  };

  const handleSoundChange = (event) => {
    setIsSoundEnabled(event.target.checked);
  };

  const handleVolumeChange = (event, newValue) => {
    setVolume(newValue);
  };

  const handleModalClose = () => {
    setModalMessageAlert(false);
  };

  useEffect(() => {
    const notificationsEnabled =
      localStorage.getItem("notificationsEnabled") === "true";
    const soundEnabled = localStorage.getItem("soundEnabled") === "true";
    const volume = parseFloat(localStorage.getItem("volume")) || 1.0;

    if (!notificationsEnabled) {
      setModalMessageAlert(false);
      return;
    }

    const hasAlert =
      MessageOrderData.some((order) => order.status === "2") ||
      MessageCallData.length > 0;

    if (hasAlert) {
      setModalMessageAlert(true);

      if (soundEnabled) {
        const audio = new Audio(alertSound);
        audio.volume = Math.min(Math.max(volume, 0), 1);
        audio.play();
      }

      const timeoutId = setTimeout(() => {
        setModalMessageAlert(false);
      }, 3000);

      return () => {
        clearTimeout(timeoutId);
      };
    }
  }, [MessageOrderData, MessageCallData]);

  const logOut = () => {
    localStorage.clear();
    location.reload();
  };

  return (
    <>
      {modalMessageAlert && (
        <MessageAlert message="Hello world" onClose={handleModalClose} />
      )}
      <div className="flex items-center justify-between xl:justify-end w-full h-[60px] bg-white shadow-2 py-4 xl:px-6 px-4 ">
        <div className="xl:hidden z-90">
          {isSidebarOpen ? (
            <MenuOpenIcon
              sx={{ fontSize: 35 }}
              className="text-[#00537B] cursor-pointer"
              onClick={() => setIsSidebarOpen(false)}
            />
          ) : (
            <MenuIcon
              sx={{ fontSize: 35 }}
              className="text-[#00537B] cursor-pointer"
              onClick={() => setIsSidebarOpen(true)}
            />
          )}
        </div>

        <div className="flex gap-5 items-center z-10">
          <div
            className="border border-gray-300/50 shadow-sm rounded-full cursor-pointer "
            onClick={() => setIsImageVisible(!isImageVisible)}
          >
            <Badge color="error" variant="dot" invisible={!hasNotification}>
              <NotificationsNoneOutlinedIcon
                sx={{ fontSize: 30 }}
                className="text-[#00537B] hover:text-[#F5A100]"
              />
            </Badge>
          </div>

          <div className="flex w-[110px] h-[35px] gap-2 items-center rounded-full p-1 bg-[#00537B] shadow-1 cursor-pointer">
            <figure className="bg-white shadow-md p-0.5 rounded-full">
              <img
                className="w-[23px] h-auto"
                src="/icons/material-symbols_person.png"
                alt=""
              />
            </figure>
            <p className="text-[14px] text-white ml-2">ADMIN</p>
          </div>

          <img
            className="w-[24px] h-auto cursor-pointer"
            src="/icons/Vector (1).png"
            alt=""
          />
        </div>
        {/* 
        <button onClick={logOut} className="cursor-pointer border z-10">
          Logout
        </button> */}
      </div>
      <Message
        isImageVisible={isImageVisible}
        setIsImageVisible={setIsImageVisible}
        handleNotificationChange={handleNotificationChange}
        handleSoundChange={handleSoundChange}
        handleVolumeChange={handleVolumeChange}
        isNotificationsEnabled={isNotificationsEnabled}
        isSoundEnabled={isSoundEnabled}
        volume={volume}
      />
    </>
  );
}

export default Navbar;
