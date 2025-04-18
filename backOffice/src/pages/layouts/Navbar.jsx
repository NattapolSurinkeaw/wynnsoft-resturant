import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import Badge from "@mui/material/Badge";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import Message from "./message/Message";
import MessageAlert from "./message/MessageAlert";
import alertSound from "../../../public/sound/order3.mp3";
import { MessageOrderData } from "../../components/mockData/MessageData/MessageData";
import { MessageCallData } from "../../components/mockData/MessageData/MessageData";
import { useSelector } from "react-redux";

function Navbar({ isSidebarOpen, setIsSidebarOpen }) {
  const [hasNotification, setHasNotification] = useState(false);
  const [isImageVisible, setIsImageVisible] = useState(false);
  const [modalMessageAlert, setModalMessageAlert] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const userData = useSelector((state) => state.user);

  console.log(userData);

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
    if (
      MessageOrderData.some((order) => order.status === "2") ||
      MessageCallData.length > 0
    ) {
      setHasNotification(true);
    } else {
      setHasNotification(false);
    }
  }, [MessageOrderData, MessageCallData]);

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
      document.body.focus();

      if (soundEnabled) {
        const audio = new Audio(alertSound);
        audio.volume = Math.min(Math.max(volume, 0), 1);
        audio.play().catch((error) => {
          console.error("เสียงถูกบล็อกโดยเบราว์เซอร์:", error);
        });
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

          <div
            className="relative group "
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <div className="flex w-[110px] h-[35px] gap-2 items-center rounded-full p-1 bg-[#00537B] shadow-1 cursor-pointer">
              <AccountCircleIcon sx={{ fontSize: 29 }} className="text-white" />
              <p className="text-[14px] text-white ml-2 uppercase">{userData.role}</p>
            </div>

            <div
              className={`absolute -left-[3.6rem] top-10 flex flex-col w-[168px] justify-between bg-white shadow-lg rounded-md cursor-pointer transition-all duration-300 ${
                isHovered
                  ? "opacity-100 translate-y-0 visible"
                  : "opacity-0 -translate-y-3 invisible"
              }`}
            >
              <div className="flex gap-4 px-4 pt-2">
                <div className="flex w-[45px] h-[45px] items-center justify-center rounded-full bg-[#00537B] shadow-md">
                  <AccountCircleIcon
                    sx={{
                      fontSize: 40,
                      transition: "transform 0.3s ease-in-out",
                      transform: isHovered ? "rotate(0deg)" : "rotate(-90deg)",
                    }}
                    className="text-white"
                  />
                </div>
                <div>
                  <p className="text-green-500 text-[12px] font-[600]">
                    {userData.display_name}
                  </p>
                  <p className="text-gray-400 text-[11px] font-[400]">
                  {userData.email}
                  </p>
                </div>
              </div>
              <button
                onClick={logOut}
                className="w-full bg-[#e71a68] hover:bg-[#0dcf2d] cursor-pointer mt-2"
              >
                <div className="flex items-center justify-center gap-2 text-white text-[12px] font-[400] p-1">
                  <LogoutIcon sx={{ fontSize: 18 }} className="text-white" />
                  ออกจากระบบ
                </div>
              </button>
            </div>
          </div>

          <Link to="/settings">
            <img
              className="w-[24px] h-auto cursor-pointer hover:rotate-90 transition duration-400"
              src="/icons/Vector (1).png"
              alt=""
            />
          </Link>
        </div>
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
        setHasNotification={setHasNotification}
      />
    </>
  );
}

export default Navbar;
