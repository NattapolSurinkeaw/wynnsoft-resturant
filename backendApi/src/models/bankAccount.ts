import { Sequelize, DataTypes } from "sequelize";
import { sequelize } from "../util/database";
import { BankProvider } from "./bankProvider";

const BankAccount = sequelize.define(
  "BankAccount",
  {
    id: {
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    bank_number: {
      type: DataTypes.STRING(40),
      allowNull: false,
    },
    bank_provider: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    bank_img: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    qrcode: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    // bank_provider_id: {
    //   type: DataTypes.INTEGER,
    //   allowNull: false,
    // },
    // bank_type_id: {
    //   type: DataTypes.INTEGER,
    //   allowNull: false,
    // },
    status: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "bank_account",
    timestamp: false,
  }
);

// BankAccount.hasOne(BankProvider, {
//   foreignKey: "id",
//   sourceKey: "bank_provider_id",
// });

export { BankAccount };
