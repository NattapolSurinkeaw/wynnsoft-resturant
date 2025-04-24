import axios from "axios";
import { useState, useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import moment from "moment";
import { useDispatch } from "react-redux";
import { setUserData } from "../store/userSlice";

const RefreshToken = async (refresh_token) => {
  localStorage.removeItem("accessToken");
  return await axios({
    method: "POST",
    url: `/api/admin/getToken`,
    headers: { "Content-Type": "application/json" },
    data: { token: refresh_token },
  }).then(
    (res) => {
      return res.data.token;
    },
    (error) => {
      return false;
    }
  );
};

const ProtectRoute = () => {
  const isLogin = localStorage.getItem("isLogin");
  const access_token = localStorage.getItem("accessToken");
  const refresh_token = localStorage.getItem("refreshToken");
  const [isFetching, setIsFetching] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!access_token || typeof access_token !== "string") {
      localStorage.clear();
      return;
    }

    let acc;
    try {
      acc = jwtDecode(access_token);
    } catch (error) {
      console.error("JWT decode failed:", error.message);
      localStorage.clear();
      return;
    }

    const userInfo = {
      username: acc.username,
      display_name: acc.display_name,
      token: access_token,
      role: acc.section,
      email: acc.email,
    };
    dispatch(setUserData(userInfo));

    if (access_token && isLogin) {
      if (!isFetching) {
        const checkAccess = setInterval(async () => {
          const now = Math.floor(Date.now() / 1000);
          const expiredTime = acc.exp - now;

          if (expiredTime < 1790 && refresh_token) {
            clearInterval(checkAccess);
            const newToken = await RefreshToken(refresh_token);
            if (newToken) {
              localStorage.setItem("accessToken", newToken);
              setIsFetching(true);
            } else {
              localStorage.clear();
            }
          }
        }, 10000);
      }
      if (isFetching) {
        setIsFetching(false);
      }
    } else {
      localStorage.clear();
    }
  }, [isFetching, isLogin]);

  return isLogin ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectRoute;
