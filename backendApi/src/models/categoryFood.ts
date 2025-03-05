import { Sequelize, DataTypes } from "sequelize"
import { sequelize } from "../util/database"

// new
export const CategoryFood = sequelize.define(
  'CategoryFood', 
  {
    id: {
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    thumbnail: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    status_display: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    priority : {
      type: DataTypes.INTEGER,
      allowNull: false,
    }
  }, 
  {
    sequelize,
    tableName: 'category_foods',
    timestamp: false
  }
)