import { DataTypes } from "sequelize";
import { sequelize } from "../util/database";
import { Table } from "./table";
import { OrdersList } from "./orderList";

export const Orders = sequelize.define(
  "Orders",
  {
    id: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      primaryKey: true,
    },
    order_number: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    table_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "orders",
    timestamps: true, // ✅ เปลี่ยนจาก `timestamp` เป็น `timestamps`
  }
);

// ✅ กำหนดความสัมพันธ์ Orders กับ Table
Orders.belongsTo(Table, { foreignKey: "table_id", as: "table" });

export default Orders;
