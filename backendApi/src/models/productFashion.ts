import { Sequelize, DataTypes } from "sequelize";
import { sequelize } from "../util/database";
import { ProductFashionImage } from "./productFashionImage";
import { ProductCategory } from "./productCategory";
import { ReviewFashion } from "./reviewFashion";

const ProductFashion = sequelize.define(
  "ProductFashion",
  {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    product_code: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    cate_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    store_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    product_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    details: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: "",
    },
    defect: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    content: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    price_store: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    gp: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    recommend: {
      type: DataTypes.STRING(10),
      allowNull: false,
      defaultValue: "no",
    },
    status: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    display: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    gender: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
    priority: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "product_fashions",
    timestamp: false,
  }
);

ProductFashion.hasMany(ProductFashionImage, {
  foreignKey: "product_id",
  sourceKey: "id", // primary key
});

ProductFashionImage.belongsTo(ProductFashion, {
  foreignKey: "product_id",
  targetKey: "id", // target key
});

ProductFashion.hasOne(ReviewFashion, {
  foreignKey: "product_id",
  sourceKey: "id", // primary key
})

export { ProductFashion };
