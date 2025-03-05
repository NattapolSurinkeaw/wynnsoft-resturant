import { Sequelize, DataTypes } from "sequelize"
import { sequelize } from "../util/database"

export const Language = sequelize.define('Language',
{
    id: {
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
    },
    language: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    title: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    flag: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    defaults: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
}, {
    sequelize,
    tableName: 'language',
    timestamp: true
})