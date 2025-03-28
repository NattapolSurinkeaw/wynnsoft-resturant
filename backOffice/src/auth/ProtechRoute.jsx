import axios from "axios";
import { useState, useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import moment from "moment";

const RefreshToken = async (refresh_token) => {
  localStorage.removeItem("accessToken");
  return await axios({
    method: "POST",
    url: `/api/admin/getToken`,
    headers: { "Content-Type": "application/json" },
    data: { token: refresh_token }
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
  
  useEffect(() => {
    if (access_token && isLogin) {
      if (!isFetching) {
        const checkAccess = setInterval(async () => {
          // console.log(checkAccess)
          if (access_token && refresh_token) {
            const acc = jwtDecode(access_token);
            const expiredTime = acc.exp - moment(Math.floor(Date.now() / 1000));
            if (expiredTime < 1790 && !isFetching) {
              clearInterval(checkAccess);
              await RefreshToken( refresh_token).then((token) => {
                if (token) {
                  setIsFetching(true);
                } else {
                  localStorage.clear();
                }
              })
            }
          } else {
            localStorage.clear();
          }
        }, 10000);
      }
      if (isFetching) {
        setIsFetching(false);
      }
    } else {
      localStorage.clear();
    }
  }, [isFetching, isLogin])
  return isLogin ? <Outlet to="/" /> : <Navigate to="/login" />;
}

export default ProtectRoute;