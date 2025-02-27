import { Sequelize, DataTypes, Model } from "sequelize"
import { sequelize } from "../util/database"

export const ViewProductAllStore = sequelize.define('view_product_all_store',
{
    id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    product_code: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    name_member: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    content_member: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    name_premium: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    content_premium: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    price_standard: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    price_premium: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    recommend: {
        type: DataTypes.STRING(10),
        allowNull: false
    },
    pre_order: {
        type: DataTypes.STRING(10),
        allowNull: false
    },
    status: {
        type: DataTypes.STRING(20),
        allowNull: false
    },
    sex: {
        type: DataTypes.STRING(20),
        allowNull: false
    },
    clip: {
        type: DataTypes.STRING(10),
        allowNull: false
    },
    hasImage: {
        type: DataTypes.BOOLEAN(),
        allowNull: false,
    },
    store_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    store_name: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    store_profile: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    store_concept: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    store_code: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    product_img: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    // totalProduct: {
    //     type: DataTypes.INTEGER
    // },
    lastUpdate: {
        type: DataTypes.DATE
    }
},
{
    sequelize,
    tableName: 'view_product_all_store',
    timestamp: false,
})