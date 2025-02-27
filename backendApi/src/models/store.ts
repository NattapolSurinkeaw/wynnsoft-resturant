import { Sequelize, DataTypes } from "sequelize";
import { sequelize } from "../util/database";
import { ProductFashion } from "./productFashion";
import { Post } from "./post";

const Store = sequelize.define(
  "Store",
  {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    store_code: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    access_token: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    refresh_token: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    profile_img: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    profile_video: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    concept: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    age: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    weight: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    height: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    bwh: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    gender: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
    note: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    freefield: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    latest_update: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: "store",
    timestamp: false,
  }
);

Store.hasMany(ProductFashion, {
  foreignKey: "store_id",
  targetKey: "id",
});

Store.hasMany(Post, {
  foreignKey: "store_id",
  targetKey: "id",
});

ProductFashion.belongsTo(Store, {
  foreignKey: "store_id",
  targetKey: "id",
});

Post.belongsTo(Store, {
  foreignKey: "store_id",
  targetKey: "id",
});

export { Store };
