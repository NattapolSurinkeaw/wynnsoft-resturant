import { DataTypes } from "sequelize";
import { sequelize } from "../util/database";
import { Orders } from "./orders";
import { Foods } from './food'; 

export const OrdersList = sequelize.define(
  "OrdersList",
  {
    id: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      primaryKey: true,
    },
    food_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    orders_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    amount: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "1='รับออเดอร์', 2='กำลังทำ', 3='รอเสิร์ฟ', 4='เสิร์ฟเรียบร้อย', 5='ยกเลิก', 6='สินค้าหมด'",
    },
    note: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: "order_list",
    timestamps: true, // ✅ เปลี่ยนจาก `timestamp` เป็น `timestamps`
  }
);

// ✅ กำหนดความสัมพันธ์ OrdersList กับ Orders
OrdersList.belongsTo(Orders, { foreignKey: "orders_id", as: "order" });
Orders.hasMany(OrdersList, { foreignKey: "orders_id", as: "orderList" });
OrdersList.belongsTo(Foods, { foreignKey: "food_id", as: "food" }) // เพิ่มการเชื่อมกับ Foods

export default OrdersList;
