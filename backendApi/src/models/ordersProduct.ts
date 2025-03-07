import { Sequelize, DataTypes } from "sequelize";
import { sequelize } from "../util/database";
import { ProductFashion } from "./productFashion";

const OrdersProduct = sequelize.define(
  "OrdersProduct",
  {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    order_number: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    product_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    product_content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    gross_profit: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    note_cancel: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: "",
    },
    status: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "orders_product",
    timestamp: false,
  }
);

OrdersProduct.hasOne(ProductFashion, {
  foreignKey: "id",
  sourceKey: "product_id",
});

export { OrdersProduct };
