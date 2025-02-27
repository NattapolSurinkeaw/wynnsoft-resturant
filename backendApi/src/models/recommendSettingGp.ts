import { Sequelize, DataTypes } from "sequelize"
import { sequelize } from "../util/database"

export const RecommendSettingGp = sequelize.define('RecommendSettingGp',
{
    id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    priority: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    value: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    sequelize,
    tableName: 'recommend_setting_gp',
    timestamp: false,
})