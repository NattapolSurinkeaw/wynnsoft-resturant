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
    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "1=ครบแล้ว, 2=รออาหาร, 3=พร้อมเสิร์ฟ, 4=เรียกพนักงาน, 5=จ่ายแล้ว"
    },
    slip_image: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    pay_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "1=โอนจ่าย, 2=เงินสด"
    }
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
