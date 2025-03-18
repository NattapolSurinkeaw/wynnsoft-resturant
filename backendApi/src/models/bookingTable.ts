import { Sequelize, DataTypes } from "sequelize";
import { sequelize } from "../util/database";
import { Table } from "./table";

const BookingTable = sequelize.define(
  "BookingTable",
  {
    id: {
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    name_booking: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    phone_booking: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    email_booking: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    table_booking: {
      type: DataTypes.INTEGER, // ✅ ควรใช้ INTEGER แทน STRING เพื่อเชื่อมกับ Table
      allowNull: false,
      references: {
        model: "tables",
        key: "id",
      },
    },
    date_booking: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    time_booking: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    people: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "booking_tables",
    timestamps: true, // ✅ แก้จาก timestamp เป็น timestamps
  }
);

// ✅ กำหนดความสัมพันธ์ระหว่าง Table และ BookingTable
Table.hasMany(BookingTable, {
  foreignKey: "table_booking",
  as: "bookings", // ตั้งชื่อ relation
});

BookingTable.belongsTo(Table, {
  foreignKey: "table_booking",
  as: "table",
});

export { BookingTable };
