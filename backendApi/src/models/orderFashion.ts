import { Sequelize, DataTypes } from "sequelize";
import { sequelize } from "../util/database";
import { OrdersProduct } from "./ordersProduct";
import { OrdersAddress } from "./ordersAddress";
import { OrdersPayment } from "./ordersPayment";
import { Store } from "./store";

const OrderFashion = sequelize.define(
  "OrderFashion",
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
    payment_status: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    store_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    totalprice: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    netprice: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    member_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    bill_img: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    isRead: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    isReview: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "order_fashion",
    timestamp: false,
  }
);

OrderFashion.hasOne(OrdersProduct, {
  foreignKey: "order_number",
  sourceKey: "order_number",
});

OrderFashion.hasOne(OrdersAddress, {
  foreignKey: "order_number",
  sourceKey: "order_number",
});

OrderFashion.hasOne(OrdersPayment, {
  foreignKey: "order_number",
  sourceKey: "order_number",
});

OrderFashion.hasOne(Store, {
  foreignKey: "id",
  sourceKey: "store_id",
});

export { OrderFashion };
