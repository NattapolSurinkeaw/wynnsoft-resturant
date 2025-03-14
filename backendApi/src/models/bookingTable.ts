import { Sequelize, DataTypes } from "sequelize"
import { sequelize } from "../util/database"

export const BookingTable = sequelize.define('BookingTable',
{
    id: {
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    name_booking: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    phone_booking: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    email_booking: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    table_booking: {
      type: DataTypes.STRING(560),
      allowNull: false,
    },
    date_booking: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    time_booking: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    people: {
      type: DataTypes.INTEGER,
      allowNull: false,
    }
  }, {
    sequelize,
    tableName: 'booking_tables',
    timestamp: true
  }
)