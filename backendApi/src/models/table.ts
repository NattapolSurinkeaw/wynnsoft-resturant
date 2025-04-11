import { Sequelize, DataTypes, BOOLEAN } from "sequelize";
import { sequelize } from "../util/database";

const Table = sequelize.define(
  "Table",
  {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    table_token: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    qrcode: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    title: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      Comment: "'1'=ว่าง,'2'=บริการ,'3'=จอง"
    },
    call_staff: {
      type: DataTypes.INTEGER,
      allowNull: false,
      default: 0
    },
    priority: {
      type: DataTypes.INTEGER,
      allowNull: false,
      default: 1
    },
    display: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      default: true
    }
  },
  {
    sequelize,
    tableName: "tables",
    timestamps: true,
  }
);

export { Table };
