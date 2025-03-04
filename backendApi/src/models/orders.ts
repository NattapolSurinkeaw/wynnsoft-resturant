import { Sequelize, DataTypes } from "sequelize"
import { sequelize } from "../util/database"

export const Orders = sequelize.define('Orders',
{
    id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    order_number: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    payment_status: {
        type: DataTypes.STRING(10),
        allowNull: false
    },
    status: {
        type: DataTypes.STRING(20),
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
    },
    message: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    spacial_image: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
    start_date_image: {
        type: DataTypes.DATE,
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
}, {
    sequelize,
    tableName: 'orders',
    timestamp: false,
})