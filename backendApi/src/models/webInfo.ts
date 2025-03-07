import { Sequelize, DataTypes } from "sequelize"
import { sequelize } from "../util/database"

export const WebInfo = sequelize.define('WebInfo',
{
    info_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    info_type: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    info_param: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    info_title: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    info_value: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    info_link: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    info_iframe: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    info_attribute: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    info_display: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      default: 1
    },
    language: {
      type: DataTypes.STRING(50),
      allowNull: false,
      default: "th"
    },
    defaults: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      default: 1
    },
}, {
    sequelize,
    tableName: 'web_infos',
    timestamp: true,
})