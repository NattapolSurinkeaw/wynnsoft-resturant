import { Sequelize, DataTypes } from "sequelize";
import { sequelize } from "../util/database";
import { ProductFashion } from "./productFashion";

const ProductCategory = sequelize.define(
  "ProductCategory",
  {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    cate_url: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defalutValue: null,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    slug: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    path_img: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    path_img_banner: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    priority: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    display: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    sequelize,
    tableName: "product_category",
    timestamp: false,
  }
);

ProductCategory.hasMany(ProductFashion, {
  foreignKey: "cate_id",
  sourceKey: "id",
});
ProductFashion.belongsTo(ProductCategory, {
  foreignKey: "cate_id",
  targetKey: "id",
});

export { ProductCategory };
