import { Sequelize, DataTypes } from "sequelize"
import { sequelize } from "../util/database"

export const OrdersList = sequelize.define('OrdersList',
{
    id: {
        autoIncrement: true,
        type: DataTypes.BIGINT,
        primaryKey: true
    },
    food_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    orders_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    amount: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    details: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    note: {
      type: DataTypes.STRING(255),
      allowNull: true,
    }
}, {
    sequelize,
    tableName: 'order_list',
    timestamp: true,
})