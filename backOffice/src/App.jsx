import { useState } from "react";
import reactLogo from "./assets/react.svg";
import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import ProtectRoute from "./auth/ProtechRoute";
import LayoutMain from "./pages/layouts/LayoutMain";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import Home from "./Home";
import Control from "./pages/control/Control";
import OrdersDay from "./pages/ordersDay/OrdersDay";
import Payment from "./pages/payment/Payment";
import Served from "./pages/served/Served";
import Orders from "./pages/orders/Orders";
import CustomTable from "./pages/customTable/CustomTable";
import NewLatest from "./pages/newLatest/newLatest";
import MenuStatus from "./pages/menuStatus/MenuStatus";
import OutStock from "./pages/outStock/OutStock";
import FoodMenu from "./pages/foodMenu/FoodMenu";
import OrderHistory from "./pages/orderHistory/OrderHistory";
import Dailyincome from "./pages/dailyincome/Dailyincome";
import Monthlyincome from "./pages/monthlyincome/Monthlyincome";
import TopMenu from "./pages/topMenu/TopMenu";

import CategoryFood from "./pages/categoryfood/CategoryFood";
import Settings from "./pages/settings/Settings";
import ConfirmPassword from "./components/auth/ConfirmPassword";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Routes>
        <Route element={<ProtectRoute />}>
          <Route element={<LayoutMain />}>
            <Route path="/" element={<Home />} />
            <Route path="/control" element={<Control />} />
            <Route path="/ordersDay" element={<OrdersDay />} />
            <Route path="/payment" element={<Payment />} />
            <Route path="/served" element={<Served />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/customTable" element={<CustomTable />} />
            <Route path="/newLatest" element={<NewLatest />} />
            <Route path="/menuStatus" element={<MenuStatus />} />
            <Route path="/outStock" element={<OutStock />} />
            <Route path="/foodMenu" element={<FoodMenu />} />
            <Route path="/orderHistory" element={<OrderHistory />} />
            <Route path="/dailyincome" element={<Dailyincome />} />
            <Route path="/monthlyincome" element={<Monthlyincome />} />
            <Route path="/topMenu" element={<TopMenu />} />

            <Route path="/catefood" element={<CategoryFood />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
        </Route>

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/ConfirmPassword" element={<ConfirmPassword />} />

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </>
  );
}

export default App;
