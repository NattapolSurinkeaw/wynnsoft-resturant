import { Sequelize, DataTypes } from "sequelize"
import { sequelize } from "../util/database"
import OrdersList from "./orderList";

export const Foods = sequelize.define('Foods',
{
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    cate_id: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    special_price: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    best_seller: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    details: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    thumbnail_title: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    thumbnail_link: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status_food: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      default: 1
    },
    note: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    display: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    }
}, {
    sequelize,
    tableName: 'foods',
    timestamps: true,
})

Foods.hasMany(require('./orderList').OrdersList, { foreignKey: 'food_id', as: 'orderList' });

