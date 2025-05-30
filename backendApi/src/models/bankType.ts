import { Sequelize, DataTypes } from "sequelize"
import { sequelize } from "../util/database"

export const BankType = sequelize.define('BankType',
{
    id: {
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
    },
    type_title: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    display: {
        type: DataTypes.STRING(10),
        allowNull: false,
    }
}, {
    sequelize,
    tableName: 'bank_type',
    timestamp: false
})