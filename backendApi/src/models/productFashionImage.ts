import { Sequelize, DataTypes } from "sequelize"
import { sequelize } from "../util/database"

export const ProductFashionImage = sequelize.define('ProductFashionImage',
{
    id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    product_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    path_img: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    hover: {
        type: DataTypes.STRING(10),
        allowNull: false,
    },
    display: {
        type: DataTypes.STRING(10),
        allowNull: false,
    },
    priority: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
}, {
    sequelize,
    tableName: 'product_fashion_image',
    timestamp: false,
})