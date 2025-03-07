import { Sequelize, DataTypes } from "sequelize"
import { sequelize } from "../util/database"

export const webInfoType = sequelize.define('webInfoType',
{
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    info_type: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    info_title: {
      type: DataTypes.STRING(100),
      allowNull: false,
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
    tableName: 'web_info_types',
    timestamp: true,
})